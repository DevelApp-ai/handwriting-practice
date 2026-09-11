import { describe, it, expect } from 'vitest'
import {
  drawFourLineGrid,
  drawTianzigeGrid,
  drawMizigeGrid,
  drawJiugonggeGrid,
  drawSlantGuide,
  drawShirorekhaLine,
  selectGridKind,
  detectScriptFamily,
  renderGrid,
  ScriptFamily,
} from '../grid'
import { GridKind } from '../types'

interface MockStroke {
  kind: string
  args: (number | string)[]
}

function createMockCtx() {
  const strokes: MockStroke[] = []
  const ctx: any = {
    strokes,
    setLineDash(d: number[]) {
      this._dash = d
    },
    beginPath() {
      this._inPath = true
    },
    moveTo(x: number, y: number) {
      strokes.push({ kind: 'moveTo', args: [x, y] })
    },
    lineTo(x: number, y: number) {
      strokes.push({ kind: 'lineTo', args: [x, y] })
    },
    stroke() {
      strokes.push({ kind: 'stroke', args: [] })
    },
    arc(cx: number, cy: number, r: number, a: number, b: number) {
      strokes.push({ kind: 'arc', args: [cx, cy, r, a, b] })
    },
    strokeRect(x: number, y: number, w: number, h: number) {
      strokes.push({ kind: 'strokeRect', args: [x, y, w, h] })
    },
    fillText(text: string, x: number, y: number) {
      strokes.push({ kind: 'fillText', args: [text, x, y] })
    },
    fill() {
      strokes.push({ kind: 'fill', args: [] })
    },
    closePath() {},
    strokeText() {},
  }
  return ctx
}

describe('grid renderers', () => {
  it('four-line grid draws 4 horizontal strokes plus labels', () => {
    const ctx = createMockCtx()
    drawFourLineGrid(ctx as unknown as CanvasRenderingContext2D, 400, 400, { showLabels: true })
    const strokes = (ctx as any).strokes as MockStroke[]
    const strokeCalls = strokes.filter((s) => s.kind === 'stroke').length
    expect(strokeCalls).toBe(4)
    const labels = strokes.filter((s) => s.kind === 'fillText').map((s) => s.args[0])
    expect(labels).toContain('Ascender')
    expect(labels).toContain('Midline')
    expect(labels).toContain('Baseline')
    expect(labels).toContain('Descender')
  })

  it('four-line grid omits labels when showLabels is false', () => {
    const ctx = createMockCtx()
    drawFourLineGrid(ctx as unknown as CanvasRenderingContext2D, 400, 400, { showLabels: false })
    const labels = ((ctx as any).strokes as MockStroke[]).filter((s) => s.kind === 'fillText')
    expect(labels.length).toBe(0)
  })

  it('tianzige grid draws an outer square plus cross and diagonals', () => {
    const ctx = createMockCtx()
    drawTianzigeGrid(ctx as unknown as CanvasRenderingContext2D, 300, 300)
    const strokes = (ctx as any).strokes as MockStroke[]
    const rects = strokes.filter((s) => s.kind === 'strokeRect').length
    expect(rects).toBe(1)
    const lineTos = strokes.filter((s) => s.kind === 'lineTo')
    expect(lineTos.length).toBeGreaterThanOrEqual(4)
  })

  it('mizige grid draws outer square, diagonals, and an arc (8-segment star)', () => {
    const ctx = createMockCtx()
    drawMizigeGrid(ctx as unknown as CanvasRenderingContext2D, 300, 300)
    const strokes = (ctx as any).strokes as MockStroke[]
    expect(strokes.some((s) => s.kind === 'strokeRect')).toBe(true)
    expect(strokes.some((s) => s.kind === 'arc')).toBe(true)
  })

  it('jiugongge grid draws 4 interior division lines (2 vertical + 2 horizontal => 3x3 squares)', () => {
    const ctx = createMockCtx()
    drawJiugonggeGrid(ctx as unknown as CanvasRenderingContext2D, 300, 300)
    const lineTos = ((ctx as any).strokes as MockStroke[]).filter((s) => s.kind === 'lineTo')
    const moveTos = ((ctx as any).strokes as MockStroke[]).filter((s) => s.kind === 'moveTo')
    expect(lineTos.length).toBe(4)
    expect(moveTos.length).toBe(4)
  })

  it('slant guide draws many parallel diagonal lines', () => {
    const ctx = createMockCtx()
    drawSlantGuide(ctx as unknown as CanvasRenderingContext2D, 400, 400, { spacing: 40 })
    const lineTos = ((ctx as any).strokes as MockStroke[]).filter((s) => s.kind === 'lineTo')
    expect(lineTos.length).toBeGreaterThan(10)
  })

  it('shirorekha draws a single horizontal line with label', () => {
    const ctx = createMockCtx()
    drawShirorekhaLine(ctx as unknown as CanvasRenderingContext2D, 400, 400, { showLabels: true })
    const strokes = (ctx as any).strokes as MockStroke[]
    expect(strokes.filter((s) => s.kind === 'stroke').length).toBe(1)
    expect(strokes.some((s) => s.kind === 'fillText' && s.args[0] === 'Shirorekha')).toBe(true)
  })
})

describe('renderGrid dispatch', () => {
  it('renders four-line via renderGrid', () => {
    const ctx = createMockCtx()
    renderGrid(ctx as unknown as CanvasRenderingContext2D, 400, 400, 'four-line', { showLabels: false })
    expect(((ctx as any).strokes as MockStroke[]).filter((s) => s.kind === 'stroke').length).toBe(4)
  })
  it('renders tianzige via renderGrid', () => {
    const ctx = createMockCtx()
    renderGrid(ctx as unknown as CanvasRenderingContext2D, 300, 300, 'tianzige')
    expect(((ctx as any).strokes as MockStroke[]).some((s) => s.kind === 'strokeRect')).toBe(true)
  })
})

describe('script detection and grid selection', () => {
  const cases: Array<[string, ScriptFamily, GridKind]> = [
    ['A', 'latin', 'four-line'],
    ['あ', 'cjk', 'tianzige'],
    ['カ', 'cjk', 'tianzige'],
    ['中', 'cjk', 'tianzige'],
    ['क', 'devanagari', 'four-line'],
    ['ا', 'arabic', 'four-line'],
  ]
  cases.forEach(([char, family, grid]) => {
    it(`detects "${char}" as ${family} -> ${grid}`, () => {
      expect(detectScriptFamily(char)).toBe(family)
      expect(selectGridKind(char)).toBe(grid)
    })
  })

  it('explicit override wins over auto detection', () => {
    expect(selectGridKind('あ', 'jiugongge')).toBe('jiugongge')
    expect(selectGridKind('A', 'mizige')).toBe('mizige')
  })

  it('"auto" override falls back to detected grid', () => {
    expect(selectGridKind('あ', 'auto')).toBe('tianzige')
  })
})
