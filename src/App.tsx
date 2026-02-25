import { AppProvider } from '@/state/AppContext'
import { useAppContext } from '@/state/useAppContext'
import { useAudio } from '@/hooks/useAudio'
import { ErrorBoundary } from '@/ui/components/ErrorBoundary'
import { RecordingControls } from '@/ui/components/RecordingControls'
import { EffectSelector } from '@/ui/components/EffectSelector'
import { PlaybackControls } from '@/ui/components/PlaybackControls'
import { EducationalPanel } from '@/ui/components/EducationalPanel'
import { DemoSamples } from '@/ui/components/DemoSamples'
import { PrivacyNotice } from '@/ui/components/PrivacyNotice'
import { ErrorDisplay } from '@/ui/components/ErrorDisplay'
import { isFullySupported } from '@/utils/browserDetect'
import '@/ui/styles/global.css'
import styles from './App.module.css'

function BrowserNotSupported() {
  return (
    <div className={styles.unsupported} role="alert">
      <div className={styles.unsupportedCard}>
        <span style={{ fontSize: '3rem' }}>🌐</span>
        <h1>Browser Not Supported</h1>
        <p>
          This Voice Changer requires a modern browser with Web Audio API support.
        </p>
        <p>Please use one of:</p>
        <ul>
          <li>Chrome 79+</li>
          <li>Edge 79+</li>
          <li>Safari 14.1+</li>
          <li>Firefox 76+</li>
        </ul>
      </div>
    </div>
  )
}

function AppContent() {
  const { state } = useAppContext()
  useAudio() // Initialize audio hooks

  if (!isFullySupported()) {
    return <BrowserNotSupported />
  }

  return (
    <div className={styles.app}>
      {/* Skip navigation */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      {/* Header */}
      <header className={styles.header}>
        <div className="container">
          <div className={styles.headerInner}>
            <div className={styles.logoArea}>
              <span className={styles.logoIcon} aria-hidden="true">🎤</span>
              <div>
                <h1 className={styles.title}>Voice Changer</h1>
                <p className={styles.subtitle}>STEM Audio Demo</p>
              </div>
            </div>
            <div className={styles.headerActions}>
              <span className={styles.privacyBadge} title="Your audio never leaves your device">
                🔒 Privacy-First
              </span>
              <select
                className={styles.langSelect}
                value={state.ui.language}
                onChange={(_e) => {
                  // Language switcher is a stretch goal
                }}
                aria-label="Select language"
              >
                <option value="en">EN</option>
                <option value="es">ES</option>
              </select>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main id="main-content" className={styles.main}>
        <div className="container">
          <div className={styles.layout}>
            {/* Error display */}
            {state.error && (
              <div className={styles.errorArea}>
                <ErrorDisplay />
              </div>
            )}

            {/* Recording section */}
            <RecordingControls />

            {/* Demo samples */}
            <DemoSamples />

            {/* Effect selector */}
            <EffectSelector />

            {/* Playback controls */}
            <PlaybackControls />

            {/* Educational panel */}
            <EducationalPanel />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className="container">
          <p className={styles.footerText}>
            Built for STEM education • Open source •{' '}
            <a href="https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API" target="_blank" rel="noopener noreferrer">
              Learn about Web Audio
            </a>
          </p>
        </div>
      </footer>

      {/* Privacy notice */}
      <PrivacyNotice />
    </div>
  )
}

export function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </ErrorBoundary>
  )
}
