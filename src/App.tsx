import { useState, useEffect, useCallback, useRef } from 'react'
import { useKV } from '@/lib/useKV'
import { SelectionScreen } from '@/components/SelectionScreen'
import { RadicalExplorer } from '@/components/RadicalExplorer'
import { PracticeScreen } from '@/components/PracticeScreen'
import { PrintableSheet } from '@/components/PrintableSheet'
import { AchievementsPage } from '@/pages/AchievementsPage'
import { AchievementModal } from '@/components/AchievementModal'
import { LevelUpModal } from '@/components/LevelUpModal'
import { UserProgress, AchievementId, DailyChallenge, WeeklyChallenge } from '@/lib/types'
import { createDefaultProgress, updateProgressWithGamification, checkAchievements, ensureTodayChallenges, claimDailyChallengeReward, claimWeeklyChallengeReward } from '@/lib/gamification'
import { getLanguageByCode } from '@/lib/languages'
import { applyReviewToProgress, ReviewQuality } from '@/lib/srs'
import { StrokeReport } from '@/lib/strokeEval'
import { Toaster } from '@/components/ui/sonner'
import { toast } from 'sonner'

function App() {
  const [userProgress, setUserProgress] = useKV<UserProgress>('user-progress', createDefaultProgress())
  const [selectedLanguage, setSelectedLanguage] = useKV<string>('selected-language', 'en')
  const [selectedCharacter, setSelectedCharacter] = useState<string | null>(null)
  const [isPracticing, setIsPracticing] = useState(false)
  const [showPrintableSheet, setShowPrintableSheet] = useState(false)
  const [showRadicalExplorer, setShowRadicalExplorer] = useState(false)
  const [showAchievements, setShowAchievements] = useState(false)
  const [showAchievementModal, setShowAchievementModal] = useState(false)
  const [achievementToShow, setAchievementToShow] = useState<AchievementId | null>(null)
  const [showLevelUpModal, setShowLevelUpModal] = useState(false)
  const [newLevel, setNewLevel] = useState(1)
  const prevLevelRef = useRef(userProgress?.level ?? 1)

  // Initialize progress with new fields if needed, and make sure today's
  // daily challenge exists so it shows up on the selection screen
  useEffect(() => {
    setUserProgress((current) => {
      let base = current ?? createDefaultProgress()
      if (!base.totalXP) {
        base = { ...createDefaultProgress(), ...base, totalXP: 0, level: 1 }
      }
      return ensureTodayChallenges(base)
    })
  }, [setUserProgress])

  const handleSelectCharacter = useCallback((character: string) => {
    setSelectedCharacter(character)
    setIsPracticing(true)
  }, [])

  const handleBack = useCallback(() => {
    setIsPracticing(false)
    setSelectedCharacter(null)
  }, [])

  const handleComplete = useCallback((stars: number, characterId: string, report?: StrokeReport) => {
    if (!characterId) return

    // Character ids are the raw practice text ('A', 'cat', 'Hello world'), so
    // only trust the id prefix when it really is a language code; otherwise
    // fall back to the selected language. Words and sentences are detected
    // from their shape so the matching challenges can advance.
    const prefix = characterId.split('_')[0]
    const language = getLanguageByCode(prefix) ? prefix : selectedLanguage || 'en'
    const isSentence = characterId.startsWith('sentence_') || characterId.includes(' ')
    const isWord = characterId.startsWith('word_') || (!isSentence && characterId.length > 1)

    setUserProgress((current) => {
      if (!current) {
        current = createDefaultProgress()
      }

      let updated = updateProgressWithGamification(current, characterId, stars, language, isWord, isSentence)
      if (report && updated.progress[characterId]) {
        const quality: ReviewQuality = {
          overall: report.overall,
          pauseCount: 0,
          strokeOrderErrors: report.strokeOrder !== undefined ? Math.round((1 - report.strokeOrder) * 10) : 0,
        }
        updated = {
          ...updated,
          progress: {
            ...updated.progress,
            [characterId]: applyReviewToProgress(updated.progress[characterId], quality),
          },
        }
      }

      // Check for new achievements
      const newAchievements = checkAchievements(current, characterId, stars, language, isWord, isSentence)
      if (newAchievements.length > 0) {
        setAchievementToShow(newAchievements[0])
        setShowAchievementModal(true)
      }

      // Check for level up
      if (updated.level > current.level) {
        setNewLevel(updated.level)
        setShowLevelUpModal(true)
      }

      const previousStars = current.progress[characterId]?.stars || 0
      const starsEarned = Math.max(0, stars - previousStars)

      if (starsEarned > 0) {
        toast.success(`You earned ${starsEarned} new star${starsEarned > 1 ? 's' : ''}!`)
      }

      if (!current.progress[characterId]?.completed && stars > 0) {
        toast.success('Character completed! \ud83c\udf89')
      }

      return updated
    })

    setIsPracticing(false)
    setSelectedCharacter(null)
  }, [selectedLanguage, setUserProgress])

  const handleCloseAchievement = useCallback(() => {
    setShowAchievementModal(false)
    setAchievementToShow(null)
  }, [])

  const handleCloseLevelUp = useCallback(() => {
    setShowLevelUpModal(false)
    setNewLevel(1)
  }, [])

  const handleClaimDailyChallenge = useCallback((challenge: DailyChallenge) => {
    const current = userProgress?.dailyChallenges.find((c) => c.id === challenge.id) ?? challenge
    if (!current.completed || current.claimed) return

    setUserProgress((progress) => claimDailyChallengeReward(progress ?? createDefaultProgress(), challenge.id))
    toast.success(`Daily challenge complete! +${current.rewardXP} XP, +${current.rewardStars} star${current.rewardStars > 1 ? 's' : ''}!`)
  }, [userProgress, setUserProgress])

  const handleClaimWeeklyChallenge = useCallback((challenge: WeeklyChallenge) => {
    const current = userProgress?.weeklyChallenges.find((c) => c.id === challenge.id) ?? challenge
    if (!current.completed || current.claimed) return

    setUserProgress((progress) => claimWeeklyChallengeReward(progress ?? createDefaultProgress(), challenge.id))
    toast.success(`Weekly challenge complete! +${current.rewardXP} XP${current.rewardBadge ? ' + badge' : ''}!`)
  }, [userProgress, setUserProgress])

  const handleViewAllAchievements = useCallback(() => {
    handleCloseAchievement()
    setShowAchievements(true)
  }, [handleCloseAchievement])

  // Show level up modal only when the level actually increases
  useEffect(() => {
    const currentLevel = userProgress?.level ?? 1
    if (currentLevel > prevLevelRef.current) {
      setNewLevel(currentLevel)
      setShowLevelUpModal(true)
    }
    prevLevelRef.current = currentLevel
  }, [userProgress?.level])

  if (showRadicalExplorer) {
    return <RadicalExplorer onBack={() => setShowRadicalExplorer(false)} />
  }
  if (showAchievements && userProgress) {
    return (
      <AchievementsPage
        onBack={() => setShowAchievements(false)}
        userProgress={userProgress}
      />
    )
  }
  if (isPracticing && selectedCharacter) {
    return (
      <>
        <PracticeScreen
          character={selectedCharacter}
          onBack={handleBack}
          onComplete={(stars, _char, report) => handleComplete(stars, selectedCharacter, report)}
        />
        <Toaster />
        <AchievementModal
          isOpen={showAchievementModal}
          onClose={handleCloseAchievement}
          achievementId={achievementToShow}
          onViewAll={handleViewAllAchievements}
        />
        <LevelUpModal
          isOpen={showLevelUpModal}
          onClose={handleCloseLevelUp}
          newLevel={newLevel}
        />
      </>
    )
  }

  return (
    <>
      <SelectionScreen
        onSelectCharacter={handleSelectCharacter}
        progressData={userProgress?.progress || {}}
        totalStars={userProgress?.totalStars || 0}
        totalXP={userProgress?.totalXP || 0}
        level={userProgress?.level || 1}
        achievements={userProgress?.achievements || []}
        badges={userProgress?.badges || []}
        consecutiveDays={userProgress?.consecutiveDays || 0}
        dailyChallenges={userProgress?.dailyChallenges || []}
        onClaimDailyChallenge={handleClaimDailyChallenge}
        weeklyChallenges={userProgress?.weeklyChallenges || []}
        onClaimWeeklyChallenge={handleClaimWeeklyChallenge}
        selectedLanguage={selectedLanguage || 'en'}
        onLanguageChange={setSelectedLanguage}
        onPrintSheet={() => setShowPrintableSheet(true)}
        onOpenRadicalExplorer={() => setShowRadicalExplorer(true)}
        onOpenAchievements={() => setShowAchievements(true)}
      />
      <PrintableSheet
        isOpen={showPrintableSheet}
        onClose={() => setShowPrintableSheet(false)}
        selectedLanguage={selectedLanguage || 'en'}
      />
      <AchievementModal
        isOpen={showAchievementModal}
        onClose={handleCloseAchievement}
        achievementId={achievementToShow}
        onViewAll={handleViewAllAchievements}
      />
      <LevelUpModal
        isOpen={showLevelUpModal}
        onClose={handleCloseLevelUp}
        newLevel={newLevel}
      />
      <Toaster />
    </>
  )
}

export default App
