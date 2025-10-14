# Production Asset 404 Fix

## Problem
CSS and JS assets return 404 errors in production, causing the site to appear unstyled. The issue stems from:
1. Stale HTML being cached with old asset filenames
2. Missing cache control headers
3. Build configuration not explicitly setting output paths

## Root Causes Identified

### 1. **Cached HTML with Mismatched Asset Hashes**
When Vite builds, it generates hashed filenames (e.g., `index-C_WbVWZE.css`). If the HTML is cached, it references old hashes that no longer exist, resulting in 404s.

### 2. **Missing Build Manifest**
Without `manifest: true`, some deployment platforms may not correctly map asset references.

### 3. **Aggressive Asset Caching Without HTML Cache Invalidation**
Assets were cached forever, but HTML wasn't set to `no-store`, causing stale asset references.

## Changes Applied

### ✅ 1. Updated `vite.config.ts`

**Added explicit build configuration:**
```ts
build: {
  outDir: 'dist',           // Explicit output directory
  assetsDir: 'assets',      // Explicit assets subdirectory
  manifest: true,           // Generate manifest.json for asset mapping
  // ... existing rollup options
}
```

**Why:** Ensures Vercel and other platforms correctly understand the build output structure and can map asset references.

### ✅ 2. Updated `vercel.json` - Cache Control Headers

**Added intelligent caching strategy:**
```json
{
  "headers": [
    {
      "source": "/(index.html)?",
      "headers": [
        { "key": "Cache-Control", "value": "no-store, must-revalidate" }
      ]
    },
    {
      "source": "/assets/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
      ]
    },
    {
      "source": "/(.*)",
      "headers": [
        { "key": "Content-Security-Policy", "value": "..." }
      ]
    }
  ]
}
```

**Why:**
- **HTML (`no-store`)**: Forces browsers to always fetch fresh HTML with current asset hashes
- **Assets (`immutable`)**: Hashed assets can be cached forever since filenames change when content changes
- **CSP**: Allows inline styles needed for Tailwind and third-party integrations

### ✅ 3. Verified `.vercelignore`

**Confirmed it does NOT block:**
- `/dist` directory
- `/assets` subdirectory
- Build outputs

**What it blocks (correctly):**
- SQL files and scripts
- Markdown documentation (except README)
- Test files
- Supabase functions (deployed separately)

## Build Verification ✅

### Production Build Results:
```bash
npm run build
```

**Output:**
```
dist/.vite/manifest.json              2.88 kB  # ✅ Manifest generated
dist/index.html                       7.99 kB  # ✅ Entry point
dist/assets/index-C_WbVWZE.css      160.35 kB  # ✅ CSS with hash
dist/assets/ui-BWRnXyJj.js          100.31 kB  # ✅ UI chunk
dist/assets/vendor-B1sUnLqs.js      142.26 kB  # ✅ Vendor chunk
dist/assets/supabase-BIWtLdqn.js    146.82 kB  # ✅ Supabase chunk
dist/assets/index-Bb4nJ0Mz.js     1,810.80 kB  # ✅ Main app chunk
```

### Asset References in HTML:
From `dist/index.html`:
```html
<link rel="stylesheet" crossorigin href="/assets/index-C_WbVWZE.css">
<script type="module" crossorigin src="/assets/index-Bb4nJ0Mz.js"></script>
<link rel="modulepreload" crossorigin href="/assets/vendor-B1sUnLqs.js">
<link rel="modulepreload" crossorigin href="/assets/ui-BWRnXyJj.js">
<link rel="modulepreload" crossorigin href="/assets/supabase-BIWtLdqn.js">
```

**✅ All asset paths are correctly formatted as `/assets/[filename]-[hash].[ext]`**

### Preview Server Test:
```bash
npm run preview
# ✅ Running on http://localhost:4174/
```

## Expected Production Behavior

### Before Fix:
```
Request: GET https://shalean.co.za/assets/index-OLD_HASH.css
Response: 404 Not Found
Reason: HTML cached with old hash, new build has different hash
```

### After Fix:
```
Request: GET https://shalean.co.za/
Response: 200 OK (HTML - no cache, always fresh)

Request: GET https://shalean.co.za/assets/index-C_WbVWZE.css
Response: 200 OK (CSS - cached forever, hash ensures uniqueness)
```

## Deployment Instructions

### 1. Commit Changes
```bash
git add .
git commit -m "fix: Prevent 404s on production assets with cache control and manifest"
```

### 2. Push to GitHub
```bash
git push origin fix/prod-assets-404
```

### 3. Create Pull Request & Merge
Merge `fix/prod-assets-404` → `main`

### 4. Verify on Vercel After Deployment

**Check in Browser DevTools (Network tab):**

1. **First Load:**
   - `GET /` → **200 OK** with `Cache-Control: no-store`
   - `GET /assets/index-[hash].css` → **200 OK** with `Cache-Control: public, max-age=31536000, immutable`
   - `GET /assets/index-[hash].js` → **200 OK** with `Cache-Control: public, max-age=31536000, immutable`

2. **Hard Refresh (Ctrl+Shift+R):**
   - HTML reloads (not from cache)
   - CSS/JS load from cache (304) OR fetch new if hash changed (200)

3. **Check Console:**
   - No 404 errors
   - No CSP violations
   - Styles applied correctly

### 5. If Still Getting 404s

**Verify the exact asset path being requested:**

1. Open DevTools → Network tab
2. Look for the 404 request
3. Check the **Request URL**

**Common scenarios:**

| Request URL | Issue | Fix |
|-------------|-------|-----|
| `/assets/index-[hash].css` | ✅ Correct | No action needed |
| `/cleanflow-book/assets/index-[hash].css` | ❌ Subpath deployment | Set `base: '/cleanflow-book/'` in vite.config.ts |
| `https://example.com/assets/index-[hash].css` | ❌ Wrong domain | Check Vercel domain settings |
| `/index-[hash].css` (no /assets/) | ❌ Assets not in subfolder | Verify `assetsDir: 'assets'` in build config |

## Files Changed

1. **`vite.config.ts`** - Added `outDir`, `assetsDir`, `manifest` to build config
2. **`vercel.json`** - Added cache-control headers for HTML and assets
3. **`.vercelignore`** - Verified (no changes needed, already correct)
4. **`PROD_ASSET_404_FIX.md`** - This documentation

## Technical Details

### Why Hashed Filenames?
Vite generates hashed filenames (content-based hashing) so:
- When files change, the hash changes
- Browsers automatically fetch the new version
- Old cached assets don't interfere with new deployments

### Cache Strategy Explained

**HTML - No Caching:**
```
Cache-Control: no-store, must-revalidate
```
- Browser never caches HTML
- Always gets latest asset references
- Ensures no stale hash references

**Assets - Infinite Caching:**
```
Cache-Control: public, max-age=31536000, immutable
```
- Assets cached for 1 year
- `immutable` tells browser file will NEVER change
- Safe because hash changes when content changes

## Troubleshooting Guide

### Issue: CSS still returns 404
**Solution:** Hard refresh (Ctrl+Shift+R) to bypass browser cache

### Issue: Assets load from wrong path
**Solution:** Check `base` in vite.config.ts matches deployment path

### Issue: Old styles showing
**Solution:** Clear Vercel cache and redeploy

### Issue: CSP blocking inline styles
**Solution:** Verify `style-src 'self' 'unsafe-inline'` in CSP header

## Success Indicators

✅ All assets return **200 OK**  
✅ CSS file size ~160 KB (not empty)  
✅ Site displays styled correctly  
✅ No console errors  
✅ Hard refresh loads fresh HTML  
✅ Assets load from cache on subsequent visits  

## Rollback Plan

If issues occur:
```bash
git checkout main
git branch -D fix/prod-assets-404
```

Previous configuration preserved in git history.

