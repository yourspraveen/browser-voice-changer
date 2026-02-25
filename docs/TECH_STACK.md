# Technology Stack

## Overview

This document outlines the technology decisions for the Browser-Based Voice Changer Demo Platform.

**Last Updated:** 2026-02-25

---

## Core Stack

### Frontend Framework
**React 18+**

**Rationale:**
- Large ecosystem and community support
- Excellent TypeScript integration
- Rich component library ecosystem
- Good for scaling features in the future
- Well-documented and widely understood

**Alternatives Considered:**
- Vanilla JS (simpler but more boilerplate for UI)
- Svelte (smaller bundle but less community support)
- Vue (good but React ecosystem better for this use case)

### Language
**TypeScript 5+**

**Rationale:**
- Type safety for audio processing code (critical for DSP)
- Better IDE support and autocomplete
- Catches bugs at compile time
- Self-documenting code through types
- Better long-term maintainability

**Configuration:**
- Strict mode enabled
- ES2022 target
- DOM and WebAudio types included

### Build Tool
**Vite 5+**

**Rationale:**
- Fastest dev server with HMR
- Optimal production builds
- Excellent TypeScript support
- Simple configuration
- Built-in React support
- Small bundle sizes

**Alternatives Considered:**
- Create React App (deprecated)
- Webpack (more complex configuration)
- Parcel (less control over optimization)

---

## Audio Processing

### Core Audio Library
**Web Audio API (Native) + Tone.js 14+**

**Rationale:**
- Tone.js provides high-level abstractions for effects
- Built-in effects: pitch shift, delay, reverb, filters
- Excellent documentation and examples
- Maintains access to low-level Web Audio API
- Active maintenance and community

**Web Audio API Features Used:**
- `AudioContext` - Core audio processing
- `MediaRecorder` - Recording audio
- `AnalyserNode` - Visualization
- `AudioWorklet` - Custom processing (future)
- `GainNode`, `BiquadFilterNode`, `DelayNode` - Effects

**Tone.js Components Used:**
- `Tone.Player` - Audio playback
- `Tone.PitchShift` - Chipmunk/Deep Voice effects
- `Tone.FeedbackDelay` - Echo effect
- `Tone.Filter` - Telephone effect
- `Tone.Chorus` - Alien effect
- Custom nodes for Robot effect

---

## Styling

### CSS Approach
**Plain CSS with CSS Variables**

**Rationale:**
- No build complexity or extra dependencies
- Modern CSS is powerful (Grid, Flexbox, Custom Properties)
- Easy for contributors to understand
- Great for educational projects
- Full control over styling
- Excellent performance

**CSS Organization:**
```
src/
  styles/
    global.css          # Reset, variables, base styles
    components.css      # Component-specific styles
    utilities.css       # Utility classes
    responsive.css      # Media queries
```

**CSS Variables Structure:**
```css
:root {
  /* Colors */
  --color-primary: #3B82F6;
  --color-secondary: #10B981;

  /* Spacing */
  --spacing-unit: 8px;

  /* Typography */
  --font-base: system-ui, -apple-system, sans-serif;
}
```

---

## Testing

### Unit Testing
**Vitest 1+**

**Rationale:**
- Native Vite integration
- Jest-compatible API
- Fast execution
- Great TypeScript support
- ESM-first

**Test Coverage Target:** >80%

### E2E Testing
**Playwright 1.40+**

**Rationale:**
- Tests across all browsers (Chromium, Firefox, WebKit)
- Reliable and fast
- Great debugging tools
- Built-in accessibility testing
- Auto-wait functionality

### Accessibility Testing
**axe-core + Playwright**

**Rationale:**
- Industry standard for a11y testing
- WCAG 2.1 compliance checking
- Integrates with Playwright
- Detailed violation reports

---

## Development Tools

### Package Manager
**npm (comes with Node.js)**

**Alternative:** pnpm if you prefer faster installs

### Code Quality

**ESLint 8+**
- React hooks plugin
- TypeScript ESLint
- Accessibility plugin (eslint-plugin-jsx-a11y)

**Prettier 3+**
- Consistent code formatting
- Auto-format on save

**Husky + lint-staged**
- Pre-commit hooks
- Lint and format before commit

### Version Control
**Git + GitHub**

**Branch Strategy:**
- `main` - Production-ready code
- `develop` - Development branch
- `feature/*` - New features
- `bugfix/*` - Bug fixes
- `hotfix/*` - Urgent fixes

---

## Deployment

### Hosting
**GitHub Pages** (Primary)

**Rationale:**
- Free for public repos
- Automatic deployment from `main`
- HTTPS included
- Custom domain support
- Perfect for static sites

**Alternatives:**
- Netlify (more features, free tier)
- Vercel (great for React, free tier)
- Cloudflare Pages (fast global CDN, free tier)

### CI/CD
**GitHub Actions**

**Workflows:**
1. **Test** - Run on every PR
   - Lint check
   - Type check
   - Unit tests
   - E2E tests
   - Accessibility tests

2. **Build** - Run on every PR
   - Build production bundle
   - Check bundle size

3. **Deploy** - Run on merge to `main`
   - Build production
   - Deploy to GitHub Pages

---

## Progressive Web App

### Service Worker
**Workbox 7+** (via Vite PWA plugin)

**Rationale:**
- Simple PWA setup for Vite
- Precaching strategies
- Runtime caching
- Offline support
- Auto-generated manifest

### PWA Features
- Offline functionality
- Install to home screen
- App-like experience
- Background sync (future)

---

## Dependencies

### Production Dependencies
```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "tone": "^14.7.77"
}
```

### Development Dependencies
```json
{
  "@types/react": "^18.2.0",
  "@types/react-dom": "^18.2.0",
  "@typescript-eslint/eslint-plugin": "^6.0.0",
  "@typescript-eslint/parser": "^6.0.0",
  "@vitejs/plugin-react": "^4.2.0",
  "@vitest/ui": "^1.0.0",
  "axe-core": "^4.8.0",
  "eslint": "^8.55.0",
  "eslint-plugin-jsx-a11y": "^6.8.0",
  "eslint-plugin-react": "^7.33.0",
  "eslint-plugin-react-hooks": "^4.6.0",
  "husky": "^8.0.0",
  "lint-staged": "^15.0.0",
  "playwright": "^1.40.0",
  "prettier": "^3.1.0",
  "typescript": "^5.3.0",
  "vite": "^5.0.0",
  "vite-plugin-pwa": "^0.17.0",
  "vitest": "^1.0.0"
}
```

---

## Browser Targets

### Minimum Supported Versions
- Chrome/Edge: 79+ (January 2020)
- Safari: 14.1+ (April 2021)
- Firefox: 76+ (May 2020)

**Rationale:**
- Covers ~95% of global users
- All support Web Audio API
- All support MediaRecorder
- All support ES2020+ features
- Reasonable for educational context

### Polyfills
**None required** for target browsers

---

## Performance Targets

### Bundle Size
- Initial JS: <500KB gzipped
- Initial CSS: <50KB gzipped
- Total page weight: <1MB
- Tone.js: ~200KB (largest dependency)

### Loading Performance
- First Contentful Paint: <1.5s
- Time to Interactive: <5s (3G network)
- Lighthouse Score: >90 (all categories)

### Runtime Performance
- Recording latency: <100ms
- Effect processing: <200ms
- Visualization: 60fps
- Memory usage: <100MB during recording

---

## Development Requirements

### Local Development
- Node.js 18+ (LTS)
- npm 9+
- Modern browser with DevTools
- Git 2.30+

### Recommended IDE
- VS Code with extensions:
  - ESLint
  - Prettier
  - TypeScript
  - React Developer Tools
  - Tailwind CSS IntelliSense (if needed)

### Recommended Browser Extensions
- React Developer Tools
- Redux DevTools (if adding state management)
- axe DevTools (accessibility)
- Lighthouse (performance)

---

## Future Considerations

### Potential Additions
- **State Management:** Zustand or Redux Toolkit (if state becomes complex)
- **Audio Processing:** AudioWorklet for custom effects (better performance)
- **UI Components:** Radix UI or Headless UI (accessible primitives)
- **Animation:** Framer Motion (if adding complex animations)
- **Testing:** Storybook (component documentation)

### Upgrade Path
All choices allow for incremental enhancement without major refactoring:
- Can add state management when needed
- Can migrate to AudioWorklet when needed
- Can add component library gradually
- TypeScript makes refactoring safer

---

## Decision Log

| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-02-25 | React instead of Vanilla JS | Better scaling, component reuse, ecosystem |
| 2026-02-25 | TypeScript over JavaScript | Type safety for audio code, better DX |
| 2026-02-25 | Tone.js for audio effects | Saves development time, proven library |
| 2026-02-25 | Plain CSS over Tailwind | Simplicity, no build complexity, educational |
| 2026-02-25 | Vite over Webpack | Faster dev experience, simpler config |
| 2026-02-25 | Vitest over Jest | Native Vite integration, faster |

---

## Questions or Changes?

To propose changes to the tech stack:
1. Open a GitHub issue with the `tech-stack` label
2. Explain the problem with current choice
3. Propose alternative with trade-offs
4. Get team consensus before changing
