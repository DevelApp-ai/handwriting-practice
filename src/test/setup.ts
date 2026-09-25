import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

afterEach(() => {
  cleanup()
})

// jsdom (without pretendToBeVisual) does not provide requestAnimationFrame.
// Components schedule redraws through rAF, so provide a timer-backed
// implementation when it is missing.
if (typeof window !== 'undefined' && typeof window.requestAnimationFrame === 'undefined') {
  window.requestAnimationFrame = ((callback: FrameRequestCallback): number =>
    window.setTimeout(() => callback(Date.now()), 16) as unknown as number) as typeof requestAnimationFrame
  window.cancelAnimationFrame = ((handle: number): void => {
    window.clearTimeout(handle as unknown as number)
  }) as typeof cancelAnimationFrame
}

// jsdom does not implement pointer capture; components call these during
// pointerdown/pointerup handlers.
if (typeof window !== 'undefined' && typeof Element !== 'undefined') {
  if (!Element.prototype.setPointerCapture) {
    Element.prototype.setPointerCapture = () => {}
  }
  if (!Element.prototype.releasePointerCapture) {
    Element.prototype.releasePointerCapture = () => {}
  }
}

// jsdom does not implement window.matchMedia, which libraries such as sonner
// rely on when mounting their UI.
if (typeof window !== 'undefined' && typeof window.matchMedia !== 'function') {
  window.matchMedia = ((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  })) as unknown as typeof window.matchMedia
}
