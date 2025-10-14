# Production React Mount Fix - Deployment Guide

## Branch: `fix/prod-react-mount`

## Problem
Production app showing blank layout where CSS loads but React components don't mount properly. This is typically caused by:
- Stale cached HTML referencing old JS bundle hashes
- Vite dev-only plugins running in production builds
- Asset path mismatches

## Changes Made

### 1. ✅ Simplified Vite Configuration
**File: `vite.config.ts`**

- **Removed dev-only plugins**: Removed `lovable-tagger` which should only run in development
- **Enforced absolute base path**: Explicitly set `base: '/'` for correct asset URLs
- **Disabled sourcemaps**: Set `sourcemap: false` for cleaner production builds
- **Removed manual chunks**: Simplified to default chunking (can be re-added later if needed)
- **Kept manifest**: `manifest: true` ensures proper asset references

**Before:**
```typescript
export default defineConfig(({ mode }) => ({
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: { manualChunks: {...} }
    }
  }
}))
```

**After:**
```typescript
export default defineConfig({
  base: '/',
  plugins: [react()],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    manifest: true,
    sourcemap: false
  }
})
```

### 2. ✅ No-Cache Headers Already Configured
**File: `vercel.json`**

Already had proper cache control headers:
- HTML: `no-store, must-revalidate` - prevents browser caching of index.html
- Assets: `public, max-age=31536000, immutable` - allows long-term caching of hashed assets

### 3. ✅ No Service Workers Found
Searched entire codebase - no PWA/service worker code that could cause stale caching.

### 4. ✅ Clean Build Completed
- Removed corrupted `node_modules` and `dist`
- Fresh install: `npm install` 
- Production build: `npm run build`
- Build output: 2.2 MB JS bundle, 160 KB CSS

## Deployment Steps

### On Vercel (After Merge)

1. **Merge the PR** or deploy the `fix/prod-react-mount` branch to production

2. **Wait for Vercel deployment** to complete

3. **Clear browser cache** with hard reload:
   - **Chrome/Edge**: `Ctrl + Shift + R` (Windows) or `Cmd + Shift + R` (Mac)
   - **Firefox**: `Ctrl + Shift + Del` → Clear cache

4. **Verify in DevTools Console**:
   ```
   Open DevTools → Network Tab
   - index.html should show 200 status
   - index-[hash].js should show 200 status  
   - index-[hash].css should show 200 status
   
   Open DevTools → Elements Tab
   - Check <div id="root"> has full component tree
   - Should NOT be empty
   ```

## Testing Checklist

After deployment:

- [ ] Homepage loads with full UI (not blank)
- [ ] Navigation works (all pages load)
- [ ] Booking flow starts correctly
- [ ] Dashboard loads (admin/cleaner/customer)
- [ ] Styles applied correctly (Tailwind classes working)
- [ ] No console errors about missing modules
- [ ] Network tab shows all assets loading (no 404s)

## Rollback Plan

If issues persist:

1. **Check browser console** for specific errors
2. **Verify Vercel build logs** - ensure build succeeded
3. **Test in incognito mode** - eliminates cache issues
4. **Check Vercel environment variables** - ensure all secrets present

## Technical Details

### Why This Fixes The Issue

1. **Removed conditional plugins**: Dev plugins shouldn't run in production builds
2. **Explicit base path**: Ensures Vite generates correct asset URLs for Vercel
3. **No-cache HTML**: Prevents browsers from serving old HTML with outdated asset references
4. **Simplified config**: Reduces build complexity and potential misconfigurations

### Build Output
- **Main bundle**: `index-y-655r1g.js` (2.2 MB)
- **Styles**: `index-C_WbVWZE.css` (160 KB)
- **Manifest**: `.vite/manifest.json` (for asset mapping)
- **Assets**: All referenced correctly with hashed filenames

## Preview Server

Local preview running at: `http://localhost:4173`

To stop preview: Find and kill the background npm process

## Next Steps

1. Create a PR from `fix/prod-react-mount` to `main`
2. Deploy to production via Vercel
3. Hard refresh browser after deployment
4. Verify all functionality works
5. Monitor for any issues in the first 24 hours

## Support

If blank screen persists after deployment:
- Check Vercel deployment logs
- Verify build output includes all necessary files
- Test API connectivity to Supabase
- Check CSP headers aren't blocking scripts

