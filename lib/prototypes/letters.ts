export interface LabLetter {
  slug: string
  title: string
  tests: string
  senderName: string
  recipientName: string
  accentFrom: string
  accentTo: string
  gate: 'webgl' | 'plain'
}

export const LAB_LETTERS: LabLetter[] = [
  { slug: 'anniversary', title: 'Anniversary Letter', tests: 'Scrollytelling — text/milestone timeline', senderName: 'Priya', recipientName: 'Rohan', accentFrom: '#9D2F52', accentTo: '#6B1D38', gate: 'plain' },
  { slug: 'birthday', title: 'Birthday Letter', tests: 'WebGL envelope + scratch-reveal gesture', senderName: 'Aditi', recipientName: 'Kabir', accentFrom: '#F5A623', accentTo: '#E07A1F', gate: 'webgl' },
  { slug: 'wedding', title: 'Wedding Invitation', tests: 'Multi-chapter invitation + RSVP + countdown', senderName: 'Shiva & Shakti', recipientName: 'Omkar', accentFrom: '#C9A05C', accentTo: '#8C6F32', gate: 'plain' },
  { slug: 'thankyou', title: 'Thank You Letter', tests: 'Control — today’s live page-turn model', senderName: 'Meera', recipientName: 'Arjun', accentFrom: '#E8557A', accentTo: '#B33355', gate: 'plain' },
  { slug: 'valentine', title: "Valentine's Proposal", tests: 'Max WebGL + gyroscope parallax + voice note peak', senderName: 'Dev', recipientName: 'Ananya', accentFrom: '#D14D72', accentTo: '#8C2F52', gate: 'webgl' },
  { slug: 'housewarming', title: 'Housewarming Invitation', tests: 'Light invitation — single event, calendar, map', senderName: 'Nikhil & Sara', recipientName: 'Friends', accentFrom: '#C97C5D', accentTo: '#8A5A3D', gate: 'plain' },
  { slug: 'friend', title: 'Letter to a Friend', tests: 'Voice-first + hold-to-reveal gesture', senderName: 'Zara', recipientName: 'Ishaan', accentFrom: '#2E8F8F', accentTo: '#1D6363', gate: 'plain' },
  { slug: 'trip', title: 'Trip Memory Letter', tests: 'Scrollytelling — photo-heavy/parallax', senderName: 'The Squad', recipientName: 'You', accentFrom: '#2E8F8F', accentTo: '#1D6363', gate: 'plain' },
]

export function getLabLetter(slug: string): LabLetter | undefined {
  return LAB_LETTERS.find(l => l.slug === slug)
}
