import { useAudio } from '@/hooks/useAudio'
import { useTranslations } from '@/i18n/useTranslations'
import styles from './DemoSamples.module.css'

const base = import.meta.env.BASE_URL

const SAMPLE_URLS = [
  `${base}samples/sine-440.wav`,
  `${base}samples/sweep.wav`,
  `${base}samples/demo-voice.wav`,
]

export function DemoSamples() {
  const { state, loadDemoSample, dispatch } = useAudio()
  const t = useTranslations()
  const { ui } = state

  return (
    <div className={styles.wrapper}>
      <button
        className={styles.toggle}
        onClick={() => dispatch({ type: 'TOGGLE_DEMO_SAMPLES' })}
        aria-expanded={ui.showDemoSamples}
        aria-controls="demo-samples-panel"
      >
        {t.tryDemo}
        <span className={`${styles.chevron} ${ui.showDemoSamples ? styles.chevronUp : ''}`} aria-hidden="true">
          ▼
        </span>
      </button>

      {ui.showDemoSamples && (
        <div id="demo-samples-panel" className={styles.panel}>
          <p className={styles.description}>{t.demoDescription}</p>
          <ul className={styles.list}>
            {t.samples.map((sample, i) => (
              <li key={sample.id}>
                <button
                  className={styles.sampleBtn}
                  onClick={() => loadDemoSample(SAMPLE_URLS[i] ?? '')}
                  aria-label={`Load ${sample.name}: ${sample.description}`}
                >
                  <span className={styles.sampleName}>{sample.name}</span>
                  <span className={styles.sampleDesc}>{sample.description}</span>
                  <span className={styles.loadLabel}>{t.useThis}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
