'use client'
import { useEffect, useMemo, useState } from 'react'
import { Play, Pause } from 'lucide-react'

interface VoiceNotePageProps {
  text: string
  speakerLabel?: string
  accentFrom: string
  accentTo: string
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
 * A voice note page — just a waveform and play/pause. Audio is the browser's
 * native speechSynthesis reading the text: a transparent placeholder for what a
 * voice-note page *feels* like (the interaction pattern), since real personal
 * voice can't be faked — that's the thing being tested here, not audio quality.
 */
export function VoiceNotePage({ text, speakerLabel, accentFrom, accentTo, onPlayingChange }: VoiceNotePageProps) {
  const [playing, setPlaying] = useState(false)
  const bars = useMemo(() => Array.from({ length: 26 }, (_, i) => 0.25 + hash(i) * 0.75), [])

  useEffect(() => {
    return () => {
      window.speechSynthesis?.cancel()
      onPlayingChange?.(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const setPlayingState = (next: boolean) => {
    setPlaying(next)
    onPlayingChange?.(next)
  }

  const toggle = () => {
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
