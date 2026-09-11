import { describe, it, expect } from 'vitest'
import {
  PencilFrictionSynth,
  velocityToGain,
  velocityToBandpassFreq,
  computeVelocity,
  AudioContextLike,
  AudioNodeLike,
  AudioBufferLike,
} from '@/lib/audio'

function makeMockNode(over: Partial<AudioNodeLike> = {}): AudioNodeLike {
  return {
    connect: (dest: AudioNodeLike) => dest,
    disconnect: () => {},
    ...over,
  } as AudioNodeLike
}

function makeMockContext(): AudioContextLike {
  let t = 0
  return {
    sampleRate: 44100,
    currentTime: 0,
    destination: makeMockNode(),
    createBuffer: (channels: number, length: number, sampleRate: number) => {
      const store = new Float32Array(length)
      return {
        numberOfChannels: channels,
        length,
        sampleRate,
        getChannelData: () => store,
      } as AudioBufferLike
    },
    createBufferSource: () =>
      makeMockNode({
        start: () => {},
        stop: () => {},
      }),
    createBiquadFilter: () =>
      makeMockNode({ frequency: { value: 1500 }, Q: { value: 0.8 } }),
    createGain: () => makeMockNode({ gain: { value: 0 } }),
  } as AudioContextLike
}

describe('velocityToGain', () => {
  it('maps 0 velocity to min gain and 1 to max gain', () => {
    expect(velocityToGain(0)).toBe(0)
    expect(velocityToGain(1)).toBeGreaterThan(0)
  })

  it('clamps velocity to [0,1]', () => {
    expect(velocityToGain(-5)).toBe(velocityToGain(0))
    expect(velocityToGain(99)).toBe(velocityToGain(1))
  })
})

describe('velocityToBandpassFreq', () => {
  it('increases with velocity and pressure', () => {
    expect(velocityToBandpassFreq(0.5, 0.5)).toBeGreaterThan(velocityToBandpassFreq(0, 0))
    expect(velocityToBandpassFreq(0.8, 1)).toBeGreaterThan(velocityToBandpassFreq(0.8, 0))
  })
})

describe('computeVelocity', () => {
  it('computes normalized speed between timed points', () => {
    const v = computeVelocity({ x: 0, y: 0, t: 0 }, { x: 100, y: 0, t: 100 })
    expect(v).toBeGreaterThan(0)
    expect(v).toBeLessThanOrEqual(1)
  })

  it('returns 0 for stationary points', () => {
    expect(computeVelocity({ x: 5, y: 5, t: 0 }, { x: 5, y: 5, t: 10 })).toBe(0)
  })
})

describe('PencilFrictionSynth', () => {
  it('starts and stops the noise source', () => {
    const ctx = makeMockContext()
    const synth = new PencilFrictionSynth(ctx)
    expect(synth.isRunning()).toBe(false)
    synth.start()
    expect(synth.isRunning()).toBe(true)
    synth.stop()
    expect(synth.isRunning()).toBe(false)
  })

  it('does not double-start', () => {
    const ctx = makeMockContext()
    const synth = new PencilFrictionSynth(ctx)
    synth.start()
    const gainBefore = synth.getGainValue()
    synth.start()
    expect(synth.isRunning()).toBe(true)
    synth.stop()
  })

  it('gain tracks a synthetic velocity ramp', () => {
    const ctx = makeMockContext()
    const synth = new PencilFrictionSynth(ctx)
    synth.start()
    const gains: number[] = []
    const velocities = [0.1, 0.4, 0.7, 1.0, 0.5, 0.1]
    for (const v of velocities) {
      synth.update(v, 0.5)
      gains.push(synth.getGainValue())
    }
    expect(gains).toHaveLength(velocities.length)
    expect(gains[0]).toBeLessThan(gains[3])
    expect(gains[3]).toBeCloseTo(velocityToGain(1.0), 5)
    expect(gains[5]).toBeCloseTo(velocityToGain(0.1), 5)
    synth.stop()
  })

  it('frequency tracks velocity and pressure', () => {
    const ctx = makeMockContext()
    const synth = new PencilFrictionSynth(ctx)
    synth.start()
    synth.update(0.2, 0.3)
    const lowFreq = synth.getFrequencyValue()
    synth.update(0.9, 0.9)
    const highFreq = synth.getFrequencyValue()
    expect(highFreq).toBeGreaterThan(lowFreq)
    synth.stop()
  })

  it('ignores update when not running', () => {
    const ctx = makeMockContext()
    const synth = new PencilFrictionSynth(ctx)
    synth.update(1, 1)
    expect(synth.getGainValue()).toBe(0)
  })

  it('stop is a no-op when not running', () => {
    const ctx = makeMockContext()
    const synth = new PencilFrictionSynth(ctx)
    expect(() => synth.stop()).not.toThrow()
    expect(synth.isRunning()).toBe(false)
  })
})
