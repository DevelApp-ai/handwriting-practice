import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CharacterCard } from '@/components/CharacterCard'
import { Progress } from '@/lib/types'

describe('CharacterCard', () => {
  it('renders the character text', () => {
    render(<CharacterCard character="A" onClick={() => {}} />)
    expect(screen.getByText('A')).toBeInTheDocument()
  })

  it('calls onClick when the card is clicked', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(<CharacterCard character="B" onClick={onClick} />)
    await user.click(screen.getByText('B'))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('reflects completed progress with a check badge', () => {
    const progress: Progress = {
      characterId: 'en_a',
      stars: 3,
      completed: true,
      attempts: 1,
      lastPracticed: Date.now(),
    }
    const { container } = render(
      <CharacterCard character="A" progress={progress} onClick={() => {}} />
    )
    expect(container.querySelector('[data-slot="badge"]')).toBeInTheDocument()
  })

  it('renders without a check badge when progress is incomplete', () => {
    const { container } = render(<CharacterCard character="A" onClick={() => {}} />)
    expect(container.querySelector('[data-slot="badge"]')).not.toBeInTheDocument()
  })
})
