import type { MusicTrack } from './types'

/**
 * `fileUrl` paths point at real files in /public/music/*.wav — procedurally
 * synthesized (numpy sine/harmonic synthesis, no samples or copyrighted
 * material), not licensed recordings. Good enough for a design prototype to
 * actually have sound during the reveal; swap in real licensed tracks
 * (Epidemic Sound, Artlist, etc.) before any real launch. See README.
 */
export const MUSIC_TRACKS: MusicTrack[] = [
  {
    id: 'gentle-piano',
    title: 'Gentle Piano',
    artist: 'RealTales (synthesized)',
    fileUrl: '/music/gentle-piano.wav',
    durationSec: 16,
    licenseNote: 'Procedurally generated placeholder audio — no license needed, but not production-quality',
    occasionTags: ['goodwill', 'anniversary', 'housewarming'],
  },
  {
    id: 'warm-strings',
    title: 'Warm Strings',
    artist: 'RealTales (synthesized)',
    fileUrl: '/music/warm-strings.wav',
    durationSec: 17,
    licenseNote: 'Procedurally generated placeholder audio — no license needed, but not production-quality',
    occasionTags: ['wedding', 'anniversary'],
  },
  {
    id: 'upbeat-celebration',
    title: 'Upbeat Celebration',
    artist: 'RealTales (synthesized)',
    fileUrl: '/music/upbeat-celebration.wav',
    durationSec: 12,
    licenseNote: 'Procedurally generated placeholder audio — no license needed, but not production-quality',
    occasionTags: ['birthday', 'housewarming'],
  },
  {
    id: 'adventure-acoustic',
    title: 'Adventure Acoustic',
    artist: 'RealTales (synthesized)',
    fileUrl: '/music/adventure-acoustic.wav',
    durationSec: 13,
    licenseNote: 'Procedurally generated placeholder audio — no license needed, but not production-quality',
    occasionTags: ['trip'],
  },
]

export function getMusicTrack(id: string | null | undefined): MusicTrack | undefined {
  return MUSIC_TRACKS.find(t => t.id === id)
}
