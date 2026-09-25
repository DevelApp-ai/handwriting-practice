import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, fireEvent, act, screen } from '@testing-library/react'
import { createRef } from 'react'
import {
  DrawingCanvas,
  DrawingCanvasHandle,
} from '@/components/DrawingCanvas'
import { installCanvasContextMock, type CanvasMock } from '@/test/canvas'

describe('DrawingCanvas', () => {
  let canvasMock: CanvasMock

  beforeEach(() => {
    canvasMock = installCanvasContextMock()
    window.localStorage.clear()
  })

  afterEach(() => {
    canvasMock.restore()
    vi.useRealTimers()
  })

  const drawStroke = (canvas: HTMLElement) => {
    fireEvent.pointerDown(canvas, {
      pointerId: 1,
      pointerType: 'pen',
      pressure: 0.5,
      clientX: 10,
      clientY: 10,
    })
    fireEvent.pointerMove(canvas, {
      pointerId: 1,
      pointerType: 'pen',
      pressure: 0.5,
      clientX: 20,
      clientY: 30,
    })
    fireEvent.pointerMove(canvas, {
      pointerId: 1,
      pointerType: 'pen',
      pressure: 0.5,
      clientX: 30,
      clientY: 50,
    })
    fireEvent.pointerUp(canvas, { pointerId: 1, pointerType: 'pen' })
  }

  it('renders the drawing, overlay, and heatmap canvases', () => {
    const { container } = render(
      <DrawingCanvas character="A" onComplete={() => {}} showGuide />
    )
    expect(container.querySelectorAll('canvas')).toHaveLength(3)
  })

  it('exposes an accessible practice region for screen readers', () => {
    render(<DrawingCanvas character="A" onComplete={() => {}} showGuide />)
    expect(
      screen.getByRole('region', { name: 'Writing practice area for "A"' })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('img', { name: 'Drawing canvas for practicing "A"' })
    ).toBeInTheDocument()
  })

  it('captures pointer input as strokes and evaluates them', async () => {
    const handleRef = createRef<DrawingCanvasHandle>()
    const { container } = render(
      <DrawingCanvas
        ref={handleRef}
        character="A"
        onComplete={() => {}}
        showGuide
      />
    )
    expect(handleRef.current).not.toBeNull()

    const drawingCanvas = container.querySelector(
      'canvas:not([aria-hidden])'
    ) as HTMLElement
    drawStroke(drawingCanvas)
    await act(async () => {})

    const result = handleRef.current!.evaluateAndRender()
    expect(result.stars).toBeGreaterThanOrEqual(1)
    expect(result.stars).toBeLessThanOrEqual(3)
    expect(result.report).toBeDefined()
    // A single drawn stroke should produce per-stroke feedback.
    expect(result.report.perStroke).toHaveLength(1)
  })

  it('clear() removes captured strokes', async () => {
    const handleRef = createRef<DrawingCanvasHandle>()
    const { container } = render(
      <DrawingCanvas
        ref={handleRef}
        character="A"
        onComplete={() => {}}
        showGuide
      />
    )

    const drawingCanvas = container.querySelector(
      'canvas:not([aria-hidden])'
    ) as HTMLElement
    drawStroke(drawingCanvas)
    await act(async () => {})

    handleRef.current!.clear()
    await act(async () => {})

    const result = handleRef.current!.evaluateAndRender()
    expect(result.report.overall).toBe(0)
    expect(result.report.perStroke).toHaveLength(0)
  })

  it('ignores a second pointer type while drawing (palm rejection)', async () => {
    const handleRef = createRef<DrawingCanvasHandle>()
    const { container } = render(
      <DrawingCanvas
        ref={handleRef}
        character="A"
        onComplete={() => {}}
        showGuide
      />
    )
    const drawingCanvas = container.querySelector(
      'canvas:not([aria-hidden])'
    ) as HTMLElement

    // Draw one full stroke with a pen.
    drawStroke(drawingCanvas)
    await act(async () => {})

    // Then try to start a second stroke with a finger; palm rejection
    // (enabled by default) should ignore it entirely.
    fireEvent.pointerDown(drawingCanvas, {
      pointerId: 2,
      pointerType: 'touch',
      clientX: 100,
      clientY: 100,
    })
    fireEvent.pointerMove(drawingCanvas, {
      pointerId: 2,
      pointerType: 'touch',
      clientX: 110,
      clientY: 110,
    })
    fireEvent.pointerUp(drawingCanvas, { pointerId: 2, pointerType: 'touch' })
    await act(async () => {})

    const result = handleRef.current!.evaluateAndRender()
    // Only the pen stroke was recorded.
    expect(result.report.perStroke).toHaveLength(1)
  })
})
