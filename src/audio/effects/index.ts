import type { EffectDefinition, EffectId } from '@/types/audio'
import { ChipmunkEffect } from './ChipmunkEffect'
import { DeepVoiceEffect } from './DeepVoiceEffect'
import { RobotEffect } from './RobotEffect'
import { TelephoneEffect } from './TelephoneEffect'
import { EchoEffect } from './EchoEffect'
import { AlienEffect } from './AlienEffect'
import type { BaseEffect } from './BaseEffect'

export { ChipmunkEffect, DeepVoiceEffect, RobotEffect, TelephoneEffect, EchoEffect, AlienEffect }

export const effectInstances: Record<EffectId, BaseEffect> = {
  chipmunk: new ChipmunkEffect(),
  deepVoice: new DeepVoiceEffect(),
  robot: new RobotEffect(),
  telephone: new TelephoneEffect(),
  echo: new EchoEffect(),
  alien: new AlienEffect(),
}

export const EFFECT_DEFINITIONS: EffectDefinition[] = [
  {
    id: 'chipmunk',
    name: 'Chipmunk',
    emoji: '🐿️',
    color: '#F472B6',
    colorVar: '--color-effect-chipmunk',
    defaultParams: effectInstances.chipmunk.getDefaultParams(),
    paramRanges: {
      pitchShift: { min: 4, max: 12, step: 1, label: 'Pitch Shift (semitones)' },
      wetDry: { min: 0, max: 1, step: 0.05, label: 'Effect Amount' },
    },
    educational: effectInstances.chipmunk.getEducationalContent(),
  },
  {
    id: 'deepVoice',
    name: 'Deep Voice',
    emoji: '🎙️',
    color: '#8B5CF6',
    colorVar: '--color-effect-deep',
    defaultParams: effectInstances.deepVoice.getDefaultParams(),
    paramRanges: {
      pitchShift: { min: -12, max: -4, step: 1, label: 'Pitch Shift (semitones)' },
      wetDry: { min: 0, max: 1, step: 0.05, label: 'Effect Amount' },
    },
    educational: effectInstances.deepVoice.getEducationalContent(),
  },
  {
    id: 'robot',
    name: 'Robot',
    emoji: '🤖',
    color: '#06B6D4',
    colorVar: '--color-effect-robot',
    defaultParams: effectInstances.robot.getDefaultParams(),
    paramRanges: {
      modulationFreq: { min: 20, max: 200, step: 5, label: 'Modulation Frequency (Hz)' },
      filterFreq: { min: 200, max: 3000, step: 50, label: 'Filter Center (Hz)' },
      filterQ: { min: 0.5, max: 10, step: 0.5, label: 'Filter Resonance' },
      wetDry: { min: 0, max: 1, step: 0.05, label: 'Effect Amount' },
    },
    educational: effectInstances.robot.getEducationalContent(),
  },
  {
    id: 'telephone',
    name: 'Telephone',
    emoji: '📞',
    color: '#F59E0B',
    colorVar: '--color-effect-telephone',
    defaultParams: effectInstances.telephone.getDefaultParams(),
    paramRanges: {
      lowCutoff: { min: 200, max: 500, step: 25, label: 'Low Cut (Hz)' },
      highCutoff: { min: 2000, max: 4000, step: 100, label: 'High Cut (Hz)' },
      distortion: { min: 0, max: 0.5, step: 0.05, label: 'Distortion' },
      wetDry: { min: 0, max: 1, step: 0.05, label: 'Effect Amount' },
    },
    educational: effectInstances.telephone.getEducationalContent(),
  },
  {
    id: 'echo',
    name: 'Echo',
    emoji: '🏔️',
    color: '#10B981',
    colorVar: '--color-effect-echo',
    defaultParams: effectInstances.echo.getDefaultParams(),
    paramRanges: {
      delayTime: { min: 0.1, max: 1.0, step: 0.05, label: 'Delay Time (s)' },
      feedback: { min: 0, max: 0.9, step: 0.05, label: 'Feedback' },
      wetDry: { min: 0, max: 1, step: 0.05, label: 'Effect Amount' },
    },
    educational: effectInstances.echo.getEducationalContent(),
  },
  {
    id: 'alien',
    name: 'Alien',
    emoji: '👽',
    color: '#6366F1',
    colorVar: '--color-effect-alien',
    defaultParams: effectInstances.alien.getDefaultParams(),
    paramRanges: {
      chorusRate: { min: 0.5, max: 8, step: 0.5, label: 'Modulation Rate (Hz)' },
      chorusDepth: { min: 0, max: 1, step: 0.05, label: 'Modulation Depth' },
      wetDry: { min: 0, max: 1, step: 0.05, label: 'Effect Amount' },
    },
    educational: effectInstances.alien.getEducationalContent(),
  },
]

export function getEffectById(id: EffectId): BaseEffect {
  return effectInstances[id]
}
