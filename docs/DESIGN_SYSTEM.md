# Design System

## Overview

This design system defines the visual language for the Browser-Based Voice Changer Demo Platform. The aesthetic is **playful, colorful, and educational** - designed to engage middle and high school students while maintaining professionalism.

**Design Principles:**
- **Accessible First:** WCAG 2.1 AA compliance minimum
- **Touch-Friendly:** Large hit targets (44x44px minimum)
- **Responsive:** Mobile-first, works on all devices
- **Performant:** CSS-only animations, minimal JS
- **Educational:** Clear hierarchy, helpful affordances

---

## Color Palette

### Primary Colors

```css
:root {
  /* Primary - Blue (Trust, Technology, Science) */
  --color-primary-50: #EFF6FF;
  --color-primary-100: #DBEAFE;
  --color-primary-200: #BFDBFE;
  --color-primary-300: #93C5FD;
  --color-primary-400: #60A5FA;
  --color-primary-500: #3B82F6;  /* Main primary */
  --color-primary-600: #2563EB;
  --color-primary-700: #1D4ED8;
  --color-primary-800: #1E40AF;
  --color-primary-900: #1E3A8A;

  /* Secondary - Green (Success, Growth, Go) */
  --color-secondary-50: #ECFDF5;
  --color-secondary-100: #D1FAE5;
  --color-secondary-200: #A7F3D0;
  --color-secondary-300: #6EE7B7;
  --color-secondary-400: #34D399;
  --color-secondary-500: #10B981;  /* Main secondary */
  --color-secondary-600: #059669;
  --color-secondary-700: #047857;
  --color-secondary-800: #065F46;
  --color-secondary-900: #064E3B;

  /* Accent - Orange (Fun, Energy, Attention) */
  --color-accent-50: #FFF7ED;
  --color-accent-100: #FFEDD5;
  --color-accent-200: #FED7AA;
  --color-accent-300: #FDBA74;
  --color-accent-400: #FB923C;
  --color-accent-500: #F59E0B;  /* Main accent */
  --color-accent-600: #D97706;
  --color-accent-700: #B45309;
  --color-accent-800: #92400E;
  --color-accent-900: #78350F;
}
```

### Semantic Colors

```css
:root {
  /* Recording State - Red */
  --color-recording: #EF4444;
  --color-recording-hover: #DC2626;
  --color-recording-light: #FEE2E2;

  /* Success - Green */
  --color-success: #10B981;
  --color-success-light: #D1FAE5;

  /* Warning - Yellow */
  --color-warning: #F59E0B;
  --color-warning-light: #FEF3C7;

  /* Error - Red */
  --color-error: #EF4444;
  --color-error-light: #FEE2E2;

  /* Info - Blue */
  --color-info: #3B82F6;
  --color-info-light: #DBEAFE;
}
```

### Neutral Colors

```css
:root {
  /* Neutrals - Gray Scale */
  --color-white: #FFFFFF;
  --color-gray-50: #F9FAFB;
  --color-gray-100: #F3F4F6;
  --color-gray-200: #E5E7EB;
  --color-gray-300: #D1D5DB;
  --color-gray-400: #9CA3AF;
  --color-gray-500: #6B7280;
  --color-gray-600: #4B5563;
  --color-gray-700: #374151;
  --color-gray-800: #1F2937;
  --color-gray-900: #111827;
  --color-black: #000000;
}
```

### Effect-Specific Colors

```css
:root {
  /* Each effect gets a unique color for visual distinction */
  --color-effect-chipmunk: #F472B6;    /* Pink */
  --color-effect-deep: #8B5CF6;         /* Purple */
  --color-effect-robot: #06B6D4;        /* Cyan */
  --color-effect-telephone: #F59E0B;    /* Orange */
  --color-effect-echo: #10B981;         /* Green */
  --color-effect-alien: #6366F1;        /* Indigo */
}
```

### Color Usage Guidelines

| Use Case | Color | Example |
|----------|-------|---------|
| Primary actions | `--color-primary-500` | Record button (before recording) |
| Recording state | `--color-recording` | Record button (while recording) |
| Success states | `--color-success` | "Recording saved!" message |
| Effect selection | Effect-specific colors | Effect card backgrounds |
| Educational content | `--color-info` | Info tooltips, explanations |
| Warnings | `--color-warning` | "Microphone access needed" |
| Errors | `--color-error` | "Recording failed" message |

---

## Typography

### Font Families

```css
:root {
  /* System font stack for performance and native feel */
  --font-base: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
               "Helvetica Neue", Arial, "Noto Sans", sans-serif,
               "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol",
               "Noto Color Emoji";

  /* Monospace for technical info */
  --font-mono: ui-monospace, SFMono-Regular, "SF Mono", Monaco, Consolas,
               "Liberation Mono", "Courier New", monospace;

  /* Optional: Google Fonts alternative for custom branding */
  /* --font-display: 'Inter', var(--font-base); */
}
```

### Font Sizes

```css
:root {
  /* Type scale (1.250 - Major Third) */
  --text-xs: 0.75rem;      /* 12px */
  --text-sm: 0.875rem;     /* 14px */
  --text-base: 1rem;       /* 16px */
  --text-lg: 1.125rem;     /* 18px */
  --text-xl: 1.25rem;      /* 20px */
  --text-2xl: 1.5rem;      /* 24px */
  --text-3xl: 1.875rem;    /* 30px */
  --text-4xl: 2.25rem;     /* 36px */
  --text-5xl: 3rem;        /* 48px */
}
```

### Font Weights

```css
:root {
  --font-normal: 400;
  --font-medium: 500;
  --font-semibold: 600;
  --font-bold: 700;
}
```

### Line Heights

```css
:root {
  --leading-tight: 1.25;
  --leading-snug: 1.375;
  --leading-normal: 1.5;
  --leading-relaxed: 1.625;
  --leading-loose: 2;
}
```

### Typography Usage

| Element | Size | Weight | Line Height | Example |
|---------|------|--------|-------------|---------|
| Page Title | `--text-4xl` | `--font-bold` | `--leading-tight` | "Voice Changer" |
| Section Heading | `--text-2xl` | `--font-semibold` | `--leading-snug` | "Recording Controls" |
| Subsection | `--text-xl` | `--font-semibold` | `--leading-normal` | "Select Effect" |
| Body Text | `--text-base` | `--font-normal` | `--leading-normal` | Educational content |
| Button Text | `--text-lg` | `--font-medium` | `--leading-tight` | "Record" |
| Caption | `--text-sm` | `--font-normal` | `--leading-normal` | Timer, metadata |
| Label | `--text-sm` | `--font-medium` | `--leading-snug` | Form labels |

---

## Spacing System

### Spacing Scale

```css
:root {
  /* Base unit: 4px (0.25rem) */
  --spacing-0: 0;
  --spacing-1: 0.25rem;    /* 4px */
  --spacing-2: 0.5rem;     /* 8px */
  --spacing-3: 0.75rem;    /* 12px */
  --spacing-4: 1rem;       /* 16px */
  --spacing-5: 1.25rem;    /* 20px */
  --spacing-6: 1.5rem;     /* 24px */
  --spacing-8: 2rem;       /* 32px */
  --spacing-10: 2.5rem;    /* 40px */
  --spacing-12: 3rem;      /* 48px */
  --spacing-16: 4rem;      /* 64px */
  --spacing-20: 5rem;      /* 80px */
  --spacing-24: 6rem;      /* 96px */
}
```

### Spacing Guidelines

- **Component padding:** `--spacing-4` to `--spacing-6`
- **Section spacing:** `--spacing-8` to `--spacing-12`
- **Page margins:** `--spacing-6` to `--spacing-8`
- **Element gaps:** `--spacing-2` to `--spacing-4`
- **Button padding:** `--spacing-3` horizontal, `--spacing-6` vertical

---

## Border Radius

```css
:root {
  --radius-none: 0;
  --radius-sm: 0.25rem;    /* 4px */
  --radius-md: 0.5rem;     /* 8px */
  --radius-lg: 0.75rem;    /* 12px */
  --radius-xl: 1rem;       /* 16px */
  --radius-2xl: 1.5rem;    /* 24px */
  --radius-full: 9999px;   /* Circular */
}
```

### Usage
- **Buttons:** `--radius-lg`
- **Cards:** `--radius-xl`
- **Input fields:** `--radius-md`
- **Record button:** `--radius-full` (circular)
- **Tooltips:** `--radius-md`

---

## Shadows

```css
:root {
  /* Elevation system */
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1),
               0 2px 4px -2px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1),
               0 4px 6px -4px rgb(0 0 0 / 0.1);
  --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1),
               0 8px 10px -6px rgb(0 0 0 / 0.1);
  --shadow-2xl: 0 25px 50px -12px rgb(0 0 0 / 0.25);

  /* Special shadows */
  --shadow-inner: inset 0 2px 4px 0 rgb(0 0 0 / 0.05);
  --shadow-recording: 0 0 0 4px rgba(239, 68, 68, 0.2),
                      0 4px 12px rgba(239, 68, 68, 0.3);
}
```

### Usage
- **Cards:** `--shadow-md`
- **Elevated elements:** `--shadow-lg`
- **Modals:** `--shadow-2xl`
- **Buttons (hover):** `--shadow-md`
- **Recording indicator:** `--shadow-recording`
- **Inset elements:** `--shadow-inner`

---

## Components

### Button Styles

#### Primary Button
```css
.btn-primary {
  padding: var(--spacing-3) var(--spacing-6);
  font-size: var(--text-lg);
  font-weight: var(--font-medium);
  color: var(--color-white);
  background-color: var(--color-primary-500);
  border: none;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 120px;
  min-height: 48px;
}

.btn-primary:hover {
  background-color: var(--color-primary-600);
  box-shadow: var(--shadow-md);
  transform: translateY(-1px);
}

.btn-primary:active {
  transform: translateY(0);
  box-shadow: var(--shadow-sm);
}

.btn-primary:focus-visible {
  outline: 2px solid var(--color-primary-500);
  outline-offset: 2px;
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}
```

#### Record Button (Special)
```css
.btn-record {
  width: 80px;
  height: 80px;
  border-radius: var(--radius-full);
  border: none;
  background-color: var(--color-primary-500);
  color: var(--color-white);
  font-size: var(--text-xl);
  font-weight: var(--font-bold);
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: var(--shadow-lg);
  position: relative;
}

.btn-record:hover {
  transform: scale(1.05);
  box-shadow: var(--shadow-xl);
}

.btn-record.recording {
  background-color: var(--color-recording);
  box-shadow: var(--shadow-recording);
  animation: pulse-recording 2s infinite;
}

@keyframes pulse-recording {
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4);
  }
  50% {
    box-shadow: 0 0 0 12px rgba(239, 68, 68, 0);
  }
}

/* Inner circle for stop icon when recording */
.btn-record.recording::after {
  content: '';
  position: absolute;
  width: 24px;
  height: 24px;
  background-color: var(--color-white);
  border-radius: var(--radius-sm);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
```

#### Secondary Button
```css
.btn-secondary {
  padding: var(--spacing-3) var(--spacing-5);
  font-size: var(--text-base);
  font-weight: var(--font-medium);
  color: var(--color-primary-600);
  background-color: var(--color-primary-50);
  border: 1px solid var(--color-primary-200);
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: all 0.2s ease;
  min-height: 44px;
}

.btn-secondary:hover {
  background-color: var(--color-primary-100);
  border-color: var(--color-primary-300);
}
```

#### Icon Button
```css
.btn-icon {
  width: 44px;
  height: 44px;
  padding: var(--spacing-2);
  border: none;
  border-radius: var(--radius-md);
  background-color: transparent;
  color: var(--color-gray-600);
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-icon:hover {
  background-color: var(--color-gray-100);
  color: var(--color-gray-900);
}
```

### Card Component

```css
.card {
  background-color: var(--color-white);
  border-radius: var(--radius-xl);
  padding: var(--spacing-6);
  box-shadow: var(--shadow-md);
  transition: all 0.3s ease;
}

.card:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-2px);
}

/* Effect Card (Selectable) */
.card-effect {
  cursor: pointer;
  border: 2px solid transparent;
  position: relative;
  overflow: hidden;
}

.card-effect::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: var(--effect-color);
  transform: scaleX(0);
  transition: transform 0.3s ease;
}

.card-effect:hover::before {
  transform: scaleX(1);
}

.card-effect.selected {
  border-color: var(--effect-color);
  box-shadow: 0 0 0 3px rgba(var(--effect-color-rgb), 0.1), var(--shadow-lg);
}

.card-effect.selected::before {
  transform: scaleX(1);
}
```

### Input Components

#### Range Slider (Wet/Dry Mix)
```css
.slider {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 8px;
  border-radius: var(--radius-full);
  background: linear-gradient(
    to right,
    var(--color-gray-200) 0%,
    var(--color-gray-200) var(--slider-value),
    var(--color-gray-100) var(--slider-value),
    var(--color-gray-100) 100%
  );
  outline: none;
  cursor: pointer;
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 24px;
  height: 24px;
  border-radius: var(--radius-full);
  background: var(--color-primary-500);
  cursor: pointer;
  box-shadow: var(--shadow-md);
  transition: all 0.2s ease;
}

.slider::-webkit-slider-thumb:hover {
  background: var(--color-primary-600);
  transform: scale(1.1);
  box-shadow: var(--shadow-lg);
}

.slider::-moz-range-thumb {
  width: 24px;
  height: 24px;
  border-radius: var(--radius-full);
  background: var(--color-primary-500);
  cursor: pointer;
  border: none;
  box-shadow: var(--shadow-md);
}
```

### Progress Bar / Timer

```css
.progress-bar {
  width: 100%;
  height: 8px;
  background-color: var(--color-gray-200);
  border-radius: var(--radius-full);
  overflow: hidden;
  position: relative;
}

.progress-bar-fill {
  height: 100%;
  background: linear-gradient(
    90deg,
    var(--color-primary-500) 0%,
    var(--color-secondary-500) 100%
  );
  border-radius: var(--radius-full);
  transition: width 0.3s ease;
}

/* Recording timer specific */
.progress-bar.recording .progress-bar-fill {
  background: var(--color-recording);
  animation: recording-progress 1s infinite;
}

@keyframes recording-progress {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.8; }
}
```

### Level Meter

```css
.level-meter {
  width: 100%;
  height: 24px;
  background-color: var(--color-gray-100);
  border-radius: var(--radius-md);
  overflow: hidden;
  position: relative;
}

.level-meter-fill {
  height: 100%;
  background: linear-gradient(
    90deg,
    var(--color-success) 0%,
    var(--color-success) 70%,
    var(--color-warning) 70%,
    var(--color-warning) 90%,
    var(--color-error) 90%
  );
  transition: width 0.1s ease-out;
  border-radius: var(--radius-md);
}

.level-meter.clipping {
  animation: clip-warning 0.5s infinite;
}

@keyframes clip-warning {
  0%, 100% { box-shadow: inset 0 0 0 2px var(--color-error); }
  50% { box-shadow: inset 0 0 0 2px transparent; }
}
```

### Educational Tooltip

```css
.tooltip {
  position: relative;
  display: inline-block;
}

.tooltip-content {
  visibility: hidden;
  position: absolute;
  z-index: 100;
  bottom: calc(100% + 8px);
  left: 50%;
  transform: translateX(-50%);
  background-color: var(--color-gray-900);
  color: var(--color-white);
  padding: var(--spacing-3) var(--spacing-4);
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
  line-height: var(--leading-relaxed);
  max-width: 280px;
  box-shadow: var(--shadow-xl);
  white-space: normal;
  opacity: 0;
  transition: all 0.2s ease;
}

.tooltip:hover .tooltip-content,
.tooltip:focus-within .tooltip-content {
  visibility: visible;
  opacity: 1;
}

.tooltip-content::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border: 6px solid transparent;
  border-top-color: var(--color-gray-900);
}
```

### Privacy Notice Banner

```css
.privacy-banner {
  position: fixed;
  bottom: var(--spacing-6);
  left: var(--spacing-6);
  right: var(--spacing-6);
  background-color: var(--color-info-light);
  border: 1px solid var(--color-info);
  border-radius: var(--radius-xl);
  padding: var(--spacing-4) var(--spacing-6);
  box-shadow: var(--shadow-xl);
  display: flex;
  align-items: center;
  gap: var(--spacing-4);
  z-index: 1000;
  animation: slide-up 0.3s ease;
}

@keyframes slide-up {
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.privacy-banner-icon {
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  color: var(--color-info);
}

.privacy-banner-content {
  flex: 1;
  font-size: var(--text-base);
  color: var(--color-gray-800);
}

.privacy-banner-dismiss {
  flex-shrink: 0;
}
```

---

## Layout System

### Container

```css
.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--spacing-6);
}

@media (min-width: 768px) {
  .container {
    padding: 0 var(--spacing-8);
  }
}
```

### Grid System

```css
.grid {
  display: grid;
  gap: var(--spacing-6);
}

.grid-2 {
  grid-template-columns: repeat(2, 1fr);
}

.grid-3 {
  grid-template-columns: repeat(3, 1fr);
}

@media (max-width: 768px) {
  .grid-2, .grid-3 {
    grid-template-columns: 1fr;
  }
}
```

### Flexbox Utilities

```css
.flex {
  display: flex;
}

.flex-col {
  flex-direction: column;
}

.items-center {
  align-items: center;
}

.justify-center {
  justify-content: center;
}

.justify-between {
  justify-content: space-between;
}

.gap-2 {
  gap: var(--spacing-2);
}

.gap-4 {
  gap: var(--spacing-4);
}

.gap-6 {
  gap: var(--spacing-6);
}
```

---

## Responsive Breakpoints

```css
/* Mobile-first approach */
:root {
  --breakpoint-sm: 640px;   /* Small devices */
  --breakpoint-md: 768px;   /* Tablets */
  --breakpoint-lg: 1024px;  /* Laptops */
  --breakpoint-xl: 1280px;  /* Desktops */
}
```

### Media Query Usage

```css
/* Mobile (default, <640px) */

/* Tablet and up */
@media (min-width: 640px) {
  /* Styles for tablets and larger */
}

/* Laptop and up */
@media (min-width: 1024px) {
  /* Styles for laptops and larger */
}
```

---

## Accessibility Features

### Focus Styles

```css
:focus-visible {
  outline: 2px solid var(--color-primary-500);
  outline-offset: 2px;
  border-radius: var(--radius-sm);
}

/* Remove default outline */
:focus:not(:focus-visible) {
  outline: none;
}
```

### Skip Links

```css
.skip-link {
  position: absolute;
  top: -100px;
  left: var(--spacing-4);
  background: var(--color-primary-500);
  color: var(--color-white);
  padding: var(--spacing-2) var(--spacing-4);
  border-radius: var(--radius-md);
  text-decoration: none;
  z-index: 9999;
}

.skip-link:focus {
  top: var(--spacing-4);
}
```

### Screen Reader Only

```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
```

### High Contrast Mode Support

```css
@media (prefers-contrast: high) {
  :root {
    --color-primary-500: #0056b3;
    /* Increase contrast for other colors */
  }

  .btn-primary {
    border: 2px solid var(--color-primary-700);
  }
}
```

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Dark Mode (Future Enhancement)

```css
@media (prefers-color-scheme: dark) {
  :root {
    --color-bg: var(--color-gray-900);
    --color-text: var(--color-gray-100);
    /* ... other dark mode colors */
  }
}

/* Manual dark mode class */
[data-theme="dark"] {
  --color-bg: var(--color-gray-900);
  --color-text: var(--color-gray-100);
}
```

---

## Animation Principles

### Timing Functions

```css
:root {
  --ease-in: cubic-bezier(0.4, 0, 1, 1);
  --ease-out: cubic-bezier(0, 0, 0.2, 1);
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
}
```

### Duration Standards

- **Micro-interactions:** 100-200ms (hover, focus)
- **UI changes:** 200-300ms (panel open/close)
- **Page transitions:** 300-500ms (route changes)
- **Decorative:** 500ms+ (celebration animations)

---

## Icons

**Recommendation:** Use inline SVG icons for:
- No external requests
- Easy styling with CSS
- Accessible with `<title>` tags

**Icon Sources:**
- [Heroicons](https://heroicons.com/) (recommended)
- [Lucide Icons](https://lucide.dev/)
- Custom SVG icons

**Icon Sizing:**
```css
.icon-sm { width: 16px; height: 16px; }
.icon-md { width: 24px; height: 24px; }
.icon-lg { width: 32px; height: 32px; }
.icon-xl { width: 48px; height: 48px; }
```

---

## Implementation Checklist

- [ ] Create `src/styles/global.css` with CSS variables
- [ ] Create `src/styles/components.css` with component styles
- [ ] Create `src/styles/utilities.css` with utility classes
- [ ] Test all color combinations for WCAG AA contrast
- [ ] Test responsive breakpoints on real devices
- [ ] Verify touch targets are minimum 44x44px
- [ ] Test keyboard navigation
- [ ] Test with screen reader
- [ ] Verify reduced motion preferences
- [ ] Document custom CSS properties in code comments

---

## Design Resources

### Figma/Sketch File (Future)
- Create mockups for each page state
- Component library
- Responsive layouts

### Style Guide Page (Recommended)
Build a living style guide at `/styleguide` route showing:
- All colors with hex values
- Typography scale
- All button variants
- Form elements
- Cards and components
- Icon library
- Spacing examples

---

## Questions or Feedback?

For design system questions:
1. Open GitHub issue with `design` label
2. Include screenshots if applicable
3. Reference WCAG guidelines for accessibility questions
