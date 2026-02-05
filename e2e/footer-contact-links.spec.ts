import { test, expect } from '@playwright/test';
import { waitForPageReady } from './helpers';

test.describe('Footer Contact Links', () => {
  test('footer contact links should match contact page main links', async ({ page }) => {
    // Navigate to contact page
    await page.goto('/contact/');
    await waitForPageReady(page);
    
    // Get contact links from the main contact section (flex container, excluding PGP key)
    const contactPageLinks = page.locator('.contact-links .flex a[href]');
    const contactPageUrls = await contactPageLinks.evaluateAll((links) => 
      links.map(link => link.getAttribute('href')).filter(Boolean)
    );
    
    // Get contact links from the footer (uses ul.contact-links for accessible markup)
    const footerLinks = page.locator('footer ul.contact-links a[href]');
    const footerUrls = await footerLinks.evaluateAll((links) => 
      links.map(link => link.getAttribute('href')).filter(Boolean)
    );
    
    // Verify footer has the same links as contact page main section
    // (Contact page also has a PGP key link below, which is not in footer)
    expect(footerUrls).toEqual(contactPageUrls);
  });
  
  test('footer should have email link', async ({ page }) => {
    await page.goto('/');
    await waitForPageReady(page);
    
    const emailLink = page.locator('footer a[href^="mailto:"]');
    await expect(emailLink).toHaveCount(1);
    await expect(emailLink).toHaveAttribute('href', 'mailto:ben@balter.com');
  });
  
  test('footer should have vCard link', async ({ page }) => {
    await page.goto('/');
    await waitForPageReady(page);
    
    const vcardLink = page.locator('footer a[href="/vcard.vcf"]');
    await expect(vcardLink).toHaveCount(1);
  });
  
  test('footer should have Bluesky link', async ({ page }) => {
    await page.goto('/');
    await waitForPageReady(page);
    
    const blueskyLink = page.locator('footer a[href*="bsky.app"]');
    await expect(blueskyLink).toHaveCount(1);
    await expect(blueskyLink).toHaveAttribute('href', 'https://bsky.app/profile/ben.balter.com');
  });
  
  test('footer should have LinkedIn link', async ({ page }) => {
    await page.goto('/');
    await waitForPageReady(page);
    
    const linkedinLink = page.locator('footer a[href*="linkedin.com"]');
    await expect(linkedinLink).toHaveCount(1);
    await expect(linkedinLink).toHaveAttribute('href', 'https://www.linkedin.com/in/benbalter');
  });
  
  test('footer should have GitHub link', async ({ page }) => {
    await page.goto('/');
    await waitForPageReady(page);
    
    const githubLink = page.locator('footer a[href*="github.com/benbalter"]');
    await expect(githubLink).toHaveCount(1);
    await expect(githubLink).toHaveAttribute('href', 'https://github.com/benbalter');
  });
  
  test('footer contact links should have proper accessibility attributes', async ({ page }) => {
    await page.goto('/');
    await waitForPageReady(page);
    
    // Footer uses ul.contact-links for accessible markup
    const footerContactLinks = page.locator('footer ul.contact-links a');
    const count = await footerContactLinks.count();
    
    expect(count).toBe(5); // Email, vCard, Bluesky, LinkedIn, GitHub
    
    // Check each link has aria-label
    for (let i = 0; i < count; i++) {
      const link = footerContactLinks.nth(i);
      await expect(link).toHaveAttribute('aria-label');
    }
  });
  
  test('footer contact links should open in new tab', async ({ page }) => {
    await page.goto('/');
    await waitForPageReady(page);
    
    // Footer uses ul.contact-links for accessible markup
    const footerContactLinks = page.locator('footer ul.contact-links a');
    const count = await footerContactLinks.count();
    
    expect(count).toBe(5); // Email, vCard, Bluesky, LinkedIn, GitHub
    
    for (let i = 0; i < count; i++) {
      const link = footerContactLinks.nth(i);
      await expect(link).toHaveAttribute('target', '_blank');
      await expect(link).toHaveAttribute('rel', /noopener/);
    }
  });
  
  test('footer contact link icons should render after Astro navigation', async ({ page }) => {
    // Start on homepage
    await page.goto('/');
    await waitForPageReady(page);
    
    // Wait for page to stabilize
    await page.waitForTimeout(200);
    
    // Check that SVG icons are present on initial load
    // We use inline SVGs instead of FontAwesome for better performance
    // Footer uses ul.contact-links for accessible markup
    const initialIcons = page.locator('footer ul.contact-links svg.icon');
    const initialIconCount = await initialIcons.count();
    expect(initialIconCount).toBe(5); // Email, vCard, Bluesky, LinkedIn, GitHub
    
    // Navigate to another page using Astro View Transitions
    const aboutLink = page.locator('a[href="/about/"]').first();
    await aboutLink.click();
    await page.waitForURL('**/about/');
    await waitForPageReady(page);
    
    // Wait a moment for page to stabilize after navigation
    await page.waitForTimeout(200);
    
    // Check that footer contact link icons still render after navigation
    const iconsAfterNav = page.locator('footer ul.contact-links svg.icon');
    const iconCountAfterNav = await iconsAfterNav.count();
    expect(iconCountAfterNav).toBe(5);
    
    // Verify icons are actually visible (not just present in DOM)
    for (let i = 0; i < iconCountAfterNav; i++) {
      await expect(iconsAfterNav.nth(i)).toBeVisible();
    }
    
    // Navigate to another page to test multiple navigations
    const contactLink = page.locator('a[href="/contact/"]').first();
    await contactLink.click();
    await page.waitForURL('**/contact/');
    await waitForPageReady(page);
    
    // Wait a moment for page to stabilize after second navigation
    await page.waitForTimeout(200);
    
    // Check icons still work after second navigation
    const iconsAfterSecondNav = page.locator('footer ul.contact-links svg.icon');
    const iconCountAfterSecondNav = await iconsAfterSecondNav.count();
    expect(iconCountAfterSecondNav).toBe(5);
    
    // Verify all icons are visible
    for (let i = 0; i < iconCountAfterSecondNav; i++) {
      await expect(iconsAfterSecondNav.nth(i)).toBeVisible();
    }
  });
});
