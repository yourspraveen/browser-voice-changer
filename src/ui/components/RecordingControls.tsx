import { useEffect, useState } from 'react'
import { useAudio } from '@/hooks/useAudio'
import { useTranslations } from '@/i18n/useTranslations'
import { LevelMeter } from './LevelMeter'
import { WaveformDisplay } from './WaveformDisplay'
import styles from './RecordingControls.module.css'

const MAX_DURATION = 10

function formatTime(seconds: number): string {
  const s = Math.min(seconds, MAX_DURATION)
  const m = Math.floor(s / 60)
  const sec = Math.floor(s % 60)
  return `${m}:${String(sec).padStart(2, '0')}`
}

export function RecordingControls() {
  const { state, dispatch, startRecording, stopRecording, pauseRecording, resumeRecording, resetRecording } =
    useAudio()
  const t = useTranslations()
  const { recording, ui } = state
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([])

  useEffect(() => {
    navigator.mediaDevices
      ?.enumerateDevices()
      .then((all) => setDevices(all.filter((d) => d.kind === 'audioinput')))
      .catch(() => {})
  }, [])

  const isIdle = recording.status === 'idle'
  const isCountdown = recording.status === 'countdown'
  const isRecording = recording.status === 'recording'
  const isPaused = recording.status === 'paused'
  const isStopped = recording.status === 'stopped'
  const hasRecording = isStopped && recording.audioBuffer

  const progress = (recording.duration / MAX_DURATION) * 100
  const remaining = Math.max(0, MAX_DURATION - recording.duration)

  return (
    <section className={styles.section} aria-labelledby="recording-heading">
      <h2 id="recording-heading" className={styles.heading}>
        {t.recordHeading}
      </h2>

      {/* Waveform */}
      <div className={styles.waveform}>
        <WaveformDisplay
          audioBuffer={isRecording || isPaused ? null : (recording.audioBuffer ?? null)}
          analyser={null}
          isRecording={isRecording}
          color={isRecording ? '#ef4444' : '#3b82f6'}
        />
      </div>

      {/* Level meter - only during recording */}
      {(isRecording || isPaused) && (
        <div className={styles.levelWrapper}>
          <span className={styles.levelLabel}>{t.inputLevel}</span>
          <LevelMeter level={recording.inputLevel} />
        </div>
      )}

      {/* Timer and progress bar */}
      {(isRecording || isPaused || isStopped) && (
        <div className={styles.timerRow}>
          <span className={styles.timer} aria-live="polite" aria-atomic="true">
            {formatTime(recording.duration)}
          </span>
          <div className={styles.progressBar} role="progressbar"
            aria-valuenow={Math.round(progress)}
            aria-valuemin={0} aria-valuemax={100}>
            <div
              className={`${styles.progressFill} ${isRecording ? styles.progressRecording : ''}`}
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
          <span className={styles.remaining}>
            {isRecording ? t.secondsLeft(Math.ceil(remaining)) : t.ofSeconds(MAX_DURATION)}
          </span>
        </div>
      )}

      {/* Countdown overlay */}
      {ui.countdown !== null && (
        <div className={styles.countdown} role="status" aria-live="assertive">
          {ui.countdown}
        </div>
      )}

      {/* Main controls */}
      <div className={styles.controls}>
        {isIdle && (
          <button
            className={styles.recordBtn}
            onClick={startRecording}
            aria-label="Start recording"
            data-testid="record-button"
          >
            <span className={styles.recordDot} aria-hidden="true" />
            {t.record}
          </button>
        )}

        {isCountdown && (
          <button className={styles.recordBtn} disabled aria-label="Starting recording...">
            <span className={styles.recordDot} aria-hidden="true" />
            {t.starting}
          </button>
        )}

        {isRecording && (
          <>
            <button
              className={`${styles.recordBtn} ${styles.recording}`}
              onClick={stopRecording}
              aria-label="Stop recording"
              data-testid="stop-button"
            >
              <span className={styles.stopSquare} aria-hidden="true" />
              {t.stop}
            </button>
            <button
              className={styles.secondaryBtn}
              onClick={pauseRecording}
              aria-label="Pause recording"
            >
              {t.pause}
            </button>
          </>
        )}

        {isPaused && (
          <>
            <button
              className={`${styles.recordBtn} ${styles.recording}`}
              onClick={stopRecording}
              aria-label="Stop recording"
            >
              <span className={styles.stopSquare} aria-hidden="true" />
              {t.stop}
            </button>
            <button
              className={styles.secondaryBtn}
              onClick={resumeRecording}
              aria-label="Resume recording"
            >
              {t.resume}
            </button>
          </>
        )}

        {hasRecording && (
          <button
            className={styles.resetBtn}
            onClick={resetRecording}
            aria-label="Delete recording and start over"
            data-testid="reset-button"
          >
            {t.deleteRecording}
          </button>
        )}
      </div>

      {/* Device selector */}
      {devices.length > 1 && (isIdle || isCountdown) && (
        <div className={styles.deviceSelector}>
          <label htmlFor="mic-select" className={styles.deviceLabel}>
            {t.microphone}
          </label>
          <select
            id="mic-select"
            className={styles.deviceSelect}
            value={recording.selectedDeviceId ?? ''}
            onChange={(e) =>
              dispatch({ type: 'SET_SELECTED_DEVICE', deviceId: e.target.value || null })
            }
            aria-label="Select microphone input"
          >
            {devices.map((d) => (
              <option key={d.deviceId} value={d.deviceId}>
                {d.label || `Microphone ${d.deviceId.slice(0, 8)}`}
              </option>
            ))}
          </select>
        </div>
      )}
    </section>
  )
}
