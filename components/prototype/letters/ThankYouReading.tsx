'use client'
import { LetterPages } from '@/components/reveal/LetterPages'
import type { Scene } from '@/lib/types'

interface ThankYouReadingProps {
  senderName: string
  recipientName: string
  accentFrom: string
  accentTo: string
  onComplete: () => void
}

function scene(partial: Partial<Scene> & { id: string }): Scene {
  return { layout: 'text-only', transition: 'fade', durationMs: 4000, ...partial }
}

/** Control / baseline — today's live page-turn model, unmodified, so the
 * scrollytelling prototypes (Anniversary, Trip Memory) can be judged against
 * something familiar rather than against each other in a vacuum. */
export function ThankYouReading({ senderName, recipientName, accentFrom, accentTo, onComplete }: ThankYouReadingProps) {
  const scenes: Scene[] = [
    scene({ id: 't1', heading: 'What you did mattered.', body: 'It would have been easy to look away. You didn’t.' }),
    scene({ id: 't2', layout: 'quote', body: 'Some acts of kindness stay with people. This is one of them.' }),
    scene({ id: 't3', heading: 'Thank you, truly.', body: 'From all of us who noticed, even if we didn’t say it at the time.' }),
  ]

  return (
    <LetterPages
      scenes={scenes}
      senderName={senderName}
      recipientName={recipientName}
      accentFrom={accentFrom}
      accentTo={accentTo}
      onComplete={onComplete}
    />
  )
}
