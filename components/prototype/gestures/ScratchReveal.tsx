'use client'
import { useCallback, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent, type ReactNode } from 'react'
import { playPaperRustle } from '@/lib/prototype-sound'

interface ScratchRevealProps {
  children: ReactNode
  label?: string
  accentFrom: string
  accentTo: string
  onReveal?: () => void
}

/** Scratch away a layer to find what's underneath — chosen because the gesture
 * *means* something (uncovering a hidden memory), not because it's a neat trick. */
export function ScratchReveal({ children, label = 'Scratch to reveal', accentFrom, accentTo, onReveal }: ScratchRevealProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [revealed, setRevealed] = useState(false)
  const drawing = useRef(false)
  const sampleCounter = useRef(0)

  const setupCanvas = useCallback((canvas: HTMLCanvasElement) => {
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width
    canvas.height = rect.height
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const grad = ctx.createLinearGradient(0, 0, rect.width, rect.height)
    grad.addColorStop(0, accentFrom)
    grad.addColorStop(1, accentTo)
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, rect.width, rect.height)
  }, [accentFrom, accentTo])

  useEffect(() => {
    if (canvasRef.current) setupCanvas(canvasRef.current)
  }, [setupCanvas])

  const scratchAt = (x: number, y: number) => {
    const ctx = canvasRef.current?.getContext('2d')
    if (!ctx) return
    ctx.globalCompositeOperation = 'destination-out'
    ctx.beginPath()
    ctx.arc(x, y, 24, 0, Math.PI * 2)
    ctx.fill()
  }

  const checkProgress = () => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return
    sampleCounter.current += 1
    if (sampleCounter.current < 10) return
    sampleCounter.current = 0
    const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height)
    let cleared = 0
    let total = 0
    for (let i = 3; i < data.length; i += 4 * 37) {
      total += 1
      if (data[i] === 0) cleared += 1
    }
    if (total > 0 && cleared / total > 0.55) {
      setRevealed(true)
      onReveal?.()
    }
  }

  const posFromEvent = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    return { x: e.clientX - rect.left, y: e.clientY - rect.top }
  }

  return (
    <div className="relative w-full h-full">
      <div className="absolute inset-0">{children}</div>
      {!revealed && (
        <>
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full touch-none cursor-pointer"
            onPointerDown={e => { drawing.current = true; playPaperRustle(); const p = posFromEvent(e); scratchAt(p.x, p.y) }}
            onPointerMove={e => { if (!drawing.current) return; const p = posFromEvent(e); scratchAt(p.x, p.y); checkProgress() }}
            onPointerUp={() => { drawing.current = false }}
            onPointerLeave={() => { drawing.current = false }}
          />
          <p className="absolute bottom-4 inset-x-0 text-center text-xs font-semibold text-white/85 pointer-events-none drop-shadow">
            {label}
          </p>
        </>
      )}
    </div>
  )
}
