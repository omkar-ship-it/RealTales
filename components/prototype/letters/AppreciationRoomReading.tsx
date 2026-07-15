'use client'
import { useState } from 'react'
import { Frame, Images, Image as ImageIcon, Music, StickyNote } from 'lucide-react'
import { RoomReveal, type RoomHotspot } from '../RoomReveal'
import { VoiceNotePage } from '../VoiceNotePage'
import type { LabLetter } from '@/lib/prototypes/letters'

interface AppreciationRoomReadingProps {
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

function PhotoCard({ src, caption }: { src: string; caption: string }) {
  return (
    <div className="pt-9 px-6 pb-2 text-center">
      <div className="w-full aspect-[4/3] rounded-xl overflow-hidden shadow-lg mb-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt="" className="w-full h-full object-cover" />
      </div>
      <p className="font-hand text-lg text-[#3B2F2F] leading-snug">{caption}</p>
    </div>
  )
}

function PhotoStackCard() {
  const [i, setI] = useState(0)
  const photo = GALLERY_PHOTOS[i]
  return (
    <div className="pt-9 px-6 pb-6 text-center">
      <div className="w-full aspect-[4/3] rounded-xl overflow-hidden shadow-lg mb-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={photo.src} alt="" className="w-full h-full object-cover" />
      </div>
      <p className="font-hand text-lg text-[#3B2F2F] leading-snug mb-5">{photo.caption}</p>
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

function NoteCard({ passages }: { passages: Array<{ heading: string; body: string }> }) {
  return (
    <div className="pt-9 px-7 pb-6">
      {passages.map((p, i) => (
        <div key={i} className={i > 0 ? 'mt-5' : undefined}>
          <p className="font-display italic text-xl text-[#2B2140] mb-2">{p.heading}</p>
          <p className="font-hand text-lg text-[#3B2F2F] leading-relaxed">{p.body}</p>
        </div>
      ))}
    </div>
  )
}

/**
 * The walking-sim experiment — identical content to `AppreciationReading`,
 * restructured from a linear scroll into six discoverable objects in one
 * room, so any difference in how it feels is attributable to the mechanic
 * (tap-to-explore vs. linear scroll), not the material.
 */
export function AppreciationRoomReading({ letter, onComplete, onVoicePlayingChange }: AppreciationRoomReadingProps) {
  const { accentFrom, accentTo, senderName } = letter

  const hotspots: RoomHotspot[] = [
    {
      id: 'frame',
      label: 'A photo frame',
      icon: Frame,
      x: 25,
      y: 26,
      depth: 2,
      render: () => <PhotoCard src="/images/appreciation/her-warmth.jpg" caption="This is the face I still look for first in any room." />,
    },
    {
      id: 'stack',
      label: 'A stack of photos',
      icon: Images,
      x: 74,
      y: 30,
      depth: 2,
      render: () => <PhotoStackCard />,
    },
    {
      id: 'note1',
      label: 'A folded note',
      icon: StickyNote,
      x: 36,
      y: 68,
      depth: 3,
      render: () => (
        <NoteCard
          passages={[
            { heading: 'You never asked for gratitude. That’s exactly why you deserve it.', body: 'For every quiet thing you carry so effortlessly that I almost forget to notice it — until I do.' },
            { heading: 'You show up even when no one’s watching.', body: 'I’ve seen you hold everything together on the days you thought you had nothing left to give.' },
          ]}
        />
      ),
    },
    {
      id: 'note2',
      label: 'Another note',
      icon: StickyNote,
      x: 63,
      y: 74,
      depth: 3,
      render: () => (
        <NoteCard
          passages={[
            { heading: 'The world hasn’t started yet, and it’s just us.', body: 'Slow coffee, no plans, your feet in my lap. I never want to rush this part.' },
            { heading: 'Coffee made just the way I like it. A text at exactly the right moment.', body: 'Love isn’t the big gestures — it’s you, remembering, every single day.' },
          ]}
        />
      ),
    },
    {
      id: 'old-photo',
      label: 'An old photo',
      icon: ImageIcon,
      x: 16,
      y: 56,
      depth: 2.5,
      render: () => <PhotoCard src="/images/appreciation/ordinary-tuesdays.jpg" caption="The scuff marks from a thousand ordinary Tuesdays, right there on the floor." />,
    },
    {
      id: 'music-box',
      label: 'A music box',
      icon: Music,
      hidden: true,
      x: 86,
      y: 63,
      depth: 1.5,
      render: () => (
        <div className="h-[420px] pt-2">
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
  ]

  return (
    <RoomReveal
      hotspots={hotspots}
      accentFrom={accentFrom}
      accentTo={accentTo}
      peakEyebrow="Still, always"
      peakLine="I’d choose this — choose you — every single time. Thank you for being my person."
      onComplete={onComplete}
    />
  )
}
