import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, fireEvent, act, screen } from '@testing-library/react'
import App from '@/App'
import { installCanvasContextMock, type CanvasMock } from '@/test/canvas'

/**
 * Integration test for the main selection -> practice -> completion flow.
 */
describe('App', () => {
  let canvasMock: CanvasMock

  beforeEach(() => {
    canvasMock = installCanvasContextMock()
    window.localStorage.clear()
  })

  afterEach(() => {
    canvasMock.restore()
    vi.useRealTimers()
  })

  it('starts on the selection screen', () => {
    render(<App />)
    expect(screen.getByText('WriteRight')).toBeInTheDocument()
    // Character cards for the default language are rendered.
    expect(screen.getByText('A')).toBeInTheDocument()
  })

  it('selecting a character opens the practice screen and Back returns to selection', () => {
    render(<App />)

    fireEvent.click(screen.getByText('A'))
    // Practice screen is now the active screen.
    expect(
      screen.getByRole('region', { name: 'Writing practice area for "A"' })
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Done!' })).toBeInTheDocument()

    fireEvent.click(
      screen.getByRole('button', { name: 'Back to character selection' })
    )
    expect(screen.getByText('WriteRight')).toBeInTheDocument()
  })

  it('completing a practice returns to the selection screen', () => {
    vi.useFakeTimers()
    render(<App />)

    fireEvent.click(screen.getByText('A'))
    expect(
      screen.getByRole('region', { name: 'Writing practice area for "A"' })
    ).toBeInTheDocument()

    // Finish the practice: Done -> celebration -> back to selection.
    fireEvent.click(screen.getByRole('button', { name: 'Done!' }))
    act(() => {
      vi.advanceTimersByTime(2600)
    })

    expect(screen.getByText('WriteRight')).toBeInTheDocument()
    expect(
      screen.queryByRole('region', { name: 'Writing practice area for "A"' })
    ).not.toBeInTheDocument()
  })

  it('records progress for a completed character', () => {
    vi.useFakeTimers()
    render(<App />)

    fireEvent.click(screen.getByText('A'))
    fireEvent.click(screen.getByRole('button', { name: 'Done!' }))
    act(() => {
      vi.advanceTimersByTime(2600)
    })

    // Progress is persisted through useKV/localStorage after completion.
    const raw = window.localStorage.getItem('user-progress')
    expect(raw).toBeTruthy()
    const progress = JSON.parse(raw!) as {
      progress?: Record<string, { completed?: boolean; attempts?: number }>
    }
    expect(progress.progress).toBeDefined()
    expect(progress.progress!['A']).toBeDefined()
    expect(progress.progress!['A']!.completed).toBe(true)
  })
})
