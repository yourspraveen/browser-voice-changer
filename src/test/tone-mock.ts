import { vi } from 'vitest'

// Mock ToneAudioBuffer
export class ToneAudioBuffer {
  private _buffer: AudioBuffer | null = null

  constructor(buffer?: AudioBuffer | string) {
    if (buffer instanceof AudioBuffer) {
      this._buffer = buffer
    }
  }

  get(): AudioBuffer | null {
    return this._buffer
  }

  get duration(): number {
    return this._buffer?.duration ?? 0
  }
}

// Mock PitchShift
export class PitchShift {
  pitch = 0
  windowSize = 0.1
  delayTime = 0
  feedback = 0
  wet = { value: 1 }

  constructor(options?: { pitch?: number; windowSize?: number; delayTime?: number; feedback?: number; wet?: number }) {
    if (options) {
      this.pitch = options.pitch ?? 0
      this.windowSize = options.windowSize ?? 0.1
    }
  }

  connect() { return this }
  disconnect() { return this }
  chain(..._args: unknown[]) { return this }
  toDestination() { return this }
}

// Mock Player
export class Player {
  buffer: ToneAudioBuffer | null = null

  constructor(buffer?: ToneAudioBuffer | string) {
    if (buffer instanceof ToneAudioBuffer) {
      this.buffer = buffer
    }
  }

  connect() { return this }
  chain(..._args: unknown[]) { return this }
  start() { return this }
  stop() { return this }
  toDestination() { return this }
}

// Mock Offline - just renders original buffer unchanged
export const Offline = vi.fn(
  async (callback: (context: { transport: unknown }) => Promise<void>, duration: number, channels = 1, sampleRate = 48000): Promise<ToneAudioBuffer> => {
    // Run callback to satisfy any side effects, but don't actually render
    try {
      await callback({ transport: { start: vi.fn() } })
    } catch {
      // Ignore errors from mock context
    }

    // Create a silent buffer of the appropriate size
    const ctx = new AudioContext()
    const length = Math.ceil(duration * sampleRate)
    const buffer = ctx.createBuffer(channels, length, sampleRate)
    return new ToneAudioBuffer(buffer)
  }
)

export function getContext() {
  return {
    rawContext: new AudioContext(),
  }
}

export function getDestination() {
  return { connect: vi.fn(), disconnect: vi.fn() }
}

export class Chorus {
  frequency = { value: 2 }
  depth = 0.7
  wet = { value: 0.8 }
  constructor(_options?: unknown) {}
  connect() { return this }
  disconnect() { return this }
  start() { return this }
  toDestination() { return this }
}

export class FeedbackDelay {
  delayTime = { value: 0.25 }
  feedback = { value: 0.5 }
  wet = { value: 0.7 }
  constructor(_options?: unknown) {}
  connect() { return this }
  toDestination() { return this }
}
