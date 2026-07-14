import type { Scene } from '@/lib/types'

interface LetterPageContentProps {
  scene: Scene
  index: number
  total: number
  accentFrom: string
  accentTo: string
}

/** Renders one "page" of the letter as paper — text/quote scenes read like handwriting,
 * image/video scenes read like a photograph tucked into the page. Every page shares the
 * same paper surface so the book-flip metaphor stays coherent regardless of scene layout. */
export function LetterPageContent({ scene, index, total, accentFrom, accentTo }: LetterPageContentProps) {
  return (
    <div className="paper-grain absolute inset-0 rounded-2xl bg-[#FBF6EC] shadow-2xl overflow-hidden flex flex-col">
      <div className="flex-1 min-h-0 overflow-y-auto px-8 py-10 sm:px-12 sm:py-14">
        {scene.layout === 'quote' ? (
          <QuotePage scene={scene} index={index} />
        ) : scene.layout === 'image-only' || scene.layout === 'image-text' ? (
          <PhotoPage scene={scene} accentFrom={accentFrom} accentTo={accentTo} />
        ) : scene.layout === 'video' ? (
          <VideoPage scene={scene} accentFrom={accentFrom} accentTo={accentTo} />
        ) : (
          <TextPage scene={scene} />
        )}
      </div>
      <p className="text-center text-[11px] tracking-[0.15em] uppercase text-[#8B7E68] pb-4 select-none">
        Page {index + 1} of {total}
      </p>
    </div>
  )
}

function QuotePage({ scene, index }: { scene: Scene; index: number }) {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center">
      <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#B5822C] mb-6">
        Scene {String(index + 1).padStart(2, '0')}
      </p>
      <p className="font-display italic text-2xl sm:text-3xl text-[#2B2140] leading-snug max-w-md">
        &ldquo;{scene.body}&rdquo;
      </p>
      {scene.attribution && (
        <p className="font-hand text-xl text-[#7A7089] mt-6">— {scene.attribution}</p>
      )}
    </div>
  )
}

function TextPage({ scene }: { scene: Scene }) {
  return (
    <div className="h-full flex flex-col justify-center">
      {scene.heading && (
        <p className="font-display italic text-2xl sm:text-3xl text-[#2B2140] mb-5">{scene.heading}</p>
      )}
      {scene.body && (
        <p className="font-hand text-2xl sm:text-[28px] leading-[1.5] text-[#3B2F2F] whitespace-pre-wrap">
          {scene.body}
        </p>
      )}
    </div>
  )
}

function PhotoPage({ scene, accentFrom, accentTo }: { scene: Scene; accentFrom: string; accentTo: string }) {
  return (
    <div className="h-full flex flex-col items-center justify-center gap-6">
      <div className="bg-white p-2.5 pb-6 shadow-lg -rotate-2">
        <div className="w-56 h-56 sm:w-64 sm:h-64 overflow-hidden">
          {scene.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={scene.imageUrl} alt="" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full" style={{ background: `linear-gradient(160deg, ${accentFrom} 0%, ${accentTo} 100%)` }} />
          )}
        </div>
      </div>
      {(scene.heading || scene.body) && (
        <div className="text-center max-w-xs">
          {scene.heading && <p className="font-hand text-2xl text-[#2B2140] mb-1">{scene.heading}</p>}
          {scene.body && <p className="font-hand text-lg text-[#7A7089] leading-snug">{scene.body}</p>}
        </div>
      )}
    </div>
  )
}

function VideoPage({ scene, accentFrom, accentTo }: { scene: Scene; accentFrom: string; accentTo: string }) {
  return (
    <div className="h-full flex flex-col items-center justify-center gap-6">
      <div className="bg-white p-2.5 pb-6 shadow-lg rotate-1">
        <div className="w-60 h-40 sm:w-72 sm:h-48 overflow-hidden bg-black">
          {scene.videoUrl ? (
            <video src={scene.videoUrl} autoPlay muted loop playsInline className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full" style={{ background: `linear-gradient(160deg, ${accentFrom} 0%, ${accentTo} 100%)` }} />
          )}
        </div>
      </div>
      {(scene.heading || scene.body) && (
        <div className="text-center max-w-xs">
          {scene.heading && <p className="font-hand text-2xl text-[#2B2140] mb-1">{scene.heading}</p>}
          {scene.body && <p className="font-hand text-lg text-[#7A7089] leading-snug">{scene.body}</p>}
        </div>
      )}
    </div>
  )
}
