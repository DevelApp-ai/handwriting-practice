import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { DrawingCanvas } from '@/components/DrawingCanvas'
import { Celebration } from '@/components/Celebration'
import { LineGuideHelper } from '@/components/LineGuideHelper'
import { StrokeOrderDemo } from '@/components/StrokeOrderDemo'
import { ArrowLeft, Trash, Eye, EyeSlash, Info, Path } from '@phosphor-icons/react'
import { motion } from 'framer-motion'
import { useKV } from '@github/spark/hooks'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'

interface PracticeScreenProps {
  character: string
  onBack: () => void
  onComplete: (stars: number) => void
}

export function PracticeScreen({ character, onBack, onComplete }: PracticeScreenProps) {
  const [showGuide, setShowGuide] = useState(true)
  const [showCelebration, setShowCelebration] = useState(false)
  const [earnedStars, setEarnedStars] = useState(0)
  const [key, setKey] = useState(0)
  const [showLineHelper, setShowLineHelper] = useState(false)
  const [showStrokeOrder, setShowStrokeOrder] = useState(false)
  const [hasSeenHelper, setHasSeenHelper] = useKV<boolean>('has-seen-line-helper', false)

  useEffect(() => {
    if (!hasSeenHelper) {
      const timer = setTimeout(() => {
        setShowLineHelper(true)
        setHasSeenHelper(true)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleComplete = () => {
    const stars = Math.floor(Math.random() * 2) + 2
    setEarnedStars(stars)
    setShowCelebration(true)
  }

  const handleCelebrationComplete = () => {
    setShowCelebration(false)
    onComplete(earnedStars)
  }

  const handleClear = () => {
    setKey((prev) => prev + 1)
  }

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

        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={`font-bold ${character.length > 15 ? 'text-xl md:text-2xl' : character.length > 1 ? 'text-3xl md:text-4xl' : 'text-6xl'}`}
          style={{ fontFamily: "'Quicksand', sans-serif" }}
        >
          {character}
        </motion.div>

        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="lg"
            onClick={() => setShowStrokeOrder(true)}
            className="gap-2"
          >
            <Path className="w-5 h-5" />
            <span className="hidden sm:inline">Strokes</span>
          </Button>

          <Button
            variant="ghost"
            size="lg"
            onClick={() => setShowLineHelper(true)}
            className="gap-2"
          >
            <Info className="w-5 h-5" />
            <span className="hidden sm:inline">Lines</span>
          </Button>
          
          <Button
            variant="outline"
            size="lg"
            onClick={() => setShowGuide(!showGuide)}
            className="gap-2"
          >
            {showGuide ? (
              <>
                <EyeSlash className="w-5 h-5" />
                <span className="hidden sm:inline">Hide Guide</span>
              </>
            ) : (
              <>
                <Eye className="w-5 h-5" />
                <span className="hidden sm:inline">Show Guide</span>
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <DrawingCanvas
          key={key}
          character={character}
          onComplete={handleComplete}
          showGuide={showGuide}
        />
      </div>

      <div className="flex items-center justify-center gap-4 p-4 md:p-6 border-t border-border bg-card shadow-sm">
        <Button
          variant="outline"
          size="lg"
          onClick={handleClear}
          className="gap-2 min-w-[120px]"
        >
          <Trash className="w-5 h-5" />
          Clear
        </Button>

        <Button
          size="lg"
          onClick={handleComplete}
          className="gap-2 min-w-[120px] bg-success hover:bg-success/90 text-success-foreground"
        >
          Done!
        </Button>
      </div>

      <Celebration
        stars={earnedStars}
        show={showCelebration}
        onComplete={handleCelebrationComplete}
      />

      <LineGuideHelper
        show={showLineHelper}
        onDismiss={() => setShowLineHelper(false)}
      />

      <Dialog open={showStrokeOrder} onOpenChange={setShowStrokeOrder}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Stroke Order for "{character}"</DialogTitle>
            <DialogDescription>
              Watch how to write this character stroke by stroke. Green dots show where to start each stroke.
            </DialogDescription>
          </DialogHeader>
          <StrokeOrderDemo character={character} width={280} height={280} />
        </DialogContent>
      </Dialog>
    </div>
  )
}
