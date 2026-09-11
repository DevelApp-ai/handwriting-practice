// Curated radical decomposition table for common Hanzi/Kanji.
// Start small with the plan's examples (water 氵, tree 木, mouth 口, ...)
// rather than a full decomposition database; expand later.

export interface Radical {
  id: string
  char: string
  name: string
  meaning: string
  strokes: number
}

export interface RadicalEntry {
  char: string
  radicalIds: string[]
}

export const RADICALS: Radical[] = [
  { id: 'water', char: '氵', name: 'water', meaning: 'water (3-stroke form)', strokes: 3 },
  { id: 'water_full', char: '水', name: 'water-full', meaning: 'water (full)', strokes: 4 },
  { id: 'tree', char: '木', name: 'tree', meaning: 'tree / wood', strokes: 4 },
  { id: 'mouth', char: '口', name: 'mouth', meaning: 'mouth / opening', strokes: 3 },
  { id: 'person', char: '亻', name: 'person', meaning: 'person (left form)', strokes: 2 },
  { id: 'person_full', char: '人', name: 'person-full', meaning: 'person (full)', strokes: 2 },
  { id: 'heart', char: '心', name: 'heart', meaning: 'heart', strokes: 4 },
  { id: 'fire', char: '火', name: 'fire', meaning: 'fire', strokes: 4 },
  { id: 'earth', char: '土', name: 'earth', meaning: 'earth / dirt', strokes: 3 },
  { id: 'sun', char: '日', name: 'sun', meaning: 'sun / day', strokes: 4 },
  { id: 'moon', char: '月', name: 'moon', meaning: 'moon / month', strokes: 4 },
  { id: 'hand', char: '扌', name: 'hand', meaning: 'hand (left form)', strokes: 3 },
  { id: 'eye', char: '目', name: 'eye', meaning: 'eye', strokes: 5 },
  { id: 'woman', char: '女', name: 'woman', meaning: 'woman', strokes: 3 },
  { id: 'child', char: '子', name: 'child', meaning: 'child', strokes: 3 },
  { id: 'big', char: '大', name: 'big', meaning: 'big', strokes: 3 },
  { id: 'field', char: '田', name: 'field', meaning: 'field', strokes: 5 },
  { id: 'metal', char: '金', name: 'metal', meaning: 'metal / gold', strokes: 8 },
]

export const DECOMPOSITIONS: RadicalEntry[] = [
  { char: '林', radicalIds: ['tree', 'tree'] },
  { char: '森', radicalIds: ['tree', 'tree', 'tree'] },
  { char: '河', radicalIds: ['water', 'mouth'] },
  { char: '海', radicalIds: ['water', 'person_full'] },
  { char: '湖', radicalIds: ['water', 'big', 'moon'] },
  { char: '唱', radicalIds: ['mouth', 'sun'] },
  { char: '吐', radicalIds: ['mouth', 'earth'] },
  { char: '明', radicalIds: ['sun', 'moon'] },
  { char: '休', radicalIds: ['person', 'tree'] },
  { char: '你', radicalIds: ['person', 'child'] },
  { char: '好', radicalIds: ['woman', 'child'] },
  { char: '妈', radicalIds: ['woman', 'horse'] },
  { char: '灯', radicalIds: ['fire', 'metal'] },
  { char: '看', radicalIds: ['hand', 'eye'] },
  { char: '男', radicalIds: ['field', 'big'] },
  { char: '想', radicalIds: ['tree', 'eye', 'heart'] },
]

const RADICAL_BY_ID: Record<string, Radical> = Object.fromEntries(
  RADICALS.map((r) => [r.id, r]),
)

export function getRadicalById(id: string): Radical | undefined {
  return RADICAL_BY_ID[id]
}

export function getDecomposition(char: string): RadicalEntry | undefined {
  return DECOMPOSITIONS.find((d) => d.char === char)
}

export interface RadicalGroup {
  radical: Radical
  chars: string[]
}

export function groupByRadical(chars?: string[]): RadicalGroup[] {
  const source = chars
    ? DECOMPOSITIONS.filter((d) => chars.includes(d.char))
    : DECOMPOSITIONS
  const groups: Record<string, string[]> = {}
  for (const entry of source) {
    for (const rid of entry.radicalIds) {
      if (!groups[rid]) groups[rid] = []
      if (!groups[rid].includes(entry.char)) groups[rid].push(entry.char)
    }
  }
  const out: RadicalGroup[] = []
  for (const rid of Object.keys(groups)) {
    const radical = RADICAL_BY_ID[rid]
    if (radical) out.push({ radical, chars: groups[rid] })
  }
  out.sort((a, b) => b.chars.length - a.chars.length)
  return out
}

export function sharedRadicals(a: string, b: string): Radical[] {
  const da = getDecomposition(a)
  const db = getDecomposition(b)
  if (!da || !db) return []
  const shared = da.radicalIds.filter((rid) => db.radicalIds.includes(rid))
  return shared
    .map((rid) => RADICAL_BY_ID[rid])
    .filter((r): r is Radical => Boolean(r))
}
