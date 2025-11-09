import { motion, AnimatePresence } from 'framer-motion'
import { Star, Sparkle } from '@phosphor-icons/react'
import { ENCOURAGING_PHRASES } from '@/lib/types'
import { useEffect, useState } from 'react'

interface CelebrationProps {
  stars: number
  show: boolean
  onComplete: () => void
}

export function Celebration({ stars, show, onComplete }: CelebrationProps) {
  const [phrase, setPhrase] = useState('')

  useEffect(() => {
    if (show) {
      const randomPhrase =
        ENCOURAGING_PHRASES[Math.floor(Math.random() * ENCOURAGING_PHRASES.length)]
      setPhrase(randomPhrase)

      const timer = setTimeout(onComplete, 2500)
      return () => clearTimeout(timer)
    }
  }, [show, onComplete])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="bg-card rounded-3xl shadow-2xl p-8 flex flex-col items-center gap-6 max-w-sm mx-4"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.2, 1] }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="flex gap-2"
            >
              {[1, 2, 3].map((index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                >
                  <Star
                    weight="fill"
                    className={`w-16 h-16 ${
                      index <= stars ? 'text-secondary' : 'text-muted'
                    }`}
                  />
                </motion.div>
              ))}
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-3xl font-bold text-center"
            >
              {phrase}
            </motion.h2>

            {stars === 3 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="flex gap-2"
              >
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{
                      y: [0, -20, 0],
                      rotate: [0, 360],
                      opacity: [1, 0.5, 1],
                    }}
                    transition={{
                      duration: 1,
                      delay: i * 0.1,
                      repeat: Infinity,
                      repeatDelay: 0.5,
                    }}
                  >
                    <Sparkle weight="fill" className="w-6 h-6 text-accent" />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </motion.div>

          {stars === 3 && (
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{
                    x: '50vw',
                    y: '50vh',
                    scale: 0,
                    opacity: 1,
                  }}
                  animate={{
                    x: `${Math.random() * 100}vw`,
                    y: `${Math.random() * 100}vh`,
                    scale: [0, 1, 0],
                    opacity: [1, 1, 0],
                  }}
                  transition={{
                    duration: 1.5,
                    delay: i * 0.05,
                    ease: 'easeOut',
                  }}
                  className="absolute"
                >
                  <Sparkle
                    weight="fill"
                    className="w-4 h-4 text-secondary"
                  />
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
