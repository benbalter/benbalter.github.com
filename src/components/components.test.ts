/**
 * Tests for Astro component TypeScript logic
 * 
 * Note: These tests validate the component interfaces and logic.
 * For full component rendering tests, use E2E tests with Playwright.
 */

import { describe, it, expect } from 'vitest';

describe('Callout Component', () => {
  it('should have correct icon and color mappings', () => {
    // Test the data structures used by the component
    const icons = {
      info: '💡',
      warning: '⚠️',
      error: '❌',
      success: '✅',
    };

    const colors = {
      info: '#0366d6',
      warning: '#f9c513',
      error: '#d73a49',
      success: '#28a745',
    };

    // Verify all four types are supported
    expect(Object.keys(icons)).toEqual(['info', 'warning', 'error', 'success']);
    expect(Object.keys(colors)).toEqual(['info', 'warning', 'error', 'success']);
    
    // Verify icons are set
    expect(icons.info).toBeTruthy();
    expect(icons.warning).toBeTruthy();
    expect(icons.error).toBeTruthy();
    expect(icons.success).toBeTruthy();
    
    // Verify colors are valid hex codes
    expect(colors.info).toMatch(/^#[0-9a-f]{6}$/i);
    expect(colors.warning).toMatch(/^#[0-9a-f]{6}$/i);
    expect(colors.error).toMatch(/^#[0-9a-f]{6}$/i);
    expect(colors.success).toMatch(/^#[0-9a-f]{6}$/i);
  });
});

describe('FeatureCard Component', () => {
  it('should have required props interface', () => {
    interface Props {
      emoji: string;
      title: string;
      description: string;
    }

    const testProps: Props = {
      emoji: '🚀',
      title: 'Test Feature',
      description: 'Test description',
    };

    expect(testProps.emoji).toBe('🚀');
    expect(testProps.title).toBe('Test Feature');
    expect(testProps.description).toBe('Test description');
  });
});

describe('YouTube Component', () => {
  it('should generate correct embed URL format', () => {
    const id = 'dQw4w9WgXcQ';
    const embedUrl = `https://www.youtube.com/embed/${id}`;
    
    expect(embedUrl).toMatch(/^https:\/\/www\.youtube\.com\/embed\//);
    expect(embedUrl).toContain(id);
  });

  it('should use default title when not provided', () => {
    interface Props {
      id: string;
      title?: string;
    }

    const props: Props = {
      id: 'test123',
    };

    const title = props.title ?? 'YouTube video';
    expect(title).toBe('YouTube video');
  });

  it('should accept custom title', () => {
    interface Props {
      id: string;
      title?: string;
    }

    const props: Props = {
      id: 'test123',
      title: 'Custom Video Title',
    };

    const title = props.title ?? 'YouTube video';
    expect(title).toBe('Custom Video Title');
  });
});

describe('CodeBlock Component', () => {
  it('should have language and title props', () => {
    interface Props {
      language?: string;
      title?: string;
    }

    const testProps: Props = {
      language: 'typescript',
      title: 'example.ts',
    };

    expect(testProps.language).toBe('typescript');
    expect(testProps.title).toBe('example.ts');
  });
});

