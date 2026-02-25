import { describe, it, expect, beforeEach } from 'vitest'
import { AlienEffect } from '@/audio/effects/AlienEffect'

describe('AlienEffect', () => {
  let effect: AlienEffect

  beforeEach(() => {
    effect = new AlienEffect()
  })

  it('has correct id and name', () => {
    expect(effect.id).toBe('alien')
    expect(effect.name).toBe('Alien')
  })

  it('default wetDry is 0.8', () => {
    expect(effect.getDefaultParams().wetDry).toBe(0.8)
  })

  it('default chorusRate is 2', () => {
    expect(effect.getDefaultParams().chorusRate).toBe(2)
  })

  it('provides educational content', () => {
    const edu = effect.getEducationalContent()
    expect(edu.name).toBeTruthy()
    expect(edu.explanation).toBeTruthy()
    expect(edu.stemConnection).toContain('chorus')
    expect(edu.stemConnection).toContain('LFO')
  })

  it('processes buffer successfully', async () => {
    const length = 4800
    const ctx = new AudioContext()
    const buffer = ctx.createBuffer(1, length, 48000)
    const result = await effect.process(buffer, effect.getDefaultParams())
    expect(result).toBeDefined()
  })
})
