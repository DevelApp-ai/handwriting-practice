import { useEffect, useRef } from 'react'
import { encodeQr } from '@/lib/qr'

interface QrCanvasProps {
  text: string
  size?: number
}

export function QrCanvas({ text, size = 96 }: QrCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.clearRect(0, 0, size, size)
    let result
    try {
      result = encodeQr(text)
    } catch {
      return
    }
    const { matrix, size: dim } = result
    const scale = size / dim
    ctx.fillStyle = '#000'
    for (let r = 0; r < dim; r++) {
      for (let c = 0; c < dim; c++) {
        if (matrix[r][c]) {
          ctx.fillRect(c * scale, r * scale, Math.ceil(scale), Math.ceil(scale))
        }
      }
    }
  }, [text, size])

  return <canvas ref={canvasRef} width={size} height={size} className="block" />
}
