'use client'
import { ScrollytellingReel, type ScrollySection } from '../ScrollytellingReel'
import { LetterPageContent } from '@/components/reveal/LetterPageContent'
import { ScratchReveal } from '../gestures/ScratchReveal'
import type { LabLetter } from '@/lib/prototypes/letters'
import type { Scene } from '@/lib/types'

interface BirthdayReadingProps {
  letter: LabLetter
  onComplete: () => void
}

function scene(partial: Partial<Scene> & { id: string }): Scene {
  return { layout: 'text-only', transition: 'fade', durationMs: 4000, ...partial }
}

/** The birthday letter's original party-surprise idea, folded into the shared
 * scrollytelling engine — scratch-reveal (chosen because it means "uncovering a
 * surprise") is now the letter's one pinned peak instead of living on its own
 * pager page. */
export function BirthdayReading({ letter, onComplete }: BirthdayReadingProps) {
  const { accentFrom, accentTo } = letter
  const surprise = scene({ id: 'surprise', layout: 'image-text', heading: 'One from the archives.', body: 'You forgot this photo existed. You’re welcome.', background: { from: accentFrom, to: accentTo } })

  const sections: ScrollySection[] = [
    { id: 'intro', kind: 'text', eyebrow: 'Another orbit', heading: 'Another orbit around the sun.', body: 'And somehow you get more ridiculous every year. I love that about you.' },
    {
      id: 'gallery',
      kind: 'gallery',
      items: [
        { caption: 'The cake nearly didn’t survive the candles.' },
        { caption: 'Everyone who showed up, showed up for you.' },
        { caption: 'This face when you saw the decorations.' },
      ],
    },
    {
      id: 'surprise',
      kind: 'pinned-hero',
      render: () => (
        <ScratchReveal label="Scratch to find your surprise" accentFrom={accentFrom} accentTo={accentTo}>
          <LetterPageContent scene={surprise} index={1} total={3} accentFrom={accentFrom} accentTo={accentTo} />
        </ScratchReveal>
      ),
    },
    { id: 'closing', kind: 'text', eyebrow: 'Truly', heading: 'Happy birthday, truly.', body: 'Hope today is exactly as loud and joyful as you are.' },
  ]

  return <ScrollytellingReel sections={sections} accentFrom={accentFrom} accentTo={accentTo} onComplete={onComplete} />
}
