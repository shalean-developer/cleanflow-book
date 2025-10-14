# Home-Only Deployment Configuration

## Overview
This document describes the temporary changes made to deploy only the Home page while preserving all other configurations for future restoration.

## Changes Made

### 1. **src/App.tsx**
- **Line 10-49**: Commented out all page imports except `Home`
- **Line 68-135**: Commented out all routes except the home route (`/`)
- **What to restore**: Uncomment all the commented import statements and route definitions

### 2. **src/pages/Home.tsx**
- **Line 1-5**: Commented out `useNavigate` import
- **All navigation buttons**: Disabled all buttons with `disabled` attribute and added opacity/cursor styles
  - Book Now buttons
  - Apply For Work button
  - Get a Free Quote buttons
  - View Details buttons
- **What to restore**: 
  - Uncomment the `useNavigate` import
  - Remove `disabled` attributes from all buttons
  - Remove `cursor-not-allowed opacity-70` classes
  - Restore `onClick` handlers with navigate functions

### 3. **src/components/Header.tsx**
- **Line 2-9**: Commented out `NavLink`, `useNavigate`, `useAuth`, and `LoginDropdown` imports
- **Line 34-37**: Commented out navigation menu items (Services, How It Works, Locations)
- **Line 46-47**: Commented out `navigate` and `useAuth` hooks
- **Line 59-66**: Disabled `handleCtaClick` function
- **Line 68-81**: Replaced `NavLink` with `div` elements
- **Line 106-122**: Replaced mobile nav `NavLink` with `div` elements
- **Line 125-130**: Disabled mobile CTA button
- **Line 149-158**: Removed logo click handler
- **Line 174-180**: Simplified desktop CTA to just a disabled button
- **What to restore**: 
  - Uncomment all imports
  - Uncomment navigation items in `defaultNavItems`
  - Restore `NavLink` components
  - Restore navigation functionality

### 4. **src/components/Footer.tsx**
- **Line 27-46**: Replaced service links with disabled `span` elements
- **Line 58-77**: Replaced company links with disabled `span` elements  
- **Line 157-171**: Replaced legal links with disabled `span` elements
- **What to restore**: Replace `span` elements with `<a>` tags and restore href attributes

## How to Restore Full Site

### Quick Restore Steps:
1. Open `src/App.tsx`
   - Uncomment all imports (lines 10-49)
   - Uncomment all routes (lines 68-135)

2. Open `src/pages/Home.tsx`
   - Uncomment `useNavigate` import (lines 1-2)
   - Find and replace all occurrences of:
     - Remove `disabled` from buttons
     - Remove `cursor-not-allowed opacity-70` classes
     - Restore `onClick={() => navigate('/...')}` handlers

3. Open `src/components/Header.tsx`
   - Uncomment all imports at the top
   - Uncomment navigation items in `defaultNavItems`
   - Uncomment hooks usage
   - Restore all `NavLink` components (they're in comments above the current `div` elements)

4. Open `src/components/Footer.tsx`
   - Replace `<span>` elements with `<a href="/...">` tags
   - Restore the className with hover and focus styles

### Search and Replace Tips:
- Search for `// TEMPORARILY DISABLED FOR HOME-ONLY DEPLOYMENT` to find all commented sections
- Search for `cursor-not-allowed opacity-70` to find all disabled UI elements
- Search for `disabled` to find all disabled buttons

## Current Deployment State
✅ Only Home page (`/`) is active  
✅ All navigation is disabled  
✅ All buttons are visible but non-functional  
✅ All code is preserved in comments  
✅ No files deleted  

## Notes
- The `vercel.json` configuration remains unchanged and works for both home-only and full site deployment
- All dependencies remain installed
- Social media links in the footer remain active (they're external links)
- Email and phone links in the footer remain active

## Deployment
The site is ready to deploy with:
```bash
npm run build
```

All other routes will automatically redirect to the home page thanks to the SPA routing configuration in `vercel.json`.

