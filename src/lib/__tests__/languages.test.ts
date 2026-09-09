import { describe, it, expect } from 'vitest'
import { LANGUAGES, getLanguageByCode, getRandomCharacter, getAllCharacters, getWritingDirection, isComplexScript } from '../languages'

describe('Languages Data', () => {
  describe('Language List', () => {
    it('should have all expected languages', () => {
      const expectedLanguages = ['en', 'da', 'de', 'fr', 'es', 'ar', 'ur', 'ja', 'ne', 'sa', 'new']
      const actualCodes = LANGUAGES.map(lang => lang.code)
      
      expectedLanguages.forEach(code => {
        expect(actualCodes).toContain(code)
      })
    })

    it('should have 11 languages', () => {
      expect(LANGUAGES.length).toBe(11)
    })
  })

  describe('Language Structure', () => {
    it('each language should have required properties', () => {
      LANGUAGES.forEach(language => {
        expect(language).toHaveProperty('code')
        expect(language).toHaveProperty('name')
        expect(language).toHaveProperty('nativeName')
        expect(language).toHaveProperty('fontFamily')
        expect(language).toHaveProperty('categories')
        expect(Array.isArray(language.categories)).toBe(true)
      })
    })

    it('each category should have required properties', () => {
      LANGUAGES.forEach(language => {
        language.categories.forEach(category => {
          expect(category).toHaveProperty('id')
          expect(category).toHaveProperty('name')
          expect(category).toHaveProperty('characters')
          expect(Array.isArray(category.characters)).toBe(true)
        })
      })
    })
  })

  describe('Category Types', () => {
    it('should have categories with type information', () => {
      LANGUAGES.forEach(language => {
        language.categories.forEach(category => {
          if (category.type) {
            expect(['letters', 'numbers', 'words', 'sentences', 'punctuation']).toContain(category.type)
          }
        })
      })
    })

    it('all languages should have words and sentences categories', () => {
      LANGUAGES.forEach(language => {
        const categoryIds = language.categories.map(c => c.id)
        expect(categoryIds).toContain('words')
        expect(categoryIds).toContain('sentences')
      })
    })

    it('all languages should have punctuation category', () => {
      LANGUAGES.forEach(language => {
        const categoryIds = language.categories.map(c => c.id)
        expect(categoryIds).toContain('punctuation')
      })
    })
  })

  describe('Language Content', () => {
    it('words categories should have at least 10 words', () => {
      LANGUAGES.forEach(language => {
        const wordsCategory = language.categories.find(c => c.id === 'words')
        if (wordsCategory) {
          expect(wordsCategory.characters.length).toBeGreaterThanOrEqual(10)
        }
      })
    })

    it('sentences categories should have at least 3 sentences', () => {
      LANGUAGES.forEach(language => {
        const sentencesCategory = language.categories.find(c => c.id === 'sentences')
        if (sentencesCategory) {
          expect(sentencesCategory.characters.length).toBeGreaterThanOrEqual(3)
        }
      })
    })

    it('letters categories should have characters', () => {
      LANGUAGES.forEach(language => {
        const lettersCategory = language.categories.find(c => 
          c.id === 'letters' || c.id === 'uppercase' || c.id === 'lowercase' || 
          c.id === 'vowels' || c.id === 'consonants' || c.id === 'hiragana' || 
          c.id === 'katakana'
        )
        if (lettersCategory) {
          expect(lettersCategory.characters.length).toBeGreaterThan(0)
        }
      })
    })

    it('numbers categories should have 10 digits', () => {
      LANGUAGES.forEach(language => {
        const numbersCategory = language.categories.find(c => c.id === 'numbers')
        if (numbersCategory) {
          // Numbers can be in different formats (Arabic, Devanagari, etc.)
          expect(numbersCategory.characters.length).toBeGreaterThanOrEqual(10)
        }
      })
    })
  })

  describe('getLanguageByCode', () => {
    it('should return correct language by code', () => {
      const english = getLanguageByCode('en')
      expect(english).toBeDefined()
      expect(english?.name).toBe('English')
    })

    it('should return undefined for unknown code', () => {
      const unknown = getLanguageByCode('xyz')
      expect(unknown).toBeUndefined()
    })
  })

  describe('getRandomCharacter', () => {
    it('should return a character from the language', () => {
      const char = getRandomCharacter('en')
      expect(typeof char).toBe('string')
      expect(char.length).toBeGreaterThan(0)
    })

    it('should return empty string for unknown language', () => {
      const char = getRandomCharacter('xyz')
      expect(char).toBe('')
    })

    it('should return character from specific category', () => {
      const char = getRandomCharacter('en', 'uppercase')
      expect(typeof char).toBe('string')
      expect(char).toMatch(/^[A-Z]$/)
    })

    it('should return words when words category is specified', () => {
      const char = getRandomCharacter('en', 'words')
      expect(typeof char).toBe('string')
      expect(char.length).toBeGreaterThan(1)
    })

    it('should return sentences when sentences category is specified', () => {
      const char = getRandomCharacter('en', 'sentences')
      expect(typeof char).toBe('string')
      expect(char).toContain(' ')
    })
  })

  describe('getAllCharacters', () => {
    it('should return all characters from a language', () => {
      const allChars = getAllCharacters('en')
      expect(Array.isArray(allChars)).toBe(true)
      expect(allChars.length).toBeGreaterThan(0)
    })

    it('should include characters from all categories', () => {
      const allChars = getAllCharacters('en')
      const english = getLanguageByCode('en')
      
      if (english) {
        const totalCategoryChars = english.categories.reduce(
          (sum, cat) => sum + cat.characters.length,
          0
        )
        expect(allChars.length).toBe(totalCategoryChars)
      }
    })

    it('should return empty array for unknown language', () => {
      const chars = getAllCharacters('xyz')
      expect(chars).toEqual([])
    })
  })

  describe('getWritingDirection', () => {
    it('should return ltr for Latin characters', () => {
      expect(getWritingDirection('A')).toBe('ltr')
      expect(getWritingDirection('a')).toBe('ltr')
      expect(getWritingDirection('Hello')).toBe('ltr')
    })

    it('should return rtl for Arabic characters', () => {
      expect(getWritingDirection('\u0627')).toBe('rtl') // Alef
      expect(getWritingDirection('\u0643')).toBe('rtl') // Kaf
    })

    it('should return rtl for Urdu characters', () => {
      expect(getWritingDirection('\u0627')).toBe('rtl')
      expect(getWritingDirection('\u06a9')).toBe('rtl')
    })

    it('should return ltr for Devanagari characters', () => {
      expect(getWritingDirection('\u0915')).toBe('ltr') // Ka
      expect(getWritingDirection('\u0905')).toBe('ltr') // A
    })

    it('should return ltr for Hiragana characters', () => {
      expect(getWritingDirection('\u3042')).toBe('ltr') // A
      expect(getWritingDirection('\u3044')).toBe('ltr') // I
    })
  })

  describe('isComplexScript', () => {
    it('should return true for Arabic script', () => {
      expect(isComplexScript('\u0627')).toBe(true)
    })

    it('should return true for Devanagari script', () => {
      expect(isComplexScript('\u0915')).toBe(true)
    })

    it('should return true for Hiragana script', () => {
      expect(isComplexScript('\u3042')).toBe(true)
    })

    it('should return false for Latin script', () => {
      expect(isComplexScript('A')).toBe(false)
      expect(isComplexScript('a')).toBe(false)
    })
  })
})
