import { isIOS, getBrowserName } from '@/utils/browserDetect'
import styles from './MicPermissionHelp.module.css'

// ── Shown below the Record button before any recording ──────────────────────
export function MicHint() {
  return (
    <div className={styles.hint} role="note">
      <span className={styles.hintIcon} aria-hidden="true">🎤</span>
      <span>
        When you tap <strong>Record</strong>, your browser will ask for microphone
        access. Your audio is processed entirely on this device and is never uploaded.
      </span>
    </div>
  )
}

// ── Shown inside the error banner when permission is denied ──────────────────
export function MicPermissionFix() {
  const ios = isIOS()
  const browser = getBrowserName()

  return (
    <div className={styles.fixPanel} role="note" aria-label="How to fix microphone permission">
      <p className={styles.fixTitle}>How to re-enable microphone access:</p>
      <ol className={styles.fixSteps}>
        {getSteps(browser, ios).map((step, i) => (
          <li key={i}>
            <span className={styles.stepNum}>{i + 1}.</span>
            <span dangerouslySetInnerHTML={{ __html: step }} />
          </li>
        ))}
      </ol>
      {!ios && (
        <p className={styles.fixNote}>
          After changing the setting, refresh this page and tap Record again.
        </p>
      )}
      {ios && (
        <p className={styles.fixNote}>
          After changing the setting, return to this page and tap Record again.
        </p>
      )}
    </div>
  )
}

function getSteps(browser: ReturnType<typeof getBrowserName>, ios: boolean): string[] {
  if (ios && browser === 'safari') {
    return [
      'Open the <strong>Settings</strong> app on your iPhone/iPad.',
      'Scroll down and tap <strong>Safari</strong>.',
      'Under "Settings for Websites", tap <strong>Microphone</strong> and set it to <strong>Allow</strong>.',
    ]
  }
  if (ios) {
    // iOS Chrome or other iOS browser
    return [
      'Open the <strong>Settings</strong> app on your iPhone/iPad.',
      'Scroll down and tap <strong>Chrome</strong> (or your browser name).',
      'Enable the <strong>Microphone</strong> toggle.',
    ]
  }
  if (browser === 'firefox') {
    return [
      'Click the <strong>🔒 lock icon</strong> in the address bar.',
      'Next to <em>Microphone</em>, click the <kbd>×</kbd> to clear the block.',
      'Refresh the page — click <strong>Allow</strong> when prompted.',
    ]
  }
  if (browser === 'safari') {
    return [
      'Open <strong>Safari → Settings</strong> (or Preferences on older macOS).',
      'Go to the <strong>Websites</strong> tab → <strong>Microphone</strong>.',
      'Find this site and set it to <strong>Allow</strong>, then refresh.',
    ]
  }
  // Chrome, Edge, or other Chromium
  return [
    'Click the <strong>🔒 lock icon</strong> (or ⓘ) in the address bar.',
    'Select <strong>Site settings</strong> → <strong>Microphone</strong> → <strong>Allow</strong>.',
    'Refresh this page and tap Record again.',
  ]
}
