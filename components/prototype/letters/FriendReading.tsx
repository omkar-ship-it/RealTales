'use client'
import type { ReactNode } from 'react'
import { LetterPageContent } from '@/components/reveal/LetterPageContent'
import { VoiceNotePage } from '../VoiceNotePage'
import { HoldToReveal } from '../gestures/HoldToReveal'
import { SimplePager } from '../SimplePager'
import type { Scene } from '@/lib/types'

interface FriendReadingProps {
  senderName: string
  accentFrom: string
  accentTo: string
  onComplete: () => void
}

function scene(partial: Partial<Scene> & { id: string }): Scene {
  return { layout: 'text-only', transition: 'fade', durationMs: 4000, ...partial }
}

function paperWrap(node: ReactNode) {
  return <div className="paper-grain absolute inset-0 rounded-2xl bg-[#FBF6EC] shadow-2xl overflow-hidden">{node}</div>
}

/** Tests: voice as the *primary* content type, not a single peak moment — most
 * of this letter is voice notes, casual and rambling, closer to a WhatsApp
 * voice-note thread than a formal letter. */
export function FriendReading({ senderName, accentFrom, accentTo, onComplete }: FriendReadingProps) {
  const joke = scene({ id: 'joke', body: 'You know what I’m talking about. You’ll know it when you see it.' })

  const pages = [
    paperWrap(
      <VoiceNotePage
        key="v1"
        text="Okay so I know I never text back on time, but I've been meaning to say this properly."
        speakerLabel={senderName ? `From ${senderName}` : 'Voice note 1'}
        accentFrom={accentFrom}
        accentTo={accentTo}
      />,
    ),
    paperWrap(
      <VoiceNotePage
        key="v2"
        text="You're one of maybe three people who actually gets my sense of humor, and I don't say that lightly."
        speakerLabel="Voice note 2"
        accentFrom={accentFrom}
        accentTo={accentTo}
      />,
    ),
    <HoldToReveal key="joke" label="Hold for the inside joke">
      <LetterPageContent scene={joke} index={2} total={4} accentFrom={accentFrom} accentTo={accentTo} />
    </HoldToReveal>,
    paperWrap(
      <VoiceNotePage
        key="v3"
        text="Anyway. Thanks for being exactly who you are. Talk soon, actually soon this time."
        speakerLabel="Voice note 3"
        accentFrom={accentFrom}
        accentTo={accentTo}
      />,
    ),
  ]

  return <SimplePager pages={pages} onComplete={onComplete} />
}
