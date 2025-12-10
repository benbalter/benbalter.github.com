/**
 * Tests for redirect utility
 */

import { describe, it, expect, vi } from 'vitest';
import { createRedirect } from './redirect';
import type { AstroGlobal } from 'astro';

describe('createRedirect', () => {
  it('should create a 301 redirect to the target URL', () => {
    // Mock Astro.redirect
    const mockRedirect = vi.fn((url: string, status: number) => 
      new Response(null, { status, headers: { Location: url } })
    );
    
    const mockAstro = {
      redirect: mockRedirect,
    } as unknown as AstroGlobal;
    
    const result = createRedirect(mockAstro, '/target-url/');
    
    expect(mockRedirect).toHaveBeenCalledWith('/target-url/', 301);
    expect(result).toBeInstanceOf(Response);
  });

  it('should handle the optional from parameter', () => {
    const mockRedirect = vi.fn((url: string, status: number) => 
      new Response(null, { status, headers: { Location: url } })
    );
    
    const mockAstro = {
      redirect: mockRedirect,
    } as unknown as AstroGlobal;
    
    // Should work with from parameter
    const result = createRedirect(mockAstro, '/new-location/', '/old-location/');
    
    expect(mockRedirect).toHaveBeenCalledWith('/new-location/', 301);
    expect(result).toBeInstanceOf(Response);
  });

  it('should redirect to correct URL', () => {
    const mockRedirect = vi.fn((url: string, status: number) => 
      new Response(null, { status, headers: { Location: url } })
    );
    
    const mockAstro = {
      redirect: mockRedirect,
    } as unknown as AstroGlobal;
    
    createRedirect(mockAstro, '/other-recommended-reading/');
    
    expect(mockRedirect).toHaveBeenCalledWith('/other-recommended-reading/', 301);
  });

  it('should always use status code 301 (permanent redirect)', () => {
    const mockRedirect = vi.fn((url: string, status: number) => 
      new Response(null, { status, headers: { Location: url } })
    );
    
    const mockAstro = {
      redirect: mockRedirect,
    } as unknown as AstroGlobal;
    
    createRedirect(mockAstro, '/target/', '/source/');
    
    // Verify 301 status is used (permanent redirect)
    expect(mockRedirect).toHaveBeenCalledWith(expect.any(String), 301);
  });

  it('should handle multiple redirect calls independently', () => {
    const mockRedirect = vi.fn((url: string, status: number) => 
      new Response(null, { status, headers: { Location: url } })
    );
    
    const mockAstro = {
      redirect: mockRedirect,
    } as unknown as AstroGlobal;
    
    createRedirect(mockAstro, '/destination-1/', '/source-1/');
    createRedirect(mockAstro, '/destination-2/', '/source-2/');
    createRedirect(mockAstro, '/destination-3/');
    
    expect(mockRedirect).toHaveBeenCalledTimes(3);
    expect(mockRedirect).toHaveBeenNthCalledWith(1, '/destination-1/', 301);
    expect(mockRedirect).toHaveBeenNthCalledWith(2, '/destination-2/', 301);
    expect(mockRedirect).toHaveBeenNthCalledWith(3, '/destination-3/', 301);
  });
});
