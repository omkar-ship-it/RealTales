'use client'
import { useState } from 'react'
import { motion, useAnimation } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { Scene } from '@/lib/types'
import { LetterPageContent } from './LetterPageContent'
import { PageStack } from './PageStack'
import { Starfield } from './Starfield'

interface LetterPagesProps {
  scenes: Scene[]
  senderName: string
  recipientName?: string
  accentFrom: string
  accentTo: string
  /** Fires once the recipient turns past the last page. */
  onComplete: () => void
}

/**
 * Letter-reading engine: one page on screen at a time, read at your own pace
 * (natural scroll inside the page — see LetterPageContent), advanced by a
 * tap on the page edges — the page still animates as if it's turning, just
 * without requiring a drag gesture to get there (dragging tested poorly).
 * Edge zones are narrow so the center of the page stays free for scrolling
 * to read long content.
 */
export function LetterPages({ scenes, senderName, recipientName, accentFrom, accentTo, onComplete }: LetterPagesProps) {
  const [pageIndex, setPageIndex] = useState(-1) // -1 = title beat, 0..n-1 = paper pages
  const [busy, setBusy] = useState(false)
  const controls = useAnimation()

  const atStart = pageIndex <= -1
  const isTitle = pageIndex === -1

  const turnTo = async (nextIndex: number, dir: 1 | -1) => {
    if (busy) return
    setBusy(true)
    await controls.start({ x: dir * -80, rotateY: dir * -24, opacity: 0, transition: { duration: 0.3, ease: 'easeIn' } })
    setPageIndex(nextIndex)
    controls.set({ x: dir * 80, rotateY: dir * 24, opacity: 0 })
    await controls.start({ x: 0, rotateY: 0, opacity: 1, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } })
    setBusy(false)
  }

  const goNext = () => {
    if (busy) return
    if (pageIndex >= scenes.length - 1) { onComplete(); return }
    turnTo(pageIndex + 1, 1)
  }
  const goBack = () => {
    if (busy || atStart) return
    turnTo(pageIndex - 1, -1)
  }

  return (
    <div className="fixed inset-0 bg-[#120E0A] overflow-hidden select-none">
      <div className="pointer-events-none absolute -left-32 top-0 w-[420px] h-[420px] rounded-full bg-[#7A4A2A] opacity-25 blur-[110px]" />
      <Starfield count={50} />

      <div className="absolute top-5 left-5 flex items-center gap-2 text-white/70 z-20">
        <span className="font-display italic text-sm">✦ RealTales</span>
      </div>

      {!isTitle && (
        <div className="absolute top-5 right-5 z-20">
          <PageStack remaining={scenes.length - pageIndex} total={scenes.length} />
        </div>
      )}

      <div style={{ perspective: 1400 }} className="absolute inset-0 flex items-center justify-center px-6 py-24">
        <div className="relative w-full max-w-[420px] h-full max-h-[620px]">
          <motion.div
            animate={controls}
            initial={{ x: 0, rotateY: 0, opacity: 1 }}
            className="absolute inset-0"
            style={{ transformStyle: 'preserve-3d' }}
          >
            {isTitle ? (
              <TitleCard senderName={senderName} recipientName={recipientName} />
            ) : (
              <LetterPageContent scene={scenes[pageIndex]} index={pageIndex} total={scenes.length} accentFrom={accentFrom} accentTo={accentTo} />
            )}
          </motion.div>

          {/* Edge tap zones — narrow, so the center stays free for scrolling to read */}
          {!atStart && (
            <button
              aria-label="Previous page"
              onClick={goBack}
              className="absolute left-0 top-0 bottom-0 w-[18%] z-10 flex items-center justify-start pl-1.5 text-white/0 hover:text-white/25 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}
          <button
            aria-label="Next page"
            onClick={goNext}
            className="absolute right-0 top-0 bottom-0 w-[18%] z-10 flex items-center justify-end pr-1.5 text-white/15 hover:text-white/35 transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="absolute bottom-6 inset-x-0 flex items-center justify-center z-20">
        <button
          onClick={onComplete}
          className="px-4 py-2 rounded-full bg-white/10 text-white/60 text-xs font-semibold backdrop-blur hover:bg-white/15 transition-colors"
        >
          Skip to the end
        </button>
      </div>
    </div>
  )
}

function TitleCard({ senderName, recipientName }: { senderName: string; recipientName?: string }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
      <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#D9A441] mb-4">
        A letter from {senderName || 'someone'}
      </p>
      <p className="font-display italic text-xl text-white/70 mb-1">For</p>
      <p className="font-display italic text-4xl sm:text-5xl leading-tight bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(160deg, #F3D9A8 0%, #D9A441 100%)' }}>
        {recipientName || 'you'}
      </p>
      <p className="text-xs text-white/40 mt-10">Tap to turn the page</p>
    </div>
  )
}
