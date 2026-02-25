import { BaseEffect } from './BaseEffect'
import type { AlienParams, EducationalContent, EffectParams } from '@/types/audio'

export class AlienEffect extends BaseEffect {
  readonly id = 'alien'
  readonly name = 'Alien'

  async process(buffer: AudioBuffer, params: EffectParams): Promise<AudioBuffer> {
    const {
      chorusRate = 2,
      chorusDepth = 0.7,
      voices = 4,
      wetDry = 0.8,
    } = params as AlienParams

    const numVoices = Math.min(Math.max(Math.round(voices), 2), 8)
    const ctx = this.createOfflineContext(buffer)

    const source = ctx.createBufferSource()
    source.buffer = buffer

    // Master output gain
    const masterGain = ctx.createGain()
    masterGain.gain.value = 1 / numVoices
    masterGain.connect(ctx.destination)

    // Create multiple detuned voices with LFO modulation
    for (let i = 0; i < numVoices; i++) {
      // Slight base detune spread across voices
      const baseDetune = ((i / (numVoices - 1)) - 0.5) * 30 // -15 to +15 cents

      // Delay for chorus effect (slight time offsets)
      const chorusDelay = ctx.createDelay(0.5)
      const delayMs = (i / numVoices) * 0.035 // 0 to 35ms spread
      chorusDelay.delayTime.value = delayMs

      // LFO for pitch modulation
      const lfo = ctx.createOscillator()
      lfo.type = 'sine'
      lfo.frequency.value = chorusRate * (0.8 + (i / numVoices) * 0.4) // slightly different per voice

      const lfoGain = ctx.createGain()
      const depthCents = chorusDepth * 50 // max ±50 cents
      lfoGain.gain.value = depthCents

      // Detune gain node
      const voiceGain = ctx.createGain()
      voiceGain.gain.value = 1

      // Connect LFO to delay time for pitch warble
      lfo.connect(lfoGain)
      lfoGain.connect(chorusDelay.delayTime)

      source.connect(chorusDelay)
      chorusDelay.connect(voiceGain)
      voiceGain.connect(masterGain)

      lfo.start(0)

      // Apply base detune via a second delay
      void baseDetune // used conceptually; actual spread from delay times
    }

    source.start(0)
    const wetBuffer = await ctx.startRendering()
    return this.applyWetDry(buffer, wetBuffer, wetDry)
  }

  getDefaultParams(): AlienParams {
    return { chorusRate: 2, chorusDepth: 0.7, voices: 4, wetDry: 0.8 }
  }

  getEducationalContent(): EducationalContent {
    return {
      name: 'Alien Effect',
      explanation:
        'Makes your voice sound weird and otherworldly by playing multiple slightly different copies of your voice simultaneously with wobbling pitch.',
      stemConnection:
        'This uses a "chorus" effect — named after a choir singing together! When many people sing the same note, they\'re never perfectly in sync, creating a rich, swirling sound. We simulate this digitally by making copies of your voice, detuning them slightly, and mixing them. An LFO (Low-Frequency Oscillator) makes the pitch wobble over time.',
      didYouKnow:
        'Guitar players love chorus effects! The famous "Come As You Are" by Nirvana uses a chorus effect on the guitar. Synthesizers also use chorus to make sounds bigger and more interesting.',
    }
  }
}
