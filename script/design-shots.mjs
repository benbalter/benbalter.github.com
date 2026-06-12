import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

const OUT = '/tmp/design-shots';
mkdirSync(OUT, { recursive: true });

const base = 'http://localhost:4321';
const pages = [
  ['home', '/'],
  ['posts', '/posts/'],
  ['about', '/about/'],
  ['post', null], // resolved dynamically: first featured post link from home
  ['resume', '/resume/'],
  ['contact', '/contact/'],
];

const viewports = {
  desktop: { width: 1280, height: 900 },
  mobile: { width: 390, height: 844 },
};

const browser = await chromium.launch();

// Resolve a real post URL from the homepage
const ctx0 = await browser.newContext({ viewport: viewports.desktop });
const p0 = await ctx0.newPage();
await p0.goto(base + '/posts/', { waitUntil: 'networkidle' });
const postHref = await p0.evaluate(() => {
  const a = document.querySelector('main a[href*="/20"]');
  return a ? a.getAttribute('href') : null;
});
await ctx0.close();
console.log('Resolved post:', postHref);

for (const [name, path] of pages) {
  const realPath = name === 'post' ? postHref : path;
  if (!realPath) { console.log('skip', name); continue; }
  for (const scheme of ['light', 'dark']) {
    for (const [vpName, vp] of Object.entries(viewports)) {
      const ctx = await browser.newContext({
        viewport: vp,
        colorScheme: scheme,
        deviceScaleFactor: 2,
      });
      const page = await ctx.newPage();
      try {
        await page.goto(base + realPath, { waitUntil: 'networkidle', timeout: 20000 });
        await page.waitForTimeout(400);
        const file = `${OUT}/${name}-${vpName}-${scheme}.png`;
        // Full page for home/posts/about, viewport for post (too long)
        const full = name !== 'post';
        await page.screenshot({ path: file, fullPage: full });
        console.log('shot', file);
      } catch (e) {
        console.log('ERR', name, vpName, scheme, e.message);
      }
      await ctx.close();
    }
  }
}

await browser.close();
console.log('done');
