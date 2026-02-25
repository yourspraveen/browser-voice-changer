# Contributing to Voice Changer Demo

Thank you for your interest in contributing! This document provides guidelines for contributing to the project.

## Code of Conduct

This project follows a Code of Conduct. By participating, you agree to uphold this code. Please report unacceptable behavior to the project maintainers.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues. When creating a bug report, include:

- **Clear title and description**
- **Steps to reproduce**
- **Expected vs actual behavior**
- **Screenshots** (if applicable)
- **Browser and OS information**
- **Console errors** (if any)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, include:

- **Clear title and description**
- **Rationale** - Why is this enhancement needed?
- **Use cases** - Who would benefit?
- **Mockups or examples** (if applicable)

### Pull Requests

1. **Fork the repository** and create your branch from `main`
2. **Follow the code style** - Run `npm run lint` and `npm run format`
3. **Add tests** for new functionality
4. **Update documentation** if needed
5. **Ensure all tests pass** - Run `npm test`
6. **Write a clear commit message**

#### Branch Naming

- `feature/description` - New features
- `bugfix/description` - Bug fixes
- `docs/description` - Documentation updates
- `refactor/description` - Code refactoring
- `test/description` - Test additions/updates

#### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
type(scope): subject

body (optional)

footer (optional)
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Test additions or updates
- `chore`: Build process or tooling changes

**Examples:**
```
feat(effects): add reverb effect

Implements reverb effect using Tone.js Reverb node.
Includes educational content about reverb.

Closes #42
```

```
fix(recording): handle microphone permission denial

Shows user-friendly error message when microphone access is denied.
Includes link to browser settings.
```

## Development Setup

### Prerequisites
- Node.js 18+
- npm 9+
- Git

### Setup Steps

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/browser-voice-changer.git
cd browser-voice-changer

# Install dependencies
npm install

# Start dev server
npm run dev

# Run tests
npm test
```

### Development Workflow

1. **Create a branch** from `main`
   ```bash
   git checkout -b feature/my-feature
   ```

2. **Make your changes**
   - Write code
   - Add tests
   - Update documentation

3. **Test your changes**
   ```bash
   npm run lint        # Check code style
   npm run type-check  # Check TypeScript
   npm test           # Run unit tests
   npm run test:e2e   # Run E2E tests
   npm run test:a11y  # Check accessibility
   ```

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat(scope): description"
   ```

5. **Push to your fork**
   ```bash
   git push origin feature/my-feature
   ```

6. **Open a Pull Request**
   - Go to the original repository
   - Click "New Pull Request"
   - Select your branch
   - Fill out the PR template

## Code Style

### TypeScript

- Use TypeScript for all code
- Enable strict mode
- Avoid `any` types
- Use interfaces for props and state
- Document complex functions with JSDoc

### React

- Use functional components with hooks
- Keep components small and focused
- Extract reusable logic into custom hooks
- Use proper TypeScript types for props

### CSS

- Use CSS variables for theming
- Follow BEM naming convention
- Mobile-first responsive design
- Ensure WCAG 2.1 AA contrast ratios

### Testing

- Write tests for all new features
- Aim for >80% code coverage
- Test edge cases and error states
- Include accessibility tests

## Project Structure

```
src/
├── audio/              # Audio processing
│   ├── effects/        # Effect implementations
│   └── *.ts           # Core audio modules
├── visualization/      # Waveform visualizations
├── ui/
│   ├── components/     # React components
│   └── styles/        # CSS files
├── state/             # State management
├── utils/             # Utility functions
├── i18n/              # Translations
└── types/             # TypeScript types
```

## Documentation

### Code Documentation

- Add JSDoc comments for public APIs
- Include usage examples
- Document parameters and return types
- Explain complex algorithms

### Markdown Documentation

- Update relevant docs in `docs/` folder
- Keep README.md up to date
- Add screenshots for UI changes
- Update architecture diagrams if needed

## Testing Guidelines

### Unit Tests

Test individual functions and components:

```typescript
describe('ChipmunkEffect', () => {
  test('increases pitch by specified semitones', async () => {
    const effect = new ChipmunkEffect()
    const result = await effect.process(testBuffer, { pitchShift: 7 })
    expect(analyzePitch(result)).toBeCloseTo(1.498)
  })
})
```

### Integration Tests

Test module interactions:

```typescript
describe('Audio Pipeline', () => {
  test('captures, processes, and exports audio', async () => {
    const capture = new AudioCapture()
    await capture.startRecording()
    const blob = await capture.stopRecording()
    const processed = await processor.applyEffect(blob, 'chipmunk')
    const exported = await exporter.exportWAV(processed)
    expect(exported).toBeInstanceOf(Blob)
  })
})
```

### E2E Tests

Test user workflows:

```typescript
test('complete recording workflow', async ({ page }) => {
  await page.goto('/')
  await page.click('[data-testid="record-button"]')
  await page.waitForTimeout(2000)
  await page.click('[data-testid="stop-button"]')
  await page.click('[data-testid="chipmunk-effect"]')
  await expect(page.locator('[data-testid="play-button"]')).toBeVisible()
})
```

### Accessibility Tests

Test a11y compliance:

```typescript
test('has no accessibility violations', async ({ page }) => {
  await page.goto('/')
  const results = await new AxeBuilder({ page }).analyze()
  expect(results.violations).toEqual([])
})
```

## Adding New Effects

To add a new audio effect:

1. **Create effect class** in `src/audio/effects/YourEffect.ts`
   ```typescript
   export class YourEffect implements Effect {
     async process(buffer: AudioBuffer, params: EffectParams): Promise<AudioBuffer> {
       // Implementation
     }
   }
   ```

2. **Add tests** in `tests/unit/effects/YourEffect.test.ts`

3. **Add educational content** in effect class

4. **Register effect** in effects index

5. **Add UI component** (if needed)

6. **Update documentation**

## Performance Guidelines

- Keep bundle size <500KB gzipped
- Lighthouse score >90
- Processing latency <200ms
- Memory usage <100MB

## Accessibility Guidelines

- WCAG 2.1 Level AA minimum
- Keyboard navigation for all features
- Screen reader support
- Focus indicators
- Minimum touch target: 44x44px
- Color contrast ratios: 4.5:1 (text), 3:1 (UI)

## Security Guidelines

- No audio data leaves the browser
- No third-party analytics
- Content Security Policy enabled
- No `eval()` or `Function()`
- Sanitize user inputs

## Questions?

- **Documentation**: Check the `docs/` folder
- **Issues**: Search existing GitHub issues
- **Discussions**: Use GitHub Discussions for questions

## Recognition

Contributors are recognized in:
- GitHub contributors list
- Release notes
- Special thanks in README (major contributions)

Thank you for contributing! 🎉
