import nextJest from 'next/jest.js';

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
});

// Add any custom config to be passed to Jest
/** @type {import('jest').Config} */
const config = {
  // Add more setup options before each test is run
  setupFilesAfterEnv: ['<rootDir>/jest.setup.mjs'],
  testEnvironment: 'jest-environment-jsdom',
  
  // Test match patterns
  testMatch: [
    '**/__tests__/**/*.[jt]s?(x)',
    '**/?(*.)+(spec|test).[jt]s?(x)',
  ],
  
  // Exclude Playwright tests and old Node test runner tests
  testPathIgnorePatterns: [
    '/node_modules/',
    '/e2e/',
    '/.next/',
    '/out/',
    '/script/build-related-posts.test.ts',
    '/lib/plugins.test.ts',
  ],
  
  // Transform ES modules from node_modules
  transformIgnorePatterns: [
    'node_modules/(?!(@octokit|react-markdown|remark-gfm|remark-github|rehype-raw|rehype-sanitize|unified|unist-util-visit|unist-util-is|vfile|micromark|mdast-util|decode-named-character-reference|character-entities|hast-util|property-information|space-separated-tokens|comma-separated-tokens|bail|trough|devlop)/)',
  ],
  
  // Module name mapper for CSS and static files
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  
  // Coverage configuration
  collectCoverageFrom: [
    'app/**/*.{js,jsx,ts,tsx}',
    'lib/**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/.next/**',
    '!**/out/**',
    '!**/coverage/**',
  ],
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
export default createJestConfig(config);
