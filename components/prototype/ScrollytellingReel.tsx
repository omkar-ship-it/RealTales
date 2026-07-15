'use client'
import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

export interface ScrollySection {
  id: string
  kind: 'text' | 'photo'
  eyebrow?: string
  heading?: string
  body?: string
  imageUrl?: string
  caption?: string
}

interface ScrollytellingReelProps {
  sections: ScrollySection[]
  accentFrom: string
  accentTo: string
}

/** Continuous-scroll narrative — reading pace *is* progress, no tap/click needed.
 * Each section resolves from blurred-and-low into sharp-and-settled as it scrolls
 * into view (Framer Motion's useScroll/useTransform, already in the stack — no
 * new dependency for this piece), rather than a fixed-timer fade. */
export function ScrollytellingReel({ sections, accentFrom, accentTo }: ScrollytellingReelProps) {
  return (
    <div className="relative">
      {sections.map((section, i) => (
        <ScrollySection key={section.id} section={section} index={i} accentFrom={accentFrom} accentTo={accentTo} />
      ))}
    </div>
  )
}

function ScrollySection({ section, index, accentFrom, accentTo }: { section: ScrollySection; index: number; accentFrom: string; accentTo: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress: revealProgress } = useScroll({ target: ref, offset: ['start 0.88', 'start 0.4'] })
  const { scrollYProgress: fullProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })

  const opacity = useTransform(revealProgress, [0, 1], [0, 1])
  const y = useTransform(revealProgress, [0, 1], [36, 0])
  const blurPx = useTransform(revealProgress, [0, 1], [10, 0])
  const filter = useTransform(blurPx, b => `blur(${b}px)`)
  const parallaxY = useTransform(fullProgress, [0, 1], [-32, 32])

  return (
    <div ref={ref} className="min-h-[75vh] flex items-center justify-center px-8 py-16">
      {section.kind === 'photo' ? (
        <motion.div style={{ opacity, y }} className="relative w-full max-w-md">
          <motion.div style={{ y: parallaxY }} className="rounded-2xl overflow-hidden shadow-2xl border border-white/10">
            {section.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={section.imageUrl} alt="" className="w-full h-72 object-cover" />
            ) : (
              <div className="w-full h-72" style={{ background: `linear-gradient(160deg, ${accentFrom} 0%, ${accentTo} 100%)` }} />
            )}
          </motion.div>
          {section.caption && <p className="font-hand text-xl text-white/90 mt-4 text-center">{section.caption}</p>}
        </motion.div>
      ) : (
        <motion.div style={{ opacity, y, filter }} className="max-w-lg text-center">
          {section.eyebrow && <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-3" style={{ color: accentFrom }}>{section.eyebrow}</p>}
          {section.heading && <p className="font-display italic text-3xl text-white mb-4 leading-snug">{section.heading}</p>}
          {section.body && <p className="font-hand text-2xl text-white/85 leading-relaxed">{section.body}</p>}
        </motion.div>
      )}
      <span className="sr-only">Section {index + 1}</span>
    </div>
  )
}
