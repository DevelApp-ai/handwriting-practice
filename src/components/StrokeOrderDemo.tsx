import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Play, Pause, ArrowCounterClockwise } from '@phosphor-icons/react'
import { generateBasicStrokeOrder } from '@/lib/strokeOrder'

interface StrokeOrderDemoProps {
  character: string
  width?: number
  height?: number
}

export function StrokeOrderDemo({ character, width = 300, height = 300 }: StrokeOrderDemoProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentStroke, setCurrentStroke] = useState(0)
  const [strokeProgress, setStrokeProgress] = useState(0)
  const animationRef = useRef<number | undefined>(undefined)

  const strokeData = character.length === 1 ? generateBasicStrokeOrder(character) : { character, strokes: [] }

  const drawCompleteStroke = (ctx: CanvasRenderingContext2D, stroke: any, index: number) => {
    ctx.strokeStyle = 'rgba(99, 102, 241, 0.8)'
    ctx.lineWidth = 6
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'

    ctx.beginPath()
    stroke.points.forEach((point: any, i: number) => {
      const x = point.x * width
      const y = point.y * height
      if (i === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })
    ctx.stroke()

    if (stroke.points.length > 0) {
      const firstPoint = stroke.points[0]
      ctx.fillStyle = 'rgba(34, 197, 94, 0.9)'
      ctx.beginPath()
      ctx.arc(firstPoint.x * width, firstPoint.y * height, 8, 0, Math.PI * 2)
      ctx.fill()
      
      ctx.fillStyle = 'white'
      ctx.font = 'bold 11px sans-serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText((index + 1).toString(), firstPoint.x * width, firstPoint.y * height)
    }
  }

  const drawPartialStroke = (ctx: CanvasRenderingContext2D, stroke: any, index: number, progress: number) => {
    if (stroke.points.length === 0) return

    const totalProgress = progress * stroke.points.length
    const lastFullIndex = Math.floor(totalProgress)
    const partialProgress = totalProgress - lastFullIndex

    ctx.strokeStyle = 'rgba(99, 102, 241, 0.8)'
    ctx.lineWidth = 6
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'

    ctx.beginPath()
    for (let i = 0; i <= Math.min(lastFullIndex, stroke.points.length - 1); i++) {
      const point = stroke.points[i]
      const x = point.x * width
      const y = point.y * height
      if (i === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    }

    if (lastFullIndex < stroke.points.length - 1 && partialProgress > 0) {
      const currentPoint = stroke.points[lastFullIndex]
      const nextPoint = stroke.points[lastFullIndex + 1]
      const x = currentPoint.x * width + (nextPoint.x - currentPoint.x) * width * partialProgress
      const y = currentPoint.y * height + (nextPoint.y - currentPoint.y) * height * partialProgress
      ctx.lineTo(x, y)

      ctx.fillStyle = 'rgba(239, 68, 68, 0.9)'
      ctx.beginPath()
      ctx.arc(x, y, 5, 0, Math.PI * 2)
      ctx.fill()
    }

    ctx.stroke()

    const firstPoint = stroke.points[0]
    ctx.fillStyle = 'rgba(34, 197, 94, 0.9)'
    ctx.beginPath()
    ctx.arc(firstPoint.x * width, firstPoint.y * height, 8, 0, Math.PI * 2)
    ctx.fill()
    
    ctx.fillStyle = 'white'
    ctx.font = 'bold 11px sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText((index + 1).toString(), firstPoint.x * width, firstPoint.y * height)
  }

  const drawStrokePreview = (ctx: CanvasRenderingContext2D, stroke: any, index: number) => {
    ctx.strokeStyle = 'rgba(150, 150, 150, 0.2)'
    ctx.lineWidth = 4
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'

    ctx.beginPath()
    stroke.points.forEach((point: any, i: number) => {
      const x = point.x * width
      const y = point.y * height
      if (i === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })
    ctx.stroke()

    if (stroke.points.length > 0) {
      const firstPoint = stroke.points[0]
      ctx.fillStyle = 'rgba(150, 150, 150, 0.4)'
      ctx.beginPath()
      ctx.arc(firstPoint.x * width, firstPoint.y * height, 7, 0, Math.PI * 2)
      ctx.fill()
      
      ctx.fillStyle = 'white'
      ctx.font = 'bold 10px sans-serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText((index + 1).toString(), firstPoint.x * width, firstPoint.y * height)
    }
  }

  const drawStrokeOrder = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, width, height)

    ctx.fillStyle = 'rgba(200, 200, 255, 0.1)'
    ctx.fillRect(0, 0, width, height)

    const LINE_HEIGHTS = {
      ascender: height * 0.25,
      midline: height * 0.42,
      baseline: height * 0.58,
      descender: height * 0.75,
    }

    ctx.strokeStyle = 'rgba(150, 150, 150, 0.3)'
    ctx.lineWidth = 1
    ctx.setLineDash([5, 5])
    
    Object.values(LINE_HEIGHTS).forEach(y => {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(width, y)
      ctx.stroke()
    })
    
    ctx.setLineDash([])

    strokeData.strokes.forEach((stroke, index) => {
      if (index < currentStroke) {
        drawCompleteStroke(ctx, stroke, index)
      } else if (index === currentStroke) {
        drawPartialStroke(ctx, stroke, index, strokeProgress)
      } else {
        drawStrokePreview(ctx, stroke, index)
      }
    })
  }

  useEffect(() => {
    drawStrokeOrder()
  }, [character, currentStroke, strokeProgress, width, height])

  const animate = () => {
    setStrokeProgress(prev => {
      const next = prev + 0.02
      if (next >= 1) {
        setCurrentStroke(curr => {
          const nextStroke = curr + 1
          if (nextStroke >= strokeData.strokes.length) {
            setIsPlaying(false)
            return curr
          }
          return nextStroke
        })
        return 0
      }
      return next
    })

    animationRef.current = requestAnimationFrame(animate)
  }

  useEffect(() => {
    if (isPlaying) {
      animate()
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isPlaying, currentStroke])

  const handlePlayPause = () => {
    if (currentStroke >= strokeData.strokes.length - 1 && strokeProgress >= 1) {
      reset()
      setIsPlaying(true)
    } else {
      setIsPlaying(!isPlaying)
    }
  }

  const reset = () => {
    setIsPlaying(false)
    setCurrentStroke(0)
    setStrokeProgress(0)
  }

  if (strokeData.strokes.length === 0 || character.length > 1) {
    return null
  }

  return (
    <div className="flex flex-col gap-3 items-center">
      <div className="relative bg-muted/30 rounded-lg border-2 border-border overflow-hidden">
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          className="block"
        />
      </div>
      
      <div className="flex gap-2">
        <Button
          onClick={handlePlayPause}
          size="sm"
          variant="default"
          className="gap-2"
        >
          {isPlaying ? (
            <>
              <Pause weight="fill" className="w-4 h-4" />
              Pause
            </>
          ) : (
            <>
              <Play weight="fill" className="w-4 h-4" />
              Play
            </>
          )}
        </Button>
        <Button
          onClick={reset}
          size="sm"
          variant="outline"
          className="gap-2"
        >
          <ArrowCounterClockwise className="w-4 h-4" />
          Reset
        </Button>
      </div>
      
      <div className="text-sm text-muted-foreground text-center">
        Stroke {currentStroke + 1} of {strokeData.strokes.length}
      </div>
    </div>
  )
}
