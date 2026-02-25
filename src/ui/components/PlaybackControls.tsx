import { useAudio } from '@/hooks/useAudio'
import { EFFECT_DEFINITIONS } from '@/audio/effects'
import styles from './PlaybackControls.module.css'

function formatTime(s: number): string {
  const m = Math.floor(s / 60)
  const sec = Math.floor(s % 60)
  return `${m}:${String(sec).padStart(2, '0')}`
}

export function PlaybackControls() {
  const { state, playOriginal, playProcessed, stopPlayback, downloadProcessed } = useAudio()
  const { recording, playback, effects } = state

  const hasRecording = recording.audioBuffer !== null
  const hasProcessed = effects.processedBuffer !== null
  const isPlaying = playback.status === 'playing'
  const totalDuration = recording.audioBuffer?.duration ?? 0
  const progress = totalDuration > 0 ? (playback.currentTime / totalDuration) * 100 : 0

  const selectedDef = effects.selectedEffectId
    ? EFFECT_DEFINITIONS.find((d) => d.id === effects.selectedEffectId)
    : null

  if (!hasRecording) return null

  return (
    <section className={styles.section} aria-labelledby="playback-heading">
      <h2 id="playback-heading" className={styles.heading}>
        ▶ Playback
      </h2>

      {/* Progress bar */}
      <div className={styles.progressRow}>
        <span className={styles.time}>{formatTime(playback.currentTime)}</span>
        <div
          className={styles.progressBar}
          role="progressbar"
          aria-valuenow={Math.round(progress)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Playback progress"
        >
          <div className={styles.progressFill} style={{ width: `${Math.min(progress, 100)}%` }} />
        </div>
        <span className={styles.time}>{formatTime(totalDuration)}</span>
      </div>

      {/* Playback buttons */}
      <div className={styles.controls}>
        {/* Original */}
        <button
          className={`${styles.playBtn} ${isPlaying && playback.isOriginal ? styles.active : ''}`}
          onClick={isPlaying && playback.isOriginal ? stopPlayback : playOriginal}
          aria-label={isPlaying && playback.isOriginal ? 'Stop original' : 'Play original recording'}
          data-testid="play-original-button"
        >
          <span aria-hidden="true">{isPlaying && playback.isOriginal ? '⏹' : '▶'}</span>
          Original
        </button>

        {/* Processed */}
        {hasProcessed && selectedDef && (
          <button
            className={`${styles.playBtn} ${styles.processedBtn} ${isPlaying && !playback.isOriginal ? styles.active : ''}`}
            style={{ '--effect-color': selectedDef.color } as React.CSSProperties}
            onClick={isPlaying && !playback.isOriginal ? stopPlayback : playProcessed}
            aria-label={
              isPlaying && !playback.isOriginal
                ? `Stop ${selectedDef.name}`
                : `Play ${selectedDef.name} effect`
            }
            data-testid="play-button"
          >
            <span aria-hidden="true">{isPlaying && !playback.isOriginal ? '⏹' : selectedDef.emoji}</span>
            {selectedDef.name}
          </button>
        )}

        {/* Stop all */}
        {isPlaying && (
          <button
            className={styles.stopBtn}
            onClick={stopPlayback}
            aria-label="Stop playback"
          >
            ⏹ Stop
          </button>
        )}

        {/* Download */}
        {hasProcessed && (
          <button
            className={styles.downloadBtn}
            onClick={downloadProcessed}
            aria-label="Download processed audio as WAV"
            data-testid="download-button"
          >
            ⬇ Download WAV
          </button>
        )}
      </div>

      {/* A/B comparison hint */}
      {hasProcessed && (
        <p className={styles.abHint} aria-live="polite">
          {playback.isOriginal ? '📢 Listening to: Original' : `📢 Listening to: ${selectedDef?.name ?? 'Effect'}`}
        </p>
      )}
    </section>
  )
}
