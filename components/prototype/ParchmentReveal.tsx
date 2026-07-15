'use client'
import { useMemo, useRef, useState, type ReactNode } from 'react'
import { motion, useScroll, useTransform, useInView, useReducedMotion } from 'framer-motion'
import { HoldToReveal } from './gestures/HoldToReveal'
import { PeakLine } from './ScrollytellingReel'

export type ParchmentSection =
  | { id: string; kind: 'text'; eyebrow?: string; heading?: string; body?: string }
  | { id: string; kind: 'photo'; imageUrl: string; caption?: string }
  | { id: string; kind: 'custom'; render: () => ReactNode }

interface ParchmentRevealProps {
  sections: ParchmentSection[]
  accentFrom: string
  accentTo: string
  peakEyebrow: string
  peakLine: string
  signatureLine: string
  onComplete: () => void
}

function hash(n: number): number {
  const x = Math.sin(n * 12.9898) * 43758.5453
  return x - Math.floor(x)
}

/** A deterministic (hash-based, no Math.random) jagged clip-path for the
 * parchment's left/right edges — a restrained deckled-paper look, not an
 * ornate frame. Modest amplitude on purpose: this is texture, not decoration. */
function useDeckledClipPath(segments = 26, amplitude = 2) {
  return useMemo(() => {
    const left: string[] = []
    const right: string[] = []
    for (let i = 0; i <= segments; i++) {
      const t = (i / segments) * 100
      const jL = (hash(i * 3.1) - 0.5) * 2 * amplitude
      const jR = (hash(i * 7.7 + 50) - 0.5) * 2 * amplitude
      left.push(`${jL.toFixed(2)}% ${t.toFixed(2)}%`)
      right.push(`${(100 - jR).toFixed(2)}% ${t.toFixed(2)}%`)
    }
    return `polygon(${[...left, ...right.reverse()].join(', ')})`
  }, [segments, amplitude])
}

/**
 * A scroll receiver experience — the letter reads as parchment threaded out
 * from beneath a fixed wooden dowel as the page scrolls. Deliberately reuses
 * plain scroll as the input (no drag-to-unroll gesture): this project already
 * tried a drag-then-commit page-turn once and found it felt bad, replaced
 * with tap — a "pull to unroll" gesture risks the same failure, so the unroll
 * is a purely visual metaphor layered on scroll that already works.
 *
 * The peak drops the parchment framing entirely — a dark, held-to-reveal
 * moment, same as `RoomReveal`'s peak — continuous with this project's
 * original reveal-design principle: strip back everything at the true peak,
 * contrast is what makes it land.
 */
export function ParchmentReveal({ sections, accentFrom, accentTo, peakEyebrow, peakLine, signatureLine, onComplete }: ParchmentRevealProps) {
  const reduceMotion = !!useReducedMotion()
  const clipPath = useDeckledClipPath()
  const peakRef = useRef<HTMLDivElement>(null)
  const peakInView = useInView(peakRef, { once: true, amount: 0.4 })
  const [peakRevealed, setPeakRevealed] = useState(false)

  return (
    <div className="relative min-h-screen bg-[#120E0A]">
      <Dowel />

      <div className="relative pt-16 pb-24 px-2">
        <div
          className="paper-grain relative max-w-md mx-auto bg-[#FBF6EC] shadow-2xl"
          style={reduceMotion ? undefined : { clipPath }}
        >
          {sections.map(s => (
            <SectionRenderer key={s.id} section={s} reduceMotion={reduceMotion} />
          ))}
        </div>
        <div ref={peakRef} className="h-2" />
      </div>

      {peakInView && (
        <div className="fixed inset-0 z-30 flex flex-col items-center justify-center bg-black/85 backdrop-blur-sm px-8 text-center">
          <div className="w-full max-w-md h-[36vh]">
            <HoldToReveal label="Hold, and don’t let go" onReveal={() => setPeakRevealed(true)}>
              <PeakLine eyebrow={peakEyebrow} line={peakLine} accentFrom={accentFrom} />
            </HoldToReveal>
          </div>
          {peakRevealed && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center gap-4 mt-2"
            >
              <p className="font-hand text-xl text-white/80">{signatureLine}</p>
              <button
                type="button"
                onClick={onComplete}
                className="px-6 py-3 rounded-full font-semibold text-sm text-[#2B2140]"
                style={{ background: `linear-gradient(160deg, ${accentFrom} 0%, ${accentTo} 100%)` }}
              >
                Close the letter
              </button>
            </motion.div>
          )}
        </div>
      )}
    </div>
  )
}

function Dowel() {
  return (
    <div className="fixed top-0 inset-x-0 z-20 pointer-events-none flex justify-center px-6 pt-3">
      <div className="relative w-full max-w-md">
        <div
          className="h-6 rounded-full"
          style={{ background: 'linear-gradient(180deg, #9C7A48 0%, #6B4E28 50%, #3E2C15 100%)', boxShadow: '0 6px 16px rgba(0,0,0,0.55)' }}
        />
        <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-5 h-8 rounded-full" style={{ background: 'radial-gradient(circle at 35% 35%, #B08F5C, #3E2C15)' }} />
        <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-5 h-8 rounded-full" style={{ background: 'radial-gradient(circle at 35% 35%, #B08F5C, #3E2C15)' }} />
        <div className="h-5" style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.4), transparent)' }} />
      </div>
    </div>
  )
}

function SectionRenderer({ section, reduceMotion }: { section: ParchmentSection; reduceMotion: boolean }) {
  switch (section.kind) {
    case 'text':
      return <TextBeat section={section} reduceMotion={reduceMotion} />
    case 'photo':
      return <PhotoBeat section={section} reduceMotion={reduceMotion} />
    case 'custom':
      return <CustomBeat render={section.render} reduceMotion={reduceMotion} />
  }
}

/** Same blur-in-on-approach technique as `ScrollytellingReel`'s beats — ported,
 * not imported, since this engine's typography (dark ink, not white) is
 * different enough throughout that sharing the component would mean
 * threading a theme prop through every beat type for a single letter. */
function useRevealMotion(ref: React.RefObject<HTMLElement | null>, reduceMotion: boolean) {
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.92', 'start 0.5'] })
  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1])
  const y = useTransform(scrollYProgress, [0, 1], [reduceMotion ? 0 : 22, 0])
  const blurPx = useTransform(scrollYProgress, [0, 1], [reduceMotion ? 0 : 7, 0])
  const filter = useTransform(blurPx, b => `blur(${b}px)`)
  return { opacity, y, filter }
}

function TextBeat({ section, reduceMotion }: { section: Extract<ParchmentSection, { kind: 'text' }>; reduceMotion: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  const { opacity, y, filter } = useRevealMotion(ref, reduceMotion)
  return (
    <div ref={ref} className="min-h-[50vh] flex items-center justify-center px-7 py-10">
      <motion.div style={{ opacity, y, filter }} className="text-center">
        {section.eyebrow && <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#B5822C] mb-3">{section.eyebrow}</p>}
        {section.heading && <p className="font-display italic text-2xl text-[#2B2140] mb-3 leading-snug">{section.heading}</p>}
        {section.body && <p className="font-hand text-xl text-[#3B2F2F] leading-relaxed">{section.body}</p>}
      </motion.div>
    </div>
  )
}

function PhotoBeat({ section, reduceMotion }: { section: Extract<ParchmentSection, { kind: 'photo' }>; reduceMotion: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  const { opacity, y, filter } = useRevealMotion(ref, reduceMotion)
  return (
    <div ref={ref} className="min-h-[55vh] flex items-center justify-center px-7 py-10">
      <motion.div style={{ opacity, y, filter }} className="w-full text-center">
        <div className="w-full aspect-[4/3] overflow-hidden shadow-lg mb-4" style={{ transform: 'rotate(-1deg)' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={section.imageUrl} alt="" className="w-full h-full object-cover" />
        </div>
        {section.caption && <p className="font-hand text-lg text-[#3B2F2F] leading-snug">{section.caption}</p>}
      </motion.div>
    </div>
  )
}

function CustomBeat({ render, reduceMotion }: { render: () => ReactNode; reduceMotion: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  const { opacity, y, filter } = useRevealMotion(ref, reduceMotion)
  return (
    <div ref={ref} className="min-h-[50vh] flex items-center justify-center px-7 py-10">
      <motion.div style={{ opacity, y, filter }} className="w-full">
        {render()}
      </motion.div>
    </div>
  )
}
