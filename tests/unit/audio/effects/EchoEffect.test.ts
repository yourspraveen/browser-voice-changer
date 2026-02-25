import { describe, it, expect, beforeEach } from 'vitest'
import { EchoEffect } from '@/audio/effects/EchoEffect'

function createTestBuffer(sampleRate = 48000, durationSeconds = 0.2): AudioBuffer {
  const length = Math.floor(sampleRate * durationSeconds)
  const ctx = new AudioContext()
  const buffer = ctx.createBuffer(1, length, sampleRate)
  return buffer
}

describe('EchoEffect', () => {
  let effect: EchoEffect

  beforeEach(() => {
    effect = new EchoEffect()
  })

  it('has correct id and name', () => {
    expect(effect.id).toBe('echo')
    expect(effect.name).toBe('Echo')
  })

  it('default wetDry is 0.7', () => {
    expect(effect.getDefaultParams().wetDry).toBe(0.7)
  })

  it('default delayTime is 0.25', () => {
    expect(effect.getDefaultParams().delayTime).toBe(0.25)
  })

  it('produces longer output than input (echo tail)', async () => {
    const buffer = createTestBuffer()
    const result = await effect.process(buffer, effect.getDefaultParams())
    expect(result.duration).toBeGreaterThanOrEqual(buffer.duration)
  })

  it('provides educational content with echo science', () => {
    const edu = effect.getEducationalContent()
    expect(edu.explanation).toBeTruthy()
    expect(edu.stemConnection).toContain('echo')
    expect(edu.stemConnection).toContain('sound')
  })
})
