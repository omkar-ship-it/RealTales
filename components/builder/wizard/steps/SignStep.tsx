import { ArrowRight, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { StepShell } from '../StepShell'

interface SignStepProps {
  senderName: string
  onSenderNameChange: (v: string) => void
  recipientName: string
  onRecipientNameChange: (v: string) => void
  onOpenPrivacy: () => void
  onBack: () => void
  onPublish: () => void
  publishing: boolean
  error: string | null
}

export function SignStep({ senderName, onSenderNameChange, recipientName, onRecipientNameChange, onOpenPrivacy, onBack, onPublish, publishing, error }: SignStepProps) {
  return (
    <StepShell heading="Sign it." subheading="The names that will appear on the seal." onBack={onBack} hideContinue>
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div>
          <label className="block text-xs font-semibold tracking-wide uppercase text-text-3 mb-1.5">Your name (the sender)</label>
          <input
            value={senderName}
            onChange={e => onSenderNameChange(e.target.value)}
            placeholder="e.g. Priya"
            className="w-full bg-surface-2 border border-border rounded-lg px-3 py-2.5 text-sm text-text placeholder:text-text-3 focus:outline-none focus:border-brand"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold tracking-wide uppercase text-text-3 mb-1.5">Recipient&apos;s name</label>
          <input
            value={recipientName}
            onChange={e => onRecipientNameChange(e.target.value)}
            placeholder="e.g. Omkar"
            className="w-full bg-surface-2 border border-border rounded-lg px-3 py-2.5 text-sm text-text placeholder:text-text-3 focus:outline-none focus:border-brand"
          />
        </div>
      </div>

      <button onClick={onOpenPrivacy} className="flex items-center gap-1.5 text-sm text-text-2 font-semibold mb-6">
        <Lock className="w-4 h-4" /> Privacy settings
      </button>

      {error && <p className="text-sm text-danger mb-3">{error}</p>}

      <div className="bg-surface-2 rounded-2xl p-5">
        <p className="text-xs font-semibold tracking-wide uppercase text-text-3 mb-3">Ready to send</p>
        <Button onClick={onPublish} loading={publishing} className="w-full">
          Publish &amp; get share link <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </StepShell>
  )
}
