import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { WeeklyChallengeCard, WeeklyChallengesList } from '@/components/WeeklyChallengeCard'
import { WeeklyChallenge } from '@/lib/types'
import { getWeekStartDate } from '@/lib/gamification'

function makeWeekly(overrides: Partial<WeeklyChallenge> = {}): WeeklyChallenge {
  return {
    id: `weekly_${getWeekStartDate()}_0`,
    type: 'xp_collector',
    description: 'Earn 500 XP this week',
    target: 500,
    progress: 0,
    completed: false,
    rewardXP: 200,
    rewardBadge: 'bronze',
    weekStart: getWeekStartDate(),
    ...overrides,
  }
}

describe('WeeklyChallengeCard', () => {
  it('shows progress and reward for an ongoing challenge', () => {
    render(<WeeklyChallengeCard challenge={makeWeekly({ progress: 120 })} onClaim={() => {}} />)
    expect(screen.getByText('120/500')).toBeInTheDocument()
    expect(screen.getByText(/Reward: 200 XP \+ Badge/)).toBeInTheDocument()
    expect(screen.queryByText('Claim Reward')).not.toBeInTheDocument()
  })

  it('calls onClaim when the reward button is clicked', async () => {
    const user = userEvent.setup()
    const onClaim = vi.fn()
    render(
      <WeeklyChallengeCard
        challenge={makeWeekly({ progress: 500, completed: true })}
        onClaim={onClaim}
      />
    )
    await user.click(screen.getByText('Claim Reward'))
    expect(onClaim).toHaveBeenCalledTimes(1)
    expect(onClaim.mock.calls[0][0].completed).toBe(true)
  })

  it('shows the claimed state and no button after claiming', () => {
    render(
      <WeeklyChallengeCard
        challenge={makeWeekly({ progress: 500, completed: true, claimed: true })}
        onClaim={() => {}}
      />
    )
    expect(screen.getByText(/Reward claimed/)).toBeInTheDocument()
    expect(screen.queryByText('Claim Reward')).not.toBeInTheDocument()
  })
})

describe('WeeklyChallengesList', () => {
  it('renders only this week challenges', () => {
    render(
      <WeeklyChallengesList
        challenges={[
          makeWeekly(),
          makeWeekly({ id: 'weekly_2024-01-01_0', weekStart: '2024-01-01' }),
        ]}
        onClaim={() => {}}
      />
    )
    expect(screen.getByText('Weekly Challenges')).toBeInTheDocument()
    expect(screen.getAllByText('Earn 500 XP this week')).toHaveLength(1)
  })

  it('renders nothing when there are no challenges for this week', () => {
    const { container } = render(
      <WeeklyChallengesList
        challenges={[makeWeekly({ id: 'weekly_2024-01-01_0', weekStart: '2024-01-01' })]}
        onClaim={() => {}}
      />
    )
    expect(container.querySelector('button')).not.toBeInTheDocument()
  })
})
