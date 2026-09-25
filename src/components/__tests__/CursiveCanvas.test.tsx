import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { render, fireEvent, act, screen } from '@testing-library/react'
import { createRef } from 'react'
import {
  CursiveCanvas,
  CursiveCanvasHandle,
} from '@/components/CursiveCanvas'
import { installCanvasContextMock, type CanvasMock } from '@/test/canvas'

describe('CursiveCanvas', () => {
  let canvasMock: CanvasMock

  beforeEach(() => {
    canvasMock = installCanvasContextMock()
    window.localStorage.clear()
  })

  afterEach(() => {
    canvasMock.restore()
  })

  const drawStroke = (canvas: HTMLElement) => {
    fireEvent.pointerDown(canvas, {
      pointerId: 1,
      pointerType: 'pen',
      clientX: 10,
      clientY: 10,
    })
    fireEvent.pointerMove(canvas, {
      pointerId: 1,
      pointerType: 'pen',
      clientX: 30,
      clientY: 30,
    })
    fireEvent.pointerMove(canvas, {
      pointerId: 1,
      pointerType: 'pen',
      clientX: 50,
      clientY: 25,
    })
    fireEvent.pointerUp(canvas, { pointerId: 1, pointerType: 'pen' })
  }

  it('renders the overlay and drawing canvases', () => {
    const { container } = render(
      <CursiveCanvas word="cat" onComplete={() => {}} showGuide />
    )
    expect(container.querySelectorAll('canvas')).toHaveLength(2)
  })

  it('exposes an accessible cursive practice region', () => {
    render(<CursiveCanvas word="cat" onComplete={() => {}} showGuide />)
    expect(
      screen.getByRole('region', {
        name: 'Cursive writing practice area for "cat"',
      })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('img', {
        name: 'Drawing canvas for practicing the cursive word "cat"',
      })
    ).toBeInTheDocument()
  })

  it('captures pointer input and evaluates it per glyph', async () => {
    const handleRef = createRef<CursiveCanvasHandle>()
    const { container } = render(
      <CursiveCanvas
        ref={handleRef}
        word="cat"
        onComplete={() => {}}
        showGuide
      />
    )
    const drawingCanvas = container.querySelector(
      'canvas:not([aria-hidden])'
    ) as HTMLElement

    drawStroke(drawingCanvas)
    await act(async () => {})

    const result = handleRef.current!.evaluateAndRender()
    expect(result.stars).toBeGreaterThanOrEqual(1)
    expect(result.stars).toBeLessThanOrEqual(3)
    expect(typeof result.report.overall).toBe('number')
  })

  it('clear() resets captured strokes', async () => {
    const handleRef = createRef<CursiveCanvasHandle>()
    const { container } = render(
      <CursiveCanvas
        ref={handleRef}
        word="cat"
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
    // No candidate points remain near any glyph, so the evaluation is empty.
    expect(result.report.overall).toBe(0)
    expect(result.stars).toBe(1)
  })

  it('changing the word resets the drawing', async () => {
    const handleRef = createRef<CursiveCanvasHandle>()
    const { container, rerender } = render(
      <CursiveCanvas
        ref={handleRef}
        word="cat"
        onComplete={() => {}}
        showGuide
      />
    )
    const drawingCanvas = container.querySelector(
      'canvas:not([aria-hidden])'
    ) as HTMLElement

    drawStroke(drawingCanvas)
    await act(async () => {})

    rerender(
      <CursiveCanvas
        ref={handleRef}
        word="dog"
        onComplete={() => {}}
        showGuide
      />
    )
    await act(async () => {})

    const result = handleRef.current!.evaluateAndRender()
    // The word-change effect clears strokes, and no points are near the new
    // glyphs, so nothing scores.
    expect(result.report.overall).toBe(0)
  })
})
