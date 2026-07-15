'use client'
import { ScrollytellingReel, PeakLine, type ScrollySection } from '../ScrollytellingReel'
import type { LabLetter } from '@/lib/prototypes/letters'

interface AnniversaryReadingProps {
  letter: LabLetter
  onComplete: () => void
}

/** Scrollytelling as the macro reveal — reading pace is scroll position, not a
 * tap you have to find. The proposal beat, flat text like everything around it
 * before, is now the letter's one pinned peak; a new milestone gallery adds
 * photo texture between the timeline beats. */
export function AnniversaryReading({ letter, onComplete }: AnniversaryReadingProps) {
  const { accentFrom, accentTo } = letter

  const sections: ScrollySection[] = [
    { id: 'meeting', kind: 'text', eyebrow: 'Where it started', heading: 'A crowded room, and somehow just you.', body: "I almost didn't go that evening. I've never been so glad I did." },
    { id: 'firstdate', kind: 'text', eyebrow: 'The first date', heading: 'Three hours felt like ten minutes.', body: 'We talked until the café closed and neither of us wanted to leave.' },
    {
      id: 'milestones',
      kind: 'gallery',
      items: [
        { caption: 'The apartment with the leaky faucet we loved anyway.' },
        { caption: 'Our first trip together, badly planned and perfect.' },
        { caption: 'Every anniversary since, stacked into one life.' },
      ],
    },
    { id: 'proposal', kind: 'pinned-hero', render: () => <PeakLine eyebrow="The question" line="I knew before I asked. Some decisions take years. That one took about four seconds." accentFrom={accentFrom} /> },
    { id: 'today', kind: 'text', eyebrow: 'Still', heading: 'Every year adds another reason I’d choose this again.', body: 'Grateful for every ordinary day that became extraordinary with you.' },
  ]

  return <ScrollytellingReel sections={sections} accentFrom={accentFrom} accentTo={accentTo} onComplete={onComplete} />
}
