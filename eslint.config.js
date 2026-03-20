import json from '@eslint/json';

export default [
  {
    ignores: [
      'node_modules/',
      'vendor/',
      '_site/',
      '.next/',
      'out/',
      'e2e/',
      'playwright.config.ts',
      'playwright-report/',
      'test-results/',
      'package-lock.json',
    ],
  },
  {
    files: ['**/*.json'],
    plugins: { json },
    language: 'json/json',
    ...json.configs.recommended,
  },
];
