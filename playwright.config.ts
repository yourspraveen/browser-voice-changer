import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 30000,
  retries: 1,
  reporter: 'list',
  use: {
    baseURL: 'https://yourspraveen.github.io/browser-voice-changer/',
    headless: true,
  },
  projects: [
    {
      name: 'iPhone 15',
      use: { ...devices['iPhone 15'] },
    },
    {
      name: 'iPhone 15 Safari',
      use: { ...devices['iPhone 15'], channel: undefined },
    },
    {
      name: 'iPad',
      use: { ...devices['iPad Pro 11'] },
    },
  ],
})
