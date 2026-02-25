// Generate synthetic demo audio WAV files for the voice changer
// Run with: node scripts/generate-samples.mjs

import { writeFileSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const samplesDir = join(__dirname, '../public/samples')
mkdirSync(samplesDir, { recursive: true })

const SAMPLE_RATE = 44100
const BIT_DEPTH = 16

function writeWAV(filename, samples, sampleRate = SAMPLE_RATE) {
  const numSamples = samples.length
  const dataLength = numSamples * 2 // 16-bit = 2 bytes per sample
  const buffer = Buffer.alloc(44 + dataLength)

  // RIFF header
  buffer.write('RIFF', 0)
  buffer.writeUInt32LE(36 + dataLength, 4)
  buffer.write('WAVE', 8)
  buffer.write('fmt ', 12)
  buffer.writeUInt32LE(16, 16)      // chunk size
  buffer.writeUInt16LE(1, 20)       // PCM
  buffer.writeUInt16LE(1, 22)       // mono
  buffer.writeUInt32LE(sampleRate, 24)
  buffer.writeUInt32LE(sampleRate * 2, 28)  // byte rate
  buffer.writeUInt16LE(2, 32)       // block align
  buffer.writeUInt16LE(BIT_DEPTH, 34)
  buffer.write('data', 36)
  buffer.writeUInt32LE(dataLength, 40)

  let offset = 44
  for (const sample of samples) {
    const clamped = Math.max(-1, Math.min(1, sample))
    const int16 = clamped < 0 ? clamped * 0x8000 : clamped * 0x7FFF
    buffer.writeInt16LE(Math.round(int16), offset)
    offset += 2
  }

  writeFileSync(join(samplesDir, filename), buffer)
  console.log(`Created: ${filename} (${(samples.length / sampleRate).toFixed(2)}s)`)
}

// 1. Sine tone - 440 Hz A note, 2 seconds
const sineDuration = 2
const sineSamples = Array.from({ length: Math.floor(SAMPLE_RATE * sineDuration) }, (_, i) => {
  const t = i / SAMPLE_RATE
  // Apply fade in/out to avoid clicks
  const fade = Math.min(t / 0.05, 1, (sineDuration - t) / 0.1)
  return 0.7 * Math.sin(2 * Math.PI * 440 * t) * fade
})
writeWAV('sine-440.wav', sineSamples)

// 2. Frequency sweep - 200 Hz to 3000 Hz over 3 seconds
const sweepDuration = 3
const sweepSamples = Array.from({ length: Math.floor(SAMPLE_RATE * sweepDuration) }, (_, i) => {
  const t = i / SAMPLE_RATE
  const freq = 200 * Math.pow(3000 / 200, t / sweepDuration)
  const phase = 2 * Math.PI * freq
  const fade = Math.min(t / 0.05, 1, (sweepDuration - t) / 0.1)
  return 0.6 * Math.sin(phase * t) * fade
})
writeWAV('sweep.wav', sweepSamples)

// 3. Demo voice - synthesized voice-like sound (vowel "ah" approximation)
// Using formants for vowel synthesis: F1=800Hz, F2=1200Hz
const voiceDuration = 3
const voiceSamples = Array.from({ length: Math.floor(SAMPLE_RATE * voiceDuration) }, (_, i) => {
  const t = i / SAMPLE_RATE
  const fade = Math.min(t / 0.05, 1, (voiceDuration - t) / 0.1)

  // Fundamental + harmonics (speech-like)
  const f0 = 150 // fundamental (adult speaking pitch)
  let s = 0
  for (let h = 1; h <= 12; h++) {
    const freq = f0 * h
    const amplitude = 1 / (h * 1.2) // decreasing harmonics
    s += amplitude * Math.sin(2 * Math.PI * freq * t)
  }

  // Add slight vibrato
  const vibrato = 1 + 0.02 * Math.sin(2 * Math.PI * 5 * t)

  return 0.4 * s * vibrato * fade
})
writeWAV('demo-voice.wav', voiceSamples)

console.log('\nAll demo samples generated successfully!')
console.log('Place them in public/samples/ directory.')
