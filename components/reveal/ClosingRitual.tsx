'use client'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, BookmarkPlus } from 'lucide-react'
import { Starfield } from './Starfield'
import { markSaved, getRevealState } from '@/lib/reveal-store'
import { playPaperRustle, playSealCrack } from '@/lib/prototype-sound'

interface ClosingRitualProps {
  slug: string
  senderName: string
  accentFrom: string
  accentTo: string
  onContinue: () => void
}

type Stage = 'folding' | 'sealed' | 'settled'

/**
 * The deliberate pause between the emotional peak (end of the letter) and the
 * transactional CTA row. Replaces the earlier scale-down-to-a-strip version
 * (flagged as weak) with an actual tri-fold — three panels hinging into each
 * other in 3D, the same physical language as `LetterGate`'s wax-seal open and
 * `LetterPages`' page-turn — followed by the same wax seal pressing closed
 * again. The seal that cracked to open now re-seals to close: a deliberate
 * narrative bookend, not just a matching visual style.
 */
export function ClosingRitual({ slug, senderName, accentFrom, accentTo, onContinue }: ClosingRitualProps) {
  const [stage, setStage] = useState<Stage>('folding')
  const [saved, setSaved] = useState(() => !!getRevealState(slug).saved)

  useEffect(() => {
    playPaperRustle()
  }, [])

  useEffect(() => {
    if (stage !== 'sealed') return
    playSealCrack()
    const toSettled = setTimeout(() => setStage('settled'), 700)
    return () => clearTimeout(toSettled)
  }, [stage])

  return (
    <div className="fixed inset-0 bg-[#120E0A] overflow-hidden flex flex-col items-center justify-center px-8 text-center">
      <Starfield count={30} />

      <div className="relative w-44 h-60 mb-12" style={{ perspective: 1000 }}>
        {/* Middle third — the anchor panel, never moves */}
        <div className="paper-grain absolute inset-x-0 top-1/3 h-1/3 bg-[#FBF6EC] shadow-2xl" />

        {/* Top third — hinges at its own bottom edge (the container's 1/3 mark), folds down onto the middle.
            transformOrigin is set via Framer's own `style` prop, not a Tailwind class — Framer Motion
            writes transform-origin into the same inline `style` it uses for `transform`, so a class-based
            origin gets silently overridden by specificity; passing it through `style` keeps Framer in charge. */}
        <motion.div
          className="paper-grain absolute inset-x-0 top-0 h-1/3 bg-[#FBF6EC] shadow-lg rounded-t-md"
          style={{ transformOrigin: 'bottom center' }}
          initial={{ rotateX: 0 }}
          animate={{ rotateX: -172 }}
          transition={{ duration: 0.7, ease: [0.65, 0, 0.35, 1] }}
        />

        {/* Bottom third — hinges at its own top edge (the container's 2/3 mark), folds up onto the middle.
            Fires the seal once IT finishes (it starts later, so it's the last panel to settle) — tying the
            next phase to a real animation-completion event instead of a guessed setTimeout duration. */}
        <motion.div
          className="paper-grain absolute inset-x-0 bottom-0 h-1/3 bg-[#FBF6EC] shadow-lg rounded-b-md"
          style={{ transformOrigin: 'top center' }}
          initial={{ rotateX: 0 }}
          animate={{ rotateX: 172 }}
          transition={{ duration: 0.7, delay: 0.12, ease: [0.65, 0, 0.35, 1] }}
          onAnimationComplete={() => setStage('sealed')}
        />

        {/* The wax seal — same styling as LetterGate's, pressed down once folded instead of cracked open */}
        <AnimatePresence>
          {stage !== 'folding' && (
            <motion.div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full flex items-center justify-center shadow-md z-10"
              style={{ background: `linear-gradient(160deg, ${accentFrom} 0%, ${accentTo} 100%)` }}
              initial={{ scale: 1.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 320, damping: 16 }}
            >
              <span className="font-display italic text-white text-xl select-none">
                {(senderName || 'L').trim().charAt(0).toUpperCase()}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {stage === 'settled' && (
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center gap-5"
          >
            <p className="font-display italic text-2xl text-white/90">Kept, safe and sound.</p>

            <button
              onClick={() => { markSaved(slug); setSaved(true) }}
              disabled={saved}
              className="flex items-center gap-2 px-6 py-3.5 rounded-full font-semibold text-sm transition-colors"
              style={{ background: saved ? 'rgba(255,255,255,0.1)' : 'linear-gradient(160deg, #F3D9A8 0%, #D9A441 100%)', color: saved ? '#fff' : '#2B2140' }}
            >
              {saved ? <Check className="w-4 h-4" /> : <BookmarkPlus className="w-4 h-4" />}
              {saved ? 'Saved to your keepsakes' : 'Save it forever'}
            </button>

            <button onClick={onContinue} className="text-xs text-white/50 underline underline-offset-2 mt-1">
              Continue →
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
