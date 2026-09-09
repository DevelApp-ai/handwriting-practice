import { useEffect } from 'react'
import { LEVEL_THRESHOLDS } from '@/lib/types'

export interface LevelUpModalProps {
  isOpen: boolean
  onClose: () => void
  newLevel: number
}

export function LevelUpModal({ isOpen, onClose, newLevel }: LevelUpModalProps) {
  useEffect(() => {
    if (!isOpen) return
    const timer = setTimeout(() => {
      onClose()
    }, 8000)
    return () => clearTimeout(timer)
  }, [isOpen, onClose])

  if (!isOpen || newLevel < 2) return null

  const previousLevel = newLevel - 1
  const previousThreshold = LEVEL_THRESHOLDS[previousLevel - 1] || 0
  const newThreshold = LEVEL_THRESHOLDS[newLevel - 1] || 0

  // Generate confetti effect
  useEffect(() => {
    if (!isOpen) return
    const colors = ['#FFD700', '#C0C0C0', '#CD7F32', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4']
    
    for (let i = 0; i < 100; i++) {
      setTimeout(() => {
        createConfetti(colors[Math.floor(Math.random() * colors.length)])
      }, i * 30)
    }
  }, [isOpen])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative mx-4 max-w-md rounded-2xl bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 p-8 shadow-2xl animate-bounce-in">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-2xl text-white hover:text-gray-200"
        >
          &times;
        </button>
        
        <div className="text-center">
          <div className="mb-4">
            <span className="text-6xl">\u2728</span>
          </div>
          
          <h2 className="text-3xl font-bold text-white">
            Level {newLevel}!
          </h2>
          
          <p className="mt-4 text-lg text-white/90">
            Congratulations! You've reached level {newLevel}!
          </p>
          
          <div className="mt-6 overflow-hidden rounded-lg bg-white/20 p-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xl">\u2605</span>
                <span className="text-white">New character sets unlocked</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xl">\uD83C\uDFA8</span>
                <span className="text-white">New themes available</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xl">\u2705</span>
                <span className="text-white">Special badges earned</span>
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <p className="text-white/80">
              XP Range: {previousThreshold} - {newThreshold}
            </p>
          </div>
          
          <button
            onClick={onClose}
            className="mt-6 w-full rounded-lg bg-white py-3 text-lg font-semibold text-purple-600 transition-colors hover:bg-gray-100"
          >
            Continue Writing
          </button>
        </div>
      </div>
    </div>
  )
}

function createConfetti(color: string) {
  const confetti = document.createElement('div')
  confetti.style.cssText = `
    position: fixed;
    width: 10px;
    height: 10px;
    background: ${color};
    border-radius: 50%;
    pointer-events: none;
    z-index: 1000;
    left: ${Math.random() * 100}vw;
    top: -10px;
    animation: confettiFall ${Math.random() * 3 + 2}s linear forwards;
  `
  
  document.body.appendChild(confetti)
  
  setTimeout(() => {
    confetti.remove()
  }, 5000)
}

// Add confetti animation to document
const style = document.createElement('style')
style.textContent = `
  @keyframes confettiFall {
    0% {
      transform: translateY(0) rotate(0deg);
      opacity: 1;
    }
    100% {
      transform: translateY(100vh) rotate(720deg);
      opacity: 0;
    }
  }
  
  @keyframes bounce-in {
    0% {
      transform: scale(0.5);
      opacity: 0;
    }
    50% {
      transform: scale(1.1);
    }
    100% {
      transform: scale(1);
      opacity: 1;
    }
  }
  
  .animate-bounce-in {
    animation: bounce-in 0.5s ease-out;
  }
`
document.head.appendChild(style)
