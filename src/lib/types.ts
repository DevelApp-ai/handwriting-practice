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

export const ARABIC_LETTERS = [
  'ا', 'ب', 'ت', 'ث', 'ج', 'ح', 'خ', 'د', 'ذ', 'ر', 'ز',
  'س', 'ش', 'ص', 'ض', 'ط', 'ظ', 'ع', 'غ', 'ف', 'ق', 'ك',
  'ل', 'م', 'ن', 'ه', 'و', 'ي'
]

export const URDU_LETTERS = [
  'ا', 'ب', 'پ', 'ت', 'ٹ', 'ث', 'ج', 'چ', 'ح', 'خ', 'د', 'ڈ',
  'ذ', 'ر', 'ڑ', 'ز', 'ژ', 'س', 'ش', 'ص', 'ض', 'ط', 'ظ', 'ع',
  'غ', 'ف', 'ق', 'ک', 'گ', 'ل', 'م', 'ن', 'ں', 'و', 'ہ', 'ھ',
  'ء', 'ی', 'ے'
]

export const JAPANESE_HIRAGANA = [
  'あ', 'い', 'う', 'え', 'お',
  'か', 'き', 'く', 'け', 'こ',
  'さ', 'し', 'す', 'せ', 'そ',
  'た', 'ち', 'つ', 'て', 'と',
  'な', 'に', 'ぬ', 'ね', 'の',
  'は', 'ひ', 'ふ', 'へ', 'ほ',
  'ま', 'み', 'む', 'め', 'も',
  'や', 'ゆ', 'よ',
  'ら', 'り', 'る', 'れ', 'ろ',
  'わ', 'を', 'ん'
]

export const JAPANESE_KATAKANA = [
  'ア', 'イ', 'ウ', 'エ', 'オ',
  'カ', 'キ', 'ク', 'ケ', 'コ',
  'サ', 'シ', 'ス', 'セ', 'ソ',
  'タ', 'チ', 'ツ', 'テ', 'ト',
  'ナ', 'ニ', 'ヌ', 'ネ', 'ノ',
  'ハ', 'ヒ', 'フ', 'ヘ', 'ホ',
  'マ', 'ミ', 'ム', 'メ', 'モ',
  'ヤ', 'ユ', 'ヨ',
  'ラ', 'リ', 'ル', 'レ', 'ロ',
  'ワ', 'ヲ', 'ン'
]

export const NEPALI_LETTERS = [
  'क', 'ख', 'ग', 'घ', 'ङ',
  'च', 'छ', 'ज', 'झ', 'ञ',
  'ट', 'ठ', 'ड', 'ढ', 'ण',
  'त', 'थ', 'द', 'ध', 'न',
  'प', 'फ', 'ब', 'भ', 'म',
  'य', 'र', 'ल', 'व',
  'श', 'ष', 'स', 'ह',
  'क्ष', 'त्र', 'ज्ञ'
]

export const NEPALI_VOWELS = [
  'अ', 'आ', 'इ', 'ई', 'उ', 'ऊ', 'ऋ',
  'ए', 'ऐ', 'ओ', 'औ', 'अं', 'अः'
]

export function getWritingDirection(char: string): 'ltr' | 'rtl' {
  const rtlChars = [...ARABIC_LETTERS, ...URDU_LETTERS]
  return rtlChars.includes(char) ? 'rtl' : 'ltr'
}

export function isComplexScript(char: string): boolean {
  const complexScripts = [
    ...ARABIC_LETTERS,
    ...URDU_LETTERS,
    ...JAPANESE_HIRAGANA,
    ...JAPANESE_KATAKANA,
    ...NEPALI_LETTERS,
    ...NEPALI_VOWELS
  ]
  return complexScripts.includes(char)
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
