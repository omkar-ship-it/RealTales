'use client'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

export type WizardStep = 'occasion' | 'message' | 'scenes' | 'visual' | 'sound' | 'sign'

const STEPS: { id: WizardStep; label: string }[] = [
  { id: 'occasion', label: 'Occasion' },
  { id: 'message', label: 'Message' },
  { id: 'scenes', label: 'Scenes' },
  { id: 'visual', label: 'Visual' },
  { id: 'sound', label: 'Sound' },
  { id: 'sign', label: 'Sign & Send' },
]

interface WizardStepperProps {
  current: WizardStep
  furthest: WizardStep
  onJump: (step: WizardStep) => void
}

export function WizardStepper({ current, furthest, onJump }: WizardStepperProps) {
  const furthestIdx = STEPS.findIndex(s => s.id === furthest)

  return (
    <div className="flex items-center gap-1.5 px-6 py-3 border-b border-border overflow-x-auto">
      {STEPS.map((s, i) => {
        const done = i < furthestIdx
        const active = s.id === current
        const reachable = i <= furthestIdx
        return (
          <button
            key={s.id}
            type="button"
            disabled={!reachable}
            onClick={() => onJump(s.id)}
            className={cn(
              'flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold shrink-0 transition-colors',
              active ? 'bg-brand text-white' : done ? 'text-text-2 hover:bg-surface-2' : 'text-text-3',
              !reachable && 'cursor-not-allowed opacity-60',
            )}
          >
            <span
              className={cn(
                'w-4 h-4 rounded-full flex items-center justify-center text-[10px] shrink-0',
                active ? 'bg-white/25' : done ? 'bg-brand text-white' : 'bg-surface-2',
              )}
            >
              {done ? <Check className="w-2.5 h-2.5" /> : i + 1}
            </span>
            {s.label}
          </button>
        )
      })}
    </div>
  )
}

export { STEPS as WIZARD_STEPS }
