export type CharacterType = 'uppercase' | 'lowercase' | 'number' | 'word'

export interface Character {
  id: string
  type: CharacterType
  display: string
  strokes: Stroke[]
}

export interface Stroke {
  points: Point[]
  order: number
}

export interface Point {
  x: number
  y: number
}

export interface Progress {
  characterId: string
  stars: number
  completed: boolean
  attempts: number
  lastPracticed: number
}

export type AchievementId = 
  | 'first_character' | 'alphabet_master' | 'number_expert' | 'punctuation_pro' | 'word_builder' | 'sentence_scribe'
  | 'english_expert' | 'danish_expert' | 'arabic_expert' | 'japanese_expert' | 'polyglot' | 'linguist' | 'global_writer'
  | 'day_1' | 'day_7' | 'day_30' | 'day_100' | 'day_365'
  | 'first_star' | 'ten_stars' | 'fifty_stars' | 'hundred_stars' | 'five_hundred_stars' | 'thousand_stars'
  | 'early_bird' | 'night_owl' | 'weekend_warrior' | 'perfect_week' | 'speed_writer' | 'perfectionist'

export type BadgeId = 
  | 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond'
  | 'early_bird' | 'night_owl' | 'weekend_warrior' | 'perfect_week' | 'speed_writer' | 'perfectionist'

export type RewardId = 
  | 'theme_light' | 'theme_dark' | 'theme_colorful' | 'theme_minimal'
  | 'bg_solid' | 'bg_gradient' | 'bg_pattern' | 'bg_image'
  | 'font_default' | 'font_cursive' | 'font_print' | 'font_bold'
  | 'border_none' | 'border_solid' | 'border_dashed' | 'border_dotted'

export interface DailyChallenge {
  id: string
  type: 'character_marathon' | 'perfect_day' | 'language_explorer' | 'speed_round' | 'category_master' | 'word_builder' | 'sentence_scribe'
  description: string
  target: number
  progress: number
  completed: boolean
  rewardXP: number
  rewardStars: number
  date: string
}

export interface WeeklyChallenge {
  id: string
  type: 'weekly_streak' | 'language_master' | 'diversity_week' | 'xp_collector' | 'star_collector' | 'completionist'
  description: string
  target: number
  progress: number
  completed: boolean
  rewardXP: number
  rewardBadge: BadgeId | null
  weekStart: string
}

export interface UserSettings {
  theme: 'light' | 'dark' | 'colorful' | 'minimal'
  background: 'solid' | 'gradient' | 'pattern' | 'image'
  font: 'default' | 'cursive' | 'print' | 'bold'
  border: 'none' | 'solid' | 'dashed' | 'dotted'
  difficulty: 'easy' | 'medium' | 'hard'
  characterSize: 'small' | 'medium' | 'large'
  guideLines: boolean
  strokeOrder: boolean
  soundEffects: boolean
  animations: boolean
  dailyGoal: number
  weeklyGoal: number
  notifications: {
    achievements: boolean
    dailyChallenges: boolean
    weeklyChallenges: boolean
    streakReminders: boolean
    levelUp: boolean
  }
}

export interface UserProgress {
  totalStars: number
  charactersCompleted: number
  progress: Record<string, Progress>
  achievements: AchievementId[]
  badges: BadgeId[]
  rewards: RewardId[]
  totalXP: number
  level: number
  consecutiveDays: number
  longestStreak: number
  lastPracticeDate: string
  languagesPracticed: string[]
  categoriesCompleted: Record<string, boolean>
  settings: UserSettings
  dailyChallenges: DailyChallenge[]
  weeklyChallenges: WeeklyChallenge[]
  unlockedThemes: string[]
  currentLearningPath: string | null
  learningPathProgress: Record<string, number>
}

export const ENCOURAGING_PHRASES = [
  "Awesome job! \u2b50",
  "You're doing great! \ud83c\udf89",
  "Fantastic work! \ud83c\udf1f",
  "Keep it up! \ud83d\udcaa",
  "Wonderful! \ud83c\udfa8",
  "You're a star! \u2b50",
  "Amazing effort! \ud83d\ude80",
  "Super job! \ud83e\uddb8",
  "Brilliant! \u2728",
  "Way to go! \ud83c\udfaf",
  "You rock! \ud83c\udfb8",
  "Excellent! \ud83d\udc4f"
]

// Default settings
export const DEFAULT_SETTINGS: UserSettings = {
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
}

// Level thresholds
export const LEVEL_THRESHOLDS = [
  0,
  100,
  300,
  600,
  1000,
  1500,
  2100,
  2800,
  3600,
  4500,
]

// XP rewards for different actions
export const XP_REWARDS = {
  attempt: 1,
  star1: 2,
  star2: 3,
  star3: 5,
  word: 10,
  sentence: 20,
  dailyLogin: 50,
  weeklyStreak: 100,
}

// Daily challenge definitions
export const DAILY_CHALLENGE_TYPES = [
  { type: 'character_marathon' as const, description: 'Complete {target} characters in one session', target: 10, rewardXP: 50, rewardStars: 1 },
  { type: 'perfect_day' as const, description: 'Get 3 stars on {target} characters', target: 5, rewardXP: 50, rewardStars: 1 },
  { type: 'language_explorer' as const, description: 'Practice characters from {target} different languages', target: 3, rewardXP: 50, rewardStars: 1 },
  { type: 'speed_round' as const, description: 'Complete {target} characters in under {target} minutes', target: 5, rewardXP: 50, rewardStars: 1 },
  { type: 'category_master' as const, description: 'Complete all characters in one category', target: 1, rewardXP: 50, rewardStars: 1 },
  { type: 'word_builder' as const, description: 'Complete {target} words', target: 5, rewardXP: 50, rewardStars: 1 },
  { type: 'sentence_scribe' as const, description: 'Complete {target} sentences', target: 3, rewardXP: 50, rewardStars: 1 },
]

// Weekly challenge definitions
export const WEEKLY_CHALLENGE_TYPES = [
  { type: 'weekly_streak' as const, description: 'Practice every day this week', target: 7, rewardXP: 200, rewardBadge: null },
  { type: 'language_master' as const, description: 'Master all characters in one language', target: 1, rewardXP: 200, rewardBadge: 'gold' },
  { type: 'diversity_week' as const, description: 'Practice characters from {target} different languages', target: 5, rewardXP: 200, rewardBadge: 'silver' },
  { type: 'xp_collector' as const, description: 'Earn {target} XP this week', target: 500, rewardXP: 200, rewardBadge: 'bronze' },
  { type: 'star_collector' as const, description: 'Earn {target} stars this week', target: 50, rewardXP: 200, rewardBadge: null },
  { type: 'completionist' as const, description: 'Complete {target} characters this week', target: 30, rewardXP: 200, rewardBadge: null },
]

// Achievement definitions
export const ACHIEVEMENTS: Record<AchievementId, { name: string; description: string; threshold?: number; language?: string }> = {
  first_character: { name: 'First Step', description: 'Complete your first character', threshold: 1 },
  alphabet_master: { name: 'Alphabet Master', description: 'Complete all letters in a language', threshold: 26 },
  number_expert: { name: 'Number Expert', description: 'Complete all numbers 0-9', threshold: 10 },
  punctuation_pro: { name: 'Punctuation Pro', description: 'Complete all punctuation marks', threshold: 10 },
  word_builder: { name: 'Word Builder', description: 'Complete 20 words', threshold: 20 },
  sentence_scribe: { name: 'Sentence Scribe', description: 'Complete 10 sentences', threshold: 10 },
  english_expert: { name: 'English Expert', description: 'Master all English characters', language: 'en' },
  danish_expert: { name: 'Dansk Mester', description: 'Master alle danske tegn', language: 'da' },
  arabic_expert: { name: 'Arabic Expert', description: 'Master all Arabic characters', language: 'ar' },
  japanese_expert: { name: 'Japanese Expert', description: 'Master all Hiragana and Katakana', language: 'ja' },
  polyglot: { name: 'Polyglot', description: 'Complete characters in 3 different languages', threshold: 3 },
  linguist: { name: 'Linguist', description: 'Complete characters in 5 different languages', threshold: 5 },
  global_writer: { name: 'Global Writer', description: 'Complete characters in all languages', threshold: 11 },
  day_1: { name: 'Getting Started', description: 'Practice for 1 day', threshold: 1 },
  day_7: { name: 'Weekly Writer', description: 'Practice for 7 consecutive days', threshold: 7 },
  day_30: { name: 'Monthly Master', description: 'Practice for 30 consecutive days', threshold: 30 },
  day_100: { name: 'Centurion Writer', description: 'Practice for 100 consecutive days', threshold: 100 },
  day_365: { name: 'Year-Round Writer', description: 'Practice for 1 year', threshold: 365 },
  first_star: { name: 'First Star', description: 'Earn your first star', threshold: 1 },
  ten_stars: { name: 'Deca-Star', description: 'Earn 10 stars', threshold: 10 },
  fifty_stars: { name: 'Half Century', description: 'Earn 50 stars', threshold: 50 },
  hundred_stars: { name: 'Centurion', description: 'Earn 100 stars', threshold: 100 },
  five_hundred_stars: { name: 'Star Collector', description: 'Earn 500 stars', threshold: 500 },
  thousand_stars: { name: 'Star Master', description: 'Earn 1000 stars', threshold: 1000 },
  early_bird: { name: 'Early Bird', description: 'Practice before 9 AM' },
  night_owl: { name: 'Night Owl', description: 'Practice after 9 PM' },
  weekend_warrior: { name: 'Weekend Warrior', description: 'Practice on weekends' },
  perfect_week: { name: 'Perfect Week', description: 'Practice every day for a week' },
  speed_writer: { name: 'Speed Writer', description: 'Complete 5 characters in 10 minutes' },
  perfectionist: { name: 'Perfectionist', description: 'Get 3 stars on 10 characters in a row' },
}

// Badge definitions
export const BADGES: Record<BadgeId, { name: string; description: string; tier: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond' | 'special' }> = {
  bronze: { name: 'Bronze Badge', description: 'Basic achievements', tier: 'bronze' },
  silver: { name: 'Silver Badge', description: 'Intermediate achievements', tier: 'silver' },
  gold: { name: 'Gold Badge', description: 'Advanced achievements', tier: 'gold' },
  platinum: { name: 'Platinum Badge', description: 'Expert achievements', tier: 'platinum' },
  diamond: { name: 'Diamond Badge', description: 'Master achievements', tier: 'diamond' },
  early_bird: { name: 'Early Bird', description: 'Practice before 9 AM', tier: 'special' },
  night_owl: { name: 'Night Owl', description: 'Practice after 9 PM', tier: 'special' },
  weekend_warrior: { name: 'Weekend Warrior', description: 'Practice on weekends', tier: 'special' },
  perfect_week: { name: 'Perfect Week', description: 'Practice every day for a week', tier: 'special' },
  speed_writer: { name: 'Speed Writer', description: 'Complete 5 characters in 10 minutes', tier: 'special' },
  perfectionist: { name: 'Perfectionist', description: 'Get 3 stars on 10 characters in a row', tier: 'special' },
}

// Reward definitions
export const REWARDS: Record<RewardId, { name: string; category: 'theme' | 'background' | 'font' | 'border' }> = {
  theme_light: { name: 'Light Theme', category: 'theme' },
  theme_dark: { name: 'Dark Theme', category: 'theme' },
  theme_colorful: { name: 'Colorful Theme', category: 'theme' },
  theme_minimal: { name: 'Minimal Theme', category: 'theme' },
  bg_solid: { name: 'Solid Background', category: 'background' },
  bg_gradient: { name: 'Gradient Background', category: 'background' },
  bg_pattern: { name: 'Pattern Background', category: 'background' },
  bg_image: { name: 'Image Background', category: 'background' },
  font_default: { name: 'Default Font', category: 'font' },
  font_cursive: { name: 'Cursive Font', category: 'font' },
  font_print: { name: 'Print Font', category: 'font' },
  font_bold: { name: 'Bold Font', category: 'font' },
  border_none: { name: 'No Border', category: 'border' },
  border_solid: { name: 'Solid Border', category: 'border' },
  border_dashed: { name: 'Dashed Border', category: 'border' },
  border_dotted: { name: 'Dotted Border', category: 'border' },
}

// Learning path definitions
export const LEARNING_PATHS = {
  beginner: {
    name: 'Beginner Path',
    description: 'Start your handwriting journey',
    steps: [
      { type: 'letters' as const, category: 'lowercase', target: 26 },
      { type: 'letters' as const, category: 'uppercase', target: 26 },
      { type: 'numbers' as const, category: 'numbers', target: 10 },
      { type: 'words' as const, category: 'words', target: 10 },
    ],
  },
  intermediate: {
    name: 'Intermediate Path',
    description: 'Build your skills',
    steps: [
      { type: 'all' as const, category: 'punctuation', target: 10 },
      { type: 'words' as const, category: 'words', target: 30 },
      { type: 'sentences' as const, category: 'sentences', target: 15 },
      { type: 'language' as const, language: 'es', target: 50 },
    ],
  },
  advanced: {
    name: 'Advanced Path',
    description: 'Master handwriting',
    steps: [
      { type: 'language' as const, language: 'ar', target: 30 },
      { type: 'language' as const, language: 'ja', target: 50 },
      { type: 'language' as const, language: 'ne', target: 40 },
      { type: 'all' as const, target: 200 },
    ],
  },
  master: {
    name: 'Master Path',
    description: 'Become a handwriting expert',
    steps: [
      { type: 'all_languages' as const, target: 10 },
      { type: 'all_categories' as const, target: 100 },
      { type: 'perfect' as const, target: 50 },
    ],
  },
}

export type LearningPathStep = typeof LEARNING_PATHS.beginner.steps[number]
export type LearningPathName = keyof typeof LEARNING_PATHS
