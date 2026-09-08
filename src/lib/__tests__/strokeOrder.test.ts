import { describe, it, expect } from 'vitest'
import { generateBasicStrokeOrder } from '../strokeOrder'

describe('generateBasicStrokeOrder', () => {
  it('should return stroke data for Latin uppercase letters', () => {
    const result = generateBasicStrokeOrder('A')
    expect(result.character).toBe('A')
    expect(result.strokes.length).toBeGreaterThan(0)
    expect(result.strokes[0].points.length).toBeGreaterThan(0)
    expect(result.strokes[0].order).toBe(1)
  })

  it('should return stroke data for Latin lowercase letters', () => {
    const result = generateBasicStrokeOrder('a')
    expect(result.character).toBe('a')
    expect(result.strokes.length).toBeGreaterThan(0)
  })

  it('should return stroke data for numbers', () => {
    const result = generateBasicStrokeOrder('1')
    expect(result.character).toBe('1')
    expect(result.strokes.length).toBeGreaterThan(0)
  })

  it('should return stroke data for punctuation', () => {
    const result = generateBasicStrokeOrder('.')
    expect(result.character).toBe('.')
    expect(result.strokes.length).toBeGreaterThan(0)
  })

  it('should return empty strokes for words', () => {
    const result = generateBasicStrokeOrder('Hello')
    expect(result.character).toBe('Hello')
    expect(result.strokes.length).toBe(0)
  })

  it('should return stroke data for Arabic characters', () => {
    const result = generateBasicStrokeOrder('\u0627') // Alef
    expect(result.character).toBe('\u0627')
    expect(result.strokes.length).toBeGreaterThan(0)
  })

  it('should return stroke data for Japanese Hiragana', () => {
    const result = generateBasicStrokeOrder('\u3042') // Hiragana A
    expect(result.character).toBe('\u3042')
    expect(result.strokes.length).toBeGreaterThan(0)
  })

  it('should return stroke data for Japanese Katakana', () => {
    const result = generateBasicStrokeOrder('\u30A2') // Katakana A
    expect(result.character).toBe('\u30A2')
    expect(result.strokes.length).toBeGreaterThan(0)
  })

  it('should return stroke data for Nepali Devanagari', () => {
    const result = generateBasicStrokeOrder('\u0915') // Ka
    expect(result.character).toBe('\u0915')
    expect(result.strokes.length).toBeGreaterThan(0)
  })

  it('should return default stroke for unknown characters', () => {
    const result = generateBasicStrokeOrder('\uFFFF') // Unknown character
    expect(result.character).toBe('\uFFFF')
    expect(result.strokes.length).toBeGreaterThan(0)
  })

  it('should handle all uppercase letters', () => {
    for (let i = 0; i < 26; i++) {
      const char = String.fromCharCode(65 + i) // A-Z
      const result = generateBasicStrokeOrder(char)
      expect(result.character).toBe(char)
      expect(result.strokes.length).toBeGreaterThan(0)
    }
  })

  it('should handle all numbers', () => {
    for (let i = 0; i < 10; i++) {
      const char = String.fromCharCode(48 + i) // 0-9
      const result = generateBasicStrokeOrder(char)
      expect(result.character).toBe(char)
      expect(result.strokes.length).toBeGreaterThan(0)
    }
  })

  it('should return stroke data for Danish uppercase letters', () => {
    const danishUppercase = ['Æ', 'Ø', 'Å']
    danishUppercase.forEach(char => {
      const result = generateBasicStrokeOrder(char)
      expect(result.character).toBe(char)
      expect(result.strokes.length).toBeGreaterThan(0)
    })
  })

  it('should return stroke data for Danish lowercase letters', () => {
    const danishLowercase = ['æ', 'ø', 'å']
    danishLowercase.forEach(char => {
      const result = generateBasicStrokeOrder(char)
      expect(result.character).toBe(char)
      expect(result.strokes.length).toBeGreaterThan(0)
    })
  })

  it('should return stroke data for German special characters', () => {
    const germanChars = ['\u00c4', '\u00d6', '\u00dc', '\u00e4', '\u00f6', '\u00fc', '\u00df']
    germanChars.forEach(char => {
      const result = generateBasicStrokeOrder(char)
      expect(result.character).toBe(char)
      expect(result.strokes.length).toBeGreaterThan(0)
    })
  })

  it('should return stroke data for French special characters', () => {
    const frenchChars = ['\u00c0', '\u00c2', '\u00c7', '\u00c9', '\u00c8', '\u00ca', '\u00cb', '\u00ce', '\u00cf', '\u00d4', '\u00d9', '\u00db', '\u00e0', '\u00e2', '\u00e7', '\u00e9', '\u00e8', '\u00ea', '\u00eb', '\u00ee', '\u00ef', '\u00f4', '\u00fb']
    frenchChars.forEach(char => {
      const result = generateBasicStrokeOrder(char)
      expect(result.character).toBe(char)
      expect(result.strokes.length).toBeGreaterThan(0)
    })
  })

  it('should return stroke data for Spanish special characters', () => {
    const spanishChars = ['\u00d1', '\u00c1', '\u00c9', '\u00cd', '\u00d3', '\u00da', '\u00f1', '\u00e1', '\u00e9', '\u00ed', '\u00f3', '\u00fa']
    spanishChars.forEach(char => {
      const result = generateBasicStrokeOrder(char)
      expect(result.character).toBe(char)
      expect(result.strokes.length).toBeGreaterThan(0)
    })
  })

  it('should return stroke data for Devanagari characters used in Sanskrit and Newari', () => {
    const devanagariChars = ['\u0905', '\u0915', '\u0917', '\u0928', '\u0930', '\u0904', '\u0958', '\u0959', '\u095a']
    devanagariChars.forEach(char => {
      const result = generateBasicStrokeOrder(char)
      expect(result.character).toBe(char)
      expect(result.strokes.length).toBeGreaterThan(0)
    })
  })
})
