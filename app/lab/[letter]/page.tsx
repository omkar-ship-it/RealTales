'use client'
import { use, useState } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { getLabLetter, type LabLetter } from '@/lib/prototypes/letters'
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

// Lazy-loaded, never blocks the static gate's first paint — prefetches while the
// recipient is still reading the gate and deciding whether to tap.
const WebGLEnvelope = dynamic(() => import('@/components/prototype/WebGLEnvelope').then(m => m.WebGLEnvelope), { ssr: false })

type Stage = 'gate' | 'opening' | 'reading' | 'closing' | 'ending'

export default function LabLetterPage({ params }: { params: Promise<{ letter: string }> }) {
  const { letter: routeSlug } = use(params)
  const letter = getLabLetter(routeSlug)
  const [stage, setStage] = useState<Stage>('gate')

  if (!letter) {
    return (
      <div className="min-h-screen bg-[#120E0A] text-white flex flex-col items-center justify-center gap-4 px-8 text-center">
        <p className="font-display italic text-2xl">No prototype called “{routeSlug}”.</p>
        <Link href="/lab" className="text-sm text-[#D9A441] underline underline-offset-2">← Back to the lab</Link>
      </div>
    )
  }

  const slug = `lab-${letter.slug}`
  const handleGateBegin = () => setStage(letter.gate === 'webgl' ? 'opening' : 'reading')

  return (
    <>
      {stage === 'gate' && (
        <LetterGate
          senderName={letter.senderName}
          recipientName={letter.recipientName}
          accentFrom={letter.accentFrom}
          accentTo={letter.accentTo}
          onBegin={handleGateBegin}
        />
      )}

      {stage === 'opening' && (
        <WebGLEnvelope accentFrom={letter.accentFrom} accentTo={letter.accentTo} onComplete={() => setStage('reading')} />
      )}

      {stage === 'reading' && <ReadingFor letter={letter} onComplete={() => setStage('closing')} />}

      {stage === 'closing' && <ClosingRitual slug={slug} onContinue={() => setStage('ending')} />}

      {stage === 'ending' && (
        <EndingScreen
          slug={slug}
          senderName={letter.senderName}
          recipientName={letter.recipientName}
          onWatchAgain={() => setStage('reading')}
        />
      )}
    </>
  )
}

function ReadingFor({ letter, onComplete }: { letter: LabLetter; onComplete: () => void }) {
  switch (letter.slug) {
    case 'anniversary':
      return <AnniversaryReading accentFrom={letter.accentFrom} accentTo={letter.accentTo} onComplete={onComplete} />
    case 'birthday':
      return <BirthdayReading accentFrom={letter.accentFrom} accentTo={letter.accentTo} onComplete={onComplete} />
    case 'wedding':
      return <WeddingReading accentFrom={letter.accentFrom} accentTo={letter.accentTo} onComplete={onComplete} />
    case 'thankyou':
      return (
        <ThankYouReading
          senderName={letter.senderName}
          recipientName={letter.recipientName}
          accentFrom={letter.accentFrom}
          accentTo={letter.accentTo}
          onComplete={onComplete}
        />
      )
    case 'valentine':
      return <ValentineReading senderName={letter.senderName} accentFrom={letter.accentFrom} accentTo={letter.accentTo} onComplete={onComplete} />
    case 'housewarming':
      return <HousewarmingReading accentFrom={letter.accentFrom} accentTo={letter.accentTo} onComplete={onComplete} />
    case 'friend':
      return <FriendReading senderName={letter.senderName} accentFrom={letter.accentFrom} accentTo={letter.accentTo} onComplete={onComplete} />
    case 'trip':
      return <TripReading accentFrom={letter.accentFrom} accentTo={letter.accentTo} onComplete={onComplete} />
    default:
      return null
  }
}
