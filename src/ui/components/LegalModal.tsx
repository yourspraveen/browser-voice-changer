import { useEffect, useRef } from 'react'
import styles from './LegalModal.module.css'

interface LegalModalProps {
  kind: 'privacy' | 'license'
  onClose: () => void
}

export function LegalModal({ kind, onClose }: LegalModalProps) {
  const closeRef = useRef<HTMLButtonElement>(null)

  // Focus close button on open; close on Escape
  useEffect(() => {
    closeRef.current?.focus()
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div
      className={styles.overlay}
      role="dialog"
      aria-modal="true"
      aria-label={kind === 'privacy' ? 'Privacy details' : 'License and disclaimer'}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className={styles.card}>
        <div className={styles.header}>
          <span className={styles.title}>
            {kind === 'privacy' ? '🔒 Privacy & Data Policy' : '📄 License & Disclaimer'}
          </span>
          <button ref={closeRef} className={styles.close} onClick={onClose} aria-label="Close">✕</button>
        </div>

        <div className={styles.body}>
          {kind === 'privacy' ? <PrivacyContent /> : <LicenseContent />}
        </div>
      </div>
    </div>
  )
}

function PrivacyContent() {
  return (
    <>
      <div className={styles.section}>
        <p className={styles.sectionText}>
          This app is designed to be <strong>100% private by default</strong>. Your voice
          recordings never leave your device — all audio processing runs entirely inside your
          browser using the Web Audio API.
        </p>
      </div>

      <div className={styles.section}>
        <p className={styles.sectionTitle}>What we collect</p>
        <ul className={styles.list}>
          <li>Nothing. No audio, no usage data, no personal information of any kind.</li>
        </ul>
      </div>

      <div className={styles.section}>
        <p className={styles.sectionTitle}>What happens to your recordings</p>
        <ul className={styles.list}>
          <li>Audio is captured locally and stored only in browser memory.</li>
          <li>No microphone data is ever transmitted to a server.</li>
          <li>Recordings are cleared automatically when you close or refresh the tab.</li>
          <li>The "Download WAV" button saves audio only to your own device.</li>
        </ul>
      </div>

      <div className={styles.section}>
        <p className={styles.sectionTitle}>No tracking, ever</p>
        <ul className={styles.list}>
          <li>No cookies, analytics scripts, or fingerprinting.</li>
          <li>No third-party SDKs or ad networks.</li>
          <li>Works fully offline after the first load (PWA).</li>
        </ul>
      </div>

      <div className={styles.section}>
        <p className={styles.sectionTitle}>Open source</p>
        <p className={styles.sectionText}>
          The full source code is publicly auditable on{' '}
          <a
            className={styles.link}
            href="https://github.com/yourspraveen/browser-voice-changer"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
          . You can verify every claim above yourself.
        </p>
      </div>
    </>
  )
}

function LicenseContent() {
  return (
    <>
      <div className={styles.section}>
        <p className={styles.sectionTitle}>MIT License</p>
        <div className={styles.licenseBox}>{`Copyright © 2025 Praveen (yourspraveen.com)

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS
BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.`}</div>
      </div>

      <hr className={styles.divider} />

      <div className={styles.section}>
        <p className={styles.sectionTitle}>Educational Use Disclaimer</p>
        <p className={styles.sectionText}>
          This application is provided solely for <strong>educational and demonstration
          purposes</strong> to help students explore concepts in audio engineering and digital
          signal processing.
        </p>
      </div>

      <div className={styles.disclaimer}>
        <strong>No Liability.</strong> Use of this application is entirely at the discretion
        of the student or user. Neither IEEE, any affiliated organisation, nor the author
        (yourspraveen.com) accepts any responsibility or liability — direct or indirect — for
        any outcome arising from the use, misuse, or inability to use this application.
        The software is provided "as is", without warranty of any kind. Users are solely
        responsible for ensuring their use complies with applicable laws, school policies,
        and institutional guidelines.
      </div>

      <div className={styles.section}>
        <p className={styles.sectionText}>
          Full source code:{' '}
          <a
            className={styles.link}
            href="https://github.com/yourspraveen/browser-voice-changer"
            target="_blank"
            rel="noopener noreferrer"
          >
            github.com/yourspraveen/browser-voice-changer
          </a>
        </p>
      </div>
    </>
  )
}
