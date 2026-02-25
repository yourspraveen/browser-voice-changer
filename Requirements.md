# Browser-Based Voice Changer Demo Platform

## Project Goal

Create a privacy-first, browser-only voice recording and transformation web application that allows students to record short voice samples and apply fun audio effects (robot, chipmunk, echo, etc.) while learning basic STEM concepts about sound, frequency, and digital signal processing.

**The application must be safe for classroom use, require no installs, and run entirely client-side.**

## 1. Core Objectives

### 1.1 Educational Objectives

The platform must:

- Demonstrate fundamental audio/STEM concepts:
  - Frequency vs pitch
  - Sound waveforms
  - Digital signal processing basics
- Encourage exploration through interactive controls
- Include simple educational callouts explaining each effect

### 1.2 Technical Objectives

- Fully browser-based implementation (no server processing)
- Zero audio uploads by default
- Responsive UI for mobile, tablets, Chromebooks, and desktops
- Lightweight enough for classroom Wi-Fi environments

## 2. Key Differentiators (Mandatory)

### Privacy-First Design

- All recording and processing must occur locally in the browser
- No audio data stored remotely
- Clear on-screen privacy notice:
  > _"Your audio stays on your device. Nothing is uploaded."_

### Educational Enhancement

Include:
- Real-time waveform visualization
- Pitch/frequency explanation overlays
- Simple DSP explanations suitable for middle/high school STEM events

### Accessibility & Ease of Use

- One-click recording workflow
- Large buttons suitable for younger students
- QR-code friendly access
- No login required

## 3. Functional Requirements

### 3.1 Audio Recording

**Must:**
- Use browser microphone APIs
- Limit recordings to configurable max duration (default: 10 seconds)
- Support:
  - Chrome
  - Edge
  - Safari
  - Firefox (modern versions)
- Automatically handle mono audio conversion

**Recording Controls:**
- Record
- Stop
- Playback original
- Delete/reset recording

**Enhanced Recording Features:**
- Visual countdown (3-2-1) before recording starts
- Real-time recording timer display
- Input level meter (prevent clipping)
- Pause/resume recording capability
- Recording time remaining indicator
- Audio input device selector (if multiple mics available)

**Demo Mode:**
- Include 3-5 pre-recorded voice samples
- Allow students to experiment without recording
- Useful for microphone-less devices
- Sample library: male voice, female voice, child voice
- "Try it first" button before recording

### 3.2 Voice Effect Profiles (Initial Set)

**Required Effects:**

| Effect | Description | DSP Approach |
|--------|-------------|--------------|
| Chipmunk | Higher pitch voice | Pitch shift or playback-rate change |
| Deep Voice | Lower pitch voice | Pitch shift or playback-rate change |
| Robot | Mechanical tone | Ring modulation + filtering |
| Telephone | Narrow-band voice | Bandpass filtering |
| Echo | Reverberant effect | Delay + feedback |
| Alien/Fun Effect | Creative modulation | Chorus/modulation |

**Effects must:**
- Work offline
- Have adjustable intensity (wet/dry mix)
- Avoid noticeable clipping or distortion unless intentional

### 3.3 Playback & Export

Users must be able to:
- Play processed audio immediately
- Switch between profiles without re-recording
- Download processed audio (WAV preferred)

**Audio Comparison Tools:**
- Side-by-side playback (original vs. effect)
- A/B toggle button for quick comparison
- Multiple effect combinations (layer effects)
- Save favorite effect settings
- Reset to defaults button
- "Random effect" button for exploration

**Enhanced Export Options:**
- Multiple format support: WAV, MP3, OGG
- Quality selection (high/medium/low)
- File naming convention: "voice_effect_date.wav"

### 3.4 Visualization Features

**Required:**
- Live waveform display during recording
- Playback waveform visualization
- Optional pitch/frequency indicator

**Educational overlays should explain:**
- What waveform represents
- How pitch relates to frequency

## 4. Non-Functional Requirements

### Performance

- Must load under 3 seconds on standard school Wi-Fi
- Audio playback latency should feel immediate (<100ms)
- Processing must avoid browser freezes
- Time to Interactive <5 seconds (3G network)

**Performance Budgets:**
- JavaScript bundle: <500KB gzipped
- CSS bundle: <50KB gzipped
- Total page weight: <1MB
- Processing latency: <200ms for simple effects
- Memory usage: <100MB during recording

### Compatibility

- Mobile-first responsive design
- Support touch and mouse interaction

### Accessibility

- WCAG 2.1 Level AA compliance minimum
- Full keyboard navigation support
- Screen reader compatibility (ARIA labels, live regions)
- High contrast mode support
- Focus indicators on all interactive elements
- Minimum touch target size: 44x44px
- Color-blind friendly palette (don't rely on color alone)
- Skip navigation links
- Alternative text for all visual elements

### Reliability

Graceful handling of:
- Microphone permission denial
- Unsupported browsers
- Audio decode failures

### Error Handling

**User-facing error messages for:**
- Microphone access denied → "We need microphone access. Click [Settings]"
- Browser not supported → Show supported browser list + download links
- Audio processing failure → "Oops! Try recording again"
- File size too large → "Recording too long. Maximum: 10 seconds"
- Low memory → "Close other tabs and try again"

**Error recovery:**
- Auto-save recording before processing
- Retry button for failed operations
- Clear error dismissal
- Help/troubleshooting link

## 5. UI/UX Requirements

### Design Goals

- Friendly STEM demo aesthetic
- Large, intuitive controls
- Minimal text clutter

### Required UI Sections

- Recording panel
- Effects selection panel
- Visualization panel
- Educational explanation panel
- Privacy notice banner

### Internationalization (i18n)

- English (default)
- Spanish (high priority for US schools)
- Support for RTL languages (future)
- Language switcher in UI
- Localized educational content

## 6. Educational Content Requirements

Each effect must include:
- Plain-language explanation
- STEM connection (e.g., frequency filtering)
- Optional "Did you know?" fact

**Tone:**
- Age-appropriate for middle/high school
- Technically accurate but simple

## 7. Deployment Requirements

### Hosting

Must support static hosting platforms:
- GitHub Pages
- Netlify
- Vercel
- School intranet hosting

**No backend required for core functionality.**

### Progressive Web App (PWA)

- Service worker for offline functionality
- Web app manifest for "Add to Home Screen"
- Offline educational content cached
- App icon set (various sizes: 192x192, 512x512)
- Splash screen for mobile installation
- Theme color and background color settings

### Repository Structure (Recommended)

```
/docs
  requirements.md
/src
  audio/
  ui/
  visualizer/
  effects/
public/
  manifest.json
  service-worker.js
  icons/
README.md
LICENSE
```
## 8. Security & Privacy Requirements

### Mandatory

- No hidden telemetry capturing voice data
- Explicit consent message before recording
- Clear privacy statement

### Recommended

- Content Security Policy headers
- No third-party trackers

## 9. Stretch Goals (Optional Enhancements)

### Educational Extensions

- Frequency spectrum analyzer
- Interactive "build your own effect" mode
- STEM lesson worksheet integration

### Advanced DSP

- High-quality pitch shifting without speed change
- Formant shifting
- AI-style voice effects (local inference only)

## 10. Testing & Quality Assurance Requirements

### Automated Testing

- Unit tests for all DSP functions (>80% coverage)
- Integration tests for audio pipeline
- Cross-browser automated testing (BrowserStack/Sauce Labs)
- Accessibility testing (axe-core, Pa11y)
- Performance testing (Lighthouse CI)

### Manual Testing

**Device testing matrix:**
- iOS Safari (latest 2 versions)
- Android Chrome (latest 2 versions)
- Desktop browsers on Windows/Mac/Linux
- Chromebooks (ChromeOS)

**User testing:**
- Audio quality testing by age-appropriate users
- STEM educator feedback sessions
- Usability testing with target age group

### Performance Benchmarks

- Lighthouse score >90 (all categories)
- JavaScript bundle size <500KB (gzipped)
- CSS bundle size <50KB (gzipped)
- Total page weight <1MB
- Time to Interactive <5 seconds (3G network)
- Processing latency <200ms for simple effects
- Memory usage <100MB during recording

## 11. Documentation Requirements

The repository must include:

**README with:**
- Project overview
- Demo screenshots
- STEM usage instructions

**Additional documentation:**
- Setup instructions for contributors
- Contribution guidelines

## 12. Success Criteria

Project is considered complete when:

- ✓ Students can record voice in browser
- ✓ Multiple effects work offline
- ✓ Educational explanations are visible
- ✓ No server-side audio handling occurs
- ✓ App runs smoothly on typical school devices
- ✓ WCAG 2.1 Level AA accessibility standards met
- ✓ Works as PWA with offline capability
- ✓ Comprehensive test suite with >80% coverage
- ✓ Clear error messages for all failure modes
- ✓ Demo samples available for testing without microphone
- ✓ Performance benchmarks achieved (Lighthouse >90)