import { useAudio } from '@/hooks/useAudio'
import { EFFECT_DEFINITIONS } from '@/audio/effects'
import styles from './EducationalPanel.module.css'

export function EducationalPanel() {
  const { state, dispatch } = useAudio()
  const { effects, ui } = state

  const selectedDef = effects.selectedEffectId
    ? EFFECT_DEFINITIONS.find((d) => d.id === effects.selectedEffectId)
    : null

  if (!selectedDef) return null

  const { educational } = selectedDef

  return (
    <section
      className={`${styles.panel} ${ui.showEducational ? styles.expanded : ''}`}
      aria-labelledby="edu-heading"
    >
      <button
        className={styles.toggle}
        onClick={() => dispatch({ type: 'SET_SHOW_EDUCATIONAL', show: !ui.showEducational })}
        aria-expanded={ui.showEducational}
        aria-controls="edu-content"
      >
        <span className={styles.toggleIcon} aria-hidden="true">
          🧪
        </span>
        <span className={styles.toggleText}>Learn: How does {selectedDef.name} work?</span>
        <span className={`${styles.chevron} ${ui.showEducational ? styles.chevronUp : ''}`} aria-hidden="true">
          ▼
        </span>
      </button>

      {ui.showEducational && (
        <div id="edu-content" className={styles.content}>
          <h3 id="edu-heading" className={styles.title}>
            {selectedDef.emoji} {educational.name}
          </h3>

          <div className={styles.block}>
            <h4 className={styles.blockHeading}>What does it do?</h4>
            <p className={styles.blockText}>{educational.explanation}</p>
          </div>

          <div className={`${styles.block} ${styles.stemBlock}`}>
            <h4 className={styles.blockHeading}>🔬 STEM Connection</h4>
            <p className={styles.blockText}>{educational.stemConnection}</p>
          </div>

          {educational.didYouKnow && (
            <div className={`${styles.block} ${styles.funBlock}`}>
              <h4 className={styles.blockHeading}>💡 Did You Know?</h4>
              <p className={styles.blockText}>{educational.didYouKnow}</p>
            </div>
          )}
        </div>
      )}
    </section>
  )
}
