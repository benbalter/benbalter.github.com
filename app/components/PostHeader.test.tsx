import { render } from '@testing-library/react';
import PostHeader from './PostHeader';

// Mock PageTitle component
jest.mock('./PageTitle', () => {
  return function PageTitle({ title }: { title: string }) {
    return <h1>{title}</h1>;
  };
});

describe('PostHeader', () => {
  it('should render with title', () => {
    const { container } = render(<PostHeader title="Test Post Title" />);
    
    expect(container.querySelector('h1')).toHaveTextContent('Test Post Title');
  });

  it('should pass title to PageTitle component', () => {
    const { container } = render(<PostHeader title="My Amazing Post" />);
    
    expect(container.querySelector('h1')).toHaveTextContent('My Amazing Post');
  });

  it('should render with empty title', () => {
    const { container } = render(<PostHeader title="" />);
    
    expect(container.querySelector('h1')).toBeInTheDocument();
  });
});
