import { useEffect, useRef, useState } from 'react'
import { Point } from '@/lib/types'

interface DrawingCanvasProps {
  character: string
  onComplete: (stars: number) => void
  showGuide: boolean
}

export function DrawingCanvas({ character, onComplete, showGuide }: DrawingCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const overlayRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [strokes, setStrokes] = useState<Point[][]>([])
  const [currentStroke, setCurrentStroke] = useState<Point[]>([])

  const LINE_HEIGHTS = {
    ascender: 0.15,
    midline: 0.4,
    baseline: 0.65,
    descender: 0.9,
  }

  useEffect(() => {
    const canvas = canvasRef.current
    const overlay = overlayRef.current
    if (!canvas || !overlay) return

    const resizeCanvas = () => {
      const parent = canvas.parentElement
      if (!parent) return

      const size = Math.min(parent.clientWidth, parent.clientHeight)
      canvas.width = size
      canvas.height = size
      overlay.width = size
      overlay.height = size

      drawGuideLines()
      drawCharacterGuide()
      redrawStrokes()
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)
    return () => window.removeEventListener('resize', resizeCanvas)
  }, [character, showGuide])

  useEffect(() => {
    drawGuideLines()
    drawCharacterGuide()
  }, [showGuide])

  useEffect(() => {
    redrawStrokes()
  }, [strokes])

  const drawGuideLines = () => {
    const overlay = overlayRef.current
    if (!overlay) return

    const ctx = overlay.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, overlay.width, overlay.height)

    const height = overlay.height
    const lines = [
      { y: height * LINE_HEIGHTS.ascender, color: '#e0e0e0', dash: [5, 5] },
      { y: height * LINE_HEIGHTS.midline, color: '#b0b0b0', dash: [10, 5] },
      { y: height * LINE_HEIGHTS.baseline, color: '#000000', dash: [] },
      { y: height * LINE_HEIGHTS.descender, color: '#e0e0e0', dash: [5, 5] },
    ]

    lines.forEach(({ y, color, dash }) => {
      ctx.strokeStyle = color
      ctx.lineWidth = dash.length > 0 ? 1 : 2
      ctx.setLineDash(dash)
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(overlay.width, y)
      ctx.stroke()
    })

    ctx.setLineDash([])
  }

  const drawCharacterGuide = () => {
    if (!showGuide) return

    const overlay = overlayRef.current
    if (!overlay) return

    const ctx = overlay.getContext('2d')
    if (!ctx) return

    const fontSize = overlay.height * 0.4
    ctx.font = `${fontSize}px 'Quicksand', sans-serif`
    ctx.fillStyle = 'rgba(100, 100, 100, 0.2)'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'

    const centerY = overlay.height * LINE_HEIGHTS.baseline - fontSize * 0.35
    ctx.fillText(character, overlay.width / 2, centerY)
  }

  const redrawStrokes = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    strokes.forEach((stroke) => {
      drawStroke(ctx, stroke, 'rgba(59, 130, 246, 0.8)', 4)
    })

    if (currentStroke.length > 0) {
      drawStroke(ctx, currentStroke, 'rgba(59, 130, 246, 0.8)', 4)
    }
  }

  const drawStroke = (
    ctx: CanvasRenderingContext2D,
    points: Point[],
    color: string,
    width: number
  ) => {
    if (points.length < 2) return

    ctx.strokeStyle = color
    ctx.lineWidth = width
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'

    ctx.beginPath()
    ctx.moveTo(points[0].x, points[0].y)

    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i].x, points[i].y)
    }

    ctx.stroke()
  }

  const getPoint = (e: React.PointerEvent<HTMLCanvasElement>): Point => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }

    const rect = canvas.getBoundingClientRect()
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    }
  }

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.preventDefault()
    const canvas = canvasRef.current
    if (!canvas) return

    canvas.setPointerCapture(e.pointerId)
    setIsDrawing(true)
    const point = getPoint(e)
    setCurrentStroke([point])
  }

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return
    e.preventDefault()

    const point = getPoint(e)
    setCurrentStroke((prev) => [...prev, point])

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    redrawStrokes()
  }

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return
    e.preventDefault()

    const canvas = canvasRef.current
    if (canvas) {
      canvas.releasePointerCapture(e.pointerId)
    }

    setIsDrawing(false)
    if (currentStroke.length > 0) {
      setStrokes((prev) => [...prev, currentStroke])
      setCurrentStroke([])
    }
  }

  return (
    <div className="relative w-full h-full flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl aspect-square">
        <canvas
          ref={overlayRef}
          className="absolute inset-0 pointer-events-none"
        />
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
}
