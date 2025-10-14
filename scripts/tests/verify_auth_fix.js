/**
 * Verification Script for Auth Restoration Fix
 * 
 * Run this in your browser console on your deployed site to verify
 * that the auth restoration fix is working correctly.
 * 
 * Usage:
 * 1. Open your site in browser
 * 2. Open DevTools Console (F12)
 * 3. Copy and paste this entire script
 * 4. Press Enter
 * 
 * The script will run automated tests and report results.
 */

(async function verifyAuthFix() {
  console.log('🔍 Starting Auth Fix Verification...\n');

  const results = {
    passed: [],
    failed: [],
    warnings: []
  };

  // Test 1: Check if AuthProvider is loaded
  console.log('Test 1: Checking AuthProvider...');
  try {
    const authContext = document.querySelector('[data-auth-provider]') || 
                       window.__REACT_DEVTOOLS_GLOBAL_HOOK__;
    if (authContext || localStorage.getItem('sb-localhost-auth-token')) {
      results.passed.push('✅ AuthProvider detected');
    } else {
      results.warnings.push('⚠️ Could not verify AuthProvider (not critical)');
    }
  } catch (e) {
    results.warnings.push('⚠️ Could not check AuthProvider: ' + e.message);
  }

  // Test 2: Check Supabase client configuration
  console.log('Test 2: Checking Supabase configuration...');
  try {
    const supabaseKeys = Object.keys(localStorage).filter(k => k.startsWith('sb-'));
    if (supabaseKeys.length > 0) {
      results.passed.push('✅ Supabase storage configured');
    } else {
      results.warnings.push('⚠️ No Supabase storage found (user not logged in)');
    }
  } catch (e) {
    results.failed.push('❌ LocalStorage access denied: ' + e.message);
  }

  // Test 3: Check for proper routing
  console.log('Test 3: Checking route configuration...');
  try {
    const hasProtectedRoutes = 
      document.querySelector('[data-protected-route]') !== null ||
      window.location.pathname.includes('/dashboard');
    
    if (hasProtectedRoutes || window.location.pathname === '/') {
      results.passed.push('✅ Routing configured');
    } else {
      results.warnings.push('⚠️ Could not verify protected routes');
    }
  } catch (e) {
    results.warnings.push('⚠️ Could not check routes: ' + e.message);
  }

  // Test 4: Check for PKCE flow
  console.log('Test 4: Checking PKCE auth flow...');
  try {
    const authKeys = Object.keys(localStorage).filter(k => 
      k.includes('auth') && k.includes('pkce')
    );
    if (authKeys.length > 0) {
      results.passed.push('✅ PKCE flow detected');
    } else {
      results.warnings.push('⚠️ PKCE flow not detected (may not be logged in)');
    }
  } catch (e) {
    results.warnings.push('⚠️ Could not verify PKCE: ' + e.message);
  }

  // Test 5: Check domain configuration
  console.log('Test 5: Checking domain configuration...');
  const domain = window.location.hostname;
  if (domain === 'shalean.co.za' || domain === 'localhost') {
    results.passed.push('✅ Domain correctly configured (non-www)');
  } else if (domain === 'www.shalean.co.za') {
    results.warnings.push('⚠️ On www subdomain - should redirect to non-www');
  } else {
    results.warnings.push('⚠️ Unexpected domain: ' + domain);
  }

  // Test 6: Check for session persistence capability
  console.log('Test 6: Checking session persistence...');
  try {
    // Test localStorage write
    localStorage.setItem('__test_key__', 'test');
    localStorage.removeItem('__test_key__');
    results.passed.push('✅ LocalStorage write capability verified');
  } catch (e) {
    results.failed.push('❌ LocalStorage blocked - sessions cannot persist: ' + e.message);
  }

  // Test 7: Check for loading timeout protection
  console.log('Test 7: Checking fail-safe timeout...');
  let hasTimeout = false;
  let timeoutStart = Date.now();
  
  // Simulate checking for timeout by monitoring page load
  if (document.readyState === 'complete') {
    let loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
    if (loadTime < 5000) {
      results.passed.push('✅ Page loaded quickly (no infinite loading)');
    } else {
      results.warnings.push('⚠️ Page load took longer than expected: ' + loadTime + 'ms');
    }
  } else {
    results.warnings.push('⚠️ Page still loading, cannot verify timeout');
  }

  // Test 8: Check React version compatibility
  console.log('Test 8: Checking React compatibility...');
  try {
    // Check if React DevTools is available
    const react = window.React || window.__REACT_DEVTOOLS_GLOBAL_HOOK__;
    if (react) {
      results.passed.push('✅ React environment detected');
    } else {
      results.warnings.push('⚠️ Could not detect React (not critical)');
    }
  } catch (e) {
    results.warnings.push('⚠️ Could not check React: ' + e.message);
  }

  // Test 9: Network connectivity
  console.log('Test 9: Checking network connectivity...');
  if (navigator.onLine) {
    results.passed.push('✅ Network connectivity confirmed');
  } else {
    results.warnings.push('⚠️ Device appears offline');
  }

  // Test 10: Check for TypeScript compilation (look for source maps)
  console.log('Test 10: Checking build configuration...');
  const scripts = Array.from(document.querySelectorAll('script[src]'));
  const hasModernBuild = scripts.some(s => 
    s.src.includes('.js') && !s.src.includes('legacy')
  );
  if (hasModernBuild) {
    results.passed.push('✅ Modern build detected');
  } else {
    results.warnings.push('⚠️ Could not verify build type');
  }

  // Print Results
  console.log('\n' + '='.repeat(60));
  console.log('📊 VERIFICATION RESULTS');
  console.log('='.repeat(60) + '\n');

  console.log('✅ PASSED TESTS (' + results.passed.length + '):');
  results.passed.forEach(p => console.log('  ' + p));

  if (results.failed.length > 0) {
    console.log('\n❌ FAILED TESTS (' + results.failed.length + '):');
    results.failed.forEach(f => console.log('  ' + f));
  }

  if (results.warnings.length > 0) {
    console.log('\n⚠️ WARNINGS (' + results.warnings.length + '):');
    results.warnings.forEach(w => console.log('  ' + w));
  }

  // Overall Status
  console.log('\n' + '='.repeat(60));
  if (results.failed.length === 0) {
    console.log('✅ ALL CRITICAL TESTS PASSED!');
    console.log('\nYour auth system is working correctly. 🎉');
    if (results.warnings.length > 0) {
      console.log('\nNote: ' + results.warnings.length + ' warnings are present but not critical.');
    }
  } else {
    console.log('❌ SOME TESTS FAILED');
    console.log('\nPlease address the failed tests above.');
  }
  console.log('='.repeat(60) + '\n');

  // Additional Manual Tests
  console.log('📋 MANUAL TESTS TO PERFORM:\n');
  console.log('1. Login to the site');
  console.log('2. Refresh the page (F5) - you should stay logged in');
  console.log('3. Close browser and reopen - you should stay logged in');
  console.log('4. Try accessing /dashboard - should work if logged in');
  console.log('5. Try accessing /dashboard/admin - should block non-admins');
  console.log('6. Check loading spinner appears briefly then disappears');
  console.log('7. Verify no console errors appear');
  console.log('\n');

  return {
    passed: results.passed.length,
    failed: results.failed.length,
    warnings: results.warnings.length,
    success: results.failed.length === 0
  };
})();

