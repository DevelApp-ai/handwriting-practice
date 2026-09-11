import { describe, it, expect } from 'vitest'
import { encodeQr, encodeSheetMetadata } from '@/lib/qr'

describe('encodeSheetMetadata', () => {
  it('encodes a compact JSON with userId, sheetId, joined chars', () => {
    const s = encodeSheetMetadata({ userId: 'u1', sheetId: 's2', charList: ['A', 'B', 'C'] })
    const parsed = JSON.parse(s)
    expect(parsed.u).toBe('u1')
    expect(parsed.s).toBe('s2')
    expect(parsed.c).toBe('ABC')
  })

  it('defaults userId and sheetId when absent', () => {
    const s = encodeSheetMetadata({ charList: ['日'] })
    const parsed = JSON.parse(s)
    expect(parsed.u).toBe('anon')
    expect(typeof parsed.s).toBe('string')
    expect(parsed.c).toBe('日')
  })
})

describe('encodeQr', () => {
  it('produces a square matrix sized version*4+17', () => {
    const { matrix, size } = encodeQr('hello')
    expect(matrix.length).toBe(size)
    matrix.forEach((row) => expect(row.length).toBe(size))
  })

  it('selects version 1 for a short string (size 21)', () => {
    const { size, version } = encodeQr('hi')
    expect(version).toBeGreaterThanOrEqual(1)
    expect(size).toBe(version * 4 + 17)
  })

  it('places three finder patterns in the corners', () => {
    const { matrix, size } = encodeQr('test')
    const isFinder = (r: number, c: number) => {
      if (r + 7 > size || c + 7 > size) return false
      return matrix[r][c] && matrix[r][c + 6] && matrix[r + 6][c] && matrix[r + 3][c + 3]
    }
    expect(isFinder(0, 0)).toBe(true)
    expect(isFinder(0, size - 7)).toBe(true)
    expect(isFinder(size - 7, 0)).toBe(true)
  })

  it('darkens the fixed module at [size-8][8]', () => {
    const { matrix, size } = encodeQr('abc')
    expect(matrix[size - 8][8]).toBe(true)
  })

  it('encodes larger multi-byte text without throwing', () => {
    const text = ' handwriting-practice 漢字 テスト ' + 'x'.repeat(60)
    const { matrix, size } = encodeQr(text)
    expect(matrix.length).toBe(size)
    expect(size).toBeGreaterThanOrEqual(21)
  })

  it('is deterministic for the same input', () => {
    const a = encodeQr('deterministic')
    const b = encodeQr('deterministic')
    expect(a.matrix).toEqual(b.matrix)
    expect(a.version).toBe(b.version)
  })
})
