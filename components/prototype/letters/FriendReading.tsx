'use client'
import { ScrollytellingReel, type ScrollySection } from '../ScrollytellingReel'
import { LetterPageContent } from '@/components/reveal/LetterPageContent'
import { HoldToReveal } from '../gestures/HoldToReveal'
import type { LabLetter } from '@/lib/prototypes/letters'
import type { Scene } from '@/lib/types'

interface FriendReadingProps {
  letter: LabLetter
  onComplete: () => void
}

function scene(partial: Partial<Scene> & { id: string }): Scene {
  return { layout: 'text-only', transition: 'fade', durationMs: 4000, ...partial }
}

/** Voice as the *primary* content type, not a single peak moment — most of
 * this letter is voice notes, casual and rambling, closer to a WhatsApp
 * voice-note thread than a formal letter. Hold-to-reveal on the inside joke
 * is the one pinned peak. */
export function FriendReading({ letter, onComplete }: FriendReadingProps) {
  const { accentFrom, accentTo, senderName } = letter
  const joke = scene({ id: 'joke', body: 'You know what I’m talking about. You’ll know it when you see it.' })

  const sections: ScrollySection[] = [
    { id: 'v1', kind: 'voice', text: "Okay so I know I never text back on time, but I've been meaning to say this properly.", speakerLabel: senderName ? `From ${senderName}` : 'Voice note 1' },
    { id: 'v2', kind: 'voice', text: "You're one of maybe three people who actually gets my sense of humor, and I don't say that lightly.", speakerLabel: 'Voice note 2' },
    {
      id: 'joke',
      kind: 'pinned-hero',
      render: () => (
        <HoldToReveal label="Hold for the inside joke">
          <LetterPageContent scene={joke} index={2} total={4} accentFrom={accentFrom} accentTo={accentTo} />
        </HoldToReveal>
      ),
    },
    { id: 'v3', kind: 'voice', text: 'Anyway. Thanks for being exactly who you are. Talk soon, actually soon this time.', speakerLabel: 'Voice note 3' },
  ]

  return <ScrollytellingReel sections={sections} accentFrom={accentFrom} accentTo={accentTo} onComplete={onComplete} />
}
