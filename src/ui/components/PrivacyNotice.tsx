import { useAppContext } from '@/state/useAppContext'
import styles from './PrivacyNotice.module.css'

export function PrivacyNotice() {
  const { state, dispatch } = useAppContext()

  if (!state.ui.showPrivacyNotice) return null

  return (
    <div className={styles.banner} role="banner" aria-label="Privacy notice">
      <span className={styles.icon} aria-hidden="true">🔒</span>
      <p className={styles.text}>
        <strong>Your audio stays on your device.</strong> Nothing is uploaded or stored remotely.
      </p>
      <button
        className={styles.dismiss}
        onClick={() => dispatch({ type: 'DISMISS_PRIVACY_NOTICE' })}
        aria-label="Dismiss privacy notice"
      >
        ✕
      </button>
    </div>
  )
}
