import { GridKind } from '@/lib/types'

export interface GridRenderOptions {
  showLabels?: boolean
  color?: string
}

const DEFAULT_COLOR = '#9ca3af'

function resetStroke(ctx: CanvasRenderingContext2D) {
  ctx.setLineDash([])
  ctx.lineCap = 'butt'
  ctx.lineJoin = 'miter'
}

export function drawFourLineGrid(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  opts: GridRenderOptions = {},
): void {
  const showLabels = opts.showLabels ?? true
  const lines = [
    { y: height * 0.25, color: '#9ca3af', dash: [] as number[], width: 2, label: 'Ascender' },
    { y: height * 0.42, color: '#6366f1', dash: [8, 4], width: 2, label: 'Midline' },
    { y: height * 0.58, color: '#000000', dash: [] as number[], width: 3, label: 'Baseline' },
    { y: height * 0.75, color: '#9ca3af', dash: [] as number[], width: 2, label: 'Descender' },
  ]

  lines.forEach(({ y, color, dash, width: lineWidth, label }) => {
    ctx.strokeStyle = color
    ctx.lineWidth = lineWidth
    ctx.setLineDash(dash)
    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.lineTo(width, y)
    ctx.stroke()
    resetStroke(ctx)
    if (showLabels) {
      ctx.font = '12px Quicksand, sans-serif'
      ctx.fillStyle = color
      ctx.textAlign = 'left'
      ctx.textBaseline = 'alphabetic'
      ctx.fillText(label, 8, y - 6)
    }
  })
  resetStroke(ctx)
}

function drawOuterSquare(ctx: CanvasRenderingContext2D, w: number, h: number, color: string): void {
  ctx.strokeStyle = color
  ctx.lineWidth = 2
  ctx.setLineDash([])
  ctx.strokeRect(0, 0, w, h)
  resetStroke(ctx)
}

export function drawTianzigeGrid(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  opts: GridRenderOptions = {},
): void {
  const color = opts.color ?? '#d1d5db'
  drawOuterSquare(ctx, width, height, color)
  ctx.strokeStyle = color
  ctx.lineWidth = 1
  ctx.setLineDash([4, 4])
  ctx.beginPath()
  ctx.moveTo(width / 2, 0)
  ctx.lineTo(width / 2, height)
  ctx.moveTo(0, height / 2)
  ctx.lineTo(width, height / 2)
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(0, 0)
  ctx.lineTo(width, height)
  ctx.moveTo(width, 0)
  ctx.lineTo(0, height)
  ctx.setLineDash([])
  ctx.stroke()
  resetStroke(ctx)
}

export function drawMizigeGrid(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  opts: GridRenderOptions = {},
): void {
  const color = opts.color ?? '#d1d5db'
  drawOuterSquare(ctx, width, height, color)
  ctx.strokeStyle = color
  ctx.lineWidth = 1
  ctx.setLineDash([4, 4])
  ctx.beginPath()
  ctx.moveTo(0, 0)
  ctx.lineTo(width, height)
  ctx.moveTo(width, 0)
  ctx.lineTo(0, height)
  ctx.stroke()
  resetStroke(ctx)
  const cx = width / 2
  const cy = height / 2
  const r = Math.min(width, height) / 2
  ctx.beginPath()
  ctx.arc(cx, cy, r, 0, Math.PI * 2)
  ctx.stroke()
  resetStroke(ctx)
}

export function drawJiugonggeGrid(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  opts: GridRenderOptions = {},
): void {
  const color = opts.color ?? '#d1d5db'
  drawOuterSquare(ctx, width, height, color)
  ctx.strokeStyle = color
  ctx.lineWidth = 1
  ctx.setLineDash([4, 4])
  ctx.beginPath()
  ctx.moveTo(width / 3, 0)
  ctx.lineTo(width / 3, height)
  ctx.moveTo((width * 2) / 3, 0)
  ctx.lineTo((width * 2) / 3, height)
  ctx.moveTo(0, height / 3)
  ctx.lineTo(width, height / 3)
  ctx.moveTo(0, (height * 2) / 3)
  ctx.lineTo(width, (height * 2) / 3)
  ctx.stroke()
  resetStroke(ctx)
}

export function drawSlantGuide(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  opts: { angleDeg?: number; color?: string; spacing?: number } = {},
): void {
  const angleDeg = opts.angleDeg ?? 60
  const color = opts.color ?? 'rgba(99, 102, 241, 0.18)'
  const spacing = opts.spacing ?? 40
  ctx.strokeStyle = color
  ctx.lineWidth = 1
  ctx.setLineDash([6, 6])
  const rad = (angleDeg * Math.PI) / 180
  const dx = Math.cos(rad)
  const dy = Math.sin(rad)
  const step = spacing
  const along = { x: dx, y: dy }
  const perp = { x: -dy, y: dx }
  const span = Math.max(width, height) * 2
  for (let d = -span; d <= span; d += step) {
    const cx = width / 2 + perp.x * d
    const cy = height / 2 + perp.y * d
    ctx.beginPath()
    ctx.moveTo(cx - along.x * span, cy - along.y * span)
    ctx.lineTo(cx + along.x * span, cy + along.y * span)
    ctx.stroke()
  }
  resetStroke(ctx)
}

export function drawShirorekhaLine(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  opts: GridRenderOptions = {},
): void {
  const color = opts.color ?? '#000000'
  const y = height * 0.28
  ctx.strokeStyle = color
  ctx.lineWidth = 2
  ctx.setLineDash([])
  ctx.beginPath()
  ctx.moveTo(0, y)
  ctx.lineTo(width, y)
  ctx.stroke()
  resetStroke(ctx)
  if (opts.showLabels ?? true) {
    ctx.font = '12px Quicksand, sans-serif'
    ctx.fillStyle = color
    ctx.textAlign = 'left'
    ctx.textBaseline = 'alphabetic'
    ctx.fillText('Shirorekha', 8, y - 6)
  }
}

const CJK_PATTERN = /[\u3400-\u9FFF\uF900-\uFAFF\u3040-\u309F\u30A0-\u30FF]/
const DEVANAGARI_PATTERN = /[\u0900-\u097F]/
const RTL_PATTERN = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/

export type ScriptFamily = 'latin' | 'cjk' | 'devanagari' | 'arabic' | 'other'

export function detectScriptFamily(character: string): ScriptFamily {
  if (DEVANAGARI_PATTERN.test(character)) return 'devanagari'
  if (CJK_PATTERN.test(character)) return 'cjk'
  if (RTL_PATTERN.test(character)) return 'arabic'
  return 'latin'
}

export function selectGridKind(character: string, override?: GridKind | 'auto'): GridKind {
  if (override && override !== 'auto') return override
  const family = detectScriptFamily(character)
  switch (family) {
    case 'cjk':
      return 'tianzige'
    case 'devanagari':
      return 'four-line'
    default:
      return 'four-line'
  }
}

export function renderGrid(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  kind: GridKind,
  opts: GridRenderOptions = {},
): void {
  switch (kind) {
    case 'four-line':
      drawFourLineGrid(ctx, width, height, opts)
      break
    case 'tianzige':
      drawTianzigeGrid(ctx, width, height, opts)
      break
    case 'mizige':
      drawMizigeGrid(ctx, width, height, opts)
      break
    case 'jiugongge':
      drawJiugonggeGrid(ctx, width, height, opts)
      break
  }
}
