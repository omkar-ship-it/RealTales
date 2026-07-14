'use client'
import { useState } from 'react'
import { Wand2 } from 'lucide-react'
import type { Scene, OccasionType } from '@/lib/types'
import { OPENING_LINES, TITLE_IDEAS } from '@/lib/copilot'
import { StepShell } from '../StepShell'

interface MessageStepProps {
  recipientName: string
  onRecipientNameChange: (v: string) => void
  title: string
  onTitleChange: (v: string) => void
  messageScene: Scene
  onMessageChange: (patch: Partial<Scene>) => void
  occasion: OccasionType
  onBack: () => void
  onContinue: () => void
}

type Tone = 'warm' | 'emotional' | 'funny' | 'simple'
const TONES: Tone[] = ['warm', 'emotional', 'funny', 'simple']

export function MessageStep({ recipientName, onRecipientNameChange, title, onTitleChange, messageScene, onMessageChange, occasion, onBack, onContinue }: MessageStepProps) {
  const [tone, setTone] = useState<Tone>('warm')
  const [context, setContext] = useState('')

  const compose = () => {
    const lines = OPENING_LINES[occasion]
    const line = tone === 'funny' || tone === 'emotional' ? lines[1] ?? lines[0] : lines[0]
    const body = context.trim() ? `${line.body} ${context.trim()}.` : line.body
    onMessageChange({ heading: `Dear ${recipientName || 'you'},`, body })
    if (!title.trim()) onTitleChange(TITLE_IDEAS[occasion][0])
  }

  return (
    <StepShell
      heading="Say the thing."
      subheading="Write it yourself, or let the muse help."
      onBack={onBack}
      onContinue={onContinue}
      continueDisabled={!messageScene.body?.trim()}
    >
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div>
          <label className="block text-xs font-semibold tracking-wide uppercase text-text-3 mb-1.5">Recipient&apos;s name</label>
          <input
            value={recipientName}
            onChange={e => onRecipientNameChange(e.target.value)}
            placeholder="e.g. Maya"
            className="w-full bg-surface-2 border border-border rounded-lg px-3 py-2.5 text-sm text-text placeholder:text-text-3 focus:outline-none focus:border-brand"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold tracking-wide uppercase text-text-3 mb-1.5">Tone</label>
          <select
            value={tone}
            onChange={e => setTone(e.target.value as Tone)}
            className="w-full bg-surface-2 border border-border rounded-lg px-3 py-2.5 text-sm text-text focus:outline-none focus:border-brand capitalize"
          >
            {TONES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      </div>

      <label className="block text-xs font-semibold tracking-wide uppercase text-text-3 mb-1.5">Any context for the muse? (optional)</label>
      <input
        value={context}
        onChange={e => setContext(e.target.value)}
        placeholder="They stayed up late helping me with the pitch."
        className="w-full bg-surface-2 border border-border rounded-lg px-3 py-2.5 text-sm text-text placeholder:text-text-3 focus:outline-none focus:border-brand mb-3"
      />

      <button
        type="button"
        onClick={compose}
        className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-gold text-gold-d font-semibold text-sm hover:bg-gold/5 transition-colors mb-6"
      >
        <Wand2 className="w-4 h-4" /> Compose with AI
      </button>

      <label className="block text-xs font-semibold tracking-wide uppercase text-text-3 mb-1.5">Card title</label>
      <input
        value={title}
        onChange={e => onTitleChange(e.target.value)}
        placeholder="A short poetic title"
        className="w-full bg-surface-2 border border-border rounded-lg px-3 py-2.5 text-sm text-text placeholder:text-text-3 focus:outline-none focus:border-brand mb-4"
      />

      <label className="block text-xs font-semibold tracking-wide uppercase text-text-3 mb-1.5">Your message</label>
      <textarea
        value={messageScene.body ?? ''}
        onChange={e => onMessageChange({ body: e.target.value })}
        placeholder="Say the thing. It doesn't have to be perfect — it has to be true."
        rows={7}
        className="w-full bg-surface-2 border border-border rounded-lg px-3 py-3 text-sm text-text placeholder:text-text-3 focus:outline-none focus:border-brand resize-none leading-relaxed"
      />
    </StepShell>
  )
}
