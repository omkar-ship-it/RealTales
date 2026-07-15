'use client'

/** Synthesized SFX via the Web Audio API — no asset files, timing locks precisely to
 * animation events instead of guessing offsets in a static clip. Prototype-only. */

let ctx: AudioContext | null = null
let noiseBuffer: AudioBuffer | null = null

function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null
  try {
    if (!ctx) {
      const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
      if (!Ctor) return null
      ctx = new Ctor()
    }
    if (ctx.state === 'suspended') ctx.resume()
    return ctx
  } catch {
    return null
  }
}

function getNoiseBuffer(context: AudioContext): AudioBuffer {
  if (noiseBuffer) return noiseBuffer
  const length = context.sampleRate * 1
  const buffer = context.createBuffer(1, length, context.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < length; i++) data[i] = Math.random() * 2 - 1
  noiseBuffer = buffer
  return buffer
}

interface NoiseOpts {
  duration: number
  filterFreq: number
  filterFreqEnd?: number
  filterQ?: number
  type?: BiquadFilterType
  gain?: number
}

function playFilteredNoise(context: AudioContext, opts: NoiseOpts) {
  const { duration, filterFreq, filterFreqEnd, filterQ = 1, type = 'bandpass', gain = 0.3 } = opts
  const src = context.createBufferSource()
  src.buffer = getNoiseBuffer(context)
  const filter = context.createBiquadFilter()
  filter.type = type
  filter.frequency.setValueAtTime(filterFreq, context.currentTime)
  if (filterFreqEnd) filter.frequency.exponentialRampToValueAtTime(filterFreqEnd, context.currentTime + duration)
  filter.Q.value = filterQ
  const g = context.createGain()
  g.gain.setValueAtTime(0, context.currentTime)
  g.gain.linearRampToValueAtTime(gain, context.currentTime + 0.01)
  g.gain.exponentialRampToValueAtTime(0.001, context.currentTime + duration)
  src.connect(filter).connect(g).connect(context.destination)
  src.start()
  src.stop(context.currentTime + duration + 0.05)
}

export function playSealCrack() {
  const context = getCtx()
  if (!context) return
  playFilteredNoise(context, { duration: 0.12, filterFreq: 3000, filterQ: 6, gain: 0.25 })
  const osc = context.createOscillator()
  osc.type = 'square'
  osc.frequency.setValueAtTime(800, context.currentTime)
  osc.frequency.exponentialRampToValueAtTime(200, context.currentTime + 0.06)
  const g = context.createGain()
  g.gain.setValueAtTime(0.15, context.currentTime)
  g.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.08)
  osc.connect(g).connect(context.destination)
  osc.start()
  osc.stop(context.currentTime + 0.1)
}

export function playPaperRustle() {
  const context = getCtx()
  if (!context) return
  playFilteredNoise(context, { duration: 0.4, filterFreq: 2000, filterFreqEnd: 4000, filterQ: 0.7, gain: 0.12 })
}

export function playWhoosh() {
  const context = getCtx()
  if (!context) return
  playFilteredNoise(context, { duration: 0.6, filterFreq: 200, filterFreqEnd: 3000, filterQ: 0.5, type: 'lowpass', gain: 0.18 })
}

export function playCrease() {
  const context = getCtx()
  if (!context) return
  playFilteredNoise(context, { duration: 0.08, filterFreq: 1800, filterQ: 8, gain: 0.2 })
}

export function playChime() {
  const context = getCtx()
  if (!context) return
  const freqs = [880, 1108.73, 1318.51]
  freqs.forEach((f, i) => {
    const osc = context.createOscillator()
    osc.type = 'sine'
    osc.frequency.value = f
    const g = context.createGain()
    g.gain.setValueAtTime(0, context.currentTime)
    g.gain.linearRampToValueAtTime(0.12, context.currentTime + 0.02 + i * 0.03)
    g.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 1.4)
    osc.connect(g).connect(context.destination)
    osc.start(context.currentTime + i * 0.03)
    osc.stop(context.currentTime + 1.5)
  })
}

export function playHeartBurst() {
  const context = getCtx()
  if (!context) return
  const osc = context.createOscillator()
  osc.type = 'triangle'
  osc.frequency.setValueAtTime(500, context.currentTime)
  osc.frequency.exponentialRampToValueAtTime(1200, context.currentTime + 0.15)
  const g = context.createGain()
  g.gain.setValueAtTime(0.2, context.currentTime)
  g.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.3)
  osc.connect(g).connect(context.destination)
  osc.start()
  osc.stop(context.currentTime + 0.35)
}
