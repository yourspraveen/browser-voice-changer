import type { BrowserSupport } from '@/types/audio'

export function isIOS(): boolean {
  return /iPad|iPhone|iPod/.test(navigator.userAgent)
}

export function getBrowserName(): 'chrome' | 'safari' | 'firefox' | 'edge' | 'other' {
  const ua = navigator.userAgent
  if (/Edg\//.test(ua)) return 'edge'
  if (/Firefox\//.test(ua)) return 'firefox'
  if (/Chrome\//.test(ua)) return 'chrome'
  if (/Safari\//.test(ua)) return 'safari'
  return 'other'
}

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

// iOS only supports audio/mp4; other platforms prefer webm/opus
export function getSupportedMimeType(): string {
  if (!('MediaRecorder' in window)) return ''
  const types = isIOS()
    ? ['audio/mp4', 'audio/mp4;codecs=mp4a.40.2']
    : ['audio/webm;codecs=opus', 'audio/webm', 'audio/ogg;codecs=opus', 'audio/ogg', 'audio/mp4']
  for (const type of types) {
    if (MediaRecorder.isTypeSupported(type)) return type
  }
  return ''
}

// MediaRecorder.pause() throws NotSupportedError on iOS ≤ 15
export function supportsMediaRecorderPause(): boolean {
  return !isIOS()
}
