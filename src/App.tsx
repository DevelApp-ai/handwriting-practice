import { useState, useEffect, useCallback } from 'react'
import { useKV } from '@github/spark/hooks'
import { SelectionScreen } from '@/components/SelectionScreen'
import { PracticeScreen } from '@/components/PracticeScreen'
import { PrintableSheet } from '@/components/PrintableSheet'
import { AchievementModal } from '@/components/AchievementModal'
import { LevelUpModal } from '@/components/LevelUpModal'
import { UserProgress, Progress, AchievementId, createDefaultProgress } from '@/lib/types'
import { updateProgressWithGamification, getLevelProgress, checkAchievements } from '@/lib/gamification'
import { Toaster } from '@/components/ui/sonner'
import { toast } from 'sonner'

function App() {
  const [userProgress, setUserProgress] = useKV<UserProgress>('user-progress', createDefaultProgress())
  const [selectedLanguage, setSelectedLanguage] = useKV<string>('selected-language', 'en')
  const [selectedCharacter, setSelectedCharacter] = useState<string | null>(null)
  const [isPracticing, setIsPracticing] = useState(false)
  const [showPrintableSheet, setShowPrintableSheet] = useState(false)
  const [showAchievementModal, setShowAchievementModal] = useState(false)
  const [achievementToShow, setAchievementToShow] = useState<AchievementId | null>(null)
  const [showLevelUpModal, setShowLevelUpModal] = useState(false)
  const [newLevel, setNewLevel] = useState(1)

  // Initialize progress with new fields if needed
  useEffect(() => {
    if (userProgress && !userProgress.totalXP) {
      setUserProgress({ ...createDefaultProgress(), ...userProgress, totalXP: 0, level: 1 })
    }
  }, [])

  const handleSelectCharacter = useCallback((character: string) => {
    setSelectedCharacter(character)
    setIsPracticing(true)
  }, [])

  const handleBack = useCallback(() => {
    setIsPracticing(false)
    setSelectedCharacter(null)
  }, [])

  const handleComplete = useCallback((stars: number, characterId: string) => {
    if (!characterId) return

    const language = characterId.split('_')[0] || selectedLanguage || 'en'
    const isWord = characterId.startsWith('word_')
    const isSentence = characterId.startsWith('sentence_')

    setUserProgress((current) => {
      if (!current) {
        current = createDefaultProgress()
      }

      const updated = updateProgressWithGamification(current, characterId, stars, language, isWord, isSentence)

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
  }, [selectedLanguage])

  const handleCloseAchievement = useCallback(() => {
    setShowAchievementModal(false)
    setAchievementToShow(null)
  }, [])

  const handleCloseLevelUp = useCallback(() => {
    setShowLevelUpModal(false)
    setNewLevel(1)
  }, [])

  // Show level up modal when level changes
  useEffect(() => {
    if (userProgress && userProgress.level > 1) {
      setNewLevel(userProgress.level)
      setShowLevelUpModal(true)
    }
  }, [userProgress?.level])

  if (isPracticing && selectedCharacter) {
    return (
      <>
        <PracticeScreen
          character={selectedCharacter}
          onBack={handleBack}
          onComplete={(stars) => handleComplete(stars, selectedCharacter)}
        />
        <Toaster />
        <AchievementModal
          isOpen={showAchievementModal}
          onClose={handleCloseAchievement}
          achievementId={achievementToShow}
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
        selectedLanguage={selectedLanguage || 'en'}
        onLanguageChange={setSelectedLanguage}
        onPrintSheet={() => setShowPrintableSheet(true)}
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
