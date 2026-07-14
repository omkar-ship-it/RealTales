'use client'
import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Heart, Share2, RotateCcw, Send, Check } from 'lucide-react'
import { Starfield } from './Starfield'
import { getRevealState, incrementHearts, saveReply } from '@/lib/reveal-store'

interface EndingScreenProps {
  slug: string
  senderName: string
  recipientName?: string
  onWatchAgain: () => void
}

/**
 * Reframed from a plain reaction screen into a two-way moment — "don't leave
 * it unsaid" applies to the recipient too, not just the sender. The viral
 * loop CTA is framed as coming from the sender's generosity, not product
 * marketing, and appears last/smallest so it doesn't compete with the reply.
 */
export function EndingScreen({ slug, senderName, recipientName, onWatchAgain }: EndingScreenProps) {
  const [hearts, setHearts] = useState(() => getRevealState(slug).hearts ?? 0)
  const [reply, setReply] = useState('')
  const [sent, setSent] = useState(() => !!getRevealState(slug).reply)
  const [copied, setCopied] = useState(false)

  const sendReply = () => {
    if (!reply.trim()) return
    saveReply(slug, reply.trim())
    setSent(true)
  }

  const shareUrl = typeof window !== 'undefined' ? window.location.href : ''

  const share = async () => {
    if (navigator.share) {
      navigator.share({ url: shareUrl, title: 'RealTales' }).catch(() => {})
      return
    }
    await navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="fixed inset-0 bg-[#120E0A] overflow-hidden flex flex-col items-center justify-center px-8 text-center overflow-y-auto py-16">
      <Starfield count={35} />

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 w-full max-w-sm">
        <p className="font-display italic text-3xl sm:text-4xl text-white leading-snug mb-2">Don&apos;t leave it unsaid.</p>
        <p className="text-sm text-white/60 mb-8">Send a heart back, or write a line of your own.</p>

        {!sent ? (
          <div className="flex items-center gap-2 mb-4">
            <input
              value={reply}
              onChange={e => setReply(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendReply()}
              placeholder={`A line for ${senderName || 'them'}…`}
              className="flex-1 bg-white/10 border border-white/15 rounded-xl px-3.5 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-white/40"
            />
            <button
              onClick={sendReply}
              disabled={!reply.trim()}
              className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 disabled:opacity-40"
              style={{ background: 'linear-gradient(160deg, #F3D9A8 0%, #D9A441 100%)' }}
            >
              <Send className="w-4 h-4 text-[#2B2140]" />
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2 mb-4 text-sm text-white/60">
            <Check className="w-4 h-4 text-[#D9A441]" /> Sent — they&apos;ll feel that.
          </div>
        )}

        <div className="flex items-center justify-center gap-2.5 flex-wrap mb-10">
          <button
            onClick={() => { const n = incrementHearts(slug); setHearts(n) }}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-full font-semibold text-sm text-[#2B2140]"
            style={{ background: 'linear-gradient(160deg, #F3D9A8 0%, #D9A441 100%)' }}
          >
            <Heart className="w-4 h-4 fill-current" /> Send a heart {hearts > 0 && <span className="opacity-70">· {hearts}</span>}
          </button>
          <button onClick={share} className="flex items-center gap-1.5 px-5 py-2.5 rounded-full font-semibold text-sm text-white border border-white/20 hover:bg-white/5 transition-colors">
            <Share2 className="w-4 h-4" /> {copied ? 'Link copied' : 'Share this letter'}
          </button>
          <button onClick={onWatchAgain} className="flex items-center gap-1.5 px-5 py-2.5 rounded-full font-semibold text-sm text-white border border-white/20 hover:bg-white/5 transition-colors">
            <RotateCcw className="w-4 h-4" /> Watch again
          </button>
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="border-t border-white/10 pt-6">
          <p className="text-xs text-white/40 mb-2">
            This is how {senderName || 'someone'} made {recipientName || 'someone'} feel.
          </p>
          <Link href="/create" className="text-sm text-[#D9A441] font-semibold underline underline-offset-2">
            Write your own letter →
          </Link>
        </motion.div>
      </motion.div>
    </div>
  )
}
