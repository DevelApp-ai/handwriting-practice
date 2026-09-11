export interface AudioParamLike {
  value: number
  setValueAtTime?: (value: number, time: number) => void
  linearRampToValueAtTime?: (value: number, time: number) => void
}

export interface AudioNodeLike {
  connect: (destination: AudioNodeLike) => AudioNodeLike
  disconnect?: () => void
  frequency?: AudioParamLike
  gain?: AudioParamLike
  Q?: AudioParamLike
  start?: (when?: number) => void
  stop?: (when?: number) => void
  buffer?: AudioBufferLike
  loop?: boolean
}

export interface AudioBufferLike {
  numberOfChannels: number
  length: number
  sampleRate: number
  getChannelData: (channel: number) => Float32Array
}

export interface AudioContextLike {
  sampleRate: number
  currentTime: number
  destination: AudioNodeLike
  createBuffer: (channels: number, length: number, sampleRate: number) => AudioBufferLike
  createBufferSource: () => AudioNodeLike
  createBiquadFilter: () => AudioNodeLike
  createGain: () => AudioNodeLike
}

const NOISE_DURATION_S = 2
const MIN_GAIN = 0.0
const MAX_GAIN = 0.18
const MIN_FREQ = 700
const MAX_FREQ = 3200

function clamp(v: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, v))
}

export function velocityToGain(velocity: number): number {
  const v = clamp(velocity, 0, 1)
  return MIN_GAIN + (MAX_GAIN - MIN_GAIN) * v
}

export function velocityToBandpassFreq(velocity: number, pressure: number): number {
  const v = clamp(velocity, 0, 1)
  const p = clamp(pressure, 0, 1)
  const base = MIN_FREQ + (MAX_FREQ - MIN_FREQ) * v
  return base * (0.7 + 0.6 * p)
}

export class PencilFrictionSynth {
  private ctx: AudioContextLike
  private source: AudioNodeLike | null = null
  private filter: AudioNodeLike | null = null
  private gain: AudioNodeLike | null = null
  private running = false
  private noiseBuffer: AudioBufferLike | null = null

  constructor(ctx: AudioContextLike) {
    this.ctx = ctx
    this.noiseBuffer = this.buildNoiseBuffer()
  }

  private buildNoiseBuffer(): AudioBufferLike {
    const length = Math.floor(this.ctx.sampleRate * NOISE_DURATION_S)
    const buffer = this.ctx.createBuffer(1, length, this.ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < length; i++) {
      data[i] = Math.random() * 2 - 1
    }
    return buffer
  }

  isRunning(): boolean {
    return this.running
  }

  start(): void {
    if (this.running) return
    const buffer = this.noiseBuffer ?? this.buildNoiseBuffer()
    const source = this.ctx.createBufferSource()
    source.buffer = buffer
    const filter = this.ctx.createBiquadFilter()
    const gain = this.ctx.createGain()

    if (filter.frequency) filter.frequency.value = 1500
    if (filter.Q) filter.Q.value = 0.8
    if (gain.gain) gain.gain.value = 0

    source.connect(filter)
    filter.connect(gain)
    gain.connect(this.ctx.destination)

    if (source.start) source.start(0)
    source.loop = true

    this.source = source
    this.filter = filter
    this.gain = gain
    this.running = true
  }

  update(velocity: number, pressure: number = 0.5): void {
    if (!this.running || !this.gain || !this.filter) return
    const g = velocityToGain(velocity)
    const freq = velocityToBandpassFreq(velocity, pressure)
    if (this.gain.gain) {
      if (this.gain.gain.linearRampToValueAtTime) {
        this.gain.gain.linearRampToValueAtTime(g, this.ctx.currentTime + 0.05)
      } else {
        this.gain.gain.value = g
      }
    }
    if (this.filter.frequency) {
      this.filter.frequency.value = freq
    }
  }

  stop(): void {
    if (!this.running) return
    if (this.gain?.gain) {
      if (this.gain.gain.linearRampToValueAtTime) {
        this.gain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.08)
      } else {
        this.gain.gain.value = 0
      }
    }
    if (this.source?.stop) this.source.stop(this.ctx.currentTime + 0.1)
    if (this.gain?.disconnect) this.gain.disconnect()
    if (this.filter?.disconnect) this.filter.disconnect()
    if (this.source?.disconnect) this.source.disconnect()
    this.source = null
    this.filter = null
    this.gain = null
    this.running = false
  }

  getGainValue(): number {
    return this.gain?.gain?.value ?? 0
  }

  getFrequencyValue(): number {
    return this.filter?.frequency?.value ?? 0
  }
}

export function computeVelocity(prev: TimedPointLike, cur: TimedPointLike): number {
  const dx = cur.x - prev.x
  const dy = cur.y - prev.y
  const dt = Math.max(1, cur.t - prev.t)
  const speed = Math.sqrt(dx * dx + dy * dy) / dt
  return clamp(speed / 2, 0, 1)
}

interface TimedPointLike {
  x: number
  y: number
  t: number
}
