import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  use: {
    baseURL: 'http://localhost:4321/profile/',
    browserName: 'chromium',
  },
  webServer: {
    command: 'npm run preview -- --port 4321',
    url: 'http://localhost:4321/profile/',
    reuseExistingServer: !process.env.CI,
  },
});
