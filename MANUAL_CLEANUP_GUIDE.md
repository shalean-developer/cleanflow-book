# 🛡️ Manual Cookie & App Data Cleanup Guide

## Step-by-Step Manual Cleanup Instructions

### **Option A: Chrome/Edge Browser**

1. **Open Chrome Developer Tools**
   - Press `F12` or right-click → "Inspect"
   - Go to **Application** tab

2. **Clear Local Storage**
   - In left sidebar, expand **Local Storage**
   - Click on your domain (e.g., `http://localhost:8080`)
   - Delete these specific keys:
     - All keys starting with `sb-` (Supabase auth)
     - `booking-storage` (Booking data)
     - Any other app-related keys

3. **Clear Session Storage**
   - Expand **Session Storage** in left sidebar
   - Click on your domain
   - Click "Clear All" or delete individual keys

4. **Clear Cookies**
   - Go to **Cookies** in left sidebar
   - Click on your domain
   - Delete these specific cookies:
     - Any `localhost` cookies
     - Any `paystack.com` cookies
     - Any `google.com` cookies (if causing issues)

### **Option B: Browser Settings Menu**

1. **Chrome/Edge:**
   - Click the three dots menu → Settings
   - Privacy and security → Clear browsing data
   - Select "Cookies and other site data"
   - Choose time range: "Last hour" or "All time"
   - Click "Clear data"

2. **Firefox:**
   - Click three lines menu → Settings
   - Privacy & Security → Cookies and Site Data
   - Click "Clear Data"
   - Select "Cookies and Site Data"
   - Click "Clear"

### **Option C: Site-Specific Cleanup**

1. **Clear specific domains:**
   - In address bar, click the lock icon
   - Click "Cookies and site data"
   - Remove data for these domains:
     - `localhost` (your app)
     - `paystack.com`
     - `checkout.paystack.com`
     - `google.com` (if needed)

### **Option D: Nuclear Option (Complete Reset)**

If nothing else works:

1. **Clear All Browser Data:**
   - Chrome: Settings → Privacy → Clear browsing data
   - Select "All time"
   - Check all boxes
   - Click "Clear data"

2. **Or use Incognito/Private Mode:**
   - Open new incognito/private window
   - Test your app there
   - If it works, the issue is cached data

## 🎯 **What to Clear (Priority Order)**

### **High Priority (Must Clear):**
1. **Supabase Auth Data** (`sb-*` in localStorage)
2. **Booking Store** (`booking-storage` in localStorage)
3. **Session Storage** (all items)

### **Medium Priority:**
1. **Paystack Cookies** (if payment issues)
2. **Localhost Cookies** (development conflicts)

### **Low Priority:**
1. **Google Analytics** (only if tracking issues)
2. **Other Third-party** (only if specific issues)

## ✅ **Verification Steps**

After cleanup, test these features:

1. **Authentication:**
   - Try logging in
   - Try logging out
   - Check if user stays logged in

2. **Booking Flow:**
   - Start a new booking
   - Go through all steps
   - Check if data persists between steps

3. **Payments:**
   - Try to initiate payment
   - Check if Paystack popup opens
   - Test with test card numbers

4. **General App:**
   - Check if pages load properly
   - Verify no console errors
   - Test navigation between pages

## 🚨 **If Issues Persist**

If clearing data doesn't fix the issues:

1. **Check Browser Console** for error messages
2. **Try Different Browser** (Chrome, Firefox, Edge)
3. **Try Incognito Mode** to isolate the issue
4. **Check Network Tab** for failed requests
5. **Verify Supabase Connection** is working

## 📞 **Need Help?**

If manual cleanup doesn't work, the issue might be:
- Server-side configuration
- Supabase settings
- Paystack configuration
- Network/firewall issues

In that case, check the server logs and configuration files.
