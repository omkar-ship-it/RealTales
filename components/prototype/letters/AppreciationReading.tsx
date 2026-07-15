'use client'
import { ScrollytellingReel, PeakLine, type ScrollySection } from '../ScrollytellingReel'
import type { LabLetter } from '@/lib/prototypes/letters'

interface AppreciationReadingProps {
  letter: LabLetter
  onComplete: () => void
  onVoicePlayingChange?: (playing: boolean) => void
}

/**
 * The deep-build showcase letter for the "crack scrollytelling" pass — full
 * arc (7 beats longer than the other 8 letters), real curated photography
 * instead of abstract keepsake cards, a voice beat, and the peak given extra
 * dwell time (`holdVh`) instead of the shared default.
 *
 * Images: `public/images/appreciation/*.jpg`, sourced via Lorem Picsum (which
 * pulls from real photographers' work, free to use, no attribution required).
 * Picsum has no keyword search — random seeds returned an office desk and a
 * foggy soccer field before these were hand-picked. None of them are literally
 * "this couple"; captions are written to honestly match what's actually in
 * each photo (a mood/metaphor), not to claim a specific memory that isn't
 * pictured — the same reasoning that kept the original KeepsakeMoment
 * abstraction from using misleading stock photos of strangers.
 */
export function AppreciationReading({ letter, onComplete, onVoicePlayingChange }: AppreciationReadingProps) {
  const { accentFrom, accentTo, senderName } = letter

  const sections: ScrollySection[] = [
    { id: 'unasked', kind: 'text', eyebrow: 'Just because', heading: 'You never asked for gratitude. That’s exactly why you deserve it.', body: 'For every quiet thing you carry so effortlessly that I almost forget to notice it — until I do.' },
    { id: 'photo1', kind: 'photo', imageUrl: '/images/appreciation/her-warmth.jpg', caption: 'This is the face I still look for first in any room.' },
    { id: 'hard-days', kind: 'text', eyebrow: 'The hard days', heading: 'You show up even when no one’s watching.', body: 'I’ve seen you hold everything together on the days you thought you had nothing left to give.' },
    { id: 'sunday', kind: 'text', eyebrow: 'Sunday mornings', heading: 'The world hasn’t started yet, and it’s just us.', body: 'Slow coffee, no plans, your feet in my lap. I never want to rush this part.' },
    {
      id: 'moments',
      kind: 'gallery',
      items: [
        { imageUrl: '/images/appreciation/quiet-together.jpg', caption: 'Some nights we just stand outside and look up. That’s enough.' },
        { imageUrl: '/images/appreciation/the-path.jpg', caption: 'Not every walk needs a destination. Some just need you next to me.' },
        { imageUrl: '/images/appreciation/worn-smooth.jpg', caption: 'Smooth, steady, worn soft by years of the same water. That’s us too.' },
        { imageUrl: '/images/appreciation/steady-tide.jpg', caption: 'Some days are calm, some days aren’t. You’re steady through both.' },
      ],
    },
    { id: 'small-things', kind: 'text', eyebrow: 'The small things', heading: 'Coffee made just the way I like it. A text at exactly the right moment.', body: 'Love isn’t the big gestures — it’s you, remembering, every single day.' },
    {
      id: 'message',
      kind: 'voice',
      speakerLabel: senderName ? `From ${senderName}` : 'A voice note',
      text: `I don't say this enough, so I'm saying it now. Thank you — for everything you carry without being asked, for staying even when it's hard, for still choosing us every single day. I see it. I see you.`,
    },
    { id: 'photo2', kind: 'photo', imageUrl: '/images/appreciation/ordinary-tuesdays.jpg', caption: 'The scuff marks from a thousand ordinary Tuesdays, right there on the floor.' },
    {
      id: 'still',
      kind: 'pinned-hero',
      holdVh: 260,
      render: () => <PeakLine eyebrow="Still, always" line="I’d choose this — choose you — every single time. Thank you for being my person." accentFrom={accentFrom} />,
    },
    { id: 'signed', kind: 'text', eyebrow: 'With everything I have', heading: `— ${senderName || 'Me'}`, body: 'Today, and every day after this one.' },
  ]

  return (
    <ScrollytellingReel
      sections={sections}
      accentFrom={accentFrom}
      accentTo={accentTo}
      onComplete={onComplete}
      onVoicePlayingChange={onVoicePlayingChange}
    />
  )
}
