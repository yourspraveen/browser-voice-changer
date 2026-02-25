import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock Web Audio API
const mockAudioContext = {
  createAnalyser: vi.fn(() => ({
    fftSize: 256,
    frequencyBinCount: 128,
    getByteTimeDomainData: vi.fn(),
    getByteFrequencyData: vi.fn(),
    connect: vi.fn(),
  })),
  createMediaStreamSource: vi.fn(() => ({ connect: vi.fn() })),
  createBufferSource: vi.fn(() => ({
    buffer: null,
    connect: vi.fn(),
    start: vi.fn(),
    stop: vi.fn(),
    onended: null,
  })),
  createBuffer: vi.fn((ch, len, sr) => ({
    numberOfChannels: ch,
    length: len,
    sampleRate: sr,
    duration: len / sr,
    getChannelData: vi.fn(() => new Float32Array(len)),
  })),
  createGain: vi.fn(() => ({ gain: { value: 1 }, connect: vi.fn() })),
  createBiquadFilter: vi.fn(() => ({
    type: 'lowpass',
    frequency: { value: 1000 },
    Q: { value: 1 },
    gain: { value: 0 },
    connect: vi.fn(),
  })),
  createOscillator: vi.fn(() => ({
    type: 'sine',
    frequency: { value: 440 },
    connect: vi.fn(),
    start: vi.fn(),
    stop: vi.fn(),
  })),
  createDelay: vi.fn(() => ({
    delayTime: { value: 0 },
    connect: vi.fn(),
  })),
  createWaveShaper: vi.fn(() => ({
    curve: null,
    oversample: 'none',
    connect: vi.fn(),
  })),
  decodeAudioData: vi.fn((_buf) =>
    Promise.resolve({
      numberOfChannels: 1,
      length: 48000,
      sampleRate: 48000,
      duration: 1,
      getChannelData: () => new Float32Array(48000),
    })
  ),
  destination: {},
  state: 'running',
  currentTime: 0,
  sampleRate: 48000,
  close: vi.fn(() => Promise.resolve()),
  resume: vi.fn(() => Promise.resolve()),
  suspend: vi.fn(() => Promise.resolve()),
}

Object.defineProperty(window, 'AudioContext', {
  writable: true,
  value: vi.fn(() => mockAudioContext),
})

Object.defineProperty(window, 'OfflineAudioContext', {
  writable: true,
  value: vi.fn((ch, len, sr) => ({
    ...mockAudioContext,
    numberOfChannels: ch,
    length: len,
    sampleRate: sr,
    startRendering: vi.fn(() =>
      Promise.resolve({
        numberOfChannels: ch,
        length: len,
        sampleRate: sr,
        duration: len / sr,
        getChannelData: () => new Float32Array(len),
      })
    ),
  })),
})

Object.defineProperty(window, 'MediaRecorder', {
  writable: true,
  value: vi.fn(() => ({
    state: 'inactive',
    mimeType: 'audio/webm',
    start: vi.fn(),
    stop: vi.fn(),
    pause: vi.fn(),
    resume: vi.fn(),
    ondataavailable: null,
    onstop: null,
    onstart: null,
    onerror: null,
    addEventListener: vi.fn(),
  })),
})

Object.assign(window.MediaRecorder, {
  isTypeSupported: vi.fn(() => true),
})

Object.defineProperty(navigator, 'mediaDevices', {
  writable: true,
  value: {
    getUserMedia: vi.fn(() =>
      Promise.resolve({
        getTracks: () => [{ stop: vi.fn() }],
        getAudioTracks: () => [{ stop: vi.fn() }],
      })
    ),
    enumerateDevices: vi.fn(() =>
      Promise.resolve([
        { kind: 'audioinput', deviceId: 'default', label: 'Default Microphone' },
      ])
    ),
  },
})
