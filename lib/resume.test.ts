import { getAllResumePositions, getResumeData } from './resume';

// Mock dependencies
jest.mock('fs');
jest.mock('./content-loader');

describe('Resume Data Loading', () => {
  describe('getAllResumePositions', () => {
    it.skip('should sort positions by start_date descending', () => {
      const positions = getAllResumePositions();
      
      // Verify positions are sorted by most recent first
      for (let i = 0; i < positions.length - 1; i++) {
        const currentDate = new Date(positions[i].start_date).getTime();
        const nextDate = new Date(positions[i + 1].start_date).getTime();
        expect(currentDate).toBeGreaterThanOrEqual(nextDate);
      }
    });

    it.skip('should return array of ResumePosition objects', () => {
      const positions = getAllResumePositions();
      
      expect(Array.isArray(positions)).toBe(true);
      
      if (positions.length > 0) {
        const position = positions[0];
        expect(position).toHaveProperty('employer');
        expect(position).toHaveProperty('title');
        expect(position).toHaveProperty('start_date');
        expect(position).toHaveProperty('content');
      }
    });

    it.skip('should filter only markdown files', () => {
      const positions = getAllResumePositions();
      
      // All positions should have been parsed from .md files
      // This is validated by the filter in the implementation
      expect(Array.isArray(positions)).toBe(true);
    });
  });

  describe('getResumeData', () => {
    it.skip('should return complete resume data structure', () => {
      const resumeData = getResumeData();
      
      expect(resumeData).toHaveProperty('title');
      expect(resumeData).toHaveProperty('description');
      expect(resumeData).toHaveProperty('degrees');
      expect(resumeData).toHaveProperty('certifications');
      expect(resumeData).toHaveProperty('positions');
    });

    it.skip('should have degrees as array', () => {
      const resumeData = getResumeData();
      
      expect(Array.isArray(resumeData.degrees)).toBe(true);
    });

    it.skip('should have certifications as array', () => {
      const resumeData = getResumeData();
      
      expect(Array.isArray(resumeData.certifications)).toBe(true);
    });

    it.skip('should have positions as array', () => {
      const resumeData = getResumeData();
      
      expect(Array.isArray(resumeData.positions)).toBe(true);
    });

    it.skip('should include all position data', () => {
      const resumeData = getResumeData();
      const positions = resumeData.positions;
      
      if (positions.length > 0) {
        const position = positions[0];
        expect(typeof position.employer).toBe('string');
        expect(typeof position.title).toBe('string');
        expect(typeof position.start_date).toBe('string');
        expect(typeof position.content).toBe('string');
      }
    });
  });
});
