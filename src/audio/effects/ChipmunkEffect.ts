import * as Tone from 'tone'
import { BaseEffect } from './BaseEffect'
import type { ChipmunkParams, EducationalContent, EffectParams } from '@/types/audio'

export class ChipmunkEffect extends BaseEffect {
  readonly id = 'chipmunk'
  readonly name = 'Chipmunk'

  async process(buffer: AudioBuffer, params: EffectParams): Promise<AudioBuffer> {
    const { pitchShift = 7, wetDry = 1.0 } = params as ChipmunkParams

    const toneInputBuffer = new Tone.ToneAudioBuffer(buffer)

    const rendered = await Tone.Offline(async () => {
      const player = new Tone.Player(toneInputBuffer)
      const shift = new Tone.PitchShift({
        pitch: pitchShift,
        windowSize: 0.1,
        delayTime: 0,
        feedback: 0,
        wet: 1,
      })
      player.chain(shift, Tone.getDestination())
      player.start(0)
    }, buffer.duration + 0.1, buffer.numberOfChannels, buffer.sampleRate)

    const wetBuffer = rendered.get()!
    return this.applyWetDry(buffer, wetBuffer, wetDry)
  }

  getDefaultParams(): ChipmunkParams {
    return { pitchShift: 7, wetDry: 1.0 }
  }

  getEducationalContent(): EducationalContent {
    return {
      name: 'Chipmunk Voice',
      explanation:
        'Makes your voice sound higher and squeakier by shifting the pitch up several notes without changing how fast you talk.',
      stemConnection:
        'Sound is made of vibrations called waves. Higher pitch means faster vibrations (higher frequency). By shifting your voice up 7 semitones, we make those sound waves vibrate about 1.5× faster — like tuning a guitar string tighter to sound higher.',
      didYouKnow:
        'Real chipmunks have tiny vocal cords that vibrate very fast — smaller objects vibrate faster, creating higher-pitched sounds. That\'s why a small flute sounds higher than a big tuba!',
    }
  }
}
