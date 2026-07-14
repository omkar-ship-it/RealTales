'use client'
import { useRef, useState } from 'react'
import { motion, useAnimation, type PanInfo } from 'framer-motion'
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

const TURN_THRESHOLD = 90
const VELOCITY_THRESHOLD = 500

/**
 * Letter-reading engine: one page on screen at a time, read at your own pace
 * (natural scroll inside the page — see LetterPageContent), advanced by a
 * tactile drag-to-turn gesture rather than an auto-advancing timer. A single
 * persistent element is driven imperatively (useAnimation) rather than keyed
 * AnimatePresence, so the live drag-tilt preview and the committed turn
 * animation are always the same motion value — no handoff glitches.
 */
export function LetterPages({ scenes, senderName, recipientName, accentFrom, accentTo, onComplete }: LetterPagesProps) {
  const [pageIndex, setPageIndex] = useState(-1) // -1 = title beat, 0..n-1 = paper pages
  const [busy, setBusy] = useState(false)
  const controls = useAnimation()
  const dragStartX = useRef(0)

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

  const handleDrag = (_: unknown, info: PanInfo) => {
    if (busy) return
    const rotateY = Math.max(-28, Math.min(28, info.offset.x * -0.12))
    controls.set({ x: info.offset.x, rotateY })
  }

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    if (busy) return
    if (info.offset.x <= -TURN_THRESHOLD || info.velocity.x < -VELOCITY_THRESHOLD) {
      goNext()
    } else if (!atStart && (info.offset.x >= TURN_THRESHOLD || info.velocity.x > VELOCITY_THRESHOLD)) {
      goBack()
    } else {
      controls.start({ x: 0, rotateY: 0, transition: { type: 'spring', stiffness: 300, damping: 26 } })
    }
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
        <motion.div
          animate={controls}
          initial={{ x: 0, rotateY: 0, opacity: 1 }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={1}
          onDragStart={() => { dragStartX.current = 0 }}
          onDrag={handleDrag}
          onDragEnd={handleDragEnd}
          className="relative w-full max-w-[420px] h-full max-h-[620px] cursor-grab active:cursor-grabbing"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {isTitle ? (
            <TitleCard senderName={senderName} recipientName={recipientName} />
          ) : (
            <LetterPageContent scene={scenes[pageIndex]} index={pageIndex} total={scenes.length} accentFrom={accentFrom} accentTo={accentTo} />
          )}
        </motion.div>
      </div>

      {/* Tap-zone fallback for discoverability / accessibility */}
      <button aria-label="Previous page" onClick={goBack} className="absolute left-0 top-0 bottom-24 w-1/6 z-10" />
      <button aria-label="Next page" onClick={goNext} className="absolute right-0 top-0 bottom-24 w-1/6 z-10" />

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
      <p className="text-xs text-white/40 mt-10">Drag to turn the page</p>
    </div>
  )
}
