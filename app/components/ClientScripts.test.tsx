import { render } from '@testing-library/react';
import ClientScripts from './ClientScripts';

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(() => '/'),
}));

// Mock FontAwesome
jest.mock('@fortawesome/fontawesome-svg-core', () => ({
  config: { mutateApproach: 'sync' },
  library: { add: jest.fn() },
  dom: { watch: jest.fn() },
}));

// Mock all FontAwesome icon imports
jest.mock('@fortawesome/free-solid-svg-icons/faRss', () => ({ faRss: {} }));
jest.mock('@fortawesome/free-solid-svg-icons/faRetweet', () => ({ faRetweet: {} }));
jest.mock('@fortawesome/free-brands-svg-icons/faTwitter', () => ({ faTwitter: {} }));
jest.mock('@fortawesome/free-brands-svg-icons/faLinkedin', () => ({ faLinkedin: {} }));
jest.mock('@fortawesome/free-brands-svg-icons/faGithub', () => ({ faGithub: {} }));
jest.mock('@fortawesome/free-solid-svg-icons/faEnvelope', () => ({ faEnvelope: {} }));
jest.mock('@fortawesome/free-solid-svg-icons/faAddressCard', () => ({ faAddressCard: {} }));
jest.mock('@fortawesome/free-brands-svg-icons/faBluesky', () => ({ faBluesky: {} }));
jest.mock('@fortawesome/free-regular-svg-icons/faClock', () => ({ faClock: {} }));
jest.mock('@fortawesome/free-regular-svg-icons/faHeart', () => ({ faHeart: {} }));

// Mock dynamic imports
jest.mock('anchor-js', () => ({
  default: jest.fn().mockImplementation(() => ({
    add: jest.fn(),
  })),
}));

jest.mock('bootstrap', () => ({
  Tooltip: jest.fn(),
}));

describe('ClientScripts', () => {
  it('should render without crashing', () => {
    const { container } = render(<ClientScripts />);
    // ClientScripts returns null, so container should be empty
    expect(container.firstChild).toBeNull();
  });

  it('should not render any visible content', () => {
    const { container } = render(<ClientScripts />);
    expect(container.innerHTML).toBe('');
  });
});
