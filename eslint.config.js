import json from '@eslint/json';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  // Global ignores
  {
    ignores: [
      'node_modules/',
      'dist-astro/',
      '.astro/',
      'e2e/',
      'vendor/',
      '_site/',
      '.next/',
      'out/',
      'playwright.config.ts',
      'playwright-report/',
      'test-results/',
      'package-lock.json',
    ],
  },
  // JavaScript config files at root (replaces xo with space: true)
  {
    files: ['*.js', '*.mjs', '.remarkrc.js'],
    extends: tseslint.configs.recommended,
    rules: {
      indent: ['error', 2],
      semi: ['error', 'always'],
      quotes: ['error', 'single', {avoidEscape: true}],
      '@typescript-eslint/no-unused-vars': ['error', {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
      }],
    },
  },
  // JSON files
  {
    files: ['**/*.json'],
    plugins: {json},
    language: 'json/json',
    ...json.configs.recommended,
  },
);
