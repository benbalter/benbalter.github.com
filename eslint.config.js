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
      'playwright.config.ts',
      'playwright-report/',
      'test-results/',
      'package-lock.json',
    ],
  },
  // Root config files (replaces xo with space: true)
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
  // Site source, build scripts, and the Worker: correctness rules only, no
  // formatting rules, so this doesn't churn existing code style.
  {
    files: ['src/**/*.ts', 'script/**/*.{ts,mjs,js}', 'worker/**/*.js'],
    extends: tseslint.configs.recommended,
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
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
  // JSONC files (JSON with comments) — editor/tooling configs
  {
    files: ['.vscode/**/*.json', '.devcontainer/**/*.json'],
    plugins: {json},
    language: 'json/jsonc',
    ...json.configs.recommended,
  },
);
