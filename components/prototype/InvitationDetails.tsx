interface InvitationDetailsProps {
  eventName: string
  date: string
  time: string
  venue: string
  dressCode?: string
  mapUrl?: string
  accentFrom: string
}

export function InvitationDetails({ eventName, date, time, venue, dressCode, mapUrl, accentFrom }: InvitationDetailsProps) {
  return (
    <div className="w-full max-w-sm mx-auto rounded-2xl bg-white/95 p-6 text-left shadow-xl">
      <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-4" style={{ color: accentFrom }}>{eventName}</p>
      <div className="space-y-2 text-sm text-[#3B2F2F]">
        <DetailRow label="Date" value={date} />
        <DetailRow label="Time" value={time} />
        <DetailRow label="Venue" value={venue} />
        {dressCode && <DetailRow label="Dress code" value={dressCode} />}
      </div>
      {mapUrl && (
        <a href={mapUrl} target="_blank" rel="noreferrer" className="inline-block mt-4 text-xs font-semibold underline underline-offset-2" style={{ color: accentFrom }}>
          Get directions →
        </a>
      )}
    </div>
  )
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-[#F0E4D8] pb-1.5">
      <span className="text-[#8B7E68] text-[11px] uppercase tracking-wide shrink-0">{label}</span>
      <span className="font-medium text-right">{value}</span>
    </div>
  )
}
