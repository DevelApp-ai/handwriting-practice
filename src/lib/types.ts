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

export const UPPERCASE_LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
export const LOWERCASE_LETTERS = 'abcdefghijklmnopqrstuvwxyz'.split('')
export const NUMBERS = '0123456789'.split('')

export const EU_ACCENTED_UPPERCASE = [
  'À', 'Á', 'Â', 'Ã', 'Ä', 'Å', 'Æ',
  'Ç', 'È', 'É', 'Ê', 'Ë',
  'Ì', 'Í', 'Î', 'Ï',
  'Ð', 'Ñ',
  'Ò', 'Ó', 'Ô', 'Õ', 'Ö', 'Ø',
  'Ù', 'Ú', 'Û', 'Ü',
  'Ý', 'Þ', 'Ÿ',
  'Ā', 'Ă', 'Ą', 'Ć', 'Ĉ', 'Ċ', 'Č',
  'Ď', 'Đ', 'Ē', 'Ĕ', 'Ė', 'Ę', 'Ě',
  'Ĝ', 'Ğ', 'Ġ', 'Ģ',
  'Ĥ', 'Ħ', 'Ĩ', 'Ī', 'Ĭ', 'Į', 'İ',
  'Ĵ', 'Ķ', 'Ĺ', 'Ļ', 'Ľ', 'Ŀ', 'Ł',
  'Ń', 'Ņ', 'Ň',
  'Ō', 'Ŏ', 'Ő', 'Œ',
  'Ŕ', 'Ŗ', 'Ř',
  'Ś', 'Ŝ', 'Ş', 'Š',
  'Ţ', 'Ť', 'Ŧ',
  'Ũ', 'Ū', 'Ŭ', 'Ů', 'Ű', 'Ų',
  'Ŵ', 'Ŷ', 'Ź', 'Ż', 'Ž'
]

export const EU_ACCENTED_LOWERCASE = [
  'à', 'á', 'â', 'ã', 'ä', 'å', 'æ',
  'ç', 'è', 'é', 'ê', 'ë',
  'ì', 'í', 'î', 'ï',
  'ð', 'ñ',
  'ò', 'ó', 'ô', 'õ', 'ö', 'ø',
  'ù', 'ú', 'û', 'ü',
  'ý', 'þ', 'ÿ',
  'ā', 'ă', 'ą', 'ć', 'ĉ', 'ċ', 'č',
  'ď', 'đ', 'ē', 'ĕ', 'ė', 'ę', 'ě',
  'ĝ', 'ğ', 'ġ', 'ģ',
  'ĥ', 'ħ', 'ĩ', 'ī', 'ĭ', 'į', 'ı',
  'ĵ', 'ķ', 'ĺ', 'ļ', 'ľ', 'ŀ', 'ł',
  'ń', 'ņ', 'ň',
  'ō', 'ŏ', 'ő', 'œ',
  'ŕ', 'ŗ', 'ř',
  'ś', 'ŝ', 'ş', 'š',
  'ţ', 'ť', 'ŧ',
  'ũ', 'ū', 'ŭ', 'ů', 'ű', 'ų',
  'ŵ', 'ŷ', 'ź', 'ż', 'ž', 'ß'
]

export const PUNCTUATION = [
  '.', ',', '!', '?', ';', ':',
  "'", '"', '-', '(', ')'
]

export const PRACTICE_WORDS = [
  'cat', 'dog', 'sun', 'fun', 'bat',
  'book', 'tree', 'bird', 'fish', 'moon',
  'apple', 'happy', 'smile', 'house', 'water',
  'café', 'naïve', 'résumé', 'piña', 'crêpe',
  'über', 'søster', 'château', 'niño', 'façade'
]

export const PRACTICE_SENTENCES = [
  'The cat sat.',
  'I am happy!',
  'What is it?',
  'Hello, world!',
  'How are you?',
  'It is sunny.',
  'I like pizza.',
  'She can run fast.',
  'We go to school.',
  'The sky is blue.',
  'Do you like cake?',
  'My name is Anna.',
  'Birds fly high.',
  'I have a dog.',
  'Let\'s play outside!',
  'Where is the cat?',
  'The book is red.',
  'I love my family.',
  'It\'s raining today.',
  'Can you help me?'
]

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
