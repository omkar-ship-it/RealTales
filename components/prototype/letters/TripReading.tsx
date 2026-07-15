'use client'
import { ScrollytellingReel, PeakLine, type ScrollySection } from '../ScrollytellingReel'
import type { LabLetter } from '@/lib/prototypes/letters'

interface TripReadingProps {
  letter: LabLetter
  onComplete: () => void
}

/** Scrollytelling's *other* primary use case — photo-heavy/parallax
 * (journalism-style). The two solo photo beats are now one horizontal-scroll
 * gallery (more photos, more texture), and the closing line is promoted to
 * the letter's one pinned peak instead of scrolling past like everything else. */
export function TripReading({ letter, onComplete }: TripReadingProps) {
  const { accentFrom, accentTo } = letter

  const sections: ScrollySection[] = [
    { id: 'depart', kind: 'text', eyebrow: 'Day 1', heading: 'Somewhere between the wrong turns and the good views', body: 'this became one for the books.' },
    {
      id: 'gallery',
      kind: 'gallery',
      items: [
        { caption: 'That sunrise none of us were awake enough to deserve.' },
        { caption: 'The wrong turn that became the best part of the trip.' },
        { caption: 'This one’s going straight to the group chat forever.' },
        { caption: 'Nobody believed we actually found this place.' },
      ],
    },
    { id: 'midtrip', kind: 'text', eyebrow: 'Day 3', heading: 'We got lost on purpose after that.', body: 'Best decision of the whole trip.' },
    { id: 'end', kind: 'pinned-hero', render: () => <PeakLine eyebrow="Home" line="Every memory worth keeping, in one place. Same time next year?" accentFrom={accentFrom} /> },
  ]

  return <ScrollytellingReel sections={sections} accentFrom={accentFrom} accentTo={accentTo} onComplete={onComplete} />
}
