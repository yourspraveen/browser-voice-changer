import { useAudio } from '@/hooks/useAudio'
import styles from './ErrorDisplay.module.css'

export function ErrorDisplay() {
  const { state, dispatch } = useAudio()
  const { error } = state

  if (!error) return null

  const icons: Record<string, string> = {
    permission: '🎙️',
    processing: '⚙️',
    browser: '🌐',
    network: '📡',
    unknown: '⚠️',
  }

  return (
    <div
      className={styles.alert}
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
    >
      <span className={styles.icon} aria-hidden="true">
        {icons[error.type] ?? '⚠️'}
      </span>
      <p className={styles.message}>{error.message}</p>
      <button
        className={styles.dismiss}
        onClick={() => dispatch({ type: 'SET_ERROR', error: null })}
        aria-label="Dismiss error"
      >
        ✕
      </button>
    </div>
  )
}
