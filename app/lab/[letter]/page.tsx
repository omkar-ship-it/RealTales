'use client'
import { use, useRef, useState } from 'react'
import Link from 'next/link'
import { getLabLetter, type LabLetter } from '@/lib/prototypes/letters'
import { getMusicTrack } from '@/lib/music'
import { LetterGate } from '@/components/reveal/LetterGate'
import { ClosingRitual } from '@/components/reveal/ClosingRitual'
import { EndingScreen } from '@/components/reveal/EndingScreen'
import { AnniversaryReading } from '@/components/prototype/letters/AnniversaryReading'
import { BirthdayReading } from '@/components/prototype/letters/BirthdayReading'
import { WeddingReading } from '@/components/prototype/letters/WeddingReading'
import { ThankYouReading } from '@/components/prototype/letters/ThankYouReading'
import { ValentineReading } from '@/components/prototype/letters/ValentineReading'
import { HousewarmingReading } from '@/components/prototype/letters/HousewarmingReading'
import { FriendReading } from '@/components/prototype/letters/FriendReading'
import { TripReading } from '@/components/prototype/letters/TripReading'
import { AppreciationReading } from '@/components/prototype/letters/AppreciationReading'
import { AppreciationRoomReading } from '@/components/prototype/letters/AppreciationRoomReading'

type Stage = 'gate' | 'reading' | 'closing' | 'ending'

export default function LabLetterPage({ params }: { params: Promise<{ letter: string }> }) {
  const { letter: routeSlug } = use(params)
  const letter = getLabLetter(routeSlug)
  const [stage, setStage] = useState<Stage>('gate')
  const audioRef = useRef<HTMLAudioElement>(null)

  if (!letter) {
    return (
      <div className="min-h-screen bg-[#120E0A] text-white flex flex-col items-center justify-center gap-4 px-8 text-center">
        <p className="font-display italic text-2xl">No prototype called “{routeSlug}”.</p>
        <Link href="/lab" className="text-sm text-[#D9A441] underline underline-offset-2">← Back to the lab</Link>
      </div>
    )
  }

  const slug = `lab-${letter.slug}`
  const track = getMusicTrack(letter.musicTrackId)
  const handleGateBegin = () => {
    audioRef.current?.play().catch(() => {}) // must be called synchronously from the tap handler for iOS
    setStage('reading')
  }
  const handleWatchAgain = () => {
    audioRef.current?.play().catch(() => {})
    setStage('reading')
  }
  // Ducks the background track while a voice note speaks — the two competing
  // for attention undercuts both. Only resumes if still on the reading stage,
  // so a voice note that's still playing when the letter completes doesn't
  // fight the ending screen for control of the audio element.
  const handleVoicePlayingChange = (playing: boolean) => {
    if (playing) audioRef.current?.pause()
    else if (stage === 'reading') audioRef.current?.play().catch(() => {})
  }

  return (
    <>
      {track && <audio ref={audioRef} src={track.fileUrl} loop preload="auto" />}

      {stage === 'gate' && (
        <LetterGate
          senderName={letter.senderName}
          recipientName={letter.recipientName}
          accentFrom={letter.accentFrom}
          accentTo={letter.accentTo}
          onBegin={handleGateBegin}
        />
      )}

      {stage === 'reading' && (
        <ReadingFor
          letter={letter}
          onComplete={() => { audioRef.current?.pause(); setStage('closing') }}
          onVoicePlayingChange={handleVoicePlayingChange}
        />
      )}

      {stage === 'closing' && (
        <ClosingRitual
          slug={slug}
          senderName={letter.senderName}
          accentFrom={letter.accentFrom}
          accentTo={letter.accentTo}
          onContinue={() => setStage('ending')}
        />
      )}

      {stage === 'ending' && (
        <EndingScreen
          slug={slug}
          senderName={letter.senderName}
          recipientName={letter.recipientName}
          onWatchAgain={handleWatchAgain}
        />
      )}
    </>
  )
}

function ReadingFor({ letter, onComplete, onVoicePlayingChange }: { letter: LabLetter; onComplete: () => void; onVoicePlayingChange?: (playing: boolean) => void }) {
  switch (letter.slug) {
    case 'anniversary':
      return <AnniversaryReading letter={letter} onComplete={onComplete} />
    case 'birthday':
      return <BirthdayReading letter={letter} onComplete={onComplete} />
    case 'wedding':
      return <WeddingReading letter={letter} onComplete={onComplete} />
    case 'thankyou':
      return <ThankYouReading letter={letter} onComplete={onComplete} />
    case 'valentine':
      return <ValentineReading letter={letter} onComplete={onComplete} />
    case 'housewarming':
      return <HousewarmingReading letter={letter} onComplete={onComplete} />
    case 'friend':
      return <FriendReading letter={letter} onComplete={onComplete} />
    case 'trip':
      return <TripReading letter={letter} onComplete={onComplete} />
    case 'appreciation':
      return <AppreciationReading letter={letter} onComplete={onComplete} onVoicePlayingChange={onVoicePlayingChange} />
    case 'appreciation-room':
      return <AppreciationRoomReading letter={letter} onComplete={onComplete} onVoicePlayingChange={onVoicePlayingChange} />
    default:
      return null
  }
}
