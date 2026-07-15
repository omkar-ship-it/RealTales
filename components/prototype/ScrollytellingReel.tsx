'use client'
import { useMemo, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Heart } from 'lucide-react'

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
              <KeepsakeMoment index={index} accentFrom={accentFrom} accentTo={accentTo} />
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

function hash(n: number): number {
  const x = Math.sin(n * 12.9898) * 43758.5453
  return x - Math.floor(x)
}

/** Stand-in for a real photo when a section has no `imageUrl` — deliberately
 * not a stock photo of a real stranger standing in as "your" moment. A soft
 * bokeh-lit keepsake card (deterministically varied per section via `hash`,
 * same technique as Starfield) reads as an evocative abstraction of a memory
 * rather than a placeholder rectangle or a misleading photo. */
function KeepsakeMoment({ index, accentFrom, accentTo }: { index: number; accentFrom: string; accentTo: string }) {
  const bokehs = useMemo(
    () =>
      Array.from({ length: 5 }, (_, i) => {
        const seed = index * 11 + i * 5
        return {
          left: `${(hash(seed + 1) * 85).toFixed(1)}%`,
          top: `${(hash(seed + 2) * 85).toFixed(1)}%`,
          size: 56 + hash(seed + 3) * 100,
          opacity: 0.16 + hash(seed + 4) * 0.22,
        }
      }),
    [index],
  )

  return (
    <div className="relative w-full h-72" style={{ background: `linear-gradient(160deg, ${accentFrom} 0%, ${accentTo} 100%)` }}>
      {bokehs.map((b, i) => (
        <div
          key={i}
          className="absolute rounded-full blur-2xl"
          style={{ left: b.left, top: b.top, width: b.size, height: b.size, background: `rgba(255,255,255,${b.opacity})` }}
        />
      ))}
      <div className="paper-grain absolute inset-0 opacity-25 mix-blend-overlay" />
      <div className="absolute inset-0" style={{ boxShadow: 'inset 0 0 70px rgba(0,0,0,0.35)' }} />
      <div className="absolute inset-0 flex items-center justify-center">
        <Heart className="w-10 h-10 text-white" strokeWidth={1.25} style={{ opacity: 0.5, fill: 'currentColor', fillOpacity: 0.15 }} />
      </div>
    </div>
  )
}
