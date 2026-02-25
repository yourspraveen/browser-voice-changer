// Generate kid-friendly voice demo samples using formant synthesis
// Run with: node scripts/generate-samples.mjs

import { writeFileSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const samplesDir = join(__dirname, '../public/samples')
mkdirSync(samplesDir, { recursive: true })

const SAMPLE_RATE = 44100

function writeWAV(filename, samples, sampleRate = SAMPLE_RATE) {
  const numSamples = samples.length
  const dataLength = numSamples * 2
  const buffer = Buffer.alloc(44 + dataLength)

  buffer.write('RIFF', 0)
  buffer.writeUInt32LE(36 + dataLength, 4)
  buffer.write('WAVE', 8)
  buffer.write('fmt ', 12)
  buffer.writeUInt32LE(16, 16)
  buffer.writeUInt16LE(1, 20)       // PCM
  buffer.writeUInt16LE(1, 22)       // mono
  buffer.writeUInt32LE(sampleRate, 24)
  buffer.writeUInt32LE(sampleRate * 2, 28)
  buffer.writeUInt16LE(2, 32)
  buffer.writeUInt16LE(16, 34)      // 16-bit
  buffer.write('data', 36)
  buffer.writeUInt32LE(dataLength, 40)

  let offset = 44
  for (const s of samples) {
    const clamped = Math.max(-1, Math.min(1, s))
    const int16 = clamped < 0 ? clamped * 0x8000 : clamped * 0x7FFF
    buffer.writeInt16LE(Math.round(int16), offset)
    offset += 2
  }

  writeFileSync(join(samplesDir, filename), buffer)
  console.log(`Created: ${filename} (${(samples.length / sampleRate).toFixed(2)}s)`)
}

// Normalize to target peak amplitude
function normalize(samples, targetPeak = 0.88) {
  let max = 0
  for (const s of samples) {
    const a = Math.abs(s)
    if (a > max) max = a
  }
  if (max === 0) return samples
  return samples.map(s => s * targetPeak / max)
}

// Smooth fade envelope for a time segment
function fade(t, tStart, tEnd, fadeIn = 0.06, fadeOut = 0.09) {
  if (t <= tStart || t >= tEnd) return 0
  const fi = Math.min((t - tStart) / fadeIn, 1)
  const fo = Math.min((tEnd - t) / fadeOut, 1)
  return fi * fo
}

// Linear interpolate between two values
function lerp(a, b, k) { return a + (b - a) * Math.max(0, Math.min(1, k)) }

// ─── FORMANT SYNTHESIS ───────────────────────────────────────────────────────
// Approximates a voiced speech sound using a harmonic source (glottal pulse)
// shaped by resonance peaks (formants) at specific frequencies.
//
// formants: [[centerHz, bandwidthHz], ...]
// vibrato: subtle pitch wobble amount (0 = none, 0.015 = gentle)
//
// Each harmonic h has amplitude 1/h^1.15 (glottal source roll-off),
// then each formant adds a Lorentzian resonance gain around its center.
function voiceAt(t, f0, formants, vibrato = 0.012) {
  const f0v = f0 * (1 + vibrato * Math.sin(2 * Math.PI * 5.5 * t))
  let s = 0
  for (let h = 1; h <= 40; h++) {
    const freq = f0v * h
    if (freq > 7500) break
    const srcAmp = 1 / Math.pow(h, 1.15)
    let fGain = 0
    for (const [fc, bw] of formants) {
      const q = fc / bw
      const norm = (freq - fc) / fc
      fGain += 1 / (1 + q * q * norm * norm)
    }
    s += srcAmp * fGain * Math.sin(2 * Math.PI * freq * t)
  }
  return s
}

// ─── CHILD VOICE FORMANTS ────────────────────────────────────────────────────
// Formant pairs [F1, F2, F3] for a child's voice (~age 8, slightly higher
// than adult female). Each entry: [centerFreq Hz, bandwidth Hz]
const AH = [[900, 140], [1450, 200], [2750, 260]]  // "ahh" — open vowel
const EE = [[310,  90], [2730, 195], [3100, 240]]  // "eee" — bright front vowel
const OH = [[540, 130], [900,  170], [2450, 250]]  // "ohh" — rounded back vowel
const OO = [[285,  90], [760,  150], [2280, 240]]  // "ooo" — rounded close vowel
const EH = [[590, 140], [1920, 200], [2700, 250]]  // "ehh" — as in "hey"
const AY = [[610, 145], [2060, 210], [2820, 260]]  // "ayy" — as in "say"

// Blend two formant sets by fraction k (0 = a, 1 = b)
function blendFormants(a, b, k) {
  return a.map((fa, i) => [lerp(fa[0], b[i][0], k), lerp(fa[1], b[i][1], k)])
}

const F0 = 285  // child speaking fundamental ~285 Hz

// =============================================================================
// SAMPLE 1: "Ahh - Eee - Ohh"
// Three clear vowel sounds at child voice pitch. Perfect for showing how
// Chipmunk/Deep Voice shift the vowel character, and Robot transforms it.
// =============================================================================
{
  const dur = 3.3
  const raw = new Array(Math.floor(SAMPLE_RATE * dur)).fill(0)

  for (let i = 0; i < raw.length; i++) {
    const t = i / SAMPLE_RATE
    const ahEnv = fade(t, 0.05, 1.02, 0.07, 0.10)
    const eeEnv = fade(t, 1.18, 2.15, 0.07, 0.10)
    const ohEnv = fade(t, 2.30, 3.25, 0.07, 0.10)
    raw[i] =
      ahEnv * voiceAt(t, F0,        AH, 0.012) +
      eeEnv * voiceAt(t, F0 * 1.08, EE, 0.010) +
      ohEnv * voiceAt(t, F0 * 0.96, OH, 0.014)
  }

  writeWAV('sine-440.wav', normalize(raw))
}

// =============================================================================
// SAMPLE 2: "La La La" — sung melody  C5–E5–G5–E5–C5
// Each note uses "La" vowel (quick EH → AH transition). With Chipmunk this
// becomes a classic Alvin & the Chipmunks-style tune.
// =============================================================================
{
  // Notes: [freq Hz, start s, end s]
  const notes = [
    [523.25, 0.00, 0.48],  // C5 "La"
    [659.25, 0.58, 1.06],  // E5 "La"
    [783.99, 1.16, 1.64],  // G5 "La"
    [659.25, 1.74, 2.22],  // E5 "La"
    [523.25, 2.32, 2.92],  // C5 "La" (held longer)
  ]

  const dur = 3.1
  const raw = new Array(Math.floor(SAMPLE_RATE * dur)).fill(0)

  for (let i = 0; i < raw.length; i++) {
    const t = i / SAMPLE_RATE
    for (const [noteFreq, tS, tE] of notes) {
      const env = fade(t, tS, tE, 0.04, 0.12)
      if (env === 0) continue
      // "L" onset: quick blend from EH to AH over first 70ms of each note
      const laK = Math.min((t - tS) / 0.07, 1)
      const formants = blendFormants(EH, AH, laK)
      // Singing vibrato is slightly more than speech
      raw[i] += env * voiceAt(t, noteFreq, formants, 0.009)
    }
  }

  writeWAV('sweep.wav', normalize(raw))
}

// =============================================================================
// SAMPLE 3: "Hello! Woo-hoo!" — excited greeting
// Two syllables of "Hello" then an excited "Woo-hoo!" with rising pitch.
// Deep Voice sounds like a giant; Chipmunk is hilariously squeaky.
// =============================================================================
{
  const dur = 3.2
  const raw = new Array(Math.floor(SAMPLE_RATE * dur)).fill(0)

  for (let i = 0; i < raw.length; i++) {
    const t = i / SAMPLE_RATE

    // "HEH" — 0.05–0.38s, slight pitch rise (270→292 Hz)
    {
      const env = fade(t, 0.05, 0.38, 0.05, 0.07)
      if (env > 0) {
        const f0 = lerp(270, 292, (t - 0.05) / 0.33)
        raw[i] += env * voiceAt(t, f0, EH, 0.010)
      }
    }

    // "LOH" — 0.34–0.80s, blend EH→OH, slight pitch fall (292→280 Hz)
    {
      const env = fade(t, 0.34, 0.80, 0.05, 0.10)
      if (env > 0) {
        const k = Math.min((t - 0.34) / 0.25, 1)
        const f0 = lerp(292, 280, k)
        raw[i] += env * voiceAt(t, f0, blendFormants(EH, OH, k), 0.012)
      }
    }

    // "WOO" — 1.05–1.65s, pitch rockets up 295→385 Hz (excitement!)
    {
      const env = fade(t, 1.05, 1.65, 0.04, 0.08)
      if (env > 0) {
        const k = Math.min((t - 1.05) / 0.30, 1)
        const f0 = lerp(295, 385, k)
        raw[i] += env * voiceAt(t, f0, OO, 0.018)
      }
    }

    // "HOO" — 1.62–2.35s, starts high then settles (385→345 Hz)
    {
      const env = fade(t, 1.62, 2.35, 0.05, 0.18)
      if (env > 0) {
        const f0 = lerp(385, 345, (t - 1.62) / 0.73)
        raw[i] += env * voiceAt(t, f0, OO, 0.015)
      }
    }
  }

  writeWAV('demo-voice.wav', normalize(raw))
}

console.log('\nAll demo samples generated successfully!')
