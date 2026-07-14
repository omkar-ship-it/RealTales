import { motion, AnimatePresence } from 'framer-motion'

interface PageStackProps {
  remaining: number
  total: number
}

const MAX_VISIBLE = 5

/** Diegetic progress indicator — a stack of paper that thins as pages are turned,
 * standing in for an abstract progress bar. */
export function PageStack({ remaining, total }: PageStackProps) {
  const visible = Math.min(remaining, MAX_VISIBLE)

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-9 h-11">
        <AnimatePresence initial={false}>
          {Array.from({ length: visible }, (_, i) => (
            <motion.div
              key={remaining - i}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1 - i * 0.16, y: i * 2.5, x: i * 1.5 }}
              exit={{ opacity: 0, x: 16, rotate: 8, transition: { duration: 0.35 } }}
              className="absolute inset-x-0 top-0 h-11 rounded-[3px] border border-white/15"
              style={{ background: '#FBF6EC', zIndex: MAX_VISIBLE - i }}
            />
          ))}
        </AnimatePresence>
      </div>
      <p className="text-[10px] tracking-[0.15em] uppercase text-white/50 select-none">
        {total - remaining + 1} / {total}
      </p>
    </div>
  )
}
