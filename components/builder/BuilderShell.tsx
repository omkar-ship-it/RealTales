'use client'
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Check, Copy } from 'lucide-react'
import { saveCard } from '@/lib/mock-store'
import { getTemplate } from '@/lib/templates'
import { OCCASION_META } from '@/lib/occasions'
import { readDraft, writeDraft, clearDraft } from '@/lib/draft-store'
import type { Scene, OccasionType, PrivacyMode } from '@/lib/types'
import { BuilderHeader } from './BuilderHeader'
import { SenderWizard } from './wizard/SenderWizard'
import { PrivacySettingsModal } from './PrivacySettingsModal'
import { LetterPages } from '@/components/reveal/LetterPages'
import { useHistory } from './canvas/useHistory'

interface BuilderShellProps {
  initialOccasion: OccasionType
}

const sceneFingerprint = (scenes: Scene[]) =>
  JSON.stringify(scenes.map(s => ({ layout: s.layout, heading: s.heading, body: s.body, imageUrl: s.imageUrl })))

export function BuilderShell({ initialOccasion }: BuilderShellProps) {
  const router = useRouter()
  const [occasion, setOccasion] = useState<OccasionType>(initialOccasion)
  const meta = OCCASION_META[occasion]
  const template = getTemplate(occasion)

  const [title, setTitle] = useState(template.name)
  const [recipientName, setRecipientName] = useState('')
  const [senderName, setSenderName] = useState('')
  const { state: scenes, set: setScenes, undo, redo, canUndo, canRedo } = useHistory<Scene[]>(
    () => template.scenes.map(s => ({ ...s, id: crypto.randomUUID() })),
  )
  const [musicTrackId, setMusicTrackId] = useState<string | null>(template.defaultMusicTrackId)
  const [privacyMode, setPrivacyMode] = useState<PrivacyMode>('open')
  const [recipientEmail, setRecipientEmail] = useState('')
  const [passcodeEnabled, setPasscodeEnabled] = useState(false)
  const [passcode, setPasscode] = useState('')
  const [privacyOpen, setPrivacyOpen] = useState(false)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [shareUrl, setShareUrl] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle')
  const restoredRef = useRef(false)
  const skipNextAutosaveRef = useRef(true)

  const updateScene = (id: string, patch: Partial<Scene>) =>
    setScenes(prev => prev.map(s => (s.id === id ? { ...s, ...patch } : s)))

  const removeScene = (id: string) =>
    setScenes(prev => (prev.length > 1 ? prev.filter(s => s.id !== id) : prev))

  const addBlankScene = () =>
    setScenes(prev => [...prev, {
      id: crypto.randomUUID(),
      layout: 'quote',
      interaction: 'auto',
      transition: 'fade',
      durationMs: 4000,
      body: '',
      background: { from: meta.accentFrom, to: meta.accentTo },
    }])

  const applyPalette = (from: string, to: string) =>
    setScenes(prev => prev.map(s => ({ ...s, background: { from, to } })))

  const handleSelectOccasion = (next: OccasionType) => {
    if (next === occasion) return
    const isTemplateFresh = scenes.every(s => !s.interaction || s.interaction === 'auto') && sceneFingerprint(scenes) === sceneFingerprint(template.scenes)
    if (!isTemplateFresh) {
      const proceed = window.confirm('Switching occasions will replace your drafted scenes — continue?')
      if (!proceed) return
    }
    const nextTemplate = getTemplate(next)
    setOccasion(next)
    setScenes(nextTemplate.scenes.map(s => ({ ...s, id: crypto.randomUUID() })))
    setMusicTrackId(nextTemplate.defaultMusicTrackId)
    if (title === template.name) setTitle(nextTemplate.name)
  }

  const readAsDataUrl = (file: File) => new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })

  const handleImageSelect = async (sceneId: string, file: File) => {
    const dataUrl = await readAsDataUrl(file)
    updateScene(sceneId, { imageUrl: dataUrl })
  }

  // Global undo/redo — skipped while typing so it doesn't fight native text-field undo.
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement
      const typing = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable
      if (typing || !(e.metaKey || e.ctrlKey) || e.key.toLowerCase() !== 'z') return
      e.preventDefault()
      if (e.shiftKey) redo()
      else undo()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [undo, redo])

  // Restore an in-progress draft on mount (once) — refreshing mid-edit shouldn't lose work.
  useEffect(() => {
    if (restoredRef.current) return
    restoredRef.current = true
    const draft = readDraft()
    if (!draft) return
    setOccasion(draft.occasion)
    setTitle(draft.title)
    setRecipientName(draft.recipientName)
    setSenderName(draft.senderName)
    setScenes(draft.scenes)
    setMusicTrackId(draft.musicTrackId)
    setPrivacyMode(draft.privacyMode)
    setRecipientEmail(draft.recipientEmail)
    setPasscodeEnabled(draft.passcodeEnabled)
    setPasscode(draft.passcode)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Debounced autosave of in-progress edits.
  useEffect(() => {
    if (shareUrl) return
    if (skipNextAutosaveRef.current) { skipNextAutosaveRef.current = false; return }
    setSaveStatus('saving')
    const t = setTimeout(() => {
      writeDraft({ occasion, title, recipientName, senderName, scenes, musicTrackId, privacyMode, recipientEmail, passcodeEnabled, passcode })
      setSaveStatus('saved')
    }, 500)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [occasion, title, recipientName, senderName, scenes, musicTrackId, privacyMode, recipientEmail, passcodeEnabled, passcode])

  const handlePublish = () => {
    setError(null)
    if (!title.trim()) return setError('Give this letter a title.')
    if (privacyMode === 'email_gated' && !recipientEmail.trim()) return setError("Add the recipient's email to keep this private.")
    if (passcodeEnabled && !passcode.trim()) return setError('Set a passcode, or turn it off.')

    setSaving(true)
    try {
      const card = saveCard({
        senderId: 'demo-sender',
        senderName: senderName.trim() || 'A friend',
        occasion,
        title: title.trim(),
        recipientName: recipientName.trim() || undefined,
        scenes,
        musicTrackId,
        privacyMode,
        recipientEmail: privacyMode === 'email_gated' ? recipientEmail.trim() : null,
        passcode: passcodeEnabled ? passcode.trim() : undefined,
      })
      clearDraft()
      setShareUrl(`${window.location.origin}/c/${card.shareSlug}`)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong — try again.')
    } finally {
      setSaving(false)
    }
  }

  if (shareUrl) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 bg-bg">
        <div className="wc-card p-8 max-w-md text-center">
          <p className="text-4xl mb-4">{meta.emoji}</p>
          <p className="font-display text-xl font-semibold text-text mb-2">It&apos;s ready to send</p>
          <p className="text-sm text-text-2 mb-6">Share this link — anyone who opens it gets the full experience, no account needed.</p>
          <div className="flex items-center gap-2 bg-surface-2 border border-border rounded-xl px-3 py-2.5 mb-4">
            <p className="text-sm text-text truncate flex-1 text-left">{shareUrl}</p>
            <button
              onClick={() => { navigator.clipboard.writeText(shareUrl); setCopied(true); setTimeout(() => setCopied(false), 1500) }}
              className="shrink-0 text-brand"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
          <div className="flex flex-col gap-2">
            <a
              href={`https://wa.me/?text=${encodeURIComponent(`I made you something 🎁 ${shareUrl}`)}`}
              target="_blank" rel="noreferrer"
              className="w-full py-3 rounded-xl bg-brand text-white font-semibold text-sm"
            >
              Share on WhatsApp
            </a>
            <button onClick={() => router.push('/dashboard')} className="w-full py-2 text-sm text-text-2">
              Go to My Moments
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col bg-bg">
      {previewOpen && (
        <div className="fixed inset-0 z-50">
          <LetterPages
            scenes={scenes}
            senderName={senderName}
            recipientName={recipientName}
            accentFrom={meta.accentFrom}
            accentTo={meta.accentTo}
            onComplete={() => setPreviewOpen(false)}
          />
          <button
            onClick={() => setPreviewOpen(false)}
            className="fixed top-4 right-4 z-[60] w-9 h-9 rounded-full bg-white/15 backdrop-blur text-white flex items-center justify-center"
          >
            ✕
          </button>
        </div>
      )}

      {privacyOpen && (
        <PrivacySettingsModal
          privacyMode={privacyMode}
          onPrivacyModeChange={setPrivacyMode}
          recipientEmail={recipientEmail}
          onRecipientEmailChange={setRecipientEmail}
          passcodeEnabled={passcodeEnabled}
          onPasscodeEnabledChange={setPasscodeEnabled}
          passcode={passcode}
          onPasscodeChange={setPasscode}
          onClose={() => setPrivacyOpen(false)}
        />
      )}

      <BuilderHeader
        meta={meta}
        title={title}
        onTitleChange={setTitle}
        saveStatus={saveStatus}
        canUndo={canUndo}
        canRedo={canRedo}
        onUndo={undo}
        onRedo={redo}
        onOpenPrivacy={() => setPrivacyOpen(true)}
        onPreview={() => setPreviewOpen(true)}
        onPublish={handlePublish}
        publishing={saving}
      />

      {error && <p className="text-sm text-danger px-4 pt-3">{error}</p>}

      <SenderWizard
        title={title}
        onTitleChange={setTitle}
        senderName={senderName}
        onSenderNameChange={setSenderName}
        recipientName={recipientName}
        onRecipientNameChange={setRecipientName}
        occasion={occasion}
        onSelectOccasion={handleSelectOccasion}
        scenes={scenes}
        onSceneChange={updateScene}
        onSceneRemove={removeScene}
        onAddScene={addBlankScene}
        onImageSelect={handleImageSelect}
        onApplyPalette={applyPalette}
        musicTrackId={musicTrackId}
        onMusicChange={setMusicTrackId}
        accentFrom={meta.accentFrom}
        accentTo={meta.accentTo}
        onOpenPrivacy={() => setPrivacyOpen(true)}
        onPublish={handlePublish}
        publishing={saving}
        error={error}
      />
    </div>
  )
}
