# Vercel SPA Routing Fix

## Problem
When deploying a Single Page Application (SPA) built with React Router to Vercel, refreshing the page on any route other than the root (`/`) results in a **404 NOT_FOUND** error.

### Why This Happens
1. User navigates to `/booking/service/select` in the browser
2. React Router handles this client-side - works fine
3. User refreshes the page (F5 or Ctrl+R)
4. Browser makes a request to Vercel server for `/booking/service/select`
5. Vercel server looks for a file at that path
6. No file exists at that path (it's a client-side route!)
7. **Result:** 404 error

## Solution
The `vercel.json` configuration file tells Vercel to rewrite all requests to the root `index.html` file, allowing React Router to handle the routing.

### Configuration
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/" }
  ]
}
```

### How It Works
1. User requests any URL (e.g., `/booking/service/select`)
2. Vercel intercepts the request
3. Instead of looking for that file path, it serves `index.html`
4. `index.html` loads your React app
5. React Router reads the URL and renders the correct component
6. **Result:** Page loads correctly! ✅

## What This Fixes

| Scenario | Before | After |
|----------|--------|-------|
| Navigate to `/dashboard` | ✅ Works | ✅ Works |
| Refresh on `/dashboard` | ❌ 404 Error | ✅ Works |
| Direct link to `/booking/service/select` | ❌ 404 Error | ✅ Works |
| Refresh on `/services/deep-cleaning` | ❌ 404 Error | ✅ Works |
| Share link to any page | ❌ 404 Error | ✅ Works |

## Affected Routes

All these routes will now work on refresh:

**Booking Flow:**
- `/booking/service/select`
- `/booking/service/:slug/details`
- `/booking/schedule`
- `/booking/cleaner`
- `/booking/review`
- `/booking/confirmation`

**Dashboard:**
- `/dashboard`
- `/dashboard/admin`
- `/dashboard/cleaner`

**Content Pages:**
- `/services`
- `/services/:slug`
- `/locations`
- `/locations/:suburb`
- `/how-it-works`
- `/our-team`
- `/careers`
- `/blog`
- `/blog/:slug`

**Legal Pages:**
- `/terms`
- `/privacy-policy`
- `/cookies`
- `/popia`

## Important Notes

### This Does NOT Affect:
- ✅ Local development (`npm run dev`) - Vite dev server already handles this
- ✅ Client-side navigation - React Router handles this
- ✅ API routes - They use different URL patterns
- ✅ Static assets (images, CSS, JS) - Vercel serves these normally

### Production Only
This configuration only applies to production deployments on Vercel. Your local development environment works fine without it.

## Deployment

1. **File Created:** `vercel.json` ✅
2. **Commit Changes:**
   ```bash
   git add vercel.json
   git commit -m "Add Vercel SPA routing configuration"
   git push origin main
   ```
3. **Vercel Deployment:** Automatic on push (if connected to GitHub)
4. **Verification:** After deployment, test by:
   - Visit any nested route
   - Refresh the page
   - Should load correctly instead of 404

## Alternative Solutions

### If Not Using Vercel

#### Netlify (`_redirects` file):
```
/* /index.html 200
```

#### Netlify (`netlify.toml` file):
```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

#### Apache (`.htaccess` file):
```apache
RewriteEngine On
RewriteBase /
RewriteRule ^index\.html$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]
```

#### Nginx (`nginx.conf`):
```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

## Testing

### Local Testing (Can't Test Locally)
The Vercel configuration only works on Vercel's platform. To test similar behavior locally, the Vite dev server already handles this.

### Production Testing (After Deployment)
1. Deploy to Vercel
2. Visit: `https://your-app.vercel.app/booking/service/select`
3. Refresh the page (F5)
4. **Expected:** Page loads correctly
5. **Previous:** 404 error

### Test Checklist
- [ ] Home page (`/`) works
- [ ] Navigate to nested route works
- [ ] Refresh on nested route works
- [ ] Direct link to nested route works
- [ ] Browser back/forward buttons work
- [ ] All booking flow routes work on refresh
- [ ] Dashboard routes work on refresh
- [ ] Service and location pages work on refresh

## Troubleshooting

### Still Getting 404 After Deploying?

**Check 1: Verify File is Deployed**
- Go to Vercel Dashboard → Your Project → Settings → Files
- Confirm `vercel.json` is present

**Check 2: Verify Configuration**
- Check Vercel Dashboard → Your Project → Settings → General
- Look for "Rewrites" section
- Should show the rewrite rule

**Check 3: Redeploy**
```bash
# Force redeploy
git commit --allow-empty -m "Redeploy with vercel.json"
git push origin main
```

**Check 4: Clear Cache**
- Clear browser cache
- Try in incognito/private window
- Try different browser

### 404 on API Routes?

If your API routes are also returning 404, you need to exclude them:

```json
{
  "rewrites": [
    { "source": "/api/:path*", "destination": "/api/:path*" },
    { "source": "/(.*)", "destination": "/" }
  ]
}
```

### Specific Files Not Loading?

If static assets aren't loading, ensure they're in the `public` folder or `dist/assets` after build.

## Performance Impact

**None.** This is a server-side configuration that:
- ✅ No runtime overhead
- ✅ No additional JavaScript
- ✅ Same performance as direct file serving
- ✅ Vercel handles this efficiently

## SEO Considerations

**Good for SEO** if combined with:
1. **Meta tags** in `index.html` (done in your app)
2. **Dynamic meta tags** using React Helmet or similar
3. **Sitemap** (`sitemap.xml`) - should be added
4. **Robots.txt** (already present)

The rewrite rule ensures:
- ✅ All pages are accessible to search engine crawlers
- ✅ No broken links in search results
- ✅ Proper URL structure maintained

## Security

**Safe.** This configuration:
- ✅ Only rewrites requests to the SPA
- ✅ Doesn't expose sensitive files
- ✅ Standard practice for SPAs
- ✅ Used by thousands of production apps

## Summary

**Created:** `vercel.json`  
**Purpose:** Fix 404 errors on page refresh in production  
**Impact:** All routes now work correctly when refreshed or directly accessed  
**Status:** ✅ Ready to deploy  

**Next Step:** Commit and push to trigger Vercel deployment.

---

**Related Files:**
- Configuration: `vercel.json`
- Router Setup: `src/main.tsx` (React Router)
- Build Output: `dist/` (after running `npm run build`)

**Documentation Created:** October 12, 2025

