# Cloudflare Workers Deployment

This document explains how the site is deployed to Cloudflare Workers using Workers Static Assets.

## Overview

The site is deployed directly to Cloudflare Workers via Wrangler. Cloudflare Workers Static Assets automatically handles serving static files, so no manual cache purging is needed.

## How It Works

1. **Build**: GitHub Actions builds the Astro site, outputting static files to `dist-astro/`
2. **Deploy**: [`build-and-deploy.yml`](../.github/workflows/build-and-deploy.yml) runs `npx wrangler deploy` to upload the build output and the Worker in [`worker/index.js`](../worker/index.js)
3. **Cache**: Cloudflare Workers automatically invalidates its cache on each new deployment. Astro also generates content-hashed filenames for JS/CSS assets (e.g., `global.E-nqILv5.css`), providing additional cache busting.

## Configuration

### Required Secrets

The deployment workflow requires two GitHub repository secrets:

1. **`CLOUDFLARE_ACCOUNT_ID`**: Your Cloudflare account ID
   - Find this in Cloudflare Dashboard → any domain → Overview (right sidebar)

2. **`CLOUDFLARE_API_TOKEN`**: An API token with Cloudflare Workers permissions
   - Create at: Cloudflare Dashboard → My Profile → API Tokens → Create Token
   - Use the "Edit Cloudflare Workers" template, or create a custom token with:
     - **Account → Cloudflare Workers Scripts → Edit**
   - Recommended: Scope to your account

### Setting Up Secrets

1. Go to GitHub repository → Settings → Secrets and variables → Actions
2. Click "New repository secret"
3. Add both secrets:
   - Name: `CLOUDFLARE_ACCOUNT_ID`, Value: `your-account-id`
   - Name: `CLOUDFLARE_API_TOKEN`, Value: `your-api-token`

### Project Configuration

The Cloudflare Workers project is configured in `wrangler.json`:

See [`wrangler.json`](../wrangler.json) for the full config. The parts worth knowing:

- `main: worker/index.js`: a small Worker that handles `POST /api/event` (Analytics Engine) and passes anything else to `env.ASSETS`.
- `assets.run_worker_first`: only `/api/event` hits the Worker; everything else goes straight to static assets.
- `analytics_engine_datasets`: the `ENGAGEMENT` binding.

### Custom Domain

Configure your custom domain in Cloudflare Dashboard → Workers & Pages → your worker → Settings → Domains & Routes. The `CNAME` file in the repository root is no longer used for deployment.

## Headers and Redirects

Cloudflare Workers Static Assets uses files in the `public/` directory:

- **`public/_headers`**: Security headers, caching rules, and CSP
- **`public/_redirects`**: URL redirects (301s for old slugs, feed URLs, etc.)

These are automatically picked up by Cloudflare Workers Static Assets during deployment.

### Which requests run the Worker

- **`assets.run_worker_first`** in `wrangler.json` sends only `/api/event` through [`worker/index.js`](../worker/index.js), which records engagement events. Every other request, pages included, is served straight from the asset layer, where `_headers` and `_redirects` still apply. Every Worker invocation counts against the account's Workers Free daily request cap (past the cap, [requests matching `run_worker_first` get a 429](https://developers.cloudflare.com/workers/static-assets/billing-and-limitations/) while the rest keep serving), so page views shouldn't spend it. [`worker/routing.test.js`](../worker/routing.test.js) fails if pages or static files would run the Worker, or if `/api/event` wouldn't.
- **Markdown content negotiation** (`Accept: text/markdown` gets the page's pre-built `.md` from [`src/pages/**/*.md.ts`](../src/pages/)) is done by zone rules, not the Worker, so it doesn't cost a Worker run per page view. See the zone-level list below. [`script/validate-markdown-siblings`](../script/validate-markdown-siblings) runs after the build in CI and fails if a page those rules rewrite has no `.md` file, and [`script/check-markdown-negotiation`](../script/check-markdown-negotiation) checks the live behavior. `public/_headers` sets `charset=utf-8` on `.md` files.

## Zone-level config (dashboard, not in this repo)

Some settings live on the `balter.com` zone in the Cloudflare dashboard. Zone response Transform Rules and Redirect Rules run around the Worker and override `_headers` and `_redirects`, so anything here silently wins over the repo. Keep this list short, and keep headers and site redirects in the repo.

- **Redirect Rule**: `balter.com` and `www.balter.com` → `https://ben.balter.com/`. It can't live in `_redirects` because those hosts don't route to the Worker.
- **URL Rewrite Rules** (Markdown content negotiation): a `GET`/`HEAD` that accepts `text/markdown` (and doesn't refuse it with `q=0`) for `/`, `/about/`, `/resume/`, or a post (`/2*/*/*/*/`) is rewritten to the matching `.md` file: `/` to `/index.md`, `/YYYY/MM/DD/slug/` to `/YYYY/MM/DD/slug.md`. Other pages keep serving HTML. Without regex on the Free plan, `text/markdown;q=0.5` counts as a refusal.
- **Response header Transform Rules**: add `Vary: Accept` to page URLs, and set `Cache-Control: private, max-age=300` on negotiated Markdown so shared caches (Cloudflare's doesn't vary on `Accept`) never hand it to a browser. `Vary` uses `add`, so it never replaces a value from `_headers`, and the `Cache-Control` override applies only to negotiated Markdown.
- **WAF custom rule**: blocks WordPress and PHP probe paths (`*.php`, `/wp-admin`, `/wp-includes`, `/xmlrpc.php`) at the edge; `/wp-content/` stays served.
- **Rate limiting rule**: `/api/event` is capped per IP (Free plan: path-only match, 10-second window).
- **Speed and TLS**: HTTP/3, 0-RTT, Early Hints, Speed Brain, Brotli, tiered cache, DNSSEC, strict SSL, and HSTS are all on.
- **No response header Transform Rules.** If a header in `_headers` isn't showing up live, check Rules → Transform Rules and Settings → Managed Transforms first.

## Security Best Practices

1. **Minimal Permissions**: API token should only have Cloudflare Workers edit permission
2. **Account Scoping**: Restrict token to your specific account
3. **Secret Rotation**: Rotate API tokens periodically
4. **Don't Commit**: Never commit secrets to the repository

## References

- [Cloudflare Workers Static Assets](https://developers.cloudflare.com/workers/static-assets/)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/)
- [GitHub Actions Secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
