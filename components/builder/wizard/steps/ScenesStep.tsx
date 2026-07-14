'use client'
import { useRef } from 'react'
import { Sparkles, ImagePlus, Trash2, Plus } from 'lucide-react'
import type { Scene } from '@/lib/types'
import { hexMix } from '@/lib/utils'
import { StepShell } from '../StepShell'

interface ScenesStepProps {
  scenes: Scene[]
  onSceneChange: (id: string, patch: Partial<Scene>) => void
  onSceneRemove: (id: string) => void
  onAddScene: () => void
  onImageSelect: (sceneId: string, file: File) => Promise<void>
  accentFrom: string
  accentTo: string
  onBack: () => void
  onContinue: () => void
}

/** Deterministic "mood" gradient from free text — not real image generation, but a
 * real, honest transformation rather than a decorative dead button. */
function moodPalette(prompt: string, accentFrom: string, accentTo: string): { from: string; to: string } {
  const sum = Array.from(prompt).reduce((acc, ch) => acc + ch.charCodeAt(0), 0)
  const t = ((sum % 100) / 100) * 0.6 + 0.15
  return { from: hexMix(accentFrom, '#ffffff', t * 0.5), to: hexMix(accentTo, '#000000', t) }
}

export function ScenesStep({ scenes, onSceneChange, onSceneRemove, onAddScene, onImageSelect, accentFrom, accentTo, onBack, onContinue }: ScenesStepProps) {
  return (
    <StepShell
      heading="Direct the reveal."
      subheading="Each scene is a moment your recipient turns to. Add quotes or personal photos."
      onBack={onBack}
      onContinue={onContinue}
    >
      <button
        type="button"
        onClick={onAddScene}
        className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-text text-white font-semibold text-sm mb-5"
      >
        <Plus className="w-4 h-4" /> Add scene
      </button>

      <div className="space-y-4">
        {scenes.map((scene, i) => (
          <SceneCard
            key={scene.id}
            scene={scene}
            index={i}
            onChange={patch => onSceneChange(scene.id, patch)}
            onRemove={() => onSceneRemove(scene.id)}
            onImageSelect={file => onImageSelect(scene.id, file)}
            accentFrom={accentFrom}
            accentTo={accentTo}
          />
        ))}
        {scenes.length === 0 && (
          <p className="text-sm text-text-3 text-center py-8 border-2 border-dashed border-border rounded-2xl">
            No extra scenes yet — your letter still works with just the message. Add one for a quote or a photo.
          </p>
        )}
      </div>
    </StepShell>
  )
}

function SceneCard({ scene, index, onChange, onRemove, onImageSelect, accentFrom, accentTo }: {
  scene: Scene
  index: number
  onChange: (patch: Partial<Scene>) => void
  onRemove: () => void
  onImageSelect: (file: File) => Promise<void>
  accentFrom: string
  accentTo: string
}) {
  const fileRef = useRef<HTMLInputElement>(null)
  const isPhoto = scene.layout === 'image-only' || scene.layout === 'image-text'

  return (
    <div className="wc-card p-4">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-semibold tracking-wide uppercase text-text-3">Scene {String(index + 1).padStart(2, '0')}</p>
        <button type="button" onClick={onRemove} className="flex items-center gap-1 text-xs text-danger">
          <Trash2 className="w-3.5 h-3.5" /> Remove
        </button>
      </div>

      <textarea
        value={scene.body ?? ''}
        onChange={e => onChange({ body: e.target.value })}
        placeholder={`e.g. "The morning we drove out with nothing but a playlist and hope."`}
        rows={3}
        className="w-full bg-surface-2 border border-border rounded-lg px-3 py-2.5 text-sm text-text placeholder:text-text-3 italic focus:outline-none focus:border-brand resize-none mb-3"
      />

      {isPhoto && scene.imageUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={scene.imageUrl} alt="" className="w-24 h-24 rounded-lg object-cover mb-3" />
      )}

      <div className="flex flex-wrap items-center gap-2">
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) { onImageSelect(f); onChange({ layout: 'image-only' }) } }} />
        <button type="button" onClick={() => fileRef.current?.click()} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-2 text-text-2 text-xs font-semibold">
          <ImagePlus className="w-3.5 h-3.5" /> Upload personal photo
        </button>
        <button
          type="button"
          onClick={() => onChange({ background: moodPalette(scene.body ?? String(index), accentFrom, accentTo) })}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-text text-white text-xs font-semibold"
        >
          <Sparkles className="w-3.5 h-3.5" /> Paint the mood
        </button>
      </div>
    </div>
  )
}
