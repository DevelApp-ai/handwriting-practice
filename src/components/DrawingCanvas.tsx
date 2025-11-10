import { useEffect, useRef, useState } from 'react'
import { Point } from '@/lib/types'
import { useKV } from '@github/spark/hooks'
import { triggerHapticFeedback, stopHapticFeedback } from '@/lib/haptics'
import { getWritingDirection, isComplexScript } from '@/lib/languages'

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
  const [userProgress] = useKV<any>('user-progress', { progress: {} })

  const LINE_HEIGHTS = {
    ascender: 0.15,
    midline: 0.48,
    baseline: 0.67,
    descender: 0.85,
  }

  const getCharacterLevel = () => {
    const progress = userProgress?.progress?.[character]
    if (!progress) return 1
    return Math.min(Math.floor(progress.attempts / 3) + 1, 5)
  }

  const getPrecisionThresholds = () => {
    const level = getCharacterLevel()
    const baseModerate = 40
    const baseFar = 80
    
    const moderateThreshold = baseModerate - (level - 1) * 5
    const farThreshold = baseFar - (level - 1) * 10
    
    return {
      moderate: Math.max(moderateThreshold, 20),
      far: Math.max(farThreshold, 40),
    }
  }

  const getCharacterBounds = (canvasWidth: number, canvasHeight: number) => {
    const isSentence = character.length > 15
    const isWord = character.length > 1 && character.length <= 15
    
    let fontSize = canvasHeight * 0.4
    if (isSentence) {
      fontSize = canvasHeight * 0.12
    } else if (isWord) {
      fontSize = canvasHeight * 0.25
    }

    const getFontFamily = () => {
      const arabicChars = /[\u0600-\u06FF]/
      const japaneseChars = /[\u3040-\u309F\u30A0-\u30FF]/
      const devanagariChars = /[\u0900-\u097F]/
      
      if (arabicChars.test(character)) {
        return "'Noto Sans Arabic', sans-serif"
      } else if (japaneseChars.test(character)) {
        return "'Noto Sans JP', sans-serif"
      } else if (devanagariChars.test(character)) {
        return "'Noto Sans Devanagari', sans-serif"
      }
      return "'Quicksand', sans-serif"
    }

    const tempCanvas = document.createElement('canvas')
    tempCanvas.width = canvasWidth
    tempCanvas.height = canvasHeight
    const ctx = tempCanvas.getContext('2d')
    if (!ctx) return null

    ctx.font = `${fontSize}px ${getFontFamily()}`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'alphabetic'

    const centerX = canvasWidth / 2
    const baselineY = canvasHeight * LINE_HEIGHTS.baseline
    const metrics = ctx.measureText(character)

    const actualHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent
    const actualWidth = metrics.width

    return {
      top: baselineY - metrics.actualBoundingBoxAscent,
      bottom: baselineY + metrics.actualBoundingBoxDescent,
      left: centerX - actualWidth / 2,
      right: centerX + actualWidth / 2,
      centerX,
      baselineY,
    }
  }

  const getDistanceFromCharacter = (point: Point, canvasWidth: number, canvasHeight: number) => {
    const bounds = getCharacterBounds(canvasWidth, canvasHeight)
    if (!bounds) return 0

    const { top, bottom, left, right } = bounds

    let minDistance = 0

    if (point.y < top) {
      minDistance = top - point.y
    } else if (point.y > bottom) {
      minDistance = point.y - bottom
    }

    if (point.x < left) {
      const horizontalDist = left - point.x
      minDistance = Math.max(minDistance, horizontalDist * 0.5)
    } else if (point.x > right) {
      const horizontalDist = point.x - right
      minDistance = Math.max(minDistance, horizontalDist * 0.5)
    }

    return minDistance
  }

  const getStrokeColor = (point: Point, canvasWidth: number, canvasHeight: number) => {
    const distance = getDistanceFromCharacter(point, canvasWidth, canvasHeight)
    const thresholds = getPrecisionThresholds()
    
    if (distance === 0) {
      return 'rgba(59, 130, 246, 0.8)'
    } else if (distance < thresholds.moderate) {
      return 'rgba(234, 179, 8, 0.8)'
    } else if (distance < thresholds.far) {
      return 'rgba(249, 115, 22, 0.8)'
    } else {
      return 'rgba(239, 68, 68, 0.8)'
    }
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
      { y: height * LINE_HEIGHTS.ascender, color: '#9ca3af', dash: [], width: 2, label: 'Ascender' },
      { y: height * LINE_HEIGHTS.midline, color: '#6366f1', dash: [8, 4], width: 2, label: 'Midline' },
      { y: height * LINE_HEIGHTS.baseline, color: '#000000', dash: [], width: 3, label: 'Baseline' },
      { y: height * LINE_HEIGHTS.descender, color: '#9ca3af', dash: [], width: 2, label: 'Descender' },
    ]

    lines.forEach(({ y, color, dash, width, label }) => {
      ctx.strokeStyle = color
      ctx.lineWidth = width
      ctx.setLineDash(dash)
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(overlay.width, y)
      ctx.stroke()

      if (showGuide) {
        ctx.setLineDash([])
        ctx.font = '12px Quicksand, sans-serif'
        ctx.fillStyle = color
        ctx.textAlign = 'left'
        ctx.fillText(label, 8, y - 6)
      }
    })

    ctx.setLineDash([])

    const level = getCharacterLevel()
    if (level > 1) {
      ctx.font = 'bold 14px Quicksand, sans-serif'
      ctx.fillStyle = 'rgba(99, 102, 241, 0.9)'
      ctx.textAlign = 'right'
      ctx.fillText(`Level ${level} - Higher precision required!`, overlay.width - 8, 20)
    }

    const thresholds = getPrecisionThresholds()
    ctx.font = '11px Quicksand, sans-serif'
    ctx.textAlign = 'left'
    
    ctx.fillStyle = 'rgba(59, 130, 246, 0.8)'
    ctx.fillText('● Perfect', 8, overlay.height - 50)
    
    ctx.fillStyle = 'rgba(234, 179, 8, 0.8)'
    ctx.fillText('● Slightly off', 8, overlay.height - 35)
    
    ctx.fillStyle = 'rgba(249, 115, 22, 0.8)'
    ctx.fillText('● Getting far', 8, overlay.height - 20)
    
    ctx.fillStyle = 'rgba(239, 68, 68, 0.8)'
    ctx.fillText('● Too far!', 8, overlay.height - 5)
  }

  const drawCharacterGuide = () => {
    if (!showGuide) return

    const overlay = overlayRef.current
    if (!overlay) return

    const ctx = overlay.getContext('2d')
    if (!ctx) return

    const isSentence = character.length > 15
    const isWord = character.length > 1 && character.length <= 15
    const isComplex = isComplexScript(character)
    const direction = getWritingDirection(character)
    
    let fontSize = overlay.height * 0.4
    if (isSentence) {
      fontSize = overlay.height * 0.12
    } else if (isWord) {
      fontSize = overlay.height * 0.25
    }

    const getFontFamily = () => {
      const arabicChars = /[\u0600-\u06FF]/
      const japaneseChars = /[\u3040-\u309F\u30A0-\u30FF]/
      const devanagariChars = /[\u0900-\u097F]/
      
      if (arabicChars.test(character)) {
        return "'Noto Sans Arabic', sans-serif"
      } else if (japaneseChars.test(character)) {
        return "'Noto Sans JP', sans-serif"
      } else if (devanagariChars.test(character)) {
        return "'Noto Sans Devanagari', sans-serif"
      }
      return "'Quicksand', sans-serif"
    }

    ctx.font = `${fontSize}px ${getFontFamily()}`
    ctx.fillStyle = 'rgba(100, 100, 200, 0.25)'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'alphabetic'

    const centerX = overlay.width / 2
    const baselineY = overlay.height * LINE_HEIGHTS.baseline

    if (isSentence) {
      const maxWidth = overlay.width * 0.9
      const words = character.split(' ')
      const lines: string[] = []
      let currentLine = ''

      words.forEach((word) => {
        const testLine = currentLine ? `${currentLine} ${word}` : word
        const metrics = ctx.measureText(testLine)
        
        if (metrics.width > maxWidth && currentLine) {
          lines.push(currentLine)
          currentLine = word
        } else {
          currentLine = testLine
        }
      })
      
      if (currentLine) {
        lines.push(currentLine)
      }

      const lineHeight = fontSize * 1.4
      const startY = baselineY - ((lines.length - 1) * lineHeight) / 2

      ctx.direction = direction
      lines.forEach((line, index) => {
        ctx.fillText(line, centerX, startY + (index * lineHeight))
      })
    } else {
      ctx.direction = direction
      ctx.fillText(character, centerX, baselineY)
    }

    if (direction === 'rtl' && !isSentence) {
      const arrowSize = 20
      const arrowY = overlay.height * 0.88
      const arrowStartX = overlay.width * 0.7
      const arrowEndX = overlay.width * 0.3

      ctx.strokeStyle = 'rgba(239, 68, 68, 0.6)'
      ctx.fillStyle = 'rgba(239, 68, 68, 0.6)'
      ctx.lineWidth = 3
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'

      ctx.beginPath()
      ctx.moveTo(arrowStartX, arrowY)
      ctx.lineTo(arrowEndX, arrowY)
      ctx.stroke()

      ctx.beginPath()
      ctx.moveTo(arrowEndX, arrowY)
      ctx.lineTo(arrowEndX + arrowSize * 0.6, arrowY - arrowSize * 0.5)
      ctx.lineTo(arrowEndX + arrowSize * 0.6, arrowY + arrowSize * 0.5)
      ctx.closePath()
      ctx.fill()

      ctx.font = '14px Quicksand, sans-serif'
      ctx.fillStyle = 'rgba(239, 68, 68, 0.8)'
      ctx.textAlign = 'center'
      ctx.fillText('Write this way →', overlay.width / 2, arrowY - 15)
    } else if (direction === 'ltr' && !isSentence && isComplex) {
      const arrowSize = 20
      const arrowY = overlay.height * 0.88
      const arrowStartX = overlay.width * 0.3
      const arrowEndX = overlay.width * 0.7

      ctx.strokeStyle = 'rgba(34, 197, 94, 0.6)'
      ctx.fillStyle = 'rgba(34, 197, 94, 0.6)'
      ctx.lineWidth = 3
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'

      ctx.beginPath()
      ctx.moveTo(arrowStartX, arrowY)
      ctx.lineTo(arrowEndX, arrowY)
      ctx.stroke()

      ctx.beginPath()
      ctx.moveTo(arrowEndX, arrowY)
      ctx.lineTo(arrowEndX - arrowSize * 0.6, arrowY - arrowSize * 0.5)
      ctx.lineTo(arrowEndX - arrowSize * 0.6, arrowY + arrowSize * 0.5)
      ctx.closePath()
      ctx.fill()

      ctx.font = '14px Quicksand, sans-serif'
      ctx.fillStyle = 'rgba(34, 197, 94, 0.8)'
      ctx.textAlign = 'center'
      ctx.fillText('← Write this way', overlay.width / 2, arrowY - 15)
    }
  }

  const redrawStrokes = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    strokes.forEach((stroke) => {
      drawStrokeWithColors(ctx, stroke, canvas.width, canvas.height)
    })

    if (currentStroke.length > 0) {
      drawStrokeWithColors(ctx, currentStroke, canvas.width, canvas.height)
    }
  }

  const drawStrokeWithColors = (
    ctx: CanvasRenderingContext2D,
    points: Point[],
    canvasWidth: number,
    canvasHeight: number
  ) => {
    if (points.length < 2) return

    ctx.lineWidth = 4
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'

    for (let i = 0; i < points.length - 1; i++) {
      const currentPoint = points[i]
      const nextPoint = points[i + 1]
      
      const currentColor = getStrokeColor(currentPoint, canvasWidth, canvasHeight)
      const nextColor = getStrokeColor(nextPoint, canvasWidth, canvasHeight)
      
      const gradient = ctx.createLinearGradient(
        currentPoint.x,
        currentPoint.y,
        nextPoint.x,
        nextPoint.y
      )
      gradient.addColorStop(0, currentColor)
      gradient.addColorStop(1, nextColor)
      
      ctx.strokeStyle = gradient
      ctx.beginPath()
      ctx.moveTo(currentPoint.x, currentPoint.y)
      ctx.lineTo(nextPoint.x, nextPoint.y)
      ctx.stroke()
    }
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

    const distance = getDistanceFromCharacter(point, canvas.width, canvas.height)
    const thresholds = getPrecisionThresholds()

    if (distance > 0) {
      if (distance >= thresholds.far) {
        triggerHapticFeedback('error')
      } else if (distance >= thresholds.moderate) {
        triggerHapticFeedback('heavy')
      } else {
        triggerHapticFeedback('moderate')
      }
    }

    redrawStrokes()
  }

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return
    e.preventDefault()

    const canvas = canvasRef.current
    if (canvas) {
      canvas.releasePointerCapture(e.pointerId)
    }

    stopHapticFeedback()

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
