import { generateBasicStrokeOrder, StrokePoint, Stroke } from '@/lib/strokeOrder'

export interface Landmark {
  strokeIndex: number
  pointIndex: number
  x: number
  y: number
  kind: 'start' | 'pivot'
}

export interface PivotThresholdOptions {
  minCurvatureRad: number
  minSegmentLen: number
}

export const DEFAULT_PIVOT_OPTIONS: PivotThresholdOptions = {
  minCurvatureRad: Math.PI / 6,
  minSegmentLen: 0.02,
}

function dist(a: { x: number; y: number }, b: { x: number; y: number }): number {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2)
}

function signedAngle(a: { x: number; y: number }, b: { x: number; y: number }): number {
  return Math.atan2(b.y - a.y, b.x - a.x)
}

export function strokePivots(
  points: StrokePoint[],
  opts: PivotThresholdOptions = DEFAULT_PIVOT_OPTIONS,
): number[] {
  if (points.length < 3) return []
  const pivots: number[] = []
  for (let i = 1; i < points.length - 1; i++) {
    const seg1 = dist(points[i - 1], points[i])
    const seg2 = dist(points[i], points[i + 1])
    if (seg1 < opts.minSegmentLen || seg2 < opts.minSegmentLen) continue
    const a1 = signedAngle(points[i - 1], points[i])
    const a2 = signedAngle(points[i], points[i + 1])
    let delta = a2 - a1
    delta = Math.atan2(Math.sin(delta), Math.cos(delta))
    if (Math.abs(delta) >= opts.minCurvatureRad) pivots.push(i)
  }
  return pivots
}

export function strokeLandmarks(
  points: StrokePoint[],
  strokeIndex: number,
  opts: PivotThresholdOptions = DEFAULT_PIVOT_OPTIONS,
): Landmark[] {
  if (points.length === 0) return []
  const out: Landmark[] = [
    { strokeIndex, pointIndex: 0, x: points[0].x, y: points[0].y, kind: 'start' },
  ]
  for (const pi of strokePivots(points, opts)) {
    out.push({ strokeIndex, pointIndex: pi, x: points[pi].x, y: points[pi].y, kind: 'pivot' })
  }
  return out
}

export function computeLandmarks(
  character: string,
  opts: PivotThresholdOptions = DEFAULT_PIVOT_OPTIONS,
): Landmark[] {
  const data = generateBasicStrokeOrder(character)
  if (!data.strokes || data.strokes.length === 0) return []
  const all: Landmark[] = []
  data.strokes.forEach((stroke, idx) => {
    all.push(...strokeLandmarks(stroke.points, idx, opts))
  })
  return all
}

export function landmarkDotCount(character: string): number {
  return computeLandmarks(character).filter((l) => l.kind === 'start').length
}

export function filterStrokesForLandmark(
  strokes: Stroke[],
): Stroke[] {
  return strokes.map((s) => ({ ...s, points: s.points.length ? [s.points[0]] : [] }))
}
