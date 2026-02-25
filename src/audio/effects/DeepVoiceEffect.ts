import * as Tone from 'tone'
import { BaseEffect } from './BaseEffect'
import type { DeepVoiceParams, EducationalContent, EffectParams } from '@/types/audio'

export class DeepVoiceEffect extends BaseEffect {
  readonly id = 'deepVoice'
  readonly name = 'Deep Voice'

  async process(buffer: AudioBuffer, params: EffectParams): Promise<AudioBuffer> {
    const { pitchShift = -7, wetDry = 1.0 } = params as DeepVoiceParams

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

  getDefaultParams(): DeepVoiceParams {
    return { pitchShift: -7, wetDry: 1.0 }
  }

  getEducationalContent(): EducationalContent {
    return {
      name: 'Deep Voice',
      explanation:
        'Makes you sound like a giant by lowering the pitch of your voice several notes — like a movie trailer narrator.',
      stemConnection:
        'Lower pitch means slower vibrations (lower frequency). By shifting your voice down 7 semitones, those sound waves vibrate about 0.67× slower. It\'s like loosening a guitar string — the looser the string, the lower the sound.',
      didYouKnow:
        'Blue whales make the lowest sounds of any animal — as low as 10 Hz (10 vibrations per second). Humans can\'t even hear below 20 Hz! Large objects vibrate slowly, creating low-pitched sounds.',
    }
  }
}
