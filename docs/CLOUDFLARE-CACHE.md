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
3. Success indicated by HTTP 200 response from Cloudflare API

## Workflow Details

The cache purge happens in `.github/workflows/build-and-deploy.yml`:

```yaml
- name: Purge Cloudflare Cache
  if: success()
  run: |
    response=$(curl -f -X POST "https://api.cloudflare.com/client/v4/zones/${{ secrets.CLOUDFLARE_ZONE_ID }}/purge_cache" \
      -H "Authorization: Bearer ${{ secrets.CLOUDFLARE_API_TOKEN }}" \
      -H "Content-Type: application/json" \
      --data '{"purge_everything":true}') && \
    echo "✓ Cloudflare cache purged successfully" && \
    echo "$response"
```

**Key Points:**

- Only runs if deployment succeeds (`if: success()`)
- Uses `-f` flag to fail on HTTP errors (4xx/5xx responses)
- Captures and displays API response for verification
- Displays success message only after curl completes successfully
- Uses `purge_everything: true` to clear all cached content
- Uses cURL to call Cloudflare API directly
- No external GitHub Actions dependencies

## Alternative: Selective Cache Purge

Instead of purging everything, you can purge specific files or tags. Modify the workflow:

```yaml
# Purge by file URLs
--data '{"files":["https://ben.balter.com/assets/global.css","https://ben.balter.com/index.html"]}'

# Purge by cache tags (requires Enterprise plan)
--data '{"tags":["blog","css"]}'
```

For most use cases, `purge_everything` is simplest and most reliable.

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
