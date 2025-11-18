import { slugify } from './strings';

describe('slugify', () => {
  it('converts text to lowercase', () => {
    expect(slugify('UPPERCASE TEXT')).toBe('uppercase-text');
  });

  it('replaces spaces with hyphens', () => {
    expect(slugify('multiple word phrase')).toBe('multiple-word-phrase');
  });

  it('removes special characters', () => {
    expect(slugify('Category & Name!')).toBe('category-name');
    expect(slugify('test@#$%^&*()test')).toBe('testtest');
  });

  it('replaces multiple spaces with single hyphen', () => {
    expect(slugify('multiple   spaces')).toBe('multiple-spaces');
  });

  it('replaces multiple hyphens with single hyphen', () => {
    expect(slugify('multiple---hyphens')).toBe('multiple-hyphens');
  });

  it('trims leading and trailing whitespace', () => {
    expect(slugify('  leading and trailing  ')).toBe('leading-and-trailing');
  });

  it('handles empty string', () => {
    expect(slugify('')).toBe('');
  });

  it('handles real-world category names', () => {
    expect(slugify('IT Management and Leadership')).toBe('it-management-and-leadership');
    expect(slugify('Career and corporate life')).toBe('career-and-corporate-life');
    expect(slugify('Open source')).toBe('open-source');
    expect(slugify('Startups and innovation')).toBe('startups-and-innovation');
    expect(slugify('Information security')).toBe('information-security');
    expect(slugify('Product management')).toBe('product-management');
    expect(slugify('Marketing')).toBe('marketing');
    expect(slugify('Technology policy')).toBe('technology-policy');
    expect(slugify('Government and organizing')).toBe('government-and-organizing');
    expect(slugify('Everything else')).toBe('everything-else');
  });

  it('preserves existing hyphens', () => {
    expect(slugify('pre-existing-hyphens')).toBe('pre-existing-hyphens');
  });

  it('handles underscores', () => {
    expect(slugify('with_underscores')).toBe('with_underscores');
  });
});
