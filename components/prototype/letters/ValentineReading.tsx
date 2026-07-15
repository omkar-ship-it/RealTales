'use client'
import { LetterPageContent } from '@/components/reveal/LetterPageContent'
import { VoiceNotePage } from '../VoiceNotePage'
import { HoldToReveal } from '../gestures/HoldToReveal'
import { SimplePager } from '../SimplePager'
import { useDeviceTilt } from '@/hooks/useDeviceTilt'
import type { Scene } from '@/lib/types'

interface ValentineReadingProps {
  senderName: string
  accentFrom: string
  accentTo: string
  onComplete: () => void
}

function scene(partial: Partial<Scene> & { id: string }): Scene {
  return { layout: 'text-only', transition: 'fade', durationMs: 4000, ...partial }
}

/** Tests: the biggest WebGL swing at the gate (see the lab page) + gyroscope
 * parallax throughout + a voice note as the single emotional peak — a spoken
 * proposal carries more than any animation could. */
export function ValentineReading({ senderName, accentFrom, accentTo, onComplete }: ValentineReadingProps) {
  const { tilt, needsPermission, requestPermission } = useDeviceTilt()

  const intro = scene({ id: 'intro', heading: 'I’ve been trying to write this for a week.', body: 'Every version sounded too small for what I actually feel.' })
  const finalLine = scene({ id: 'final', heading: 'So here it is, plainly:', body: 'Will you be mine — not just today, but on purpose, every day after this one?' })

  const pages = [
    <div key="intro" className="relative w-full h-full" style={{ transform: `perspective(800px) rotateX(${tilt.y * -4}deg) rotateY(${tilt.x * 4}deg)` }}>
      <LetterPageContent scene={intro} index={0} total={3} accentFrom={accentFrom} accentTo={accentTo} />
    </div>,
    <div key="voice" className="paper-grain absolute inset-0 rounded-2xl bg-[#FBF6EC] shadow-2xl overflow-hidden">
      <VoiceNotePage
        text={`I recorded this because some things need to be said out loud, not typed. This is ${senderName || 'me'}, and I mean every word.`}
        speakerLabel={senderName ? `From ${senderName}` : 'A voice note'}
        accentFrom={accentFrom}
        accentTo={accentTo}
      />
    </div>,
    <HoldToReveal key="final" label="Hold, and don’t let go" onReveal={onComplete}>
      <LetterPageContent scene={finalLine} index={2} total={3} accentFrom={accentFrom} accentTo={accentTo} />
    </HoldToReveal>,
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
      <SimplePager pages={pages} onComplete={onComplete} />
    </>
  )
}
