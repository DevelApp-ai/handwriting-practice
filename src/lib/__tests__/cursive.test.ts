import { describe, it, expect } from 'vitest'
import {
  layoutCursiveWord,
  ligatureScore,
  isCursiveWord,
  candidatePathsForGlyph,
} from '@/lib/cursive'
import { buildTemplatePaths } from '@/lib/strokeEval'

describe('layoutCursiveWord', () => {
  it('lays out one glyph slot per character with increasing offsets', () => {
    const layout = layoutCursiveWord('cat', 1)
    expect(layout.glyphs).toHaveLength(3)
    expect(layout.glyphs[0].offsetX).toBe(0)
    expect(layout.glyphs[1].offsetX).toBe(1)
    expect(layout.glyphs[2].offsetX).toBe(2)
    expect(layout.totalWidth).toBe(3)
  })

  it('carries per-glyph template paths', () => {
    const layout = layoutCursiveWord('a')
    expect(layout.glyphs[0].char).toBe('a')
    expect(layout.glyphs[0].template).toEqual(buildTemplatePaths('a'))
  })

  it('creates a junction between consecutive glyphs with templates', () => {
    const layout = layoutCursiveWord('ca')
    const hasTemplates = layout.glyphs.every((g) => g.template.length > 0)
    if (hasTemplates) {
      expect(layout.junctions.length).toBeGreaterThanOrEqual(1)
      const j = layout.junctions[0]
      expect(j.fromGlyph).toBe(0)
      expect(j.toGlyph).toBe(1)
      expect(j.path.length).toBeGreaterThan(1)
    }
  })

  it('handles glyphs without templates gracefully (no junction)', () => {
    const layout = layoutCursiveWord('zz')
    expect(layout.glyphs).toHaveLength(2)
  })

  it('respects a custom glyph width', () => {
    const layout = layoutCursiveWord('ab', 2)
    expect(layout.glyphs[0].width).toBe(2)
    expect(layout.totalWidth).toBe(4)
  })
})

describe('ligatureScore', () => {
  it('returns a high score for an identical junction', () => {
    const a = [
      { x: 0, y: 0 },
      { x: 0.5, y: 0 },
      { x: 1, y: 0 },
    ]
    expect(ligatureScore(a, a)).toBeGreaterThan(0.9)
  })

  it('returns a low score for divergent junctions', () => {
    const a = [
      { x: 0, y: 0 },
      { x: 0.5, y: 0 },
      { x: 1, y: 0 },
    ]
    const b = [
      { x: 0, y: 0 },
      { x: 0.5, y: 0.9 },
      { x: 1, y: 0 },
    ]
    expect(ligatureScore(a, b)).toBeLessThan(0.9)
  })

  it('returns 0 for degenerate input', () => {
    expect(ligatureScore([], [{ x: 0, y: 0 }])).toBe(0)
    expect(ligatureScore([{ x: 0, y: 0 }], [])).toBe(0)
  })
})

describe('candidatePathsForGlyph', () => {
  it('filters candidate points within a glyph slot', () => {
    const layout = layoutCursiveWord('ab', 1)
    const glyph = layout.glyphs[0]
    const strokes = [
      [
        { x: 0.1, y: 0.5 },
        { x: 0.5, y: 0.5 },
      ],
      [
        { x: 1.5, y: 0.5 },
        { x: 1.9, y: 0.5 },
      ],
    ]
    const forGlyph = candidatePathsForGlyph(strokes, glyph)
    expect(forGlyph).toHaveLength(1)
    expect(forGlyph[0].length).toBe(2)
  })

  it('returns empty when nothing falls in the slot', () => {
    const layout = layoutCursiveWord('ab', 1)
    const glyph = layout.glyphs[0]
    const strokes = [[{ x: 5, y: 5 }]]
    expect(candidatePathsForGlyph(strokes, glyph)).toEqual([])
  })
})

describe('isCursiveWord', () => {
  it('accepts multi-char strings without spaces within length limit', () => {
    expect(isCursiveWord('cat')).toBe(true)
    expect(isCursiveWord('ab')).toBe(true)
  })

  it('rejects single characters, sentences, and space-containing strings', () => {
    expect(isCursiveWord('a')).toBe(false)
    expect(isCursiveWord('hello world')).toBe(false)
    expect(isCursiveWord(' ')).toBe(false)
  })
})
