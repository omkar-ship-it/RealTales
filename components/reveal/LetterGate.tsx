'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'

interface LetterGateProps {
  senderName: string
  recipientName?: string
  accentFrom: string
  accentTo: string
  /** Called once the seal is broken (drag threshold, or the tap fallback) — start audio here, synchronously, for iOS autoplay rules. */
  onBegin: () => void
}

const BREAK_THRESHOLD = 46

/**
 * The first screen — light, paper-toned, the opposite of the reveal's dark theme.
 * The recipient's and sender's names are both shown here (not hidden until after
 * opening) so this reads as trustworthy rather than an anonymous mystery link.
 * Opening is a seal-break gesture (drag the wax seal down to crack it) with a
 * plain tap-to-open fallback for discoverability/accessibility.
 */
export function LetterGate({ senderName, recipientName, accentFrom, accentTo, onBegin }: LetterGateProps) {
  const [dragProgress, setDragProgress] = useState(0)
  const [breaking, setBreaking] = useState(false)

  const triggerOpen = () => {
    if (breaking) return
    setBreaking(true)
    setTimeout(onBegin, 520)
  }

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center px-8 text-center bg-bg overflow-hidden">
      {/* Soft ambient color blobs, matching the sender-side aesthetic */}
      <div className="pointer-events-none absolute -left-24 top-1/3 w-72 h-72 rounded-full opacity-30 blur-3xl" style={{ background: accentFrom }} />
      <div className="pointer-events-none absolute -right-16 bottom-1/4 w-56 h-56 rounded-full opacity-20 blur-3xl" style={{ background: accentTo }} />

      <p className="text-xs font-semibold tracking-[0.2em] uppercase text-text-3 mb-3">A letter for</p>
      <p className="font-display italic text-4xl sm:text-5xl text-text mb-2 max-w-sm leading-tight">
        {recipientName || 'you'}
      </p>
      <p className="text-sm text-text-2 mb-10">from {senderName || 'someone who cares'}</p>

      <motion.div
        animate={breaking ? { y: 24, opacity: 0, rotate: -4 } : { y: 0, opacity: 1, rotate: 0 }}
        transition={{ duration: 0.5, ease: 'easeIn' }}
        className="relative"
      >
        {/* Envelope */}
        <div className="relative w-64 h-44 sm:w-72 sm:h-48 rounded-xl bg-surface shadow-lg overflow-hidden border border-border">
          <div
            className="absolute inset-x-0 top-0 h-1/2 bg-surface-2"
            style={{ clipPath: 'polygon(0 0, 100% 0, 50% 100%)' }}
          />
        </div>

        {/* Wax seal — draggable to "crack" open */}
        <motion.div
          drag={breaking ? false : 'y'}
          dragConstraints={{ top: 0, bottom: 60 }}
          dragElastic={0.35}
          dragSnapToOrigin
          onDrag={(_, info) => setDragProgress(Math.min(1, Math.max(0, info.offset.y / BREAK_THRESHOLD)))}
          onDragEnd={(_, info) => {
            if (info.offset.y >= BREAK_THRESHOLD) triggerOpen()
            else setDragProgress(0)
          }}
          whileTap={{ scale: 0.96 }}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full flex items-center justify-center cursor-grab active:cursor-grabbing shadow-md"
          style={{ background: `linear-gradient(160deg, ${accentFrom} 0%, ${accentTo} 100%)` }}
        >
          <span className="font-display italic text-white text-xl select-none">
            {(senderName || 'L').trim().charAt(0).toUpperCase()}
          </span>
          {/* Crack line, grows with drag progress */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 56 56" fill="none">
            <motion.path
              d="M18 14 L26 26 L20 32 L34 44"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              pathLength={1}
              style={{ pathLength: dragProgress, opacity: dragProgress }}
            />
          </svg>
        </motion.div>
      </motion.div>

      <p className="text-xs font-semibold tracking-[0.15em] uppercase text-text-3 mt-8 mb-1">
        {breaking ? 'Opening…' : 'Drag the seal to open'}
      </p>
      {!breaking && (
        <button onClick={triggerOpen} className="text-xs text-text-3 underline underline-offset-2 mt-1">
          or tap to open
        </button>
      )}

      <p className="text-[11px] text-text-3 mt-10">Made with care · RealTales</p>
    </div>
  )
}
