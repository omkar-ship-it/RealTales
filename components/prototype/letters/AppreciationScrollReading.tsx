'use client'
import { useState } from 'react'
import { ParchmentReveal, type ParchmentSection } from '../ParchmentReveal'
import { VoiceNotePage } from '../VoiceNotePage'
import { ScratchReveal } from '../gestures/ScratchReveal'
import type { LabLetter } from '@/lib/prototypes/letters'

interface AppreciationScrollReadingProps {
  letter: LabLetter
  onComplete: () => void
  onVoicePlayingChange?: (playing: boolean) => void
}

const GALLERY_PHOTOS = [
  { src: '/images/appreciation/quiet-together.jpg', caption: 'Some nights we just stand outside and look up. That’s enough.' },
  { src: '/images/appreciation/the-path.jpg', caption: 'Not every walk needs a destination. Some just need you next to me.' },
  { src: '/images/appreciation/worn-smooth.jpg', caption: 'Smooth, steady, worn soft by years of the same water. That’s us too.' },
  { src: '/images/appreciation/steady-tide.jpg', caption: 'Some days are calm, some days aren’t. You’re steady through both.' },
]

function PhotoStackCard() {
  const [i, setI] = useState(0)
  const photo = GALLERY_PHOTOS[i]
  return (
    <div className="text-center">
      <div className="w-full aspect-[4/3] overflow-hidden shadow-lg mb-4" style={{ transform: 'rotate(1deg)' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={photo.src} alt="" className="w-full h-full object-cover" />
      </div>
      <p className="font-hand text-lg text-[#3B2F2F] leading-snug mb-4">{photo.caption}</p>
      <button
        type="button"
        onClick={() => setI((i + 1) % GALLERY_PHOTOS.length)}
        className="text-xs font-semibold uppercase tracking-wide text-[#8B7E68] underline underline-offset-2"
      >
        Next photo ({i + 1} of {GALLERY_PHOTOS.length})
      </button>
    </div>
  )
}

/** Same honest-mockup reasoning as the room mode's surprise beat — no
 * image-generation tool available and no genuine keepsake to photograph for a
 * fictional letter, so this is styled as a photographed object rather than
 * claiming to be a real photo. */
function SurpriseCard() {
  return (
    <div className="text-center">
      <div
        className="mx-auto w-40 bg-white p-3 pb-5 mb-5"
        style={{ transform: 'rotate(-4deg)', boxShadow: '0 10px 22px rgba(0,0,0,0.25)' }}
      >
        <div className="bg-[#F3EDDD] px-3 py-4 text-left border border-black/5">
          <p className="font-hand text-sm text-[#3B2F2F] leading-snug">
            Table for two
            <br />7:45 PM
            <br />2 coffees, 1 slice
            <br />— keep forever —
          </p>
        </div>
      </div>
      <p className="font-display italic text-xl text-[#2B2140] mb-2">There’s something you don’t know I still have.</p>
      <p className="font-hand text-lg text-[#3B2F2F] leading-relaxed">The receipt from our first date — creased, faded, still in my wallet. I never told you. Some things you just… keep.</p>
    </div>
  )
}

/**
 * The scroll experiment — same content as `AppreciationReading`/
 * `AppreciationRoomReading`, a third instance of the same controlled A/B
 * methodology, now testing a parchment-and-dowel visual metaphor over plain
 * scroll rather than a new interaction model.
 */
export function AppreciationScrollReading({ letter, onComplete, onVoicePlayingChange }: AppreciationScrollReadingProps) {
  const { accentFrom, accentTo, senderName } = letter

  const sections: ParchmentSection[] = [
    { id: 'unasked', kind: 'text', eyebrow: 'Just because', heading: 'You never asked for gratitude. That’s exactly why you deserve it.', body: 'For every quiet thing you carry so effortlessly that I almost forget to notice it — until I do.' },
    { id: 'photo1', kind: 'photo', imageUrl: '/images/appreciation/her-warmth.jpg', caption: 'This is the face I still look for first in any room.' },
    { id: 'hard-days', kind: 'text', eyebrow: 'The hard days', heading: 'You show up even when no one’s watching.', body: 'I’ve seen you hold everything together on the days you thought you had nothing left to give.' },
    { id: 'sunday', kind: 'text', eyebrow: 'Sunday mornings', heading: 'The world hasn’t started yet, and it’s just us.', body: 'Slow coffee, no plans, your feet in my lap. I never want to rush this part.' },
    { id: 'moments', kind: 'custom', render: () => <PhotoStackCard /> },
    { id: 'small-things', kind: 'text', eyebrow: 'The small things', heading: 'Coffee made just the way I like it. A text at exactly the right moment.', body: 'Love isn’t the big gestures — it’s you, remembering, every single day.' },
    {
      id: 'surprise',
      kind: 'custom',
      render: () => (
        <div className="h-[440px]">
          <ScratchReveal label="Scratch to see what he kept" accentFrom={accentFrom} accentTo={accentTo}>
            <div className="w-full h-full overflow-y-auto bg-[#FBF6EC] flex items-center px-2">
              <SurpriseCard />
            </div>
          </ScratchReveal>
        </div>
      ),
    },
    {
      id: 'message',
      kind: 'custom',
      render: () => (
        <div className="h-[400px]">
          <VoiceNotePage
            text="I don't say this enough, so I'm saying it now. Thank you — for everything you carry without being asked, for staying even when it's hard, for still choosing us every single day. I see it. I see you."
            speakerLabel={senderName ? `From ${senderName}` : 'A voice note'}
            accentFrom={accentFrom}
            accentTo={accentTo}
            onPlayingChange={onVoicePlayingChange}
          />
        </div>
      ),
    },
    { id: 'photo2', kind: 'photo', imageUrl: '/images/appreciation/ordinary-tuesdays.jpg', caption: 'The scuff marks from a thousand ordinary Tuesdays, right there on the floor.' },
  ]

  return (
    <ParchmentReveal
      sections={sections}
      accentFrom={accentFrom}
      accentTo={accentTo}
      peakEyebrow="Still, always"
      peakLine="I’d choose this — choose you — every single time. Thank you for being my person."
      signatureLine={`— ${senderName || 'Me'}`}
      onComplete={onComplete}
    />
  )
}
