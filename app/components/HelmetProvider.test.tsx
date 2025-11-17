import { render, screen } from '@testing-library/react';
import HelmetProvider from './HelmetProvider';
import '@testing-library/jest-dom';

describe('HelmetProvider', () => {
  it('renders children correctly', () => {
    render(
      <HelmetProvider>
        <div>Test Content</div>
      </HelmetProvider>
    );
    
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('provides Helmet context to children', () => {
    const TestComponent = () => {
      return (
        <div data-testid="test-component">
          Helmet context available
        </div>
      );
    };

    render(
      <HelmetProvider>
        <TestComponent />
      </HelmetProvider>
    );
    
    expect(screen.getByTestId('test-component')).toBeInTheDocument();
  });
});
