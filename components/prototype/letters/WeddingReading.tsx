'use client'
import { ScrollytellingReel, CenteredCard, type ScrollySection } from '../ScrollytellingReel'
import { InvitationDetails } from '../InvitationDetails'
import { EventCountdown } from '../EventCountdown'
import { RSVP } from '../RSVP'
import { googleCalendarUrl } from '@/lib/calendar-link'
import type { LabLetter } from '@/lib/prototypes/letters'

interface WeddingReadingProps {
  letter: LabLetter
  onComplete: () => void
}

const WEDDING_DATE = new Date(Date.now() + 1000 * 60 * 60 * 24 * 47).toISOString()

/** The "letter as invitation" thesis — multi-chapter ceremony details (learned
 * from Anvaya's guest-segmented, per-ceremony model) now scroll past as a
 * horizontal gallery, the countdown is the letter's one pinned peak, and RSVP
 * closes it out. */
export function WeddingReading({ letter, onComplete }: WeddingReadingProps) {
  const { accentFrom, accentTo } = letter

  const sections: ScrollySection[] = [
    { id: 'intro', kind: 'text', eyebrow: 'Save the date', heading: 'We’re getting married.', body: 'And we want you there for every bit of it — not just the big day.' },
    {
      id: 'ceremonies',
      kind: 'gallery',
      items: [
        { render: () => <InvitationDetails eventName="Mehendi" date="Fri, 4 Sep" time="4:00 PM" venue="The Fern Lawns" dressCode="Yellow & green" accentFrom={accentFrom} /> },
        { render: () => <InvitationDetails eventName="Sangeet" date="Sat, 5 Sep" time="7:00 PM" venue="Taj Ballroom" dressCode="Festive, sequins encouraged" accentFrom={accentFrom} /> },
        { render: () => <InvitationDetails eventName="Wedding Ceremony" date="Sun, 6 Sep" time="10:00 AM" venue="Grand Mandap, Taj Lawns" dressCode="Traditional" mapUrl="https://maps.google.com" accentFrom={accentFrom} /> },
      ],
    },
    {
      id: 'countdown',
      kind: 'pinned-hero',
      render: () => (
        <CenteredCard>
          <EventCountdown
            targetDate={WEDDING_DATE}
            eventName="the wedding"
            addToCalendarUrl={googleCalendarUrl({
              title: 'Shiva & Shakti’s Wedding',
              start: new Date(WEDDING_DATE),
              end: new Date(new Date(WEDDING_DATE).getTime() + 4 * 3600000),
              location: 'Grand Mandap, Taj Lawns',
            })}
          />
        </CenteredCard>
      ),
    },
    { id: 'rsvp', kind: 'interactive', render: () => <RSVP accentFrom={accentFrom} accentTo={accentTo} /> },
  ]

  return <ScrollytellingReel sections={sections} accentFrom={accentFrom} accentTo={accentTo} onComplete={onComplete} closingLabel="Save the date" />
}
