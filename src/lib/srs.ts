import { Progress } from '@/lib/types'

const MS_PER_HOUR = 60 * 60 * 1000
const MS_PER_DAY = 24 * MS_PER_HOUR

export const DEFAULT_EASE_FACTOR = 2.5
export const MIN_EASE_FACTOR = 1.3
export const MIN_INTERVAL_MS = 4 * MS_PER_HOUR
export const MAX_INTERVAL_MS = 180 * MS_PER_DAY

export interface ReviewQuality {
  overall: number
  pauseCount: number
  strokeOrderErrors: number
}

export interface SrsRecord {
  nextReview: number
  easeFactor: number
  pausePenalty: number
  reviewCount: number
}

export function toSrsRecord(progress: Progress | undefined): SrsRecord {
  return {
    nextReview: progress?.nextReview ?? 0,
    easeFactor: progress?.easeFactor ?? DEFAULT_EASE_FACTOR,
    pausePenalty: progress?.pausePenalty ?? 0,
    reviewCount: progress?.reviewCount ?? 0,
  }
}

function clampEase(ef: number): number {
  return Math.max(MIN_EASE_FACTOR, Math.min(5, ef))
}

export function qualityScore(q: ReviewQuality): number {
  const overall = Math.max(0, Math.min(100, q.overall))
  const base = overall / 100
  const pausePenalty = Math.min(0.2, q.pauseCount * 0.04)
  const orderPenalty = Math.min(0.2, q.strokeOrderErrors * 0.05)
  return Math.max(0, Math.min(1, base - pausePenalty - orderPenalty))
}

function intervalMs(reviewCount: number, ef: number): number {
  if (reviewCount <= 0) return MIN_INTERVAL_MS
  if (reviewCount === 1) return 1 * MS_PER_DAY
  if (reviewCount === 2) return 3 * MS_PER_DAY
  return Math.round(3 * MS_PER_DAY * Math.pow(ef, reviewCount - 2))
}

export function scheduleReview(
  record: SrsRecord,
  quality: ReviewQuality,
  now: number = Date.now(),
): SrsRecord {
  const q = qualityScore(quality)
  const qGrade = Math.round(q * 5)
  const prevEase = record.easeFactor

  let delta = 0.1 - (5 - qGrade) * (0.08 + (5 - qGrade) * 0.02)
  if (qGrade < 3) delta = -0.2
  let easeFactor = clampEase(prevEase + delta)

  const pauseCount = Math.max(0, quality.pauseCount)
  const pausePenalty = Math.min(0.5, pauseCount * 0.04)

  if (qGrade < 3) {
    return {
      nextReview: now + MIN_INTERVAL_MS,
      easeFactor,
      pausePenalty,
      reviewCount: 0,
    }
  }

  const reviewCount = record.reviewCount + 1
  let interval = intervalMs(reviewCount, easeFactor)
  interval = Math.round(interval * (1 - pausePenalty))
  if (interval < MIN_INTERVAL_MS) interval = MIN_INTERVAL_MS
  if (interval > MAX_INTERVAL_MS) interval = MAX_INTERVAL_MS

  return {
    nextReview: now + interval,
    easeFactor,
    pausePenalty,
    reviewCount,
  }
}

export function applyReviewToProgress(
  progress: Progress,
  quality: ReviewQuality,
  now: number = Date.now(),
): Progress {
  const record = scheduleReview(toSrsRecord(progress), quality, now)
  return {
    ...progress,
    nextReview: record.nextReview,
    easeFactor: record.easeFactor,
    pausePenalty: record.pausePenalty,
    reviewCount: record.reviewCount,
  }
}

export function isDueForReview(
  progress: Progress | undefined,
  now: number = Date.now(),
): boolean {
  if (!progress || !progress.completed) return false
  if (!progress.nextReview) return false
  return progress.nextReview <= now
}

export function getDueCharacters(
  progressData: Record<string, Progress>,
  now: number = Date.now(),
): string[] {
  return Object.values(progressData)
    .filter((p) => isDueForReview(p, now))
    .map((p) => p.characterId)
}

export function msToHours(ms: number): number {
  return ms / MS_PER_HOUR
}
