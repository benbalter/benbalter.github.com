import { render } from '@testing-library/react';
import { Helmet } from 'react-helmet-async';
import DynamicHelmet from './DynamicHelmet';
import HelmetProvider from './HelmetProvider';
import '@testing-library/jest-dom';

describe('DynamicHelmet', () => {
  it('renders without crashing when wrapped in HelmetProvider', () => {
    render(
      <HelmetProvider>
        <DynamicHelmet
          title="Test Title"
          description="Test Description"
          keywords={['test', 'helmet']}
        />
      </HelmetProvider>
    );
    
    // No error means it rendered successfully
    expect(true).toBe(true);
  });

  it('accepts optional props', () => {
    render(
      <HelmetProvider>
        <DynamicHelmet />
      </HelmetProvider>
    );
    
    // Should render without props
    expect(true).toBe(true);
  });

  it('renders with only title', () => {
    render(
      <HelmetProvider>
        <DynamicHelmet title="Only Title" />
      </HelmetProvider>
    );
    
    expect(true).toBe(true);
  });

  it('renders with only description', () => {
    render(
      <HelmetProvider>
        <DynamicHelmet description="Only Description" />
      </HelmetProvider>
    );
    
    expect(true).toBe(true);
  });

  it('renders with only keywords', () => {
    render(
      <HelmetProvider>
        <DynamicHelmet keywords={['keyword1', 'keyword2']} />
      </HelmetProvider>
    );
    
    expect(true).toBe(true);
  });
});
