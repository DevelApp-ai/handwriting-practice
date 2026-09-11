import { TimedPoint } from '@/lib/types'
import { StrokePoint, generateBasicStrokeOrder } from '@/lib/strokeOrder'

export type Path2D = Array<{ x: number; y: number }>

const RESAMPLE_N = 64

export function resample(points: Path2D, n: number = RESAMPLE_N): Path2D {
  if (points.length === 0) return []
  if (points.length === 1) return Array.from({ length: n }, () => ({ ...points[0] }))

  let totalLen = 0
  for (let i = 0; i < points.length - 1; i++) {
    totalLen += dist(points[i], points[i + 1])
  }
  if (totalLen === 0) return Array.from({ length: n }, () => ({ ...points[0] }))

  const interval = totalLen / (n - 1)
  const result: Path2D = [{ ...points[0] }]
  let prev = points[0]
  let remaining = 0

  for (let i = 1; i < points.length; i++) {
    const cur = points[i]
    let d = dist(prev, cur)
    while (remaining + d >= interval && result.length < n - 1) {
      const t = (interval - remaining) / d
      const nx = prev.x + t * (cur.x - prev.x)
      const ny = prev.y + t * (cur.y - prev.y)
      const np = { x: nx, y: ny }
      result.push(np)
      prev = np
      d = dist(prev, cur)
      remaining = 0
    }
    remaining += d
    prev = cur
  }
  while (result.length < n) result.push({ ...points[points.length - 1] })
  return result
}

export function dist(a: { x: number; y: number }, b: { x: number; y: number }): number {
  const dx = a.x - b.x
  const dy = a.y - b.y
  return Math.sqrt(dx * dx + dy * dy)
}

function centroid(points: Path2D): { x: number; y: number } {
  let sx = 0
  let sy = 0
  for (const p of points) {
    sx += p.x
    sy += p.y
  }
  return { x: sx / points.length, y: sy / points.length }
}

export function normalizeToUnit(points: Path2D): Path2D {
  if (points.length === 0) return []
  const c = centroid(points)
  let maxR = 0
  for (const p of points) {
    const r = dist(p, c)
    if (r > maxR) maxR = r
  }
  if (maxR === 0) return points.map(() => ({ x: 0.5, y: 0.5 }))
  const scale = 0.5 / maxR
  return points.map((p) => ({ x: (p.x - c.x) * scale + 0.5, y: (p.y - c.y) * scale + 0.5 }))
}

export function procrustes(a: Path2D, b: Path2D): { a: Path2D; b: Path2D } {
  const na = normalizeToUnit(resample(a, RESAMPLE_N))
  const nb = normalizeToUnit(resample(b, RESAMPLE_N))
  return { a: na, b: nb }
}

export function dtw(a: Path2D, b: Path2D): number {
  const n = a.length
  const m = b.length
  if (n === 0 || m === 0) return Infinity
  const INF = Infinity
  const dp: number[][] = Array.from({ length: n }, () => new Array(m).fill(INF))
  dp[0][0] = dist(a[0], b[0])
  for (let i = 1; i < n; i++) dp[i][0] = dp[i - 1][0] + dist(a[i], b[0])
  for (let j = 1; j < m; j++) dp[0][j] = dp[0][j - 1] + dist(a[0], b[j])
  for (let i = 1; i < n; i++) {
    for (let j = 1; j < m; j++) {
      const cost = dist(a[i], b[j])
      dp[i][j] = cost + Math.min(dp[i - 1][j - 1], dp[i - 1][j], dp[i][j - 1])
    }
  }
  return dp[n - 1][m - 1] / Math.max(n, m)
}

export function frechet(a: Path2D, b: Path2D): number {
  const n = a.length
  const m = b.length
  if (n === 0 || m === 0) return Infinity
  const ca = Array.from({ length: n }, () => new Array(m).fill(-1))
  function rec(i: number, j: number): number {
    if (ca[i][j] > -1) return ca[i][j]
    if (i === 0 && j === 0) {
      ca[i][j] = dist(a[0], b[0])
    } else if (i > 0 && j === 0) {
      ca[i][j] = Math.max(rec(i - 1, 0), dist(a[i], b[0]))
    } else if (i === 0 && j > 0) {
      ca[i][j] = Math.max(rec(0, j - 1), dist(a[0], b[j]))
    } else {
      ca[i][j] = Math.max(
        Math.min(rec(i - 1, j), rec(i - 1, j - 1), rec(i, j - 1)),
        dist(a[i], b[j]),
      )
    }
    return ca[i][j]
  }
  return rec(n - 1, m - 1)
}

export function dollarRecognize(
  candidate: Path2D,
  templates: Path2D[],
): { bestIndex: number; score: number } {
  const nc = normalizeToUnit(resample(candidate, RESAMPLE_N))
  let best = -1
  let bestScore = Infinity
  templates.forEach((tpl, idx) => {
    const nt = normalizeToUnit(resample(tpl, RESAMPLE_N))
    const d = pathDistance(nc, nt)
    if (d < bestScore) {
      bestScore = d
      best = idx
    }
  })
  return { bestIndex: best, score: bestScore === Infinity ? 1 : bestScore }
}

function pathDistance(a: Path2D, b: Path2D): number {
  const n = Math.min(a.length, b.length)
  if (n === 0) return Infinity
  let sum = 0
  for (let i = 0; i < n; i++) sum += dist(a[i], b[i])
  return sum / n
}

function strokeHeading(points: Path2D): { dx: number; dy: number } {
  if (points.length < 2) return { dx: 0, dy: 0 }
  const first = points[0]
  const last = points[points.length - 1]
  const dx = last.x - first.x
  const dy = last.y - first.y
  const len = Math.sqrt(dx * dx + dy * dy)
  if (len === 0) return { dx: 0, dy: 0 }
  return { dx: dx / len, dy: dy / len }
}

function dominantSlant(points: Path2D): number {
  let sx = 0
  let sy = 0
  for (let i = 1; i < points.length; i++) {
    const ddx = points[i].x - points[i - 1].x
    const ddy = points[i].y - points[i - 1].y
    if (Math.abs(ddx) < 1e-6 && Math.abs(ddy) < 1e-6) continue
    sx += ddx
    sy += ddy
  }
  if (Math.abs(sx) < 1e-6) return Math.PI / 2
  return Math.atan2(sy, sx)
}

function curvatureJitter(points: Path2D): number {
  if (points.length < 3) return 0
  const angles: number[] = []
  for (let i = 1; i < points.length - 1; i++) {
    const a = points[i - 1]
    const b = points[i]
    const c = points[i + 1]
    const v1x = b.x - a.x
    const v1y = b.y - a.y
    const v2x = c.x - b.x
    const v2y = c.y - b.y
    const angle = Math.atan2(v2y, v2x) - Math.atan2(v1y, v1x)
    angles.push(Math.atan2(Math.sin(angle), Math.cos(angle)))
  }
  let mean = 0
  for (const a of angles) mean += a
  mean /= angles.length
  let variance = 0
  for (const a of angles) variance += (a - mean) * (a - mean)
  return Math.sqrt(variance / angles.length)
}

function toPath(points: StrokePoint[] | TimedPoint[]): Path2D {
  return points.map((p) => ({ x: p.x, y: p.y }))
}

function candidateToUnit(candidate: TimedPoint[][]): Path2D[] {
  const all: Path2D = []
  for (const stroke of candidate) for (const p of stroke) all.push({ x: p.x, y: p.y })
  if (all.length === 0) return []
  const norm = normalizeToUnit(all)
  const out: Path2D[] = []
  let idx = 0
  for (const stroke of candidate) {
    const seg = norm.slice(idx, idx + stroke.length)
    out.push(seg)
    idx += stroke.length
  }
  return out
}

function candidateToTemplateSpace(
  candidate: TimedPoint[][],
  bounds: { left: number; top: number; width: number; height: number },
): Path2D[] {
  const w = bounds.width || 1
  const h = bounds.height || 1
  return candidate.map((stroke) =>
    stroke.map((p) => ({
      x: (p.x - bounds.left) / w,
      y: (p.y - bounds.top) / h,
    })),
  )
}

export interface EvaluateOptions {
  slantReferenceRad?: number
  bounds?: { left: number; top: number; width: number; height: number }
}

export function buildTemplatePaths(character: string): Path2D[] {
  const data = generateBasicStrokeOrder(character)
  if (!data.strokes || data.strokes.length === 0) return []
  return data.strokes.map((s) => toPath(s.points))
}

export function evaluate(
  candidateStrokes: TimedPoint[][],
  character: string,
  opts: EvaluateOptions = {},
): StrokeReport {
  const templatePaths = buildTemplatePaths(character)

  if (candidateStrokes.length === 0 || candidateStrokes.every((s) => s.length === 0)) {
    return emptyReport()
  }

  if (templatePaths.length === 0) {
    return {
      trajectory: 0,
      direction: 0,
      strokeOrder: 0,
      slant: 0,
      xHeightRatio: 0,
      smoothness: 0,
      overall: 0,
      perStroke: [],
    }
  }

  const useTemplateSpace = !!opts.bounds
  const candPaths = useTemplateSpace
    ? candidateToTemplateSpace(candidateStrokes, opts.bounds!)
    : candidateToUnit(candidateStrokes)

  const candResampled = candPaths.map((p) => resample(p, RESAMPLE_N))
  const tplResampled = templatePaths.map((p) => resample(p, RESAMPLE_N))

  const perStroke: StrokeFault[] = []
  let trajSum = 0
  let orderCorrect = 0
  const usedTpl = new Set<number>()

  for (let i = 0; i < candResampled.length; i++) {
    const cand = candResampled[i]
    let bestTpl = -1
    let bestF = Infinity
    for (let j = 0; j < tplResampled.length; j++) {
      if (usedTpl.has(j)) continue
      const a = normalizeToUnit(cand)
      const b = normalizeToUnit(tplResampled[j])
      const f = frechet(a, b)
      if (f < bestF) {
        bestF = f
        bestTpl = j
      }
    }
    const trajCost = bestTpl >= 0 ? dtw(normalizeToUnit(cand), normalizeToUnit(tplResampled[bestTpl])) : 1
    const trajScore = clamp01(1 - trajCost * 4)
    trajSum += trajScore

    const candDir = strokeHeading(cand)
    const tplDir = bestTpl >= 0 ? strokeHeading(tplResampled[bestTpl]) : { dx: 0, dy: 0 }
    const dirDot = candDir.dx * tplDir.dx + candDir.dy * tplDir.dy
    const directionScore = clamp01((dirDot + 1) / 2)

    let kind: StrokeFaultKind = 'ok'
    if (trajScore < 0.4) kind = 'red'
    else if (directionScore < 0.3) kind = 'red'
    else if (trajScore < 0.7 || directionScore < 0.6) kind = 'amber'
    else kind = 'ok'

    if (bestTpl === i && kind !== 'red') orderCorrect++
    if (bestTpl >= 0) usedTpl.add(bestTpl)

    perStroke.push({
      strokeIndex: i,
      matchedTemplate: bestTpl,
      trajectory: trajScore,
      direction: directionScore,
      kind,
    })
  }

  const trajectory = candResampled.length > 0 ? trajSum / candResampled.length : 0
  const strokeOrder =
    candResampled.length > 0 ? orderCorrect / Math.max(candResampled.length, tplResampled.length) : 0

  const allCand = candResampled.flat()
  const direction = directionScoreAggregate(candResampled, tplResampled)

  const refSlant = opts.slantReferenceRad ?? 0
  const measuredSlant = dominantSlant(allCand)
  let slantDelta = Math.abs(measuredSlant - refSlant)
  slantDelta = Math.atan2(Math.sin(slantDelta), Math.cos(slantDelta))
  const slant = clamp01(1 - slantDelta / (Math.PI / 2))

  const xHeightRatio = computeXHeight(candResampled, tplResampled)
  const jitter = curvatureJitter(allCand)
  const smoothness = clamp01(1 - jitter * 3)

  const overall = Math.round(
    100 *
      (0.4 * trajectory + 0.2 * direction + 0.15 * strokeOrder + 0.1 * slant + 0.1 * smoothness + 0.05 * xHeightRatio),
  )

  return {
    trajectory: round(trajectory),
    direction: round(direction),
    strokeOrder: round(strokeOrder),
    slant: round(slant),
    xHeightRatio: round(xHeightRatio),
    smoothness: round(smoothness),
    overall,
    perStroke,
  }
}

function directionScoreAggregate(cand: Path2D[], tpl: Path2D[]): number {
  const n = Math.min(cand.length, tpl.length)
  if (n === 0) return 0
  let sum = 0
  for (let i = 0; i < n; i++) {
    const cd = strokeHeading(cand[i])
    const td = strokeHeading(tpl[i])
    const dot = cd.dx * td.dx + cd.dy * td.dy
    sum += clamp01((dot + 1) / 2)
  }
  return sum / n
}

function computeXHeight(cand: Path2D[], tpl: Path2D[]): number {
  const candH = pathHeight(cand)
  const tplH = pathHeight(tpl)
  if (tplH === 0) return 0
  const ratio = candH / tplH
  if (ratio <= 0) return 0
  const diff = Math.abs(ratio - 1)
  return clamp01(1 - diff * 2)
}

function pathHeight(paths: Path2D[]): number {
  let minY = Infinity
  let maxY = -Infinity
  for (const p of paths) {
    for (const pt of p) {
      if (pt.y < minY) minY = pt.y
      if (pt.y > maxY) maxY = pt.y
    }
  }
  if (minY === Infinity) return 0
  return maxY - minY
}

export function starsFromOverall(overall: number): 1 | 2 | 3 {
  if (overall >= 85) return 3
  if (overall >= 60) return 2
  return 1
}

function clamp01(v: number): number {
  return Math.max(0, Math.min(1, v))
}
function round(v: number): number {
  return Math.round(v * 100) / 100
}

export type StrokeFaultKind = 'ok' | 'amber' | 'red'

export interface StrokeFault {
  strokeIndex: number
  matchedTemplate: number
  trajectory: number
  direction: number
  kind: StrokeFaultKind
}

export interface StrokeReport {
  trajectory: number
  direction: number
  strokeOrder: number
  slant: number
  xHeightRatio: number
  smoothness: number
  overall: number
  perStroke: StrokeFault[]
}

function emptyReport(): StrokeReport {
  return {
    trajectory: 0,
    direction: 0,
    strokeOrder: 0,
    slant: 0,
    xHeightRatio: 0,
    smoothness: 0,
    overall: 0,
    perStroke: [],
  }
}
