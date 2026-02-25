import type { EffectId, EffectParams } from '@/types/audio'
import { blobToAudioBuffer } from '@/utils/audioUtils'
import { effectInstances } from './effects'

export class AudioProcessor {
  private audioContext: AudioContext | null = null
  private playbackSource: AudioBufferSourceNode | null = null
  private playbackStartTime = 0
  private playbackOffset = 0
  private _isPlaying = false
  private onEndedCallback: (() => void) | null = null

  get isPlaying(): boolean {
    return this._isPlaying
  }

  async initialize(): Promise<void> {
    if (!this.audioContext || this.audioContext.state === 'closed') {
      this.audioContext = new AudioContext()
    }
    if (this.audioContext.state === 'suspended') {
      await this.audioContext.resume()
    }
  }

  async loadAudio(source: Blob | string): Promise<AudioBuffer> {
    if (typeof source === 'string') {
      const response = await fetch(source)
      const blob = await response.blob()
      return blobToAudioBuffer(blob)
    }
    return blobToAudioBuffer(source)
  }

  async applyEffect(
    buffer: AudioBuffer,
    effectId: EffectId,
    params: EffectParams
  ): Promise<AudioBuffer> {
    const effect = effectInstances[effectId]
    if (!effect) throw new Error(`Unknown effect: ${effectId}`)
    return effect.process(buffer, params)
  }

  async playAudio(
    buffer: AudioBuffer,
    offset = 0,
    onEnded?: () => void
  ): Promise<void> {
    await this.initialize()
    this.stopPlayback()

    if (!this.audioContext) return

    const source = this.audioContext.createBufferSource()
    source.buffer = buffer
    source.connect(this.audioContext.destination)

    this.playbackSource = source
    this.playbackOffset = offset
    this.playbackStartTime = this.audioContext.currentTime
    this._isPlaying = true
    this.onEndedCallback = onEnded || null

    source.onended = () => {
      if (this._isPlaying) {
        this._isPlaying = false
        this.playbackSource = null
        this.onEndedCallback?.()
        this.onEndedCallback = null
      }
    }

    source.start(0, offset)
  }

  stopPlayback(): void {
    if (this.playbackSource) {
      try {
        this.playbackSource.onended = null
        this.playbackSource.stop()
      } catch {
        // Already stopped
      }
      this.playbackSource = null
    }
    this._isPlaying = false
    this.onEndedCallback = null
  }

  getCurrentTime(): number {
    if (!this._isPlaying || !this.audioContext) return this.playbackOffset
    return this.playbackOffset + (this.audioContext.currentTime - this.playbackStartTime)
  }

  dispose(): void {
    this.stopPlayback()
    this.audioContext?.close()
    this.audioContext = null
  }
}
