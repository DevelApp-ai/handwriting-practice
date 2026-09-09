import { describe, it, expect, beforeEach } from 'vitest'
import {
  createDefaultProgress,
  calculateLevel,
  getXPForStars,
  calculateXPForCharacter,
  checkAchievements,
  updateStreak,
  getBadgeForAchievement,
  getBadgeColor,
  generateDailyChallenge,
  updateDailyChallenge,
  getDailyChallenges,
  getWeekStartDate,
  generateWeeklyChallenges,
  updateWeeklyChallenge,
  getWeeklyChallenges,
  updateProgressWithGamification,
  getLevelProgress,
  getAchievementProgress,
  getStatistics,
  LEVEL_THRESHOLDS,
  XP_REWARDS,
} from '../gamification'
import { UserProgress, AchievementId, Progress } from '../types'

// Test fixtures
const mockProgress: UserProgress = {
  totalStars: 100,
  charactersCompleted: 50,
  progress: {
    'en_a': { characterId: 'en_a', stars: 3, completed: true, attempts: 1, lastPracticed: Date.now() },
    'en_b': { characterId: 'en_b', stars: 2, completed: true, attempts: 1, lastPracticed: Date.now() },
    'word_hello': { characterId: 'word_hello', stars: 3, completed: true, attempts: 1, lastPracticed: Date.now() },
  },
  achievements: ['first_character', 'first_star'],
  badges: ['bronze'],
  rewards: [],
  totalXP: 500,
  level: 3,
  consecutiveDays: 5,
  longestStreak: 10,
  lastPracticeDate: new Date().toISOString().split('T')[0],
  languagesPracticed: ['en'],
  categoriesCompleted: {},
  settings: {
    theme: 'light',
    background: 'solid',
    font: 'default',
    border: 'solid',
    difficulty: 'medium',
    characterSize: 'medium',
    guideLines: true,
    strokeOrder: true,
    soundEffects: true,
    animations: true,
    dailyGoal: 5,
    weeklyGoal: 30,
    notifications: {
      achievements: true,
      dailyChallenges: true,
      weeklyChallenges: true,
      streakReminders: true,
      levelUp: true,
    },
  },
  dailyChallenges: [],
  weeklyChallenges: [],
  unlockedThemes: ['theme_light'],
  currentLearningPath: null,
  learningPathProgress: {},
}

describe('Gamification Utilities', () => {
  describe('Initialization', () => {
    it('should create default progress with all fields', () => {
      const progress = createDefaultProgress()
      expect(progress.totalStars).toBe(0)
      expect(progress.totalXP).toBe(0)
      expect(progress.level).toBe(1)
      expect(progress.consecutiveDays).toBe(0)
      expect(progress.achievements).toEqual([])
      expect(progress.badges).toEqual([])
      expect(progress.rewards).toEqual([])
      expect(progress.settings.theme).toBe('light')
    })
  })

  describe('XP and Level Management', () => {
    it('should calculate level based on XP thresholds', () => {
      expect(calculateLevel(0)).toBe(1)
      expect(calculateLevel(99)).toBe(1)
      expect(calculateLevel(100)).toBe(2)
      expect(calculateLevel(299)).toBe(2)
      expect(calculateLevel(300)).toBe(3)
      expect(calculateLevel(1000)).toBe(5)
      expect(calculateLevel(4500)).toBe(10)
      expect(calculateLevel(5000)).toBe(10)
    })

    it('should return XP for different star ratings', () => {
      expect(getXPForStars(0)).toBe(XP_REWARDS.attempt)
      expect(getXPForStars(1)).toBe(XP_REWARDS.star1)
      expect(getXPForStars(2)).toBe(XP_REWARDS.star2)
      expect(getXPForStars(3)).toBe(XP_REWARDS.star3)
    })

    it('should calculate XP for characters, words, and sentences', () => {
      expect(calculateXPForCharacter(1)).toBe(XP_REWARDS.star1)
      expect(calculateXPForCharacter(3)).toBe(XP_REWARDS.star3)
      expect(calculateXPForCharacter(2, true)).toBe(XP_REWARDS.word)
      expect(calculateXPForCharacter(1, false, true)).toBe(XP_REWARDS.sentence)
    })
  })

  describe('Achievement System', () => {
    it('should check for first character achievement', () => {
      const achievements = checkAchievements(
        { ...mockProgress, progress: {}, charactersCompleted: 0 },
        'en_a',
        1,
        'en'
      )
      expect(achievements).toContain('first_character')
    })

    it('should check for star achievements', () => {
      const progressWithStars: UserProgress = {
        ...mockProgress,
        totalStars: 9,
        achievements: [],
      }
      const achievements = checkAchievements(progressWithStars, 'en_a', 1, 'en')
      expect(achievements).toContain('first_star')
      expect(achievements).toContain('ten_stars')
    })

    it('should check for polyglot achievement', () => {
      const progressWithLanguages: UserProgress = {
        ...mockProgress,
        languagesPracticed: ['en', 'da', 'ar'],
        progress: {
          en_a: { characterId: 'en_a', stars: 1, completed: true, attempts: 1, lastPracticed: Date.now() },
          da_a: { characterId: 'da_a', stars: 1, completed: true, attempts: 1, lastPracticed: Date.now() },
          ar_a: { characterId: 'ar_a', stars: 1, completed: true, attempts: 1, lastPracticed: Date.now() },
        },
        achievements: [],
      }
      const achievements = checkAchievements(progressWithLanguages, 'ar_a', 1, 'ar')
      expect(achievements).toContain('polyglot')
    })
  })

  describe('Streak Management', () => {
    it('should increment streak when practicing on consecutive day', () => {
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]
      const progressWithYesterday: UserProgress = {
        ...mockProgress,
        lastPracticeDate: yesterday,
        consecutiveDays: 5,
      }
      const result = updateStreak(progressWithYesterday)
      expect(result.consecutiveDays).toBe(6)
    })

    it('should reset streak when not practicing on consecutive day', () => {
      const twoDaysAgo = new Date(Date.now() - 172800000).toISOString().split('T')[0]
      const progressWithGap: UserProgress = {
        ...mockProgress,
        lastPracticeDate: twoDaysAgo,
        consecutiveDays: 5,
        longestStreak: 10,
      }
      const result = updateStreak(progressWithGap)
      expect(result.consecutiveDays).toBe(1)
      expect(result.longestStreak).toBe(10)
    })

    it('should update longest streak when current streak exceeds it', () => {
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]
      const progressWithLongStreak: UserProgress = {
        ...mockProgress,
        lastPracticeDate: yesterday,
        consecutiveDays: 10,
        longestStreak: 5,
      }
      const result = updateStreak(progressWithLongStreak)
      expect(result.consecutiveDays).toBe(11)
      expect(result.longestStreak).toBe(11)
    })
  })

  describe('Badge System', () => {
    it('should return badge for streak achievements', () => {
      expect(getBadgeForAchievement('day_1')).toBe('bronze')
      expect(getBadgeForAchievement('day_7')).toBe('silver')
      expect(getBadgeForAchievement('day_30')).toBe('gold')
      expect(getBadgeForAchievement('day_100')).toBe('platinum')
      expect(getBadgeForAchievement('day_365')).toBe('diamond')
    })

    it('should return special badges', () => {
      expect(getBadgeForAchievement('early_bird')).toBe('early_bird')
      expect(getBadgeForAchievement('night_owl')).toBe('night_owl')
      expect(getBadgeForAchievement('perfectionist')).toBe('perfectionist')
    })

    it('should return color for each badge tier', () => {
      expect(getBadgeColor('bronze')).toBe('#CD7F32')
      expect(getBadgeColor('silver')).toBe('#C0C0C0')
      expect(getBadgeColor('gold')).toBe('#FFD700')
      expect(getBadgeColor('platinum')).toBe('#E5E4E2')
      expect(getBadgeColor('diamond')).toBe('#B9F2FF')
    })
  })

  describe('Daily Challenges', () => {
    it('should generate daily challenge with proper structure', () => {
      const date = new Date().toISOString().split('T')[0]
      const challenge = generateDailyChallenge(date)
      expect(challenge.id).toBe(`daily_${date}`)
      expect(challenge.date).toBe(date)
      expect(challenge.progress).toBe(0)
      expect(challenge.completed).toBe(false)
      expect(challenge.rewardXP).toBeGreaterThan(0)
    })

    it('should update daily challenge progress', () => {
      const challenge = generateDailyChallenge()
      const updated = updateDailyChallenge(challenge, 5)
      expect(updated.progress).toBe(5)
      expect(updated.completed).toBe(false)
    })

    it('should mark challenge as completed when target reached', () => {
      const challenge = generateDailyChallenge()
      const updated = updateDailyChallenge(challenge, challenge.target)
      expect(updated.progress).toBe(challenge.target)
      expect(updated.completed).toBe(true)
    })

    it('should get or generate daily challenges', () => {
      const progressWithChallenge: UserProgress = {
        ...mockProgress,
        dailyChallenges: [
          { id: 'daily_2024-01-01', type: 'character_marathon', description: 'test', target: 10, progress: 5, completed: false, rewardXP: 50, rewardStars: 1, date: '2024-01-01' },
        ],
      }
      const today = new Date().toISOString().split('T')[0]
      const challenges = getDailyChallenges(progressWithChallenge)
      expect(challenges.length).toBeGreaterThan(0)
      expect(challenges.some(c => c.date === today)).toBe(true)
    })
  })

  describe('Weekly Challenges', () => {
    it('should get week start date', () => {
      const weekStart = getWeekStartDate()
      const date = new Date(weekStart)
      expect(date.getDay()).toBe(1) // Monday
    })

    it('should generate weekly challenges', () => {
      const weekStart = getWeekStartDate()
      const challenges = generateWeeklyChallenges(weekStart)
      expect(challenges.length).toBe(6)
      expect(challenges.every(c => c.weekStart === weekStart)).toBe(true)
    })

    it('should update weekly challenge progress', () => {
      const weekStart = getWeekStartDate()
      const challenges = generateWeeklyChallenges(weekStart)
      const updated = updateWeeklyChallenge(challenges, 'xp_collector', 100)
      expect(updated[0].progress).toBe(100)
    })

    it('should get or generate weekly challenges', () => {
      const progressWithChallenges: UserProgress = {
        ...mockProgress,
        weeklyChallenges: [
          { id: 'weekly_2024-01-01_0', type: 'weekly_streak', description: 'test', target: 7, progress: 3, completed: false, rewardXP: 200, rewardBadge: null, weekStart: '2024-01-01' },
        ],
      }
      const challenges = getWeeklyChallenges(progressWithChallenges)
      expect(challenges.length).toBeGreaterThan(0)
    })
  })

  describe('Progress Updates', () => {
    it('should update progress with gamification', () => {
      const updated = updateProgressWithGamification(
        mockProgress,
        'en_c',
        3,
        'en'
      )
      expect(updated.totalStars).toBeGreaterThan(mockProgress.totalStars)
      expect(updated.totalXP).toBeGreaterThan(mockProgress.totalXP)
      expect(updated.progress['en_c']).toBeDefined()
    })

    it('should track language practiced', () => {
      const updated = updateProgressWithGamification(
        { ...mockProgress, languagesPracticed: [] },
        'da_a',
        2,
        'da'
      )
      expect(updated.languagesPracticed).toContain('da')
    })
  })

  describe('Statistics and Helpers', () => {
    it('should get level progress', () => {
      const result = getLevelProgress(500)
      expect(result.level).toBe(3)
      expect(result.currentLevelXP).toBe(300)
      expect(result.nextLevelXP).toBe(600)
      expect(result.progressPercent).toBeGreaterThan(0)
      expect(result.progressPercent).toBeLessThanOrEqual(100)
    })

    it('should get achievement progress', () => {
      const progress: UserProgress = {
        ...mockProgress,
        totalStars: 50,
        charactersCompleted: 26,
      }
      const result = getAchievementProgress('alphabet_master', progress)
      expect(result.target).toBe(26)
      expect(result.current).toBe(50)
      expect(result.completed).toBe(true)
    })

    it('should get statistics', () => {
      const stats = getStatistics(mockProgress)
      expect(stats.charactersCompleted).toBe(50)
      expect(stats.currentStreak).toBe(5)
      expect(stats.longestStreak).toBe(10)
      expect(stats.languagesPracticed).toBe(1)
    })
  })
})

describe('Edge Cases', () => {
  it('should handle empty progress gracefully', () => {
    const emptyProgress: UserProgress = {
      totalStars: 0,
      charactersCompleted: 0,
      progress: {},
      achievements: [],
      badges: [],
      rewards: [],
      totalXP: 0,
      level: 1,
      consecutiveDays: 0,
      longestStreak: 0,
      lastPracticeDate: '',
      languagesPracticed: [],
      categoriesCompleted: {},
      settings: {
        theme: 'light',
        background: 'solid',
        font: 'default',
        border: 'solid',
        difficulty: 'medium',
        characterSize: 'medium',
        guideLines: true,
        strokeOrder: true,
        soundEffects: true,
        animations: true,
        dailyGoal: 5,
        weeklyGoal: 30,
        notifications: {
          achievements: true,
          dailyChallenges: true,
          weeklyChallenges: true,
          streakReminders: true,
          levelUp: true,
        },
      },
      dailyChallenges: [],
      weeklyChallenges: [],
      unlockedThemes: [],
      currentLearningPath: null,
      learningPathProgress: {},
    }

    const achievements = checkAchievements(emptyProgress, 'en_a', 1, 'en')
    expect(achievements).toContain('first_character')
    expect(achievements).toContain('first_star')
  })

  it('should handle level 10 and beyond', () => {
    const highXPProgress: UserProgress = {
      ...mockProgress,
      totalXP: 10000,
      level: 10,
    }
    const updated = updateProgressWithGamification(highXPProgress, 'en_z', 3, 'en')
    expect(updated.level).toBe(10)
  })
})
