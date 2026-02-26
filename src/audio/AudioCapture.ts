import { getSupportedMimeType, getAudioContext } from '@/utils/browserDetect'

export type CaptureEvent = 'start' | 'stop' | 'pause' | 'resume' | 'error' | 'level'
type EventHandler = (...args: unknown[]) => void

const MAX_DURATION_SECONDS = 10
const LEVEL_INTERVAL_MS = 50

export class AudioCapture {
  private stream: MediaStream | null = null
  private mediaRecorder: MediaRecorder | null = null
  private audioContext: AudioContext | null = null
  private analyser: AnalyserNode | null = null
  private chunks: Blob[] = []
  private startTime = 0
  private levelInterval: ReturnType<typeof setInterval> | null = null
  private maxDurationTimer: ReturnType<typeof setTimeout> | null = null
  private handlers: Map<CaptureEvent, EventHandler[]> = new Map()
  private _duration = 0
  private _inputLevel = 0
  private _isRecording = false
  private _isPaused = false

  get isRecording(): boolean {
    return this._isRecording
  }

  get isPaused(): boolean {
    return this._isPaused
  }

  async getDevices(): Promise<MediaDeviceInfo[]> {
    const devices = await navigator.mediaDevices.enumerateDevices()
    return devices.filter((d) => d.kind === 'audioinput')
  }

  // Acquires the microphone stream and sets up the AudioContext/analyser.
  // MUST be called directly from a user gesture handler (required by iOS Safari).
  // Safe to call before a countdown — the stream is held open until stopRecording().
  async acquireStream(deviceId?: string): Promise<void> {
    if (this.stream) return // already acquired
    const constraints: MediaStreamConstraints = {
      audio: deviceId
        ? { deviceId: { exact: deviceId }, echoCancellation: true, noiseSuppression: true }
        : { echoCancellation: true, noiseSuppression: true },
    }
    this.stream = await navigator.mediaDevices.getUserMedia(constraints)

    // Create and resume AudioContext while still close to the user gesture (iOS requirement)
    this.audioContext = getAudioContext()
    await this.audioContext.resume()
    const source = this.audioContext.createMediaStreamSource(this.stream)
    this.analyser = this.audioContext.createAnalyser()
    this.analyser.fftSize = 256
    source.connect(this.analyser)
  }

  async startRecording(deviceId?: string): Promise<void> {
    if (this._isRecording) return

    // Acquire stream if not already done (fallback for non-iOS callers)
    await this.acquireStream(deviceId)

    this.chunks = []
    this._duration = 0

    // Set up MediaRecorder
    const mimeType = getSupportedMimeType()
    this.mediaRecorder = new MediaRecorder(
      this.stream!,
      mimeType ? { mimeType } : undefined
    )

    this.mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) this.chunks.push(e.data)
    }

    this.mediaRecorder.onstart = () => {
      this.startTime = Date.now()
      this._isRecording = true
      this._isPaused = false
      this.startLevelMonitoring()
      this.startMaxDurationTimer()
      this.emit('start')
    }

    this.mediaRecorder.onstop = () => {
      this.emit('stop')
    }

    this.mediaRecorder.onerror = (e) => {
      this.emit('error', e)
    }

    this.mediaRecorder.start(100) // Collect chunks every 100ms
  }

  async stopRecording(): Promise<Blob> {
    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder || !this._isRecording) {
        reject(new Error('Not recording'))
        return
      }

      this.clearTimers()

      this.mediaRecorder.addEventListener('stop', () => {
        const blob = new Blob(this.chunks, {
          type: this.mediaRecorder?.mimeType || 'audio/webm',
        })
        this._isRecording = false
        this._isPaused = false
        this._duration = (Date.now() - this.startTime) / 1000
        this.cleanup()
        resolve(blob)
      }, { once: true })

      this.mediaRecorder.stop()
    })
  }

  pauseRecording(): void {
    if (this.mediaRecorder?.state === 'recording') {
      try {
        this.mediaRecorder.pause()
      } catch {
        // MediaRecorder.pause() throws NotSupportedError on iOS ≤ 15
        return
      }
      this._isPaused = true
      this._duration += (Date.now() - this.startTime) / 1000
      this.clearTimers()
      this.emit('pause')
    }
  }

  resumeRecording(): void {
    if (this.mediaRecorder?.state === 'paused') {
      this.mediaRecorder.resume()
      this._isPaused = false
      this.startTime = Date.now()
      this.startLevelMonitoring()
      this.startMaxDurationTimer()
      this.emit('resume')
    }
  }

  getDuration(): number {
    if (this._isRecording && !this._isPaused) {
      return this._duration + (Date.now() - this.startTime) / 1000
    }
    return this._duration
  }

  getInputLevel(): number {
    return this._inputLevel
  }

  on(event: CaptureEvent, handler: EventHandler): void {
    if (!this.handlers.has(event)) this.handlers.set(event, [])
    this.handlers.get(event)!.push(handler)
  }

  off(event: CaptureEvent, handler: EventHandler): void {
    const handlers = this.handlers.get(event)
    if (handlers) {
      const idx = handlers.indexOf(handler)
      if (idx !== -1) handlers.splice(idx, 1)
    }
  }

  dispose(): void {
    this.clearTimers()
    if (this.mediaRecorder?.state !== 'inactive') {
      this.mediaRecorder?.stop()
    }
    this.cleanup()
    this._isRecording = false
    this._isPaused = false
    this.handlers.clear()
  }

  private emit(event: CaptureEvent, ...args: unknown[]): void {
    this.handlers.get(event)?.forEach((h) => h(...args))
  }

  private startLevelMonitoring(): void {
    if (!this.analyser) return
    const dataArray = new Uint8Array(this.analyser.frequencyBinCount)

    this.levelInterval = setInterval(() => {
      if (!this.analyser) return
      this.analyser.getByteTimeDomainData(dataArray)
      let sum = 0
      for (const val of dataArray) {
        const normalized = (val - 128) / 128
        sum += normalized * normalized
      }
      this._inputLevel = Math.sqrt(sum / dataArray.length)
      this.emit('level', this._inputLevel)
    }, LEVEL_INTERVAL_MS)
  }

  private startMaxDurationTimer(): void {
    const remaining = MAX_DURATION_SECONDS - this._duration
    if (remaining <= 0) {
      this.stopRecording()
      return
    }
    this.maxDurationTimer = setTimeout(() => {
      this.stopRecording()
    }, remaining * 1000)
  }

  private clearTimers(): void {
    if (this.levelInterval) {
      clearInterval(this.levelInterval)
      this.levelInterval = null
    }
    if (this.maxDurationTimer) {
      clearTimeout(this.maxDurationTimer)
      this.maxDurationTimer = null
    }
  }

  private cleanup(): void {
    this.stream?.getTracks().forEach((t) => t.stop())
    this.stream = null
    this.audioContext?.close()
    this.audioContext = null
    this.analyser = null
    this.mediaRecorder = null
    this._inputLevel = 0
  }
}
