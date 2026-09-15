import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DailyChallengeCard, DailyChallengesList } from '@/components/DailyChallengeCard'
import { DailyChallenge } from '@/lib/types'

const today = () => new Date().toISOString().split('T')[0]

function makeChallenge(overrides: Partial<DailyChallenge> = {}): DailyChallenge {
  return {
    id: `daily_${today()}`,
    type: 'character_marathon',
    description: 'Complete 10 characters in one session',
    target: 10,
    progress: 0,
    completed: false,
    rewardXP: 50,
    rewardStars: 1,
    date: today(),
    ...overrides,
  }
}

describe('DailyChallengeCard', () => {
  it('shows progress and reward for an ongoing challenge', () => {
    render(<DailyChallengeCard challenge={makeChallenge({ progress: 4 })} onClaim={() => {}} />)
    expect(screen.getByText(/Progress: 4\/10/)).toBeInTheDocument()
    expect(screen.getByText(/Reward: 50 XP \+ 1 Star/)).toBeInTheDocument()
    expect(screen.queryByText('Claim Reward')).not.toBeInTheDocument()
  })

  it('calls onClaim when the reward button is clicked', async () => {
    const user = userEvent.setup()
    const onClaim = vi.fn()
    render(
      <DailyChallengeCard
        challenge={makeChallenge({ progress: 10, completed: true })}
        onClaim={onClaim}
      />
    )
    await user.click(screen.getByText('Claim Reward'))
    expect(onClaim).toHaveBeenCalledTimes(1)
    expect(onClaim.mock.calls[0][0].completed).toBe(true)
  })

  it('shows the claimed state and no button after claiming', () => {
    render(
      <DailyChallengeCard
        challenge={makeChallenge({ progress: 10, completed: true, claimed: true })}
        onClaim={() => {}}
      />
    )
    expect(screen.getByText(/Reward claimed/)).toBeInTheDocument()
    expect(screen.queryByText('Claim Reward')).not.toBeInTheDocument()
  })
})

describe('DailyChallengesList', () => {
  it('renders the card for today challenge', () => {
    render(
      <DailyChallengesList
        challenges={[makeChallenge(), makeChallenge({ id: 'daily_2024-01-01', date: '2024-01-01' })]}
        onClaim={() => {}}
      />
    )
    expect(screen.getByText('Daily Challenge')).toBeInTheDocument()
  })

  it('renders nothing when there is no challenge for today', () => {
    const { container } = render(
      <DailyChallengesList
        challenges={[makeChallenge({ id: 'daily_2024-01-01', date: '2024-01-01' })]}
        onClaim={() => {}}
      />
    )
    expect(container.querySelector('button')).not.toBeInTheDocument()
  })
})
