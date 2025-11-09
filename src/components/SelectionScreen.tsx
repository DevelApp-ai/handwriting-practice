import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CharacterCard } from '@/components/CharacterCard'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Star, Trophy } from '@phosphor-icons/react'
import { Progress } from '@/lib/types'
import { motion } from 'framer-motion'
import { LanguageSelector } from '@/components/LanguageSelector'
import { LANGUAGES, getLanguageByCode } from '@/lib/languages'

interface SelectionScreenProps {
  onSelectCharacter: (character: string) => void
  progressData: Record<string, Progress>
  totalStars: number
  selectedLanguage: string
  onLanguageChange: (languageCode: string) => void
}

export function SelectionScreen({
  onSelectCharacter,
  progressData,
  totalStars,
  selectedLanguage,
  onLanguageChange,
}: SelectionScreenProps) {
  const [selectedTab, setSelectedTab] = useState('0')

  const currentLanguage = getLanguageByCode(selectedLanguage) || LANGUAGES[0]

  const getProgress = (char: string): Progress | undefined => {
    return progressData[char]
  }

  const renderCharacterGrid = (characters: string[], isSentence: boolean = false) => (
    <div className={isSentence ? "flex flex-col gap-4 p-4" : "grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4 p-4"}>
      {characters.map((char, index) => (
        <motion.div
          key={char}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.02 }}
        >
          <CharacterCard
            character={char}
            progress={getProgress(char)}
            onClick={() => onSelectCharacter(char)}
            isSentence={isSentence}
          />
        </motion.div>
      ))}
    </div>
  )

  return (
    <div className="h-screen flex flex-col bg-background">
      <div className="bg-gradient-to-r from-primary via-accent to-secondary p-6 md:p-8 text-white shadow-lg">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-start justify-between gap-4 mb-4">
            <motion.h1
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-4xl md:text-5xl font-bold"
            >
              WriteRight
            </motion.h1>
            <LanguageSelector
              selectedLanguage={selectedLanguage}
              onLanguageChange={onLanguageChange}
            />
          </div>
          <motion.p
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl opacity-90 mb-4"
          >
            Practice your handwriting and earn stars!
          </motion.p>

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap gap-3"
          >
            <Badge
              variant="secondary"
              className="text-base px-4 py-2 bg-white/20 backdrop-blur-sm text-white border-white/30"
            >
              <Star weight="fill" className="w-5 h-5 mr-2 text-secondary" />
              {totalStars} Stars
            </Badge>
            <Badge
              variant="secondary"
              className="text-base px-4 py-2 bg-white/20 backdrop-blur-sm text-white border-white/30"
            >
              <Trophy weight="fill" className="w-5 h-5 mr-2 text-secondary" />
              {Object.values(progressData).filter((p) => p.completed).length} Completed
            </Badge>
          </motion.div>
        </div>
      </div>

      <Tabs
        value={selectedTab}
        onValueChange={setSelectedTab}
        className="flex-1 flex flex-col overflow-hidden"
      >
        <TabsList className="w-full justify-start rounded-none border-b bg-card px-4 h-auto gap-2 flex-wrap">
          {currentLanguage.categories.map((category, index) => (
            <TabsTrigger key={category.id} value={index.toString()} className="text-base">
              {category.name}
            </TabsTrigger>
          ))}
        </TabsList>

        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            {currentLanguage.categories.map((category, index) => (
              <TabsContent key={category.id} value={index.toString()} className="mt-0">
                {renderCharacterGrid(category.characters, category.id === 'sentences')}
              </TabsContent>
            ))}
          </ScrollArea>
        </div>
      </Tabs>
    </div>
  )
}
