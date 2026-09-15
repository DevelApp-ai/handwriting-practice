import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { AchievementsPage } from '@/pages/AchievementsPage'
import { createDefaultProgress } from '@/lib/gamification'
import { BadgeId } from '@/lib/types'

describe('AchievementsPage', () => {
  it('renders the page with summary stats from userProgress', () => {
    const userProgress = {
      ...createDefaultProgress(),
      totalXP: 999,
      level: 4,
      totalStars: 30,
      consecutiveDays: 6,
    }
    render(<AchievementsPage onBack={() => {}} userProgress={userProgress} />)
    expect(screen.getByText('Achievements')).toBeTruthy()
    expect(screen.getByText('999')).toBeTruthy()
  })

  it('renders earned badges via BadgeDisplay', () => {
    const userProgress = {
      ...createDefaultProgress(),
      badges: ['bronze', 'gold'] as BadgeId[],
    }
    render(<AchievementsPage onBack={() => {}} userProgress={userProgress} />)
    expect(screen.getByTitle('Bronze Badge')).toBeTruthy()
    expect(screen.getByTitle('Gold Badge')).toBeTruthy()
  })

  it('shows achievements from the catalog by default', () => {
    render(<AchievementsPage onBack={() => {}} userProgress={createDefaultProgress()} />)
    expect(screen.getByText('First Step')).toBeTruthy()
    expect(screen.getByText('Star Master')).toBeTruthy()
  })
})
