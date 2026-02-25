import { BaseEffect } from './BaseEffect'
import type { EchoParams, EducationalContent, EffectParams } from '@/types/audio'

export class EchoEffect extends BaseEffect {
  readonly id = 'echo'
  readonly name = 'Echo'

  async process(buffer: AudioBuffer, params: EffectParams): Promise<AudioBuffer> {
    const {
      delayTime = 0.25,
      feedback = 0.5,
      wetDry = 0.7,
    } = params as EchoParams

    // Extra time to let echo tail decay
    const echoTailSeconds = Math.min(delayTime * Math.ceil(Math.log(0.01) / Math.log(feedback + 0.001)), 4)
    const ctx = this.createOfflineContext(buffer, Math.max(1, echoTailSeconds))

    const source = ctx.createBufferSource()
    source.buffer = buffer

    // Dry output
    const dryGain = ctx.createGain()
    dryGain.gain.value = 1 - wetDry

    // Wet path: delay with feedback loop
    const wetGain = ctx.createGain()
    wetGain.gain.value = wetDry

    const delay = ctx.createDelay(4.0)
    delay.delayTime.value = delayTime

    const feedbackGain = ctx.createGain()
    feedbackGain.gain.value = Math.min(feedback, 0.9)

    // Signal routing
    source.connect(dryGain)
    source.connect(wetGain)

    wetGain.connect(delay)
    delay.connect(feedbackGain)
    feedbackGain.connect(delay) // feedback loop
    delay.connect(ctx.destination)
    dryGain.connect(ctx.destination)

    source.start(0)
    return ctx.startRendering()
  }

  getDefaultParams(): EchoParams {
    return { delayTime: 0.25, feedback: 0.5, wetDry: 0.7 }
  }

  getEducationalContent(): EducationalContent {
    return {
      name: 'Echo Effect',
      explanation:
        'Makes your voice repeat like you\'re in a big canyon or empty room by playing delayed copies of your voice.',
      stemConnection:
        'An echo happens when sound bounces off a surface and returns to your ears. Sound travels about 343 m/s (767 mph). A canyon 34 meters away creates an echo after 0.2 seconds. Our delay effect simulates this digitally, creating copies of your voice that play after a set delay — with each copy quieter than the last!',
      didYouKnow:
        'The longest echo ever recorded was in Scotland\'s Inchindown oil tanks — it lasted 112 seconds! That\'s nearly 2 minutes from a single sound. Most natural echoes last less than 1 second.',
    }
  }
}
