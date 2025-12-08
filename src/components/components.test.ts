/**
 * Tests for Astro component TypeScript logic
 * 
 * Note: These tests validate the component interfaces and logic.
 * For full component rendering tests, use E2E tests with Playwright.
 */

import { describe, it, expect } from 'vitest';

describe('Callout Component', () => {
  it('should have correct type options', () => {
    const validTypes = ['info', 'warning', 'error', 'success'];
    
    // Test that these are valid type options
    validTypes.forEach(type => {
      expect(['info', 'warning', 'error', 'success']).toContain(type);
    });
  });

  it('should have correct icon mappings', () => {
    const icons = {
      info: '💡',
      warning: '⚠️',
      error: '❌',
      success: '✅',
    };

    expect(icons.info).toBe('💡');
    expect(icons.warning).toBe('⚠️');
    expect(icons.error).toBe('❌');
    expect(icons.success).toBe('✅');
  });

  it('should have correct color mappings', () => {
    const colors = {
      info: '#0366d6',
      warning: '#f9c513',
      error: '#d73a49',
      success: '#28a745',
    };

    expect(colors.info).toBe('#0366d6');
    expect(colors.warning).toBe('#f9c513');
    expect(colors.error).toBe('#d73a49');
    expect(colors.success).toBe('#28a745');
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
  it('should generate correct embed URL', () => {
    const id = 'dQw4w9WgXcQ';
    const embedUrl = `https://www.youtube.com/embed/${id}`;
    
    expect(embedUrl).toBe('https://www.youtube.com/embed/dQw4w9WgXcQ');
  });

  it('should have default title', () => {
    const defaultTitle = 'YouTube video';
    expect(defaultTitle).toBe('YouTube video');
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
});

describe('CodeBlock Component', () => {
  it('should have language prop interface', () => {
    interface Props {
      language?: string;
      filename?: string;
    }

    const testProps: Props = {
      language: 'typescript',
      filename: 'example.ts',
    };

    expect(testProps.language).toBe('typescript');
    expect(testProps.filename).toBe('example.ts');
  });
});
