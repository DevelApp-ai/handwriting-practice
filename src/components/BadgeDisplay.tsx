import { BadgeId, BADGES } from '@/lib/types'
import { getBadgeColor } from '@/lib/gamification'

export interface BadgeDisplayProps {
  badgeId: BadgeId
  size?: 'sm' | 'md' | 'lg'
  showName?: boolean
}

export function BadgeDisplay({ badgeId, size = 'md', showName = false }: BadgeDisplayProps) {
  const badge = BADGES[badgeId]
  const color = getBadgeColor(badgeId)

  if (!badge) return null

  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-12 h-12 text-sm',
    lg: 'w-16 h-16 text-lg',
  }

  return (
    <div className="flex flex-col items-center">
      <div
        className={`flex items-center justify-center rounded-full border-2 shadow-md ${sizeClasses[size]}`}
        style={{ background: `linear-gradient(135deg, ${color} 0%, ${color}cc 100%)`, borderColor: color }}
        title={badge.name}
      >
        <span className="font-bold text-white">{getBadgeIcon(badgeId)}</span>
      </div>
      {showName && (
        <span className="mt-1 text-xs text-gray-600 dark:text-gray-300">
          {badge.name}
        </span>
      )}
    </div>
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

export interface BadgeCollectionProps {
  badgeIds: BadgeId[]
  maxVisible?: number
}

export function BadgeCollection({ badgeIds, maxVisible = 10 }: BadgeCollectionProps) {
  const visibleBadges = badgeIds.slice(0, maxVisible)
  const remainingCount = badgeIds.length - maxVisible

  return (
    <div className="flex flex-wrap gap-2">
      {visibleBadges.map((badgeId) => (
        <BadgeDisplay key={badgeId} badgeId={badgeId} size="sm" />
      ))}
      {remainingCount > 0 && (
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700">
          <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
            +{remainingCount}
          </span>
        </div>
      )}
    </div>
  )
}
