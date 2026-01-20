import json from 'eslint-plugin-json';

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
    ],
  },
  {
    files: ['**/*.json'],
    ...json.configs['recommended'],
  },
];
