import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { SelectionScreen } from '@/components/SelectionScreen'
import { PracticeScreen } from '@/components/PracticeScreen'
import { PrintableSheet } from '@/components/PrintableSheet'
import { UserProgress, Progress } from '@/lib/types'
import { Toaster } from '@/components/ui/sonner'
import { toast } from 'sonner'

function App() {
  const [userProgress, setUserProgress] = useKV<UserProgress>('user-progress', {
    totalStars: 0,
    charactersCompleted: 0,
    progress: {},
    achievements: [],
    consecutiveDays: 0,
    lastPracticeDate: '',
  })

  const [selectedLanguage, setSelectedLanguage] = useKV<string>('selected-language', 'en')

  const [selectedCharacter, setSelectedCharacter] = useState<string | null>(null)
  const [isPracticing, setIsPracticing] = useState(false)
  const [showPrintableSheet, setShowPrintableSheet] = useState(false)

  const handleSelectCharacter = (character: string) => {
    setSelectedCharacter(character)
    setIsPracticing(true)
  }

  const handleBack = () => {
    setIsPracticing(false)
    setSelectedCharacter(null)
  }

  const handleComplete = (stars: number) => {
    if (!selectedCharacter) return

    setUserProgress((current) => {
      if (!current) {
        current = {
          totalStars: 0,
          charactersCompleted: 0,
          progress: {},
          achievements: [],
          consecutiveDays: 0,
          lastPracticeDate: '',
        }
      }

      const characterProgress: Progress = current.progress[selectedCharacter] || {
        characterId: selectedCharacter,
        stars: 0,
        completed: false,
        attempts: 0,
        lastPracticed: Date.now(),
      }

      const previousStars = characterProgress.stars
      const newStars = Math.max(stars, previousStars)
      const isNewCompletion = !characterProgress.completed && stars > 0
      const starsEarned = newStars - previousStars

      const updatedProgress = {
        ...characterProgress,
        stars: newStars,
        completed: newStars > 0,
        attempts: characterProgress.attempts + 1,
        lastPracticed: Date.now(),
      }

      const newProgressMap = {
        ...current.progress,
        [selectedCharacter]: updatedProgress,
      }

      const completedCount = Object.values(newProgressMap).filter(
        (p) => p.completed
      ).length

      if (starsEarned > 0) {
        toast.success(`You earned ${starsEarned} new star${starsEarned > 1 ? 's' : ''}!`)
      }

      if (isNewCompletion) {
        toast.success('Character completed! 🎉')
      }

      return {
        totalStars: current.totalStars + starsEarned,
        charactersCompleted: completedCount,
        progress: newProgressMap,
        achievements: current.achievements,
        consecutiveDays: current.consecutiveDays,
        lastPracticeDate: new Date().toISOString().split('T')[0],
      }
    })

    setIsPracticing(false)
    setSelectedCharacter(null)
  }

  if (isPracticing && selectedCharacter) {
    return (
      <>
        <PracticeScreen
          character={selectedCharacter}
          onBack={handleBack}
          onComplete={handleComplete}
        />
        <Toaster />
      </>
    )
  }

  return (
    <>
      <SelectionScreen
        onSelectCharacter={handleSelectCharacter}
        progressData={userProgress?.progress || {}}
        totalStars={userProgress?.totalStars || 0}
        selectedLanguage={selectedLanguage || 'en'}
        onLanguageChange={setSelectedLanguage}
        onPrintSheet={() => setShowPrintableSheet(true)}
      />
      <PrintableSheet
        isOpen={showPrintableSheet}
        onClose={() => setShowPrintableSheet(false)}
        selectedLanguage={selectedLanguage || 'en'}
      />
      <Toaster />
    </>
  )
}

export default App