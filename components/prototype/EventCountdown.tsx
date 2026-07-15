'use client'
import { useEffect, useState } from 'react'

interface EventCountdownProps {
  targetDate: string // ISO
  eventName: string
  addToCalendarUrl?: string
}

function diff(target: Date) {
  const ms = Math.max(0, target.getTime() - Date.now())
  return {
    days: Math.floor(ms / 86400000),
    hours: Math.floor((ms % 86400000) / 3600000),
    mins: Math.floor((ms % 3600000) / 60000),
  }
}

export function EventCountdown({ targetDate, eventName, addToCalendarUrl }: EventCountdownProps) {
  const [d, setD] = useState(() => diff(new Date(targetDate)))

  useEffect(() => {
    const id = setInterval(() => setD(diff(new Date(targetDate))), 60000)
    return () => clearInterval(id)
  }, [targetDate])

  return (
    <div className="text-center">
      <p className="text-xs uppercase tracking-[0.2em] text-white/50 mb-3">Counting down to {eventName}</p>
      <div className="flex items-center justify-center gap-5">
        {[{ v: d.days, l: 'days' }, { v: d.hours, l: 'hrs' }, { v: d.mins, l: 'min' }].map(u => (
          <div key={u.l} className="flex flex-col items-center">
            <span className="font-display text-3xl text-white">{u.v}</span>
            <span className="text-[10px] uppercase tracking-wide text-white/40">{u.l}</span>
          </div>
        ))}
      </div>
      {addToCalendarUrl && (
        <a href={addToCalendarUrl} target="_blank" rel="noreferrer" className="inline-block mt-4 text-xs font-semibold text-[#D9A441] underline underline-offset-2">
          Add to calendar →
        </a>
      )}
    </div>
  )
}
