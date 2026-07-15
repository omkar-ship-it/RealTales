export interface LabLetter {
  slug: string
  title: string
  tests: string
  senderName: string
  recipientName: string
  accentFrom: string
  accentTo: string
  gate: 'webgl' | 'plain'
  musicTrackId: string
}

export const LAB_LETTERS: LabLetter[] = [
  { slug: 'anniversary', title: 'Anniversary Letter', tests: 'Scrollytelling — text/milestone timeline', senderName: 'Priya', recipientName: 'Rohan', accentFrom: '#9D2F52', accentTo: '#6B1D38', gate: 'plain', musicTrackId: 'warm-strings' },
  { slug: 'birthday', title: 'Birthday Letter', tests: 'WebGL envelope + scratch-reveal gesture', senderName: 'Aditi', recipientName: 'Kabir', accentFrom: '#F5A623', accentTo: '#E07A1F', gate: 'webgl', musicTrackId: 'upbeat-celebration' },
  { slug: 'wedding', title: 'Wedding Invitation', tests: 'Multi-chapter invitation + RSVP + countdown', senderName: 'Shiva & Shakti', recipientName: 'Omkar', accentFrom: '#C9A05C', accentTo: '#8C6F32', gate: 'plain', musicTrackId: 'warm-strings' },
  { slug: 'thankyou', title: 'Thank You Letter', tests: 'Control — today’s live page-turn model', senderName: 'Meera', recipientName: 'Arjun', accentFrom: '#E8557A', accentTo: '#B33355', gate: 'plain', musicTrackId: 'gentle-piano' },
  { slug: 'valentine', title: "Valentine's Proposal", tests: 'Max WebGL + gyroscope parallax + voice note peak', senderName: 'Dev', recipientName: 'Ananya', accentFrom: '#D14D72', accentTo: '#8C2F52', gate: 'webgl', musicTrackId: 'warm-strings' },
  { slug: 'housewarming', title: 'Housewarming Invitation', tests: 'Light invitation — single event, calendar, map', senderName: 'Nikhil & Sara', recipientName: 'Friends', accentFrom: '#C97C5D', accentTo: '#8A5A3D', gate: 'plain', musicTrackId: 'upbeat-celebration' },
  { slug: 'friend', title: 'Letter to a Friend', tests: 'Voice-first + hold-to-reveal gesture', senderName: 'Zara', recipientName: 'Ishaan', accentFrom: '#2E8F8F', accentTo: '#1D6363', gate: 'plain', musicTrackId: 'gentle-piano' },
  { slug: 'trip', title: 'Trip Memory Letter', tests: 'Scrollytelling — photo-heavy/parallax', senderName: 'The Squad', recipientName: 'You', accentFrom: '#2E8F8F', accentTo: '#1D6363', gate: 'plain', musicTrackId: 'adventure-acoustic' },
  { slug: 'appreciation', title: 'Appreciation Letter', tests: 'Scrollytelling — husband-to-wife, text/photo mix, WebGL gate skipped', senderName: 'Rahul', recipientName: 'Simran', accentFrom: '#A8456B', accentTo: '#5C2340', gate: 'plain', musicTrackId: 'warm-strings' },
]

export function getLabLetter(slug: string): LabLetter | undefined {
  return LAB_LETTERS.find(l => l.slug === slug)
}
