'use client'
import { useRef, useState } from 'react'
import { LetterGate } from '@/components/reveal/LetterGate'
import { LetterPages } from '@/components/reveal/LetterPages'
import { ClosingRitual } from '@/components/reveal/ClosingRitual'
import { EndingScreen } from '@/components/reveal/EndingScreen'
import { getMusicTrack } from '@/lib/music'
import { OCCASION_META } from '@/lib/occasions'
import type { Scene, OccasionType } from '@/lib/types'

interface CardExperienceProps {
  slug: string
  senderName: string
  recipientName?: string
  occasion: OccasionType
  scenes: Scene[]
  musicTrackId: string | null
}

type Stage = 'gate' | 'reading' | 'closing' | 'ending'

/** Orchestrates the recipient's full journey once the card data is available (open, or unlocked via a gate). */
export function CardExperience({ slug, senderName, recipientName, occasion, scenes, musicTrackId }: CardExperienceProps) {
  const [stage, setStage] = useState<Stage>('gate')
  const audioRef = useRef<HTMLAudioElement>(null)
  const meta = OCCASION_META[occasion]
  const track = getMusicTrack(musicTrackId)

  const begin = () => {
    audioRef.current?.play().catch(() => {}) // must be called synchronously from the tap/drag handler for iOS
    setStage('reading')
  }

  const watchAgain = () => setStage('reading')

  return (
    <>
      {track && <audio ref={audioRef} src={track.fileUrl} loop preload="auto" />}

      {stage === 'gate' && (
        <LetterGate
          senderName={senderName}
          recipientName={recipientName}
          accentFrom={meta.accentFrom}
          accentTo={meta.accentTo}
          onBegin={begin}
        />
      )}

      {stage === 'reading' && (
        <LetterPages
          scenes={scenes}
          senderName={senderName}
          recipientName={recipientName}
          accentFrom={meta.accentFrom}
          accentTo={meta.accentTo}
          onComplete={() => { audioRef.current?.pause(); setStage('closing') }}
        />
      )}

      {stage === 'closing' && (
        <ClosingRitual
          slug={slug}
          senderName={senderName}
          accentFrom={meta.accentFrom}
          accentTo={meta.accentTo}
          onContinue={() => setStage('ending')}
        />
      )}

      {stage === 'ending' && (
        <EndingScreen slug={slug} senderName={senderName} recipientName={recipientName} onWatchAgain={watchAgain} />
      )}
    </>
  )
}
