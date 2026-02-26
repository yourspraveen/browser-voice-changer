import { useAudio } from '@/hooks/useAudio'
import { MicPermissionFix } from './MicPermissionHelp'
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
    <div role="alert" aria-live="assertive" aria-atomic="true">
      <div className={styles.alert}>
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
      {error.type === 'permission' && <MicPermissionFix />}
    </div>
  )
}
