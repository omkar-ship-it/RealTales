'use client'
import { LetterPageContent } from '@/components/reveal/LetterPageContent'
import { InvitationDetails } from '../InvitationDetails'
import { EventCountdown } from '../EventCountdown'
import { SimplePager } from '../SimplePager'
import { googleCalendarUrl } from '@/lib/calendar-link'
import type { Scene } from '@/lib/types'

interface HousewarmingReadingProps {
  accentFrom: string
  accentTo: string
  onComplete: () => void
}

function scene(partial: Partial<Scene> & { id: string }): Scene {
  return { layout: 'text-only', transition: 'fade', durationMs: 4000, ...partial }
}

const PARTY_DATE = new Date(Date.now() + 1000 * 60 * 60 * 24 * 12).toISOString()

/** Tests: a *light* invitation pattern — single event, map + calendar, no
 * RSVP/multi-chapter complexity — deliberate contrast with Wedding's heavy stack. */
export function HousewarmingReading({ accentFrom, accentTo, onComplete }: HousewarmingReadingProps) {
  const intro = scene({ id: 'intro', heading: 'Come see our new home.', body: 'The walls are still bare, but the welcome is real. Bring your appetite.' })

  const pages = [
    <LetterPageContent key="intro" scene={intro} index={0} total={3} accentFrom={accentFrom} accentTo={accentTo} />,
    <div key="details" className="h-full flex items-center justify-center">
      <InvitationDetails eventName="Housewarming" date="Sat, 22 Aug" time="6:00 PM onward" venue="B-402, Willow Residency" mapUrl="https://maps.google.com" accentFrom={accentFrom} />
    </div>,
    <div key="countdown" className="h-full flex items-center justify-center">
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
    </div>,
  ]

  return <SimplePager pages={pages} onComplete={onComplete} />
}
