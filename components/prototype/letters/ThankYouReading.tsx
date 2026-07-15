'use client'
import { ScrollytellingReel, PeakLine, type ScrollySection } from '../ScrollytellingReel'
import type { LabLetter } from '@/lib/prototypes/letters'

interface ThankYouReadingProps {
  letter: LabLetter
  onComplete: () => void
}

/** Was the page-turn "control" the other prototypes got judged against; now
 * genuinely runs the same unified scrollytelling engine as every other /lab
 * letter — the quote is promoted to the letter's one pinned peak instead of
 * being flat text like its neighbors. */
export function ThankYouReading({ letter, onComplete }: ThankYouReadingProps) {
  const { accentFrom, accentTo } = letter

  const sections: ScrollySection[] = [
    { id: 't1', kind: 'text', heading: 'What you did mattered.', body: 'It would have been easy to look away. You didn’t.' },
    { id: 'photo', kind: 'photo', caption: 'The moment we mean when we say “thank you.”' },
    { id: 'quote', kind: 'pinned-hero', render: () => <PeakLine line="Some acts of kindness stay with people. This is one of them." accentFrom={accentFrom} /> },
    { id: 't3', kind: 'text', heading: 'Thank you, truly.', body: 'From all of us who noticed, even if we didn’t say it at the time.' },
  ]

  return <ScrollytellingReel sections={sections} accentFrom={accentFrom} accentTo={accentTo} onComplete={onComplete} />
}
