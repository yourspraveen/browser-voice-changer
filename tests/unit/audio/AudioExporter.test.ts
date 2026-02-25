import { describe, it, expect, beforeEach } from 'vitest'
import { AudioExporter } from '@/audio/AudioExporter'

function createTestBuffer(sampleRate = 44100, durationSeconds = 0.5): AudioBuffer {
  const length = Math.floor(sampleRate * durationSeconds)
  const ctx = new AudioContext()
  const buffer = ctx.createBuffer(1, length, sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < length; i++) {
    data[i] = Math.sin((2 * Math.PI * 440 * i) / sampleRate) * 0.5
  }
  return buffer
}

describe('AudioExporter', () => {
  let exporter: AudioExporter

  beforeEach(() => {
    exporter = new AudioExporter()
  })

  it('exportWAV returns a Blob', async () => {
    const buffer = createTestBuffer()
    const blob = await exporter.exportWAV(buffer)
    expect(blob).toBeInstanceOf(Blob)
    expect(blob.type).toBe('audio/wav')
  })

  it('WAV blob has content (size > 44 for header)', async () => {
    const buffer = createTestBuffer()
    const blob = await exporter.exportWAV(buffer)
    expect(blob.size).toBeGreaterThan(44)
  })

  it('generateFilename includes effect name and date', () => {
    const filename = exporter.generateFilename('Chipmunk', 'wav')
    expect(filename).toMatch(/chipmunk/)
    expect(filename).toMatch(/\.wav$/)
    expect(filename).toMatch(/voice_/)
  })

  it('generateFilename with spaces replaces with underscores', () => {
    const filename = exporter.generateFilename('Deep Voice', 'wav')
    expect(filename).not.toContain(' ')
    expect(filename).toContain('deep_voice')
  })
})
