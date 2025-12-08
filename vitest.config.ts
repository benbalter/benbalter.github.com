import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Use happy-dom for DOM simulation (faster than jsdom)
    environment: 'happy-dom',
    
    // Include test files
    include: ['src/**/*.{test,spec}.{js,ts,jsx,tsx}'],
    
    // Exclude patterns
    exclude: [
      'node_modules',
      'dist-astro',
      'e2e',
      'spec',
    ],
    
    // Coverage configuration
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/**/*.{test,spec}.{ts,tsx}',
        'src/**/*.d.ts',
        'src/**/*.astro',
        'src/content/config.ts', // Content collections schema (no logic to test)
      ],
    },
    
    // Test timeout (for slower tests)
    testTimeout: 10000,
    
    // Globals (for describe, it, expect without imports)
    globals: true,
  },
});
