import { useAudio } from '@/hooks/useAudio'
import styles from './DemoSamples.module.css'

const base = import.meta.env.BASE_URL

const DEMO_SAMPLES = [
  {
    id: 'sample-sine',
    name: 'Ahh – Eee – Ohh',
    description: 'Three vowel sounds in a child\'s voice — great for Robot or Telephone',
    url: `${base}samples/sine-440.wav`,
  },
  {
    id: 'sample-sweep',
    name: 'La La La Melody',
    description: 'A sung C–E–G melody — try Chipmunk for an Alvin effect!',
    url: `${base}samples/sweep.wav`,
  },
  {
    id: 'sample-voice',
    name: 'Hello! Woo-hoo!',
    description: 'An excited greeting — Deep Voice sounds like a giant, Chipmunk like a mouse',
    url: `${base}samples/demo-voice.wav`,
  },
]

export function DemoSamples() {
  const { state, loadDemoSample, dispatch } = useAudio()
  const { ui } = state

  return (
    <div className={styles.wrapper}>
      <button
        className={styles.toggle}
        onClick={() => dispatch({ type: 'TOGGLE_DEMO_SAMPLES' })}
        aria-expanded={ui.showDemoSamples}
        aria-controls="demo-samples-panel"
      >
        🎵 Try a demo sample (no microphone needed)
        <span className={`${styles.chevron} ${ui.showDemoSamples ? styles.chevronUp : ''}`} aria-hidden="true">
          ▼
        </span>
      </button>

      {ui.showDemoSamples && (
        <div id="demo-samples-panel" className={styles.panel}>
          <p className={styles.description}>
            Choose a pre-made audio sample to experiment with effects without recording:
          </p>
          <ul className={styles.list}>
            {DEMO_SAMPLES.map((sample) => (
              <li key={sample.id}>
                <button
                  className={styles.sampleBtn}
                  onClick={() => loadDemoSample(sample.url)}
                  aria-label={`Load ${sample.name}: ${sample.description}`}
                >
                  <span className={styles.sampleName}>{sample.name}</span>
                  <span className={styles.sampleDesc}>{sample.description}</span>
                  <span className={styles.loadLabel}>Use This →</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
