/**
 * Test helpers for components that render <canvas> elements.
 *
 * jsdom does not implement the HTML canvas 2D context, so
 * `canvas.getContext('2d')` returns null and every component that draws would
 * bail out early. These helpers install a permissive no-op 2D context mock so
 * components can be rendered and exercised in jsdom.
 */
import { vi } from 'vitest'

type AnyRecord = Record<string, unknown>

export interface CanvasMock {
  /** The shared mock 2D context returned by every getContext('2d') call. */
  ctx: AnyRecord
  /** Remove all installed mocks. Call in `afterEach`. */
  restore: () => void
}

export function installCanvasContextMock(): CanvasMock {
  const ctx: AnyRecord = {}

  const get = (_target: AnyRecord, prop: string): unknown => {
    if (prop in ctx) return ctx[prop]
    switch (prop) {
      case 'measureText':
        return () => ({
          width: 10,
          actualBoundingBoxAscent: 5,
          actualBoundingBoxDescent: 2,
        })
      case 'createLinearGradient':
      case 'createRadialGradient':
      case 'createPattern':
        return () => ({ addColorStop: () => {} })
      case 'getImageData':
        return () => ({ data: new Uint8ClampedArray(4) })
      case 'isPointInPath':
      case 'isPointInStroke':
        return () => false
      default:
        // Default to a no-op function; property reads that expect a value
        // (fillStyle, lineWidth, ...) get `undefined`, which components only
        // ever write to.
        return () => undefined
    }
  }

  const proxy = new Proxy(ctx, {
    get,
    set(target, prop: string, value) {
      target[prop] = value
      return true
    },
  })

  const canvasProto = HTMLCanvasElement.prototype as unknown as {
    getContext: () => CanvasRenderingContext2D | null
  }
  const getContext = vi.spyOn(canvasProto, 'getContext').mockImplementation(
    () => proxy as unknown as CanvasRenderingContext2D
  )

  return {
    ctx,
    restore: () => {
      getContext.mockRestore()
    },
  }
}
