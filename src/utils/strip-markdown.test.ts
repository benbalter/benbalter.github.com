/**
 * Tests for strip-markdown utility
 */

import { describe, it, expect } from 'vitest';
import { stripMarkdown } from './strip-markdown';

describe('stripMarkdown', () => {
  describe('basic functionality', () => {
    it('should return empty string for null or undefined', () => {
      expect(stripMarkdown(null as any)).toBe('');
      expect(stripMarkdown(undefined as any)).toBe('');
    });

    it('should return empty string for empty input', () => {
      expect(stripMarkdown('')).toBe('');
    });

    it('should return plain text unchanged', () => {
      expect(stripMarkdown('Hello world')).toBe('Hello world');
    });
  });

  describe('markdown links', () => {
    it('should strip simple markdown links', () => {
      expect(stripMarkdown('[link text](http://example.com)')).toBe('link text');
    });

    it('should strip multiple markdown links', () => {
      const input = 'Check out [link one](http://example.com) and [link two](http://example.org)';
      const expected = 'Check out link one and link two';
      expect(stripMarkdown(input)).toBe(expected);
    });

    it('should strip markdown links with fragment identifiers', () => {
      expect(stripMarkdown('[professional, but not formal](#1-professional-but-not-formal)')).toBe('professional, but not formal');
    });

    it('should handle complex text with multiple markdown links', () => {
      const input = 'Specifically, [just a heads up](#just-a-heads-up), [sanity check](#sanity-check), and [early feedback](#early-feedback).';
      const expected = 'Specifically, just a heads up, sanity check, and early feedback.';
      expect(stripMarkdown(input)).toBe(expected);
    });
  });

  describe('bold text', () => {
    it('should strip bold text with double asterisks', () => {
      expect(stripMarkdown('This is **bold** text')).toBe('This is bold text');
    });

    it('should strip bold text with double underscores', () => {
      expect(stripMarkdown('This is __bold__ text')).toBe('This is bold text');
    });
  });

  describe('italic text', () => {
    it('should strip italic text with single asterisks', () => {
      expect(stripMarkdown('This is *italic* text')).toBe('This is italic text');
    });

    it('should strip italic text with single underscores', () => {
      expect(stripMarkdown('This is _italic_ text')).toBe('This is italic text');
    });

    it('should not break underscores in middle of words', () => {
      expect(stripMarkdown('snake_case_variable')).toBe('snake_case_variable');
    });
  });

  describe('inline code', () => {
    it('should strip inline code backticks', () => {
      expect(stripMarkdown('Use the `@mentions` feature')).toBe('Use the @mentions feature');
    });

    it('should handle multiple inline code sections', () => {
      expect(stripMarkdown('Use `git` and `npm` commands')).toBe('Use git and npm commands');
    });
  });

  describe('HTML tags', () => {
    it('should strip HTML tags', () => {
      expect(stripMarkdown('This is <strong>bold</strong> text')).toBe('This is bold text');
    });

    it('should strip self-closing HTML tags', () => {
      expect(stripMarkdown('Line break<br/>here')).toBe('Line break here');
    });
  });

  describe('combined formatting', () => {
    it('should strip multiple types of markdown formatting', () => {
      const input = 'Check out [this **bold** link](http://example.com) and use `code` here';
      const expected = 'Check out this bold link and use code here';
      expect(stripMarkdown(input)).toBe(expected);
    });

    it('should handle real-world description from post', () => {
      const input = 'GitHub has a unique work culture. Here are seven traits that I\'ve observed in successful GitHubbers over the years that I think make GitHubbers more effective. Specifically, [professional, but not formal](#1-professional-but-not-formal); [ship early, ship often](#2-ship-early-ship-often); [if you see something, say something](#3-if-you-see-something-say-something); [curiosity and self-improvement](#4-curiosity-and-self-improvement); [always be willing to help](#5-always-be-willing-to-help-but-know-when-to-say-no); [contribute to the appreciation economy](#6-contribute-to-the-appreciation-economy); and [honesty, integrity, and authenticity](#7-honesty-integrity-and-authenticity).';
      const expected = 'GitHub has a unique work culture. Here are seven traits that I\'ve observed in successful GitHubbers over the years that I think make GitHubbers more effective. Specifically, professional, but not formal; ship early, ship often; if you see something, say something; curiosity and self-improvement; always be willing to help; contribute to the appreciation economy; and honesty, integrity, and authenticity.';
      expect(stripMarkdown(input)).toBe(expected);
    });

    it('should handle description with inline code and links', () => {
      const input = 'I use web notifications for everything but `@mentions`, which I have pushed to me via email. I subscribe to lots of repositories to ensure I don\'t miss anything, but unsubscribe from any thread not immediately relevant to me to keep noise to a minimum. I also have a few tools I\'ve built to customize GitHub notifications for [the way I work](http://ben.balter.com/2020/08/14/tools-of-the-trade/).';
      const expected = 'I use web notifications for everything but @mentions, which I have pushed to me via email. I subscribe to lots of repositories to ensure I don\'t miss anything, but unsubscribe from any thread not immediately relevant to me to keep noise to a minimum. I also have a few tools I\'ve built to customize GitHub notifications for the way I work.';
      expect(stripMarkdown(input)).toBe(expected);
    });
  });

  describe('whitespace handling', () => {
    it('should normalize multiple spaces', () => {
      expect(stripMarkdown('Too    many    spaces')).toBe('Too many spaces');
    });

    it('should trim leading and trailing whitespace', () => {
      expect(stripMarkdown('  text with spaces  ')).toBe('text with spaces');
    });
  });
});
