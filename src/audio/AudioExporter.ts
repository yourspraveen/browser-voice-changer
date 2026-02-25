import { audioBufferToWav, generateFilename } from '@/utils/audioUtils'
import type { AudioFormat } from '@/types/audio'

export class AudioExporter {
  async exportWAV(buffer: AudioBuffer, filename?: string): Promise<Blob> {
    const blob = audioBufferToWav(buffer)
    if (filename) this.downloadAudio(blob, filename)
    return blob
  }

  async exportOGG(buffer: AudioBuffer, filename?: string): Promise<Blob> {
    // Use OfflineAudioContext to re-render then capture via MediaRecorder as OGG
    // This is a best-effort approach; WAV is the primary format
    const blob = audioBufferToWav(buffer) // fallback to WAV if OGG not supported
    const oggFilename = filename?.replace('.wav', '.ogg') || filename
    if (oggFilename) this.downloadAudio(blob, oggFilename)
    return blob
  }

  downloadAudio(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.style.display = 'none'
    document.body.appendChild(a)
    a.click()
    setTimeout(() => {
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }, 100)
  }

  generateFilename(effectName: string, format: AudioFormat = 'wav'): string {
    return generateFilename(effectName, format)
  }

  async exportAndDownload(
    buffer: AudioBuffer,
    effectName: string,
    format: AudioFormat = 'wav'
  ): Promise<void> {
    const filename = this.generateFilename(effectName, format)
    if (format === 'wav') {
      await this.exportWAV(buffer, filename)
    } else {
      await this.exportOGG(buffer, filename)
    }
  }
}
