import styles from './LevelMeter.module.css'

interface Props {
  level: number // 0-1
}

export function LevelMeter({ level }: Props) {
  const pct = Math.min(100, level * 100 * 3) // scale up for visual clarity
  const isClipping = level > 0.9

  return (
    <div
      className={`${styles.meter} ${isClipping ? styles.clipping : ''}`}
      role="meter"
      aria-label={`Input level: ${Math.round(pct)}%`}
      aria-valuenow={Math.round(pct)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className={styles.fill}
        style={{ width: `${pct}%` }}
      />
      {isClipping && (
        <span className={styles.clipIndicator} aria-live="polite">
          CLIP
        </span>
      )}
    </div>
  )
}
