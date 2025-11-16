import { getGitHubAvatarUrlSync } from './avatar';

// Mock the Octokit module since we don't use it in the sync function
jest.mock('@octokit/rest', () => ({
  Octokit: jest.fn(),
}));

describe('GitHub Avatar', () => {
  describe('getGitHubAvatarUrlSync', () => {
    it('should generate correct avatar URL', () => {
      expect(getGitHubAvatarUrlSync('benbalter')).toBe('https://avatars.githubusercontent.com/benbalter?s=40');
    });

    it('should handle custom size', () => {
      expect(getGitHubAvatarUrlSync('benbalter', 80)).toBe('https://avatars.githubusercontent.com/benbalter?s=80');
      expect(getGitHubAvatarUrlSync('octocat', 120)).toBe('https://avatars.githubusercontent.com/octocat?s=120');
    });

    it('should use default size when not specified', () => {
      expect(getGitHubAvatarUrlSync('testuser')).toBe('https://avatars.githubusercontent.com/testuser?s=40');
    });

    it('should handle different usernames', () => {
      expect(getGitHubAvatarUrlSync('alice')).toBe('https://avatars.githubusercontent.com/alice?s=40');
      expect(getGitHubAvatarUrlSync('user-name')).toBe('https://avatars.githubusercontent.com/user-name?s=40');
    });
  });
});
