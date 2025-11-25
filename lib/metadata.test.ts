import { createMetadataRouteHandler } from './metadata';

describe('createMetadataRouteHandler', () => {
  it('creates a route handler with force-static dynamic export', () => {
    const generator = () => 'test content';
    const handler = createMetadataRouteHandler(generator);
    
    expect(handler.dynamic).toBe('force-static');
  });

  it('returns an object with GET function', () => {
    const generator = () => 'test content';
    const handler = createMetadataRouteHandler(generator);
    
    expect(typeof handler.GET).toBe('function');
  });

  it('accepts text/plain as default content type', () => {
    const generator = () => 'test content';
    // Should not throw when called without contentType
    const handler = createMetadataRouteHandler(generator);
    
    expect(handler.dynamic).toBe('force-static');
    expect(typeof handler.GET).toBe('function');
  });

  it('accepts application/xml content type', () => {
    const generator = () => '<xml>test</xml>';
    // Should not throw when called with xml content type
    const handler = createMetadataRouteHandler(generator, 'application/xml');
    
    expect(handler.dynamic).toBe('force-static');
    expect(typeof handler.GET).toBe('function');
  });
});
