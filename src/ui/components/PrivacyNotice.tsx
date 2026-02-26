import { useAppContext } from '@/state/useAppContext'
import { useTranslations } from '@/i18n/useTranslations'
import styles from './PrivacyNotice.module.css'

export function PrivacyNotice() {
  const { state, dispatch } = useAppContext()
  const t = useTranslations()

  if (!state.ui.showPrivacyNotice) return null

  return (
    <div className={styles.banner} role="banner" aria-label="Privacy notice">
      <span className={styles.icon} aria-hidden="true">🔒</span>
      <p className={styles.text}>
        <strong>{t.privacyStrong}</strong> {t.privacySubtext}
      </p>
      <button
        className={styles.dismiss}
        onClick={() => dispatch({ type: 'DISMISS_PRIVACY_NOTICE' })}
        aria-label={t.dismissPrivacy}
      >
        ✕
      </button>
    </div>
  )
}
