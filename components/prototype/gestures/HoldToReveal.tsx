'use client'
import { useRef, useState, type ReactNode } from 'react'
import { playChime } from '@/lib/prototype-sound'

interface HoldToRevealProps {
  children: ReactNode
  label?: string
  holdMs?: number
  onReveal?: () => void
}

/** Press and don't let go — chosen because the gesture *means* patience/waiting,
 * for the one line in a letter that deserves to be earned, not just read. */
export function HoldToReveal({ children, label = 'Press and hold', holdMs = 1800, onReveal }: HoldToRevealProps) {
  const [revealed, setRevealed] = useState(false)
  const [progress, setProgress] = useState(0)
  const rafRef = useRef<number | null>(null)
  const startRef = useRef(0)

  const start = () => {
    if (revealed) return
    startRef.current = performance.now()
    const tick = () => {
      const elapsed = performance.now() - startRef.current
      const p = Math.min(1, elapsed / holdMs)
      setProgress(p)
      if (p >= 1) {
        setRevealed(true)
        playChime()
        onReveal?.()
        return
      }
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
  }

  const cancel = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    if (!revealed) setProgress(0)
  }

  return (
    <div
      className="relative w-full h-full select-none touch-none"
      onPointerDown={start}
      onPointerUp={cancel}
      onPointerLeave={cancel}
      onPointerCancel={cancel}
    >
      <div
        className="absolute inset-0"
        style={{
          filter: revealed ? 'none' : `blur(${(1 - progress) * 9}px)`,
          opacity: revealed ? 1 : 0.35 + progress * 0.65,
          transition: revealed ? 'filter 0.5s ease, opacity 0.5s ease' : undefined,
        }}
      >
        {children}
      </div>
      {!revealed && (
        <div className="absolute inset-x-0 bottom-5 flex flex-col items-center gap-2 pointer-events-none">
          <div className="w-24 h-1 rounded-full bg-white/20 overflow-hidden">
            <div className="h-full bg-white/85" style={{ width: `${progress * 100}%` }} />
          </div>
          <p className="text-xs font-semibold text-white/70">{label}</p>
        </div>
      )}
    </div>
  )
}
