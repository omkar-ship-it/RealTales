'use client'
import { ScrollytellingReel, type ScrollySection } from '../ScrollytellingReel'

interface AnniversaryReadingProps {
  accentFrom: string
  accentTo: string
  onComplete: () => void
}

const SECTIONS: ScrollySection[] = [
  { id: 'meeting', kind: 'text', eyebrow: 'Where it started', heading: 'A crowded room, and somehow just you.', body: "I almost didn't go that evening. I've never been so glad I did." },
  { id: 'firstdate', kind: 'text', eyebrow: 'The first date', heading: 'Three hours felt like ten minutes.', body: 'We talked until the café closed and neither of us wanted to leave.' },
  { id: 'proposal', kind: 'text', eyebrow: 'The question', heading: 'I knew before I asked.', body: 'Some decisions take years. That one took about four seconds.' },
  { id: 'today', kind: 'text', eyebrow: 'Still', heading: 'Every year adds another reason I’d choose this again.', body: 'Grateful for every ordinary day that became extraordinary with you.' },
]

/** Tests: scrollytelling as the macro reveal (text/milestone timeline) — reading
 * pace is scroll position, not a tap you have to find. */
export function AnniversaryReading({ accentFrom, accentTo, onComplete }: AnniversaryReadingProps) {
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
