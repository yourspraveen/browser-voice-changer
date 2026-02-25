import { useEffect, useRef } from 'react'
import { WaveformVisualizer } from '@/visualization/WaveformVisualizer'
import styles from './WaveformDisplay.module.css'

interface Props {
  audioBuffer: AudioBuffer | null
  analyser: AnalyserNode | null
  isRecording: boolean
  color?: string
}

export function WaveformDisplay({ audioBuffer, analyser, isRecording, color = '#3B82F6' }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const vizRef = useRef<WaveformVisualizer | null>(null)

  useEffect(() => {
    if (!canvasRef.current) return
    const viz = new WaveformVisualizer(canvasRef.current)
    vizRef.current = viz
    viz.clear()
    return () => viz.dispose()
  }, [])

  useEffect(() => {
    const viz = vizRef.current
    if (!viz) return

    if (isRecording && analyser) {
      viz.drawRealTime(analyser, { color })
    } else if (audioBuffer) {
      viz.stopAnimation()
      viz.drawWaveform(audioBuffer, { color })
    } else {
      viz.clear()
    }
  }, [audioBuffer, analyser, isRecording, color])

  return (
    <div className={styles.container} aria-label="Audio waveform visualization">
      <canvas
        ref={canvasRef}
        className={styles.canvas}
        aria-hidden="true"
        width={600}
        height={100}
      />
    </div>
  )
}
