import { BaseEffect } from './BaseEffect'
import type { TelephoneParams, EducationalContent, EffectParams } from '@/types/audio'

export class TelephoneEffect extends BaseEffect {
  readonly id = 'telephone'
  readonly name = 'Telephone'

  async process(buffer: AudioBuffer, params: EffectParams): Promise<AudioBuffer> {
    const {
      lowCutoff = 300,
      highCutoff = 3400,
      distortion = 0.2,
      wetDry = 1.0,
    } = params as TelephoneParams

    const ctx = this.createOfflineContext(buffer)
    const source = ctx.createBufferSource()
    source.buffer = buffer

    // High-pass: remove frequencies below 300 Hz
    const highPass = ctx.createBiquadFilter()
    highPass.type = 'highpass'
    highPass.frequency.value = lowCutoff
    highPass.Q.value = 0.7

    // Low-pass: remove frequencies above 3400 Hz
    const lowPass = ctx.createBiquadFilter()
    lowPass.type = 'lowpass'
    lowPass.frequency.value = highCutoff
    lowPass.Q.value = 0.7

    // Light distortion / wave shaping
    const shaper = ctx.createWaveShaper()
    shaper.curve = this.makeDistortionCurve(distortion)
    shaper.oversample = '2x'

    source.connect(highPass)
    highPass.connect(lowPass)
    lowPass.connect(shaper)
    shaper.connect(ctx.destination)

    source.start(0)
    const rendered = await ctx.startRendering()
    return this.applyWetDry(buffer, rendered, wetDry)
  }

  private makeDistortionCurve(amount: number): Float32Array<ArrayBuffer> {
    const samples = 256
    const buf = new ArrayBuffer(samples * 4)
    const curve = new Float32Array(buf)
    for (let i = 0; i < samples; i++) {
      const x = (i * 2) / samples - 1
      curve[i] = ((Math.PI + amount * 100) * x) / (Math.PI + amount * 100 * Math.abs(x))
    }
    return curve
  }

  getDefaultParams(): TelephoneParams {
    return { lowCutoff: 300, highCutoff: 3400, distortion: 0.2, wetDry: 1.0 }
  }

  getEducationalContent(): EducationalContent {
    return {
      name: 'Telephone Voice',
      explanation:
        'Makes you sound like you\'re talking on an old telephone by removing very low and very high sounds from your voice.',
      stemConnection:
        'Old telephone lines could only transmit frequencies from 300 Hz to 3400 Hz — called the "bandwidth." We use a high-pass filter to remove sounds below 300 Hz (deep rumbles) and a low-pass filter to remove sounds above 3400 Hz (crisp highs). That\'s why old phone calls sounded "tinny"!',
      didYouKnow:
        'Modern digital phones transmit 50 Hz to 7000 Hz ("HD Voice") — 4× the bandwidth. That\'s why calls sound much clearer now. The old narrow bandwidth was a limitation of copper telephone wires.',
    }
  }
}
