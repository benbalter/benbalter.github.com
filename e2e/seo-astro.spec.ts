import { test, expect } from '@playwright/test';
import { waitForPageReady } from './helpers';

/**
 * SEO Tests for Astro Build
 * 
 * Comprehensive tests for search engine optimization including:
 * - Meta tags (title, description, keywords)
 * - Open Graph tags
 * - Twitter Card tags
 * - Canonical URLs
 * - Structured data (JSON-LD)
 * - Robots.txt
 * - Sitemap
 * - RSS feeds
 */

test.describe('SEO Meta Tags', () => {
  const pages = [
    { url: '/', name: 'Homepage' },
    { url: '/about/', name: 'About' },
    { url: '/resume/', name: 'Resume' },
    { url: '/contact/', name: 'Contact' },
    { url: '/talks/', name: 'Talks' },
  ];

  pages.forEach(({ url, name }) => {
    test.describe(name, () => {
      test.beforeEach(async ({ page }) => {
        const response = await page.goto(url);
        // Skip if page doesn't exist
        if (!response || response.status() === 404) {
          test.skip();
          return;
        }
        await waitForPageReady(page);
      });

      test('should have unique title tag', async ({ page }) => {
        const title = await page.title();
        expect(title).toBeTruthy();
        expect(title.length).toBeGreaterThan(0);
        expect(title.length).toBeLessThanOrEqual(70); // SEO best practice: 50-70 characters
        
        // Title should include site name
        expect(title).toContain('Ben Balter');
      });

      test('should have meta description', async ({ page }) => {
        const metaDescription = page.locator('meta[name="description"]');
        await expect(metaDescription).toHaveCount(1);
        
        const content = await metaDescription.getAttribute('content');
        expect(content).toBeTruthy();
        expect(content!.length).toBeGreaterThan(10);
        // Site uses 192 chars max; key info should be in first 150 chars for SERP display
        expect(content!.length).toBeLessThanOrEqual(192);
      });

      test('should have keywords meta tag', async ({ page }) => {
        const metaKeywords = page.locator('meta[name="keywords"]');
        const count = await metaKeywords.count();
        
        // Keywords are optional but good to have
        if (count > 0) {
          const content = await metaKeywords.getAttribute('content');
          expect(content).toBeTruthy();
        }
      });

      test('should have author meta tag', async ({ page }) => {
        const metaAuthor = page.locator('meta[name="author"]');
        await expect(metaAuthor).toHaveCount(1);
        
        const content = await metaAuthor.getAttribute('content');
        expect(content).toBe('Ben Balter');
      });

      test('should have canonical URL', async ({ page }) => {
        const canonical = page.locator('link[rel="canonical"]');
        await expect(canonical).toHaveCount(1);
        
        const href = await canonical.getAttribute('href');
        expect(href).toBeTruthy();
        expect(href).toContain('https://ben.balter.com');
      });

      test('should not block indexing', async ({ page }) => {
        const robotsMeta = page.locator('meta[name="robots"]');
        const count = await robotsMeta.count();
        
        if (count > 0) {
          const content = await robotsMeta.getAttribute('content');
          expect(content).not.toContain('noindex');
        }
      });
    });
  });
});

test.describe('Open Graph Tags', () => {
  const pages = [
    { url: '/', name: 'Homepage' },
    { url: '/about/', name: 'About' },
    { url: '/resume/', name: 'Resume' },
  ];

  pages.forEach(({ url, name }) => {
    test.describe(name, () => {
      test.beforeEach(async ({ page }) => {
        await page.goto(url);
        await waitForPageReady(page);
      });

      test('should have og:title', async ({ page }) => {
        const ogTitle = page.locator('meta[property="og:title"]');
        await expect(ogTitle).toHaveCount(1);
        
        const content = await ogTitle.getAttribute('content');
        expect(content).toBeTruthy();
      });

      test('should have og:description', async ({ page }) => {
        const ogDescription = page.locator('meta[property="og:description"]');
        await expect(ogDescription).toHaveCount(1);
        
        const content = await ogDescription.getAttribute('content');
        expect(content).toBeTruthy();
      });

      test('should have og:type', async ({ page }) => {
        const ogType = page.locator('meta[property="og:type"]');
        await expect(ogType).toHaveCount(1);
        
        const content = await ogType.getAttribute('content');
        expect(['website', 'article']).toContain(content);
      });

      test('should have og:url', async ({ page }) => {
        const ogUrl = page.locator('meta[property="og:url"]');
        await expect(ogUrl).toHaveCount(1);
        
        const content = await ogUrl.getAttribute('content');
        expect(content).toContain('https://ben.balter.com');
      });

      test('should have og:image', async ({ page }) => {
        const ogImage = page.locator('meta[property="og:image"]');
        await expect(ogImage).toHaveCount(1);
        
        const content = await ogImage.getAttribute('content');
        expect(content).toBeTruthy();
      });

      test('should have og:site_name', async ({ page }) => {
        const ogSiteName = page.locator('meta[property="og:site_name"]');
        await expect(ogSiteName).toHaveCount(1);
        
        const content = await ogSiteName.getAttribute('content');
        expect(content).toBe('Ben Balter');
      });

      test('should have og:locale', async ({ page }) => {
        const ogLocale = page.locator('meta[property="og:locale"]');
        await expect(ogLocale).toHaveCount(1);
        
        const content = await ogLocale.getAttribute('content');
        expect(content).toBe('en_US');
      });
    });
  });
});

test.describe('Twitter Card Tags', () => {
  const pages = [
    { url: '/', name: 'Homepage' },
    { url: '/about/', name: 'About' },
  ];

  pages.forEach(({ url, name }) => {
    test.describe(name, () => {
      test.beforeEach(async ({ page }) => {
        await page.goto(url);
        await waitForPageReady(page);
      });

      test('should have twitter:card', async ({ page }) => {
        const twitterCard = page.locator('meta[name="twitter:card"]');
        await expect(twitterCard).toHaveCount(1);
        
        const content = await twitterCard.getAttribute('content');
        expect(content).toBe('summary_large_image');
      });

      test('should have twitter:site', async ({ page }) => {
        const twitterSite = page.locator('meta[name="twitter:site"]');
        await expect(twitterSite).toHaveCount(1);
        
        const content = await twitterSite.getAttribute('content');
        expect(content).toBe('@benbalter');
      });

      test('should have twitter:creator', async ({ page }) => {
        const twitterCreator = page.locator('meta[name="twitter:creator"]');
        await expect(twitterCreator).toHaveCount(1);
        
        const content = await twitterCreator.getAttribute('content');
        expect(content).toBe('@benbalter');
      });

      test('should have twitter:title', async ({ page }) => {
        const twitterTitle = page.locator('meta[name="twitter:title"]');
        await expect(twitterTitle).toHaveCount(1);
        
        const content = await twitterTitle.getAttribute('content');
        expect(content).toBeTruthy();
      });

      test('should have twitter:description', async ({ page }) => {
        const twitterDescription = page.locator('meta[name="twitter:description"]');
        await expect(twitterDescription).toHaveCount(1);
        
        const content = await twitterDescription.getAttribute('content');
        expect(content).toBeTruthy();
      });

      test('should have twitter:image', async ({ page }) => {
        const twitterImage = page.locator('meta[name="twitter:image"]');
        await expect(twitterImage).toHaveCount(1);
        
        const content = await twitterImage.getAttribute('content');
        expect(content).toBeTruthy();
      });
    });
  });
});

test.describe('Structured Data (JSON-LD)', () => {
  test('homepage should have Person schema', async ({ page }) => {
    await page.goto('/');
    await waitForPageReady(page);
    
    const jsonLd = page.locator('script[type="application/ld+json"]');
    const count = await jsonLd.count();
    expect(count).toBeGreaterThan(0);
    
    const content = await jsonLd.first().textContent();
    expect(content).toBeTruthy();
    
    const schemas = JSON.parse(content!);
    const schemaArray = Array.isArray(schemas) ? schemas : [schemas];
    
    // Check for Person schema
    const personSchema = schemaArray.find((s: any) => s['@type'] === 'Person');
    expect(personSchema).toBeTruthy();
    expect(personSchema.name).toBe('Ben Balter');
  });

  test('homepage should have WebSite schema', async ({ page }) => {
    await page.goto('/');
    await waitForPageReady(page);
    
    const jsonLd = page.locator('script[type="application/ld+json"]');
    const content = await jsonLd.first().textContent();
    const schemas = JSON.parse(content!);
    const schemaArray = Array.isArray(schemas) ? schemas : [schemas];
    
    // Check for WebSite schema
    const websiteSchema = schemaArray.find((s: any) => s['@type'] === 'WebSite');
    expect(websiteSchema).toBeTruthy();
    expect(websiteSchema.url).toBe('https://ben.balter.com');
  });

  test('blog post should have BlogPosting schema', async ({ page }) => {
    await page.goto('/');
    await waitForPageReady(page);
    
    // Navigate to a blog post - use selector that matches year pattern in URLs
    const postLinks = page.locator('a[href*="/20"]');
    const count = await postLinks.count();
    
    if (count === 0) {
      test.skip(true, 'No blog posts found');
      return;
    }
    
    // Get the URL and navigate directly
    const firstPostUrl = await postLinks.first().getAttribute('href');
    if (!firstPostUrl) {
      test.skip(true, 'Could not get blog post URL');
      return;
    }
    
    await page.goto(firstPostUrl);
    await waitForPageReady(page);
    
    // Find the BlogPosting schema
    const jsonLdElements = page.locator('script[type="application/ld+json"]');
    const allElements = await jsonLdElements.all();
    
    let foundBlogPosting = false;
    for (const element of allElements) {
      const content = await element.textContent();
      if (content) {
        const schema = JSON.parse(content);
        const schemaArray = Array.isArray(schema) ? schema : [schema];
        
        const blogPosting = schemaArray.find((s: any) => s['@type'] === 'BlogPosting');
        if (blogPosting) {
          foundBlogPosting = true;
          expect(blogPosting.headline).toBeTruthy();
          expect(blogPosting.datePublished).toBeTruthy();
          expect(blogPosting.author).toBeTruthy();
          break;
        }
      }
    }
    
    expect(foundBlogPosting).toBe(true);
  });

  test('pages should have BreadcrumbList schema', async ({ page }) => {
    await page.goto('/about/');
    await waitForPageReady(page);
    
    const jsonLd = page.locator('script[type="application/ld+json"]');
    const content = await jsonLd.first().textContent();
    const schemas = JSON.parse(content!);
    const schemaArray = Array.isArray(schemas) ? schemas : [schemas];
    
    // Check for BreadcrumbList schema
    const breadcrumbSchema = schemaArray.find((s: any) => s['@type'] === 'BreadcrumbList');
    expect(breadcrumbSchema).toBeTruthy();
    expect(breadcrumbSchema.itemListElement).toBeTruthy();
    expect(breadcrumbSchema.itemListElement.length).toBeGreaterThan(0);
  });
});

test.describe('Blog Post SEO', () => {
  test('blog posts should have article meta tags', async ({ page }) => {
    await page.goto('/');
    await waitForPageReady(page);
    
    const postLinks = page.locator('a[href*="/20"]');
    const count = await postLinks.count();
    
    if (count === 0) {
      test.skip(true, 'No blog posts found');
      return;
    }
    
    await postLinks.first().click();
    await waitForPageReady(page);
    
    // Check for article:published_time
    const publishedTime = page.locator('meta[property="article:published_time"]');
    const publishedCount = await publishedTime.count();
    
    if (publishedCount > 0) {
      const content = await publishedTime.getAttribute('content');
      // ISO 8601 datetime format (validates date prefix, full format is YYYY-MM-DDTHH:MM:SSZ)
      expect(content).toMatch(/^\d{4}-\d{2}-\d{2}/);
    }
    
    // Check for article:author
    const author = page.locator('meta[property="article:author"]');
    const authorCount = await author.count();
    
    if (authorCount > 0) {
      const content = await author.getAttribute('content');
      expect(content).toBeTruthy();
    }
  });

  test('blog posts should have og:type article', async ({ page }) => {
    await page.goto('/');
    await waitForPageReady(page);
    
    const postLinks = page.locator('a[href*="/20"]');
    const count = await postLinks.count();
    
    if (count === 0) {
      test.skip(true, 'No blog posts found');
      return;
    }
    
    // Get the URL and navigate directly
    const firstPostUrl = await postLinks.first().getAttribute('href');
    if (!firstPostUrl) {
      test.skip(true, 'Could not get blog post URL');
      return;
    }
    
    await page.goto(firstPostUrl);
    await waitForPageReady(page);
    
    const ogType = page.locator('meta[property="og:type"]');
    const content = await ogType.getAttribute('content');
    expect(content).toBe('article');
  });
});

test.describe('Robots.txt', () => {
  test('should be accessible', async ({ page }) => {
    const response = await page.goto('/robots.txt');
    expect(response?.status()).toBe(200);
    
    const content = await page.textContent('body');
    expect(content).toBeTruthy();
  });

  test('should contain User-agent directive', async ({ page }) => {
    await page.goto('/robots.txt');
    const content = await page.textContent('body');
    expect(content).toContain('User-agent:');
  });

  test('should contain Allow directive', async ({ page }) => {
    await page.goto('/robots.txt');
    const content = await page.textContent('body');
    expect(content).toContain('Allow: /');
  });

  test('should contain Sitemap directive', async ({ page }) => {
    await page.goto('/robots.txt');
    const content = await page.textContent('body');
    expect(content).toContain('Sitemap:');
    expect(content).toContain('https://ben.balter.com/sitemap');
  });

  test('should disallow /assets/', async ({ page }) => {
    await page.goto('/robots.txt');
    const content = await page.textContent('body');
    expect(content).toContain('Disallow: /assets/');
  });

  test('should disallow /404.html', async ({ page }) => {
    await page.goto('/robots.txt');
    const content = await page.textContent('body');
    expect(content).toContain('Disallow: /404.html');
  });

  test('should disallow /dist-astro/', async ({ page }) => {
    await page.goto('/robots.txt');
    const content = await page.textContent('body');
    expect(content).toContain('Disallow: /dist-astro/');
  });
});

test.describe('Sitemap', () => {
  test('sitemap should be accessible', async ({ page }) => {
    // Try sitemap-index.xml first (Astro format)
    let response = await page.goto('/sitemap-index.xml');
    let status = response?.status();
    
    if (status === 404) {
      response = await page.goto('/sitemap.xml');
      status = response?.status();
    }
    
    expect(status).toBe(200);
  });

  test('sitemap should contain valid XML', async ({ page }) => {
    let response = await page.goto('/sitemap-index.xml');
    let status = response?.status();
    
    if (status === 404) {
      await page.goto('/sitemap.xml');
    }
    
    const content = await page.content();
    // Check for XML markers
    expect(/<urlset|<sitemapindex|<url>/i.test(content)).toBeTruthy();
  });

  test('sitemap should reference main pages', async ({ page }) => {
    // Navigate to sitemap-0.xml for actual URL entries
    const response = await page.goto('/sitemap-0.xml');
    
    if (response?.status() === 200) {
      const content = await page.content();
      
      // Check for key pages
      expect(content).toContain('ben.balter.com');
    }
  });
});

test.describe('RSS Feed', () => {
  test('RSS feed should be accessible', async ({ page }) => {
    const response = await page.goto('/feed.xml');
    expect(response?.status()).toBe(200);
  });

  test('should have RSS link in head', async ({ page }) => {
    await page.goto('/');
    await waitForPageReady(page);
    
    const rssLink = page.locator('link[rel="alternate"][type="application/rss+xml"]');
    const count = await rssLink.count();
    expect(count).toBeGreaterThanOrEqual(1);
    
    const href = await rssLink.first().getAttribute('href');
    expect(href).toContain('feed');
  });
});

test.describe('Social Links', () => {
  test('should have rel=me links for social verification', async ({ page }) => {
    await page.goto('/');
    await waitForPageReady(page);
    
    const relMeLinks = page.locator('link[rel="me"]');
    const count = await relMeLinks.count();
    
    // Should have multiple social profile links
    expect(count).toBeGreaterThan(0);
  });

  test('should include GitHub profile link', async ({ page }) => {
    await page.goto('/');
    await waitForPageReady(page);
    
    const githubLink = page.locator('link[rel="me"][href*="github.com"]');
    const count = await githubLink.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test('should include LinkedIn profile link', async ({ page }) => {
    await page.goto('/');
    await waitForPageReady(page);
    
    const linkedinLink = page.locator('link[rel="me"][href*="linkedin.com"]');
    const count = await linkedinLink.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });
});

test.describe('Performance Hints for SEO', () => {
  test('should have preconnect hints', async ({ page }) => {
    await page.goto('/');
    await waitForPageReady(page);
    
    const preconnect = page.locator('link[rel="preconnect"]');
    const count = await preconnect.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should have dns-prefetch hints', async ({ page }) => {
    await page.goto('/');
    await waitForPageReady(page);
    
    const dnsPrefetch = page.locator('link[rel="dns-prefetch"]');
    const count = await dnsPrefetch.count();
    expect(count).toBeGreaterThan(0);
  });
});

test.describe('Accessibility for SEO', () => {
  test('should have lang attribute on html', async ({ page }) => {
    await page.goto('/');
    await waitForPageReady(page);
    
    const html = page.locator('html');
    await expect(html).toHaveAttribute('lang', 'en');
  });

  test('images should have alt text', async ({ page }) => {
    await page.goto('/about/');
    await waitForPageReady(page);
    
    const images = await page.locator('img').all();
    
    for (const img of images) {
      const alt = await img.getAttribute('alt');
      expect(alt).not.toBeNull();
    }
  });
});

test.describe('Heading Hierarchy', () => {
  const pages = [
    { url: '/', name: 'Homepage' },
    { url: '/about/', name: 'About' },
    { url: '/resume/', name: 'Resume' },
    { url: '/contact/', name: 'Contact' },
    { url: '/talks/', name: 'Talks' },
  ];

  pages.forEach(({ url, name }) => {
    test(`${name} should have exactly one H1`, async ({ page }) => {
      const response = await page.goto(url);
      if (!response || response.status() === 404) {
        test.skip();
        return;
      }
      await waitForPageReady(page);

      const h1Count = await page.locator('h1').count();
      expect(h1Count).toBe(1);
    });

    test(`${name} should not skip heading levels`, async ({ page }) => {
      const response = await page.goto(url);
      if (!response || response.status() === 404) {
        test.skip();
        return;
      }
      await waitForPageReady(page);

      // Get all heading levels in document order
      const headingLevels = await page.evaluate(() => {
        const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
        return Array.from(headings).map(h => parseInt(h.tagName.substring(1)));
      });

      // Verify no heading level is skipped (e.g., H1 -> H3 without H2)
      for (let i = 1; i < headingLevels.length; i++) {
        const current = headingLevels[i];
        const previous = headingLevels[i - 1];
        expect(current, `Heading level skips from H${previous} to H${current}`)
          .toBeLessThanOrEqual(previous + 1);
      }
    });
  });
});
