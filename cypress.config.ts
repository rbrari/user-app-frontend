import { defineConfig } from 'cypress';

export default defineConfig({
  video: false,
  screenshotOnRunFailure: false,
  e2e: {
    supportFile: false,
    specPattern: '**/tests/e2e/*.ts',
    baseUrl: 'http://localhost:5173'
  },
  component: {
    devServer: {
      framework: 'vue',
      bundler: 'vite',
      viteConfig: {
        optimizeDeps: {
          include: ['pinia', 'vue']
        }
      }
    }
  }
});
