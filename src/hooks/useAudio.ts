import { useCallback, useEffect, useRef } from 'react'
import { useAppContext } from '@/state/useAppContext'
import type { EffectId, EffectParams } from '@/types/audio'
import { EFFECT_DEFINITIONS } from '@/audio/effects'

const COUNTDOWN_SECONDS = 3

export function useAudio() {
  const { state, dispatch, audioCapture, audioProcessor, audioExporter } = useAppContext()
  const playbackTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const durationTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Clean up on unmount
  useEffect(() => {
    return () => {
      clearInterval(playbackTimerRef.current!)
      clearInterval(durationTimerRef.current!)
      audioCapture.dispose()
      audioProcessor.dispose()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Input level monitoring
  useEffect(() => {
    const handler = (level: unknown) => {
      dispatch({ type: 'SET_INPUT_LEVEL', level: level as number })
    }
    audioCapture.on('level', handler)
    return () => audioCapture.off('level', handler)
  }, [audioCapture, dispatch])

  const startRecording = useCallback(async () => {
    dispatch({ type: 'SET_ERROR', error: null })

    // Countdown
    for (let i = COUNTDOWN_SECONDS; i >= 1; i--) {
      dispatch({ type: 'SET_COUNTDOWN', countdown: i })
      await new Promise<void>((r) => setTimeout(r, 1000))
    }
    dispatch({ type: 'SET_COUNTDOWN', countdown: null })

    try {
      dispatch({ type: 'SET_RECORDING_STATUS', status: 'recording' })
      await audioCapture.startRecording(state.recording.selectedDeviceId ?? undefined)

      // Duration ticker
      durationTimerRef.current = setInterval(() => {
        dispatch({ type: 'SET_RECORDING_DURATION', duration: audioCapture.getDuration() })
      }, 100)
    } catch (err: unknown) {
      dispatch({ type: 'SET_RECORDING_STATUS', status: 'idle' })
      const error = err as DOMException
      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        dispatch({
          type: 'SET_ERROR',
          error: {
            type: 'permission',
            message: 'Microphone access denied. Please allow microphone access in your browser settings.',
            recoverable: false,
          },
        })
      } else if (error.name === 'NotFoundError') {
        dispatch({
          type: 'SET_ERROR',
          error: {
            type: 'browser',
            message: 'No microphone found. Please connect a microphone and try again.',
            recoverable: true,
          },
        })
      } else {
        dispatch({
          type: 'SET_ERROR',
          error: {
            type: 'unknown',
            message: 'Recording failed. Please try again.',
            recoverable: true,
          },
        })
      }
    }
  }, [audioCapture, dispatch, state.recording.selectedDeviceId])

  const stopRecording = useCallback(async () => {
    clearInterval(durationTimerRef.current!)
    dispatch({ type: 'SET_RECORDING_STATUS', status: 'stopped' })

    try {
      const blob = await audioCapture.stopRecording()
      dispatch({ type: 'SET_AUDIO_BLOB', blob })

      // Decode audio buffer for visualization and processing
      const buffer = await audioProcessor.loadAudio(blob)
      dispatch({ type: 'SET_AUDIO_BUFFER', buffer })
      dispatch({ type: 'SET_RECORDING_DURATION', duration: buffer.duration })
    } catch {
      dispatch({
        type: 'SET_ERROR',
        error: {
          type: 'processing',
          message: 'Failed to process recording. Please try again.',
          recoverable: true,
        },
      })
    }
  }, [audioCapture, audioProcessor, dispatch])

  const pauseRecording = useCallback(() => {
    clearInterval(durationTimerRef.current!)
    audioCapture.pauseRecording()
    dispatch({ type: 'SET_RECORDING_STATUS', status: 'paused' })
  }, [audioCapture, dispatch])

  const resumeRecording = useCallback(() => {
    audioCapture.resumeRecording()
    dispatch({ type: 'SET_RECORDING_STATUS', status: 'recording' })
    durationTimerRef.current = setInterval(() => {
      dispatch({ type: 'SET_RECORDING_DURATION', duration: audioCapture.getDuration() })
    }, 100)
  }, [audioCapture, dispatch])

  const resetRecording = useCallback(() => {
    clearInterval(durationTimerRef.current!)
    clearInterval(playbackTimerRef.current!)
    audioCapture.dispose()
    audioProcessor.stopPlayback()
    dispatch({ type: 'RESET_RECORDING' })
  }, [audioCapture, audioProcessor, dispatch])

  const loadDemoSample = useCallback(async (url: string) => {
    dispatch({ type: 'SET_ERROR', error: null })
    try {
      const buffer = await audioProcessor.loadAudio(url)
      dispatch({ type: 'SET_AUDIO_BUFFER', buffer })
      dispatch({ type: 'SET_AUDIO_BLOB', blob: null })
      dispatch({ type: 'SET_RECORDING_STATUS', status: 'stopped' })
      dispatch({ type: 'SET_RECORDING_DURATION', duration: buffer.duration })
    } catch {
      dispatch({
        type: 'SET_ERROR',
        error: {
          type: 'network',
          message: 'Failed to load demo sample. Please try again.',
          recoverable: true,
        },
      })
    }
  }, [audioProcessor, dispatch])

  const applyEffect = useCallback(async (effectId: EffectId, params: EffectParams) => {
    if (!state.recording.audioBuffer) return

    dispatch({ type: 'SELECT_EFFECT', effectId })
    dispatch({ type: 'SET_EFFECT_PARAMS', effectId, params })
    dispatch({ type: 'SET_PROCESSING', isProcessing: true })

    try {
      const processed = await audioProcessor.applyEffect(
        state.recording.audioBuffer,
        effectId,
        params
      )
      dispatch({ type: 'SET_PROCESSED_BUFFER', buffer: processed })
    } catch {
      dispatch({
        type: 'SET_ERROR',
        error: {
          type: 'processing',
          message: 'Effect processing failed. Try recording again.',
          recoverable: true,
        },
      })
    } finally {
      dispatch({ type: 'SET_PROCESSING', isProcessing: false })
    }
  }, [audioProcessor, dispatch, state.recording.audioBuffer])

  const playOriginal = useCallback(async () => {
    if (!state.recording.audioBuffer) return
    clearInterval(playbackTimerRef.current!)
    dispatch({ type: 'SET_PLAYBACK_ORIGINAL', isOriginal: true })
    dispatch({ type: 'SET_PLAYBACK_STATUS', status: 'playing' })

    await audioProcessor.playAudio(state.recording.audioBuffer, 0, () => {
      clearInterval(playbackTimerRef.current!)
      dispatch({ type: 'SET_PLAYBACK_STATUS', status: 'idle' })
      dispatch({ type: 'SET_PLAYBACK_TIME', time: 0 })
    })

    playbackTimerRef.current = setInterval(() => {
      dispatch({ type: 'SET_PLAYBACK_TIME', time: audioProcessor.getCurrentTime() })
    }, 50)
  }, [audioProcessor, dispatch, state.recording.audioBuffer])

  const playProcessed = useCallback(async () => {
    if (!state.effects.processedBuffer) return
    clearInterval(playbackTimerRef.current!)
    dispatch({ type: 'SET_PLAYBACK_ORIGINAL', isOriginal: false })
    dispatch({ type: 'SET_PLAYBACK_STATUS', status: 'playing' })

    await audioProcessor.playAudio(state.effects.processedBuffer, 0, () => {
      clearInterval(playbackTimerRef.current!)
      dispatch({ type: 'SET_PLAYBACK_STATUS', status: 'idle' })
      dispatch({ type: 'SET_PLAYBACK_TIME', time: 0 })
    })

    playbackTimerRef.current = setInterval(() => {
      dispatch({ type: 'SET_PLAYBACK_TIME', time: audioProcessor.getCurrentTime() })
    }, 50)
  }, [audioProcessor, dispatch, state.effects.processedBuffer])

  const stopPlayback = useCallback(() => {
    clearInterval(playbackTimerRef.current!)
    audioProcessor.stopPlayback()
    dispatch({ type: 'SET_PLAYBACK_STATUS', status: 'idle' })
    dispatch({ type: 'SET_PLAYBACK_TIME', time: 0 })
  }, [audioProcessor, dispatch])

  const downloadProcessed = useCallback(async () => {
    const buffer = state.effects.processedBuffer
    const effectId = state.effects.selectedEffectId
    if (!buffer || !effectId) return

    const def = EFFECT_DEFINITIONS.find((d) => d.id === effectId)
    const name = def?.name ?? effectId
    await audioExporter.exportAndDownload(buffer, name, 'wav')
  }, [audioExporter, state.effects.processedBuffer, state.effects.selectedEffectId])

  return {
    state,
    dispatch,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    resetRecording,
    loadDemoSample,
    applyEffect,
    playOriginal,
    playProcessed,
    stopPlayback,
    downloadProcessed,
  }
}
