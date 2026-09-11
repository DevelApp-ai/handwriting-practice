import { describe, it, expect } from 'vitest'
import {
  scheduleReview,
  applyReviewToProgress,
  isDueForReview,
  getDueCharacters,
  qualityScore,
  toSrsRecord,
  DEFAULT_EASE_FACTOR,
  MIN_EASE_FACTOR,
  MIN_INTERVAL_MS,
  msToHours,
  ReviewQuality,
  SrsRecord,
} from '@/lib/srs'
import { Progress } from '@/lib/types'

const NOW = 1_700_000_000_000

function baseRecord(reviewCount = 0): SrsRecord {
  return {
    nextReview: 0,
    easeFactor: DEFAULT_EASE_FACTOR,
    pausePenalty: 0,
    reviewCount,
  }
}

function baseProgress(over: Partial<Progress> = {}): Progress {
  return {
    characterId: 'A',
    stars: 2,
    completed: true,
    attempts: 1,
    lastPracticed: NOW,
    ...over,
  }
}

describe('qualityScore', () => {
  it('maps overall 0-100 to 0-1', () => {
    expect(qualityScore({ overall: 0, pauseCount: 0, strokeOrderErrors: 0 })).toBe(0)
    expect(qualityScore({ overall: 100, pauseCount: 0, strokeOrderErrors: 0 })).toBeCloseTo(1, 5)
  })

  it('applies pause and order penalties', () => {
    const base = qualityScore({ overall: 100, pauseCount: 0, strokeOrderErrors: 0 })
    const penalized = qualityScore({ overall: 100, pauseCount: 5, strokeOrderErrors: 4 })
    expect(penalized).toBeLessThan(base)
  })

  it('clamps penalties so quality does not go negative', () => {
    expect(qualityScore({ overall: 0, pauseCount: 50, strokeOrderErrors: 50 })).toBe(0)
  })
})

describe('scheduleReview', () => {
  it('schedules a short (4h) review for a low-overall attempt', () => {
    const rec = scheduleReview(baseRecord(), { overall: 20, pauseCount: 0, strokeOrderErrors: 0 }, NOW)
    expect(rec.reviewCount).toBe(0)
    expect(rec.nextReview - NOW).toBe(MIN_INTERVAL_MS)
    expect(msToHours(rec.nextReview - NOW)).toBeGreaterThanOrEqual(4)
    expect(msToHours(rec.nextReview - NOW)).toBeLessThanOrEqual(24)
  })

  it('schedules a long review for a high-overall attempt on first success', () => {
    const rec = scheduleReview(baseRecord(), { overall: 95, pauseCount: 0, strokeOrderErrors: 0 }, NOW)
    expect(rec.reviewCount).toBe(1)
    expect(msToHours(rec.nextReview - NOW)).toBeGreaterThanOrEqual(24)
  })

  it('grows intervals across successive good reviews', () => {
    let rec = baseRecord()
    rec = scheduleReview(rec, { overall: 95, pauseCount: 0, strokeOrderErrors: 0 }, NOW)
    const first = rec.nextReview
    rec = scheduleReview(rec, { overall: 95, pauseCount: 0, strokeOrderErrors: 0 }, rec.nextReview)
    const second = rec.nextReview
    rec = scheduleReview(rec, { overall: 95, pauseCount: 0, strokeOrderErrors: 0 }, rec.nextReview)
    const third = rec.nextReview
    expect(second).toBeGreaterThan(first)
    expect(third).toBeGreaterThan(second)
  })

  it('resets reviewCount on a failed review', () => {
    let rec = scheduleReview(baseRecord(), { overall: 90, pauseCount: 0, strokeOrderErrors: 0 }, NOW)
    expect(rec.reviewCount).toBe(1)
    const failNow = rec.nextReview
    rec = scheduleReview(rec, { overall: 10, pauseCount: 0, strokeOrderErrors: 0 }, failNow)
    expect(rec.reviewCount).toBe(0)
    expect(msToHours(rec.nextReview - failNow)).toBeGreaterThanOrEqual(4)
  })

  it('clamps ease factor to minimum', () => {
    let rec = baseRecord()
    for (let i = 0; i < 20; i++) {
      rec = scheduleReview(rec, { overall: 0, pauseCount: 0, strokeOrderErrors: 0 }, NOW)
    }
    expect(rec.easeFactor).toBeGreaterThanOrEqual(MIN_EASE_FACTOR)
  })

  it('reduces interval with pause penalty', () => {
    const noPause = scheduleReview(baseRecord(2), { overall: 95, pauseCount: 0, strokeOrderErrors: 0 }, NOW)
    const withPause = scheduleReview(baseRecord(2), { overall: 95, pauseCount: 10, strokeOrderErrors: 0 }, NOW)
    expect(withPause.nextReview).toBeLessThan(noPause.nextReview)
  })
})

describe('toSrsRecord', () => {
  it('returns defaults for undefined progress', () => {
    const r = toSrsRecord(undefined)
    expect(r.easeFactor).toBe(DEFAULT_EASE_FACTOR)
    expect(r.reviewCount).toBe(0)
  })

  it('reads existing SRS fields from progress', () => {
    const r = toSrsRecord(baseProgress({ easeFactor: 1.8, reviewCount: 3, nextReview: 1234 }))
    expect(r.easeFactor).toBe(1.8)
    expect(r.reviewCount).toBe(3)
    expect(r.nextReview).toBe(1234)
  })
})

describe('applyReviewToProgress', () => {
  it('merges SRS fields back into progress preserving other fields', () => {
    const p = baseProgress({ stars: 3, attempts: 5 })
    const updated = applyReviewToProgress(p, { overall: 90, pauseCount: 0, strokeOrderErrors: 0 }, NOW)
    expect(updated.stars).toBe(3)
    expect(updated.attempts).toBe(5)
    expect(updated.characterId).toBe('A')
    expect(updated.nextReview).toBeGreaterThan(NOW)
    expect(updated.easeFactor).toBeGreaterThan(0)
    expect(updated.reviewCount).toBe(1)
  })
})

describe('isDueForReview', () => {
  it('returns false for incomplete or unset progress', () => {
    expect(isDueForReview(undefined, NOW)).toBe(false)
    expect(isDueForReview(baseProgress({ completed: false }), NOW)).toBe(false)
  })

  it('returns false when nextReview is in the future', () => {
    expect(isDueForReview(baseProgress({ nextReview: NOW + 1000 }), NOW)).toBe(false)
  })

  it('returns true when nextReview is in the past', () => {
    expect(isDueForReview(baseProgress({ nextReview: NOW - 1000 }), NOW)).toBe(true)
  })
})

describe('getDueCharacters', () => {
  it('returns only completed characters with past nextReview', () => {
    const data: Record<string, Progress> = {
      A: baseProgress({ characterId: 'A', nextReview: NOW - 1000 }),
      B: baseProgress({ characterId: 'B', nextReview: NOW + 10000 }),
      C: baseProgress({ characterId: 'C', nextReview: NOW - 2000 }),
      D: baseProgress({ characterId: 'D', completed: false, nextReview: NOW - 3000 }),
    }
    const due = getDueCharacters(data, NOW)
    expect(due.sort()).toEqual(['A', 'C'])
  })
})
