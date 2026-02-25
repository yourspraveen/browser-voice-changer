import type { EffectParams, EducationalContent } from '@/types/audio'
import { mixBuffers } from '@/utils/audioUtils'

export abstract class BaseEffect {
  abstract readonly id: string
  abstract readonly name: string

  abstract process(buffer: AudioBuffer, params: EffectParams): Promise<AudioBuffer>
  abstract getDefaultParams(): EffectParams
  abstract getEducationalContent(): EducationalContent

  protected applyWetDry(
    dryBuffer: AudioBuffer,
    wetBuffer: AudioBuffer,
    wetAmount: number
  ): AudioBuffer {
    if (wetAmount >= 1) return wetBuffer
    if (wetAmount <= 0) return dryBuffer
    return mixBuffers(dryBuffer, wetBuffer, wetAmount)
  }

  protected createOfflineContext(
    buffer: AudioBuffer,
    extraSeconds = 0
  ): OfflineAudioContext {
    return new OfflineAudioContext(
      buffer.numberOfChannels,
      buffer.length + Math.ceil(extraSeconds * buffer.sampleRate),
      buffer.sampleRate
    )
  }
}
