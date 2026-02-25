import { describe, it, expect, beforeEach } from 'vitest'
import { RobotEffect } from '@/audio/effects/RobotEffect'

function createTestBuffer(sampleRate = 48000, durationSeconds = 0.1): AudioBuffer {
  const length = Math.floor(sampleRate * durationSeconds)
  const ctx = new AudioContext()
  const buffer = ctx.createBuffer(1, length, sampleRate)
  const data = buffer.getChannelData(0)
  // Fill with a simple sine wave at 440 Hz
  for (let i = 0; i < length; i++) {
    data[i] = Math.sin((2 * Math.PI * 440 * i) / sampleRate)
  }
  return buffer
}

describe('RobotEffect', () => {
  let effect: RobotEffect

  beforeEach(() => {
    effect = new RobotEffect()
  })

  it('returns default params', () => {
    const params = effect.getDefaultParams()
    expect(params.modulationFreq).toBe(30)
    expect(params.filterFreq).toBe(800)
    expect(params.filterQ).toBe(3)
    expect(params.wetDry).toBe(1.0)
  })

  it('has correct id and name', () => {
    expect(effect.id).toBe('robot')
    expect(effect.name).toBe('Robot')
  })

  it('returns educational content', () => {
    const edu = effect.getEducationalContent()
    expect(edu.name).toBeTruthy()
    expect(edu.explanation).toBeTruthy()
    expect(edu.stemConnection).toBeTruthy()
  })

  it('processes audio buffer without throwing', async () => {
    const buffer = createTestBuffer()
    const params = effect.getDefaultParams()
    const result = await effect.process(buffer, params)
    expect(result).toBeDefined()
    expect(result.sampleRate).toBe(buffer.sampleRate)
  })

  it('returns dry signal when wetDry is 0', async () => {
    const buffer = createTestBuffer()
    const result = await effect.process(buffer, { ...effect.getDefaultParams(), wetDry: 0 })
    const originalData = buffer.getChannelData(0)
    const resultData = result.getChannelData(0)
    // When wet=0, should be identical to original
    let diff = 0
    for (let i = 0; i < originalData.length; i++) {
      diff += Math.abs(originalData[i] - resultData[i])
    }
    expect(diff / originalData.length).toBeLessThan(0.001)
  })
})
