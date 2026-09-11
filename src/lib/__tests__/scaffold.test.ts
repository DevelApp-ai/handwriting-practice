import { describe, it, expect } from 'vitest'
import {
  computeLandmarks,
  strokePivots,
  strokeLandmarks,
  landmarkDotCount,
  DEFAULT_PIVOT_OPTIONS,
} from '@/lib/scaffold'
import { generateBasicStrokeOrder } from '@/lib/strokeOrder'

describe('strokePivots', () => {
  it('returns no pivots for a straight line', () => {
    const pts = [
      { x: 0, y: 0 },
      { x: 0.5, y: 0.5 },
      { x: 1, y: 1 },
    ]
    expect(strokePivots(pts)).toEqual([])
  })

  it('detects a sharp corner as a pivot', () => {
    const pts = [
      { x: 0, y: 0 },
      { x: 0.5, y: 0.1 },
      { x: 0.5, y: 0.9 },
    ]
    expect(strokePivots(pts)).toEqual([1])
  })

  it('ignores tiny segments below minSegmentLen', () => {
    const pts = [
      { x: 0.5, y: 0.5 },
      { x: 0.501, y: 0.501 },
      { x: 1, y: 0 },
    ]
    expect(strokePivots(pts)).toEqual([])
  })

  it('returns empty for fewer than 3 points', () => {
    expect(strokePivots([{ x: 0, y: 0 }])).toEqual([])
    expect(strokePivots([{ x: 0, y: 0 }, { x: 1, y: 1 }])).toEqual([])
  })
})

describe('strokeLandmarks', () => {
  it('always emits a start landmark', () => {
    const pts = [{ x: 0.3, y: 0.3 }, { x: 0.7, y: 0.7 }]
    const lm = strokeLandmarks(pts, 0)
    expect(lm).toHaveLength(1)
    expect(lm[0].kind).toBe('start')
    expect(lm[0].x).toBe(0.3)
  })

  it('returns empty for an empty stroke', () => {
    expect(strokeLandmarks([], 0)).toEqual([])
  })
})

describe('computeLandmarks', () => {
  it('returns one start dot per stroke for a single-stroke glyph', () => {
    const lm = computeLandmarks('C')
    const starts = lm.filter((l) => l.kind === 'start')
    expect(starts.length).toBeGreaterThanOrEqual(1)
  })

  it('landmarkDotCount equals number of strokes for a multi-stroke glyph', () => {
    const strokes = generateBasicStrokeOrder('A').strokes
    if (strokes.length > 0) {
      expect(landmarkDotCount('A')).toBe(strokes.length)
    }
  })

  it('returns empty for a multi-char string with no templates', () => {
    expect(computeLandmarks('hello world')).toEqual([])
  })
})

describe('DEFAULT_PIVOT_OPTIONS', () => {
  it('has sensible defaults', () => {
    expect(DEFAULT_PIVOT_OPTIONS.minCurvatureRad).toBeGreaterThan(0)
    expect(DEFAULT_PIVOT_OPTIONS.minSegmentLen).toBeGreaterThan(0)
  })
})
