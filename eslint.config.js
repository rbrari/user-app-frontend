import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import pluginVue from 'eslint-plugin-vue';
// import prettierConfig from 'eslint-config-prettier';
// import prettierPlugin from 'eslint-plugin-prettier';

export default [
  {
    files: ['**/*.{js,mjs,cjs,ts,vue}']
  },
  {
    ignores: ['node_modules/**', 'dist/**', 'build/**', '**/*.d.ts']
  },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  ...pluginVue.configs['flat/essential'],
  // prettierConfig,
  // prettierPlugin,
  {
    files: ['**/*.vue'],
    languageOptions: { parserOptions: { parser: tseslint.parser } }
  },
  {
    rules: {
      // 'prettier/prettier': 'error',
      'no-console': 'off',
      'vue/multi-word-component-names': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      'vue/component-tags-order': [
        'error',
        {
          order: ['script', 'template', 'style']
        }
      ]
    }
  }
  // {
  //   files: ['**/tests/e2e/*.ts'],
  //   extends: ['plugin:cypress/recommended'],
  //   rules: {
  //     // Add any Cypress-specific rule overrides here, if needed
  //   }
  // }
];
