import { useState } from 'react'
import type { ReactElement } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Trophy, X, Flame, Calendar, Star } from '@phosphor-icons/react'
import { AchievementId, ACHIEVEMENTS, UserProgress } from '@/lib/types'
import { getAchievementProgress } from '@/lib/gamification'
import { BadgeDisplay } from '@/components/BadgeDisplay'
import { motion } from 'framer-motion'

interface AchievementsPageProps {
  onBack: () => void
  userProgress: UserProgress
}

type CategoryTab = 'all' | 'character' | 'language' | 'streak' | 'star' | 'special'

export function AchievementsPage({
  onBack,
  userProgress,
}: AchievementsPageProps) {
  const [selectedCategory, setSelectedCategory] = useState<CategoryTab>('all')

  const {
    achievements,
    badges,
    totalXP,
    level,
    consecutiveDays,
    totalStars,
  } = userProgress

  const categoryLabels: Record<CategoryTab, { label: string; icon: ReactElement; color: string }> = {
    all: { label: 'All', icon: <Trophy className="w-5 h-5" />, color: 'bg-purple-500' },
    character: { label: 'Character', icon: <Star className="w-5 h-5" />, color: 'bg-blue-500' },
    language: { label: 'Language', icon: <Flame className="w-5 h-5" />, color: 'bg-orange-500' },
    streak: { label: 'Streak', icon: <Calendar className="w-5 h-5" />, color: 'bg-green-500' },
    star: { label: 'Stars', icon: <Star className="w-5 h-5" />, color: 'bg-yellow-500' },
    special: { label: 'Special', icon: <Trophy className="w-5 h-5" />, color: 'bg-pink-500' },
  }

  const getCategory = (id: AchievementId): string => {
    const charAchievements: AchievementId[] = ['first_character', 'alphabet_master', 'number_expert', 'punctuation_pro', 'word_builder', 'sentence_scribe']
    const languageAchievements: AchievementId[] = ['english_expert', 'danish_expert', 'arabic_expert', 'japanese_expert', 'polyglot', 'linguist', 'global_writer']
    const streakAchievements: AchievementId[] = ['day_1', 'day_7', 'day_30', 'day_100', 'day_365']
    const starAchievements: AchievementId[] = ['first_star', 'ten_stars', 'fifty_stars', 'hundred_stars', 'five_hundred_stars', 'thousand_stars']
    const specialAchievements: AchievementId[] = ['early_bird', 'night_owl', 'weekend_warrior', 'perfect_week', 'speed_writer', 'perfectionist']

    if (charAchievements.includes(id)) return 'character'
    if (languageAchievements.includes(id)) return 'language'
    if (streakAchievements.includes(id)) return 'streak'
    if (starAchievements.includes(id)) return 'star'
    if (specialAchievements.includes(id)) return 'special'
    return 'all'
  }

  const filteredAchievements = Object.entries(ACHIEVEMENTS).filter(([id]) => {
    if (selectedCategory === 'all') return true
    return getCategory(id as AchievementId) === selectedCategory
  })

  const completedAchievements = new Set(achievements)

  return (
    <div className="h-screen flex flex-col bg-background">
      <div className="flex items-center justify-between p-4 md:p-6 border-b border-border bg-card shadow-sm">
        <Button
          variant="ghost"
          size="lg"
          onClick={onBack}
          className="gap-2"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="hidden sm:inline">Back</span>
        </Button>

        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
          Achievements
        </h1>

        <div />
      </div>

      <div className="flex-1 overflow-hidden">
        <div className="p-4 md:p-6 space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <SummaryCard
              icon={<Trophy className="w-6 h-6" />}
              label="Level"
              value={level}
              color="from-purple-500 to-pink-500"
            />
            <SummaryCard
              icon={<Star className="w-6 h-6" />}
              label="Total XP"
              value={totalXP.toLocaleString()}
              color="from-blue-500 to-cyan-500"
            />
            <SummaryCard
              icon={<Flame className="w-6 h-6" />}
              label="Streak"
              value={consecutiveDays}
              color="from-orange-500 to-red-500"
            />
            <SummaryCard
              icon={<Star className="w-6 h-6" />}
              label="Stars"
              value={totalStars}
              color="from-yellow-500 to-amber-500"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {Object.entries(categoryLabels).map(([key, { label, icon, color }]) => (
              <Button
                key={key}
                variant={selectedCategory === key ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(key as CategoryTab)}
                className={`gap-2 ${selectedCategory === key ? color : 'border-gray-300'}`}
              >
                {icon}
                {label}
              </Button>
            ))}
          </div>

          {/* Achievements Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAchievements.map(([id, achievement], index) => {
              const isCompleted = completedAchievements.has(id as AchievementId)
              const progress = getAchievementProgress(id as AchievementId, userProgress)

              return (
                <motion.div
                  key={id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                >
                  <AchievementCard
                    id={id as AchievementId}
                    name={achievement.name}
                    description={achievement.description}
                    isCompleted={isCompleted}
                    current={progress.current}
                    target={progress.target}
                  />
                </motion.div>
              )
            })}
          </div>

          {/* Badges Section */}
          {badges.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Earned Badges
              </h2>
              <div className="flex flex-wrap gap-4">
                {badges.map((badgeId) => (
                  <motion.div
                    key={badgeId}
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    whileHover={{ scale: 1.1 }}
                  >
                    <BadgeDisplay badgeId={badgeId} size="lg" showName />
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function SummaryCard({ icon, label, value, color }: { icon: ReactElement; label: string; value: string | number; color: string }) {
  return (
    <div className="rounded-xl bg-card p-4 shadow-sm border border-border">
      <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${color}`}>
        <span className="text-white">{icon}</span>
      </div>
      <p className="mt-3 text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{label}</p>
    </div>
  )
}

function AchievementCard({
  name,
  description,
  isCompleted,
  current,
  target,
}: {
  id: AchievementId
  name: string
  description: string
  isCompleted: boolean
  current: number
  target: number
}) {
  const progressPercent = (current / target) * 100

  return (
    <div
      className={`rounded-xl border-2 p-4 transition-all ${isCompleted ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : 'border-gray-200 dark:border-gray-700 bg-card'}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{name}</h3>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{description}</p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
          {isCompleted ? (
            <X className="w-6 h-6 text-green-500" />
          ) : (
            <span className="text-sm font-bold text-gray-600 dark:text-gray-300">
              {Math.min(current, target)}/{target}
            </span>
          )}
        </div>
      </div>

      {!isCompleted && target > 1 && (
        <div className="mt-3">
          <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
            <div
              className="h-2 rounded-full bg-primary transition-all duration-300"
              style={{ width: `${Math.min(progressPercent, 100)}%` }}
            />
          </div>
        </div>
      )}

      {isCompleted && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="mt-3 flex justify-end"
        >
          <Badge className="bg-green-500 text-white">
            <Star weight="fill" className="w-4 h-4 mr-1" />
            Completed
          </Badge>
        </motion.div>
      )}
    </div>
  )
}
