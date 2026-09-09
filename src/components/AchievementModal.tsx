import { useEffect, useState } from 'react'
import { AchievementId, ACHIEVEMENTS, BADGES } from '@/lib/types'
import { getBadgeForAchievement, getBadgeColor } from '@/lib/gamification'
import { Modal } from '@/components/ui/modal'

export interface AchievementModalProps {
  isOpen: boolean
  onClose: () => void
  achievementId: AchievementId | null
}

export function AchievementModal({ isOpen, onClose, achievementId }: AchievementModalProps) {
  const [isVisible, setIsVisible] = useState(isOpen)

  useEffect(() => {
    setIsVisible(isOpen)
  }, [isOpen])

  useEffect(() => {
    if (!isVisible) return
    const timer = setTimeout(() => {
      onClose()
    }, 5000)
    return () => clearTimeout(timer)
  }, [isVisible, onClose])

  if (!achievementId) return null

  const achievement = ACHIEVEMENTS[achievementId]
  const badgeId = getBadgeForAchievement(achievementId)
  const badgeColor = badgeId ? getBadgeColor(badgeId) : '#FFD700'

  if (!achievement) return null

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Achievement Unlocked!">
      <div className="flex flex-col items-center justify-center p-6 text-center">
        <div
          className="mb-4 flex h-24 w-24 items-center justify-center rounded-full border-4 border-gold-500 bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg"
          style={{ background: `linear-gradient(135deg, ${badgeColor} 0%, ${badgeColor}cc 100%)` }}
        >
          {badgeId && (
            <span className="text-4xl">
              {getBadgeIcon(badgeId)}
            </span>
          )}
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          {achievement.name}
        </h2>
        <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
          {achievement.description}
        </p>
        <div className="mt-4 flex gap-2">
          <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            +50 XP
          </span>
          <span className="rounded-full bg-yellow-100 px-4 py-2 text-sm font-medium text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
            +1 Star
          </span>
        </div>
        <button
          onClick={onClose}
          className="mt-6 rounded-lg bg-primary px-6 py-2 text-white transition-colors hover:bg-primary/90"
        >
          Continue
        </button>
      </div>
    </Modal>
  )
}

function getBadgeIcon(badgeId: BadgeId): string {
  const icons: Record<BadgeId, string> = {
    bronze: '\u{1F7E8}',
    silver: '\u{1F7E6}',
    gold: '\u{1F7E7}',
    platinum: '\u2605',
    diamond: '\u2666',
    early_bird: '\u{1F425}',
    night_owl: '\u{1F989}',
    weekend_warrior: '\u{1F3C6}',
    perfect_week: '\u2705',
    speed_writer: '\u270F',
    perfectionist: '\u{1F3F7}',
  }
  return icons[badgeId] || '\u2705'
}
