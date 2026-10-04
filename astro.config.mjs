import { defineConfig, fontProviders } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import favicons from 'astro-favicons';
import compress from '@playform/compress';
import checks from '@nuasite/checks';
import expressiveCode from 'astro-expressive-code';
import { pluginCollapsibleSections } from '@expressive-code/plugin-collapsible-sections';
import AutoImport from 'astro-auto-import';
import pdf from 'astro-pdf';
import { preview as astroPreview } from 'astro';
import { fileURLToPath } from 'node:url';
import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { PDFDocument } from 'pdf-lib';
import { visualizer } from 'rollup-plugin-visualizer';
import {
  sharedRemarkPlugins,
  sharedRehypePlugins,
} from './src/lib/markdown-pipeline.ts';
import { buildLastmodIndex, lastmodForUrl } from './src/utils/sitemap-lastmod.ts';
import {
  loadRoutedEntries,
  sitemapExclusions,
  frontMatterRedirects,
  formatRedirects,
  redirectSources,
} from './src/utils/front-matter-routes.ts';

// URL patterns for sitemap priority calculation
const BLOG_POST_PATTERN = /\/\d{4}\/\d{2}\/\d{2}\//;

// Pattern for detecting simple page names (not dynamic routes like "_slug_")
// Used in Vite config below to rename shared CSS bundles
const PAGE_NAME_PATTERN = /^[a-z0-9-]+$/;

// Posts and pages front matter, read once at config load. Drives sitemap
// exclusions (`sitemap: false`, `redirect_to`) and the generated `_redirects`
// rules (`redirect_from`, `redirect_to`). See src/utils/front-matter-routes.ts.
const routedEntries = loadRoutedEntries();

// Pages excluded from the sitemap. Content entries opt out with
// `sitemap: false` in front matter; only non-content routes (.astro pages
// without front matter) belong in the hardcoded list.
// Format: Use the final URL path with trailing slash
const EXCLUDED_PAGES = [
  '/404/',
  '/_not-found/',
  '/fine-print/', // Legal boilerplate; had sitemap: false in the Jekyll source
  '/resume/linkedin/', // Utility page, not for search engines
  '/resume/print/', // Print-only PDF source (noindex), rendered to /resume.pdf
  ...sitemapExclusions(routedEntries),
];


// Sitemap <lastmod> index (file path → last commit date), built lazily.
let lastmodIndex;

// https://astro.build/config
export default defineConfig({
  // Output directory for built site (separate from Jekyll _site/)
  outDir: './dist-astro',
  
  // Build settings for static site generation
  output: 'static',
  
  // Base URL configuration
  // This can be configured via environment variable if needed
  site: 'https://ben.balter.com',
  base: '/',
  
  // Trailing slashes to match static host conventions (Cloudflare Workers Static Assets)
  trailingSlash: 'always',

  // Minify HTML output (removes whitespace, comments)
  compressHTML: true,

  // Content Security Policy, emitted per page as a <meta> tag. Astro hashes
  // every inline script it renders, so script-src needs no 'unsafe-inline'.
  // This is the whole policy except `frame-ancestors`, which a <meta> CSP
  // can't carry; that one stays in public/_headers. Keep domain allowlists
  // here only: browsers enforce the header and <meta> policies together, so
  // a script-src or default-src in the header would block the hashed scripts.
  //
  // style-src keeps 'unsafe-inline': expressive-code (Shiki) and content emit
  // inline <style> blocks and style="" attributes that can't be hashed, and
  // Astro skips style hashes when 'unsafe-inline' is present.
  security: {
    csp: {
      directives: [
        "default-src 'self'",
        "img-src 'self' data: https:",
        "font-src 'self' data:",
        "connect-src 'self' https://cloudflareinsights.com https://api.github.com",
        // challenges.cloudflare.com: the Turnstile widget on the subscribe form.
        'frame-src https://www.youtube-nocookie.com https://www.youtube.com https://challenges.cloudflare.com',
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'self'",
        'upgrade-insecure-requests',
      ],
      scriptDirective: {
        // 'wasm-unsafe-eval' lets Pagefind instantiate its WebAssembly index.
        // challenges.cloudflare.com serves Turnstile, loaded when the subscribe form gets focus.
        resources: ["'self'", "'wasm-unsafe-eval'", 'https://static.cloudflareinsights.com', 'https://challenges.cloudflare.com'],
      },
      styleDirective: {
        resources: ["'self'", "'unsafe-inline'"],
      },
    },
  },
  
  // Redirects are handled at the Cloudflare edge via public/_redirects
  // (faster than Astro's HTML meta-refresh redirects, no malformed HTML)
  
  // Prefetch configuration for faster navigation
  // Use hover strategy to balance speed with bandwidth usage
  // NOTE: Cloudflare refuses speculative prefetch for Worker-served requests
  // ("Cf-Speculation-Refused: disabled for worker requests"), so prefetchAll
  // produced a burst of 503s on every page with no benefit. Keep it off.
  prefetch: {
    prefetchAll: false,
    defaultStrategy: 'hover',
  },
  
  // Font optimization via Astro's built-in Fonts API
  // Self-hosted via Fontsource for privacy (no third-party requests)
  // Inter (sans-serif) for headings and UI; Lora (serif) for long-form prose
  //
  // display: 'swap' — always ends up on the real font (avoids the
  // refresh-to-refresh inconsistency that `optional` produces when the font
  // misses its 100ms budget). The visible font swap is softened by Astro's
  // auto-generated size-adjust / ascent-override fallback (enabled by default
  // when the last entry in `fallbacks` is a generic family like `sans-serif` or
  // `serif`).
  fonts: [
    {
      provider: fontProviders.fontsource(),
      name: 'Inter',
      cssVariable: '--font-inter',
      weights: [400, 600, 700],
      styles: ['normal', 'italic'],
      subsets: ['latin'],
      fallbacks: ['sans-serif'],
      display: 'swap',
    },
    {
      provider: fontProviders.fontsource(),
      name: 'Lora',
      cssVariable: '--font-lora',
      weights: [400, 500, 700],
      styles: ['normal', 'italic'],
      subsets: ['latin'],
      fallbacks: ['Georgia', 'serif'],
      display: 'swap',
    },
  ],
  
  // Build configuration
  build: {
    // Output format
    format: 'directory',
    // Assets directory
    assets: 'assets',
    // Inline all stylesheets into HTML to eliminate render-blocking CSS requests
    // This improves Speed Index by allowing content to paint faster
    // Trade-off: Larger HTML files but faster initial paint
    inlineStylesheets: 'always',
  },
  
  // Server configuration for development
  server: {
    // Use a different port than Jekyll (4000)
    port: 4321,
    host: true,
  },
  
  // Image optimization configuration
  // Allowlist remote image domains for Astro's Image component
  image: {
    // Default layout for responsive images (generates srcset/sizes automatically)
    layout: 'constrained',
    // Add global responsive image styles
    responsiveStyles: true,
    // Codec-specific encoding defaults (Astro 6.1+)
    // Applied to every image processed by Sharp during the build.
    // Per-image `quality` still takes precedence when set.
    service: {
      config: {
        jpeg: { mozjpeg: true },
        webp: { effort: 6 },
        avif: { effort: 4 },
        png: { compressionLevel: 9 },
      },
    },
    domains: [
      // Author avatar (MiniBio), optimized at build time like any remote image
      'avatars.githubusercontent.com',
      // Amazon book covers (used in other-recommended-reading page)
      'images.amazon.com',
      // Post header images from various sources
      'ben.balter.com',
      'user-images.githubusercontent.com',
      'github.com',
      'hackernoon.com',
    ],
  },
  
  // Integrations
  integrations: [
    // Fetch GitHub avatar at build time (must run first)
    favicons({
      // Use existing high-quality PNG as source
      // The integration will generate all favicon formats automatically
      // Path includes 'public/' as shown in astro-favicons documentation examples
      input: {
        favicons: ['android-chrome-512x512.png'],
      },
      name: 'Ben Balter',
      short_name: 'Ben Balter',
      // Automatically inject favicon tags into all pages
      output: {
        images: true,
        files: true,
        html: true,
      },
    }),
    // Expressive Code for enhanced code blocks (must be before mdx)
    expressiveCode({
      themes: ['github-light', 'github-dark'],
      plugins: [pluginCollapsibleSections()],
      defaultProps: {
        collapseStyle: 'collapsible-auto',
      },
      styleOverrides: {
        borderRadius: '0.375rem',
      },
    }),
    // Auto-import common MDX components (must be before mdx)
    AutoImport({
      imports: [
        // Site components available in all MDX files without explicit imports
        './src/components/Callout.astro',
        './src/components/GitHubCulture.astro',
        './src/components/FossAtScale.astro',
        './src/components/YouTube.astro',
        './src/components/BookLaunchCta.astro',
        // astro-embed components for zero-JS social embeds
        {
          'astro-embed': ['Tweet', 'Vimeo', 'LinkPreview'],
        },
      ],
    }),
    mdx({
      // MDX configuration
      optimize: true,
      // Inherits the unified() processor (and its remark/rehype plugins) from
      // the global markdown config by default — no per-format duplication needed.
    }),
    sitemap({
      // Customize sitemap generation
      filter: (page) => {
        // Exclude non-content utility pages and front matter opt-outs
        return !EXCLUDED_PAGES.some(pattern => page.includes(pattern));
      },
      // Customize URL entries with priority and changefreq
      serialize: (item) => {
        // Set priority and changefreq based on URL pattern
        let priority = 0.6; // Default for static pages
        let changefreq = 'monthly';
        
        // Homepage gets highest priority
        if (item.url === 'https://ben.balter.com/') {
          priority = 1.0;
          changefreq = 'weekly';
        }
        // Blog posts get high priority
        else if (BLOG_POST_PATTERN.test(item.url)) {
          priority = 0.8;
          changefreq = 'monthly';
        }
        
        // Built once, on the first sitemap entry: a single `git log` pass.
        lastmodIndex ??= buildLastmodIndex();
        const lastmod = lastmodForUrl(item.url, lastmodIndex);

        return {
          ...item,
          priority,
          changefreq,
          ...(lastmod && { lastmod }),
        };
      },
    }),
    // Expose the generated sitemap at the conventional /sitemap.xml path.
    // @astrojs/sitemap emits sitemap-index.xml + sitemap-0.xml; agents and
    // validators (and the Sitemaps protocol convention) often probe the bare
    // /sitemap.xml. Copy the single generated urlset chunk to sitemap.xml so
    // that path serves a real <urlset> of <url><loc> entries at HTTP 200 —
    // single source of truth, no duplicated URL/priority logic. Registered
    // after sitemap() so its astro:build:done runs once the chunk exists.
    {
      name: 'sitemap-xml-alias',
      hooks: {
        'astro:build:done': async ({ dir, logger }) => {
          const outDir = fileURLToPath(dir);
          const source = join(outDir, 'sitemap-0.xml');
          const dest = join(outDir, 'sitemap.xml');
          let contents;
          try {
            contents = await readFile(source, 'utf-8');
          } catch {
            // A future @astrojs/sitemap rename or multi-chunk split (>45k URLs)
            // would break this assumption — fail loudly rather than silently
            // shipping without /sitemap.xml.
            throw new Error(
              `sitemap-xml-alias: expected ${source} to exist. Did @astrojs/sitemap change its filenameBase or split into multiple chunks?`
            );
          }
          await writeFile(dest, contents);
          logger.info('Copied sitemap-0.xml to sitemap.xml');
        },
      },
    },
    // Append front matter redirects (`redirect_from`, `redirect_to`) to the
    // built _redirects. public/_redirects keeps only the non-content rules;
    // Cloudflare static assets read the final file from the output dir.
    {
      name: 'front-matter-redirects',
      hooks: {
        'astro:build:done': async ({ dir, logger }) => {
          const file = join(fileURLToPath(dir), '_redirects');
          const existing = await readFile(file, 'utf-8');
          const lines = formatRedirects(frontMatterRedirects(routedEntries));
          const seen = new Set(redirectSources(existing));
          for (const line of lines) {
            const [source] = line.split(' ');
            if (seen.has(source)) {
              throw new Error(
                `front-matter-redirects: duplicate source ${source}. Remove it from public/_redirects or front matter, not both.`
              );
            }
            seen.add(source);
          }
          const block = ['', '# Generated at build from redirect_from / redirect_to front matter', ...lines, ''];
          await writeFile(file, existing.replace(/\n*$/, '\n') + block.join('\n'));
          logger.info(`Appended ${lines.length} front matter redirects to _redirects`);
        },
      },
    },
    compress({
      // Compress HTML, CSS, JavaScript, SVG, and JSON for better performance
      CSS: {
        // Use lightningcss for faster, more modern CSS minification
        lightningcss: {},
        csso: false,
      },
      HTML: {
        'html-minifier-terser': {
          removeAttributeQuotes: false, // Keep quotes for better compatibility
          collapseWhitespace: true,
          conservativeCollapse: true,
          removeComments: true,
          // Keep html-validate inline directives (e.g. `<!-- html-validate-disable-next
          // no-autoplay -->` in a post) so CI's html-validate run on dist-astro sees
          // them. The first two entries are html-minifier-terser's defaults.
          ignoreCustomComments: [/^!/, /^\s*#/, /^\s*html-validate-/],
          removeRedundantAttributes: false,
          removeEmptyAttributes: true,
          minifyCSS: true,
          // Off: inline scripts must stay byte-identical to what Astro hashed
          // for the CSP <meta> (security.csp), or browsers block them. Vite
          // already minifies Astro's inline module scripts.
          minifyJS: false,
        },
      },
      Image: false, // Images are already optimized by Astro's Sharp pipeline
      JavaScript: true,
      SVG: true,
      JSON: true,
      Logger: 1, // Reduce build log noise (0=silent, 1=minimal, 2=verbose)
    }),
    checks({
      // Validate SEO, accessibility, performance, and GEO at build time
      mode: 'essential',
      seo: true,
      geo: true,
      performance: true,
      accessibility: true,
      ai: false,
      failOnError: true,
      failOnWarning: false,
      overrides: {
        // Twitter rebranded; site uses twitter:card tags which are still valid
        'seo/twitter-card': false,
        // Descriptions are intentionally allowed to run long — only the first
        // ~150 chars are optimized for SERP (see CLAUDE.md / script/validate-seo.ts).
        // The >160 warning is a false positive for this site's policy.
        'seo/description-length': false,
        // Titles are an editorial call, and the 60-char limit counts the
        // " | Ben Balter" suffix. It flagged ~90 existing posts on every build,
        // burying any new warning. Distribution is share-driven, not SERP-driven.
        'seo/title-length': false,
      },
    }),
    // Render the print-only /resume/print page to a downloadable /resume.pdf.
    // Runs after Astro emits all pages, serves them via `astro preview`, and
    // prints with Chromium. /resume/print is a standalone, two-column sheet
    // built for paper (navy sidebar + flowing experience column); the on-site
    // /resume page is unaffected. Chromium is auto-installed at build time if
    // not already cached.
    //
    // Gated behind SKIP_PDF so local dev can `astro build` without a working
    // puppeteer Chromium (set SKIP_PDF=1). CI and production leave it unset, so
    // resume.pdf is still generated on deploy.
    ...(process.env.SKIP_PDF ? [] : [pdf({
      // CI runners (Ubuntu 24.04) disable unprivileged user namespaces, so
      // Chromium's sandbox can't start ("No usable sandbox"). Safe to disable
      // here — we render only our own trusted, just-built pages. No-op locally.
      launch: { args: ['--no-sandbox'] },
      // astro-pdf's default preview server builds its URL from the Astro
      // config's `server.host`, which is `true` here (bind all interfaces) —
      // that yields an invalid `http://true:PORT` URL. Bind IPv4 loopback
      // explicitly and hand back a clean URL so it works locally and in CI.
      server: async (config) => {
        const server = await astroPreview({
          root: fileURLToPath(config.root),
          logLevel: 'error',
          server: { host: '127.0.0.1' },
        });
        return {
          url: new URL(`http://127.0.0.1:${server.port}`),
          close: () => server.stop(),
        };
      },
      pages: {
        // Site uses `trailingSlash: 'always'`, so the page is served at
        // `/resume/print/`; the bare path 404s on the static preview server.
        '/resume/print/': {
          path: 'resume.pdf',
          waitUntil: 'networkidle0',
          pdf: {
            format: 'Letter',
            printBackground: true,
            // Honor the page's `@page { size: Letter; margin: 0.5in 0 }` rule so
            // the page-1 navy sidebar panel can reach the left edge.
            preferCSSPageSize: true,
            // Emit heading bookmarks so the multi-page resume is navigable
            // (name → each employer).
            // Puppeteer only builds the outline for a tagged PDF, and `tagged`
            // also makes the file accessible to screen readers. The pdf-lib
            // metadata pass below preserves the /Outlines tree.
            tagged: true,
            outline: true,
          },
        },
      },
      // Chromium leaves the document Author/Subject/Keywords blank and stamps a
      // raw "HeadlessChrome / Skia" producer. Post-process with pdf-lib to set
      // proper metadata so the file reads well when shared, emailed, or indexed.
      runAfter: async (dir, pathnames) => {
        const outDir = fileURLToPath(dir);
        for (const pathname of pathnames) {
          if (!pathname.endsWith('.pdf')) continue;
          const file = join(outDir, pathname);
          const doc = await PDFDocument.load(await readFile(file));
          doc.setTitle('Ben Balter, Résumé');
          doc.setAuthor('Ben Balter');
          doc.setSubject('Résumé of Ben Balter, product leader');
          doc.setKeywords([
            'Ben Balter',
            'resume',
            'product leader',
            'trust and safety',
            'platform security',
            'developer platforms',
            'GitHub',
          ]);
          doc.setCreator('ben.balter.com');
          doc.setProducer('ben.balter.com');
          await writeFile(file, await doc.save());
        }
      },
    })]),
  ],
  
  // Markdown configuration
  // Syntax highlighting handled by astro-expressive-code integration.
  // Astro 7 defaults to the Sätteri processor; we stay on the remark/rehype
  // (unified) pipeline via `@astrojs/markdown-remark`. The MDX integration
  // inherits `markdown.processor` by default, so .mdx files use it too.
  markdown: {
    processor: unified({
      // Typographic punctuation (quotes and apostrophes)
      smartypants: true,
      // Remark plugins (for markdown processing)
      remarkPlugins: sharedRemarkPlugins,
      // Rehype plugins (for HTML processing)
      rehypePlugins: sharedRehypePlugins,
    }),
  },
  
  // Vite configuration
  vite: {
    // Tailwind CSS v4 uses the Vite plugin instead of the deprecated @astrojs/tailwind integration
    plugins: [
      tailwindcss(),
      // Bundle size analysis, opt-in via ANALYZE=1. Written outside dist-astro/
      // so the report never ships to production.
      ...(process.env.ANALYZE
        ? [visualizer({
          filename: '.astro/stats.html',
          gzipSize: true,
          brotliSize: true,
          emitFile: false,
        })]
        : []),
    ],
    // Ensure compatibility with existing build tools
    build: {
      // Separate chunk directory to avoid conflicts
      assetsDir: 'assets',
      rollupOptions: {
        output: {
          // Customize asset file naming to avoid misleading names
          // Astro/Vite creates a shared CSS bundle from BaseLayout's global.css import
          // and names it after one of the pages (e.g., "about"). We rename it to "global"
          // to accurately reflect that it's the site's main stylesheet, not page-specific CSS.
          assetFileNames: (assetInfo) => {
            if (!assetInfo || !assetInfo.name) {
              return 'assets/[name].[hash][extname]';
            }
            
            if (assetInfo.name.endsWith('.css')) {
              const name = assetInfo.name.replace(/\.css$/, '');
              
              // Detect shared stylesheet: simple page names (not dynamic routes like "_slug_")
              // Match: about, contact, resume, index, fine-print, books-for-geeks, etc.
              // Don't match: _slug_, _year_, or other special patterns
              const isNotDynamicRoute = !name.startsWith('_');
              const matchesPagePattern = PAGE_NAME_PATTERN.test(name);
              const isPageName = isNotDynamicRoute && matchesPagePattern;
              
              if (isPageName) {
                // This is the shared global stylesheet - rename it for clarity
                return 'assets/global.[hash].css';
              }
              
              return 'assets/[name].[hash].css';
            }
            
            return 'assets/[name].[hash][extname]';
          },
        },
      },
    },
    // Enable build optimizations
    minify: true,
    cssMinify: true,
  },
});
