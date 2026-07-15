import type { MusicTrack } from './types'

/**
 * `fileUrl` paths point at real files in /public/music/*.mp3 — full-length,
 * professionally produced tracks from Bensound.com (replacing the earlier
 * procedurally-synthesized placeholders, which sounded harsh/artificial).
 * Bensound's free tier requires attribution (credit "Music by Bensound.com"
 * somewhere reachable in the product — the artist field below surfaces this
 * directly in the MusicPicker UI). Before any real/paid launch, buy Bensound's
 * royalty-free commercial license per track to drop the attribution
 * requirement — see https://www.bensound.com/licensing.
 */
export const MUSIC_TRACKS: MusicTrack[] = [
  {
    id: 'gentle-piano',
    title: 'Tenderness',
    artist: 'Bensound.com',
    fileUrl: '/music/gentle-piano.mp3',
    durationSec: 124,
    licenseNote: 'Bensound.com royalty-free track ("Tenderness") — free tier requires attribution; buy a commercial license before real launch to remove that requirement.',
    occasionTags: ['goodwill', 'anniversary', 'housewarming'],
  },
  {
    id: 'warm-strings',
    title: 'Memories',
    artist: 'Bensound.com',
    fileUrl: '/music/warm-strings.mp3',
    durationSec: 230,
    licenseNote: 'Bensound.com royalty-free track ("Memories") — free tier requires attribution; buy a commercial license before real launch to remove that requirement.',
    occasionTags: ['wedding', 'anniversary'],
  },
  {
    id: 'upbeat-celebration',
    title: 'Happiness',
    artist: 'Bensound.com',
    fileUrl: '/music/upbeat-celebration.mp3',
    durationSec: 262,
    licenseNote: 'Bensound.com royalty-free track ("Happiness") — free tier requires attribution; buy a commercial license before real launch to remove that requirement.',
    occasionTags: ['birthday', 'housewarming'],
  },
  {
    id: 'adventure-acoustic',
    title: 'Acoustic Breeze',
    artist: 'Bensound.com',
    fileUrl: '/music/adventure-acoustic.mp3',
    durationSec: 157,
    licenseNote: 'Bensound.com royalty-free track ("Acoustic Breeze") — free tier requires attribution; buy a commercial license before real launch to remove that requirement.',
    occasionTags: ['trip'],
  },
  {
    id: 'romantic-piano',
    title: 'Romantic',
    artist: 'Bensound.com',
    fileUrl: '/music/romantic-piano.mp3',
    durationSec: 237,
    licenseNote: 'Bensound.com royalty-free track ("Romantic") — free tier requires attribution; buy a commercial license before real launch to remove that requirement.',
    occasionTags: ['wedding', 'anniversary'],
  },
  {
    id: 'dreamy-love',
    title: 'Love',
    artist: 'Bensound.com',
    fileUrl: '/music/dreamy-love.mp3',
    durationSec: 336,
    licenseNote: 'Bensound.com royalty-free track ("Love") — free tier requires attribution; buy a commercial license before real launch to remove that requirement.',
    occasionTags: ['anniversary', 'wedding'],
  },
  {
    id: 'grateful-ukulele',
    title: 'Ukulele',
    artist: 'Bensound.com',
    fileUrl: '/music/grateful-ukulele.mp3',
    durationSec: 146,
    licenseNote: 'Bensound.com royalty-free track ("Ukulele") — free tier requires attribution; buy a commercial license before real launch to remove that requirement.',
    occasionTags: ['goodwill'],
  },
  {
    id: 'heartfelt-sweet',
    title: 'Sweet',
    artist: 'Bensound.com',
    fileUrl: '/music/heartfelt-sweet.mp3',
    durationSec: 308,
    licenseNote: 'Bensound.com royalty-free track ("Sweet") — free tier requires attribution; buy a commercial license before real launch to remove that requirement.',
    occasionTags: ['goodwill', 'anniversary'],
  },
]

export function getMusicTrack(id: string | null | undefined): MusicTrack | undefined {
  return MUSIC_TRACKS.find(t => t.id === id)
}
