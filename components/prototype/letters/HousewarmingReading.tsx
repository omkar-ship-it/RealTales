'use client'
import { ScrollytellingReel, type ScrollySection } from '../ScrollytellingReel'
import { InvitationDetails } from '../InvitationDetails'
import { EventCountdown } from '../EventCountdown'
import { googleCalendarUrl } from '@/lib/calendar-link'
import type { LabLetter } from '@/lib/prototypes/letters'

interface HousewarmingReadingProps {
  letter: LabLetter
  onComplete: () => void
}

const PARTY_DATE = new Date(Date.now() + 1000 * 60 * 60 * 24 * 12).toISOString()

/** A *light* invitation pattern — a room-by-room gallery instead of Wedding's
 * multi-chapter ceremony stack, and a single combined details+countdown beat
 * rather than a pinned peak — deliberate contrast with Wedding's heavy stack. */
export function HousewarmingReading({ letter, onComplete }: HousewarmingReadingProps) {
  const { accentFrom } = letter

  const sections: ScrollySection[] = [
    { id: 'intro', kind: 'text', eyebrow: 'You’re invited', heading: 'Come see our new home.', body: 'The walls are still bare, but the welcome is real. Bring your appetite.' },
    {
      id: 'rooms',
      kind: 'gallery',
      items: [
        { caption: 'The kitchen that started it all.' },
        { caption: 'Still figuring out where the couch goes.' },
        { caption: 'This corner gets the best light all day.' },
      ],
    },
    {
      id: 'details',
      kind: 'interactive',
      render: () => (
        <div className="flex flex-col items-center gap-8">
          <InvitationDetails eventName="Housewarming" date="Sat, 22 Aug" time="6:00 PM onward" venue="B-402, Willow Residency" mapUrl="https://maps.google.com" accentFrom={accentFrom} />
          <EventCountdown
            targetDate={PARTY_DATE}
            eventName="the housewarming"
            addToCalendarUrl={googleCalendarUrl({
              title: 'Housewarming',
              start: new Date(PARTY_DATE),
              end: new Date(new Date(PARTY_DATE).getTime() + 4 * 3600000),
              location: 'B-402, Willow Residency',
            })}
          />
        </div>
      ),
    },
  ]

  return <ScrollytellingReel sections={sections} accentFrom={accentFrom} accentTo={letter.accentTo} onComplete={onComplete} />
}
