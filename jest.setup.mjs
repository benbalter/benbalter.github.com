// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Mock github-slugger to avoid ES module issues in Jest
jest.mock('github-slugger', () => ({
  slug: (text) => {
    if (typeof text !== 'string') return '';
    return text
      .trim()
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  },
}));
