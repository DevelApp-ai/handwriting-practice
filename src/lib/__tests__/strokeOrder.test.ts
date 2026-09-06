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
})
