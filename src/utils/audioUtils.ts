// Audio buffer utility functions
import { getAudioContext } from './browserDetect'

export async function blobToAudioBuffer(blob: Blob): Promise<AudioBuffer> {
  const arrayBuffer = await blob.arrayBuffer()
  const audioContext = getAudioContext()
  try {
    const buffer = await audioContext.decodeAudioData(arrayBuffer)
    return buffer
  } finally {
    await audioContext.close()
  }
}

export function audioBufferToWav(buffer: AudioBuffer): Blob {
  const numChannels = Math.min(buffer.numberOfChannels, 2)
  const sampleRate = buffer.sampleRate
  const numFrames = buffer.length
  const bytesPerSample = 2 // 16-bit PCM
  const dataLength = numFrames * numChannels * bytesPerSample
  const arrayBuffer = new ArrayBuffer(44 + dataLength)
  const view = new DataView(arrayBuffer)

  // WAV header
  writeString(view, 0, 'RIFF')
  view.setUint32(4, 36 + dataLength, true)
  writeString(view, 8, 'WAVE')
  writeString(view, 12, 'fmt ')
  view.setUint32(16, 16, true)
  view.setUint16(20, 1, true) // PCM
  view.setUint16(22, numChannels, true)
  view.setUint32(24, sampleRate, true)
  view.setUint32(28, sampleRate * numChannels * bytesPerSample, true)
  view.setUint16(32, numChannels * bytesPerSample, true)
  view.setUint16(34, 16, true) // 16-bit
  writeString(view, 36, 'data')
  view.setUint32(40, dataLength, true)

  // Interleave channels
  const channels: Float32Array[] = []
  for (let i = 0; i < numChannels; i++) {
    channels.push(buffer.getChannelData(i))
  }

  let offset = 44
  for (let frame = 0; frame < numFrames; frame++) {
    for (let ch = 0; ch < numChannels; ch++) {
      const chData = channels[ch]
      const rawSample = chData !== undefined ? (chData[frame] ?? 0) : 0
      const sample = Math.max(-1, Math.min(1, rawSample))
      const int16 = sample < 0 ? sample * 0x8000 : sample * 0x7fff
      view.setInt16(offset, int16, true)
      offset += 2
    }
  }

  return new Blob([arrayBuffer], { type: 'audio/wav' })
}

function writeString(view: DataView, offset: number, str: string) {
  for (let i = 0; i < str.length; i++) {
    view.setUint8(offset + i, str.charCodeAt(i))
  }
}

export function normalizeAudioBuffer(buffer: AudioBuffer, targetLevel = 0.95): AudioBuffer {
  let peak = 0
  for (let ch = 0; ch < buffer.numberOfChannels; ch++) {
    const data = buffer.getChannelData(ch)
    for (let i = 0; i < data.length; i++) {
      const abs = Math.abs(data[i] ?? 0)
      if (abs > peak) peak = abs
    }
  }

  if (peak === 0) return buffer
  const gain = targetLevel / peak

  const ctx = getAudioContext()
  const normalized = ctx.createBuffer(
    buffer.numberOfChannels,
    buffer.length,
    buffer.sampleRate
  )
  ctx.close()

  for (let ch = 0; ch < buffer.numberOfChannels; ch++) {
    const input = buffer.getChannelData(ch)
    const output = normalized.getChannelData(ch)
    for (let i = 0; i < input.length; i++) {
      output[i] = (input[i] ?? 0) * gain
    }
  }

  return normalized
}

export function mixBuffers(
  dryBuffer: AudioBuffer,
  wetBuffer: AudioBuffer,
  wetAmount: number
): AudioBuffer {
  const dryAmount = 1 - wetAmount
  const length = Math.min(dryBuffer.length, wetBuffer.length)
  const channels = Math.max(dryBuffer.numberOfChannels, wetBuffer.numberOfChannels)
  const sampleRate = dryBuffer.sampleRate

  const ctx = getAudioContext()
  const mixed = ctx.createBuffer(channels, length, sampleRate)
  ctx.close()

  for (let ch = 0; ch < channels; ch++) {
    const dryData = dryBuffer.getChannelData(Math.min(ch, dryBuffer.numberOfChannels - 1))
    const wetData = wetBuffer.getChannelData(Math.min(ch, wetBuffer.numberOfChannels - 1))
    const output = mixed.getChannelData(ch)
    for (let i = 0; i < length; i++) {
      output[i] = (dryData[i] ?? 0) * dryAmount + (wetData[i] ?? 0) * wetAmount
    }
  }

  return mixed
}

export function generateFilename(effectName: string, format: string): string {
  const date = new Date().toISOString().slice(0, 10)
  const safeName = effectName.toLowerCase().replace(/\s+/g, '_')
  return `voice_${safeName}_${date}.${format}`
}
