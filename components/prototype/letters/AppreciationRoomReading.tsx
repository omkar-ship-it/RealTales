'use client'
import { useState } from 'react'
import { Frame, Images, Image as ImageIcon, Music, StickyNote, Wallet } from 'lucide-react'
import { RoomReveal, type RoomHotspot } from '../RoomReveal'
import { VoiceNotePage } from '../VoiceNotePage'
import { ScratchReveal } from '../gestures/ScratchReveal'
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

/** A stylized "photographed keepsake" mockup — paper texture, slight rotation, a
 * drop shadow like something laid on a table and shot from above — not a real
 * photo (no image-generation tool available, and there's no genuine keepsake to
 * photograph for a fictional demo letter), but honestly presented as a digital
 * mockup rather than claiming to be more than it is. In the real product this
 * would be a sender-uploaded photo of an actual keepsake. */
function SurpriseCard() {
  return (
    <div className="pt-9 px-7 pb-6 text-center">
      <div
        className="mx-auto w-44 bg-white p-3 pb-5 mb-5"
        style={{ transform: 'rotate(-4deg)', boxShadow: '0 10px 24px rgba(0,0,0,0.28)' }}
      >
        <div className="paper-grain bg-[#F3EDDD] px-3 py-4 text-left border border-black/5">
          <p className="font-hand text-base text-[#3B2F2F] leading-snug">
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
 * The walking-sim experiment — identical content to `AppreciationReading`,
 * restructured from a linear scroll into seven discoverable objects in one
 * room, so any difference in how it feels is attributable to the mechanic
 * (tap-to-explore vs. linear scroll), not the material. Two beats specifically
 * use a *meaningful* gesture rather than a plain tap: the surprise keepsake is
 * scratch-revealed (the gesture means "uncovering something hidden," same
 * reasoning as Birthday's scratch-reveal), and the peak is held-to-reveal in
 * `RoomReveal` itself (the gesture means "steadfast commitment," matching what
 * the line actually says).
 */
export function AppreciationRoomReading({ letter, onComplete, onVoicePlayingChange }: AppreciationRoomReadingProps) {
  const { accentFrom, accentTo, senderName } = letter

  const hotspots: RoomHotspot[] = [
    {
      id: 'frame',
      label: 'A photo frame',
      icon: Frame,
      x: 20,
      y: 22,
      depth: 2,
      render: () => <PhotoCard src="/images/appreciation/her-warmth.jpg" caption="This is the face I still look for first in any room." />,
    },
    {
      id: 'stack',
      label: 'A stack of photos',
      icon: Images,
      x: 78,
      y: 24,
      depth: 2,
      render: () => <PhotoStackCard />,
    },
    {
      id: 'surprise',
      label: 'A worn keepsake',
      icon: Wallet,
      x: 50,
      y: 42,
      depth: 2.5,
      render: () => (
        <div className="h-[480px]">
          <ScratchReveal label="Scratch to see what he kept" accentFrom={accentFrom} accentTo={accentTo}>
            <div className="paper-grain w-full h-full overflow-y-auto bg-[#FBF6EC]">
              <SurpriseCard />
            </div>
          </ScratchReveal>
        </div>
      ),
    },
    {
      id: 'note1',
      label: 'A folded note',
      icon: StickyNote,
      x: 24,
      y: 62,
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
      x: 76,
      y: 64,
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
      x: 50,
      y: 80,
      depth: 2.5,
      render: () => <PhotoCard src="/images/appreciation/ordinary-tuesdays.jpg" caption="The scuff marks from a thousand ordinary Tuesdays, right there on the floor." />,
    },
    {
      id: 'music-box',
      label: 'A music box',
      icon: Music,
      hidden: true,
      x: 90,
      y: 50,
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
