interface DrawOptions {
  color?: string
  lineWidth?: number
  backgroundColor?: string
}

export class WaveformVisualizer {
  private canvas: HTMLCanvasElement
  private ctx: CanvasRenderingContext2D
  private animationId: number | null = null
  private waveColor = '#3B82F6'
  private bgColor = 'transparent'
  private resizeObserver: ResizeObserver | null = null

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')!
    this.setupResizeObserver()
  }

  setColors(waveColor: string, bgColor: string): void {
    this.waveColor = waveColor
    this.bgColor = bgColor
  }

  drawWaveform(buffer: AudioBuffer, options: DrawOptions = {}): void {
    const { color = this.waveColor, lineWidth = 2, backgroundColor = this.bgColor } = options
    const { width, height } = this.canvas
    const data = buffer.getChannelData(0)

    this.ctx.clearRect(0, 0, width, height)

    if (backgroundColor !== 'transparent') {
      this.ctx.fillStyle = backgroundColor
      this.ctx.fillRect(0, 0, width, height)
    }

    // Downsample for display
    const step = Math.ceil(data.length / width)
    const amp = height / 2

    this.ctx.beginPath()
    this.ctx.strokeStyle = color
    this.ctx.lineWidth = lineWidth
    this.ctx.lineJoin = 'round'

    for (let x = 0; x < width; x++) {
      let min = 1
      let max = -1
      for (let j = 0; j < step; j++) {
        const sample = data[x * step + j] ?? 0
        if (sample < min) min = sample
        if (sample > max) max = sample
      }
      const y1 = amp + min * amp
      const y2 = amp + max * amp
      if (x === 0) {
        this.ctx.moveTo(x, y1)
      } else {
        this.ctx.lineTo(x, y1)
      }
      this.ctx.lineTo(x, y2)
    }

    this.ctx.stroke()
  }

  drawRealTime(analyser: AnalyserNode, options: DrawOptions = {}): void {
    const { color = this.waveColor, lineWidth = 2 } = options
    const { width, height } = this.canvas
    const dataArray = new Uint8Array(analyser.frequencyBinCount)

    const draw = () => {
      analyser.getByteTimeDomainData(dataArray)
      this.ctx.clearRect(0, 0, width, height)

      this.ctx.beginPath()
      this.ctx.strokeStyle = color
      this.ctx.lineWidth = lineWidth
      this.ctx.lineJoin = 'round'

      const sliceWidth = width / dataArray.length
      let x = 0

      for (let i = 0; i < dataArray.length; i++) {
        const v = (dataArray[i] ?? 128) / 128
        const y = (v * height) / 2
        if (i === 0) {
          this.ctx.moveTo(x, y)
        } else {
          this.ctx.lineTo(x, y)
        }
        x += sliceWidth
      }
      this.ctx.lineTo(width, height / 2)
      this.ctx.stroke()

      this.animationId = requestAnimationFrame(draw)
    }

    this.stopAnimation()
    draw()
  }

  startAnimation(callback: (ctx: CanvasRenderingContext2D) => void): void {
    const animate = () => {
      callback(this.ctx)
      this.animationId = requestAnimationFrame(animate)
    }
    this.stopAnimation()
    animate()
  }

  stopAnimation(): void {
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId)
      this.animationId = null
    }
  }

  clear(): void {
    this.stopAnimation()
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    // Draw flat center line
    const { width, height } = this.canvas
    this.ctx.beginPath()
    this.ctx.strokeStyle = '#E5E7EB'
    this.ctx.lineWidth = 1
    this.ctx.moveTo(0, height / 2)
    this.ctx.lineTo(width, height / 2)
    this.ctx.stroke()
  }

  private setupResizeObserver(): void {
    if (!('ResizeObserver' in window)) return
    this.resizeObserver = new ResizeObserver(() => {
      const rect = this.canvas.getBoundingClientRect()
      this.canvas.width = rect.width * window.devicePixelRatio
      this.canvas.height = rect.height * window.devicePixelRatio
      this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
    })
    this.resizeObserver.observe(this.canvas)
  }

  dispose(): void {
    this.stopAnimation()
    this.resizeObserver?.disconnect()
  }
}
