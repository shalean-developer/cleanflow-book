# Favicon Fix Instructions

## Issue
The search results show "Lovable" branding instead of Shalean Cleaning Services logo in the favicon.

## Solution

### Step 1: Create New Favicon Files
You need to create proper favicon files with the Shalean Cleaning Services logo:

1. **favicon.ico** (16x16, 32x32, 48x48 pixels)
2. **favicon.png** (192x192 pixels for Apple touch icon)

### Step 2: Design Requirements
- **Logo**: Use the Shalean Cleaning Services logo
- **Colors**: Match the brand colors (blue #0C53ED)
- **Background**: White or transparent
- **Text**: "Shalean" or "SC" if space is limited

### Step 3: File Placement
Place the new favicon files in the `/public` folder:
```
public/
├── favicon.ico    (replace existing)
├── favicon.png    (replace existing)
└── ...
```

### Step 4: Clear Browser Cache
After replacing the favicon files:
1. Clear browser cache
2. Hard refresh (Ctrl+F5)
3. Wait 24-48 hours for Google to re-crawl

### Step 5: Verify
Check that the favicon appears correctly:
- In browser tab
- In bookmarks
- In search results (may take time to update)

## Alternative Quick Fix
If you can't create new favicon files immediately, you can temporarily remove the favicon references from index.html to prevent the "Lovable" branding from showing.

---

## Files to Replace
- `public/favicon.ico`
- `public/favicon.png`

## Tools for Creating Favicons
- **Online**: https://favicon.io/favicon-generator/
- **Design**: Use the Shalean logo with blue background
- **Format**: ICO for favicon.ico, PNG for favicon.png

## Expected Result
After implementing, search results should show the Shalean Cleaning Services favicon instead of "Lovable" branding.
