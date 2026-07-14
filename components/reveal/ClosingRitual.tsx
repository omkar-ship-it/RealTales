'use client'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, BookmarkPlus } from 'lucide-react'
import { Starfield } from './Starfield'
import { markSaved, getRevealState } from '@/lib/reveal-store'

interface ClosingRitualProps {
  slug: string
  onContinue: () => void
}

/**
 * The deliberate pause between the emotional peak (end of the letter) and the
 * transactional CTA row — the single highest-leverage change identified in
 * planning. The letter visually folds closed and sits in stillness for a
 * beat before any button appears.
 */
export function ClosingRitual({ slug, onContinue }: ClosingRitualProps) {
  const [settled, setSettled] = useState(false)
  const [saved, setSaved] = useState(() => !!getRevealState(slug).saved)

  useEffect(() => {
    const t = setTimeout(() => setSettled(true), 1500)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="fixed inset-0 bg-[#120E0A] overflow-hidden flex flex-col items-center justify-center px-8 text-center">
      <Starfield count={30} />

      <motion.div
        initial={{ scaleY: 1, borderRadius: 16 }}
        animate={{ scaleY: 0.09, borderRadius: 6 }}
        transition={{ duration: 1.2, ease: [0.65, 0, 0.35, 1] }}
        className="w-40 h-56 bg-[#FBF6EC] shadow-2xl mb-12"
      />

      <AnimatePresence>
        {settled && (
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
