import {
  UserProgress,
  AchievementId,
  BadgeId,
  DailyChallenge,
  WeeklyChallenge,
  LEVEL_THRESHOLDS,
  XP_REWARDS,
  ACHIEVEMENTS,
  BADGES,
  DAILY_CHALLENGE_TYPES,
  WEEKLY_CHALLENGE_TYPES,
  DEFAULT_SETTINGS,
} from './types'

export { LEVEL_THRESHOLDS, XP_REWARDS }

// ============================================================================
// Initialization
// ============================================================================

export function createDefaultProgress(): UserProgress {
  return {
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
    settings: DEFAULT_SETTINGS,
    dailyChallenges: [],
    weeklyChallenges: [],
    unlockedThemes: ['theme_light'],
    currentLearningPath: null,
    learningPathProgress: {},
  }
}

// ============================================================================
// XP and Level Management
// ============================================================================

export function calculateLevel(xp: number): number {
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (xp >= LEVEL_THRESHOLDS[i]) {
      return i + 1
    }
  }
  return 1
}

export function getXPForStars(stars: number): number {
  switch (stars) {
    case 1:
      return XP_REWARDS.star1
    case 2:
      return XP_REWARDS.star2
    case 3:
      return XP_REWARDS.star3
    default:
      return XP_REWARDS.attempt
  }
}

export function calculateXPForCharacter(stars: number, isWord: boolean = false, isSentence: boolean = false): number {
  if (isSentence) return XP_REWARDS.sentence
  if (isWord) return XP_REWARDS.word
  return getXPForStars(stars)
}

// ============================================================================
// Achievement System
// ============================================================================

export function checkAchievements(
  progress: UserProgress,
  characterId: string,
  stars: number,
  language: string,
  isWord: boolean = false,
  isSentence: boolean = false
): AchievementId[] {
  const newAchievements: AchievementId[] = []
  const existingCompleted = Object.values(progress.progress).filter((p) => p.completed).length
  const currentAlreadyTracked = characterId in progress.progress && progress.progress[characterId].completed
  const completedCount = existingCompleted + (currentAlreadyTracked ? 0 : 1)

  // Check character count achievements
  if (completedCount >= 1 && !progress.achievements.includes('first_character')) {
    newAchievements.push('first_character')
  }

  // Check star achievements
  const totalStars = (progress.totalStars || 0) + stars
  if (totalStars >= 1 && !progress.achievements.includes('first_star')) {
    newAchievements.push('first_star')
  }
  if (totalStars >= 10 && !progress.achievements.includes('ten_stars')) {
    newAchievements.push('ten_stars')
  }
  if (totalStars >= 50 && !progress.achievements.includes('fifty_stars')) {
    newAchievements.push('fifty_stars')
  }
  if (totalStars >= 100 && !progress.achievements.includes('hundred_stars')) {
    newAchievements.push('hundred_stars')
  }
  if (totalStars >= 500 && !progress.achievements.includes('five_hundred_stars')) {
    newAchievements.push('five_hundred_stars')
  }
  if (totalStars >= 1000 && !progress.achievements.includes('thousand_stars')) {
    newAchievements.push('thousand_stars')
  }

  // Check word/sentence achievements
  const wordsCompleted = Object.values(progress.progress)
    .filter((p) => p.characterId.startsWith('word_'))
    .filter((p) => p.completed).length
  const sentencesCompleted = Object.values(progress.progress)
    .filter((p) => p.characterId.startsWith('sentence_'))
    .filter((p) => p.completed).length

  if (wordsCompleted >= 20 && !progress.achievements.includes('word_builder')) {
    newAchievements.push('word_builder')
  }
  if (sentencesCompleted >= 10 && !progress.achievements.includes('sentence_scribe')) {
    newAchievements.push('sentence_scribe')
  }

  // Check language-specific achievements
  const languages = [...new Set(Object.values(progress.progress).map((p) => p.characterId.split('_')[0]))]
  if (languages.includes('en') && languages.filter((l) => l === 'en').length >= 26 && !progress.achievements.includes('english_expert')) {
    newAchievements.push('english_expert')
  }
  if (languages.includes('da') && languages.filter((l) => l === 'da').length >= 29 && !progress.achievements.includes('danish_expert')) {
    newAchievements.push('danish_expert')
  }
  if (languages.includes('ar') && languages.filter((l) => l === 'ar').length >= 28 && !progress.achievements.includes('arabic_expert')) {
    newAchievements.push('arabic_expert')
  }
  if (languages.includes('ja') && languages.filter((l) => l === 'ja').length >= 71 && !progress.achievements.includes('japanese_expert')) {
    newAchievements.push('japanese_expert')
  }

  // Check polyglot achievements
  const uniqueLanguages = [...new Set(languages)]
  if (uniqueLanguages.length >= 3 && !progress.achievements.includes('polyglot')) {
    newAchievements.push('polyglot')
  }
  if (uniqueLanguages.length >= 5 && !progress.achievements.includes('linguist')) {
    newAchievements.push('linguist')
  }
  if (uniqueLanguages.length >= 11 && !progress.achievements.includes('global_writer')) {
    newAchievements.push('global_writer')
  }

  return newAchievements
}

// ============================================================================
// Streak Management
// ============================================================================

export function updateStreak(progress: UserProgress): { consecutiveDays: number; longestStreak: number; lastPracticeDate: string } {
  const today = new Date().toISOString().split('T')[0]
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]
  const lastDate = progress.lastPracticeDate || ''

  let consecutiveDays = progress.consecutiveDays
  let longestStreak = progress.longestStreak

  if (lastDate === yesterday) {
    consecutiveDays += 1
  } else if (lastDate !== today) {
    consecutiveDays = 1
  }

  if (consecutiveDays > longestStreak) {
    longestStreak = consecutiveDays
  }

  // Check streak achievements
  if (consecutiveDays >= 1 && !progress.achievements.includes('day_1')) {
    // Would be added by checkAchievements
  }
  if (consecutiveDays >= 7 && !progress.achievements.includes('day_7')) {
    // Would be added by checkAchievements
  }
  if (consecutiveDays >= 30 && !progress.achievements.includes('day_30')) {
    // Would be added by checkAchievements
  }

  return { consecutiveDays, longestStreak, lastPracticeDate: today }
}

// ============================================================================
// Badge System
// ============================================================================

export function getBadgeForAchievement(achievementId: AchievementId): BadgeId | null {
  const achievement = ACHIEVEMENTS[achievementId]
  if (!achievement) return null

  // Tier-based badges
  if (achievement.threshold === 1) return 'bronze'
  if (achievement.threshold === 7) return 'silver'
  if (achievement.threshold === 30) return 'gold'
  if (achievement.threshold === 100) return 'platinum'
  if (achievement.threshold === 365) return 'diamond'

  // Special badges
  const specialBadges: Record<string, BadgeId> = {
    early_bird: 'early_bird',
    night_owl: 'night_owl',
    weekend_warrior: 'weekend_warrior',
    perfect_week: 'perfect_week',
    speed_writer: 'speed_writer',
    perfectionist: 'perfectionist',
  }

  return specialBadges[achievementId] || null
}

export function getBadgeColor(badgeId: BadgeId): string {
  const badge = BADGES[badgeId]
  if (!badge) return '#888888'

  switch (badge.tier) {
    case 'bronze':
      return '#CD7F32'
    case 'silver':
      return '#C0C0C0'
    case 'gold':
      return '#FFD700'
    case 'platinum':
      return '#E5E4E2'
    case 'diamond':
      return '#B9F2FF'
    default:
      return '#888888'
  }
}

// ============================================================================
// Daily Challenges
// ============================================================================

export function generateDailyChallenge(date: string = new Date().toISOString().split('T')[0]): DailyChallenge {
  const today = new Date().toISOString().split('T')[0]
  const seed = today.split('').reduce((a, b) => a + b.charCodeAt(0), 0)
  const typeIndex = seed % DAILY_CHALLENGE_TYPES.length
  const type = DAILY_CHALLENGE_TYPES[typeIndex]

  return {
    id: `daily_${date}`,
    type: type.type,
    description: type.description.replace('{target}', type.target.toString()),
    target: type.target,
    progress: 0,
    completed: false,
    rewardXP: type.rewardXP,
    rewardStars: type.rewardStars,
    date,
  }
}

export function updateDailyChallenge(
  challenge: DailyChallenge,
  progressIncrement: number = 1
): DailyChallenge {
  const newProgress = challenge.progress + progressIncrement
  return {
    ...challenge,
    progress: newProgress,
    completed: newProgress >= challenge.target,
  }
}

export function getDailyChallenges(progress: UserProgress): DailyChallenge[] {
  const today = new Date().toISOString().split('T')[0]
  const existingChallenge = progress.dailyChallenges.find((c) => c.date === today)

  if (existingChallenge) {
    return progress.dailyChallenges
  }

  // Generate new daily challenge
  const newChallenge = generateDailyChallenge(today)
  return [...progress.dailyChallenges.filter((c) => c.date !== today), newChallenge]
}

// ============================================================================
// Weekly Challenges
// ============================================================================

export function getWeekStartDate(date: Date = new Date()): string {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1)
  d.setDate(diff)
  return d.toISOString().split('T')[0]
}

export function generateWeeklyChallenges(weekStart: string): WeeklyChallenge[] {
  return WEEKLY_CHALLENGE_TYPES.map((type, index) => ({
    id: `weekly_${weekStart}_${index}`,
    type: type.type,
    description: type.description.replace('{target}', type.target.toString()),
    target: type.target,
    progress: 0,
    completed: false,
    rewardXP: type.rewardXP,
    rewardBadge: type.rewardBadge,
    weekStart,
  }))
}

export function getWeeklyChallenges(progress: UserProgress): WeeklyChallenge[] {
  const weekStart = getWeekStartDate()
  const existingChallenges = progress.weeklyChallenges.filter((c) => c.weekStart === weekStart)

  if (existingChallenges.length === WEEKLY_CHALLENGE_TYPES.length) {
    return progress.weeklyChallenges
  }

  return generateWeeklyChallenges(weekStart)
}

export function updateWeeklyChallenge(
  challenges: WeeklyChallenge[],
  type: WeeklyChallenge['type'],
  progressIncrement: number = 1
): WeeklyChallenge[] {
  return challenges.map((c) => {
    if (c.type !== type) return c
    const newProgress = c.progress + progressIncrement
    return {
      ...c,
      progress: newProgress,
      completed: newProgress >= c.target,
    }
  })
}

// ============================================================================
// Progress Updates
// ============================================================================

export function updateProgressWithGamification(
  progress: UserProgress,
  characterId: string,
  stars: number,
  language: string,
  isWord: boolean = false,
  isSentence: boolean = false
): UserProgress {
  // Calculate XP earned
  const xpEarned = calculateXPForCharacter(stars, isWord, isSentence)
  const newTotalXP = progress.totalXP + xpEarned
  const newLevel = calculateLevel(newTotalXP)

  // Update streak
  const streakUpdate = updateStreak(progress)

  // Check achievements
  const newAchievements = checkAchievements(progress, characterId, stars, language, isWord, isSentence)

  // Update character progress
  const characterProgress = progress.progress[characterId] || {
    characterId,
    stars: 0,
    completed: false,
    attempts: 0,
    lastPracticed: Date.now(),
  }

  const previousStars = characterProgress.stars
  const newStars = Math.max(stars, previousStars)
  const starsEarned = newStars - previousStars

  const updatedCharacterProgress = {
    ...characterProgress,
    stars: newStars,
    completed: newStars > 0,
    attempts: characterProgress.attempts + 1,
    lastPracticed: Date.now(),
  }

  const updatedProgress = {
    ...progress.progress,
    [characterId]: updatedCharacterProgress,
  }

  const completedCount = Object.values(updatedProgress).filter((p) => p.completed).length

  // Update language practiced
  const languagesPracticed = [...new Set([...progress.languagesPracticed, language])]

  // Update daily challenges
  const today = new Date().toISOString().split('T')[0]
  const dailyChallenges = getDailyChallenges(progress)
  
  // Update weekly challenges
  const weeklyChallenges = getWeeklyChallenges(progress)

  return {
    ...progress,
    totalStars: progress.totalStars + starsEarned,
    charactersCompleted: completedCount,
    progress: updatedProgress,
    achievements: [...new Set([...progress.achievements, ...newAchievements])],
    badges: [...new Set([...progress.badges, ...newAchievements.map(getBadgeForAchievement).filter(Boolean) as BadgeId[]])],
    totalXP: newTotalXP,
    level: newLevel,
    consecutiveDays: streakUpdate.consecutiveDays,
    longestStreak: streakUpdate.longestStreak,
    lastPracticeDate: streakUpdate.lastPracticeDate,
    languagesPracticed,
    dailyChallenges,
    weeklyChallenges,
  }
}

// ============================================================================
// Statistics and Helpers
// ============================================================================

export function getLevelProgress(xp: number): { level: number; currentLevelXP: number; nextLevelXP: number; progressPercent: number } {
  const level = calculateLevel(xp)
  const currentLevelXP = LEVEL_THRESHOLDS[level - 1] || 0
  const nextLevelXP = LEVEL_THRESHOLDS[level] || LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1]
  const levelRange = nextLevelXP - currentLevelXP
  const xpInLevel = xp - currentLevelXP
  const progressPercent = levelRange > 0 ? (xpInLevel / levelRange) * 100 : 100

  return { level, currentLevelXP, nextLevelXP, progressPercent }
}

export function getAchievementProgress(achievementId: AchievementId, progress: UserProgress): { current: number; target: number; completed: boolean } {
  const achievement = ACHIEVEMENTS[achievementId]
  if (!achievement) return { current: 0, target: 1, completed: false }

  const target = achievement.threshold || 1
  let current = 0

  switch (achievementId) {
    case 'first_character':
    case 'alphabet_master':
    case 'number_expert':
    case 'punctuation_pro':
      current = Object.values(progress.progress).filter((p) => p.completed).length
      break
    case 'word_builder':
      current = Object.values(progress.progress)
        .filter((p) => p.characterId.startsWith('word_') && p.completed)
        .length
      break
    case 'sentence_scribe':
      current = Object.values(progress.progress)
        .filter((p) => p.characterId.startsWith('sentence_') && p.completed)
        .length
      break
    case 'polyglot':
    case 'linguist':
    case 'global_writer':
      current = [...new Set(Object.values(progress.progress).map((p) => p.characterId.split('_')[0]))].length
      break
    case 'day_1':
    case 'day_7':
    case 'day_30':
    case 'day_100':
    case 'day_365':
      current = progress.consecutiveDays
      break
    case 'first_star':
    case 'ten_stars':
    case 'fifty_stars':
    case 'hundred_stars':
    case 'five_hundred_stars':
    case 'thousand_stars':
      current = progress.totalStars
      break
    default:
      current = progress.achievements.includes(achievementId) ? 1 : 0
  }

  return { current, target, completed: current >= target }
}

export function getStatistics(progress: UserProgress): {
  totalPracticeTime: number
  charactersCompleted: number
  languagesPracticed: number
  currentStreak: number
  longestStreak: number
  averageStars: number
  mostPracticedLanguage: string
  mostPracticedCategory: string
} {
  const characterEntries = Object.entries(progress.progress)
  const totalAttempts = characterEntries.reduce((sum, [, p]) => sum + p.attempts, 0)
  const totalStars = characterEntries.reduce((sum, [, p]) => sum + p.stars, 0)
  const averageStars = totalAttempts > 0 ? totalStars / totalAttempts : 0

  // Calculate most practiced language
  const languageCounts: Record<string, number> = {}
  characterEntries.forEach(([id]) => {
    const lang = id.split('_')[0]
    languageCounts[lang] = (languageCounts[lang] || 0) + 1
  })
  const mostPracticedLanguage = Object.entries(languageCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'en'

  // Calculate most practiced category
  const categoryCounts: Record<string, number> = {}
  characterEntries.forEach(([id]) => {
    const parts = id.split('_')
    const category = parts.length > 1 ? parts[1] : 'unknown'
    categoryCounts[category] = (categoryCounts[category] || 0) + 1
  })
  const mostPracticedCategory = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'letters'

  return {
    totalPracticeTime: 0, // Would need timestamp tracking
    charactersCompleted: progress.charactersCompleted,
    languagesPracticed: progress.languagesPracticed.length,
    currentStreak: progress.consecutiveDays,
    longestStreak: progress.longestStreak,
    averageStars,
    mostPracticedLanguage,
    mostPracticedCategory,
  }
}
