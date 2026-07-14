'use client'
import { useMemo } from 'react'

interface Star {
  left: string
  top: string
  size: number
  delay: string
}

/** Pure per-index pseudo-random hash (no mutable state) — deterministic scatter of
 * twinkling dots for the dark reveal backdrop. */
function hash(n: number): number {
  const x = Math.sin(n * 12.9898) * 43758.5453
  return x - Math.floor(x)
}

export function Starfield({ count = 40 }: { count?: number }) {
  const stars = useMemo<Star[]>(
    () =>
      Array.from({ length: count }, (_, i) => ({
        left: `${(hash(i * 4 + 1) * 100).toFixed(2)}%`,
        top: `${(hash(i * 4 + 2) * 100).toFixed(2)}%`,
        size: hash(i * 4 + 3) > 0.85 ? 2 : 1,
        delay: `${(hash(i * 4 + 4) * 3).toFixed(2)}s`,
      })),
    [count],
  )

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {stars.map((s, i) => (
        <span
          key={i}
          className="star-twinkle absolute rounded-full bg-white"
          style={{ left: s.left, top: s.top, width: s.size, height: s.size, animationDelay: s.delay }}
        />
      ))}
    </div>
  )
}
