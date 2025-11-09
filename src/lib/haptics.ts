export type FeedbackIntensity = 'light' | 'moderate' | 'heavy' | 'error'

const vibrationPatterns: Record<FeedbackIntensity, number | number[]> = {
  light: 10,
  moderate: 25,
  heavy: 50,
  error: [50, 30, 50],
}

let lastVibrationTime = 0
const VIBRATION_THROTTLE = 100

export function triggerHapticFeedback(intensity: FeedbackIntensity) {
  if (!navigator.vibrate) {
    return
  }

  const now = Date.now()
  if (now - lastVibrationTime < VIBRATION_THROTTLE) {
    return
  }

  lastVibrationTime = now
  const pattern = vibrationPatterns[intensity]
  navigator.vibrate(pattern)
}

export function stopHapticFeedback() {
  if (navigator.vibrate) {
    navigator.vibrate(0)
  }
}
