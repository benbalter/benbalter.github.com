/**
 * Stub module for vitest — satisfies Vite's import resolver for the
 * astro:content virtual module so that tests can use vi.mock('astro:content')
 * to provide their own mock behavior.
 *
 * Tests should always call vi.mock('astro:content', () => ...) to override these stubs.
 */

export const getCollection = () => Promise.resolve([]);
export const getEntry = () => Promise.resolve(null);
export const render = () => Promise.resolve({ Content: null });
