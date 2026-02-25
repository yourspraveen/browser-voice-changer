import { describe, it, expect, beforeEach } from 'vitest'
import { TelephoneEffect } from '@/audio/effects/TelephoneEffect'

function createTestBuffer(sampleRate = 48000, durationSeconds = 0.1): AudioBuffer {
  const length = Math.floor(sampleRate * durationSeconds)
  const ctx = new AudioContext()
  return ctx.createBuffer(1, length, sampleRate)
}

describe('TelephoneEffect', () => {
  let effect: TelephoneEffect

  beforeEach(() => {
    effect = new TelephoneEffect()
  })

  it('has correct id and name', () => {
    expect(effect.id).toBe('telephone')
    expect(effect.name).toBe('Telephone')
  })

  it('returns default params', () => {
    const params = effect.getDefaultParams()
    expect(params.lowCutoff).toBe(300)
    expect(params.highCutoff).toBe(3400)
    expect(params.distortion).toBe(0.2)
    expect(params.wetDry).toBe(1.0)
  })

  it('provides educational content', () => {
    const edu = effect.getEducationalContent()
    expect(edu.explanation).toContain('telephone')
    expect(edu.stemConnection).toContain('Hz')
    expect(edu.didYouKnow).toBeTruthy()
  })

  it('processes buffer successfully', async () => {
    const buffer = createTestBuffer()
    const result = await effect.process(buffer, effect.getDefaultParams())
    expect(result).toBeDefined()
    expect(result.length).toBeGreaterThan(0)
  })
})
