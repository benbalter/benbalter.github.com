import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  resolve: {
    alias: {
      // Map astro:content virtual module to a stub so Vite can resolve it
      // during import analysis. Tests then use vi.mock() to override behavior.
      'astro:content': fileURLToPath(
        new URL('./src/__mocks__/astro-content.ts', import.meta.url),
      ),
    },
  },
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
        'src/__mocks__/**',      // Test stubs for virtual modules
      ],
    },
    
    // Test timeout (for slower tests)
    testTimeout: 10000,
    
    // Globals (for describe, it, expect without imports)
    globals: true,
  },
});
