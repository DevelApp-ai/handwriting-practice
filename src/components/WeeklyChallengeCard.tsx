import { WeeklyChallenge } from '@/lib/types'
import { getWeekStartDate } from '@/lib/gamification'

export interface WeeklyChallengeCardProps {
  challenge: WeeklyChallenge
  onClaim: (challenge: WeeklyChallenge) => void
}

export function WeeklyChallengeCard({ challenge, onClaim }: WeeklyChallengeCardProps) {
  const progressPercent = Math.min(100, (challenge.progress / challenge.target) * 100)

  return (
    <div className="flex-1 min-w-[220px] rounded-xl border-2 border-secondary/20 bg-secondary/5 p-4 shadow-md transition-all hover:shadow-lg">
      <p className="text-sm text-gray-600 dark:text-gray-300">
        {challenge.description}
      </p>

      <div className="mt-3 flex items-center justify-between">
        <span className="text-xs font-medium text-gray-700 dark:text-gray-200">
          {challenge.progress}/{challenge.target}
        </span>
        <span className="text-xs font-medium text-primary">
          Reward: {challenge.rewardXP} XP{challenge.rewardBadge ? ' + Badge' : ''}
        </span>
      </div>

      <div className="mt-2 h-1.5 w-full rounded-full bg-gray-200 dark:bg-gray-700">
        <div
          className="h-1.5 rounded-full bg-gradient-to-r from-secondary to-secondary/70 transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {challenge.completed && !challenge.claimed && (
        <button
          onClick={() => onClaim(challenge)}
          className="mt-3 w-full rounded-lg bg-gradient-to-r from-green-500 to-green-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:from-green-600 hover:to-green-700"
        >
          Claim Reward
        </button>
      )}

      {challenge.claimed && (
        <span className="mt-3 block rounded-lg bg-green-100 px-3 py-1.5 text-center text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
          Reward claimed
        </span>
      )}
    </div>
  )
}

export interface WeeklyChallengesListProps {
  challenges: WeeklyChallenge[]
  onClaim: (challenge: WeeklyChallenge) => void
}

export function WeeklyChallengesList({ challenges, onClaim }: WeeklyChallengesListProps) {
  const weekStart = getWeekStartDate()
  const thisWeek = challenges.filter((c) => c.weekStart === weekStart)

  if (thisWeek.length === 0) return null

  return (
    <div className="w-full">
      <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
        Weekly Challenges
      </h3>
      <div className="flex flex-wrap gap-3">
        {thisWeek.map((challenge) => (
          <WeeklyChallengeCard key={challenge.id} challenge={challenge} onClaim={onClaim} />
        ))}
      </div>
    </div>
  )
}
