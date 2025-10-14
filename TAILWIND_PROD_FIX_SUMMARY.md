# Tailwind CSS Production Build Fix

## Problem
CSS was missing on Vercel production deployments while working correctly in development.

## Root Causes Identified
1. **Narrow Tailwind content globs** - Tailwind purge was too aggressive, removing necessary CSS classes
2. **Missing safelist** - Dynamic classes were being purged during production build
3. **Bun lock file** - Presence of `bun.lockb` could cause Vercel to use wrong package manager
4. **Missing Node.js engine specification** - No explicit Node version requirement

## Changes Applied

### 1. Updated `tailwind.config.ts`
**Before:**
```ts
content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
```

**After:**
```ts
content: [
  "./index.html",
  "./src/**/*.{js,ts,jsx,tsx,mdx}",
  "./components/**/*.{js,ts,jsx,tsx}",
  "./pages/**/*.{js,ts,jsx,tsx}",
],
safelist: [
  // Classes used in dynamic contexts or that might be purged incorrectly
  'container',
  'prose',
  'prose-sm',
  'prose-lg',
  'mx-auto',
  'text-center',
  'animate-fade-up',
  'animate-fade-up-delay-1',
  'animate-fade-up-delay-2',
  'animate-fade-up-delay-3',
  'animate-fade-up-scale',
  'animate-slide-in-left',
  'animate-slide-in-right',
  'animate-float',
  'scrollbar-hide',
  'line-clamp-1',
  'line-clamp-2',
  'line-clamp-3',
  'line-clamp-4',
  'line-clamp-5',
  'line-clamp-6',
],
```

### 2. Updated `package.json`
Added Node.js engine specification:
```json
"engines": {
  "node": ">=20.x"
}
```

### 3. Removed `bun.lockb`
Deleted the Bun lock file to ensure npm is used as the package manager on Vercel.

## Files Already Correct ✅
- `src/main.tsx` - Already imports `./index.css` correctly
- `src/index.css` - Already has Tailwind directives (`@tailwind base/components/utilities`)
- `postcss.config.js` - Already using ESM export with Tailwind & Autoprefixer
- `vite.config.ts` - Already has `@` alias configured properly
- `vercel.json` - Already configured correctly with Vite framework preset

## Build Verification
Local production build tested successfully:
- ✅ `npm install` completed
- ✅ `npm run build` generated CSS file: `dist/assets/index-C_WbVWZE.css` (160.35 kB)
- ✅ No linter errors
- ✅ Preview server ready

## Next Steps for Deployment

### 1. Commit and Push
```bash
git add .
git commit -m "fix: Tailwind CSS production build issues"
git push origin fix/tailwind-prod
```

### 2. Merge to Main
Create a PR and merge `fix/tailwind-prod` → `main`

### 3. Verify Vercel Settings
Ensure in Vercel dashboard:
- Framework preset: **Vite** ✅ (already set in vercel.json)
- Build command: `npm run build` ✅ (already set)
- Output directory: `dist` ✅ (already set)
- Environment variables set for both Preview and Production:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`
  - Any other `VITE_*` variables

### 4. Deploy and Test
After push, Vercel will automatically deploy. Verify:
1. CSS loads correctly on preview deployment
2. All animations and custom utilities work
3. Responsive design maintains styling
4. Dark mode toggles properly (if applicable)

## Technical Notes

### Why These Changes Work

1. **Comprehensive Content Globs**: Including multiple patterns ensures Tailwind scans ALL possible locations where classes might be used, preventing over-purging.

2. **Safelist Protection**: Custom animation classes and utilities defined in `index.css` are protected from purging even if they're used dynamically or conditionally.

3. **Package Manager Consistency**: Removing `bun.lockb` ensures Vercel uses npm (since `package-lock.json` exists), preventing build environment mismatches.

4. **Node Version**: Specifying `>=20.x` ensures compatible Node version while being flexible for newer versions.

### Common Issues Prevented

- ❌ Empty CSS output due to aggressive purging
- ❌ Missing custom animations and utilities
- ❌ Conditional/dynamic classes not included
- ❌ Wrong package manager causing dependency issues

## Rollback Plan
If issues occur, revert this branch:
```bash
git checkout main
git branch -D fix/tailwind-prod
```

Original configuration preserved in git history.

