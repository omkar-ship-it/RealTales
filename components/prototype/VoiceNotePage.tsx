'use client'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Play, Pause } from 'lucide-react'

interface VoiceNotePageProps {
  text: string
  speakerLabel?: string
  accentFrom: string
  accentTo: string
  /** A real recorded/uploaded clip. When present, playback uses this file
   * instead of `speechSynthesis` — the honest version of a voice note. Falls
   * back to TTS when absent, since real personal voice can't be faked. */
  audioUrl?: string
  /** Lets the caller duck background music while the voice note is speaking —
   * the two competing for attention undercuts both. */
  onPlayingChange?: (playing: boolean) => void
}

/** Pure per-index hash (no Math.random) — deterministic waveform bar heights. */
function hash(n: number): number {
  const x = Math.sin(n * 12.9898) * 43758.5453
  return x - Math.floor(x)
}

/**
 * A voice note page — a waveform and play/pause, backed by either a real
 * `audioUrl` clip or, when absent, the browser's native `speechSynthesis`
 * reading the text out loud (a transparent placeholder for what a voice-note
 * page *feels* like, since real personal voice can't be faked without one).
 */
export function VoiceNotePage({ text, speakerLabel, accentFrom, accentTo, audioUrl, onPlayingChange }: VoiceNotePageProps) {
  const [playing, setPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)
  const bars = useMemo(() => Array.from({ length: 26 }, (_, i) => 0.25 + hash(i) * 0.75), [])

  useEffect(() => {
    const audioEl = audioRef.current
    return () => {
      window.speechSynthesis?.cancel()
      audioEl?.pause()
      onPlayingChange?.(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const setPlayingState = (next: boolean) => {
    setPlaying(next)
    onPlayingChange?.(next)
  }

  const toggle = () => {
    if (audioUrl) {
      const audio = audioRef.current
      if (!audio) return
      if (playing) {
        audio.pause() // onPause below updates state
      } else {
        audio.play().catch(() => {}) // onPlay below updates state
      }
      return
    }
    if (playing) {
      window.speechSynthesis.cancel()
      setPlayingState(false)
      return
    }
    if (typeof window.speechSynthesis === 'undefined') return
    const utter = new SpeechSynthesisUtterance(text)
    utter.rate = 0.95
    utter.onend = () => setPlayingState(false)
    utter.onerror = () => setPlayingState(false)
    window.speechSynthesis.speak(utter)
    setPlayingState(true)
  }

  return (
    <div className="h-full flex flex-col items-center justify-center gap-6 px-8 text-center">
      {audioUrl && (
        <audio
          ref={audioRef}
          src={audioUrl}
          preload="auto"
          onPlay={() => setPlayingState(true)}
          onPause={() => setPlayingState(false)}
          onEnded={() => setPlayingState(false)}
        />
      )}

      <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#8B7E68]">{speakerLabel ?? 'Voice note'}</p>

      <button
        type="button"
        onClick={toggle}
        className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg shrink-0"
        style={{ background: `linear-gradient(160deg, ${accentFrom} 0%, ${accentTo} 100%)` }}
      >
        {playing ? <Pause className="w-6 h-6 text-white" /> : <Play className="w-6 h-6 text-white ml-0.5" />}
      </button>

      <div className="flex items-end gap-1 h-12">
        {bars.map((b, i) => (
          <span
            key={i}
            className="w-1 rounded-full"
            style={{
              height: `${b * 100}%`,
              background: accentFrom,
              opacity: playing ? 0.9 : 0.3,
              animation: playing ? `voicebar 0.9s ease-in-out ${(i * 0.03).toFixed(2)}s infinite alternate` : undefined,
            }}
          />
        ))}
      </div>

      <p className="font-hand text-lg text-[#3B2F2F] max-w-xs leading-snug">{text}</p>
    </div>
  )
}
