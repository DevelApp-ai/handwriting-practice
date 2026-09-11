import { describe, it, expect } from 'vitest'
import {
  resample,
  normalizeToUnit,
  dtw,
  frechet,
  procrustes,
  dollarRecognize,
  evaluate,
  starsFromOverall,
  buildTemplatePaths,
  StrokeReport,
} from '../strokeEval'
import { TimedPoint } from '../types'

function mkStroke(pts: Array<[number, number]>): TimedPoint[] {
  return pts.map(([x, y]) => ({ x, y, t: 0, pressure: 0, tiltX: 0, tiltY: 0, twist: 0, pointerType: 'pen' }))
}

describe('resample', () => {
  it('returns N points for a short input', () => {
    const r = resample([{ x: 0, y: 0 }, { x: 1, y: 1 }], 32)
    expect(r.length).toBe(32)
    expect(r[0]).toEqual({ x: 0, y: 0 })
    expect(r[31].x).toBeCloseTo(1)
  })
  it('handles a single point', () => {
    const r = resample([{ x: 5, y: 5 }], 16)
    expect(r.length).toBe(16)
    expect(r.every((p) => p.x === 5 && p.y === 5)).toBe(true)
  })
  it('handles empty input', () => {
    expect(resample([], 8)).toEqual([])
  })
})

describe('normalizeToUnit', () => {
  it('scales points to fit in [0,1] centered on 0.5', () => {
    const r = normalizeToUnit([{ x: 0, y: 0 }, { x: 10, y: 0 }, { x: 5, y: 5 }])
    for (const p of r) {
      expect(p.x).toBeGreaterThanOrEqual(0)
      expect(p.x).toBeLessThanOrEqual(1)
      expect(p.y).toBeGreaterThanOrEqual(0)
      expect(p.y).toBeLessThanOrEqual(1)
    }
  })
  it('is translation invariant', () => {
    const a = normalizeToUnit([{ x: 0, y: 0 }, { x: 2, y: 0 }])
    const b = normalizeToUnit([{ x: 100, y: 0 }, { x: 102, y: 0 }])
    expect(a[0].x).toBeCloseTo(b[0].x, 5)
    expect(a[1].x).toBeCloseTo(b[1].x, 5)
  })
})

describe('dtw', () => {
  it('is zero for identical sequences', () => {
    const p = [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }]
    expect(dtw(p, p)).toBeCloseTo(0, 6)
  })
  it('is larger for different sequences', () => {
    const a = [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }]
    const b = [{ x: 0, y: 5 }, { x: 1, y: 5 }, { x: 2, y: 5 }]
    expect(dtw(a, b)).toBeGreaterThan(0)
  })
  it('returns Infinity for empty input', () => {
    expect(dtw([], [{ x: 0, y: 0 }])).toBe(Infinity)
  })
})

describe('frechet', () => {
  it('is zero for identical curves', () => {
    const p = [{ x: 0, y: 0 }, { x: 1, y: 1 }, { x: 2, y: 0 }]
    expect(frechet(p, p)).toBeCloseTo(0, 6)
  })
  it('is positive for diverging curves', () => {
    const a = [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }]
    const b = [{ x: 0, y: 0 }, { x: 1, y: 3 }, { x: 2, y: 0 }]
    expect(frechet(a, b)).toBeGreaterThan(0)
  })
})

describe('procrustes', () => {
  it('aligns two same-shape curves of different scale/position', () => {
    const a = [{ x: 0, y: 0 }, { x: 4, y: 0 }, { x: 4, y: 4 }]
    const b = [{ x: 100, y: 100 }, { x: 200, y: 100 }, { x: 200, y: 200 }]
    const r = procrustes(a, b)
    for (let i = 0; i < r.a.length; i++) {
      expect(r.a[i].x).toBeCloseTo(r.b[i].x, 4)
      expect(r.a[i].y).toBeCloseTo(r.b[i].y, 4)
    }
  })
})

describe('dollarRecognize', () => {
  it('picks the closest matching template', () => {
    const templates = [
      [{ x: 0, y: 0 }, { x: 1, y: 0 }],
      [{ x: 0, y: 0 }, { x: 0, y: 1 }],
    ]
    const candidate = [{ x: 0, y: 0 }, { x: 0.9, y: 0.05 }]
    const res = dollarRecognize(candidate, templates)
    expect(res.bestIndex).toBe(0)
  })
})

describe('buildTemplatePaths', () => {
  it('returns polyline templates for a known letter', () => {
    const paths = buildTemplatePaths('A')
    expect(paths.length).toBeGreaterThan(0)
    expect(paths[0].length).toBeGreaterThan(0)
    for (const p of paths.flat()) {
      expect(p.x).toBeGreaterThanOrEqual(0)
      expect(p.x).toBeLessThanOrEqual(1)
      expect(p.y).toBeGreaterThanOrEqual(0)
      expect(p.y).toBeLessThanOrEqual(1)
    }
  })
  it('returns empty for words', () => {
    expect(buildTemplatePaths('hello').length).toBe(0)
  })
})

describe('evaluate', () => {
  it('returns zero report for empty candidate', () => {
    const report = evaluate([], 'A')
    expect(report.overall).toBe(0)
    expect(report.perStroke).toEqual([])
  })

  it('scores a template-shaped candidate higher than a random scribble', () => {
    const tpl = buildTemplatePaths('A')
    expect(tpl.length).toBeGreaterThan(0)
    const good: TimedPoint[][] = tpl.map((stroke) =>
      stroke.map((p) => mkStroke([[p.x * 200, p.y * 200]]).pop()!).flat(),
    )
    const goodCandidate = tpl.map((stroke) =>
      stroke.map((p) => ({ x: p.x * 200, y: p.y * 200, t: 0, pressure: 0, tiltX: 0, tiltY: 0, twist: 0, pointerType: 'pen' as const })),
    )
    const bad: TimedPoint[][] = [
      mkStroke([[10, 10], [190, 190], [10, 190], [190, 10]]),
    ]
    const goodReport = evaluate(goodCandidate, 'A')
    const badReport = evaluate(bad, 'A')
    expect(goodReport.overall).toBeGreaterThan(badReport.overall)
  })

  it('flags reversed direction as a fault', () => {
    const tpl = buildTemplatePaths('L')
    expect(tpl.length).toBeGreaterThanOrEqual(1)
    const reversed = tpl.map((stroke) =>
      [...stroke].reverse().map((p) => ({ x: p.x * 200, y: p.y * 200, t: 0, pressure: 0, tiltX: 0, tiltY: 0, twist: 0, pointerType: 'pen' as const })),
    )
    const report = evaluate(reversed, 'L')
    expect(report.direction).toBeLessThan(0.6)
    const hasRedOrAmber = report.perStroke.some((s) => s.kind === 'red' || s.kind === 'amber')
    expect(hasRedOrAmber).toBe(true)
  })

  it('returns a well-formed report', () => {
    const tpl = buildTemplatePaths('T')
    const candidate = tpl.map((stroke) =>
      stroke.map((p) => ({ x: p.x * 200, y: p.y * 200, t: 0, pressure: 0, tiltX: 0, tiltY: 0, twist: 0, pointerType: 'pen' as const })),
    )
    const report = evaluate(candidate, 'T')
    const keys: (keyof StrokeReport)[] = ['trajectory', 'direction', 'strokeOrder', 'slant', 'xHeightRatio', 'smoothness', 'overall']
    for (const k of keys) {
      expect(typeof report[k]).toBe('number')
      expect(report[k]).toBeGreaterThanOrEqual(0)
      expect(report[k]).toBeLessThanOrEqual(100)
    }
    expect(report.perStroke.length).toBe(candidate.length)
  })

  it('handles characters with no template (words) gracefully', () => {
    const report = evaluate([mkStroke([[10, 10], [20, 20]])], 'hello')
    expect(report.overall).toBe(0)
    expect(report.perStroke).toEqual([])
  })
})

describe('starsFromOverall', () => {
  it('maps thresholds to 1/2/3 stars', () => {
    expect(starsFromOverall(90)).toBe(3)
    expect(starsFromOverall(85)).toBe(3)
    expect(starsFromOverall(70)).toBe(2)
    expect(starsFromOverall(60)).toBe(2)
    expect(starsFromOverall(59)).toBe(1)
    expect(starsFromOverall(0)).toBe(1)
  })
})
