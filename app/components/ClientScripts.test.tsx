import { render } from '@testing-library/react';
import ClientScripts from './ClientScripts';

// Mock dynamic imports
jest.mock('bootstrap', () => ({
  Tooltip: jest.fn(),
}), { virtual: true });

describe('ClientScripts', () => {
  it('should render without crashing', () => {
    const { container } = render(<ClientScripts />);
    expect(container).toBeInTheDocument();
  });

  it('should not render any visible content', () => {
    const { container } = render(<ClientScripts />);
    expect(container.firstChild).toBeNull();
  });

  it('should initialize Bootstrap tooltips on mount', async () => {
    // Add some tooltip elements to the DOM
    document.body.innerHTML = `
      <button data-bs-toggle="tooltip" title="Test tooltip 1">Button 1</button>
      <button data-bs-toggle="tooltip" title="Test tooltip 2">Button 2</button>
    `;

    const bootstrap = await import('bootstrap');
    const TooltipMock = bootstrap.Tooltip as jest.Mock;
    
    render(<ClientScripts />);

    // Wait for useEffect to run
    await new Promise(resolve => setTimeout(resolve, 100));

    // Verify Bootstrap Tooltip was called for each element
    expect(TooltipMock).toHaveBeenCalledTimes(2);
  });

  it('should handle case when no tooltip elements exist', async () => {
    document.body.innerHTML = '';

    const bootstrap = await import('bootstrap');
    const TooltipMock = bootstrap.Tooltip as jest.Mock;
    TooltipMock.mockClear();
    
    render(<ClientScripts />);

    // Wait for useEffect to run
    await new Promise(resolve => setTimeout(resolve, 100));

    // Verify Bootstrap Tooltip was not called
    expect(TooltipMock).not.toHaveBeenCalled();
  });

  afterEach(() => {
    jest.clearAllMocks();
    document.body.innerHTML = '';
  });
});
