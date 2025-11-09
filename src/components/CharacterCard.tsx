import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Star, Check } from '@phosphor-icons/react'
import { Progress } from '@/lib/types'
import { motion } from 'framer-motion'

interface CharacterCardProps {
  character: string
  progress?: Progress
  onClick: () => void
  isSelected?: boolean
}

export function CharacterCard({ character, progress, onClick, isSelected }: CharacterCardProps) {
  const stars = progress?.stars || 0
  const completed = progress?.completed || false

  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -4 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <Card
        onClick={onClick}
        className={`relative cursor-pointer transition-all duration-200 ${
          isSelected
            ? 'bg-primary border-primary shadow-lg'
            : 'hover:shadow-md border-2'
        } ${completed ? 'border-success' : ''}`}
      >
        <div className="aspect-square flex flex-col items-center justify-center p-4 gap-2">
          {completed && (
            <Badge
              variant="secondary"
              className="absolute top-2 right-2 bg-success text-success-foreground"
            >
              <Check weight="bold" className="w-3 h-3" />
            </Badge>
          )}

          <div
            className={`text-5xl font-bold ${
              isSelected ? 'text-primary-foreground' : 'text-foreground'
            }`}
            style={{ fontFamily: "'Quicksand', sans-serif" }}
          >
            {character}
          </div>

          <div className="flex gap-1">
            {[1, 2, 3].map((index) => (
              <Star
                key={index}
                weight={index <= stars ? 'fill' : 'regular'}
                className={`w-5 h-5 ${
                  index <= stars
                    ? 'text-secondary'
                    : isSelected
                    ? 'text-primary-foreground/30'
                    : 'text-muted-foreground'
                }`}
              />
            ))}
          </div>
        </div>
      </Card>
    </motion.div>
  )
}
