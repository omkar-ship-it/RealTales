'use client'
import { ScrollytellingReel, type ScrollySection } from '../ScrollytellingReel'

interface AppreciationReadingProps {
  accentFrom: string
  accentTo: string
  onComplete: () => void
}

const SECTIONS: ScrollySection[] = [
  { id: 'unasked', kind: 'text', eyebrow: 'Just because', heading: 'You never asked for gratitude. That’s exactly why you deserve it.', body: 'For every quiet thing you carry so effortlessly that I almost forget to notice it — until I do.' },
  { id: 'photo1', kind: 'photo', caption: 'This laugh. This is my favorite version of you.' },
  { id: 'hard-days', kind: 'text', eyebrow: 'The hard days', heading: 'You show up even when no one’s watching.', body: 'I’ve seen you hold everything together on the days you thought you had nothing left to give.' },
  { id: 'small-things', kind: 'text', eyebrow: 'The small things', heading: 'Coffee made just the way I like it. A text at exactly the right moment.', body: 'Love isn’t the big gestures — it’s you, remembering, every single day.' },
  { id: 'photo2', kind: 'photo', caption: 'Somewhere between ordinary Tuesdays, we built a whole life.' },
  { id: 'still', kind: 'text', eyebrow: 'Still, always', heading: 'I’d choose this — choose you — every single time.', body: 'Thank you for being my person. Today, and every day after.' },
]

/** Tests: scrollytelling for an appreciation letter (husband → wife) — mixes
 * text and photo beats for pacing, same engine as Anniversary/Trip. WebGL gate
 * deliberately skipped per feedback that the 3D envelope opening is broken;
 * this letter uses the plain gate instead. */
export function AppreciationReading({ accentFrom, accentTo, onComplete }: AppreciationReadingProps) {
  return (
    <div className="min-h-screen bg-[#120E0A]">
      <ScrollytellingReel sections={SECTIONS} accentFrom={accentFrom} accentTo={accentTo} />
      <div className="flex justify-center pb-24">
        <button
          type="button"
          onClick={onComplete}
          className="px-6 py-3 rounded-full font-semibold text-sm text-[#2B2140]"
          style={{ background: `linear-gradient(160deg, ${accentFrom} 0%, ${accentTo} 100%)` }}
        >
          Close the letter
        </button>
      </div>
    </div>
  )
}
