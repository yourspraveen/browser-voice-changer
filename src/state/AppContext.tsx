import React, { createContext, useReducer, useRef } from 'react'
import type { EffectId, EffectParams, RecordingStatus, PlaybackStatus, AppError } from '@/types/audio'
import { EFFECT_DEFINITIONS } from '@/audio/effects'
import { AudioCapture } from '@/audio/AudioCapture'
import { AudioProcessor } from '@/audio/AudioProcessor'
import { AudioExporter } from '@/audio/AudioExporter'

// ---- State ----

export interface AppState {
  recording: {
    status: RecordingStatus
    duration: number
    audioBlob: Blob | null
    audioBuffer: AudioBuffer | null
    selectedDeviceId: string | null
    inputLevel: number
  }
  playback: {
    status: PlaybackStatus
    currentTime: number
    isOriginal: boolean // true = playing original, false = playing processed
  }
  effects: {
    selectedEffectId: EffectId | null
    effectParams: Record<EffectId, EffectParams>
    processedBuffer: AudioBuffer | null
    isProcessing: boolean
  }
  ui: {
    showEducational: boolean
    showPrivacyNotice: boolean
    language: 'en' | 'es'
    countdown: number | null // 3, 2, 1 or null
    showDemoSamples: boolean
  }
  error: AppError | null
}

// ---- Actions ----

type Action =
  | { type: 'SET_RECORDING_STATUS'; status: RecordingStatus }
  | { type: 'SET_RECORDING_DURATION'; duration: number }
  | { type: 'SET_INPUT_LEVEL'; level: number }
  | { type: 'SET_AUDIO_BLOB'; blob: Blob | null }
  | { type: 'SET_AUDIO_BUFFER'; buffer: AudioBuffer | null }
  | { type: 'SET_SELECTED_DEVICE'; deviceId: string | null }
  | { type: 'SET_PLAYBACK_STATUS'; status: PlaybackStatus }
  | { type: 'SET_PLAYBACK_TIME'; time: number }
  | { type: 'SET_PLAYBACK_ORIGINAL'; isOriginal: boolean }
  | { type: 'SELECT_EFFECT'; effectId: EffectId | null }
  | { type: 'SET_EFFECT_PARAMS'; effectId: EffectId; params: EffectParams }
  | { type: 'SET_PROCESSED_BUFFER'; buffer: AudioBuffer | null }
  | { type: 'SET_PROCESSING'; isProcessing: boolean }
  | { type: 'SET_SHOW_EDUCATIONAL'; show: boolean }
  | { type: 'DISMISS_PRIVACY_NOTICE' }
  | { type: 'SET_LANGUAGE'; language: 'en' | 'es' }
  | { type: 'SET_COUNTDOWN'; countdown: number | null }
  | { type: 'TOGGLE_DEMO_SAMPLES' }
  | { type: 'SET_ERROR'; error: AppError | null }
  | { type: 'RESET_RECORDING' }

// ---- Initial state ----

function buildDefaultEffectParams(): Record<EffectId, EffectParams> {
  const params: Partial<Record<EffectId, EffectParams>> = {}
  for (const def of EFFECT_DEFINITIONS) {
    params[def.id] = { ...def.defaultParams }
  }
  return params as Record<EffectId, EffectParams>
}

const privacyDismissed = localStorage.getItem('privacyNoticeDismissed') === 'true'

const initialState: AppState = {
  recording: {
    status: 'idle',
    duration: 0,
    audioBlob: null,
    audioBuffer: null,
    selectedDeviceId: null,
    inputLevel: 0,
  },
  playback: {
    status: 'idle',
    currentTime: 0,
    isOriginal: true,
  },
  effects: {
    selectedEffectId: null,
    effectParams: buildDefaultEffectParams(),
    processedBuffer: null,
    isProcessing: false,
  },
  ui: {
    showEducational: false,
    showPrivacyNotice: !privacyDismissed,
    language: 'en',
    countdown: null,
    showDemoSamples: false,
  },
  error: null,
}

// ---- Reducer ----

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_RECORDING_STATUS':
      return { ...state, recording: { ...state.recording, status: action.status } }
    case 'SET_RECORDING_DURATION':
      return { ...state, recording: { ...state.recording, duration: action.duration } }
    case 'SET_INPUT_LEVEL':
      return { ...state, recording: { ...state.recording, inputLevel: action.level } }
    case 'SET_AUDIO_BLOB':
      return { ...state, recording: { ...state.recording, audioBlob: action.blob } }
    case 'SET_AUDIO_BUFFER':
      return { ...state, recording: { ...state.recording, audioBuffer: action.buffer } }
    case 'SET_SELECTED_DEVICE':
      return { ...state, recording: { ...state.recording, selectedDeviceId: action.deviceId } }
    case 'SET_PLAYBACK_STATUS':
      return { ...state, playback: { ...state.playback, status: action.status } }
    case 'SET_PLAYBACK_TIME':
      return { ...state, playback: { ...state.playback, currentTime: action.time } }
    case 'SET_PLAYBACK_ORIGINAL':
      return { ...state, playback: { ...state.playback, isOriginal: action.isOriginal } }
    case 'SELECT_EFFECT':
      return {
        ...state,
        effects: {
          ...state.effects,
          selectedEffectId: action.effectId,
          processedBuffer: null,
        },
      }
    case 'SET_EFFECT_PARAMS':
      return {
        ...state,
        effects: {
          ...state.effects,
          effectParams: {
            ...state.effects.effectParams,
            [action.effectId]: action.params,
          },
          processedBuffer: null,
        },
      }
    case 'SET_PROCESSED_BUFFER':
      return { ...state, effects: { ...state.effects, processedBuffer: action.buffer } }
    case 'SET_PROCESSING':
      return { ...state, effects: { ...state.effects, isProcessing: action.isProcessing } }
    case 'SET_SHOW_EDUCATIONAL':
      return { ...state, ui: { ...state.ui, showEducational: action.show } }
    case 'DISMISS_PRIVACY_NOTICE':
      localStorage.setItem('privacyNoticeDismissed', 'true')
      return { ...state, ui: { ...state.ui, showPrivacyNotice: false } }
    case 'SET_LANGUAGE':
      return { ...state, ui: { ...state.ui, language: action.language } }
    case 'SET_COUNTDOWN':
      return { ...state, ui: { ...state.ui, countdown: action.countdown } }
    case 'TOGGLE_DEMO_SAMPLES':
      return { ...state, ui: { ...state.ui, showDemoSamples: !state.ui.showDemoSamples } }
    case 'SET_ERROR':
      return { ...state, error: action.error }
    case 'RESET_RECORDING':
      return {
        ...state,
        recording: {
          ...initialState.recording,
          selectedDeviceId: state.recording.selectedDeviceId,
        },
        playback: initialState.playback,
        effects: {
          ...state.effects,
          processedBuffer: null,
          isProcessing: false,
        },
        error: null,
      }
    default:
      return state
  }
}

// ---- Context ----

interface AppContextValue {
  state: AppState
  dispatch: React.Dispatch<Action>
  audioCapture: AudioCapture
  audioProcessor: AudioProcessor
  audioExporter: AudioExporter
}

const AppContext = createContext<AppContextValue | null>(null)

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  // Stable refs for audio instances
  const audioCaptureRef = useRef(new AudioCapture())
  const audioProcessorRef = useRef(new AudioProcessor())
  const audioExporterRef = useRef(new AudioExporter())

  return (
    <AppContext.Provider
      value={{
        state,
        dispatch,
        audioCapture: audioCaptureRef.current,
        audioProcessor: audioProcessorRef.current,
        audioExporter: audioExporterRef.current,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

// Export context for use in the separate hook file
export { AppContext }
export type { AppContextValue }
