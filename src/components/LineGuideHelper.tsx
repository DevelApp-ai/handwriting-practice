import { Card } from '@/components/ui/card'
import { X } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { motion, AnimatePresence } from 'framer-motion'

interface LineGuideHelperProps {
  show: boolean
  onDismiss: () => void
}

export function LineGuideHelper({ show, onDismiss }: LineGuideHelperProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={onDismiss}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <Card className="max-w-md p-6 relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={onDismiss}
                className="absolute top-2 right-2"
              >
                <X className="w-4 h-4" />
              </Button>

              <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: "'Fredoka', sans-serif" }}>
                Writing Lines Guide
              </h2>

              <div className="space-y-4">
                <div className="relative h-48 border-2 border-border rounded-lg bg-background p-4">
                  <div className="relative h-full">
                    <div className="absolute w-full" style={{ top: '25%' }}>
                      <div className="h-0.5 bg-gray-400 relative">
                        <span className="absolute -top-6 left-2 text-sm text-gray-600 font-medium">
                          Ascender Line
                        </span>
                      </div>
                    </div>

                    <div className="absolute w-full" style={{ top: '42%' }}>
                      <div className="h-0.5 bg-indigo-500 border-t-2 border-dashed border-indigo-500 relative">
                        <span className="absolute -top-6 left-2 text-sm text-indigo-600 font-medium">
                          Midline
                        </span>
                      </div>
                    </div>

                    <div className="absolute w-full" style={{ top: '58%' }}>
                      <div className="h-0.5 bg-black relative">
                        <span className="absolute -bottom-6 left-2 text-sm text-black font-bold">
                          Baseline
                        </span>
                      </div>
                    </div>

                    <div className="absolute w-full" style={{ top: '75%' }}>
                      <div className="h-0.5 bg-gray-400 relative">
                        <span className="absolute -bottom-6 left-2 text-sm text-gray-600 font-medium">
                          Descender Line
                        </span>
                      </div>
                    </div>

                    <div 
                      className="absolute text-6xl font-bold text-primary/30"
                      style={{ 
                        fontFamily: "'Quicksand', sans-serif",
                        top: '23%',
                        left: '50%',
                        transform: 'translateX(-50%)'
                      }}
                    >
                      Ag
                    </div>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <p className="flex items-start gap-2">
                    <span className="font-bold text-gray-600">Ascender:</span>
                    <span>For tall letters like b, d, h, k, l</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="font-bold text-indigo-600">Midline:</span>
                    <span>Top of short letters like a, c, e, o</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="font-bold text-black">Baseline:</span>
                    <span>Where all letters sit</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="font-bold text-gray-600">Descender:</span>
                    <span>For letters that go below like g, j, p, q, y</span>
                  </p>
                </div>

                <Button onClick={onDismiss} className="w-full">
                  Got it!
                </Button>
              </div>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
