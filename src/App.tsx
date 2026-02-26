import { useState } from 'react'
import { AppProvider } from '@/state/AppContext'
import { useAppContext } from '@/state/useAppContext'
import { useAudio } from '@/hooks/useAudio'
import { useTranslations } from '@/i18n/useTranslations'
import { ErrorBoundary } from '@/ui/components/ErrorBoundary'
import { RecordingControls } from '@/ui/components/RecordingControls'
import { EffectSelector } from '@/ui/components/EffectSelector'
import { PlaybackControls } from '@/ui/components/PlaybackControls'
import { EducationalPanel } from '@/ui/components/EducationalPanel'
import { DemoSamples } from '@/ui/components/DemoSamples'
import { PrivacyNotice } from '@/ui/components/PrivacyNotice'
import { LegalModal } from '@/ui/components/LegalModal'
import { ErrorDisplay } from '@/ui/components/ErrorDisplay'
import { isFullySupported } from '@/utils/browserDetect'
import '@/ui/styles/global.css'
import styles from './App.module.css'

function BrowserNotSupported() {
  const t = useTranslations()
  return (
    <div className={styles.unsupported} role="alert">
      <div className={styles.unsupportedCard}>
        <span style={{ fontSize: '3rem' }}>🌐</span>
        <h1>{t.browserNotSupported}</h1>
        <p>{t.browserMessage}</p>
        <p>{t.pleaseUseOne}</p>
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
  const { state, dispatch } = useAppContext()
  const t = useTranslations()
  const [modal, setModal] = useState<'privacy' | 'license' | null>(null)
  useAudio() // Initialize audio hooks

  if (!isFullySupported()) {
    return <BrowserNotSupported />
  }

  return (
    <div className={styles.app}>
      {/* Skip navigation */}
      <a href="#main-content" className="skip-link">
        {t.skipToMain}
      </a>

      {/* Header */}
      <header className={styles.header}>
        <div className="container">
          <div className={styles.headerInner}>
            <div className={styles.logoArea}>
              <span className={styles.logoIcon} aria-hidden="true">🎤</span>
              <div>
                <h1 className={styles.title}>{t.appTitle}</h1>
                <p className={styles.subtitle}>{t.appSubtitle}</p>
              </div>
            </div>
            <div className={styles.headerActions}>
              <button
                className={styles.privacyBadge}
                onClick={() => setModal('privacy')}
                aria-label="View privacy details"
              >
                {t.privacyFirst}
              </button>
              <select
                className={styles.langSelect}
                value={state.ui.language}
                onChange={(e) =>
                  dispatch({ type: 'SET_LANGUAGE', language: e.target.value as 'en' | 'es' })
                }
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
            {t.footerText}{' '}
            <a href="https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API" target="_blank" rel="noopener noreferrer">
              {t.learnWebAudio}
            </a>
          </p>
          <p className={styles.footerText}>
            {t.by}{' '}
            <a href="https://www.yourspraveen.com" target="_blank" rel="noopener noreferrer">
              yourspraveen.com
            </a>
            {' • '}
            <a href="https://github.com/yourspraveen/browser-voice-changer" target="_blank" rel="noopener noreferrer">
              {t.viewOnGitHub}
            </a>
            {' • '}
            <button className={styles.footerLink} onClick={() => setModal('license')}>
              {t.licenseDisclaimer}
            </button>
          </p>
        </div>
      </footer>

      {/* Privacy notice */}
      <PrivacyNotice />

      {/* Legal modals */}
      {modal && <LegalModal kind={modal} onClose={() => setModal(null)} />}
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
