// Audio type definitions for the Voice Changer application

export type EffectId =
  | 'chipmunk'
  | 'deepVoice'
  | 'robot'
  | 'telephone'
  | 'echo'
  | 'alien'

export interface EffectParams {
  wetDry: number // 0-1
  [key: string]: number | boolean | string
}

export interface ChipmunkParams extends EffectParams {
  pitchShift: number // semitones, 4-12
}

export interface DeepVoiceParams extends EffectParams {
  pitchShift: number // semitones, -12 to -4
}

export interface RobotParams extends EffectParams {
  modulationFreq: number // Hz, 20-500
  filterFreq: number // Hz, 200-3000
  filterQ: number // 0.5-10
}

export interface TelephoneParams extends EffectParams {
  lowCutoff: number // Hz, 200-500
  highCutoff: number // Hz, 2000-4000
  distortion: number // 0-0.5
}

export interface EchoParams extends EffectParams {
  delayTime: number // seconds, 0.1-1.0
  feedback: number // 0-0.9
}

export interface AlienParams extends EffectParams {
  chorusRate: number // Hz, 0.5-8
  chorusDepth: number // 0-1
  voices: number // 2-8
}

export interface EducationalContent {
  name: string
  explanation: string
  stemConnection: string
  didYouKnow?: string
}

export interface EffectDefinition {
  id: EffectId
  name: string
  emoji: string
  color: string
  colorVar: string
  defaultParams: EffectParams
  paramRanges: Record<string, { min: number; max: number; step: number; label: string }>
  educational: EducationalContent
}

export type RecordingStatus = 'idle' | 'countdown' | 'recording' | 'paused' | 'stopped'
export type PlaybackStatus = 'idle' | 'playing' | 'paused'
export type ErrorType = 'permission' | 'processing' | 'browser' | 'network' | 'unknown'

export interface AppError {
  type: ErrorType
  message: string
  recoverable: boolean
}

export interface DemoSample {
  id: string
  name: string
  description: string
  url: string
}

export type AudioFormat = 'wav' | 'ogg'
export type ExportQuality = 'high' | 'medium' | 'low'

export interface BrowserSupport {
  webAudio: boolean
  mediaRecorder: boolean
  getUserMedia: boolean
  serviceWorker: boolean
  audioWorklet: boolean
}
