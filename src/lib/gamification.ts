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
import { getLanguageByCode } from './languages'

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
  _language: string,
  _isWord: boolean = false,
  _isSentence: boolean = false
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

export interface PracticeEvent {
  characterId: string
  stars: number
  language: string
  isWord: boolean
  isSentence: boolean
  /** Star count the character had before this practice session */
  previousStars: number
  /** XP earned by this practice event */
  xpEarned: number
  /** New stars earned by this practice event */
  starsEarned: number
  /** True when this practice completed every character of a category */
  categoryCompleted?: boolean
  /** True when every character of the practiced language is now completed */
  languageMastered?: boolean
}

/**
 * Advance today's daily challenge based on a single practice event.
 * Challenges that are already completed (or from other days) are left untouched.
 */
export function applyPracticeToDailyChallenges(
  challenges: DailyChallenge[],
  event: PracticeEvent
): DailyChallenge[] {
  const today = new Date().toISOString().split('T')[0]
  const firstCompletion = event.stars > 0 && event.previousStars === 0
  const firstThreeStars = event.stars >= 3 && event.previousStars < 3

  return challenges.map((challenge) => {
    if (challenge.date !== today || challenge.completed) return challenge

    switch (challenge.type) {
      case 'character_marathon':
        return firstCompletion ? updateDailyChallenge(challenge) : challenge
      case 'perfect_day':
        return firstThreeStars ? updateDailyChallenge(challenge) : challenge
      case 'language_explorer': {
        const languagesToday = challenge.languagesToday ?? []
        if (languagesToday.includes(event.language)) return challenge
        return updateDailyChallenge({
          ...challenge,
          languagesToday: [...languagesToday, event.language],
        })
      }
      case 'word_builder':
        return event.isWord && firstCompletion ? updateDailyChallenge(challenge) : challenge
      case 'sentence_scribe':
        return event.isSentence && firstCompletion ? updateDailyChallenge(challenge) : challenge
      case 'speed_round': {
        if (!firstCompletion) return challenge
        const timestamps = [...(challenge.completionTimestamps ?? []), Date.now()].sort((a, b) => a - b)
        const windowMs = challenge.target * 60 * 1000
        let best = 0
        let start = 0
        for (let end = 0; end < timestamps.length; end++) {
          while (timestamps[end] - timestamps[start] >= windowMs) start++
          best = Math.max(best, end - start + 1)
        }
        return {
          ...challenge,
          completionTimestamps: timestamps,
          progress: best,
          completed: best >= challenge.target,
        }
      }
      case 'category_master':
        return event.categoryCompleted
          ? { ...challenge, progress: challenge.target, completed: true }
          : challenge
      default:
        return challenge
    }
  })
}

/**
 * Ensure today's daily challenge and this week's challenges exist without
 * counting any progress. Returns the same object when nothing changed so
 * callers can safely call it on every app start.
 */
export function ensureTodayChallenges(progress: UserProgress): UserProgress {
  const dailyChallenges = getDailyChallenges(progress)
  const weeklyChallenges = getWeeklyChallenges(progress)

  if (
    dailyChallenges === progress.dailyChallenges &&
    weeklyChallenges === progress.weeklyChallenges
  ) {
    return progress
  }

  return { ...progress, dailyChallenges, weeklyChallenges }
}

/**
 * Grant the reward for a completed daily challenge exactly once and mark it
 * as claimed. Returns the input unchanged when the challenge is missing,
 * not yet completed, or already claimed.
 */
export function claimDailyChallengeReward(progress: UserProgress, challengeId: string): UserProgress {
  const challenge = progress.dailyChallenges.find((c) => c.id === challengeId)
  if (!challenge || !challenge.completed || challenge.claimed) {
    return progress
  }

  const newTotalXP = progress.totalXP + challenge.rewardXP

  return {
    ...progress,
    totalXP: newTotalXP,
    level: calculateLevel(newTotalXP),
    totalStars: progress.totalStars + challenge.rewardStars,
    dailyChallenges: progress.dailyChallenges.map((c) =>
      c.id === challengeId ? { ...c, claimed: true } : c
    ),
  }
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

/**
 * Advance this week's challenges based on a single practice event.
 * Challenges that are already completed (or from other weeks) are left untouched.
 */
export function applyPracticeToWeeklyChallenges(
  challenges: WeeklyChallenge[],
  event: PracticeEvent
): WeeklyChallenge[] {
  const weekStart = getWeekStartDate()
  const today = new Date().toISOString().split('T')[0]
  const firstCompletion = event.stars > 0 && event.previousStars === 0

  const advance = (challenge: WeeklyChallenge, progress: number): WeeklyChallenge => ({
    ...challenge,
    progress,
    completed: progress >= challenge.target,
  })

  return challenges.map((challenge) => {
    if (challenge.weekStart !== weekStart || challenge.completed) return challenge

    switch (challenge.type) {
      case 'weekly_streak': {
        const daysPracticed = challenge.daysPracticed ?? []
        if (daysPracticed.includes(today)) return challenge
        const days = [...daysPracticed, today]
        return { ...advance(challenge, days.length), daysPracticed: days }
      }
      case 'diversity_week': {
        const languagesThisWeek = challenge.languagesThisWeek ?? []
        if (languagesThisWeek.includes(event.language)) return challenge
        const languages = [...languagesThisWeek, event.language]
        return { ...advance(challenge, languages.length), languagesThisWeek: languages }
      }
      case 'xp_collector':
        return advance(challenge, challenge.progress + event.xpEarned)
      case 'star_collector':
        return advance(challenge, challenge.progress + event.starsEarned)
      case 'completionist':
        return firstCompletion ? advance(challenge, challenge.progress + 1) : challenge
      case 'language_master':
        return event.languageMastered ? advance(challenge, challenge.target) : challenge
      default:
        return challenge
    }
  })
}

/**
 * Grant the reward for a completed weekly challenge exactly once and mark it
 * as claimed. Returns the input unchanged when the challenge is missing,
 * not yet completed, or already claimed.
 */
export function claimWeeklyChallengeReward(progress: UserProgress, challengeId: string): UserProgress {
  const challenge = progress.weeklyChallenges.find((c) => c.id === challengeId)
  if (!challenge || !challenge.completed || challenge.claimed) {
    return progress
  }

  const newTotalXP = progress.totalXP + challenge.rewardXP
  const badges =
    challenge.rewardBadge && !progress.badges.includes(challenge.rewardBadge)
      ? [...progress.badges, challenge.rewardBadge]
      : progress.badges

  return {
    ...progress,
    totalXP: newTotalXP,
    level: calculateLevel(newTotalXP),
    badges,
    weeklyChallenges: progress.weeklyChallenges.map((c) =>
      c.id === challengeId ? { ...c, claimed: true } : c
    ),
  }
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

  // Check whether this practice completed a full category or mastered a
  // language (used by the category_master daily challenge and the
  // language_master weekly challenge)
  const languageDefinition = getLanguageByCode(language)
  let categoryCompleted = false
  let languageMastered = false
  if (languageDefinition) {
    const category = languageDefinition.categories.find((c) => c.characters.includes(characterId))
    if (category && category.characters.every((c) => updatedProgress[c]?.completed)) {
      categoryCompleted = true
      languageMastered = languageDefinition.categories.every((cat) =>
        cat.characters.every((c) => updatedProgress[c]?.completed)
      )
    }
  }

  const practiceEvent: PracticeEvent = {
    characterId,
    stars,
    language,
    isWord,
    isSentence,
    previousStars,
    xpEarned,
    starsEarned,
    categoryCompleted,
    languageMastered,
  }

  // Update daily challenges (make sure today's exists, then apply this practice)
  const dailyChallenges = applyPracticeToDailyChallenges(
    getDailyChallenges(progress),
    practiceEvent
  )

  // Update weekly challenges (make sure this week's exist, then apply this practice)
  const weeklyChallenges = applyPracticeToWeeklyChallenges(
    getWeeklyChallenges(progress),
    practiceEvent
  )

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
  let current: number

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
