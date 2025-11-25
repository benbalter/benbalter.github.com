import { render } from '@testing-library/react';
import ClientScripts from './ClientScripts';

// Mock next/navigation
const mockPathname = '/';
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(() => mockPathname),
}));

// Mock dynamic imports
jest.mock('bootstrap', () => ({
  Tooltip: Object.assign(jest.fn(), {
    getInstance: jest.fn(() => null),
  }),
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

  it('should not reinitialize already initialized tooltips', async () => {
    // Add a tooltip element to the DOM
    document.body.innerHTML = `
      <button data-bs-toggle="tooltip" title="Test tooltip">Button</button>
    `;

    const bootstrap = await import('bootstrap');
    const TooltipMock = bootstrap.Tooltip as jest.Mock;
    const getInstanceMock = bootstrap.Tooltip.getInstance as jest.Mock;
    
    // First render - getInstance returns null (not initialized)
    TooltipMock.mockClear();
    getInstanceMock.mockReturnValue(null);
    
    render(<ClientScripts />);
    await new Promise(resolve => setTimeout(resolve, 100));
    
    expect(TooltipMock).toHaveBeenCalledTimes(1);
    
    // Simulate tooltip already initialized
    getInstanceMock.mockReturnValue({ _element: {} }); // Return a truthy value
    TooltipMock.mockClear();
    
    // Re-render (simulates navigation)
    const { rerender } = render(<ClientScripts />);
    rerender(<ClientScripts />);
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Tooltip should not be initialized again
    expect(TooltipMock).not.toHaveBeenCalled();
  });

  afterEach(() => {
    jest.clearAllMocks();
    document.body.innerHTML = '';
  });
});
