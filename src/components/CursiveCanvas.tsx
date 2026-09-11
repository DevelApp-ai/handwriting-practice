import { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react'
import { TimedPoint } from '@/lib/types'
import { layoutCursiveWord, CursiveLayout, ligatureScore, candidatePathsForGlyph } from '@/lib/cursive'
import { evaluate, starsFromOverall, StrokeReport } from '@/lib/strokeEval'
import { getSlantReferenceRad } from '@/lib/languages'

interface CursiveCanvasProps {
  word: string
  onComplete: (stars: number, report: StrokeReport) => void
  showGuide: boolean
}

export interface CursiveCanvasHandle {
  clear: () => void
  evaluateAndRender: () => { stars: number; report: StrokeReport }
}

const BASE_STROKE_WIDTH = 4
const PADDING = 0.1
const SLANT_DEG = 60
const GLYPH_WIDTH_PX = 220

export const CursiveCanvas = forwardRef<CursiveCanvasHandle, CursiveCanvasProps>(
  function CursiveCanvas({ word, showGuide }, ref) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const overlayRef = useRef<HTMLCanvasElement>(null)
    const [strokes, setStrokes] = useState<TimedPoint[][]>([])
    const [currentStroke, setCurrentStroke] = useState<TimedPoint[]>([])
    const [isDrawing, setIsDrawing] = useState(false)
    const strokesRef = useRef<TimedPoint[][]>([])

    useEffect(() => {
      strokesRef.current = strokes
    }, [strokes])

    const layoutRef = useRef<CursiveLayout>(layoutCursiveWord(word))
    useEffect(() => {
      layoutRef.current = layoutCursiveWord(word)
      setStrokes([])
      setCurrentStroke([])
      strokesRef.current = []
      resizeCanvas()
    }, [word])

    const worldToCanvas = (
      px: number,
      py: number,
      w: number,
      h: number,
      layout: CursiveLayout,
    ): { x: number; y: number } => {
      const usableW = w * (1 - 2 * PADDING)
      const usableH = h * (1 - 2 * PADDING)
      const totalW = Math.max(layout.totalWidth, 0.001)
      const scale = Math.min(usableW / totalW, usableH)
      const offsetX = (w - totalW * scale) / 2
      const offsetY = h * PADDING
      return { x: offsetX + px * scale, y: offsetY + py * scale }
    }

    const canvasToWorld = (
      cx: number,
      cy: number,
      w: number,
      h: number,
      layout: CursiveLayout,
    ): { x: number; y: number } => {
      const usableW = w * (1 - 2 * PADDING)
      const usableH = h * (1 - 2 * PADDING)
      const totalW = Math.max(layout.totalWidth, 0.001)
      const scale = Math.min(usableW / totalW, usableH)
      const offsetX = (w - totalW * scale) / 2
      const offsetY = h * PADDING
      return { x: (cx - offsetX) / scale, y: (cy - offsetY) / scale }
    }

    const resizeCanvas = () => {
      const canvas = canvasRef.current
      const overlay = overlayRef.current
      const parent = canvas?.parentElement
      if (!canvas || !overlay || !parent) return
      const w = parent.clientWidth
      const h = Math.min(parent.clientHeight, GLYPH_WIDTH_PX * 1.4)
      canvas.width = w
      canvas.height = h
      overlay.width = w
      overlay.height = h
      drawGhost()
    }

    useEffect(() => {
      resizeCanvas()
      window.addEventListener('resize', resizeCanvas)
      return () => window.removeEventListener('resize', resizeCanvas)
    }, [])

    const drawGhost = () => {
      const overlay = overlayRef.current
      if (!overlay) return
      const ctx = overlay.getContext('2d')
      if (!ctx) return
      ctx.clearRect(0, 0, overlay.width, overlay.height)
      const layout = layoutRef.current
      if (!showGuide) return

      ctx.strokeStyle = 'rgba(100, 100, 200, 0.25)'
      ctx.fillStyle = 'rgba(100, 100, 200, 0.25)'
      ctx.lineWidth = BASE_STROKE_WIDTH
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'

      for (const glyph of layout.glyphs) {
        for (const stroke of glyph.template) {
          if (stroke.length === 0) continue
          ctx.beginPath()
          stroke.forEach((p, i) => {
            const c = worldToCanvas(p.x + glyph.offsetX, p.y, overlay.width, overlay.height, layout)
            if (i === 0) ctx.moveTo(c.x, c.y)
            else ctx.lineTo(c.x, c.y)
          })
          ctx.stroke()
        }
      }

      for (const j of layout.junctions) {
        ctx.beginPath()
        j.path.forEach((p, i) => {
          const c = worldToCanvas(p.x, p.y, overlay.width, overlay.height, layout)
          if (i === 0) ctx.moveTo(c.x, c.y)
          else ctx.lineTo(c.x, c.y)
        })
        ctx.setLineDash([4, 4])
        ctx.stroke()
        ctx.setLineDash([])
      }

      drawSlantGuide(ctx, overlay.width, overlay.height)
    }

    const drawSlantGuide = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
      const slantRad = (SLANT_DEG * Math.PI) / 180
      ctx.strokeStyle = 'rgba(99, 102, 241, 0.35)'
      ctx.lineWidth = 1.5
      ctx.setLineDash([6, 6])
      const spacing = 48
      const baselineY = h * (1 - PADDING)
      const topY = h * PADDING
      for (let x = -h; x < w + h; x += spacing) {
        ctx.beginPath()
        const topX = x + (topY - baselineY) / Math.tan(slantRad)
        ctx.moveTo(topX, topY)
        ctx.lineTo(x, baselineY)
        ctx.stroke()
      }
      ctx.setLineDash([])
    }

    useEffect(() => {
      drawGhost()
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [showGuide, word])

    const redrawStrokes = () => {
      const canvas = canvasRef.current
      if (!canvas) return
      const ctx = canvas.getContext('2d')
      if (!ctx) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.strokeStyle = 'rgba(59, 130, 246, 0.85)'
      ctx.lineWidth = BASE_STROKE_WIDTH
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      const all = [...strokes, currentStroke]
      for (const stroke of all) {
        if (stroke.length < 2) continue
        ctx.beginPath()
        stroke.forEach((p, i) => {
          if (i === 0) ctx.moveTo(p.x, p.y)
          else ctx.lineTo(p.x, p.y)
        })
        ctx.stroke()
      }
    }

    useEffect(() => {
      redrawStrokes()
    }, [strokes, currentStroke])

    const capturePoint = (e: React.PointerEvent<HTMLCanvasElement>): TimedPoint => {
      const canvas = canvasRef.current
      if (!canvas) return { x: 0, y: 0, t: 0, pressure: 0, tiltX: 0, tiltY: 0, twist: 0, pointerType: '' }
      const layout = layoutRef.current
      const rect = canvas.getBoundingClientRect()
      const cx = e.clientX - rect.left
      const cy = e.clientY - rect.top
      const wpt = canvasToWorld(cx, cy, canvas.width, canvas.height, layout)
      return {
        x: wpt.x,
        y: wpt.y,
        t: e.timeStamp,
        pressure: e.pressure ?? 0,
        tiltX: e.tiltX ?? 0,
        tiltY: e.tiltY ?? 0,
        twist: e.twist ?? 0,
        pointerType: (e.pointerType ?? '') as TimedPoint['pointerType'],
      }
    }

    const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
      e.preventDefault()
      const canvas = canvasRef.current
      if (!canvas) return
      canvas.setPointerCapture(e.pointerId)
      setIsDrawing(true)
      const pt = capturePoint(e)
      setCurrentStroke([pt])
    }

    const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
      if (!isDrawing) return
      e.preventDefault()
      const pt = capturePoint(e)
      setCurrentStroke((prev) => [...prev, pt])
    }

    const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
      if (!isDrawing) return
      e.preventDefault()
      const canvas = canvasRef.current
      if (canvas) canvas.releasePointerCapture(e.pointerId)
      setIsDrawing(false)
      if (currentStroke.length > 0) {
        setStrokes((prev) => [...prev, currentStroke])
        setCurrentStroke([])
      }
    }

    const clearCanvas = () => {
      setStrokes([])
      setCurrentStroke([])
      strokesRef.current = []
    }

    useImperativeHandle(
      ref,
      () => ({
        clear: clearCanvas,
        evaluateAndRender: () => {
          const layout = layoutRef.current
          const allStrokes = strokesRef.current
          let overallSum = 0
          let glyphCount = 0
          let ligatureSum = 0
          let ligatureCount = 0

          for (const glyph of layout.glyphs) {
            const candPaths = candidatePathsForGlyph(
              allStrokes.map((s) => s.map((p) => ({ x: p.x, y: p.y }))),
              glyph,
            )
            const report = evaluate(
              candPaths.map((p) => p.map((pp) => ({ x: pp.x, y: pp.y, t: 0, pressure: 0, tiltX: 0, tiltY: 0, twist: 0, pointerType: '' }))),
              glyph.char,
              { slantReferenceRad: getSlantReferenceRad(glyph.char) },
            )
            overallSum += report.overall
            glyphCount++
          }

          for (const j of layout.junctions) {
            const fromGlyph = layout.glyphs[j.fromGlyph]
            const candPaths = candidatePathsForGlyph(
              allStrokes.map((s) => s.map((p) => ({ x: p.x, y: p.y }))),
              fromGlyph,
            )
            const nearExit = candPaths
              .flat()
              .filter((p) => Math.abs(p.x - j.exitPoint.x) < 0.3)
            if (nearExit.length > 1) {
              ligatureSum += ligatureScore(nearExit, j.path)
              ligatureCount++
            }
          }

          const overall = glyphCount > 0 ? Math.round(overallSum / glyphCount) : 0
          const ligatureBonus = ligatureCount > 0 ? ligatureSum / ligatureCount : 0
          const adjusted = Math.round(overall * (0.8 + 0.2 * ligatureBonus))
          const report: StrokeReport = {
            trajectory: 0,
            direction: 0,
            strokeOrder: 0,
            slant: 0,
            xHeightRatio: 0,
            smoothness: 0,
            overall: adjusted,
            perStroke: [],
          }
          return { stars: starsFromOverall(adjusted), report }
        },
      }),
      [word],
    )

    return (
      <div className="relative w-full h-full flex items-center justify-center p-4">
        <div className="relative w-full h-full min-h-[200px]">
          <canvas ref={overlayRef} className="absolute inset-0 pointer-events-none" />
          <canvas
            ref={canvasRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            className="absolute inset-0 touch-none cursor-crosshair"
          />
        </div>
      </div>
    )
  },
)
