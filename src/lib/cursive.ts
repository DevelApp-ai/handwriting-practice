import { frechet, Path2D } from '@/lib/strokeEval'
import { buildTemplatePaths } from '@/lib/strokeEval'

export interface GlyphLayout {
  char: string
  index: number
  offsetX: number
  width: number
  template: Path2D[]
}

export interface LigatureJunction {
  fromGlyph: number
  toGlyph: number
  exitPoint: { x: number; y: number }
  entryPoint: { x: number; y: number }
  path: Path2D
}

export interface CursiveLayout {
  glyphs: GlyphLayout[]
  junctions: LigatureJunction[]
  totalWidth: number
}

const GLYPH_SLOT = 1
const JUNCTION_SAMPLES = 12

function samplePath(a: { x: number; y: number }, b: { x: number; y: number }, n: number): Path2D {
  const out: Path2D = []
  for (let i = 0; i < n; i++) {
    const t = i / (n - 1)
    out.push({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t })
  }
  return out
}

function lastPointOf(template: Path2D[]): { x: number; y: number } | null {
  for (let i = template.length - 1; i >= 0; i--) {
    if (template[i].length > 0) return template[i][template[i].length - 1]
  }
  return null
}

function firstPointOf(template: Path2D[]): { x: number; y: number } | null {
  for (let i = 0; i < template.length; i++) {
    if (template[i].length > 0) return template[i][0]
  }
  return null
}

export function layoutCursiveWord(word: string, glyphWidth: number = GLYPH_SLOT): CursiveLayout {
  const chars = Array.from(word)
  const glyphs: GlyphLayout[] = []
  const junctions: LigatureJunction[] = []
  let cursor = 0

  chars.forEach((ch, i) => {
    const template = buildTemplatePaths(ch)
    glyphs.push({
      char: ch,
      index: i,
      offsetX: cursor,
      width: glyphWidth,
      template,
    })
    cursor += glyphWidth
  })

  for (let i = 0; i < glyphs.length - 1; i++) {
    const from = glyphs[i]
    const to = glyphs[i + 1]
    const exit = lastPointOf(from.template)
    const entry = firstPointOf(to.template)
    if (!exit || !entry) continue
    const exitAbs = { x: exit.x + from.offsetX, y: exit.y }
    const entryAbs = { x: entry.x + to.offsetX, y: entry.y }
    junctions.push({
      fromGlyph: i,
      toGlyph: i + 1,
      exitPoint: exitAbs,
      entryPoint: entryAbs,
      path: samplePath(exitAbs, entryAbs, JUNCTION_SAMPLES),
    })
  }

  return {
    glyphs,
    junctions,
    totalWidth: cursor,
  }
}

export function candidatePathsForGlyph(
  candidateStrokes: Path2D[],
  glyph: GlyphLayout,
): Path2D[] {
  const xMin = glyph.offsetX
  const xMax = glyph.offsetX + glyph.width
  return candidateStrokes
    .map((stroke) =>
      stroke.filter((p) => p.x >= xMin - 0.001 && p.x <= xMax + 0.001),
    )
    .filter((s) => s.length > 0)
}

export function ligatureScore(
  candidateJunction: Path2D,
  templateJunction: Path2D,
): number {
  if (candidateJunction.length < 2 || templateJunction.length < 2) return 0
  const f = frechet(candidateJunction, templateJunction)
  return Math.max(0, Math.min(1, 1 - f * 4))
}

export function isCursiveWord(character: string): boolean {
  if (character.length < 2) return false
  if (character.length > 15) return false
  return !character.includes(' ')
}
