'use client'
import { useState, type ReactNode } from 'react'
import { motion, useAnimation } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { playPaperRustle } from '@/lib/prototype-sound'
import { cn } from '@/lib/utils'

interface SimplePagerProps {
  pages: ReactNode[]
  onComplete: () => void
  dark?: boolean
}

/** The validated navigation pattern from the production reveal — real, always-visible
 * Back/Next buttons, not a gesture to discover. Reused across prototypes that need
 * simple pagination so we're not re-testing something already settled. */
export function SimplePager({ pages, onComplete, dark = true }: SimplePagerProps) {
  const [index, setIndex] = useState(0)
  const [busy, setBusy] = useState(false)
  const controls = useAnimation()

  const turnTo = async (next: number, dir: 1 | -1) => {
    if (busy) return
    setBusy(true)
    await controls.start({ x: dir * -70, opacity: 0, transition: { duration: 0.28 } })
    setIndex(next)
    playPaperRustle()
    controls.set({ x: dir * 70, opacity: 0 })
    await controls.start({ x: 0, opacity: 1, transition: { duration: 0.35 } })
    setBusy(false)
  }

  const goNext = () => {
    if (busy) return
    if (index >= pages.length - 1) { onComplete(); return }
    turnTo(index + 1, 1)
  }
  const goBack = () => {
    if (busy || index === 0) return
    turnTo(index - 1, -1)
  }

  return (
    <div className="relative w-full h-full flex items-center justify-center px-6">
      <motion.div animate={controls} initial={{ opacity: 1 }} className="w-full max-w-[420px] h-full max-h-[620px] relative">
        {pages[index]}
      </motion.div>

      {index > 0 && (
        <button
          aria-label="Previous"
          onClick={goBack}
          className={cn(
            'absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full flex items-center justify-center backdrop-blur transition-colors',
            dark ? 'bg-white/10 border border-white/15 text-white/80 hover:bg-white/20' : 'bg-black/5 border border-black/10 text-text-2 hover:bg-black/10',
          )}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      )}
      <button
        aria-label="Next"
        onClick={goNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full flex items-center justify-center text-white shadow-lg hover:brightness-110 transition-[filter]"
        style={{ background: 'linear-gradient(160deg, #F3D9A8 0%, #D9A441 100%)', color: '#2B2140' }}
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  )
}
