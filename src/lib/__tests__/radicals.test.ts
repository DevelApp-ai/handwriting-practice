import { describe, it, expect } from 'vitest'
import {
  RADICALS,
  DECOMPOSITIONS,
  getRadicalById,
  getDecomposition,
  groupByRadical,
  sharedRadicals,
} from '@/lib/radicals'

describe('RADICALS data', () => {
  it('contains the plan example radicals', () => {
    const chars = RADICALS.map((r) => r.char)
    expect(chars).toContain('氵')
    expect(chars).toContain('木')
    expect(chars).toContain('口')
  })
})

describe('getRadicalById', () => {
  it('returns the radical by id', () => {
    expect(getRadicalById('water')?.char).toBe('氵')
    expect(getRadicalById('tree')?.meaning).toBe('tree / wood')
  })

  it('returns undefined for unknown id', () => {
    expect(getRadicalById('nope')).toBeUndefined()
  })
})

describe('getDecomposition', () => {
  it('decomposes 林 into two tree radicals', () => {
    const d = getDecomposition('林')
    expect(d).toBeDefined()
    expect(d?.radicalIds).toEqual(['tree', 'tree'])
  })

  it('returns undefined for a character not in the table', () => {
    expect(getDecomposition('猫')).toBeUndefined()
  })
})

describe('groupByRadical', () => {
  it('groups decomposed characters by radical, largest first', () => {
    const groups = groupByRadical()
    expect(groups.length).toBeGreaterThan(0)
    for (let i = 1; i < groups.length; i++) {
      expect(groups[i - 1].chars.length).toBeGreaterThanOrEqual(groups[i].chars.length)
    }
  })

  it('includes the tree group with 林 and 森', () => {
    const groups = groupByRadical()
    const tree = groups.find((g) => g.radical.id === 'tree')
    expect(tree).toBeDefined()
    expect(tree?.chars).toContain('林')
    expect(tree?.chars).toContain('森')
  })

  it('filters to a provided character subset', () => {
    const groups = groupByRadical(['明', '河'])
    const allChars = groups.flatMap((g) => g.chars)
    expect(allChars).toContain('明')
    expect(allChars).toContain('河')
    expect(allChars).not.toContain('林')
  })
})

describe('sharedRadicals', () => {
  it('returns shared radicals between two characters', () => {
    const shared = sharedRadicals('河', '湖')
    expect(shared.map((r) => r.id)).toContain('water')
  })

  it('returns empty when no shared radical', () => {
    expect(sharedRadicals('明', '林')).toHaveLength(0)
  })

  it('returns empty for unknown characters', () => {
    expect(sharedRadicals('猫', '狗')).toHaveLength(0)
  })
})
