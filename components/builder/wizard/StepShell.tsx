import type { ReactNode } from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface StepShellProps {
  heading: string
  subheading?: string
  children: ReactNode
  onBack?: () => void
  onContinue?: () => void
  continueLabel?: string
  continueDisabled?: boolean
  hideContinue?: boolean
}

export function StepShell({ heading, subheading, children, onBack, onContinue, continueLabel = 'Continue', continueDisabled, hideContinue }: StepShellProps) {
  return (
    <div className="flex-1 overflow-y-auto px-6 sm:px-10 py-8 max-w-xl">
      <p className="font-display text-3xl font-semibold text-text mb-1.5">{heading}</p>
      {subheading && <p className="text-sm text-text-2 mb-7">{subheading}</p>}

      <div className="mb-8">{children}</div>

      <div className="flex items-center gap-3">
        {onBack && (
          <Button variant="secondary" onClick={onBack}>
            <ArrowLeft className="w-4 h-4" /> Back
          </Button>
        )}
        {!hideContinue && onContinue && (
          <Button onClick={onContinue} disabled={continueDisabled}>
            {continueLabel} <ArrowRight className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  )
}
