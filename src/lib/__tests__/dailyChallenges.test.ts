import { describe, it, expect } from 'vitest'
import {
  createDefaultProgress,
  applyPracticeToDailyChallenges,
  claimDailyChallengeReward,
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

const practice = (overrides: Partial<Parameters<typeof applyPracticeToDailyChallenges>[1]> = {}) => ({
  characterId: 'en_a',
  stars: 3,
  language: 'en',
  isWord: false,
  isSentence: false,
  previousStars: 0,
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
