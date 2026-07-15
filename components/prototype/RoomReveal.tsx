'use client'
import { useEffect, useState, type ReactNode } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { X } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Starfield } from '@/components/reveal/Starfield'
import { useDeviceTilt } from '@/hooks/useDeviceTilt'
import { playPaperRustle, playChime } from '@/lib/prototype-sound'
import { PeakLine } from './ScrollytellingReel'

export interface RoomHotspot {
  id: string
  label: string
  icon: LucideIcon
  /** Position within the room, as a percentage of width/height. */
  x: number
  y: number
  /** Depth layer — larger = closer to the viewer = more parallax movement and a bigger icon. */
  depth: number
  /** Deliberately understated (smaller, no label, lower opacity) until found — the
   * one thing in the room that rewards curiosity rather than being handed over. */
  hidden?: boolean
  /** The content shown once opened — the engine supplies the card chrome/backdrop/close button. */
  render: () => ReactNode
}

interface RoomRevealProps {
  hotspots: RoomHotspot[]
  accentFrom: string
  accentTo: string
  peakEyebrow: string
  peakLine: string
  onComplete: () => void
}

/**
 * A walking-sim-style receiver experience — a single explorable "room" instead
 * of a linear scroll. The receiver taps objects in whatever order they like;
 * the letter's content lives inside them. Modeled on narrative/discovery games
 * (Gone Home, Firewatch, What Remains of Edith Finch) rather than arcade
 * mechanics — no score, no competition, no fail state. The one thing carried
 * over from the scrollytelling engine's own restraint principle: the peak
 * moment has to be *earned* (every hotspot found) before it appears, same as
 * `PinnedHero`'s "climax must be earned, not skippable."
 */
export function RoomReveal({ hotspots, accentFrom, accentTo, peakEyebrow, peakLine, onComplete }: RoomRevealProps) {
  const reduceMotion = !!useReducedMotion()
  const [discovered, setDiscovered] = useState<Set<string>>(new Set())
  const [openId, setOpenId] = useState<string | null>(null)
  const [pointer, setPointer] = useState({ x: 0, y: 0 })
  const { tilt, needsPermission, requestPermission } = useDeviceTilt(!reduceMotion)

  useEffect(() => {
    if (reduceMotion) return
    const handler = (e: PointerEvent) => {
      setPointer({ x: (e.clientX / window.innerWidth) * 2 - 1, y: (e.clientY / window.innerHeight) * 2 - 1 })
    }
    window.addEventListener('pointermove', handler)
    return () => window.removeEventListener('pointermove', handler)
  }, [reduceMotion])

  const px = reduceMotion ? 0 : pointer.x + tilt.x
  const py = reduceMotion ? 0 : pointer.y + tilt.y

  // Derived at render time, not via an effect watching `discovered` — the
  // completion check happens once, synchronously, in `open()` below, right
  // when the last hotspot is actually added, so the chime fires exactly once.
  const peakUnlocked = discovered.size === hotspots.length

  const openHotspot = hotspots.find(h => h.id === openId)

  const open = (id: string) => {
    playPaperRustle()
    setOpenId(id)
    if (!discovered.has(id)) {
      const next = new Set(discovered).add(id)
      setDiscovered(next)
      if (next.size === hotspots.length) playChime()
    }
  }

  return (
    <div className="fixed inset-0 bg-[#120E0A] overflow-hidden">
      <Starfield count={24} />

      {/* Window-light glow */}
      <div className="pointer-events-none absolute -left-16 top-10 w-72 h-72 rounded-full opacity-25 blur-3xl" style={{ background: accentFrom }} />
      <div className="pointer-events-none absolute -right-20 top-1/3 w-64 h-64 rounded-full opacity-15 blur-3xl" style={{ background: accentTo }} />

      {/* The "surface" — a desk/shelf band the objects sit on */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[38%]"
        style={{ background: `linear-gradient(180deg, transparent 0%, ${accentFrom}18 45%, ${accentFrom}2e 100%)` }}
      />

      {needsPermission && (
        <button
          type="button"
          onClick={requestPermission}
          className="fixed top-4 left-1/2 -translate-x-1/2 z-30 px-4 py-2 rounded-full bg-white/10 text-white/80 text-xs backdrop-blur"
        >
          Enable tilt for depth
        </button>
      )}

      <p className="absolute top-6 inset-x-0 text-center text-xs font-semibold tracking-[0.2em] uppercase text-white/40">
        {discovered.size} of {hotspots.length} found
      </p>

      {hotspots.map(h => (
        <HotspotButton
          key={h.id}
          hotspot={h}
          found={discovered.has(h.id)}
          offsetX={px * h.depth * 14}
          offsetY={py * h.depth * 10}
          accentFrom={accentFrom}
          accentTo={accentTo}
          onOpen={() => open(h.id)}
        />
      ))}

      <AnimatePresence>
        {openHotspot && (
          <motion.div
            key="content-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-20 flex items-center justify-center bg-black/70 backdrop-blur-sm px-6"
            onClick={() => setOpenId(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 18, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.97 }}
              transition={{ duration: 0.35 }}
              onClick={e => e.stopPropagation()}
              className="paper-grain relative w-full max-w-sm max-h-[80vh] overflow-y-auto rounded-2xl bg-[#FBF6EC] shadow-2xl"
            >
              <button
                type="button"
                onClick={() => setOpenId(null)}
                aria-label="Close"
                className="sticky top-3 left-full -translate-x-full w-8 h-8 rounded-full bg-black/10 flex items-center justify-center z-10"
              >
                <X className="w-4 h-4 text-[#2B2140]" />
              </button>
              <div className="px-2 pb-8 -mt-2">{openHotspot.render()}</div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {peakUnlocked && !openHotspot && (
          <motion.div
            key="peak"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-30 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm px-8 text-center"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 220, damping: 20, delay: 0.15 }}
              className="w-full max-w-md h-[40vh]"
            >
              <PeakLine eyebrow={peakEyebrow} line={peakLine} accentFrom={accentFrom} />
            </motion.div>
            <motion.button
              type="button"
              onClick={onComplete}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="px-6 py-3 rounded-full font-semibold text-sm text-[#2B2140] mt-4"
              style={{ background: `linear-gradient(160deg, ${accentFrom} 0%, ${accentTo} 100%)` }}
            >
              Close the letter
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function HotspotButton({
  hotspot,
  found,
  offsetX,
  offsetY,
  accentFrom,
  accentTo,
  onOpen,
}: {
  hotspot: RoomHotspot
  found: boolean
  offsetX: number
  offsetY: number
  accentFrom: string
  accentTo: string
  onOpen: () => void
}) {
  const Icon = hotspot.icon
  const size = hotspot.hidden && !found ? 40 : 56 + hotspot.depth * 10
  const showLabel = !hotspot.hidden || found

  return (
    <motion.button
      type="button"
      onClick={onOpen}
      aria-label={hotspot.label}
      style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%`, x: offsetX, y: offsetY }}
      className="absolute z-10 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2"
    >
      <motion.div
        className="rounded-full flex items-center justify-center shadow-lg"
        style={{
          width: size,
          height: size,
          background: found ? 'rgba(255,255,255,0.08)' : `linear-gradient(160deg, ${accentFrom} 0%, ${accentTo} 100%)`,
          opacity: hotspot.hidden && !found ? 0.45 : 1,
        }}
        animate={found ? undefined : { scale: [1, 1.07, 1] }}
        transition={found ? undefined : { duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
      >
        <Icon className="w-1/2 h-1/2" style={{ color: found ? 'rgba(255,255,255,0.5)' : 'white' }} strokeWidth={1.5} />
      </motion.div>
      {showLabel && <span className="text-[11px] text-white/60 max-w-[6.5rem] leading-tight">{hotspot.label}</span>}
    </motion.button>
  )
}
