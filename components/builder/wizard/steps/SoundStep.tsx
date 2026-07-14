import type { OccasionType } from '@/lib/types'
import { MusicPicker } from '../../MusicPicker'
import { StepShell } from '../StepShell'

interface SoundStepProps {
  occasion: OccasionType
  musicTrackId: string | null
  onMusicChange: (id: string) => void
  onBack: () => void
  onContinue: () => void
}

export function SoundStep({ occasion, musicTrackId, onMusicChange, onBack, onContinue }: SoundStepProps) {
  return (
    <StepShell
      heading="Add a soundtrack."
      subheading="Music sets the pace of the reveal. Preview any track before choosing."
      onBack={onBack}
      onContinue={onContinue}
    >
      <MusicPicker occasion={occasion} value={musicTrackId} onChange={onMusicChange} />
    </StepShell>
  )
}
