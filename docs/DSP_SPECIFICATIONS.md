# Digital Signal Processing Specifications

## Overview

This document provides detailed technical specifications for each voice effect, including DSP algorithms, parameters, implementation details, and educational content.

**Audio Processing Context:**
- Sample Rate: 48000 Hz (default) or 44100 Hz
- Bit Depth: 32-bit float (Web Audio API standard)
- Channels: Mono (converted from stereo if needed)
- Buffer Size: Configurable, default 4096 samples

---

## Effect 1: Chipmunk Voice

### Description
Makes voice sound higher-pitched and faster, like a chipmunk or cartoon character.

### DSP Approach

**Method 1: Playback Rate Change (Simple)**
- Increase playback rate (1.5x - 2.0x)
- Pro: Simple, built-in browser support
- Con: Makes audio faster

**Method 2: Pitch Shifting (Advanced)** ⭐ **Recommended**
- Uses time-stretching + resampling
- Maintains audio duration
- Uses Tone.js `PitchShift` effect

### Parameters

| Parameter | Type | Range | Default | Description |
|-----------|------|-------|---------|-------------|
| `pitchShift` | number | 4-12 semitones | 7 | How much to shift pitch up |
| `wetDry` | number | 0-1 | 1.0 | Effect mix (0=original, 1=full effect) |
| `windowSize` | number | 0.03-0.1 | 0.1 | Time-stretch window (Tone.js) |

### Web Audio Implementation

```typescript
import * as Tone from 'tone'

class ChipmunkEffect implements Effect {
  private pitchShift: Tone.PitchShift
  private wetDry: number = 1.0

  constructor() {
    this.pitchShift = new Tone.PitchShift({
      pitch: 7,  // semitones
      windowSize: 0.1,
      delayTime: 0,
      feedback: 0
    })
  }

  async process(buffer: AudioBuffer, params: EffectParams): Promise<AudioBuffer> {
    // Set parameters
    this.pitchShift.pitch = params.pitchShift || 7
    this.wetDry = params.wetDry || 1.0

    // Create offline context for processing
    const offlineContext = new OfflineAudioContext(
      buffer.numberOfChannels,
      buffer.length,
      buffer.sampleRate
    )

    // Create source
    const source = offlineContext.createBufferSource()
    source.buffer = buffer

    // Connect: Source → PitchShift → Destination
    const toneContext = Tone.getContext()
    this.pitchShift.connect(offlineContext.destination)

    // Connect Tone node
    source.connect(this.pitchShift.input as any)

    // Render
    source.start(0)
    const renderedBuffer = await offlineContext.startRendering()

    // Apply wet/dry mix if needed
    return this.applyWetDry(buffer, renderedBuffer, this.wetDry)
  }

  private applyWetDry(
    dryBuffer: AudioBuffer,
    wetBuffer: AudioBuffer,
    mix: number
  ): AudioBuffer {
    // Create new buffer for mixed audio
    const mixed = new AudioContext().createBuffer(
      dryBuffer.numberOfChannels,
      dryBuffer.length,
      dryBuffer.sampleRate
    )

    for (let channel = 0; channel < dryBuffer.numberOfChannels; channel++) {
      const dryData = dryBuffer.getChannelData(channel)
      const wetData = wetBuffer.getChannelData(channel)
      const mixedData = mixed.getChannelData(channel)

      for (let i = 0; i < dryData.length; i++) {
        mixedData[i] = dryData[i] * (1 - mix) + wetData[i] * mix
      }
    }

    return mixed
  }

  getDefaultParams(): EffectParams {
    return {
      pitchShift: 7,
      wetDry: 1.0,
      windowSize: 0.1
    }
  }
}
```

### Educational Content

```json
{
  "name": "Chipmunk Voice",
  "explanation": "The chipmunk effect makes your voice sound higher and squeakier by shifting the pitch up several notes without changing how fast you talk.",
  "stemConnection": "Sound is made of vibrations called waves. Higher pitch means faster vibrations (higher frequency). By shifting your voice up 7 semitones (musical notes), we're making those sound waves vibrate about 1.5 times faster! It's like tuning a guitar string tighter to make it sound higher.",
  "didYouKnow": "Real chipmunks make high-pitched sounds because their vocal cords are very small. Smaller objects vibrate faster, creating higher-pitched sounds. That's why a small flute sounds higher than a big tuba!",
  "visualDemo": "Show waveform with more frequent peaks/troughs"
}
```

---

## Effect 2: Deep Voice

### Description
Makes voice sound lower-pitched and deeper, like a giant or movie trailer voice.

### DSP Approach
Same as Chipmunk but with negative pitch shift

### Parameters

| Parameter | Type | Range | Default | Description |
|-----------|------|-------|---------|-------------|
| `pitchShift` | number | -12 to -4 semitones | -7 | How much to shift pitch down |
| `wetDry` | number | 0-1 | 1.0 | Effect mix |
| `windowSize` | number | 0.03-0.1 | 0.1 | Time-stretch window |

### Web Audio Implementation

```typescript
class DeepVoiceEffect implements Effect {
  private pitchShift: Tone.PitchShift

  constructor() {
    this.pitchShift = new Tone.PitchShift({
      pitch: -7,  // negative for lower pitch
      windowSize: 0.1
    })
  }

  async process(buffer: AudioBuffer, params: EffectParams): Promise<AudioBuffer> {
    this.pitchShift.pitch = params.pitchShift || -7
    // Similar to ChipmunkEffect but with negative pitch
    // ... (same implementation pattern)
  }
}
```

### Educational Content

```json
{
  "name": "Deep Voice",
  "explanation": "The deep voice effect makes you sound like a giant by lowering the pitch of your voice several notes.",
  "stemConnection": "Lower pitch means slower vibrations (lower frequency). By shifting your voice down 7 semitones, we're making those sound waves vibrate about 0.67 times slower. It's like loosening a guitar string to make it sound lower.",
  "didYouKnow": "Blue whales make the lowest sounds of any animal - as low as 10 Hz (10 vibrations per second). Humans can't even hear below 20 Hz! Large objects vibrate slowly, creating low-pitched sounds.",
  "visualDemo": "Show waveform with less frequent peaks/troughs"
}
```

---

## Effect 3: Robot Voice

### Description
Mechanical, synthetic voice like a robot or vocoder.

### DSP Approach
**Ring Modulation + Filtering**
- Ring modulation with carrier frequency (modulate voice with sine wave)
- Bandpass filter to narrow frequency range
- Optional: bit crushing for digital artifacts

### Parameters

| Parameter | Type | Range | Default | Description |
|-----------|------|-------|---------|-------------|
| `modulationFreq` | number | 20-500 Hz | 30 | Carrier frequency for ring mod |
| `filterFreq` | number | 200-3000 Hz | 800 | Center frequency of bandpass |
| `filterQ` | number | 0.5-10 | 3 | Filter resonance |
| `wetDry` | number | 0-1 | 1.0 | Effect mix |

### Web Audio Implementation

```typescript
class RobotEffect implements Effect {
  async process(buffer: AudioBuffer, params: EffectParams): Promise<AudioBuffer> {
    const modulationFreq = params.modulationFreq || 30
    const filterFreq = params.filterFreq || 800
    const filterQ = params.filterQ || 3
    const wetDry = params.wetDry || 1.0

    // Create offline context
    const offlineContext = new OfflineAudioContext(
      buffer.numberOfChannels,
      buffer.length,
      buffer.sampleRate
    )

    // Create nodes
    const source = offlineContext.createBufferSource()
    source.buffer = buffer

    // Ring modulation: Create carrier oscillator
    const carrier = offlineContext.createOscillator()
    carrier.frequency.value = modulationFreq
    carrier.type = 'sine'

    // Create gain for modulation
    const modGain = offlineContext.createGain()
    modGain.gain.value = 0.5

    // Create bandpass filter
    const filter = offlineContext.createBiquadFilter()
    filter.type = 'bandpass'
    filter.frequency.value = filterFreq
    filter.Q.value = filterQ

    // Connect: Source → ModGain ← Carrier
    //          ModGain → Filter → Destination
    source.connect(modGain)
    carrier.connect(modGain.gain)
    modGain.connect(filter)
    filter.connect(offlineContext.destination)

    // Start
    source.start(0)
    carrier.start(0)

    // Render
    const renderedBuffer = await offlineContext.startRendering()

    return this.applyWetDry(buffer, renderedBuffer, wetDry)
  }

  private applyWetDry(
    dryBuffer: AudioBuffer,
    wetBuffer: AudioBuffer,
    mix: number
  ): AudioBuffer {
    // Same as ChipmunkEffect
    // ... implementation
  }
}
```

### Educational Content

```json
{
  "name": "Robot Voice",
  "explanation": "The robot effect makes you sound mechanical and synthetic by mixing your voice with a pure electronic tone and filtering out some frequencies.",
  "stemConnection": "This effect uses 'ring modulation' - multiplying your voice sound wave with a simple sine wave (pure tone). This creates new frequencies that weren't in your original voice, giving it a metallic, robotic quality. Then a filter removes some frequencies to make it sound even more mechanical.",
  "didYouKnow": "Early synthesizers used this exact technique in the 1960s! Bands like Kraftwerk used ring modulation to create robot voices in their music. Modern voice assistants sound more natural because they use recorded human speech, not synthesis.",
  "visualDemo": "Show waveform with regular modulation pattern"
}
```

---

## Effect 4: Telephone Voice

### Description
Makes voice sound like it's coming through an old telephone line.

### DSP Approach
**Bandpass Filtering + Optional Distortion**
- Bandpass filter (300 Hz - 3400 Hz) - telephone frequency range
- Optional: light bit crushing for digital artifacts
- Optional: light distortion/clipping

### Parameters

| Parameter | Type | Range | Default | Description |
|-----------|------|-------|---------|-------------|
| `lowCutoff` | number | 200-500 Hz | 300 | High-pass frequency |
| `highCutoff` | number | 2000-4000 Hz | 3400 | Low-pass frequency |
| `distortion` | number | 0-0.5 | 0.2 | Amount of distortion |
| `wetDry` | number | 0-1 | 1.0 | Effect mix |

### Web Audio Implementation

```typescript
class TelephoneEffect implements Effect {
  async process(buffer: AudioBuffer, params: EffectParams): Promise<AudioBuffer> {
    const lowCutoff = params.lowCutoff || 300
    const highCutoff = params.highCutoff || 3400
    const distortion = params.distortion || 0.2
    const wetDry = params.wetDry || 1.0

    // Create offline context
    const offlineContext = new OfflineAudioContext(
      buffer.numberOfChannels,
      buffer.length,
      buffer.sampleRate
    )

    // Create nodes
    const source = offlineContext.createBufferSource()
    source.buffer = buffer

    // High-pass filter (remove frequencies below 300 Hz)
    const highPass = offlineContext.createBiquadFilter()
    highPass.type = 'highpass'
    highPass.frequency.value = lowCutoff
    highPass.Q.value = 0.7

    // Low-pass filter (remove frequencies above 3400 Hz)
    const lowPass = offlineContext.createBiquadFilter()
    lowPass.type = 'lowpass'
    lowPass.frequency.value = highCutoff
    lowPass.Q.value = 0.7

    // Optional: WaveShaper for distortion
    const shaper = offlineContext.createWaveShaper()
    shaper.curve = this.makeDistortionCurve(distortion, offlineContext.sampleRate)
    shaper.oversample = '2x'

    // Connect: Source → HighPass → LowPass → Shaper → Destination
    source.connect(highPass)
    highPass.connect(lowPass)
    lowPass.connect(shaper)
    shaper.connect(offlineContext.destination)

    // Render
    source.start(0)
    const renderedBuffer = await offlineContext.startRendering()

    return this.applyWetDry(buffer, renderedBuffer, wetDry)
  }

  private makeDistortionCurve(amount: number, sampleRate: number): Float32Array {
    const samples = sampleRate
    const curve = new Float32Array(samples)
    const deg = Math.PI / 180

    for (let i = 0; i < samples; i++) {
      const x = (i * 2) / samples - 1
      curve[i] = ((3 + amount) * x * 20 * deg) / (Math.PI + amount * Math.abs(x))
    }

    return curve
  }
}
```

### Educational Content

```json
{
  "name": "Telephone Voice",
  "explanation": "This effect makes you sound like you're talking on an old telephone by removing very low and very high sounds from your voice.",
  "stemConnection": "Old telephone lines could only transmit a narrow range of frequencies: 300 Hz to 3400 Hz. This is called 'bandwidth'. We use filters to remove frequencies outside this range - a high-pass filter removes sounds below 300 Hz (deep rumbles) and a low-pass filter removes sounds above 3400 Hz (crisp highs). That's why phone calls sound 'tinny'!",
  "didYouKnow": "Modern digital phones can transmit a wider range (50 Hz - 7000 Hz), called 'HD Voice'. That's why phone calls sound much clearer now than they did 20 years ago! The narrow bandwidth was a limitation of old copper telephone wires.",
  "visualDemo": "Show frequency spectrum with middle frequencies highlighted"
}
```

---

## Effect 5: Echo

### Description
Adds repeating echoes like singing in a canyon or large hall.

### DSP Approach
**Delay with Feedback**
- Delay line with configurable delay time
- Feedback loop creates multiple echoes
- Wet/dry mix for effect amount

### Parameters

| Parameter | Type | Range | Default | Description |
|-----------|------|-------|---------|-------------|
| `delayTime` | number | 0.1-1.0 seconds | 0.25 | Time between echoes |
| `feedback` | number | 0-0.9 | 0.5 | Amount of echo repetition |
| `wetDry` | number | 0-1 | 0.7 | Effect mix |

### Web Audio Implementation

```typescript
class EchoEffect implements Effect {
  private delay: Tone.FeedbackDelay

  constructor() {
    this.delay = new Tone.FeedbackDelay({
      delayTime: 0.25,
      feedback: 0.5,
      wet: 0.7
    })
  }

  async process(buffer: AudioBuffer, params: EffectParams): Promise<AudioBuffer> {
    const delayTime = params.delayTime || 0.25
    const feedback = params.feedback || 0.5
    const wetDry = params.wetDry || 0.7

    // Set parameters
    this.delay.delayTime.value = delayTime
    this.delay.feedback.value = feedback
    this.delay.wet.value = wetDry

    // Create offline context
    // Add extra time for echo tail
    const echoTailTime = 3 // seconds
    const totalLength = buffer.length + (echoTailTime * buffer.sampleRate)

    const offlineContext = new OfflineAudioContext(
      buffer.numberOfChannels,
      totalLength,
      buffer.sampleRate
    )

    // Create source
    const source = offlineContext.createBufferSource()
    source.buffer = buffer

    // Connect Tone.js node
    const toneContext = Tone.getContext()
    this.delay.connect(offlineContext.destination)
    source.connect(this.delay.input as any)

    // Render
    source.start(0)
    const renderedBuffer = await offlineContext.startRendering()

    return renderedBuffer
  }
}
```

### Educational Content

```json
{
  "name": "Echo Effect",
  "explanation": "The echo effect makes your voice repeat like you're in a big canyon or empty room by playing delayed copies of your voice.",
  "stemConnection": "An echo happens when sound bounces off a surface and comes back to your ears. The time it takes depends on distance: sound travels about 343 meters per second (767 mph). In a canyon 34.3 meters away, you'd hear an echo after 0.2 seconds. Our delay effect simulates this by creating digital copies of your voice that play after a delay!",
  "didYouKnow": "The longest-lasting echo ever recorded was in Scotland's Inchindown oil tanks - it lasted 112 seconds! That's almost 2 minutes of echo from a single sound. Most echoes we hear in nature last less than a second.",
  "visualDemo": "Show waveform with repeating decaying copies"
}
```

---

## Effect 6: Alien/Fun Effect

### Description
Weird, otherworldly voice with modulation and chorus effects.

### DSP Approach
**Chorus + Pitch Modulation**
- Chorus effect (multiple delayed copies with slight detuning)
- LFO (Low-Frequency Oscillator) modulates pitch
- Creates swirling, spacey sound

### Parameters

| Parameter | Type | Range | Default | Description |
|-----------|------|-------|---------|-------------|
| `chorusRate` | number | 0.5-8 Hz | 2 | Speed of modulation |
| `chorusDepth` | number | 0-1 | 0.7 | Amount of detuning |
| `voices` | number | 2-8 | 4 | Number of chorus voices |
| `wetDry` | number | 0-1 | 0.8 | Effect mix |

### Web Audio Implementation

```typescript
class AlienEffect implements Effect {
  private chorus: Tone.Chorus

  constructor() {
    this.chorus = new Tone.Chorus({
      frequency: 2,
      delayTime: 3.5,
      depth: 0.7,
      spread: 180
    })
  }

  async process(buffer: AudioBuffer, params: EffectParams): Promise<AudioBuffer> {
    const chorusRate = params.chorusRate || 2
    const chorusDepth = params.chorusDepth || 0.7
    const wetDry = params.wetDry || 0.8

    // Set parameters
    this.chorus.frequency.value = chorusRate
    this.chorus.depth = chorusDepth
    this.chorus.wet.value = wetDry

    // Start the chorus LFO
    this.chorus.start()

    // Create offline context
    const offlineContext = new OfflineAudioContext(
      buffer.numberOfChannels,
      buffer.length,
      buffer.sampleRate
    )

    // Create source
    const source = offlineContext.createBufferSource()
    source.buffer = buffer

    // Connect
    this.chorus.connect(offlineContext.destination)
    source.connect(this.chorus.input as any)

    // Render
    source.start(0)
    const renderedBuffer = await offlineContext.startRendering()

    return renderedBuffer
  }
}
```

### Educational Content

```json
{
  "name": "Alien Effect",
  "explanation": "The alien effect makes your voice sound weird and otherworldly by playing multiple slightly different copies of your voice at the same time with wobbling pitch.",
  "stemConnection": "This uses a 'chorus' effect - named after a choir singing together! When many people sing the same note, they're never perfectly in tune, which creates a rich, swirling sound. We simulate this digitally by making copies of your voice, detuning them slightly (changing pitch up and down), and mixing them together. An LFO (Low-Frequency Oscillator) makes the pitch wobble over time.",
  "didYouKnow": "Guitar players love chorus effects! The famous 'Come As You Are' by Nirvana uses a chorus effect on the guitar. Synthesizers also use this to make sounds bigger and more interesting.",
  "visualDemo": "Show multiple overlapping waveforms with slight differences"
}
```

---

## Common Audio Utilities

### Audio Buffer Conversion

```typescript
// Convert Blob to AudioBuffer
async function blobToAudioBuffer(blob: Blob): Promise<AudioBuffer> {
  const arrayBuffer = await blob.arrayBuffer()
  const audioContext = new AudioContext()
  return await audioContext.decodeAudioData(arrayBuffer)
}

// Convert AudioBuffer to WAV Blob
function audioBufferToWav(buffer: AudioBuffer): Blob {
  const length = buffer.length * buffer.numberOfChannels * 2
  const arrayBuffer = new ArrayBuffer(44 + length)
  const view = new DataView(arrayBuffer)

  // Write WAV header
  writeString(view, 0, 'RIFF')
  view.setUint32(4, 36 + length, true)
  writeString(view, 8, 'WAVE')
  writeString(view, 12, 'fmt ')
  view.setUint32(16, 16, true) // PCM format
  view.setUint16(20, 1, true) // Linear quantization
  view.setUint16(22, buffer.numberOfChannels, true)
  view.setUint32(24, buffer.sampleRate, true)
  view.setUint32(28, buffer.sampleRate * buffer.numberOfChannels * 2, true)
  view.setUint16(32, buffer.numberOfChannels * 2, true)
  view.setUint16(34, 16, true) // 16-bit
  writeString(view, 36, 'data')
  view.setUint32(40, length, true)

  // Write audio data
  const offset = 44
  const channels = []
  for (let i = 0; i < buffer.numberOfChannels; i++) {
    channels.push(buffer.getChannelData(i))
  }

  let index = offset
  for (let i = 0; i < buffer.length; i++) {
    for (let channel = 0; channel < channels.length; channel++) {
      const sample = Math.max(-1, Math.min(1, channels[channel][i]))
      view.setInt16(index, sample < 0 ? sample * 0x8000 : sample * 0x7FFF, true)
      index += 2
    }
  }

  return new Blob([arrayBuffer], { type: 'audio/wav' })
}

function writeString(view: DataView, offset: number, string: string) {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i))
  }
}
```

### Normalize Audio Levels

```typescript
function normalizeAudioBuffer(buffer: AudioBuffer, targetLevel: number = 0.95): AudioBuffer {
  // Find peak level
  let peak = 0
  for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
    const data = buffer.getChannelData(channel)
    for (let i = 0; i < data.length; i++) {
      const abs = Math.abs(data[i])
      if (abs > peak) peak = abs
    }
  }

  // Calculate gain
  const gain = peak > 0 ? targetLevel / peak : 1

  // Apply gain
  const normalized = new AudioContext().createBuffer(
    buffer.numberOfChannels,
    buffer.length,
    buffer.sampleRate
  )

  for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
    const inputData = buffer.getChannelData(channel)
    const outputData = normalized.getChannelData(channel)
    for (let i = 0; i < inputData.length; i++) {
      outputData[i] = inputData[i] * gain
    }
  }

  return normalized
}
```

---

## Performance Considerations

### Offline vs Real-time Processing
- **Offline (Recommended):** Process entire buffer at once, better quality
- **Real-time:** Process during recording, hear effect immediately (future)

### Memory Management
- Dispose of AudioBuffers after use
- Reuse OfflineAudioContext when possible
- Limit recording length to prevent memory issues

### Processing Time Estimates
- Simple effects (Telephone, Echo): <100ms
- Pitch shifting (Chipmunk, Deep Voice): 200-500ms
- Complex effects (Robot, Alien): 100-300ms

---

## Testing DSP Implementations

### Unit Test Structure

```typescript
describe('ChipmunkEffect', () => {
  let effect: ChipmunkEffect
  let testBuffer: AudioBuffer

  beforeEach(() => {
    effect = new ChipmunkEffect()
    testBuffer = createTestBuffer(48000, 1) // 1 second
  })

  test('increases pitch by specified semitones', async () => {
    const processed = await effect.process(testBuffer, { pitchShift: 7 })

    // Analyze frequency content
    const originalFreq = analyzeFrequency(testBuffer)
    const processedFreq = analyzeFrequency(processed)

    // Should be approximately 1.5x higher (7 semitones = 2^(7/12) ≈ 1.5)
    expect(processedFreq / originalFreq).toBeCloseTo(1.498, 1)
  })

  test('respects wet/dry mix', async () => {
    const dry = await effect.process(testBuffer, { wetDry: 0 })
    const wet = await effect.process(testBuffer, { wetDry: 1 })
    const mixed = await effect.process(testBuffer, { wetDry: 0.5 })

    // Mixed should be between dry and wet
    // ... assertions
  })
})
```

---

## References

- [Web Audio API Specification](https://webaudio.github.io/web-audio-api/)
- [Tone.js Documentation](https://tonejs.github.io/)
- [Digital Signal Processing Basics](https://www.dspguide.com/)
- [Audio EQ Cookbook](https://webaudio.github.io/Audio-EQ-Cookbook/)
