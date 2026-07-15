/** Google Calendar "template" URL — adds an event with no backend involved. */
export function googleCalendarUrl(opts: { title: string; start: Date; end: Date; details?: string; location?: string }): string {
  const fmt = (d: Date) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z')
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: opts.title,
    dates: `${fmt(opts.start)}/${fmt(opts.end)}`,
    details: opts.details ?? '',
    location: opts.location ?? '',
  })
  return `https://www.google.com/calendar/render?${params.toString()}`
}
