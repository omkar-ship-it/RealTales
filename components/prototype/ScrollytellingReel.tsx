'use client'
import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { motion, useScroll, useTransform, useReducedMotion, type MotionValue } from 'framer-motion'
import { Heart } from 'lucide-react'
import { VoiceNotePage } from './VoiceNotePage'

export type ScrollySection =
  | { id: string; kind: 'text'; eyebrow?: string; heading?: string; body?: string }
  | { id: string; kind: 'photo'; caption?: string; imageUrl?: string }
  | { id: string; kind: 'gallery'; items: Array<{ caption?: string; render?: () => ReactNode }> }
  /** The one pin+scrub peak per letter — held center-stage while the page scrolls past it, instead of just fading in. */
  | { id: string; kind: 'pinned-hero'; render: () => ReactNode }
  | { id: string; kind: 'voice'; text: string; speakerLabel?: string }
  | { id: string; kind: 'interactive'; render: () => ReactNode }
  /** Same blur-in reveal chrome as `text`, but caller-supplied content — for
   * beats that need their own inline transform (e.g. Valentine's gyroscope
   * tilt) without touching any ancestor of the pinned/fixed sections, since a
   * `transform` on an ancestor would break `position: sticky`/`fixed` below it. */
  | { id: string; kind: 'custom'; render: () => ReactNode }

interface ScrollytellingReelProps {
  sections: ScrollySection[]
  accentFrom: string
  accentTo: string
  onComplete: () => void
  closingLabel?: string
}

/** The one reveal engine for every /lab letter. Reading pace *is* progress — no
 * tap/click to advance. Built from techniques that show up across the best
 * scrollytelling on the web (NYT Snow Fall, Apple product pages, GSAP
 * ScrollTrigger's pin+scrub pattern) ported onto Framer Motion's useScroll/
 * useTransform, already the only animation dependency in this stack:
 *  - `PinnedHero` = pin+scrub: one element held via `position: sticky` while
 *    its own transform is driven by scroll progress across a tall span.
 *    Reserved for exactly one emotional peak per letter — Snow Fall's own
 *    retrospective is that showpiece motion earns its place or gets cut, which
 *    is the same restraint this project already applies at the closing ritual.
 *  - `GalleryBeat` = horizontal-inside-vertical: a sticky track translated in
 *    x by vertical scroll progress, for photo-heavy moments.
 *  - `ScrollProgressRail` = a diegetic whole-letter progress signal (today's
 *    engine has none), styled like an ink trail rather than an abstract bar.
 * `useReducedMotion` gates all of it — reduced-motion users get plain fades
 * and stacked layouts, no pin/scrub/parallax. */
export function ScrollytellingReel({ sections, accentFrom, accentTo, onComplete, closingLabel = 'Close the letter' }: ScrollytellingReelProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const reduceMotion = !!useReducedMotion()
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end end'] })

  return (
    <div ref={containerRef} className="relative min-h-screen bg-[#120E0A]">
      {!reduceMotion && <ScrollProgressRail progress={scrollYProgress} accentFrom={accentFrom} accentTo={accentTo} />}

      {sections.map((section, i) => (
        <SectionRenderer key={section.id} section={section} index={i} accentFrom={accentFrom} accentTo={accentTo} reduceMotion={reduceMotion} />
      ))}

      <div className="flex justify-center pb-24 pt-8">
        <button
          type="button"
          onClick={onComplete}
          className="px-6 py-3 rounded-full font-semibold text-sm text-[#2B2140]"
          style={{ background: `linear-gradient(160deg, ${accentFrom} 0%, ${accentTo} 100%)` }}
        >
          {closingLabel}
        </button>
      </div>
    </div>
  )
}

function ScrollProgressRail({ progress, accentFrom, accentTo }: { progress: MotionValue<number>; accentFrom: string; accentTo: string }) {
  return (
    <div className="fixed right-3 top-1/2 -translate-y-1/2 z-20 h-40 w-[3px] rounded-full bg-white/10 overflow-hidden hidden sm:block">
      <motion.div
        className="w-full h-full origin-top"
        style={{ scaleY: progress, background: `linear-gradient(180deg, ${accentFrom} 0%, ${accentTo} 100%)` }}
      />
    </div>
  )
}

function SectionRenderer({ section, index, accentFrom, accentTo, reduceMotion }: { section: ScrollySection; index: number; accentFrom: string; accentTo: string; reduceMotion: boolean }) {
  switch (section.kind) {
    case 'text':
      return <TextBeat section={section} accentFrom={accentFrom} reduceMotion={reduceMotion} />
    case 'photo':
      return <PhotoBeat section={section} index={index} accentFrom={accentFrom} accentTo={accentTo} reduceMotion={reduceMotion} />
    case 'gallery':
      return <GalleryBeat items={section.items} index={index} accentFrom={accentFrom} accentTo={accentTo} reduceMotion={reduceMotion} />
    case 'pinned-hero':
      return <PinnedHero reduceMotion={reduceMotion}>{section.render()}</PinnedHero>
    case 'voice':
      return <VoiceBeat text={section.text} speakerLabel={section.speakerLabel} accentFrom={accentFrom} accentTo={accentTo} />
    case 'interactive':
      return <InteractiveBeat reduceMotion={reduceMotion}>{section.render()}</InteractiveBeat>
    case 'custom':
      return <CustomBeat render={section.render} reduceMotion={reduceMotion} />
  }
}

/** Shared enter transform: blurred-and-low resolving into sharp-and-settled as a
 * section crosses into view, rather than a fixed-timer fade. Collapses to a plain
 * fade under reduced motion. */
function useRevealMotion(ref: React.RefObject<HTMLElement | null>, reduceMotion: boolean) {
  const { scrollYProgress: revealProgress } = useScroll({ target: ref, offset: ['start 0.88', 'start 0.4'] })
  const opacity = useTransform(revealProgress, [0, 1], [0, 1])
  const y = useTransform(revealProgress, [0, 1], [reduceMotion ? 0 : 36, 0])
  const blurPx = useTransform(revealProgress, [0, 1], [reduceMotion ? 0 : 10, 0])
  const filter = useTransform(blurPx, b => `blur(${b}px)`)
  return { opacity, y, filter }
}

function TextBeat({ section, accentFrom, reduceMotion }: { section: Extract<ScrollySection, { kind: 'text' }>; accentFrom: string; reduceMotion: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  const { opacity, y, filter } = useRevealMotion(ref, reduceMotion)
  return (
    <div ref={ref} className="min-h-[60vh] flex items-center justify-center px-8 py-16">
      <motion.div style={{ opacity, y, filter }} className="max-w-lg text-center">
        {section.eyebrow && <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-3" style={{ color: accentFrom }}>{section.eyebrow}</p>}
        {section.heading && <p className="font-display italic text-3xl text-white mb-4 leading-snug">{section.heading}</p>}
        {section.body && <p className="font-hand text-2xl text-white/85 leading-relaxed">{section.body}</p>}
      </motion.div>
    </div>
  )
}

function CustomBeat({ render, reduceMotion }: { render: () => ReactNode; reduceMotion: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  const { opacity, y, filter } = useRevealMotion(ref, reduceMotion)
  return (
    <div ref={ref} className="min-h-[60vh] flex items-center justify-center px-8 py-16">
      <motion.div style={{ opacity, y, filter }} className="max-w-lg w-full text-center">
        {render()}
      </motion.div>
    </div>
  )
}

function PhotoBeat({ section, index, accentFrom, accentTo, reduceMotion }: { section: Extract<ScrollySection, { kind: 'photo' }>; index: number; accentFrom: string; accentTo: string; reduceMotion: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  const { opacity, y } = useRevealMotion(ref, reduceMotion)
  const { scrollYProgress: fullProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  // Two-layer depth: the card itself moves more than the wash behind it, the
  // illusion depth relies on (closer things travel farther as you scroll past them).
  const cardParallaxY = useTransform(fullProgress, [0, 1], reduceMotion ? [0, 0] : [-32, 32])
  const washParallaxY = useTransform(fullProgress, [0, 1], reduceMotion ? [0, 0] : [-12, 12])
  const kenBurnsScale = useTransform(fullProgress, [0, 1], reduceMotion ? [1, 1] : [1, 1.1])
  const kenBurnsX = useTransform(fullProgress, [0, 1], reduceMotion ? [0, 0] : [-6, 6])

  return (
    <div ref={ref} className="min-h-[70vh] flex items-center justify-center px-8 py-16 relative overflow-hidden">
      <motion.div style={{ y: washParallaxY }} className="absolute inset-0 -z-10">
        <div className="absolute inset-0 opacity-40" style={{ background: `radial-gradient(circle at 50% 40%, ${accentFrom}55, transparent 70%)` }} />
      </motion.div>
      <motion.div style={{ opacity, y }} className="relative w-full max-w-md">
        <motion.div style={{ y: cardParallaxY }} className="rounded-2xl overflow-hidden shadow-2xl border border-white/10">
          <motion.div style={{ scale: kenBurnsScale, x: kenBurnsX }} className="w-full h-72">
            {section.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={section.imageUrl} alt="" className="w-full h-full object-cover" />
            ) : (
              <KeepsakeMoment index={index} accentFrom={accentFrom} accentTo={accentTo} />
            )}
          </motion.div>
        </motion.div>
        {section.caption && <p className="font-hand text-xl text-white/90 mt-4 text-center">{section.caption}</p>}
      </motion.div>
    </div>
  )
}

/** Horizontal-inside-vertical gallery — a tall spacer with a sticky track inside
 * it, translated in `x` by the spacer's own vertical scroll progress. Under
 * reduced motion this degrades to a plain vertical stack, no pinning at all. */
function GalleryBeat({ items, index, accentFrom, accentTo, reduceMotion }: { items: Array<{ caption?: string; render?: () => ReactNode }>; index: number; accentFrom: string; accentTo: string; reduceMotion: boolean }) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const [overflow, setOverflow] = useState(0)

  useEffect(() => {
    const measure = () => {
      if (!trackRef.current) return
      const trackWidth = trackRef.current.scrollWidth
      const viewport = trackRef.current.parentElement?.clientWidth ?? trackWidth
      setOverflow(Math.max(0, trackWidth - viewport))
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [items.length])

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] })
  const x = useTransform(scrollYProgress, [0, 1], reduceMotion ? [0, 0] : [0, -overflow])

  const cards = items.map((item, i) => (
    <div key={i} className="w-[78vw] max-w-[320px] shrink-0">
      {item.render ? (
        item.render()
      ) : (
        <>
          <div className="rounded-2xl overflow-hidden shadow-2xl border border-white/10">
            <KeepsakeMoment index={index * 10 + i} accentFrom={accentFrom} accentTo={accentTo} />
          </div>
          {item.caption && <p className="font-hand text-lg text-white/85 mt-3 text-center">{item.caption}</p>}
        </>
      )}
    </div>
  ))

  if (reduceMotion) {
    return <div className="flex flex-col items-center gap-10 px-8 py-16">{cards}</div>
  }

  return (
    <div ref={sectionRef} className="relative" style={{ height: `${Math.max(2, items.length) * 60}vh` }}>
      <div className="sticky top-0 h-screen flex items-center overflow-hidden px-8">
        <motion.div ref={trackRef} style={{ x }} className="flex gap-6">
          {cards}
        </motion.div>
      </div>
    </div>
  )
}

/** A pinned peak that's just an emphasized line, no gesture — for letters whose
 * peak is a single sentence (the proposal, "I'd choose you") rather than an
 * interactive moment. Sized to fill `PinnedHero`'s fixed-height wrapper. */
export function PeakLine({ eyebrow, line, accentFrom }: { eyebrow?: string; line: string; accentFrom: string }) {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center px-4">
      {eyebrow && <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-4" style={{ color: accentFrom }}>{eyebrow}</p>}
      <p className="font-display italic text-3xl sm:text-4xl text-white leading-snug">{line}</p>
    </div>
  )
}

/** Vertically centers content that doesn't fill its own height (EventCountdown,
 * RSVP, InvitationDetails) inside a `pinned-hero`/`interactive` beat's box. */
export function CenteredCard({ children }: { children: ReactNode }) {
  return <div className="h-full flex items-center justify-center">{children}</div>
}

/** Pin+scrub: the actual Snow Fall/GSAP ScrollTrigger move — content held via
 * `position: sticky` across a tall span while scroll progress drives its own
 * scale/opacity/y, so it feels held in place and *earned* rather than just
 * another beat scrolling past. Reserved for one peak moment per letter. */
function PinnedHero({ children, reduceMotion }: { children: ReactNode; reduceMotion: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const scale = useTransform(scrollYProgress, [0, 0.4, 1], [0.86, 1, 0.86])
  const opacity = useTransform(scrollYProgress, [0, 0.12, 0.88, 1], [0, 1, 1, 0])
  const y = useTransform(scrollYProgress, [0, 0.4, 1], [40, 0, -40])

  if (reduceMotion) {
    return (
      <div className="min-h-[90vh] flex items-center justify-center px-6 py-20">
        <div className="w-full max-w-md h-[65vh] max-h-[560px] relative">{children}</div>
      </div>
    )
  }

  return (
    <div ref={ref} className="relative" style={{ height: '170vh' }}>
      <div className="sticky top-0 h-screen flex items-center justify-center px-6 overflow-hidden">
        <motion.div style={{ scale, opacity, y }} className="w-full max-w-md h-[65vh] max-h-[560px] relative">
          {children}
        </motion.div>
      </div>
    </div>
  )
}

/** Voice notes are self-paced by their own play button, not scroll — so this is
 * a plain scroll-in beat, no pin, styled as the same paper card the rest of the
 * project uses for a voice moment. */
function VoiceBeat({ text, speakerLabel, accentFrom, accentTo }: { text: string; speakerLabel?: string; accentFrom: string; accentTo: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const { opacity, y } = useRevealMotion(ref, false)
  return (
    <div ref={ref} className="min-h-[60vh] flex items-center justify-center px-8 py-16">
      <motion.div style={{ opacity, y }} className="w-full max-w-sm h-[420px] relative paper-grain rounded-2xl bg-[#FBF6EC] shadow-2xl overflow-hidden">
        <VoiceNotePage text={text} speakerLabel={speakerLabel} accentFrom={accentFrom} accentTo={accentTo} />
      </motion.div>
    </div>
  )
}

/** Non-pinned interactive beats (RSVP, invitation details) — a plain fade-in,
 * deliberately no blur so buttons/links never read as temporarily disabled. */
function InteractiveBeat({ children, reduceMotion }: { children: ReactNode; reduceMotion: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  const { opacity, y } = useRevealMotion(ref, reduceMotion)
  return (
    <div ref={ref} className="min-h-[60vh] flex items-center justify-center px-8 py-16">
      <motion.div style={{ opacity, y }} className="w-full max-w-sm">
        {children}
      </motion.div>
    </div>
  )
}

function hash(n: number): number {
  const x = Math.sin(n * 12.9898) * 43758.5453
  return x - Math.floor(x)
}

/** Stand-in for a real photo when a section has no `imageUrl` — deliberately
 * not a stock photo of a real stranger standing in as "your" moment. A soft
 * bokeh-lit keepsake card (deterministically varied per section via `hash`)
 * reads as an evocative abstraction of a memory rather than a placeholder
 * rectangle or a misleading photo. */
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
