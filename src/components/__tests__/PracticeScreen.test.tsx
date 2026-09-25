import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, fireEvent, act, screen } from '@testing-library/react'
import { PracticeScreen } from '@/components/PracticeScreen'
import { installCanvasContextMock, type CanvasMock } from '@/test/canvas'

describe('PracticeScreen', () => {
  let canvasMock: CanvasMock

  beforeEach(() => {
    canvasMock = installCanvasContextMock()
    window.localStorage.clear()
  })

  afterEach(() => {
    canvasMock.restore()
    vi.useRealTimers()
  })

  it('renders the header, canvas region, and footer actions', () => {
    render(
      <PracticeScreen
        character="A"
        onBack={() => {}}
        onComplete={() => {}}
      />
    )
    expect(screen.getByText('A')).toBeInTheDocument()
    expect(
      screen.getByRole('region', { name: 'Writing practice area for "A"' })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Back to character selection' })
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Done!' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Clear' })).toBeInTheDocument()
  })

  it('announces the current character to screen readers', () => {
    render(
      <PracticeScreen
        character="A"
        onBack={() => {}}
        onComplete={() => {}}
      />
    )
    expect(
      screen.getByText(/Practicing "A"/i, { selector: '.sr-only' })
    ).toBeInTheDocument()
  })

  it('calls onBack when the Back button is pressed', () => {
    const onBack = vi.fn()
    render(
      <PracticeScreen character="A" onBack={onBack} onComplete={() => {}} />
    )
    fireEvent.click(
      screen.getByRole('button', { name: 'Back to character selection' })
    )
    expect(onBack).toHaveBeenCalledTimes(1)
  })

  it('opens the stroke order demo as a watch-only alternative', () => {
    render(
      <PracticeScreen character="A" onBack={() => {}} onComplete={() => {}} />
    )
    fireEvent.click(
      screen.getByRole('button', { name: /Watch stroke order demo/i })
    )
    expect(screen.getByText('Stroke Order for "A"')).toBeInTheDocument()
    expect(
      screen.getByText(/watch-only alternative/i)
    ).toBeInTheDocument()
  })

  it('toggles the selected practice mode', () => {
    render(
      <PracticeScreen character="A" onBack={() => {}} onComplete={() => {}} />
    )
    const blindButton = screen.getByRole('button', { name: 'blind mode' })
    expect(blindButton).toHaveAttribute('aria-pressed', 'false')
    fireEvent.click(blindButton)
    expect(blindButton).toHaveAttribute('aria-pressed', 'true')
    expect(
      screen.getByRole('button', { name: 'trace mode' })
    ).toHaveAttribute('aria-pressed', 'false')
  })

  it('completes the practice flow: Done -> celebration -> onComplete', () => {
    vi.useFakeTimers()
    const onComplete = vi.fn()
    render(
      <PracticeScreen character="A" onBack={() => {}} onComplete={onComplete} />
    )

    fireEvent.click(screen.getByRole('button', { name: 'Done!' }))
    // The celebration is showing and completion has not fired yet.
    expect(onComplete).not.toHaveBeenCalled()

    act(() => {
      vi.advanceTimersByTime(2600)
    })

    expect(onComplete).toHaveBeenCalledTimes(1)
    const [stars, characterId, report] = onComplete.mock.calls[0]
    expect(stars).toBeGreaterThanOrEqual(1)
    expect(stars).toBeLessThanOrEqual(3)
    expect(characterId).toBe('A')
    expect(report).toBeDefined()
    expect(typeof report?.overall).toBe('number')
  })

  it('clearing does not complete the practice', () => {
    vi.useFakeTimers()
    const onComplete = vi.fn()
    render(
      <PracticeScreen character="A" onBack={() => {}} onComplete={onComplete} />
    )

    fireEvent.click(screen.getByRole('button', { name: 'Clear' }))
    act(() => {
      vi.advanceTimersByTime(3000)
    })

    expect(onComplete).not.toHaveBeenCalled()
  })
})
