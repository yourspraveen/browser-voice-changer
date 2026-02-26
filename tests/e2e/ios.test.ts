import { test, expect } from '@playwright/test'

test.describe('iOS – page load', () => {
  test('loads without errors and shows main UI', async ({ page }) => {
    const errors: string[] = []
    page.on('pageerror', (e) => errors.push(e.message))

    await page.goto('')
    await page.waitForLoadState('networkidle')

    // No JS crashes
    expect(errors).toHaveLength(0)

    // Core sections visible
    await expect(page.getByRole('heading', { name: /record your voice/i })).toBeVisible()
    await expect(page.getByRole('heading', { name: /choose an effect/i })).toBeVisible()
  })

  test('shows Record button and correct initial state', async ({ page }) => {
    await page.goto('')
    await page.waitForLoadState('networkidle')

    const recordBtn = page.getByTestId('record-button')
    await expect(recordBtn).toBeVisible()
    await expect(recordBtn).toBeEnabled()
  })

  test('language switcher changes UI to Spanish', async ({ page }) => {
    await page.goto('')
    await page.waitForLoadState('networkidle')

    await page.selectOption('select[aria-label="Select language"]', 'es')

    await expect(page.getByRole('heading', { name: /graba tu voz/i })).toBeVisible()
    await expect(page.getByRole('heading', { name: /elige un efecto/i })).toBeVisible()
  })

  test('language switcher changes back to English', async ({ page }) => {
    await page.goto('')
    await page.waitForLoadState('networkidle')

    await page.selectOption('select[aria-label="Select language"]', 'es')
    await page.selectOption('select[aria-label="Select language"]', 'en')

    await expect(page.getByRole('heading', { name: /record your voice/i })).toBeVisible()
  })
})

test.describe('iOS – demo samples', () => {
  test('expands demo samples panel', async ({ page }) => {
    await page.goto('')
    await page.waitForLoadState('networkidle')

    await page.getByRole('button', { name: /try a demo sample/i }).click()
    await expect(page.getByText(/demo voice.*samantha/i)).toBeVisible()
    await expect(page.getByText(/british voice.*daniel/i)).toBeVisible()
    await expect(page.getByText(/irish voice.*moira/i)).toBeVisible()
  })

  test('loads a demo sample and enables effects', async ({ page }) => {
    await page.goto('')
    await page.waitForLoadState('networkidle')

    await page.getByRole('button', { name: /try a demo sample/i }).click()

    // Click first sample — waits for audio to decode
    await page.getByRole('button', { name: /load demo voice.*samantha/i }).click()
    await page.waitForTimeout(3000) // allow decodeAudioData

    // Effects should now be enabled
    await expect(page.getByTestId('chipmunk-effect')).toBeEnabled()
    await expect(page.getByTestId('robot-effect')).toBeEnabled()
  })
})

test.describe('iOS – effect selector', () => {
  test('effect cards are disabled before loading audio', async ({ page }) => {
    await page.goto('')
    await page.waitForLoadState('networkidle')

    await expect(page.getByTestId('chipmunk-effect')).toBeDisabled()
    await expect(page.getByTestId('deepVoice-effect')).toBeDisabled()
  })

  test('hint text is shown when no audio loaded', async ({ page }) => {
    await page.goto('')
    await page.waitForLoadState('networkidle')

    await expect(page.getByText(/record your voice or load a sample/i)).toBeVisible()
  })
})

test.describe('iOS – footer', () => {
  test('shows author and GitHub links', async ({ page }) => {
    await page.goto('')
    await page.waitForLoadState('networkidle')

    const authorLink = page.getByRole('link', { name: 'yourspraveen.com' })
    const githubLink = page.getByRole('link', { name: /view on github/i })

    await expect(authorLink).toBeVisible()
    await expect(githubLink).toBeVisible()
    await expect(authorLink).toHaveAttribute('href', 'https://www.yourspraveen.com')
    await expect(githubLink).toHaveAttribute('href', 'https://github.com/yourspraveen/browser-voice-changer')
  })
})

test.describe('iOS – privacy notice', () => {
  test('privacy notice is dismissible', async ({ page }) => {
    // Clear localStorage so notice shows
    await page.goto('')
    await page.evaluate(() => localStorage.removeItem('privacyNoticeDismissed'))
    await page.reload()
    await page.waitForLoadState('networkidle')

    const banner = page.getByRole('banner', { name: /privacy notice/i })
    await expect(banner).toBeVisible()

    await page.getByRole('button', { name: /dismiss privacy notice/i }).click()
    await expect(banner).not.toBeVisible()
  })
})
