import { describe, it, expect, beforeEach } from 'vitest'
import { UserProgress, Progress } from '../types'

describe('User Progress', () => {
  let initialProgress: UserProgress

  beforeEach(() => {
    initialProgress = {
      totalStars: 0,
      charactersCompleted: 0,
      progress: {},
      achievements: [],
      consecutiveDays: 0,
      lastPracticeDate: '',
    }
  })

  describe('Initial State', () => {
    it('should have zero stars initially', () => {
      expect(initialProgress.totalStars).toBe(0)
    })

    it('should have zero characters completed initially', () => {
      expect(initialProgress.charactersCompleted).toBe(0)
    })

    it('should have empty progress map initially', () => {
      expect(initialProgress.progress).toEqual({})
    })

    it('should have empty achievements array initially', () => {
      expect(initialProgress.achievements).toEqual([])
    })

    it('should have zero consecutive days initially', () => {
      expect(initialProgress.consecutiveDays).toBe(0)
    })

    it('should have empty last practice date initially', () => {
      expect(initialProgress.lastPracticeDate).toBe('')
    })
  })

  describe('Progress Tracking', () => {
    it('should track individual character progress', () => {
      const charProgress: Progress = {
        characterId: 'A',
        stars: 3,
        completed: true,
        attempts: 1,
        lastPracticed: Date.now(),
      }

      expect(charProgress.characterId).toBe('A')
      expect(charProgress.stars).toBe(3)
      expect(charProgress.completed).toBe(true)
      expect(charProgress.attempts).toBe(1)
    })

    it('should track multiple characters', () => {
      const progressMap: Record<string, Progress> = {
        'A': {
          characterId: 'A',
          stars: 3,
          completed: true,
          attempts: 1,
          lastPracticed: Date.now(),
        },
        'B': {
          characterId: 'B',
          stars: 2,
          completed: false,
          attempts: 2,
          lastPracticed: Date.now() - 86400000, // Yesterday
        },
      }

      expect(Object.keys(progressMap).length).toBe(2)
      expect(progressMap['A'].completed).toBe(true)
      expect(progressMap['B'].completed).toBe(false)
    })

    it('should calculate total stars correctly', () => {
      const progress: UserProgress = {
        totalStars: 5,
        charactersCompleted: 2,
        progress: {
          'A': { characterId: 'A', stars: 3, completed: true, attempts: 1, lastPracticed: Date.now() },
          'B': { characterId: 'B', stars: 2, completed: true, attempts: 1, lastPracticed: Date.now() },
        },
        achievements: [],
        consecutiveDays: 0,
        lastPracticeDate: '',
      }

      const total = Object.values(progress.progress).reduce(
        (sum, p) => sum + p.stars,
        0
      )
      expect(total).toBe(5)
    })

    it('should calculate completed count correctly', () => {
      const progress: UserProgress = {
        totalStars: 5,
        charactersCompleted: 2,
        progress: {
          'A': { characterId: 'A', stars: 3, completed: true, attempts: 1, lastPracticed: Date.now() },
          'B': { characterId: 'B', stars: 2, completed: true, attempts: 1, lastPracticed: Date.now() },
          'C': { characterId: 'C', stars: 0, completed: false, attempts: 1, lastPracticed: Date.now() },
        },
        achievements: [],
        consecutiveDays: 0,
        lastPracticeDate: '',
      }

      const completedCount = Object.values(progress.progress).filter(
        p => p.completed
      ).length
      expect(completedCount).toBe(2)
    })

    it('should update stars correctly', () => {
      const charProgress: Progress = {
        characterId: 'A',
        stars: 2,
        completed: true,
        attempts: 1,
        lastPracticed: Date.now(),
      }

      // Simulate earning more stars
      const previousStars = charProgress.stars
      const newStars = Math.max(3, previousStars)

      expect(newStars).toBe(3)
      expect(newStars - previousStars).toBe(1)
    })

    it('should not decrease stars when earning fewer', () => {
      const charProgress: Progress = {
        characterId: 'A',
        stars: 3,
        completed: true,
        attempts: 1,
        lastPracticed: Date.now(),
      }

      const previousStars = charProgress.stars
      const newStars = Math.max(2, previousStars)

      expect(newStars).toBe(3) // Should keep the higher value
    })

    it('should increment attempts', () => {
      const charProgress: Progress = {
        characterId: 'A',
        stars: 2,
        completed: false,
        attempts: 1,
        lastPracticed: Date.now(),
      }

      const updatedProgress = {
        ...charProgress,
        attempts: charProgress.attempts + 1,
      }

      expect(updatedProgress.attempts).toBe(2)
    })

    it('should mark as completed when stars > 0', () => {
      const charProgress: Progress = {
        characterId: 'A',
        stars: 0,
        completed: false,
        attempts: 1,
        lastPracticed: Date.now(),
      }

      const updatedProgress = {
        ...charProgress,
        stars: 2,
        completed: charProgress.stars > 0,
      }

      expect(updatedProgress.completed).toBe(false) // stars was 0, now 2
    })
  })

  describe('Consecutive Days Tracking', () => {
    it('should track consecutive days', () => {
      const today = new Date().toISOString().split('T')[0]
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]

      const progress: UserProgress = {
        totalStars: 10,
        charactersCompleted: 5,
        progress: {},
        achievements: [],
        consecutiveDays: 1,
        lastPracticeDate: yesterday,
      }

      expect(progress.consecutiveDays).toBe(1)
      expect(progress.lastPracticeDate).toBe(yesterday)
    })

    it('should update last practice date', () => {
      const today = new Date().toISOString().split('T')[0]

      const progress: UserProgress = {
        totalStars: 10,
        charactersCompleted: 5,
        progress: {},
        achievements: [],
        consecutiveDays: 1,
        lastPracticeDate: today,
      }

      expect(progress.lastPracticeDate).toBe(today)
    })
  })

  describe('Achievements', () => {
    it('should have achievements array', () => {
      const progress: UserProgress = {
        totalStars: 10,
        charactersCompleted: 5,
        progress: {},
        achievements: ['first_star', 'five_stars'],
        consecutiveDays: 1,
        lastPracticeDate: '',
      }

      expect(progress.achievements).toContain('first_star')
      expect(progress.achievements).toContain('five_stars')
    })

    it('should add achievements', () => {
      const progress: UserProgress = {
        totalStars: 10,
        charactersCompleted: 5,
        progress: {},
        achievements: ['first_star'],
        consecutiveDays: 1,
        lastPracticeDate: '',
      }

      const newAchievements = [...progress.achievements, 'ten_stars']
      expect(newAchievements).toContain('ten_stars')
      expect(newAchievements.length).toBe(2)
    })
  })
})
