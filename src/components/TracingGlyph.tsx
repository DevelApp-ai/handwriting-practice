import { useEffect, useRef } from 'react'
import { generateBasicStrokeOrder } from '@/lib/strokeOrder'
import { computeLandmarks } from '@/lib/scaffold'

interface TracingGlyphProps {
  char: string
  size?: number
  showDots?: boolean
  fallbackFont?: string
}

export function TracingGlyph({
  char,
  size = 96,
  showDots = true,
  fallbackFont,
}: TracingGlyphProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.clearRect(0, 0, size, size)

    const data = char.length === 1 ? generateBasicStrokeOrder(char) : { character: char, strokes: [] }

    if (data.strokes.length === 0) {
      if (fallbackFont) ctx.font = `${size * 0.5}px ${fallbackFont}`
      else ctx.font = `${size * 0.5}px sans-serif`
      ctx.fillStyle = 'rgba(120, 120, 140, 0.5)'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(char, size / 2, size / 2)
      return
    }

    ctx.strokeStyle = 'rgba(60, 60, 80, 0.6)'
    ctx.lineWidth = 2
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.setLineDash([3, 4])

    for (const stroke of data.strokes) {
      if (stroke.points.length === 0) continue
      ctx.beginPath()
      stroke.points.forEach((p, i) => {
        const x = p.x * size
        const y = p.y * size
        if (i === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      })
      ctx.stroke()
    }

    ctx.setLineDash([])

    if (showDots && char.length === 1) {
      const landmarks = computeLandmarks(char)
      let dotIndex = 0
      for (const lm of landmarks) {
        const x = lm.x * size
        const y = lm.y * size
        const r = lm.kind === 'start' ? 10 : 7
        ctx.beginPath()
        ctx.arc(x, y, r, 0, Math.PI * 2)
        ctx.fillStyle = lm.kind === 'start' ? 'rgba(34, 197, 94, 0.85)' : 'rgba(234, 179, 8, 0.7)'
        ctx.fill()
        if (lm.kind === 'start') {
          dotIndex++
          ctx.fillStyle = 'white'
          ctx.font = 'bold 11px sans-serif'
          ctx.textAlign = 'center'
          ctx.textBaseline = 'middle'
          ctx.fillText(String(dotIndex), x, y)
        }
      }
    }
  }, [char, size, showDots, fallbackFont])

  return <canvas ref={canvasRef} width={size} height={size} className="block mx-auto" />
}
