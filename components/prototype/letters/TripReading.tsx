'use client'
import { ScrollytellingReel, type ScrollySection } from '../ScrollytellingReel'

interface TripReadingProps {
  accentFrom: string
  accentTo: string
  onComplete: () => void
}

const SECTIONS: ScrollySection[] = [
  { id: 'depart', kind: 'text', eyebrow: 'Day 1', heading: 'Somewhere between the wrong turns and the good views', body: 'this became one for the books.' },
  { id: 'photo1', kind: 'photo', caption: 'That sunrise none of us were awake enough to deserve.' },
  { id: 'midtrip', kind: 'text', eyebrow: 'Day 3', heading: 'We got lost on purpose after that.', body: 'Best decision of the whole trip.' },
  { id: 'photo2', kind: 'photo', caption: 'This one’s going straight to the group chat forever.' },
  { id: 'end', kind: 'text', eyebrow: 'Home', heading: 'Every memory worth keeping, in one place.', body: 'Same time next year?' },
]

/** Tests: scrollytelling's *other* primary use case — photo-heavy/parallax
 * (journalism-style), contrasting with Anniversary's text-timeline use of the
 * same engine. */
export function TripReading({ accentFrom, accentTo, onComplete }: TripReadingProps) {
  return (
    <div className="min-h-screen">
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
