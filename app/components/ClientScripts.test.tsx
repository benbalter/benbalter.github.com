import { render } from '@testing-library/react';
import ClientScripts from './ClientScripts';

// Mock next/navigation
let mockPathname = '/';
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(() => mockPathname),
}));

// Mock dynamic imports
const mockDispose = jest.fn();
jest.mock('bootstrap', () => ({
  Tooltip: Object.assign(jest.fn(() => ({ dispose: mockDispose })), {
    getInstance: jest.fn(() => null),
  }),
}), { virtual: true });

describe('ClientScripts', () => {
  beforeEach(() => {
    mockPathname = '/';
  });

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
    document.body.innerHTML = `
      <button data-bs-toggle="tooltip" title="Test tooltip">Button</button>
    `;

    const bootstrap = await import('bootstrap');
    const TooltipMock = bootstrap.Tooltip as jest.Mock;
    const getInstanceMock = bootstrap.Tooltip.getInstance as jest.Mock;
    const { usePathname } = await import('next/navigation');
    const usePathnameMock = usePathname as jest.Mock;
    
    // First render at root path
    mockPathname = '/';
    usePathnameMock.mockReturnValue('/');
    TooltipMock.mockClear();
    getInstanceMock.mockReturnValue(null);
    
    const { rerender } = render(<ClientScripts />);
    await new Promise(resolve => setTimeout(resolve, 100));
    
    expect(TooltipMock).toHaveBeenCalledTimes(1);
    
    // Simulate navigation to different path with tooltip already initialized
    mockPathname = '/blog';
    usePathnameMock.mockReturnValue('/blog');
    getInstanceMock.mockReturnValue({ _element: {} });
    TooltipMock.mockClear();
    
    rerender(<ClientScripts />);
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Tooltip should not be initialized again
    expect(TooltipMock).not.toHaveBeenCalled();
  });

  it('should initialize tooltips for new elements after navigation', async () => {
    const bootstrap = await import('bootstrap');
    const TooltipMock = bootstrap.Tooltip as jest.Mock;
    const getInstanceMock = bootstrap.Tooltip.getInstance as jest.Mock;
    const { usePathname } = await import('next/navigation');
    const usePathnameMock = usePathname as jest.Mock;
    
    // Initial page with one tooltip
    mockPathname = '/';
    usePathnameMock.mockReturnValue('/');
    document.body.innerHTML = `<button data-bs-toggle="tooltip" title="Tooltip 1">Button 1</button>`;
    getInstanceMock.mockReturnValue(null);
    TooltipMock.mockClear();
    
    const { rerender } = render(<ClientScripts />);
    await new Promise(resolve => setTimeout(resolve, 100));
    
    expect(TooltipMock).toHaveBeenCalledTimes(1);
    
    // Navigate to new page with different tooltip
    mockPathname = '/blog';
    usePathnameMock.mockReturnValue('/blog');
    document.body.innerHTML = `<button data-bs-toggle="tooltip" title="Tooltip 2">Button 2</button>`;
    getInstanceMock.mockReturnValue(null);
    TooltipMock.mockClear();
    
    rerender(<ClientScripts />);
    await new Promise(resolve => setTimeout(resolve, 100));
    
    expect(TooltipMock).toHaveBeenCalledTimes(1);
  });

  it('should dispose tooltips on cleanup', async () => {
    document.body.innerHTML = `
      <button data-bs-toggle="tooltip" title="Test tooltip">Button</button>
    `;

    const bootstrap = await import('bootstrap');
    const TooltipMock = bootstrap.Tooltip as jest.Mock;
    const getInstanceMock = bootstrap.Tooltip.getInstance as jest.Mock;
    const { usePathname } = await import('next/navigation');
    const usePathnameMock = usePathname as jest.Mock;
    
    mockPathname = '/';
    usePathnameMock.mockReturnValue('/');
    getInstanceMock.mockReturnValue(null);
    TooltipMock.mockClear();
    mockDispose.mockClear();
    
    const { unmount } = render(<ClientScripts />);
    await new Promise(resolve => setTimeout(resolve, 100));
    
    expect(TooltipMock).toHaveBeenCalledTimes(1);
    
    // Unmount should trigger cleanup
    unmount();
    
    expect(mockDispose).toHaveBeenCalled();
  });

  afterEach(() => {
    jest.clearAllMocks();
    document.body.innerHTML = '';
  });
});
