import { describe, it, expect } from 'vitest'
import { EFFECT_DEFINITIONS, effectInstances, getEffectById } from '@/audio/effects'

describe('Effect Registry', () => {
  const expectedIds = ['chipmunk', 'deepVoice', 'robot', 'telephone', 'echo', 'alien']

  it('has all 6 effects defined', () => {
    expect(EFFECT_DEFINITIONS).toHaveLength(6)
  })

  it('has all expected effect IDs', () => {
    const ids = EFFECT_DEFINITIONS.map((d) => d.id)
    for (const id of expectedIds) {
      expect(ids).toContain(id)
    }
  })

  it('each effect definition has required fields', () => {
    for (const def of EFFECT_DEFINITIONS) {
      expect(def.id).toBeTruthy()
      expect(def.name).toBeTruthy()
      expect(def.emoji).toBeTruthy()
      expect(def.color).toMatch(/^#[0-9a-fA-F]{6}$/)
      expect(def.defaultParams).toBeDefined()
      expect(def.educational).toBeDefined()
      expect(def.educational.explanation).toBeTruthy()
      expect(def.educational.stemConnection).toBeTruthy()
    }
  })

  it('all effects have valid default wetDry', () => {
    for (const def of EFFECT_DEFINITIONS) {
      const { wetDry } = def.defaultParams
      expect(wetDry).toBeGreaterThanOrEqual(0)
      expect(wetDry).toBeLessThanOrEqual(1)
    }
  })

  it('getEffectById returns correct instance', () => {
    for (const id of expectedIds) {
      const inst = getEffectById(id as keyof typeof effectInstances)
      expect(inst).toBeDefined()
      expect(inst.id).toBe(id)
    }
  })

  it('each effect has educational content', () => {
    for (const def of EFFECT_DEFINITIONS) {
      expect(def.educational.name).toBeTruthy()
      expect(def.educational.explanation).toBeTruthy()
      expect(def.educational.stemConnection).toBeTruthy()
    }
  })
})
