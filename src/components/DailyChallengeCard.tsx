import { DailyChallenge } from '@/lib/types'
import { updateDailyChallenge } from '@/lib/gamification'

export interface DailyChallengeCardProps {
  challenge: DailyChallenge
  onUpdate: (updatedChallenge: DailyChallenge) => void
}

export function DailyChallengeCard({ challenge, onUpdate }: DailyChallengeCardProps) {
  const progressPercent = (challenge.progress / challenge.target) * 100

  const handleClaim = () => {
    if (challenge.completed) {
      const updated = { ...challenge, completed: false, progress: 0 }
      onUpdate(updated)
    }
  }

  return (
    <div className="w-full rounded-xl border-2 border-primary/20 bg-primary/5 p-4 shadow-lg transition-all hover:shadow-xl">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Daily Challenge
          </h3>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
            {challenge.description}
          </p>
          
          <div className="mt-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                Progress: {challenge.progress}/{challenge.target}
              </span>
              <span className="text-sm font-medium text-primary">
                Reward: {challenge.rewardXP} XP + {challenge.rewardStars} Star
              </span>
            </div>
            
            <div className="mt-2 h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
              <div
                className="h-2 rounded-full bg-gradient-to-r from-primary to-primary/70 transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {challenge.completed && (
        <div className="mt-4 flex justify-end">
          <button
            onClick={handleClaim}
            className="rounded-lg bg-gradient-to-r from-green-500 to-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:from-green-600 hover:to-green-700"
          >
            Claim Reward
          </button>
        </div>
      )}

      {!challenge.completed && progressPercent >= 100 && (
        <div className="mt-4 flex justify-end">
          <button
            onClick={() => onUpdate(updateDailyChallenge(challenge))}
            className="rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:from-amber-600 hover:to-amber-700"
          >
            Complete Challenge
          </button>
        </div>
      )}
    </div>
  )
}

export interface DailyChallengesListProps {
  challenges: DailyChallenge[]
  onUpdate: (updatedChallenge: DailyChallenge) => void
}

export function DailyChallengesList({ challenges, onUpdate }: DailyChallengesListProps) {
  const today = new Date().toISOString().split('T')[0]
  const todayChallenge = challenges.find((c) => c.date === today)

  if (!todayChallenge) return null

  return (
    <div className="w-full">
      <DailyChallengeCard challenge={todayChallenge} onUpdate={onUpdate} />
    </div>
  )
}
