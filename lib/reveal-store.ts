const KEY = 'realtales.reveal-state.v1'

interface CardRevealState {
  saved?: boolean
  hearts?: number
  reply?: string
}

type RevealState = Record<string, CardRevealState>

/** Receiver-side interaction state (saved/hearts/reply) — deliberately separate from
 * the sender's Card record in mock-store.ts. Keyed by share slug, lives in whichever
 * browser opens the link (same "no backend" prototype model as the rest of the app). */
function readAll(): RevealState {
  if (typeof window === 'undefined') return {}
  try {
    const raw = window.localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as RevealState) : {}
  } catch {
    return {}
  }
}

function writeAll(state: RevealState) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(KEY, JSON.stringify(state))
}

export function getRevealState(slug: string): CardRevealState {
  return readAll()[slug] ?? {}
}

export function markSaved(slug: string) {
  const all = readAll()
  all[slug] = { ...all[slug], saved: true }
  writeAll(all)
}

export function incrementHearts(slug: string): number {
  const all = readAll()
  const next = (all[slug]?.hearts ?? 0) + 1
  all[slug] = { ...all[slug], hearts: next }
  writeAll(all)
  return next
}

export function saveReply(slug: string, text: string) {
  const all = readAll()
  all[slug] = { ...all[slug], reply: text }
  writeAll(all)
}
