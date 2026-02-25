import type { BrowserSupport } from '@/types/audio'

export function checkBrowserSupport(): BrowserSupport {
  return {
    webAudio: 'AudioContext' in window || 'webkitAudioContext' in window,
    mediaRecorder: 'MediaRecorder' in window,
    getUserMedia: !!(navigator.mediaDevices?.getUserMedia),
    serviceWorker: 'serviceWorker' in navigator,
    audioWorklet: 'AudioWorklet' in window,
  }
}

export function isFullySupported(): boolean {
  const support = checkBrowserSupport()
  return support.webAudio && support.mediaRecorder && support.getUserMedia
}

export function getAudioContext(): AudioContext {
  const AudioContextClass =
    window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
  return new AudioContextClass()
}

export function getSupportedMimeType(): string {
  const types = [
    'audio/webm;codecs=opus',
    'audio/webm',
    'audio/ogg;codecs=opus',
    'audio/ogg',
    'audio/mp4',
  ]
  for (const type of types) {
    if (MediaRecorder.isTypeSupported(type)) {
      return type
    }
  }
  return ''
}
