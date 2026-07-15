'use client'
import { LetterPageContent } from '@/components/reveal/LetterPageContent'
import { ScratchReveal } from '../gestures/ScratchReveal'
import { SimplePager } from '../SimplePager'
import type { Scene } from '@/lib/types'

interface BirthdayReadingProps {
  accentFrom: string
  accentTo: string
  onComplete: () => void
}

function scene(partial: Partial<Scene> & { id: string }): Scene {
  return { layout: 'text-only', transition: 'fade', durationMs: 4000, ...partial }
}

/** Tests: WebGL envelope at the gate (see the lab page) + a resurrected gesture
 * moment — scratch-reveal, chosen because it means "uncovering a surprise." */
export function BirthdayReading({ accentFrom, accentTo, onComplete }: BirthdayReadingProps) {
  const intro = scene({ id: 'intro', heading: 'Another orbit around the sun.', body: 'And somehow you get more ridiculous every year. I love that about you.' })
  const surprise = scene({ id: 'surprise', layout: 'image-text', heading: 'One from the archives.', body: 'You forgot this photo existed. You’re welcome.', background: { from: accentFrom, to: accentTo } })
  const closing = scene({ id: 'closing', heading: 'Happy birthday, truly.', body: 'Hope today is exactly as loud and joyful as you are.' })

  const pages = [
    <LetterPageContent key="intro" scene={intro} index={0} total={3} accentFrom={accentFrom} accentTo={accentTo} />,
    <ScratchReveal key="surprise" label="Scratch to find your surprise" accentFrom={accentFrom} accentTo={accentTo}>
      <LetterPageContent scene={surprise} index={1} total={3} accentFrom={accentFrom} accentTo={accentTo} />
    </ScratchReveal>,
    <LetterPageContent key="closing" scene={closing} index={2} total={3} accentFrom={accentFrom} accentTo={accentTo} />,
  ]

  return <SimplePager pages={pages} onComplete={onComplete} />
}
