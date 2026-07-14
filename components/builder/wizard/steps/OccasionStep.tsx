import type { OccasionType } from '@/lib/types'
import { TemplateLibrary } from '../../TemplateLibrary'
import { StepShell } from '../StepShell'

interface OccasionStepProps {
  occasion: OccasionType
  onSelectOccasion: (o: OccasionType) => void
  onContinue: () => void
}

export function OccasionStep({ occasion, onSelectOccasion, onContinue }: OccasionStepProps) {
  return (
    <StepShell heading="What are we celebrating?" subheading="Pick an occasion — the tone, colour, and pacing will follow." onContinue={onContinue}>
      <TemplateLibrary value={occasion} onSelect={onSelectOccasion} />
    </StepShell>
  )
}
