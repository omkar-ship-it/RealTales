import Link from 'next/link'
import { LAB_LETTERS } from '@/lib/prototypes/letters'

export default function LabIndexPage() {
  return (
    <div className="min-h-screen bg-[#120E0A] text-white px-6 py-16">
      <div className="max-w-2xl mx-auto">
        <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#D9A441] mb-2">RealTales Lab</p>
        <h1 className="font-display italic text-3xl mb-2">Receiver experience prototypes</h1>
        <p className="text-white/60 text-sm mb-10 max-w-lg">
          Eight sample letters, each testing a different combination of the ideas discussed — not production,
          not wired to the builder. Open one, read it through, and see how it feels.
        </p>
        <div className="space-y-3">
          {LAB_LETTERS.map(l => (
            <Link
              key={l.slug}
              href={`/lab/${l.slug}`}
              className="block rounded-2xl border border-white/10 bg-white/5 p-5 hover:bg-white/10 transition-colors"
            >
              <p className="font-display italic text-xl mb-1">{l.title}</p>
              <p className="text-xs text-white/50">{l.tests}</p>
            </Link>
          ))}
        </div>

        <p className="text-xs text-white/30 mt-12 text-center">Music by Bensound.com</p>
      </div>
    </div>
  )
}
