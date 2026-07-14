'use client'
import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Eye, Lock, Undo2, Redo2, Cloud, CloudUpload, ChevronDown, Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { OccasionMeta } from '@/lib/types'

interface BuilderHeaderProps {
  meta: OccasionMeta
  title: string
  onTitleChange: (v: string) => void
  saveStatus: 'idle' | 'saving' | 'saved'
  canUndo: boolean
  canRedo: boolean
  onUndo: () => void
  onRedo: () => void
  onOpenPrivacy: () => void
  onPreview: () => void
  onPublish: () => void
  publishing: boolean
}

/** App-level chrome above the sender wizard — the wizard owns its own 6-step tracker
 * (WizardStepper), so this header stays focused on identity/save-state/undo/actions. */
export function BuilderHeader({
  meta, title, onTitleChange, saveStatus, canUndo, canRedo, onUndo, onRedo, onOpenPrivacy, onPreview, onPublish, publishing,
}: BuilderHeaderProps) {
  const [editingTitle, setEditingTitle] = useState(false)

  return (
    <div className="flex items-center justify-between gap-4 px-4 py-2.5 border-b border-border bg-bg">
      <div className="flex items-center gap-3 min-w-0">
        <Link href="/dashboard" className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-text-2 hover:bg-surface-2">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div className="flex items-center gap-1.5 shrink-0">
          <Heart className="w-4 h-4 text-brand fill-brand" />
          <span className="font-display font-semibold text-text hidden sm:inline">RealTales</span>
        </div>

        <div className="w-px h-5 bg-border hidden md:block" />
        <div className="relative hidden md:block">
          {editingTitle ? (
            <input
              autoFocus
              value={title}
              onChange={e => onTitleChange(e.target.value)}
              onBlur={() => setEditingTitle(false)}
              onKeyDown={e => { if (e.key === 'Enter') (e.target as HTMLInputElement).blur() }}
              placeholder="Name this letter"
              className="bg-surface-2 border border-border rounded-lg px-2.5 py-1.5 text-sm font-semibold text-text focus:outline-none focus:border-brand w-48"
            />
          ) : (
            <button
              type="button"
              onClick={() => setEditingTitle(true)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-sm font-semibold text-text hover:bg-surface-2 max-w-[220px]"
            >
              <span className="shrink-0">{meta.emoji}</span>
              <span className="truncate">{title || 'Untitled letter'}</span>
              <ChevronDown className="w-3.5 h-3.5 text-text-3 shrink-0" />
            </button>
          )}
        </div>

        <SaveIndicator status={saveStatus} />

        <div className="w-px h-5 bg-border hidden lg:block" />
        <div className="hidden lg:flex items-center gap-0.5">
          <button
            type="button"
            onClick={onUndo}
            disabled={!canUndo}
            title="Undo"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-text-2 hover:bg-surface-2 disabled:opacity-30"
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={onRedo}
            disabled={!canRedo}
            title="Redo"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-text-2 hover:bg-surface-2 disabled:opacity-30"
          >
            <Redo2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={onOpenPrivacy}
          className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl text-text-2 text-sm font-semibold hover:bg-surface-2"
        >
          <Lock className="w-4 h-4" /> Privacy
        </button>
        <Button variant="secondary" onClick={onPreview}>
          <Eye className="w-4 h-4" /> Preview
        </Button>
        <Button onClick={onPublish} loading={publishing}>
          Publish
        </Button>
      </div>
    </div>
  )
}

function SaveIndicator({ status }: { status: 'idle' | 'saving' | 'saved' }) {
  if (status === 'idle') return null
  return (
    <span className="hidden md:flex items-center gap-1.5 text-xs font-medium text-text-3">
      {status === 'saving' ? <CloudUpload className="w-3.5 h-3.5 animate-pulse" /> : <Cloud className="w-3.5 h-3.5 text-success" />}
      {status === 'saving' ? 'Saving…' : 'Saved'}
    </span>
  )
}
