import { BaseEffect } from './BaseEffect'
import type { RobotParams, EducationalContent, EffectParams } from '@/types/audio'

export class RobotEffect extends BaseEffect {
  readonly id = 'robot'
  readonly name = 'Robot'

  async process(buffer: AudioBuffer, params: EffectParams): Promise<AudioBuffer> {
    const {
      modulationFreq = 30,
      filterFreq = 800,
      filterQ = 3,
      wetDry = 1.0,
    } = params as RobotParams

    const ctx = this.createOfflineContext(buffer)
    const source = ctx.createBufferSource()
    source.buffer = buffer

    // Ring modulation: multiply signal by a sine wave carrier
    const carrier = ctx.createOscillator()
    carrier.frequency.value = modulationFreq
    carrier.type = 'sine'

    // Use a gain node as the ring modulator
    // Signal path: source -> ringModGain, carrier -> ringModGain.gain
    const ringModGain = ctx.createGain()
    ringModGain.gain.value = 0

    // Bandpass filter for metallic character
    const filter = ctx.createBiquadFilter()
    filter.type = 'bandpass'
    filter.frequency.value = filterFreq
    filter.Q.value = filterQ

    // Additional bandpass to sculpt tone
    const filter2 = ctx.createBiquadFilter()
    filter2.type = 'peaking'
    filter2.frequency.value = filterFreq * 2
    filter2.gain.value = 6
    filter2.Q.value = 2

    source.connect(ringModGain)
    carrier.connect(ringModGain.gain)
    ringModGain.connect(filter)
    filter.connect(filter2)
    filter2.connect(ctx.destination)

    source.start(0)
    carrier.start(0)

    const rendered = await ctx.startRendering()
    return this.applyWetDry(buffer, rendered, wetDry)
  }

  getDefaultParams(): RobotParams {
    return { modulationFreq: 30, filterFreq: 800, filterQ: 3, wetDry: 1.0 }
  }

  getEducationalContent(): EducationalContent {
    return {
      name: 'Robot Voice',
      explanation:
        'Makes you sound mechanical and synthetic by mixing your voice with a pure electronic tone and filtering out some frequencies.',
      stemConnection:
        'This effect uses "ring modulation" — multiplying your voice sound wave with a simple sine wave (pure tone). This creates new frequencies that weren\'t in your original voice, giving it a metallic, robotic quality. Then a filter removes some frequencies to make it sound even more mechanical.',
      didYouKnow:
        'Early synthesizers used this exact technique in the 1960s! Bands like Kraftwerk used ring modulation to create robot voices. Modern voice assistants sound natural because they use recorded human speech instead.',
    }
  }
}
