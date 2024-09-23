import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig(async () => {
  const sass = await import('sass'); // Dynamically import Dart Sass

  return {
    plugins: [vue()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    css: {
      preprocessorOptions: {
        scss: {
          implementation: sass.default,
          api: 'modern'
        }
      }
    },
    test: {
      globals: true,
      environment: 'jsdom'
    }
  };
});
