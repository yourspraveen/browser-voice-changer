# System Architecture

## High-Level Overview

```
┌─────────────────────────────────────────────────────────────┐
│                         User Interface                       │
│  (React Components - Recording, Effects, Visualization)     │
└────────────┬───────────────────────────┬────────────────────┘
             │                           │
             ▼                           ▼
┌────────────────────────┐   ┌─────────────────────────────┐
│   State Management     │   │   Educational Content       │
│   (React Context/      │   │   (JSON + Components)       │
│    Local State)        │   │                             │
└────────────┬───────────┘   └─────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────────────────────┐
│                    Audio Engine Layer                        │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Capture    │  │  Processing  │  │    Export    │     │
│  │   Module     │  │    Module    │  │    Module    │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└────────────┬───────────────┬──────────────┬────────────────┘
             │               │              │
             ▼               ▼              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Web Audio API Layer                       │
│  AudioContext | MediaRecorder | AnalyserNode | AudioBuffer  │
└─────────────────────────────────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────────────────────┐
│                      Browser APIs                            │
│  getUserMedia | Canvas | localStorage | Service Worker      │
└─────────────────────────────────────────────────────────────┘
```

---

## Core Modules

### 1. UI Layer (React Components)

**Purpose:** User interaction and visual presentation

**Components:**

#### `App.tsx`
- Root component
- Provides global context
- Manages app-wide state
- Error boundary wrapper

#### `RecordingControls.tsx`
- Record/Stop/Pause buttons
- Timer display
- Input level meter
- Device selector
- Permission requests

#### `EffectSelector.tsx`
- Effect cards/buttons
- Effect parameter controls (wet/dry)
- Active effect indicator
- Educational tooltips

#### `PlaybackControls.tsx`
- Play/Pause buttons
- Progress bar
- A/B comparison toggle
- Volume control
- Download button

#### `WaveformVisualizer.tsx`
- Canvas-based waveform
- Real-time updates during recording
- Static display during playback
- Zoom/pan controls (stretch goal)

#### `LevelMeter.tsx`
- Visual input level indicator
- Peak detection
- Clipping warning

#### `EducationalPanel.tsx`
- Effect explanations
- STEM concepts
- "Did you know?" facts
- Collapsible sections

#### `DemoSamples.tsx`
- Pre-recorded sample selector
- "Try it first" mode
- Sample playback

#### `ErrorBoundary.tsx`
- Catches React errors
- User-friendly error display
- Reload/reset options

#### `PrivacyNotice.tsx`
- Privacy statement banner
- Dismissible
- localStorage persistence

---

### 2. Audio Capture Module

**File:** `src/audio/AudioCapture.ts`

**Purpose:** Handle microphone access and recording

**Key Responsibilities:**
- Request microphone permissions
- Enumerate audio input devices
- Initialize MediaRecorder
- Capture audio stream
- Monitor recording duration
- Handle recording lifecycle

**Public API:**
```typescript
class AudioCapture {
  // Initialize capture system
  async initialize(): Promise<void>

  // Get available audio input devices
  async getDevices(): Promise<MediaDeviceInfo[]>

  // Start recording from specified device
  async startRecording(deviceId?: string): Promise<void>

  // Stop recording and return audio blob
  async stopRecording(): Promise<Blob>

  // Pause recording
  pauseRecording(): void

  // Resume recording
  resumeRecording(): void

  // Get current recording duration
  getDuration(): number

  // Get input level (0-1)
  getInputLevel(): number

  // Clean up resources
  dispose(): void

  // Event listeners
  on(event: 'start' | 'stop' | 'pause' | 'resume' | 'error', handler: Function): void
}
```

**Internal Implementation:**
- Uses `MediaRecorder` API
- Creates `AnalyserNode` for level monitoring
- Implements auto-stop at max duration
- Handles browser compatibility

---

### 3. Audio Processing Module

**File:** `src/audio/AudioProcessor.ts`

**Purpose:** Core audio processing and effect application

**Key Responsibilities:**
- Initialize Tone.js AudioContext
- Load audio from Blob or URL
- Apply effects to audio
- Manage effect chains
- Handle real-time vs offline processing

**Public API:**
```typescript
class AudioProcessor {
  // Initialize audio context
  async initialize(): Promise<void>

  // Load audio from blob (recording or sample)
  async loadAudio(source: Blob | string): Promise<AudioBuffer>

  // Apply effect to loaded audio
  async applyEffect(effect: Effect, parameters: EffectParams): Promise<AudioBuffer>

  // Apply multiple effects in sequence
  async applyEffectChain(effects: Effect[], parameters: EffectParams[]): Promise<AudioBuffer>

  // Get audio buffer for visualization
  getAudioBuffer(): AudioBuffer | null

  // Start real-time playback
  async playAudio(buffer: AudioBuffer): Promise<void>

  // Stop playback
  stopPlayback(): void

  // Clean up resources
  dispose(): void
}
```

**Effect Integration:**
- Wraps Tone.js effects
- Manages effect parameters
- Handles effect bypass (wet/dry)
- Implements effect presets

---

### 4. Effects Engine

**Files:** `src/audio/effects/*.ts`

**Purpose:** Individual effect implementations

**Base Effect Interface:**
```typescript
interface Effect {
  name: string
  description: string

  // Apply effect to audio buffer
  process(buffer: AudioBuffer, params: EffectParams): Promise<AudioBuffer>

  // Get default parameters
  getDefaultParams(): EffectParams

  // Validate parameters
  validateParams(params: EffectParams): boolean

  // Get educational content
  getEducationalContent(): EducationalContent
}

interface EffectParams {
  wetDry: number  // 0-1, amount of effect
  [key: string]: number | boolean | string
}

interface EducationalContent {
  explanation: string
  stemConnection: string
  didYouKnow?: string
  visualDemo?: string  // URL or component reference
}
```

**Effect Implementations:**

#### `ChipmunkEffect.ts`
- Uses `Tone.PitchShift` or playback rate
- Parameter: pitch shift (+4 to +12 semitones)

#### `DeepVoiceEffect.ts`
- Uses `Tone.PitchShift`
- Parameter: pitch shift (-4 to -12 semitones)

#### `RobotEffect.ts`
- Ring modulation + bandpass filter
- Parameters: modulation frequency, filter cutoff

#### `TelephoneEffect.ts`
- Bandpass filter (300Hz - 3400Hz)
- Optional: bit crushing for retro feel

#### `EchoEffect.ts`
- Uses `Tone.FeedbackDelay`
- Parameters: delay time, feedback amount

#### `AlienEffect.ts`
- Uses `Tone.Chorus` + pitch modulation
- Parameters: chorus rate, depth, modulation

---

### 5. Visualization Module

**Files:** `src/visualization/*.ts`

**Purpose:** Audio visualization using Canvas API

#### `WaveformVisualizer.ts`

**Responsibilities:**
- Draw waveform from AudioBuffer
- Update in real-time during recording
- Handle canvas resizing
- Implement zoom/pan (stretch)

**API:**
```typescript
class WaveformVisualizer {
  constructor(canvas: HTMLCanvasElement)

  // Draw waveform from audio buffer
  drawWaveform(buffer: AudioBuffer, options?: DrawOptions): void

  // Draw real-time from analyser node
  drawRealTime(analyser: AnalyserNode): void

  // Start animation loop for real-time
  startAnimation(): void

  // Stop animation
  stopAnimation(): void

  // Set colors
  setColors(waveColor: string, bgColor: string): void

  // Clean up
  dispose(): void
}

interface DrawOptions {
  color?: string
  lineWidth?: number
  backgroundColor?: string
  showGrid?: boolean
}
```

#### `LevelMeter.ts`

**Responsibilities:**
- Display input level in real-time
- Peak indicators
- Clipping warnings

---

### 6. Export Module

**File:** `src/audio/AudioExporter.ts`

**Purpose:** Export processed audio to files

**API:**
```typescript
class AudioExporter {
  // Export audio buffer as WAV file
  async exportWAV(buffer: AudioBuffer, filename?: string): Promise<Blob>

  // Export as MP3 (future, requires encoder)
  async exportMP3(buffer: AudioBuffer, quality?: number): Promise<Blob>

  // Trigger download in browser
  downloadAudio(blob: Blob, filename: string): void

  // Generate filename with timestamp
  generateFilename(effectName: string, format: string): string
}
```

**Implementation:**
- Converts AudioBuffer to WAV format
- Adds WAV headers
- Creates download link
- Triggers download

---

### 7. State Management

**File:** `src/state/AppContext.tsx`

**Purpose:** Global application state

**State Structure:**
```typescript
interface AppState {
  // Recording state
  recording: {
    isRecording: boolean
    isPaused: boolean
    duration: number
    audioBlob: Blob | null
    audioBuffer: AudioBuffer | null
  }

  // Playback state
  playback: {
    isPlaying: boolean
    currentTime: number
    duration: number
  }

  // Effect state
  effects: {
    selectedEffect: Effect | null
    effectParams: EffectParams
    processedBuffer: AudioBuffer | null
    isProcessing: boolean
  }

  // UI state
  ui: {
    selectedDevice: string | null
    showEducational: boolean
    language: 'en' | 'es'
    inputLevel: number
  }

  // Error state
  error: {
    hasError: boolean
    errorMessage: string | null
    errorType: ErrorType | null
  }
}

type ErrorType = 'permission' | 'processing' | 'browser' | 'network' | 'unknown'
```

**Context Providers:**
```typescript
<AppStateProvider>
  <AudioProvider>
    <App />
  </AudioProvider>
</AppStateProvider>
```

---

## Data Flow

### Recording Flow
```
1. User clicks "Record"
   ↓
2. RecordingControls → AudioCapture.startRecording()
   ↓
3. AudioCapture requests microphone permission
   ↓
4. MediaRecorder starts capturing
   ↓
5. AnalyserNode provides level data → LevelMeter
   ↓
6. Waveform updates in real-time → WaveformVisualizer
   ↓
7. User clicks "Stop"
   ↓
8. AudioCapture.stopRecording() → Returns Blob
   ↓
9. AudioProcessor.loadAudio(blob) → Converts to AudioBuffer
   ↓
10. State updated with audioBuffer
```

### Effect Application Flow
```
1. User selects effect (e.g., "Chipmunk")
   ↓
2. EffectSelector → State updates selectedEffect
   ↓
3. User adjusts wet/dry slider
   ↓
4. AudioProcessor.applyEffect(effect, params)
   ↓
5. Effect.process(buffer, params) using Tone.js
   ↓
6. Returns processed AudioBuffer
   ↓
7. State updated with processedBuffer
   ↓
8. PlaybackControls can play processed audio
   ↓
9. WaveformVisualizer updates display
```

### Export Flow
```
1. User clicks "Download"
   ↓
2. PlaybackControls → AudioExporter.exportWAV(processedBuffer)
   ↓
3. AudioExporter converts AudioBuffer to WAV Blob
   ↓
4. Generates filename: "voice_chipmunk_2026-02-25.wav"
   ↓
5. Creates download link and triggers download
```

---

## Error Handling Strategy

### Error Boundaries
- Top-level ErrorBoundary catches React errors
- Displays user-friendly error message
- Logs error to console (no tracking)
- Provides "Try Again" button

### Async Error Handling
```typescript
try {
  await audioCapture.startRecording()
} catch (error) {
  if (error.name === 'NotAllowedError') {
    // Microphone permission denied
    showError('permission', 'Please allow microphone access')
  } else if (error.name === 'NotFoundError') {
    // No microphone found
    showError('browser', 'No microphone detected')
  } else {
    // Unknown error
    showError('unknown', 'Recording failed. Please try again.')
  }
}
```

### User-Facing Error Messages
- Clear, non-technical language
- Actionable solutions
- Links to troubleshooting
- No stack traces in production

---

## Performance Optimizations

### Code Splitting
```typescript
// Lazy load effects
const effects = {
  chipmunk: () => import('./effects/ChipmunkEffect'),
  robot: () => import('./effects/RobotEffect'),
  // ...
}
```

### Audio Buffer Management
- Reuse AudioContext (don't create multiple)
- Dispose of old buffers when loading new audio
- Limit buffer size (10 seconds max)

### Canvas Optimization
- Use `requestAnimationFrame` for smooth animation
- Debounce resize events
- Downsample waveform data for visualization

### Memoization
```typescript
const processedAudio = useMemo(() => {
  if (!audioBuffer || !selectedEffect) return null
  return audioProcessor.applyEffect(selectedEffect, params)
}, [audioBuffer, selectedEffect, params])
```

---

## Security Considerations

### Content Security Policy
```http
Content-Security-Policy:
  default-src 'self';
  script-src 'self';
  style-src 'self' 'unsafe-inline';
  media-src 'self' blob:;
  connect-src 'self';
```

### Permissions
- Request microphone only when needed
- Clear permission prompts
- Handle denial gracefully

### Data Privacy
- No audio data leaves browser
- No telemetry or tracking
- localStorage only for preferences
- Clear privacy notice

---

## Browser Compatibility Layer

**File:** `src/utils/browserDetect.ts`

```typescript
export function checkBrowserSupport(): BrowserSupport {
  return {
    webAudio: 'AudioContext' in window || 'webkitAudioContext' in window,
    mediaRecorder: 'MediaRecorder' in window,
    getUserMedia: navigator.mediaDevices?.getUserMedia !== undefined,
    serviceWorker: 'serviceWorker' in navigator,
    audioWorklet: 'AudioWorklet' in window
  }
}

export function getBrowserInfo(): BrowserInfo {
  // Detect browser type and version
}

export function showUnsupportedBrowserMessage(): void {
  // Display upgrade message with browser download links
}
```

---

## Testing Strategy

### Unit Tests
- All effect implementations
- Audio utilities (buffer conversion, etc.)
- State management logic
- Error handlers

### Integration Tests
- Recording → Processing → Playback flow
- Effect application pipeline
- Export functionality

### E2E Tests
```typescript
test('Complete recording workflow', async ({ page }) => {
  await page.goto('/')
  await page.click('[data-testid="record-button"]')
  await page.waitForTimeout(2000)
  await page.click('[data-testid="stop-button"]')
  await page.click('[data-testid="chipmunk-effect"]')
  await page.click('[data-testid="play-button"]')
  await page.click('[data-testid="download-button"]')
})
```

### Accessibility Tests
```typescript
test('Keyboard navigation', async ({ page }) => {
  await page.goto('/')
  await page.keyboard.press('Tab') // Focus record button
  await page.keyboard.press('Enter') // Start recording
  // ...
})
```

---

## Deployment Architecture

### Static Hosting (GitHub Pages)
```
GitHub Repository
  ↓ (merge to main)
GitHub Actions Workflow
  ↓
  1. Install dependencies
  2. Run tests
  3. Build production bundle
  4. Deploy to gh-pages branch
  ↓
GitHub Pages serves static files
  ↓
User's browser downloads and runs app
```

### PWA Architecture
```
User visits site
  ↓
Service Worker installed
  ↓
Assets cached locally
  ↓
User goes offline
  ↓
Service Worker serves cached assets
  ↓
App works offline (except new samples)
```

---

## Future Architecture Considerations

### Potential Enhancements
1. **AudioWorklet** for custom effects (better performance)
2. **Web Workers** for heavy processing (avoid UI blocking)
3. **IndexedDB** for storing recordings locally
4. **WebRTC** for real-time effects (future feature)
5. **Web Assembly** for complex DSP (if needed)

### Scalability
Current architecture supports:
- Adding new effects (plugin-based)
- Multiple languages (i18n ready)
- New visualization types
- Additional export formats
- More educational content

---

## Architecture Decision Records (ADRs)

### ADR 1: React Context over Redux
**Decision:** Use React Context for state management
**Rationale:** Simple app state, no need for Redux complexity
**Consequences:** May need to refactor if state becomes complex

### ADR 2: Tone.js over Pure Web Audio API
**Decision:** Use Tone.js for effect implementations
**Rationale:** Saves development time, provides tested effects
**Consequences:** 200KB dependency, less educational value

### ADR 3: Canvas over SVG for Visualization
**Decision:** Use Canvas API for waveforms
**Rationale:** Better performance for real-time updates
**Consequences:** Less accessibility, more complex

### ADR 4: Offline Processing over Real-time
**Decision:** Process effects offline (not during recording)
**Rationale:** Simpler implementation, better quality
**Consequences:** Cannot hear effect in real-time

---

## Questions or Clarifications?

For architecture questions:
1. Open GitHub issue with `architecture` label
2. Reference this document
3. Propose changes with rationale
