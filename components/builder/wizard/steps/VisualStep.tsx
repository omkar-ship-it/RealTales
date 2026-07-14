'use client'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { StepShell } from '../StepShell'

interface Palette { name: string; from: string; to: string }

interface VisualStepProps {
  accentFrom: string
  accentTo: string
  activePalette: { from: string; to: string } | null
  onApplyPalette: (from: string, to: string) => void
  onBack: () => void
  onContinue: () => void
}

export function VisualStep({ accentFrom, accentTo, activePalette, onApplyPalette, onBack, onContinue }: VisualStepProps) {
  const palettes: Palette[] = [
    { name: 'Classic', from: accentFrom, to: accentTo },
    { name: 'Blush', from: '#F2B8C6', to: '#C2657D' },
    { name: 'Ink', from: '#8C7FC9', to: '#2B2140' },
    { name: 'Gold', from: '#F3D9A8', to: '#B5822C' },
    { name: 'Sage', from: '#A9C1A0', to: '#5A7A55' },
    { name: 'Midnight', from: '#5A5178', to: '#120E0A' },
  ]

  const isActive = (p: Palette) => activePalette ? activePalette.from === p.from && activePalette.to === p.to : p.name === 'Classic'

  return (
    <StepShell
      heading="Set the backdrop."
      subheading="This colors every scene of your letter — pick the mood."
      onBack={onBack}
      onContinue={onContinue}
    >
      <div className="grid grid-cols-3 gap-3">
        {palettes.map(p => (
          <button
            key={p.name}
            type="button"
            onClick={() => onApplyPalette(p.from, p.to)}
            className={cn(
              'relative rounded-2xl h-24 flex items-end p-3 text-left overflow-hidden border-2 transition-colors',
              isActive(p) ? 'border-text' : 'border-transparent',
            )}
            style={{ background: `linear-gradient(160deg, ${p.from} 0%, ${p.to} 100%)` }}
          >
            <span className="text-xs font-semibold text-white drop-shadow">{p.name}</span>
            {isActive(p) && (
              <span className="absolute top-2 right-2 w-5 h-5 rounded-full bg-white flex items-center justify-center">
                <Check className="w-3 h-3 text-text" />
              </span>
            )}
          </button>
        ))}
      </div>
    </StepShell>
  )
}
