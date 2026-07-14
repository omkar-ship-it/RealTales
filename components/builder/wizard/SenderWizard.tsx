'use client'
import { useState } from 'react'
import type { Scene, OccasionType } from '@/lib/types'
import { WizardStepper, WIZARD_STEPS, type WizardStep } from './WizardStepper'
import { WizardLivePreview } from './WizardLivePreview'
import { OccasionStep } from './steps/OccasionStep'
import { MessageStep } from './steps/MessageStep'
import { ScenesStep } from './steps/ScenesStep'
import { VisualStep } from './steps/VisualStep'
import { SoundStep } from './steps/SoundStep'
import { SignStep } from './steps/SignStep'

const ORDER: WizardStep[] = WIZARD_STEPS.map(s => s.id)

interface SenderWizardProps {
  title: string
  onTitleChange: (v: string) => void
  senderName: string
  onSenderNameChange: (v: string) => void
  recipientName: string
  onRecipientNameChange: (v: string) => void
  occasion: OccasionType
  onSelectOccasion: (o: OccasionType) => void
  scenes: Scene[]
  onSceneChange: (id: string, patch: Partial<Scene>) => void
  onSceneRemove: (id: string) => void
  onAddScene: () => void
  onImageSelect: (sceneId: string, file: File) => Promise<void>
  onApplyPalette: (from: string, to: string) => void
  musicTrackId: string | null
  onMusicChange: (id: string) => void
  accentFrom: string
  accentTo: string
  onOpenPrivacy: () => void
  onPublish: () => void
  publishing: boolean
  error: string | null
}

export function SenderWizard({
  title, onTitleChange, senderName, onSenderNameChange, recipientName, onRecipientNameChange,
  occasion, onSelectOccasion, scenes, onSceneChange, onSceneRemove, onAddScene, onImageSelect, onApplyPalette,
  musicTrackId, onMusicChange, accentFrom, accentTo, onOpenPrivacy, onPublish, publishing, error,
}: SenderWizardProps) {
  const [wizardStep, setWizardStep] = useState<WizardStep>('occasion')
  const [furthest, setFurthest] = useState<WizardStep>('occasion')
  const [activePalette, setActivePalette] = useState<{ from: string; to: string } | null>(null)

  const goTo = (step: WizardStep) => {
    setWizardStep(step)
    if (ORDER.indexOf(step) > ORDER.indexOf(furthest)) setFurthest(step)
  }
  const next = () => {
    const i = ORDER.indexOf(wizardStep)
    if (i < ORDER.length - 1) goTo(ORDER[i + 1])
  }
  const back = () => {
    const i = ORDER.indexOf(wizardStep)
    if (i > 0) setWizardStep(ORDER[i - 1])
  }

  const messageScene = scenes[0]
  const extraScenes = scenes.slice(1)

  const previewScene = wizardStep === 'scenes' && extraScenes.length > 0 ? extraScenes[extraScenes.length - 1] : messageScene
  const previewIndex = previewScene === messageScene ? 0 : scenes.indexOf(previewScene)

  return (
    <div className="flex-1 min-h-0 flex flex-col">
      <WizardStepper current={wizardStep} furthest={furthest} onJump={goTo} />
      <div className="flex-1 min-h-0 flex">
        {wizardStep === 'occasion' && (
          <OccasionStep occasion={occasion} onSelectOccasion={onSelectOccasion} onContinue={next} />
        )}
        {wizardStep === 'message' && messageScene && (
          <MessageStep
            recipientName={recipientName}
            onRecipientNameChange={onRecipientNameChange}
            title={title}
            onTitleChange={onTitleChange}
            messageScene={messageScene}
            onMessageChange={patch => onSceneChange(messageScene.id, patch)}
            occasion={occasion}
            onBack={back}
            onContinue={next}
          />
        )}
        {wizardStep === 'scenes' && (
          <ScenesStep
            scenes={extraScenes}
            onSceneChange={onSceneChange}
            onSceneRemove={onSceneRemove}
            onAddScene={onAddScene}
            onImageSelect={onImageSelect}
            accentFrom={accentFrom}
            accentTo={accentTo}
            onBack={back}
            onContinue={next}
          />
        )}
        {wizardStep === 'visual' && (
          <VisualStep
            accentFrom={accentFrom}
            accentTo={accentTo}
            activePalette={activePalette}
            onApplyPalette={(from, to) => { setActivePalette({ from, to }); onApplyPalette(from, to) }}
            onBack={back}
            onContinue={next}
          />
        )}
        {wizardStep === 'sound' && (
          <SoundStep occasion={occasion} musicTrackId={musicTrackId} onMusicChange={onMusicChange} onBack={back} onContinue={next} />
        )}
        {wizardStep === 'sign' && (
          <SignStep
            senderName={senderName}
            onSenderNameChange={onSenderNameChange}
            recipientName={recipientName}
            onRecipientNameChange={onRecipientNameChange}
            onOpenPrivacy={onOpenPrivacy}
            onBack={back}
            onPublish={onPublish}
            publishing={publishing}
            error={error}
          />
        )}

        {previewScene && (
          <WizardLivePreview scene={previewScene} index={previewIndex} total={scenes.length} accentFrom={accentFrom} accentTo={accentTo} />
        )}
      </div>
    </div>
  )
}
