'use client'
import { ScrollytellingReel, type ScrollySection } from '../ScrollytellingReel'
import { LetterPageContent } from '@/components/reveal/LetterPageContent'
import { HoldToReveal } from '../gestures/HoldToReveal'
import { useDeviceTilt } from '@/hooks/useDeviceTilt'
import type { LabLetter } from '@/lib/prototypes/letters'
import type { Scene } from '@/lib/types'

interface ValentineReadingProps {
  letter: LabLetter
  onComplete: () => void
}

function scene(partial: Partial<Scene> & { id: string }): Scene {
  return { layout: 'text-only', transition: 'fade', durationMs: 4000, ...partial }
}

/** Gyroscope tilt stays layered on top of the scroll-driven motion (additive
 * depth on the intro beat only — a `transform` on any ancestor of the pinned/
 * fixed sections below would break their `position: sticky`/`fixed` behavior,
 * so the tilt lives on a self-contained `custom` beat, not a page wrapper).
 * The voice note stays the letter's emotional core; hold-to-reveal on the
 * final line is the one pinned peak. */
export function ValentineReading({ letter, onComplete }: ValentineReadingProps) {
  const { accentFrom, accentTo, senderName } = letter
  const { tilt, needsPermission, requestPermission } = useDeviceTilt()

  const intro = scene({ id: 'intro', heading: 'I’ve been trying to write this for a week.', body: 'Every version sounded too small for what I actually feel.' })
  const finalLine = scene({ id: 'final', heading: 'So here it is, plainly:', body: 'Will you be mine — not just today, but on purpose, every day after this one?' })

  const sections: ScrollySection[] = [
    {
      id: 'intro',
      kind: 'custom',
      render: () => (
        <div
          className="relative w-full h-[60vh] max-h-[520px] mx-auto"
          style={{ transform: `perspective(800px) rotateX(${tilt.y * -4}deg) rotateY(${tilt.x * 4}deg)` }}
        >
          <LetterPageContent scene={intro} index={0} total={3} accentFrom={accentFrom} accentTo={accentTo} />
        </div>
      ),
    },
    {
      id: 'voice',
      kind: 'voice',
      text: `I recorded this because some things need to be said out loud, not typed. This is ${senderName || 'me'}, and I mean every word.`,
      speakerLabel: senderName ? `From ${senderName}` : 'A voice note',
    },
    {
      id: 'final',
      kind: 'pinned-hero',
      render: () => (
        <HoldToReveal label="Hold, and don’t let go" onReveal={onComplete}>
          <LetterPageContent scene={finalLine} index={2} total={3} accentFrom={accentFrom} accentTo={accentTo} />
        </HoldToReveal>
      ),
    },
  ]

  return (
    <>
      {needsPermission && (
        <button
          type="button"
          onClick={requestPermission}
          className="fixed top-4 left-1/2 -translate-x-1/2 z-30 px-4 py-2 rounded-full bg-white/10 text-white/80 text-xs backdrop-blur"
        >
          Enable tilt for depth
        </button>
      )}
      <ScrollytellingReel sections={sections} accentFrom={accentFrom} accentTo={accentTo} onComplete={onComplete} />
    </>
  )
}
