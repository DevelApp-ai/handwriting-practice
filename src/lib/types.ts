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

export interface UserProgress {
  totalStars: number
  charactersCompleted: number
  progress: Record<string, Progress>
  achievements: string[]
  consecutiveDays: number
  lastPracticeDate: string
}

export const ENCOURAGING_PHRASES = [
  "Awesome job! ⭐",
  "You're doing great! 🎉",
  "Fantastic work! 🌟",
  "Keep it up! 💪",
  "Wonderful! 🎨",
  "You're a star! ⭐",
  "Amazing effort! 🚀",
  "Super job! 🦸",
  "Brilliant! ✨",
  "Way to go! 🎯",
  "You rock! 🎸",
  "Excellent! 👏"
]
