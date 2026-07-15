'use client'
import { ScrollytellingReel, PeakLine, type ScrollySection } from '../ScrollytellingReel'
import type { LabLetter } from '@/lib/prototypes/letters'

interface AppreciationReadingProps {
  letter: LabLetter
  onComplete: () => void
}

/** Scrollytelling for an appreciation letter (husband → wife) — mixes text and
 * photo beats for pacing. The closing devotion line, flat text like its
 * neighbors before, is now the letter's one pinned peak. */
export function AppreciationReading({ letter, onComplete }: AppreciationReadingProps) {
  const { accentFrom, accentTo } = letter

  const sections: ScrollySection[] = [
    { id: 'unasked', kind: 'text', eyebrow: 'Just because', heading: 'You never asked for gratitude. That’s exactly why you deserve it.', body: 'For every quiet thing you carry so effortlessly that I almost forget to notice it — until I do.' },
    { id: 'photo1', kind: 'photo', caption: 'This laugh. This is my favorite version of you.' },
    { id: 'hard-days', kind: 'text', eyebrow: 'The hard days', heading: 'You show up even when no one’s watching.', body: 'I’ve seen you hold everything together on the days you thought you had nothing left to give.' },
    { id: 'small-things', kind: 'text', eyebrow: 'The small things', heading: 'Coffee made just the way I like it. A text at exactly the right moment.', body: 'Love isn’t the big gestures — it’s you, remembering, every single day.' },
    { id: 'photo2', kind: 'photo', caption: 'Somewhere between ordinary Tuesdays, we built a whole life.' },
    { id: 'still', kind: 'pinned-hero', render: () => <PeakLine eyebrow="Still, always" line="I’d choose this — choose you — every single time. Thank you for being my person." accentFrom={accentFrom} /> },
  ]

  return <ScrollytellingReel sections={sections} accentFrom={accentFrom} accentTo={accentTo} onComplete={onComplete} />
}
