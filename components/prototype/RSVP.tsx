'use client'
import { useState } from 'react'

interface RSVPProps {
  accentFrom: string
  accentTo: string
}

export function RSVP({ accentFrom, accentTo }: RSVPProps) {
  const [choice, setChoice] = useState<'yes' | 'no' | null>(null)

  return (
    <div className="text-center">
      <p className="text-sm text-white/70 mb-4">Will you be there?</p>
      <div className="flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => setChoice('yes')}
          className="px-5 py-2.5 rounded-full font-semibold text-sm transition-colors"
          style={choice === 'yes' ? { background: `linear-gradient(160deg, ${accentFrom} 0%, ${accentTo} 100%)`, color: '#2B2140' } : { background: 'rgba(255,255,255,0.1)', color: 'white' }}
        >
          Joyfully accept
        </button>
        <button
          type="button"
          onClick={() => setChoice('no')}
          className="px-5 py-2.5 rounded-full font-semibold text-sm bg-white/10 text-white transition-opacity"
          style={{ opacity: choice === 'no' ? 1 : 0.7 }}
        >
          Regretfully decline
        </button>
      </div>
      {choice && (
        <p className="text-xs text-white/50 mt-3">
          {choice === 'yes' ? "Can't wait to celebrate with you." : "You'll be missed."}
        </p>
      )}
    </div>
  )
}
