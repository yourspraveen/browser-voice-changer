# 🎤 Browser-Based Voice Changer Demo

A privacy-first, browser-only voice recording and transformation web application that allows students to record short voice samples and apply fun audio effects while learning basic STEM concepts about sound, frequency, and digital signal processing.

**Perfect for:** Middle school and high school STEM demonstrations, science fairs, and educational workshops.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.2-61dafb)](https://reactjs.org/)

## ✨ Features

### 🔒 Privacy-First
- **100% browser-based** - No server uploads, no cloud processing
- **Your audio stays on your device** - Nothing is sent to any server
- **No login required** - Start using immediately
- **Open source** - Transparent and auditable

### 🎓 Educational
- **Learn DSP basics** - Understand frequency, pitch, and sound waves
- **Interactive visualizations** - See waveforms in real-time
- **STEM concepts** - Age-appropriate explanations for each effect
- **"Did you know?" facts** - Fascinating audio science trivia

### 🎨 Voice Effects
- **Chipmunk** - High-pitched, squeaky voice
- **Deep Voice** - Low, booming voice like a movie trailer
- **Robot** - Mechanical, synthetic sound
- **Telephone** - Old-fashioned phone call effect
- **Echo** - Canyon/hall reverb effect
- **Alien** - Otherworldly, modulated voice

### 📱 Accessible & Easy
- **Mobile-first design** - Works on phones, tablets, and computers
- **Large buttons** - Easy for all ages to use
- **Keyboard navigation** - Fully accessible
- **QR code friendly** - Share via QR code for classroom use
- **Works offline** - PWA with offline support

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm 9+
- Modern browser (Chrome 79+, Safari 14.1+, Firefox 76+, Edge 79+)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/browser-voice-changer.git
cd browser-voice-changer

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
# Build optimized production bundle
npm run build

# Preview production build
npm run preview
```

## 🏗️ Project Structure

```
browser-voice-changer/
├── public/               # Static assets
│   ├── icons/           # PWA icons
│   ├── samples/         # Pre-recorded demo audio
│   └── manifest.json    # PWA manifest
├── src/
│   ├── audio/           # Audio processing core
│   │   ├── effects/     # Effect implementations
│   │   ├── AudioCapture.ts
│   │   ├── AudioProcessor.ts
│   │   └── AudioExporter.ts
│   ├── visualization/   # Waveform and visualizations
│   ├── ui/
│   │   ├── components/  # React components
│   │   └── styles/      # CSS stylesheets
│   ├── state/           # State management
│   ├── utils/           # Utility functions
│   ├── i18n/            # Internationalization
│   ├── types/           # TypeScript types
│   ├── App.tsx          # Root component
│   └── main.tsx         # Entry point
├── tests/               # Test files
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── docs/                # Documentation
│   ├── Requirements.md
│   ├── ARCHITECTURE.md
│   ├── TECH_STACK.md
│   ├── DSP_SPECIFICATIONS.md
│   └── DESIGN_SYSTEM.md
└── package.json
```

## 🧪 Testing

```bash
# Run unit tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with UI
npm run test:ui

# Generate coverage report
npm run test:coverage

# Run E2E tests
npm run test:e2e

# Run accessibility tests
npm run test:a11y
```

## 🎨 Code Quality

```bash
# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format

# Check formatting
npm run format:check

# Type check
npm run type-check
```

## 📚 Documentation

Comprehensive documentation is available in the `docs/` directory:

- **[Requirements](docs/Requirements.md)** - Complete project requirements and success criteria
- **[Architecture](docs/ARCHITECTURE.md)** - System design and module specifications
- **[Tech Stack](docs/TECH_STACK.md)** - Technology decisions and rationale
- **[DSP Specifications](docs/DSP_SPECIFICATIONS.md)** - Detailed audio effect implementations
- **[Design System](docs/DESIGN_SYSTEM.md)** - UI/UX guidelines and component styles

## 🎓 Educational Use

### For Teachers

This application is designed for classroom demonstrations:

1. **No Setup Required** - Students can access via web browser
2. **QR Code Access** - Generate a QR code to your deployed instance
3. **Privacy Compliant** - No data collection, FERPA friendly
4. **Offline Capable** - Works without internet after first load
5. **Cross-Platform** - Works on Chromebooks, iPads, laptops

### Lesson Plan Ideas

- **Physics**: Sound waves, frequency, amplitude
- **Math**: Hertz (Hz), waveforms, ratios
- **Computer Science**: Digital signal processing, algorithms
- **Engineering**: Audio engineering, recording technology

### Demo Mode

Pre-recorded samples are included so students can experiment without microphone access. Perfect for:
- Quick demonstrations
- Devices without microphones
- Students who prefer not to record their voice

## 🌍 Browser Support

| Browser | Minimum Version | Status |
|---------|----------------|--------|
| Chrome | 79+ | ✅ Fully Supported |
| Edge | 79+ | ✅ Fully Supported |
| Safari | 14.1+ | ✅ Fully Supported |
| Firefox | 76+ | ✅ Fully Supported |

**Note:** Requires browsers with Web Audio API and MediaRecorder support.

## 🔧 Technology Stack

- **Framework**: React 18 + TypeScript 5
- **Build Tool**: Vite 5
- **Audio**: Web Audio API + Tone.js
- **Styling**: Plain CSS with CSS Variables
- **Testing**: Vitest + Playwright
- **PWA**: Vite PWA Plugin + Workbox

See [TECH_STACK.md](docs/TECH_STACK.md) for detailed technology decisions.

## 🤝 Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests (`npm test`)
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### Code of Conduct

This project follows a [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you agree to uphold this code.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Tone.js](https://tonejs.github.io/) for audio processing
- Icons from [Heroicons](https://heroicons.com/)
- Inspired by educational STEM projects worldwide

## 📞 Support

- **Documentation**: See the `docs/` folder
- **Issues**: [GitHub Issues](https://github.com/yourusername/browser-voice-changer/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/browser-voice-changer/discussions)

## 🗺️ Roadmap

### Phase 1: MVP (Completed ✅)
- [ ] Basic recording functionality
- [ ] 6 core effects
- [ ] Simple visualization
- [ ] Educational content

### Phase 2: Polish (In Progress 🚧)
- [ ] PWA support
- [ ] Demo samples
- [ ] Comparison tools
- [ ] Full test coverage

### Phase 3: Enhancements (Future 🔮)
- [ ] Spanish translation
- [ ] Advanced visualizations (FFT, Spectrogram)
- [ ] Teacher dashboard
- [ ] Printable worksheets

## 📊 Performance

- **Initial Load**: <3 seconds (3G network)
- **Bundle Size**: <500KB gzipped
- **Lighthouse Score**: >90 (target)
- **Memory Usage**: <100MB during recording
- **Processing Latency**: <200ms for effects

## 🎯 Project Status

🚧 **Current Status**: Development in Progress

This project is actively being developed. See the [project board](https://github.com/yourusername/browser-voice-changer/projects) for current status.

---

**Made with ❤️ for STEM education**

[Report Bug](https://github.com/yourusername/browser-voice-changer/issues) · [Request Feature](https://github.com/yourusername/browser-voice-changer/issues)
