'use client'
import { LetterPageContent } from '@/components/reveal/LetterPageContent'
import { InvitationDetails } from '../InvitationDetails'
import { EventCountdown } from '../EventCountdown'
import { RSVP } from '../RSVP'
import { SimplePager } from '../SimplePager'
import { googleCalendarUrl } from '@/lib/calendar-link'
import type { Scene } from '@/lib/types'

interface WeddingReadingProps {
  accentFrom: string
  accentTo: string
  onComplete: () => void
}

function scene(partial: Partial<Scene> & { id: string }): Scene {
  return { layout: 'text-only', transition: 'fade', durationMs: 4000, ...partial }
}

const WEDDING_DATE = new Date(Date.now() + 1000 * 60 * 60 * 24 * 47).toISOString()

/** Tests: the "letter as invitation" thesis — multi-chapter ceremony details
 * (learned from Anvaya's guest-segmented, per-ceremony model), an event
 * countdown with add-to-calendar, and an RSVP interaction. */
export function WeddingReading({ accentFrom, accentTo, onComplete }: WeddingReadingProps) {
  const intro = scene({ id: 'intro', heading: 'We’re getting married.', body: 'And we want you there for every bit of it — not just the big day.' })

  const pages = [
    <LetterPageContent key="intro" scene={intro} index={0} total={6} accentFrom={accentFrom} accentTo={accentTo} />,
    <div key="mehendi" className="h-full flex items-center justify-center">
      <InvitationDetails eventName="Mehendi" date="Fri, 4 Sep" time="4:00 PM" venue="The Fern Lawns" dressCode="Yellow & green" accentFrom={accentFrom} />
    </div>,
    <div key="sangeet" className="h-full flex items-center justify-center">
      <InvitationDetails eventName="Sangeet" date="Sat, 5 Sep" time="7:00 PM" venue="Taj Ballroom" dressCode="Festive, sequins encouraged" accentFrom={accentFrom} />
    </div>,
    <div key="wedding" className="h-full flex items-center justify-center">
      <InvitationDetails eventName="Wedding Ceremony" date="Sun, 6 Sep" time="10:00 AM" venue="Grand Mandap, Taj Lawns" dressCode="Traditional" mapUrl="https://maps.google.com" accentFrom={accentFrom} />
    </div>,
    <div key="countdown" className="h-full flex items-center justify-center">
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
    </div>,
    <div key="rsvp" className="h-full flex items-center justify-center">
      <RSVP accentFrom={accentFrom} accentTo={accentTo} />
    </div>,
  ]

  return <SimplePager pages={pages} onComplete={onComplete} />
}
