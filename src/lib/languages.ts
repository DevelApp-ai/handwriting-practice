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
}

export const LANGUAGES: Language[] = [
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    fontFamily: "'Quicksand', sans-serif",
    categories: [
      { id: 'uppercase', name: 'Uppercase', characters: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('') },
      { id: 'lowercase', name: 'Lowercase', characters: 'abcdefghijklmnopqrstuvwxyz'.split('') },
      { id: 'numbers', name: 'Numbers', characters: '0123456789'.split('') },
      { id: 'punctuation', name: 'Punctuation', characters: ['.', ',', '!', '?', ';', ':', "'", '"', '-', '(', ')'] },
      { id: 'words', name: 'Words', characters: ['cat', 'dog', 'sun', 'fun', 'bat', 'book', 'tree', 'bird', 'fish', 'moon', 'apple', 'happy', 'smile', 'house', 'water'] },
      { id: 'sentences', name: 'Sentences', characters: ['The cat sat.', 'I am happy!', 'What is it?', 'Hello, world!', 'How are you?', 'It is sunny.', 'I like pizza.', 'She can run fast.', 'We go to school.', 'The sky is blue.'] },
    ]
  },
  {
    code: 'da',
    name: 'Danish',
    nativeName: 'Dansk',
    fontFamily: "'Quicksand', sans-serif",
    categories: [
      { id: 'uppercase', name: 'Store bogstaver', characters: 'ABCDEFGHIJKLMNOPQRSTUVWXYZÆØÅ'.split('') },
      { id: 'lowercase', name: 'Små bogstaver', characters: 'abcdefghijklmnopqrstuvwxyzæøå'.split('') },
      { id: 'numbers', name: 'Tal', characters: '0123456789'.split('') },
      { id: 'punctuation', name: 'Tegnsætning', characters: ['.', ',', '!', '?', ';', ':', "'", '"', '-', '(', ')'] },
      { id: 'words', name: 'Ord', characters: ['kat', 'hund', 'sol', 'måne', 'bog', 'træ', 'fugl', 'fisk', 'hus', 'vand', 'æble', 'glad', 'smil', 'køre', 'øje'] },
      { id: 'sentences', name: 'Sætninger', characters: ['Jeg er glad.', 'Hvordan har du det?', 'Katten sover.', 'Det er solskin i dag.', 'Jeg kan lide mad.', 'Hvad hedder du?', 'Bogen er rød.', 'Vi går i skole.', 'Himlen er blå.', 'Fugle flyver højt.'] },
    ]
  },
  {
    code: 'de',
    name: 'German',
    nativeName: 'Deutsch',
    fontFamily: "'Quicksand', sans-serif",
    categories: [
      { id: 'uppercase', name: 'Großbuchstaben', characters: 'ABCDEFGHIJKLMNOPQRSTUVWXYZÄÖÜẞ'.split('') },
      { id: 'lowercase', name: 'Kleinbuchstaben', characters: 'abcdefghijklmnopqrstuvwxyzäöüß'.split('') },
      { id: 'numbers', name: 'Zahlen', characters: '0123456789'.split('') },
      { id: 'punctuation', name: 'Zeichensetzung', characters: ['.', ',', '!', '?', ';', ':', "'", '"', '-', '(', ')'] },
      { id: 'words', name: 'Wörter', characters: ['Katze', 'Hund', 'Sonne', 'Mond', 'Buch', 'Baum', 'Vogel', 'Fisch', 'Haus', 'Wasser', 'Apfel', 'glücklich', 'lächeln', 'über', 'schön'] },
      { id: 'sentences', name: 'Sätze', characters: ['Ich bin glücklich.', 'Wie geht es dir?', 'Die Katze schläft.', 'Es ist sonnig heute.', 'Ich mag Essen.', 'Wie heißt du?', 'Das Buch ist rot.', 'Wir gehen zur Schule.', 'Der Himmel ist blau.', 'Vögel fliegen hoch.'] },
    ]
  },
  {
    code: 'fr',
    name: 'French',
    nativeName: 'Français',
    fontFamily: "'Quicksand', sans-serif",
    categories: [
      { id: 'uppercase', name: 'Majuscules', characters: 'ABCDEFGHIJKLMNOPQRSTUVWXYZÀÂÆÇÉÈÊËÏÎÔÙÛÜ'.split('') },
      { id: 'lowercase', name: 'Minuscules', characters: 'abcdefghijklmnopqrstuvwxyzàâæçéèêëïîôùûü'.split('') },
      { id: 'numbers', name: 'Chiffres', characters: '0123456789'.split('') },
      { id: 'punctuation', name: 'Ponctuation', characters: ['.', ',', '!', '?', ';', ':', "'", '"', '-', '(', ')'] },
      { id: 'words', name: 'Mots', characters: ['chat', 'chien', 'soleil', 'lune', 'livre', 'arbre', 'oiseau', 'poisson', 'maison', 'eau', 'pomme', 'heureux', 'sourire', 'café', 'naïve'] },
      { id: 'sentences', name: 'Phrases', characters: ['Je suis heureux.', 'Comment allez-vous?', 'Le chat dort.', "Il fait soleil aujourd'hui.", "J'aime la nourriture.", 'Comment tu t\'appelles?', 'Le livre est rouge.', 'Nous allons à l\'école.', 'Le ciel est bleu.', 'Les oiseaux volent haut.'] },
    ]
  },
  {
    code: 'es',
    name: 'Spanish',
    nativeName: 'Español',
    fontFamily: "'Quicksand', sans-serif",
    categories: [
      { id: 'uppercase', name: 'Mayúsculas', characters: 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZÁÉÍÓÚÜ'.split('') },
      { id: 'lowercase', name: 'Minúsculas', characters: 'abcdefghijklmnñopqrstuvwxyzáéíóúü'.split('') },
      { id: 'numbers', name: 'Números', characters: '0123456789'.split('') },
      { id: 'punctuation', name: 'Puntuación', characters: ['.', ',', '!', '?', '¡', '¿', ';', ':', "'", '"', '-', '(', ')'] },
      { id: 'words', name: 'Palabras', characters: ['gato', 'perro', 'sol', 'luna', 'libro', 'árbol', 'pájaro', 'pez', 'casa', 'agua', 'manzana', 'feliz', 'sonrisa', 'niño', 'señor'] },
      { id: 'sentences', name: 'Oraciones', characters: ['¡Estoy feliz!', '¿Cómo estás?', 'El gato duerme.', 'Hace sol hoy.', 'Me gusta la comida.', '¿Cómo te llamas?', 'El libro es rojo.', 'Vamos a la escuela.', 'El cielo es azul.', 'Los pájaros vuelan alto.'] },
    ]
  },
  {
    code: 'ar',
    name: 'Arabic',
    nativeName: 'العربية',
    fontFamily: "'Noto Sans Arabic', sans-serif",
    categories: [
      { id: 'letters', name: 'حروف', characters: ['ا', 'ب', 'ت', 'ث', 'ج', 'ح', 'خ', 'د', 'ذ', 'ر', 'ز', 'س', 'ش', 'ص', 'ض', 'ط', 'ظ', 'ع', 'غ', 'ف', 'ق', 'ك', 'ل', 'م', 'ن', 'ه', 'و', 'ي'] },
      { id: 'numbers', name: 'أرقام', characters: '٠١٢٣٤٥٦٧٨٩'.split('') },
      { id: 'words', name: 'كلمات', characters: ['قطة', 'كلب', 'شمس', 'قمر', 'كتاب', 'شجرة', 'طائر', 'سمكة', 'بيت', 'ماء'] },
    ]
  },
  {
    code: 'ur',
    name: 'Urdu',
    nativeName: 'اردو',
    fontFamily: "'Noto Sans Arabic', sans-serif",
    categories: [
      { id: 'letters', name: 'حروف', characters: ['ا', 'ب', 'پ', 'ت', 'ٹ', 'ث', 'ج', 'چ', 'ح', 'خ', 'د', 'ڈ', 'ذ', 'ر', 'ڑ', 'ز', 'ژ', 'س', 'ش', 'ص', 'ض', 'ط', 'ظ', 'ع', 'غ', 'ف', 'ق', 'ک', 'گ', 'ل', 'م', 'ن', 'ں', 'و', 'ہ', 'ھ', 'ء', 'ی', 'ے'] },
      { id: 'numbers', name: 'نمبر', characters: '۰۱۲۳۴۵۶۷۸۹'.split('') },
      { id: 'words', name: 'الفاظ', characters: ['بلی', 'کتا', 'سورج', 'چاند', 'کتاب', 'درخت', 'پرندہ', 'مچھلی', 'گھر', 'پانی'] },
    ]
  },
  {
    code: 'ja',
    name: 'Japanese',
    nativeName: '日本語',
    fontFamily: "'Noto Sans JP', sans-serif",
    categories: [
      { id: 'hiragana', name: 'ひらがな', characters: ['あ', 'い', 'う', 'え', 'お', 'か', 'き', 'く', 'け', 'こ', 'さ', 'し', 'す', 'せ', 'そ', 'た', 'ち', 'つ', 'て', 'と', 'な', 'に', 'ぬ', 'ね', 'の', 'は', 'ひ', 'ふ', 'へ', 'ほ', 'ま', 'み', 'む', 'め', 'も', 'や', 'ゆ', 'よ', 'ら', 'り', 'る', 'れ', 'ろ', 'わ', 'を', 'ん'] },
      { id: 'katakana', name: 'カタカナ', characters: ['ア', 'イ', 'ウ', 'エ', 'オ', 'カ', 'キ', 'ク', 'ケ', 'コ', 'サ', 'シ', 'ス', 'セ', 'ソ', 'タ', 'チ', 'ツ', 'テ', 'ト', 'ナ', 'ニ', 'ヌ', 'ネ', 'ノ', 'ハ', 'ヒ', 'フ', 'ヘ', 'ホ', 'マ', 'ミ', 'ム', 'メ', 'モ', 'ヤ', 'ユ', 'ヨ', 'ラ', 'リ', 'ル', 'レ', 'ロ', 'ワ', 'ヲ', 'ン'] },
      { id: 'numbers', name: '数字', characters: '0123456789'.split('') },
    ]
  },
  {
    code: 'ne',
    name: 'Nepali',
    nativeName: 'नेपाली',
    fontFamily: "'Noto Sans Devanagari', sans-serif",
    categories: [
      { id: 'vowels', name: 'स्वर', characters: ['अ', 'आ', 'इ', 'ई', 'उ', 'ऊ', 'ऋ', 'ए', 'ऐ', 'ओ', 'औ', 'अं', 'अः'] },
      { id: 'consonants', name: 'व्यञ्जन', characters: ['क', 'ख', 'ग', 'घ', 'ङ', 'च', 'छ', 'ज', 'झ', 'ञ', 'ट', 'ठ', 'ड', 'ढ', 'ण', 'त', 'थ', 'द', 'ध', 'न', 'प', 'फ', 'ब', 'भ', 'म', 'य', 'र', 'ल', 'व', 'श', 'ष', 'स', 'ह', 'क्ष', 'त्र', 'ज्ञ'] },
      { id: 'numbers', name: 'संख्या', characters: '०१२३४५६७८९'.split('') },
    ]
  },
  {
    code: 'sa',
    name: 'Sanskrit',
    nativeName: '\u0938\u0928\u094d\u0938\u094d\u0915\u0943\u0924',
    fontFamily: "'Noto Sans Devanagari', sans-serif",
    categories: [
      { id: 'vowels', name: '\u0938\u094d\u0935\u0930', characters: ['\u0905', '\u0906', '\u0907', '\u0908', '\u0909', '\u090a', '\u090b', '\u090f', '\u0910', '\u0913', '\u0914'] },
      { id: 'consonants', name: '\u0935\u094d\u092f\u091e\u094d\u091c\u0928', characters: ['\u0915', '\u0916', '\u0917', '\u0918', '\u0919', '\u091a', '\u091b', '\u091c', '\u091d', '\u091e', '\u091f', '\u0920', '\u0921', '\u0922', '\u0923', '\u0924', '\u0925', '\u0926', '\u0927', '\u0928', '\u092a', '\u092b', '\u092c', '\u092d', '\u092e', '\u092f', '\u0930', '\u0932', '\u0935', '\u0936', '\u0937', '\u0938', '\u0939'] },
      { id: 'numbers', name: '\u0938\u0902\u0916\u094d\u092f\u093e', characters: '\u0966\u0967\u0968\u0969\u096a\u096b\u096c\u096d\u096e\u096f'.split('') },
    ]
  },
  {
    code: 'new',
    name: 'Newari',
    nativeName: '\u0928\u0947\u092a\u093e\u0932 \u092d\u094d\u092f\u093e\u0938',
    fontFamily: "'Noto Sans Devanagari', sans-serif",
    categories: [
      { id: 'vowels', name: '\u0938\u094d\u0935\u0930', characters: ['\u0904', '\u0905', '\u0906', '\u0907', '\u0908', '\u0909', '\u090a', '\u090b', '\u090f', '\u0910'] },
      { id: 'consonants', name: '\u0935\u094d\u092f\u091e\u094d\u091c\u0928', characters: ['\u0915', '\u0916', '\u0917', '\u0918', '\u0919', '\u091a', '\u091b', '\u091c', '\u091d', '\u091e', '\u091f', '\u0920', '\u0921', '\u0922', '\u0923', '\u0924', '\u0925', '\u0926', '\u0927', '\u0928', '\u092a', '\u092b', '\u092c', '\u092d', '\u092e', '\u092f', '\u0930', '\u0932', '\u0935', '\u0936', '\u0937', '\u0938', '\u0939', '\u0958', '\u0959', '\u095a'] },
      { id: 'numbers', name: '\u0938\u0902\u0916\u094d\u092f\u093e', characters: '\u0966\u0967\u0968\u0969\u096a\u096b\u096c\u096d\u096e\u096f'.split('') },
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
