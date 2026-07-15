'use client'
import { ReactLenis } from 'lenis/react'

/**
 * Smooth/inertial scroll for every `/lab` route — every scrollytelling
 * reference studied for this pass (makemepulse, Lusion, Uncommon Studio) has
 * this, we didn't. Scoped to `/lab` only, not the root layout — `/create`,
 * `/c/[slug]`, and `/dashboard` are untouched.
 *
 * `root` defaults `wrapper`/`content` to `window`/`document.documentElement`
 * (left unset here on purpose) — Lenis's "native" mode, which keeps
 * `window.scrollY` real instead of transforming a wrapper div. The transform
 * approach is what's documented to break `position: sticky`, which every
 * pinned-hero and horizontal gallery in `ScrollytellingReel` depends on.
 */
export default function LabLayout({ children }: { children: React.ReactNode }) {
  return (
    <ReactLenis root options={{ lerp: 0.1, smoothWheel: true }}>
      {children}
    </ReactLenis>
  )
}
