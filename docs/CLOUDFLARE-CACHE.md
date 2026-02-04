# Cloudflare Cache Purging

This document explains how Cloudflare cache purging works for this site and how to configure it.

## Overview

The site automatically purges Cloudflare's cache after every successful deployment to GitHub Pages. This ensures visitors immediately see the latest content without waiting for cached assets to expire.

## How It Works

1. **Content Hashing**: Astro automatically generates content-hashed filenames for JavaScript and CSS assets (e.g., `global.E-nqILv5.css`, `bundle.BtC7CkZI.js`). When content changes, the hash changes, creating a new URL.

2. **Cache Purge**: After deployment, the GitHub Actions workflow calls the Cloudflare API to purge all cached content using the `/purge_cache` endpoint with `purge_everything: true`.

3. **Fresh Content**: Visitors get the latest version immediately, even for assets without content hashes like images and static files.

## Configuration

### Required Secrets

The deployment workflow requires two GitHub repository secrets:

1. **`CLOUDFLARE_ZONE_ID`**: Your Cloudflare zone ID
   - Find this in Cloudflare Dashboard → Domain Overview (right sidebar)
   - Example: `a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6`

2. **`CLOUDFLARE_API_TOKEN`**: An API token with cache purge permissions
   - Create at: Cloudflare Dashboard → My Profile → API Tokens → Create Token
   - Use "Edit zone DNS" template or create custom token
   - Required permission: **Zone → Cache Purge → Purge**
   - Recommended: Scope to specific zone (ben.balter.com)

### Setting Up Secrets

1. Go to GitHub repository → Settings → Secrets and variables → Actions
2. Click "New repository secret"
3. Add both secrets:
   - Name: `CLOUDFLARE_ZONE_ID`, Value: `your-zone-id`
   - Name: `CLOUDFLARE_API_TOKEN`, Value: `your-api-token`

### Verification

After setting up secrets, the next deployment will automatically purge the cache. Check:

1. GitHub Actions logs for "Purge Cloudflare Cache" step
2. Cloudflare Dashboard → Analytics → Security → Cache Purge events
3. Success indicated by Cloudflare API JSON response (`"success": true` and empty `errors`), not just HTTP 200 status

## Workflow Details

The cache purge happens in `.github/workflows/build-and-deploy.yml`:

```yaml
- name: Purge Cloudflare Cache
  if: success()
  run: |
    response=$(curl -sS -f -X POST "https://api.cloudflare.com/client/v4/zones/${{ secrets.CLOUDFLARE_ZONE_ID }}/purge_cache" \
      -H "Authorization: Bearer ${{ secrets.CLOUDFLARE_API_TOKEN }}" \
      -H "Content-Type: application/json" \
      --data '{"purge_everything":true}') || { echo "Cloudflare cache purge request failed"; exit 1; }
    echo "Cloudflare API response: $response"
    api_success=$(echo "$response" | jq -r '.success // empty')
    errors=$(echo "$response" | jq -c '.errors // []')
    if [ "$api_success" != "true" ] || [ "$errors" != "[]" ]; then
      echo "Cloudflare cache purge reported failure."
      echo "Errors: $errors"
      exit 1
    fi
    echo "✓ Cloudflare cache purged successfully"
```

**Key Points:**

- Only runs if deployment succeeds (`if: success()`)
- Uses `-sS` flags for silent mode with error display
- Uses `-f` flag to fail on HTTP errors (4xx/5xx responses)
- Captures and displays API response for verification
- Validates JSON response to ensure `success: true` and no errors
- Displays success message only after validating the response
- Uses `purge_everything: true` to clear all cached content
- Uses cURL to call Cloudflare API directly
- No external GitHub Actions dependencies

## Alternative: Selective Cache Purge

Instead of purging everything, you can purge specific files or use cache tags for more granular control.

### Purge by File URLs

To purge only changed files, you would need to:

1. Determine which files changed in the deployment (e.g., by comparing build artifacts)
2. Generate a list of URLs for changed files
3. Pass them to the Cloudflare API

Example workflow modification:

```yaml
# Purge specific file URLs
--data '{"files":["https://ben.balter.com/assets/global.css","https://ben.balter.com/index.html"]}'
```

**Trade-offs:**

- **Pros**: Reduces cache purge overhead; preserves cache for unchanged content
- **Cons**: More complex implementation; requires tracking changed files; risk of missing dependent files (e.g., a CSS file used by an HTML page)

### Purge by Cache Tags (Enterprise only)

Cache tags require a Cloudflare Enterprise plan. If available, you can tag responses and purge by tag:

```yaml
# Purge by cache tags
--data '{"tags":["blog","css"]}'
```

### Why `purge_everything` is Used

The current implementation uses `purge_everything: true` because:

1. **Simplicity**: No need to track file changes or dependencies
2. **Reliability**: Ensures all content is fresh, including indirect references
3. **Asset hashing**: Astro already generates content-hashed filenames for JS/CSS (e.g., `global.E-nqILv5.css`), which provides automatic cache busting for those assets
4. **Static site**: The entire site rebuilds on each deploy, so most content changes anyway
5. **Low cost**: Cloudflare allows frequent cache purges without significant performance impact

For this use case (static site with content-hashed assets), `purge_everything` provides the best balance of simplicity and reliability.

## Troubleshooting

### "401 Unauthorized"

- Check `CLOUDFLARE_API_TOKEN` is correct and not expired
- Verify token has "Zone.Cache Purge" permission
- Ensure token is scoped to the correct zone

### "403 Forbidden"

- Token doesn't have required permissions
- Recreate token with "Zone.Cache Purge" permission

### "Invalid zone ID"

- Verify `CLOUDFLARE_ZONE_ID` matches your domain's zone ID
- Check for typos or extra spaces in the secret value

### Cache Not Purging

1. Check workflow logs in GitHub Actions
2. Verify secrets are set correctly
3. Test API manually:

   ```bash
   curl -X POST "https://api.cloudflare.com/client/v4/zones/YOUR_ZONE_ID/purge_cache" \
     -H "Authorization: Bearer YOUR_API_TOKEN" \
     -H "Content-Type: application/json" \
     --data '{"purge_everything":true}'
   ```

### Sitemap Redirect Loop (ERR_TOO_MANY_REDIRECTS)

If `/sitemap-index.xml` or `/sitemap-0.xml` returns `ERR_TOO_MANY_REDIRECTS`, this is typically caused by Cloudflare Page Rules that were set up for an older version of the site.

**Symptoms:**

- `/sitemap-index.xml` redirects to `/sitemap-0.xml`
- `/sitemap-0.xml` redirects to itself (infinite loop)
- Error: `ERR_TOO_MANY_REDIRECTS`

**Solution:**

1. Log in to Cloudflare Dashboard
2. Select the zone (ben.balter.com)
3. Go to **Rules** → **Page Rules**
4. Look for rules that match `*sitemap*.xml` or similar patterns
5. Delete or disable any rules that redirect sitemap URLs

**Note:** The Astro site generates these sitemap files:

- `/sitemap-index.xml` - Sitemap index (points to individual sitemaps)
- `/sitemap-0.xml` - Actual sitemap with URLs
- `/sitemap.xml` - Redirect to `/sitemap-0.xml` (for Jekyll backward compatibility)
- `/sitemap_index.xml` - Redirect to `/sitemap-index.xml` (for Jekyll backward compatibility)

The only redirects needed are the two backward compatibility redirects (`sitemap.xml` and `sitemap_index.xml`), which are handled by the site's HTML meta refresh redirects. No Cloudflare Page Rules are needed for sitemaps.

## Security Best Practices

1. **Minimal Permissions**: API token should only have cache purge permission
2. **Zone Scoping**: Restrict token to specific zone (ben.balter.com)
3. **Secret Rotation**: Rotate API tokens periodically
4. **Don't Commit**: Never commit secrets to the repository
5. **Limited Exposure**: Tokens are only exposed to GitHub Actions runners

## References

- [Cloudflare Cache API Documentation](https://developers.cloudflare.com/api/operations/zone-purge)
- [GitHub Actions Secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [Astro Build Configuration](https://docs.astro.build/en/reference/configuration-reference/#build-options)
