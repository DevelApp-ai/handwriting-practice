import { describe, it, expect, vi } from 'vitest'
import {
  createDefaultProgress,
  applyPracticeToDailyChallenges,
  applyPracticeToWeeklyChallenges,
  claimDailyChallengeReward,
  claimWeeklyChallengeReward,
  ensureTodayChallenges,
  generateWeeklyChallenges,
  getWeekStartDate,
  updateProgressWithGamification,
} from '../gamification'
import { DailyChallenge, UserProgress, WeeklyChallenge } from '../types'

const today = () => new Date().toISOString().split('T')[0]

function makeChallenge(overrides: Partial<DailyChallenge> = {}): DailyChallenge {
  return {
    id: `daily_${today()}`,
    type: 'character_marathon',
    description: 'Complete 10 characters in one session',
    target: 10,
    progress: 0,
    completed: false,
    rewardXP: 50,
    rewardStars: 1,
    date: today(),
    ...overrides,
  }
}

function makeProgress(
  dailyChallenges: DailyChallenge[] = [],
  weeklyChallenges: WeeklyChallenge[] = []
): UserProgress {
  return { ...createDefaultProgress(), dailyChallenges, weeklyChallenges }
}

function makeWeekly(overrides: Partial<WeeklyChallenge> = {}): WeeklyChallenge {
  return {
    id: `weekly_${getWeekStartDate()}_0`,
    type: 'xp_collector',
    description: 'Earn 500 XP this week',
    target: 500,
    progress: 0,
    completed: false,
    rewardXP: 200,
    rewardBadge: 'bronze',
    weekStart: getWeekStartDate(),
    ...overrides,
  }
}

const practice = (overrides: Partial<Parameters<typeof applyPracticeToDailyChallenges>[1]> = {}) => ({
  characterId: 'en_a',
  stars: 3,
  language: 'en',
  isWord: false,
  isSentence: false,
  previousStars: 0,
  xpEarned: 5,
  starsEarned: 3,
  ...overrides,
})

describe('applyPracticeToDailyChallenges', () => {
  it('increments character_marathon on a first completion', () => {
    const [updated] = applyPracticeToDailyChallenges(
      [makeChallenge({ type: 'character_marathon' })],
      practice()
    )
    expect(updated.progress).toBe(1)
    expect(updated.completed).toBe(false)
  })

  it('does not increment for repeat completions or failed attempts', () => {
    const challenge = makeChallenge({ type: 'character_marathon' })
    const [repeat] = applyPracticeToDailyChallenges([challenge], practice({ previousStars: 3 }))
    const [failed] = applyPracticeToDailyChallenges([challenge], practice({ stars: 0 }))
    expect(repeat.progress).toBe(0)
    expect(failed.progress).toBe(0)
  })

  it('increments perfect_day only when a character first reaches 3 stars', () => {
    const challenge = makeChallenge({ type: 'perfect_day', target: 5 })
    const [threeStars] = applyPracticeToDailyChallenges([challenge], practice({ stars: 3, previousStars: 0 }))
    const [again] = applyPracticeToDailyChallenges([challenge], practice({ stars: 3, previousStars: 3 }))
    const [twoStars] = applyPracticeToDailyChallenges([challenge], practice({ stars: 2, previousStars: 0 }))
    expect(threeStars.progress).toBe(1)
    expect(again.progress).toBe(0)
    expect(twoStars.progress).toBe(0)
  })

  it('counts unique languages for language_explorer', () => {
    const challenge = makeChallenge({ type: 'language_explorer', target: 3 })
    const [first] = applyPracticeToDailyChallenges([challenge], practice({ language: 'en' }))
    const [second] = applyPracticeToDailyChallenges([first], practice({ characterId: 'en_b', language: 'en' }))
    const [third] = applyPracticeToDailyChallenges([second], practice({ characterId: 'da_a', language: 'da' }))
    expect(first.progress).toBe(1)
    expect(second.progress).toBe(1)
    expect(third.progress).toBe(2)
    expect(third.languagesToday).toEqual(['en', 'da'])
  })

  it('increments word_builder and sentence_scribe only for their own content type', () => {
    const words = makeChallenge({ type: 'word_builder', target: 5 })
    const sentences = makeChallenge({ type: 'sentence_scribe', target: 3 })
    const [wordFromChar] = applyPracticeToDailyChallenges([words], practice())
    const [word] = applyPracticeToDailyChallenges([words], practice({ characterId: 'word_hello', isWord: true }))
    const [sentence] = applyPracticeToDailyChallenges([sentences], practice({ characterId: 'sentence_hi', isSentence: true }))
    expect(wordFromChar.progress).toBe(0)
    expect(word.progress).toBe(1)
    expect(sentence.progress).toBe(1)
  })

  it('leaves completed and outdated challenges untouched', () => {
    const completed = makeChallenge({ type: 'character_marathon', progress: 10, completed: true })
    const old = makeChallenge({ type: 'character_marathon', date: '2024-01-01', id: 'daily_2024-01-01' })
    const [updatedCompleted] = applyPracticeToDailyChallenges([completed], practice())
    const [updatedOld] = applyPracticeToDailyChallenges([old], practice())
    expect(updatedCompleted).toBe(completed)
    expect(updatedOld).toBe(old)
  })

  it('completes speed_round when enough first completions happen within the time limit', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-09-15T10:00:00Z'))
    try {
      let challenge = makeChallenge({ type: 'speed_round', target: 3 })
      for (const minute of ['10:00', '10:01', '10:02']) {
        vi.setSystemTime(new Date(`2026-09-15T${minute}:00Z`))
        ;[challenge] = applyPracticeToDailyChallenges([challenge], practice())
      }
      expect(challenge.progress).toBe(3)
      expect(challenge.completed).toBe(true)
    } finally {
      vi.useRealTimers()
    }
  })

  it('keeps speed_round at the best window when completions are spread out', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-09-15T10:00:00Z'))
    try {
      let challenge = makeChallenge({ type: 'speed_round', target: 3 })
      for (const minute of ['10:00', '10:03', '10:06']) {
        vi.setSystemTime(new Date(`2026-09-15T${minute}:00Z`))
        ;[challenge] = applyPracticeToDailyChallenges([challenge], practice())
      }
      expect(challenge.progress).toBe(1)
      expect(challenge.completed).toBe(false)
    } finally {
      vi.useRealTimers()
    }
  })

  it('ignores repeat completions for speed_round', () => {
    const challenge = makeChallenge({ type: 'speed_round', target: 3 })
    const [updated] = applyPracticeToDailyChallenges([challenge], practice({ previousStars: 3 }))
    expect(updated).toBe(challenge)
  })

  it('completes category_master when the event finishes a category', () => {
    const challenge = makeChallenge({ type: 'category_master', target: 1 })
    const [updated] = applyPracticeToDailyChallenges([challenge], practice({ categoryCompleted: true }))
    expect(updated.progress).toBe(1)
    expect(updated.completed).toBe(true)
  })

  it('leaves category_master untouched while the category is unfinished', () => {
    const challenge = makeChallenge({ type: 'category_master', target: 1 })
    const [updated] = applyPracticeToDailyChallenges([challenge], practice())
    expect(updated.progress).toBe(0)
    expect(updated.completed).toBe(false)
  })
})

describe('ensureTodayChallenges', () => {
  it('creates today challenge and weekly challenges when missing', () => {
    const progress = makeProgress()
    const ensured = ensureTodayChallenges(progress)
    expect(ensured).not.toBe(progress)
    expect(ensured.dailyChallenges.some((c) => c.date === today())).toBe(true)
    expect(ensured.weeklyChallenges.length).toBeGreaterThan(0)
  })

  it('returns the same object when challenges already exist', () => {
    const progress = makeProgress([makeChallenge()], generateWeeklyChallenges(getWeekStartDate()))
    const ensured = ensureTodayChallenges(progress)
    expect(ensured).toBe(progress)
  })
})

describe('claimDailyChallengeReward', () => {
  it('grants XP, stars and recalculates the level exactly once', () => {
    const progress = makeProgress([makeChallenge({ progress: 10, completed: true })])
    const claimed = claimDailyChallengeReward(progress, `daily_${today()}`)

    expect(claimed.totalXP).toBe(50)
    expect(claimed.totalStars).toBe(1)
    expect(claimed.level).toBe(1)
    expect(claimed.dailyChallenges[0].claimed).toBe(true)

    const claimedAgain = claimDailyChallengeReward(claimed, `daily_${today()}`)
    expect(claimedAgain).toBe(claimed)
    expect(claimedAgain.totalXP).toBe(50)
  })

  it('is a no-op for incomplete or unknown challenges', () => {
    const progress = makeProgress([makeChallenge()])
    expect(claimDailyChallengeReward(progress, `daily_${today()}`)).toBe(progress)
    expect(claimDailyChallengeReward(progress, 'daily_unknown')).toBe(progress)
  })
})

describe('applyPracticeToWeeklyChallenges', () => {
  it('adds XP and stars earned by the practice', () => {
    const xp = makeWeekly({ type: 'xp_collector', target: 500 })
    const stars = makeWeekly({ type: 'star_collector', target: 50, rewardBadge: null })
    const [updatedXp] = applyPracticeToWeeklyChallenges([xp], practice({ xpEarned: 40 }))
    const [updatedStars] = applyPracticeToWeeklyChallenges([stars], practice({ starsEarned: 2 }))
    expect(updatedXp.progress).toBe(40)
    expect(updatedStars.progress).toBe(2)
  })

  it('counts first completions for completionist', () => {
    const challenge = makeWeekly({ type: 'completionist', target: 30, rewardBadge: null })
    const [first] = applyPracticeToWeeklyChallenges([challenge], practice())
    const [repeat] = applyPracticeToWeeklyChallenges([first], practice({ previousStars: 3 }))
    expect(first.progress).toBe(1)
    expect(repeat.progress).toBe(1)
  })

  it('counts unique languages for diversity_week', () => {
    const challenge = makeWeekly({ type: 'diversity_week', target: 5, rewardBadge: 'silver' })
    const [first] = applyPracticeToWeeklyChallenges([challenge], practice({ language: 'en' }))
    const [sameAgain] = applyPracticeToWeeklyChallenges([first], practice({ language: 'en' }))
    const [second] = applyPracticeToWeeklyChallenges([sameAgain], practice({ language: 'da' }))
    expect(first.progress).toBe(1)
    expect(sameAgain.progress).toBe(1)
    expect(second.progress).toBe(2)
    expect(second.languagesThisWeek).toEqual(['en', 'da'])
  })

  it('counts distinct practice days for weekly_streak', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-09-14T10:00:00Z'))
    try {
      const challenge = makeWeekly({ type: 'weekly_streak', target: 7, rewardBadge: null })
      const [day1] = applyPracticeToWeeklyChallenges([challenge], practice())
      const [sameDay] = applyPracticeToWeeklyChallenges([day1], practice())
      vi.setSystemTime(new Date('2026-09-15T10:00:00Z'))
      const [day2] = applyPracticeToWeeklyChallenges([sameDay], practice())
      expect(day1.progress).toBe(1)
      expect(sameDay.progress).toBe(1)
      expect(day2.progress).toBe(2)
      expect(day2.daysPracticed).toEqual(['2026-09-14', '2026-09-15'])
    } finally {
      vi.useRealTimers()
    }
  })

  it('completes language_master when the language is mastered', () => {
    const challenge = makeWeekly({ type: 'language_master', target: 1, rewardBadge: 'gold' })
    const [updated] = applyPracticeToWeeklyChallenges([challenge], practice({ languageMastered: true }))
    expect(updated.progress).toBe(1)
    expect(updated.completed).toBe(true)
  })

  it('leaves completed and outdated challenges untouched', () => {
    const completed = makeWeekly({ type: 'xp_collector', progress: 500, completed: true })
    const old = makeWeekly({ type: 'xp_collector', weekStart: '2024-01-01', id: 'weekly_2024-01-01_0' })
    const [updatedCompleted] = applyPracticeToWeeklyChallenges([completed], practice({ xpEarned: 40 }))
    const [updatedOld] = applyPracticeToWeeklyChallenges([old], practice({ xpEarned: 40 }))
    expect(updatedCompleted).toBe(completed)
    expect(updatedOld).toBe(old)
  })
})

describe('claimWeeklyChallengeReward', () => {
  it('grants XP and the reward badge exactly once', () => {
    const progress = makeProgress([], [makeWeekly({ progress: 500, completed: true, rewardBadge: 'gold' })])
    const claimed = claimWeeklyChallengeReward(progress, `weekly_${getWeekStartDate()}_0`)

    expect(claimed.totalXP).toBe(200)
    expect(claimed.level).toBe(2)
    expect(claimed.badges).toContain('gold')
    expect(claimed.weeklyChallenges[0].claimed).toBe(true)

    const claimedAgain = claimWeeklyChallengeReward(claimed, `weekly_${getWeekStartDate()}_0`)
    expect(claimedAgain).toBe(claimed)
    expect(claimedAgain.totalXP).toBe(200)
  })

  it('does not duplicate an already owned badge', () => {
    const progress = {
      ...makeProgress([], [makeWeekly({ progress: 500, completed: true, rewardBadge: 'gold' })]),
      badges: ['gold' as const],
    }
    const claimed = claimWeeklyChallengeReward(progress, `weekly_${getWeekStartDate()}_0`)
    expect(claimed.badges.filter((b) => b === 'gold')).toHaveLength(1)
  })

  it('is a no-op for incomplete or unknown challenges', () => {
    const progress = makeProgress([], [makeWeekly()])
    expect(claimWeeklyChallengeReward(progress, `weekly_${getWeekStartDate()}_0`)).toBe(progress)
    expect(claimWeeklyChallengeReward(progress, 'weekly_unknown')).toBe(progress)
  })
})

describe('updateProgressWithGamification daily challenge integration', () => {
  it('advances an existing character_marathon challenge from practice', () => {
    const progress = makeProgress([makeChallenge({ type: 'character_marathon' })])
    const updated = updateProgressWithGamification(progress, 'en_a', 3, 'en')

    const todayChallenge = updated.dailyChallenges.find((c) => c.date === today())
    expect(todayChallenge).toBeDefined()
    expect(todayChallenge!.progress).toBe(1)
  })

  it('creates a challenge for today when none exists', () => {
    const updated = updateProgressWithGamification(makeProgress(), 'en_a', 3, 'en')
    expect(updated.dailyChallenges.some((c) => c.date === today())).toBe(true)
  })

  it('does not advance the challenge for a repeat attempt without new stars', () => {
    const challenge = makeChallenge({ type: 'character_marathon', progress: 1 })
    const progress = makeProgress([challenge])
    const updated = updateProgressWithGamification({ ...progress, progress: { en_a: { characterId: 'en_a', stars: 3, completed: true, attempts: 1, lastPracticed: Date.now() } } }, 'en_a', 2, 'en')

    const todayChallenge = updated.dailyChallenges.find((c) => c.date === today())
    expect(todayChallenge!.progress).toBe(1)
  })
})

describe('updateProgressWithGamification weekly challenge integration', () => {
  it('advances weekly challenges from practice', () => {
    const progress = makeProgress([], generateWeeklyChallenges(getWeekStartDate()))
    const updated = updateProgressWithGamification(progress, 'en_a', 3, 'en')

    expect(updated.weeklyChallenges.find((c) => c.type === 'completionist')!.progress).toBe(1)
    expect(updated.weeklyChallenges.find((c) => c.type === 'xp_collector')!.progress).toBe(5)
    expect(updated.weeklyChallenges.find((c) => c.type === 'star_collector')!.progress).toBe(3)
    expect(updated.weeklyChallenges.find((c) => c.type === 'weekly_streak')!.progress).toBe(1)
    expect(updated.weeklyChallenges.find((c) => c.type === 'diversity_week')!.progress).toBe(1)
  })

  it('completes a category_master challenge when a full category is finished', () => {
    const progress = makeProgress([makeChallenge({ type: 'category_master', target: 1 })])
    let updated = progress
    for (const char of '0123456789'.split('')) {
      updated = updateProgressWithGamification(updated, char, 3, 'en')
    }

    const todayChallenge = updated.dailyChallenges.find((c) => c.date === today())
    expect(todayChallenge!.completed).toBe(true)
    expect(todayChallenge!.progress).toBe(1)
  })
})
