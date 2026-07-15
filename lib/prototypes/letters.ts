export interface LabLetter {
  slug: string
  title: string
  tests: string
  senderName: string
  recipientName: string
  accentFrom: string
  accentTo: string
  musicTrackId: string
}

export const LAB_LETTERS: LabLetter[] = [
  { slug: 'anniversary', title: 'Anniversary Letter', tests: 'Scrollytelling — milestone timeline + photo gallery + pinned proposal peak', senderName: 'Priya', recipientName: 'Rohan', accentFrom: '#9D2F52', accentTo: '#6B1D38', musicTrackId: 'warm-strings' },
  { slug: 'birthday', title: 'Birthday Letter', tests: 'Scrollytelling — party gallery + pinned scratch-reveal surprise', senderName: 'Aditi', recipientName: 'Kabir', accentFrom: '#F5A623', accentTo: '#E07A1F', musicTrackId: 'upbeat-celebration' },
  { slug: 'wedding', title: 'Wedding Invitation', tests: 'Scrollytelling — ceremony gallery + pinned countdown + RSVP', senderName: 'Shiva & Shakti', recipientName: 'Omkar', accentFrom: '#C9A05C', accentTo: '#8C6F32', musicTrackId: 'romantic-piano' },
  { slug: 'thankyou', title: 'Thank You Letter', tests: 'Scrollytelling — pinned quote peak', senderName: 'Meera', recipientName: 'Arjun', accentFrom: '#E8557A', accentTo: '#B33355', musicTrackId: 'grateful-ukulele' },
  { slug: 'valentine', title: "Valentine's Proposal", tests: 'Scrollytelling — gyroscope depth + voice note + pinned hold-to-reveal', senderName: 'Dev', recipientName: 'Ananya', accentFrom: '#D14D72', accentTo: '#8C2F52', musicTrackId: 'dreamy-love' },
  { slug: 'housewarming', title: 'Housewarming Invitation', tests: 'Scrollytelling — room gallery + invitation/calendar beat', senderName: 'Nikhil & Sara', recipientName: 'Friends', accentFrom: '#C97C5D', accentTo: '#8A5A3D', musicTrackId: 'upbeat-celebration' },
  { slug: 'friend', title: 'Letter to a Friend', tests: 'Scrollytelling — voice-first + pinned inside-joke reveal', senderName: 'Zara', recipientName: 'Ishaan', accentFrom: '#2E8F8F', accentTo: '#1D6363', musicTrackId: 'grateful-ukulele' },
  { slug: 'trip', title: 'Trip Memory Letter', tests: 'Scrollytelling — horizontal photo gallery + pinned best-moment peak', senderName: 'The Squad', recipientName: 'You', accentFrom: '#2E8F8F', accentTo: '#1D6363', musicTrackId: 'adventure-acoustic' },
  { slug: 'appreciation', title: 'Appreciation Letter', tests: 'Scrollytelling — husband-to-wife, text/photo mix + pinned devotion peak', senderName: 'Rahul', recipientName: 'Simran', accentFrom: '#A8456B', accentTo: '#5C2340', musicTrackId: 'heartfelt-sweet' },
]

export function getLabLetter(slug: string): LabLetter | undefined {
  return LAB_LETTERS.find(l => l.slug === slug)
}
