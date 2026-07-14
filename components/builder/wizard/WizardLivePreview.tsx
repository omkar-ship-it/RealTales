import type { Scene } from '@/lib/types'
import { LetterPageContent } from '@/components/reveal/LetterPageContent'

interface WizardLivePreviewProps {
  scene: Scene
  index: number
  total: number
  accentFrom: string
  accentTo: string
}

/** Live, accurate preview — literally renders the same LetterPageContent the recipient
 * will see (scaled down), so what senders preview here never drifts from reality. */
export function WizardLivePreview({ scene, index, total, accentFrom, accentTo }: WizardLivePreviewProps) {
  return (
    <div className="hidden lg:flex flex-col items-center px-6 py-8 w-[320px] shrink-0 border-l border-border bg-surface-2/40 overflow-y-auto">
      <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-text-3 mb-4 self-start">Live preview</p>
      <div className="relative w-[220px] h-[460px] rounded-[2rem] border-[6px] border-text bg-black overflow-hidden shadow-lg shrink-0">
        <div className="absolute top-0 inset-x-0 h-5 flex items-center justify-center z-10">
          <div className="w-16 h-3.5 rounded-full bg-text" />
        </div>
        <div className="absolute inset-0 bg-[#120E0A]">
          <div style={{ position: 'absolute', left: '50%', top: '50%', width: 380, height: 460, transform: 'translate(-50%, -50%) scale(0.52)' }}>
            <LetterPageContent scene={scene} index={index} total={total} accentFrom={accentFrom} accentTo={accentTo} />
          </div>
        </div>
      </div>
      <p className="text-xs text-text-3 mt-4 text-center max-w-[220px]">
        The recipient reads this as a page they can turn — with your music, your words, and photos tucked in along the way.
      </p>
    </div>
  )
}
