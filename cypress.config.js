import { defineConfig } from 'cypress';

export default defineConfig({
  video: false,
  screenshotOnRunFailure: false,
  e2e: {
    supportFile: false,
    specPattern: '**/tests/e2e/*.ts',
    baseUrl: 'http://localhost:5173'
  }
});
