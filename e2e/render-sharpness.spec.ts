import { test, expect, type Page } from '@playwright/test';
import { waitForFullLoad } from './helpers';

/**
 * Render sharpness tests
 *
 * A build can pass `astro build`, look right on your laptop, and still ship
 * soft raster images to the visitors who'd notice most: people on retina
 * (2×) displays. An <img> whose responsive `srcset` tops out below twice its
 * on-screen size can't hand the browser enough pixels for the device, so the
 * browser upscales — visibly softening the image on every phone and modern
 * laptop.
 *
 * At each breakpoint real visitors use, this checks that every raster <img>
 * *offers* (in its srcset, or its lone source) a candidate at least ~2× its
 * rendered CSS width. It reads the authoring — the widths the markup makes
 * available — rather than which source the browser happens to have selected
 * at measurement time (`currentSrc`/`naturalWidth` lag selection and produce
 * false positives). It doubles as a srcset/sizes correctness check: a
 * properly-authored responsive image always provides a retina-sufficient
 * candidate.
 *
 * SVGs are vector (always sharp) and are skipped, as are images that don't
 * load in-test (nothing to measure). Idea borrowed from go-for-launch's
 * render-sharpness verifier, reimplemented as a runtime, retina-aware check.
 */

// The device pixel ratio we want every raster image to be able to serve
// sharply. 2 covers the overwhelming majority of phones and retina laptops.
const TARGET_DENSITY = 2;

// Viewports real visitors land on. 320 is the narrowest phone still worth
// supporting; 1280 is a typical laptop. Height is generous so lazy content
// below the fold enters the DOM.
const BREAKPOINTS = [
  { name: 'small-mobile', width: 320, height: 900 },
  { name: 'mobile', width: 375, height: 900 },
  { name: 'tablet', width: 768, height: 1200 },
  { name: 'desktop', width: 1280, height: 1200 },
] as const;

// Pages that exercise the Astro `<Image>` responsive pipeline — avatar, book
// cover, headshot — where a mis-authored `widths`/`sizes`/`densities` would
// ship a source too small for retina. Legacy blog-post body images are
// hot-linked remote uploads (`ben.balter.com/wp-content/...`) that Astro never
// processes; they can't be measured reliably in-test (they load cross-origin,
// often report `naturalWidth === 0`, and stall `networkidle`), so they're out
// of scope here.
const PAGES = ['/', '/about/'] as const;

// How far the best available source may fall short of the retina demand
// before we call it soft. 1.1 means the widest candidate must cover at least
// ~91% of what 2× density asks for — enough slack to absorb responsive-
// breakpoint rounding (e.g. a 224px box offered a 440w source when 448 is
// ideal) without waving through a source that's only half the size it should
// be.
const SHORTFALL_TOLERANCE = 1.1;

interface SharpnessViolation {
  src: string;
  detail: string;
}

/**
 * Force lazy-loaded (`loading="lazy"`) images to fetch by scrolling the full
 * height of the page, then return to top. Without this, below-the-fold images
 * report `naturalWidth === 0` and would be skipped — making the check pass
 * vacuously on exactly the content most likely to be soft.
 */
async function triggerLazyImages(page: Page): Promise<void> {
  await page.evaluate(async () => {
    const step = window.innerHeight;
    const max = document.body.scrollHeight;
    for (let y = 0; y <= max; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => requestAnimationFrame(() => r(null)));
    }
    window.scrollTo(0, 0);
  });
  // Let any newly-requested images finish loading before we measure.
  await page.evaluate(() =>
    Promise.all(
      Array.from(document.images)
        .filter((i) => !i.complete)
        .map((i) => i.decode().catch(() => undefined)),
    ),
  );
}

/**
 * Collect every raster <img> whose available sources can't cover its rendered
 * size at the target density. Runs in-page so we measure exactly what the
 * browser laid out, then compares against the widths the markup offers.
 */
async function collectViolations(
  page: Page,
  targetDensity: number,
  tolerance: number,
): Promise<SharpnessViolation[]> {
  return page.evaluate(
    ({ density, slack }) => {
      const violations: { src: string; detail: string }[] = [];

      // Widest source width (in px) the markup offers for this <img>: the max
      // `w` descriptor in srcset, or the intrinsic width when there's only a
      // single source.
      const widestAvailable = (img: HTMLImageElement): number => {
        const widths = (img.srcset || '')
          .split(',')
          .map((c) => c.trim().match(/\s(\d+)w$/))
          .filter((m): m is RegExpMatchArray => m !== null)
          .map((m) => Number(m[1]));
        return widths.length ? Math.max(...widths) : img.naturalWidth;
      };

      for (const img of Array.from(document.images)) {
        const rect = img.getBoundingClientRect();

        // Skip anything not actually painted or not loaded.
        if (rect.width < 1 || rect.height < 1) continue;
        if (!img.complete || img.naturalWidth === 0) continue;

        const src = img.currentSrc || img.src || '(unknown)';

        // Vector formats are resolution-independent — always sharp.
        if (/\.svg(\?|$)/i.test(src) || src.startsWith('data:image/svg')) continue;

        const needed = rect.width * density;
        const available = widestAvailable(img);
        if (needed > available * slack) {
          violations.push({
            src,
            detail: `displayed ${Math.round(rect.width)}px needs ${Math.round(
              needed,
            )}px for ${density}× density but the widest available source is only ${available}px`,
          });
        }
      }

      return violations;
    },
    { density: targetDensity, slack: tolerance },
  );
}

test.describe('Render sharpness (retina)', () => {
  for (const path of PAGES) {
    for (const bp of BREAKPOINTS) {
      test(`${path} offers retina-sharp images at ${bp.name} (${bp.width}px)`, async ({
        page,
      }) => {
        await page.setViewportSize({ width: bp.width, height: bp.height });
        await page.goto(path);
        await waitForFullLoad(page);
        await triggerLazyImages(page);

        const violations = await collectViolations(
          page,
          TARGET_DENSITY,
          SHORTFALL_TOLERANCE,
        );

        if (violations.length > 0) {
          const report = violations
            .map((v) => `  ${v.src}\n    → ${v.detail}`)
            .join('\n');
          console.log(`Sharpness violations on ${path} @ ${bp.name}:\n${report}`);
        }

        expect(
          violations,
          `Under-resolution images on ${path} at ${bp.name} (${bp.width}px, ${TARGET_DENSITY}× target):\n${violations
            .map((v) => `${v.src} — ${v.detail}`)
            .join('\n')}`,
        ).toEqual([]);
      });
    }
  }
});
