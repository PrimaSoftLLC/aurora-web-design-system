import { defineConfig } from '@playwright/test';
export default defineConfig({ testDir: './tests/browser', workers: 1, timeout: 120000,
  outputDir: '.tmp/browser-results', reporter: 'list', use: { browserName: 'chromium', headless: true } });
