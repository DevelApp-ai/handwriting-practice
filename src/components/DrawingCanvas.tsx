import { useEffect, useRef, useState, useCallback, forwardRef, useImperativeHandle } from 'react'
import { Point, TimedPoint, Phase1Settings, DEFAULT_PHASE1_SETTINGS } from '@/lib/types'
import { useKV } from '@github/spark/hooks'
import { triggerHapticFeedback, stopHapticFeedback } from '@/lib/haptics'
import { getWritingDirection, isComplexScript, getSlantReferenceRad } from '@/lib/languages'
import { generateBasicStrokeOrder } from '@/lib/strokeOrder'
import { renderGrid, selectGridKind, drawShirorekhaLine, drawSlantGuide, detectScriptFamily } from '@/lib/grid'
import { evaluate, starsFromOverall, StrokeReport, StrokeFaultKind } from '@/lib/strokeEval'
import { computeLandmarks } from '@/lib/scaffold'
import { PracticeMode, DEFAULT_PRACTICE_MODE } from '@/lib/types'

interface DrawingCanvasProps {
  character: string
  onComplete: (stars: number, report: StrokeReport) => void
  showGuide: boolean
  practiceMode?: PracticeMode
}

export interface DrawingCanvasHandle {
  clear: () => void
  evaluateAndRender: () => { stars: number; report: StrokeReport }
}

const HEATMAP_COLORS: Record<StrokeFaultKind, string> = {
  ok: 'rgba(34, 197, 94, 0.9)',
  amber: 'rgba(234, 179, 8, 0.9)',
  red: 'rgba(239, 68, 68, 0.9)',
}

const BASE_STROKE_WIDTH = 4
const MIN_PRESSURE_WIDTH = 2
const MAX_PRESSURE_WIDTH = 10

function pressureWidth(pressure: number, enabled: boolean): number {
  if (!enabled || !pressure || pressure <= 0) return BASE_STROKE_WIDTH
  const clamped = Math.max(0.05, Math.min(1, pressure))
  return MIN_PRESSURE_WIDTH + (MAX_PRESSURE_WIDTH - MIN_PRESSURE_WIDTH) * clamped
}

export const DrawingCanvas = forwardRef<DrawingCanvasHandle, DrawingCanvasProps>(
  function DrawingCanvas({ character, onComplete, showGuide, practiceMode = DEFAULT_PRACTICE_MODE }, ref) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const overlayRef = useRef<HTMLCanvasElement>(null)
  const heatmapRef = useRef<HTMLCanvasElement>(null)
  const strokesRef = useRef<TimedPoint[][]>([])
  const [isDrawing, setIsDrawing] = useState(false)
  const [strokes, setStrokes] = useState<TimedPoint[][]>([])
  const [currentStroke, setCurrentStroke] = useState<TimedPoint[]>([])
  const [userProgress] = useKV<any>('user-progress', { progress: {} })
  const [phase1Settings] = useKV<Phase1Settings>('phase1-settings', DEFAULT_PHASE1_SETTINGS)

  const settings: Phase1Settings = { ...DEFAULT_PHASE1_SETTINGS, ...phase1Settings }
  const activePointerTypeRef = useRef<string>('')
  const rafRef = useRef<number | null>(null)
  const pendingRedrawRef = useRef(false)

  useEffect(() => {
    strokesRef.current = strokes
  }, [strokes])

  const clearHeatmap = useCallback(() => {
    const heatmap = heatmapRef.current
    if (!heatmap) return
    const ctx = heatmap.getContext('2d')
    if (!ctx) return
    ctx.clearRect(0, 0, heatmap.width, heatmap.height)
  }, [])

  const renderHeatmap = useCallback((report: StrokeReport) => {
    const heatmap = heatmapRef.current
    if (!heatmap) return
    const ctx = heatmap.getContext('2d')
    if (!ctx) return
    ctx.clearRect(0, 0, heatmap.width, heatmap.height)

    const allStrokes = strokesRef.current
    const perStroke = report.perStroke
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'

    for (let s = 0; s < allStrokes.length; s++) {
      const stroke = allStrokes[s]
      const fault = perStroke[s]
      const color = fault ? HEATMAP_COLORS[fault.kind] : HEATMAP_COLORS.ok
      if (stroke.length < 2) continue
      ctx.strokeStyle = color
      ctx.lineWidth = pressureWidth(
        stroke[0].pressure ?? 0,
        settings.showPressureWidth,
      )
      ctx.beginPath()
      ctx.moveTo(stroke[0].x, stroke[0].y)
      for (let i = 1; i < stroke.length; i++) {
        ctx.lineTo(stroke[i].x, stroke[i].y)
      }
      ctx.stroke()
    }
  }, [settings.showPressureWidth])

  useImperativeHandle(ref, () => ({
    clear: () => {
      setStrokes([])
      setCurrentStroke([])
      strokesRef.current = []
      clearHeatmap()
    },
    evaluateAndRender: () => {
      const canvas = canvasRef.current
      const allStrokes = strokesRef.current
      const report: StrokeReport = evaluate(allStrokes, character, {
        slantReferenceRad: getSlantReferenceRad(character),
        bounds: canvas ? getCharacterEvalBounds(canvas.width, canvas.height) : undefined,
      })
      renderHeatmap(report)
      const stars = starsFromOverall(report.overall)
      return { stars, report }
    },
  }), [character, renderHeatmap, clearHeatmap])

  const LINE_HEIGHTS = {
    ascender: 0.25,
    midline: 0.42,
    baseline: 0.58,
    descender: 0.75,
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

  const getCanvasScale = () => {
    switch (settings.canvasScale) {
      case '2x': return 2
      case '1.5x': return 1.5
      default: return 1
    }
  }

  const getEffectiveBounds = (canvasWidth: number, canvasHeight: number) => {
    const scale = getCanvasScale()
    if (scale === 1) return { width: canvasWidth, height: canvasHeight }
    const width = canvasWidth / scale
    const height = canvasHeight / scale
    return { width, height, offsetX: (canvasWidth - width) / 2, offsetY: (canvasHeight - height) / 2 }
  }

  const getCharacterBounds = (canvasWidth: number, canvasHeight: number) => {
    const isSentence = character.length > 15
    const isWord = character.length > 1 && character.length <= 15
    const bounds = getEffectiveBounds(canvasWidth, canvasHeight)
    const offsetX = 'offsetX' in bounds ? (bounds as any).offsetX : 0
    const offsetY = 'offsetY' in bounds ? (bounds as any).offsetY : 0
    
    let fontSize = bounds.height * 0.4
    if (isSentence) {
      fontSize = bounds.height * 0.12
    } else if (isWord) {
      fontSize = bounds.height * 0.25
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

    const centerX = offsetX + bounds.width / 2
    const baselineY = offsetY + bounds.height * LINE_HEIGHTS.baseline
    const metrics = ctx.measureText(character)

    const actualHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent
    const actualWidth = metrics.width

    const bTop = baselineY - metrics.actualBoundingBoxAscent
    const bBottom = baselineY + metrics.actualBoundingBoxDescent
    const bLeft = centerX - actualWidth / 2
    const bRight = centerX + actualWidth / 2

    return {
      top: bTop,
      bottom: bBottom,
      left: bLeft,
      right: bRight,
      centerX,
      baselineY,
      evalBounds: {
        left: bLeft,
        top: bTop,
        width: Math.max(1, bRight - bLeft),
        height: Math.max(1, bBottom - bTop),
      },
    }
  }

  const getCharacterEvalBounds = (
    canvasWidth: number,
    canvasHeight: number,
  ): { left: number; top: number; width: number; height: number } | undefined => {
    const b = getCharacterBounds(canvasWidth, canvasHeight)
    return b ? (b as any).evalBounds : undefined
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
    const heatmap = heatmapRef.current
    if (!canvas || !overlay) return

    const resizeCanvas = () => {
      const parent = canvas.parentElement
      if (!parent) return

      const size = Math.min(parent.clientWidth, parent.clientHeight)
      canvas.width = size
      canvas.height = size
      overlay.width = size
      overlay.height = size
      if (heatmap) {
        heatmap.width = size
        heatmap.height = size
        const hctx = heatmap.getContext('2d')
        hctx?.clearRect(0, 0, size, size)
      }

      drawGuideLines()
      drawCharacterGuide()
      drawLandmarks()
      redrawStrokes()
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)
    return () => window.removeEventListener('resize', resizeCanvas)
  }, [character, showGuide, practiceMode])

  useEffect(() => {
    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  const showGhost =
    showGuide && (practiceMode === 'observe' || practiceMode === 'trace')
  const showLandmarks = showGuide && practiceMode === 'landmark'

  const drawLandmarks = () => {
    if (!showLandmarks || character.length !== 1) return
    const overlay = overlayRef.current
    if (!overlay) return
    const ctx = overlay.getContext('2d')
    if (!ctx) return
    const landmarks = computeLandmarks(character)
    const bounds = getEffectiveBounds(overlay.width, overlay.height)
    const offsetX = 'offsetX' in bounds ? (bounds as any).offsetX : 0
    const offsetY = 'offsetY' in bounds ? (bounds as any).offsetY : 0
    let dotIndex = 0
    for (const lm of landmarks) {
      const x = offsetX + lm.x * bounds.width
      const y = offsetY + lm.y * bounds.height
      const radius = lm.kind === 'start' ? 14 : 9
      ctx.beginPath()
      ctx.arc(x, y, radius, 0, Math.PI * 2)
      ctx.fillStyle = lm.kind === 'start' ? 'rgba(34, 197, 94, 0.85)' : 'rgba(234, 179, 8, 0.7)'
      ctx.fill()
      if (lm.kind === 'start') {
        dotIndex++
        ctx.fillStyle = 'white'
        ctx.font = 'bold 12px Quicksand, sans-serif'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(String(dotIndex), x, y)
      }
    }
  }

  useEffect(() => {
    drawGuideLines()
    drawCharacterGuide()
    drawLandmarks()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showGuide, showGhost, showLandmarks, practiceMode])

  useEffect(() => {
    redrawStrokes()
  }, [strokes, currentStroke])

  const drawGuideLines = () => {
    const overlay = overlayRef.current
    if (!overlay) return

    const ctx = overlay.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, overlay.width, overlay.height)

    const bounds = getEffectiveBounds(overlay.width, overlay.height)
    const gridKind = selectGridKind(character, settings.gridKind)
    const family = detectScriptFamily(character)
    const isSentence = character.length > 15

    ctx.save()
    if ('offsetX' in bounds) {
      ctx.translate(bounds.offsetX as number, bounds.offsetY as number)
    }

    renderGrid(ctx, bounds.width, bounds.height, gridKind, { showLabels: showGuide })

    if (family === 'devanagari' && gridKind === 'four-line' && !isSentence) {
      drawShirorekhaLine(ctx, bounds.width, bounds.height, { showLabels: showGuide })
    }
    if (family === 'latin' && gridKind === 'four-line' && !isSentence && isComplexScript(character)) {
      drawSlantGuide(ctx, bounds.width, bounds.height)
    }

    ctx.restore()

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
    if (!showGhost) return

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

    const bounds = getEffectiveBounds(overlay.width, overlay.height)
    const offsetX = 'offsetX' in bounds ? (bounds as any).offsetX : 0
    const offsetY = 'offsetY' in bounds ? (bounds as any).offsetY : 0
    const centerX = offsetX + bounds.width / 2
    const baselineY = offsetY + bounds.height * LINE_HEIGHTS.baseline

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
      
      if (character.length === 1) {
        drawStrokeDirectionArrows(ctx, character, bounds.width, bounds.height)
      }
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

  const drawStrokeDirectionArrows = (
    ctx: CanvasRenderingContext2D,
    character: string,
    canvasWidth: number,
    canvasHeight: number
  ) => {
    const strokeData = generateBasicStrokeOrder(character)
    if (strokeData.strokes.length === 0) return

    strokeData.strokes.forEach((stroke) => {
      if (stroke.points.length < 2) return

      ctx.strokeStyle = 'rgba(34, 197, 94, 0.5)'
      ctx.lineWidth = 2
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'

      for (let i = 0; i < stroke.points.length - 1; i++) {
        const p1 = stroke.points[i]
        const p2 = stroke.points[i + 1]
        
        const x1 = p1.x * canvasWidth
        const y1 = p1.y * canvasHeight
        const x2 = p2.x * canvasWidth
        const y2 = p2.y * canvasHeight

        const dx = x2 - x1
        const dy = y2 - y1
        const length = Math.sqrt(dx * dx + dy * dy)
        
        if (length < 10) continue

        const midX = (x1 + x2) / 2
        const midY = (y1 + y2) / 2

        const angle = Math.atan2(dy, dx)
        
        const arrowSize = 8
        const perpAngle1 = angle + Math.PI * 0.75
        const perpAngle2 = angle - Math.PI * 0.75

        ctx.fillStyle = 'rgba(34, 197, 94, 0.7)'
        ctx.beginPath()
        ctx.moveTo(midX, midY)
        ctx.lineTo(midX + Math.cos(perpAngle1) * arrowSize, midY + Math.sin(perpAngle1) * arrowSize)
        ctx.lineTo(midX + Math.cos(perpAngle2) * arrowSize, midY + Math.sin(perpAngle2) * arrowSize)
        ctx.closePath()
        ctx.fill()
      }
    })
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
      const last = currentStroke[currentStroke.length - 1]
      if (last) drawTiltIndicator(ctx, last)
    }
  }

  const scheduleRedraw = useCallback(() => {
    if (pendingRedrawRef.current) return
    pendingRedrawRef.current = true
    rafRef.current = requestAnimationFrame(() => {
      pendingRedrawRef.current = false
      redrawStrokes()
    })
  }, [strokes, currentStroke])

  const drawStrokeWithColors = (
    ctx: CanvasRenderingContext2D,
    points: TimedPoint[],
    canvasWidth: number,
    canvasHeight: number
  ) => {
    if (points.length < 2) return

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
      ctx.lineWidth = pressureWidth(currentPoint.pressure, settings.showPressureWidth)
      ctx.beginPath()
      ctx.moveTo(currentPoint.x, currentPoint.y)
      ctx.lineTo(nextPoint.x, nextPoint.y)
      ctx.stroke()
    }
  }

  const drawTiltIndicator = (
    ctx: CanvasRenderingContext2D,
    point: TimedPoint,
  ) => {
    if (!settings.showTilt || point.pointerType !== 'pen') return
    if (point.tiltX === 0 && point.tiltY === 0) return
    const tiltMag = Math.sqrt(point.tiltX * point.tiltX + point.tiltY * point.tiltY)
    const angle = Math.atan2(point.tiltY, point.tiltX)
    const len = Math.min(24, tiltMag * 0.4)
    ctx.save()
    ctx.strokeStyle = 'rgba(99, 102, 241, 0.55)'
    ctx.fillStyle = 'rgba(99, 102, 241, 0.8)'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(point.x, point.y)
    ctx.lineTo(point.x + Math.cos(angle) * len, point.y + Math.sin(angle) * len)
    ctx.stroke()
    ctx.beginPath()
    ctx.arc(point.x, point.y, 3, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
  }

  const capturePoint = (e: React.PointerEvent<HTMLCanvasElement>): TimedPoint => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0, t: 0, pressure: 0, tiltX: 0, tiltY: 0, twist: 0, pointerType: '' }

    const rect = canvas.getBoundingClientRect()
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      t: e.timeStamp,
      pressure: e.pressure ?? 0,
      tiltX: e.tiltX ?? 0,
      tiltY: e.tiltY ?? 0,
      twist: e.twist ?? 0,
      pointerType: (e.pointerType ?? '') as TimedPoint['pointerType'],
    }
  }

  const captureRawPoint = (
    native: PointerEvent,
    canvas: HTMLCanvasElement,
  ): TimedPoint => {
    const rect = canvas.getBoundingClientRect()
    return {
      x: native.clientX - rect.left,
      y: native.clientY - rect.top,
      t: native.timeStamp,
      pressure: native.pressure ?? 0,
      tiltX: native.tiltX ?? 0,
      tiltY: native.tiltY ?? 0,
      twist: native.twist ?? 0,
      pointerType: (native.pointerType ?? '') as TimedPoint['pointerType'],
    }
  }

  const isPalmRejected = (e: React.PointerEvent<HTMLCanvasElement>): boolean => {
    if (!settings.palmRejection) return false
    const active = activePointerTypeRef.current
    if (active && e.pointerType !== active) return true
    return false
  }

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.preventDefault()
    const canvas = canvasRef.current
    if (!canvas) return

    if (isPalmRejected(e)) return
    activePointerTypeRef.current = e.pointerType ?? ''

    canvas.setPointerCapture(e.pointerId)
    setIsDrawing(true)
    const point = capturePoint(e)
    setCurrentStroke([point])
  }

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return
    e.preventDefault()
    if (isPalmRejected(e)) return

    const canvas = canvasRef.current
    if (!canvas) return

    const newPoints: TimedPoint[] = [capturePoint(e)]
    const native = e.nativeEvent
    if (native && typeof (native as PointerEvent).getCoalescedEvents === 'function') {
      const coalesced = (native as PointerEvent).getCoalescedEvents()
      if (coalesced && coalesced.length > 1) {
        newPoints.length = 0
        for (const ev of coalesced) newPoints.push(captureRawPoint(ev, canvas))
      }
    }

    setCurrentStroke((prev) => {
      const merged = newPoints.length > 1 ? [...prev, ...newPoints] : [...prev, newPoints[0]]
      return merged
    })

    const lastPoint = newPoints[newPoints.length - 1]
    const distance = getDistanceFromCharacter(lastPoint, canvas.width, canvas.height)
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

    scheduleRedraw()
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
    activePointerTypeRef.current = ''
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
          ref={heatmapRef}
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
)
