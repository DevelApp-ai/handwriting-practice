export interface Language {
  code: string
  name: string
  nativeName: string
  fontFamily: string
  categories: LanguageCategory[]
}

export interface LanguageCategory {
  id: string
  name: string
  characters: string[]
  type?: 'letters' | 'numbers' | 'words' | 'sentences' | 'punctuation'
}

// Helper to create word and sentence categories
function createWordCategory(name: string, words: string[]): LanguageCategory {
  return { id: 'words', name, characters: words, type: 'words' }
}

function createSentenceCategory(name: string, sentences: string[]): LanguageCategory {
  return { id: 'sentences', name, characters: sentences, type: 'sentences' }
}

// Common punctuation
const commonPunctuation = ['.', ',', '!', '?', ';', ':', "'", '"', '-', '(', ')']
const arabicPunctuation = ['.', ',', '!', '\u061f', ';', ':', "'", '"', '-', '(', ')']
const urduPunctuation = ['.', ',', '!', '\u061f', ';', ':', "'", '"', '-', '(', ')']

// English - Enhanced with many words and sentences
const englishWords = [
  'cat', 'dog', 'sun', 'fun', 'bat', 'book', 'tree', 'bird', 'fish', 'moon',
  'apple', 'happy', 'smile', 'house', 'water', 'fire', 'wind', 'rain', 'snow',
  'star', 'light', 'dark', 'big', 'small', 'fast', 'slow', 'hot', 'cold',
  'new', 'old', 'good', 'bad', 'up', 'down', 'left', 'right', 'open', 'close',
  'hello', 'world', 'name', 'time', 'day', 'night', 'morning', 'evening',
  'father', 'mother', 'brother', 'sister', 'friend', 'teacher', 'student',
  'school', 'class', 'home', 'room', 'door', 'window', 'table', 'chair',
  'pen', 'paper', 'food', 'milk', 'bread', 'egg', 'rice', 'meat', 'boy', 'girl',
]

const englishSentences = [
  'The cat sat on the mat.',
  'I am happy today!',
  'What is your name?',
  'Hello, world!',
  'How are you doing?',
  'It is sunny outside.',
  'I like to eat pizza.',
  'She can run very fast.',
  'We go to school every day.',
  'The sky is blue and beautiful.',
]

// Danish - Enhanced
const danishWords = [
  'kat', 'hund', 'sol', 'måne', 'bog', 'træ', 'fugl', 'fisk', 'hus', 'vand',
  'æble', 'glad', 'smil', 'køre', 'øje',
]

const danishSentences = [
  'Jeg er glad i dag.',
  'Hvordan har du det?',
  'Katten sover på tæppet.',
]

// German - Enhanced
const germanWords = [
  'Katze', 'Hund', 'Sonne', 'Mond', 'Buch', 'Baum', 'Vogel', 'Fisch',
  'Haus', 'Wasser', 'Apfel',
]

const germanSentences = [
  'Ich bin glücklich.',
  'Wie geht es dir?',
  'Die Katze schläft.',
]

// French - Enhanced
const frenchWords = [
  'chat', 'chien', 'soleil', 'lune', 'livre', 'arbre', 'oiseau', 'poisson',
  'maison', 'eau', 'pomme',
]

const frenchSentences = [
  'Je suis heureux.',
  'Comment allez-vous?',
  'Le chat dort.',
]

// Spanish - Enhanced
const spanishWords = [
  'gato', 'perro', 'sol', 'luna', 'libro', 'árbol', 'pájaro', 'pez',
  'casa', 'agua', 'manzana',
]

const spanishSentences = [
  '¡Estoy feliz!',
  '¿Cómo estás?',
  'El gato duerme.',
]

// Arabic - Significantly Enhanced
const arabicLetters = [
  '\u0627', '\u0628', '\u062a', '\u062b', '\u062c', '\u062d', '\u062e', '\u062f',
  '\u0630', '\u0631', '\u0632', '\u0633', '\u0634', '\u0635', '\u0636', '\u0637',
  '\u0638', '\u0639', '\u063a', '\u0641', '\u0642', '\u0643', '\u0644', '\u0645',
  '\u0646', '\u0647', '\u0648', '\u064a'
]

const arabicWords = [
  '\u0642\u0637\u0629',
  '\u0643\u0644\u0628',
  '\u0634\u0645\u0633',
  '\u0642\u0645\u0631',
  '\u0643\u062a\u0627\u0628',
  '\u0634\u062c\u0631\u0629',
  '\u0637\u0627\u0626\u0631',
  '\u0633\u0645\u0643\u0629',
  '\u0628\u064a\u062a',
  '\u0645\u0627\u0621',
]

const arabicSentences = [
  '\u0627\u0644\u0642\u0637\u0629 \u0627\u0644\u0637\u0648\u0644\u0649 \u062c\u0644\u0633\u0629',
  '\u0627\u0646\u0627 \u0633\u0639\u064a\u062f',
  '\u0645\u0627 \u0627\u0633\u0645\u0643?',
]

// Urdu - Significantly Enhanced
const urduLetters = [
  '\u0627', '\u0628', '\u067e', '\u062a', '\u0679', '\u062b', '\u062c', '\u0686',
  '\u062d', '\u062e', '\u062f', '\u0688', '\u0630', '\u0631', '\u0691', '\u0632',
  '\u0698', '\u0633', '\u0634', '\u0635', '\u0636', '\u0637', '\u0638', '\u0639',
  '\u063a', '\u0641', '\u0642', '\u06a9', '\u06af', '\u0644', '\u0645', '\u0646',
  '\u06ba', '\u0648', '\u06c1', '\u06be', '\u0621', '\u06cc', '\u06d2'
]

const urduWords = [
  '\u0628\u0644\u06cc',
  '\u06a9\u062a\u0627',
  '\u0633\u0648\u0631\u062c',
  '\u0686\u0627\u0646\u062f',
  '\u062f\u0648\u0633\u062a',
  '\u06af\u06be\u0631',
  '\u067e\u0627\u0646\u06cc',
  '\u062f\u0633\u062a',
  '\u0622\u0628',
  '\u0622\u0633\u0645\u0627\u0646',
]

const urduSentences = [
  '\u0628\u0644\u06cc \u0627\u0645\u0641\u0627\u0646\u06cc \u0627\u06cc',
  '\u0627\u0648\u0631 \u062e\u0648\u0636 \u0640\u06cc',
  '\u06cc\u06c1 \u062f\u0648\u0633\u062a \u0627\u0645\u0641\u0627\u0646\u06cc \u06c1\u06d2',
]

// Japanese - Enhanced
const japaneseHiragana = [
  '\u3042', '\u3044', '\u3046', '\u3048', '\u304a', '\u304b', '\u304d', '\u304f',
  '\u3051', '\u3053', '\u3055', '\u3057', '\u3059', '\u305b', '\u305d', '\u305f',
  '\u3061', '\u3064', '\u3066', '\u3068', '\u306a', '\u306b', '\u306c', '\u306d',
  '\u306e', '\u306f', '\u3072', '\u3075', '\u3078', '\u307b', '\u307e', '\u307f',
  '\u3080', '\u3081', '\u3082', '\u3084', '\u3086', '\u3088', '\u3089', '\u308a',
  '\u308b', '\u308c', '\u308d', '\u308f', '\u3092', '\u3093'
]

const japaneseKatakana = [
  '\u30a2', '\u30a4', '\u30a6', '\u30a8', '\u30aa', '\u30ab', '\u30ad', '\u30af',
  '\u30b1', '\u30b3', '\u30b5', '\u30b7', '\u30b9', '\u30bb', '\u30bd', '\u30bf',
  '\u30c1', '\u30c4', '\u30c6', '\u30c8', '\u30ca', '\u30cb', '\u30cc', '\u30cd',
  '\u30ce', '\u30cf', '\u30d2', '\u30d5', '\u30d8', '\u30db', '\u30de', '\u30df',
  '\u30e0', '\u30e1', '\u30e2', '\u30e4', '\u30e6', '\u30e8', '\u30e9', '\u30ea',
  '\u30eb', '\u30ec', '\u30ed', '\u30ef', '\u30f2', '\u30f3'
]

const japaneseWords = [
  '\u65e5\u672c\u8a9e',
  '\u7269',
  '\u6a29',
  '\u6c34',
  '\u9ce5',
  '\u9b54',
  '\u5bb6',
  '\u66f8',
  '\u65e5',
  '\u6708',
]

const japaneseSentences = [
  '\u65e5\u672c\u8a9e\u306f\u306b\u306e\u306e\u3053\u3068\u3067\u3059',
  '\u3053\u306e\u306f\u52d5\u7269\u3067\u3059',
  '\u79c1\u306f\u672c\u3092\u8aad\u307f\u307e\u3059',
]

// Nepali - Enhanced with Devanagari script
const nepaliVowels = [
  '\u0905', '\u0906', '\u0907', '\u0908', '\u0909', '\u090a', '\u090b', '\u090f',
  '\u0910', '\u0913', '\u0914', '\u0905\u0902', '\u0905\u0903'
]

const nepaliConsonants = [
  '\u0915', '\u0916', '\u0917', '\u0918', '\u0919', '\u091a', '\u091b', '\u091c',
  '\u091d', '\u091e', '\u091f', '\u0920', '\u0921', '\u0922', '\u0923', '\u0924',
  '\u0925', '\u0926', '\u0927', '\u0928', '\u092a', '\u092b', '\u092c', '\u092d',
  '\u092e', '\u092f', '\u0930', '\u0932', '\u0935', '\u0936', '\u0937', '\u0938',
  '\u0939', '\u0915\u094d\u0937', '\u0924\u094d\u0930', '\u091c\u094d\u091e'
]

const nepaliWords = [
  '\u092a\u0941\u0938\u094d\u0924\u0915',
  '\u0930\u0941\u0915\u094d\u0937',
  '\u091a\u0930\u093e',
  '\u092e\u0915\u094d\u0938\u0933\u0921',
  '\u0918\u0930',
  '\u092a\u0928\u0940',
  '\u0938\u0942\u0930\u094d\u092f',
  '\u091a\u0902\u0926\u094d\u0930',
  '\u0924\u093e\u0930\u093e',
  '\u092a\u093e\u0928\u0940',
]

const nepaliSentences = [
  '\u092a\u0941\u0938\u094d\u0924\u0915 \u0930\u0941\u0915\u094d\u0937\u092e\u093e \u091a\u0939\u094d \u091a\u0915\u094d\u0924\u093e',
  '\u0938\u0942\u0930\u094d\u092f \u092a\u0941\u0917\u094d\u0917\u094b \u091a\u092e\u094d\u091a',
  '\u092e\u093e \u0930\u0941\u0915\u094d\u0937 \u092e\u093f\u0932\u094d\u0928\u094d\u091b',
]

// Sanskrit - Enhanced
const sanskritVowels = [
  '\u0905', '\u0906', '\u0907', '\u0908', '\u0909', '\u090a', '\u090b', '\u090f',
  '\u0910', '\u0913', '\u0914'
]

const sanskritConsonants = [
  '\u0915', '\u0916', '\u0917', '\u0918', '\u0919', '\u091a', '\u091b', '\u091c',
  '\u091d', '\u091e', '\u091f', '\u0920', '\u0921', '\u0922', '\u0923', '\u0924',
  '\u0925', '\u0926', '\u0927', '\u0928', '\u092a', '\u092b', '\u092c', '\u092d',
  '\u092e', '\u092f', '\u0930', '\u0932', '\u0935', '\u0936', '\u0937', '\u0938',
  '\u0939'
]

const sanskritWords = [
  '\u092a\u0941\u0938\u094d\u0924\u0915\u092e',
  '\u0935\u0943\u0915\u094d\u0937\u0936\u0947',
  '\u092a\u0915\u094d\u0937\u0940',
  '\u092e\u0924\u094d\u0938\u094d\u092f\u093e',
  '\u0918\u0943\u0939\u093e',
  '\u091c\u0932\u092e',
  '\u0938\u0942\u0930\u094d\u092f\u093e',
  '\u091a\u0902\u0926\u094d\u0930\u093e',
  '\u0928\u0926\u0940',
  '\u0935\u0928\u092e\u094d',
]

const sanskritSentences = [
  '\u092a\u0941\u0938\u094d\u0924\u0915\u092e \u0935\u0943\u0915\u094d\u0937\u0936\u0947 \u092e \u0915\u094d\u0937\u0924\u094d\u0924\u093e',
  '\u0938\u0942\u0930\u094d\u092f\u0947 \u092a\u094d\u0930\u0915\u093e\u0936\u0903',
  '\u091c\u0932\u092e \u092e\u0943\u0926\u0941\u092a\u094d\u0930\u0938\u0928\u094d\u0926\u0930\u092e\u094d',
]

// Newari - Enhanced
const newariVowels = [
  '\u0904', '\u0905', '\u0906', '\u0907', '\u0908', '\u0909', '\u090a', '\u090b',
  '\u090f', '\u0910'
]

const newariConsonants = [
  '\u0915', '\u0916', '\u0917', '\u0918', '\u0919', '\u091a', '\u091b', '\u091c',
  '\u091d', '\u091e', '\u091f', '\u0920', '\u0921', '\u0922', '\u0923', '\u0924',
  '\u0925', '\u0926', '\u0927', '\u0928', '\u092a', '\u092b', '\u092c', '\u092d',
  '\u092e', '\u092f', '\u0930', '\u0932', '\u0935', '\u0936', '\u0937', '\u0938',
  '\u0939', '\u0958', '\u0959', '\u095a'
]

const newariWords = [
  '\u092a\u0941\u0938\u094d\u0924\u0915',
  '\u0930\u0941\u0915\u094d\u0937',
  '\u091a\u0930\u093e',
  '\u092e\u0915\u094d\u0938\u0933\u0921',
  '\u0918\u0930',
  '\u092a\u0928\u0940',
  '\u0938\u0942\u0930\u094d\u092f',
  '\u091a\u0902\u0926\u094d\u0930',
  '\u0924\u093e\u0930\u093e',
  '\u092a\u093e\u0928\u0940',
]

const newariSentences = [
  '\u092a\u0941\u0938\u094d\u0924\u0915 \u0930\u0941\u0915\u094d\u0937 \u092e \u0915\u094d\u0937\u0924\u094d\u0924\u0947',
  '\u0938\u0942\u0930\u094d\u092f \u092a\u0941\u0917\u094d\u0917\u094b \u091a\u092e\u094d\u091a',
  '\u092e\u093e \u0930\u0941\u0915\u094d\u0937 \u092e\u093f\u0932\u0928\u094d\u091b',
]

// Punctuation for Devanagari scripts
const devanagariPunctuation = ['\u0964', ',', '!', '?', ';', ':', "'", '"', '-', '(', ')']

// Japanese punctuation
const japanesePunctuation = ['\u3002', '\u3001', '\uff01', '\uff1f', '\u30fb']

// Arabic numbers
const arabicNumbers = '\u0660\u0661\u0662\u0663\u0664\u0665\u0666\u0667\u0668\u0669'.split('')

// Urdu numbers
const urduNumbers = '\u06f0\u06f1\u06f2\u06f3\u06f4\u06f5\u06f6\u06f7\u06f8\u06f9'.split('')

// Devanagari numbers
const devanagariNumbers = '\u0966\u0967\u0968\u0969\u096a\u096b\u096c\u096d\u096e\u096f'.split('')

export const LANGUAGES: Language[] = [
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    fontFamily: "'Quicksand', sans-serif",
    categories: [
      { id: 'uppercase', name: 'Uppercase', characters: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''), type: 'letters' },
      { id: 'lowercase', name: 'Lowercase', characters: 'abcdefghijklmnopqrstuvwxyz'.split(''), type: 'letters' },
      { id: 'numbers', name: 'Numbers', characters: '0123456789'.split(''), type: 'numbers' },
      { id: 'punctuation', name: 'Punctuation', characters: commonPunctuation, type: 'punctuation' },
      createWordCategory('Words', englishWords),
      createSentenceCategory('Sentences', englishSentences),
    ]
  },
  {
    code: 'da',
    name: 'Danish',
    nativeName: 'Dansk',
    fontFamily: "'Quicksand', sans-serif",
    categories: [
      { id: 'uppercase', name: 'Store bogstaver', characters: 'ABCDEFGHIJKLMNOPQRSTUVWXYZÆØÅ'.split(''), type: 'letters' },
      { id: 'lowercase', name: 'Små bogstaver', characters: 'abcdefghijklmnopqrstuvwxyzæøå'.split(''), type: 'letters' },
      { id: 'numbers', name: 'Tal', characters: '0123456789'.split(''), type: 'numbers' },
      { id: 'punctuation', name: 'Tegnsætning', characters: commonPunctuation, type: 'punctuation' },
      createWordCategory('Ord', danishWords),
      createSentenceCategory('Sætninger', danishSentences),
    ]
  },
  {
    code: 'de',
    name: 'German',
    nativeName: 'Deutsch',
    fontFamily: "'Quicksand', sans-serif",
    categories: [
      { id: 'uppercase', name: 'Großbuchstaben', characters: 'ABCDEFGHIJKLMNOPQRSTUVWXYZÄÖÜẞ'.split(''), type: 'letters' },
      { id: 'lowercase', name: 'Kleinbuchstaben', characters: 'abcdefghijklmnopqrstuvwxyzäöüß'.split(''), type: 'letters' },
      { id: 'numbers', name: 'Zahlen', characters: '0123456789'.split(''), type: 'numbers' },
      { id: 'punctuation', name: 'Zeichensetzung', characters: commonPunctuation, type: 'punctuation' },
      createWordCategory('Wörter', germanWords),
      createSentenceCategory('Sätze', germanSentences),
    ]
  },
  {
    code: 'fr',
    name: 'French',
    nativeName: 'Français',
    fontFamily: "'Quicksand', sans-serif",
    categories: [
      { id: 'uppercase', name: 'Majuscules', characters: 'ABCDEFGHIJKLMNOPQRSTUVWXYZÀÂÆÇÉÈÊËÎÏÔÙÛÜÝ'.split(''), type: 'letters' },
      { id: 'lowercase', name: 'Minuscules', characters: 'abcdefghijklmnopqrstuvwxyzàâæçéèêëîïôùûüÿœ'.split(''), type: 'letters' },
      { id: 'numbers', name: 'Chiffres', characters: '0123456789'.split(''), type: 'numbers' },
      { id: 'punctuation', name: 'Ponctuation', characters: commonPunctuation, type: 'punctuation' },
      createWordCategory('Mots', frenchWords),
      createSentenceCategory('Phrases', frenchSentences),
    ]
  },
  {
    code: 'es',
    name: 'Spanish',
    nativeName: 'Español',
    fontFamily: "'Quicksand', sans-serif",
    categories: [
      { id: 'uppercase', name: 'Mayúsculas', characters: 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZÁÉÍÓÚÜ'.split(''), type: 'letters' },
      { id: 'lowercase', name: 'Minúsculas', characters: 'abcdefghijklmnñopqrstuvwxyzáéíóúü'.split(''), type: 'letters' },
      { id: 'numbers', name: 'Números', characters: '0123456789'.split(''), type: 'numbers' },
      { id: 'punctuation', name: 'Puntuación', characters: ['.', ',', '!', '?', '¡', '¿', ';', ':', "'", '"', '-', '(', ')'], type: 'punctuation' },
      createWordCategory('Palabras', spanishWords),
      createSentenceCategory('Oraciones', spanishSentences),
    ]
  },
  {
    code: 'ar',
    name: 'Arabic',
    nativeName: 'العربية',
    fontFamily: "'Noto Sans Arabic', sans-serif",
    categories: [
      { id: 'letters', name: 'حروف', characters: arabicLetters, type: 'letters' },
      { id: 'numbers', name: 'أرقام', characters: arabicNumbers, type: 'numbers' },
      { id: 'punctuation', name: 'علامات ترقيط', characters: arabicPunctuation, type: 'punctuation' },
      createWordCategory('الكلمات', arabicWords),
      createSentenceCategory('الجمل', arabicSentences),
    ]
  },
  {
    code: 'ur',
    name: 'Urdu',
    nativeName: 'اردو',
    fontFamily: "'Noto Sans Arabic', sans-serif",
    categories: [
      { id: 'letters', name: 'حروف', characters: urduLetters, type: 'letters' },
      { id: 'numbers', name: 'نمبر', characters: urduNumbers, type: 'numbers' },
      { id: 'punctuation', name: 'علامات', characters: urduPunctuation, type: 'punctuation' },
      createWordCategory('الفاظ', urduWords),
      createSentenceCategory('جملے', urduSentences),
    ]
  },
  {
    code: 'ja',
    name: 'Japanese',
    nativeName: '日本語',
    fontFamily: "'Noto Sans JP', sans-serif",
    categories: [
      { id: 'hiragana', name: 'ひらがな', characters: japaneseHiragana, type: 'letters' },
      { id: 'katakana', name: 'カタカナ', characters: japaneseKatakana, type: 'letters' },
      { id: 'numbers', name: '数字', characters: '0123456789'.split(''), type: 'numbers' },
      { id: 'punctuation', name: '記号', characters: japanesePunctuation, type: 'punctuation' },
      createWordCategory('単語', japaneseWords),
      createSentenceCategory('文', japaneseSentences),
    ]
  },
  {
    code: 'ne',
    name: 'Nepali',
    nativeName: 'नेपाली',
    fontFamily: "'Noto Sans Devanagari', sans-serif",
    categories: [
      { id: 'vowels', name: 'स्वर', characters: nepaliVowels, type: 'letters' },
      { id: 'consonants', name: 'व्यंजन', characters: nepaliConsonants, type: 'letters' },
      { id: 'numbers', name: 'सङ्ख्या', characters: devanagariNumbers, type: 'numbers' },
      { id: 'punctuation', name: 'चिन्ह', characters: devanagariPunctuation, type: 'punctuation' },
      createWordCategory('शब्द', nepaliWords),
      createSentenceCategory('वाक्य', nepaliSentences),
    ]
  },
  {
    code: 'sa',
    name: 'Sanskrit',
    nativeName: 'संस्कृतम्',
    fontFamily: "'Noto Sans Devanagari', sans-serif",
    categories: [
      { id: 'vowels', name: 'स्वर', characters: sanskritVowels, type: 'letters' },
      { id: 'consonants', name: 'व्यंजन', characters: sanskritConsonants, type: 'letters' },
      { id: 'numbers', name: 'सङ्ख्या', characters: devanagariNumbers, type: 'numbers' },
      { id: 'punctuation', name: 'चिन्ह', characters: devanagariPunctuation, type: 'punctuation' },
      createWordCategory('पद', sanskritWords),
      createSentenceCategory('वाक्य', sanskritSentences),
    ]
  },
  {
    code: 'new',
    name: 'Newari',
    nativeName: 'नेपालभाषा',
    fontFamily: "'Noto Sans Devanagari', sans-serif",
    categories: [
      { id: 'vowels', name: 'स्वर', characters: newariVowels, type: 'letters' },
      { id: 'consonants', name: 'व्यंजन', characters: newariConsonants, type: 'letters' },
      { id: 'numbers', name: 'सङ्ख्या', characters: devanagariNumbers, type: 'numbers' },
      { id: 'punctuation', name: 'चिन्ह', characters: devanagariPunctuation, type: 'punctuation' },
      createWordCategory('शब्द', newariWords),
      createSentenceCategory('वाक्य', newariSentences),
    ]
  },
]

export function getLanguageByCode(code: string): Language | undefined {
  return LANGUAGES.find(lang => lang.code === code)
}

export function getWritingDirection(char: string): 'ltr' | 'rtl' {
  const rtlPattern = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/
  return rtlPattern.test(char) ? 'rtl' : 'ltr'
}

export function isComplexScript(char: string): boolean {
  const complexScriptPattern = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF\u3040-\u309F\u30A0-\u30FF\u0900-\u097F]/
  return complexScriptPattern.test(char)
}

export function getRandomCharacter(languageCode: string, categoryId?: string): string {
  const language = getLanguageByCode(languageCode)
  if (!language) return ''
  
  let categories = language.categories
  if (categoryId) {
    categories = categories.filter(c => c.id === categoryId)
  }
  
  // Filter out empty categories
  categories = categories.filter(c => c.characters && c.characters.length > 0)
  
  if (categories.length === 0) return ''
  
  // Randomly select a category
  const randomCategory = categories[Math.floor(Math.random() * categories.length)]
  
  // Randomly select a character from that category
  const randomChar = randomCategory.characters[Math.floor(Math.random() * randomCategory.characters.length)]
  
  return randomChar
}

export function getAllCharacters(languageCode: string): string[] {
  const language = getLanguageByCode(languageCode)
  if (!language) return []
  
  const allChars: string[] = []
  for (const category of language.categories) {
    allChars.push(...category.characters)
  }
  return allChars
}

const RTL_PATTERN = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/
const CJK_PATTERN = /[\u3400-\u9FFF\uF900-\uFAFF\u3040-\u309F\u30A0-\u30FF]/
const DEVANAGARI_PATTERN = /[\u0900-\u097F]/

export type ScriptFamilyForSlant = 'latin' | 'cjk' | 'devanagari' | 'arabic' | 'other'

export function detectScriptFamily(char: string): ScriptFamilyForSlant {
  if (DEVANAGARI_PATTERN.test(char)) return 'devanagari'
  if (CJK_PATTERN.test(char)) return 'cjk'
  if (RTL_PATTERN.test(char)) return 'arabic'
  return 'latin'
}

export function getSlantReferenceRad(char: string): number {
  const family = detectScriptFamily(char)
  switch (family) {
    case 'arabic':
      return Math.PI / 2
    case 'cjk':
      return Math.PI / 2
    case 'devanagari':
      return Math.PI / 2
    default:
      return 0
  }
}
