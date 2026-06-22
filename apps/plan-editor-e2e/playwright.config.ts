import { defineConfig, devices } from '@playwright/test';

const PORT = Number(process.env['PLAN_EDITOR_PORT'] ?? 4320);
const baseURL = `http://localhost:${PORT}`;

// A single thin smoke test — this is a coding-principles course, not an E2E one.
export default defineConfig({
  testDir: './src',
  fullyParallel: true,
  forbidOnly: !!process.env['CI'],
  retries: process.env['CI'] ? 2 : 0,
  reporter: 'list',
  use: {
    baseURL,
    trace: 'on-first-retry',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: `npx next dev apps/plan-editor --port=${PORT}`,
    cwd: '../..',
    url: baseURL,
    reuseExistingServer: !process.env['CI'],
    timeout: 120_000,
  },
});
