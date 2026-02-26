import { useAudio } from '@/hooks/useAudio'
import { useTranslations } from '@/i18n/useTranslations'
import { EFFECT_DEFINITIONS } from '@/audio/effects'
import type { EffectId, EffectParams } from '@/types/audio'
import styles from './EffectSelector.module.css'

export function EffectSelector() {
  const { state, applyEffect, dispatch } = useAudio()
  const t = useTranslations()
  const { effects, recording } = state

  const hasRecording = recording.status === 'stopped' && recording.audioBuffer

  function handleSelect(effectId: EffectId) {
    if (!hasRecording) return
    const params = effects.effectParams[effectId]
    applyEffect(effectId, params)
  }

  function handleParamChange(effectId: EffectId, key: string, value: number) {
    const current = effects.effectParams[effectId]
    const updated: EffectParams = { ...current, [key]: value }
    dispatch({ type: 'SET_EFFECT_PARAMS', effectId, params: updated })
    if (effectId === effects.selectedEffectId && recording.audioBuffer) {
      applyEffect(effectId, updated)
    }
  }

  return (
    <section className={styles.section} aria-labelledby="effects-heading">
      <h2 id="effects-heading" className={styles.heading}>
        {t.effectsHeading}
      </h2>

      {!hasRecording && (
        <p className={styles.hint}>{t.recordHint}</p>
      )}

      <div className={styles.grid} role="listbox" aria-label="Voice effects">
        {EFFECT_DEFINITIONS.map((def) => {
          const isSelected = effects.selectedEffectId === def.id
          const isProcessing = effects.isProcessing && isSelected

          return (
            <button
              key={def.id}
              className={`${styles.card} ${isSelected ? styles.selected : ''} ${!hasRecording ? styles.disabled : ''}`}
              style={{ '--effect-color': def.color } as React.CSSProperties}
              onClick={() => handleSelect(def.id)}
              aria-label={`${def.name} effect: ${def.educational.explanation}`}
              disabled={!hasRecording || isProcessing}
              role="option"
              aria-selected={isSelected}
              data-testid={`${def.id}-effect`}
            >
              <span className={styles.emoji} aria-hidden="true">{def.emoji}</span>
              <span className={styles.name}>{def.name}</span>
              {isProcessing && (
                <span className={styles.processing} aria-label={t.processing}>
                  <span className={styles.spinner} aria-hidden="true" />
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Parameter controls for selected effect */}
      {effects.selectedEffectId && hasRecording && (
        <EffectParams
          effectId={effects.selectedEffectId}
          params={effects.effectParams[effects.selectedEffectId]}
          onParamChange={handleParamChange}
        />
      )}
    </section>
  )
}

interface EffectParamsProps {
  effectId: EffectId
  params: EffectParams
  onParamChange: (effectId: EffectId, key: string, value: number) => void
}

function EffectParams({ effectId, params, onParamChange }: EffectParamsProps) {
  const def = EFFECT_DEFINITIONS.find((d) => d.id === effectId)
  const t = useTranslations()
  if (!def) return null

  return (
    <div className={styles.params} aria-label="Effect parameters">
      <h3 className={styles.paramsHeading}>{t.adjustEffect(def.name)}</h3>
      {Object.entries(def.paramRanges).map(([key, range]) => {
        const value = (params[key] as number) ?? (def.defaultParams[key] as number)
        return (
          <div key={key} className={styles.param}>
            <div className={styles.paramHeader}>
              <label htmlFor={`param-${effectId}-${key}`} className={styles.paramLabel}>
                {range.label}
              </label>
              <span className={styles.paramValue} aria-hidden="true">
                {typeof value === 'number' ? value.toFixed(range.step < 1 ? 2 : 0) : value}
              </span>
            </div>
            <input
              id={`param-${effectId}-${key}`}
              type="range"
              className={styles.slider}
              min={range.min}
              max={range.max}
              step={range.step}
              value={value}
              onChange={(e) => onParamChange(effectId, key, parseFloat(e.target.value))}
              aria-valuemin={range.min}
              aria-valuemax={range.max}
              aria-valuenow={value}
              aria-label={range.label}
              style={{
                '--slider-pct': `${((value - range.min) / (range.max - range.min)) * 100}%`,
              } as React.CSSProperties}
            />
          </div>
        )
      })}
    </div>
  )
}
