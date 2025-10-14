// DEBUG SCRIPT: Paste this in the browser console on your admin dashboard
// This will show you exactly what data is being received

(async function debugApplications() {
  console.log('🔍 Debugging Applications Data...\n');
  
  // Get the applications
  const { data: apps, error } = await supabase
    .from('cleaner_applications')
    .select('*');
  
  console.log('📊 Total Applications:', apps?.length);
  console.log('❌ Error:', error);
  console.log('\n');
  
  if (apps && apps.length > 0) {
    console.log('📋 First Application Details:');
    console.log('Raw Data:', apps[0]);
    console.log('\n');
    
    console.log('🔍 Field Type Checks:');
    console.log('skills type:', typeof apps[0].skills, 'is Array?', Array.isArray(apps[0].skills));
    console.log('skills value:', apps[0].skills);
    console.log('\n');
    
    console.log('areas type:', typeof apps[0].areas, 'is Array?', Array.isArray(apps[0].areas));
    console.log('areas value:', apps[0].areas);
    console.log('\n');
    
    console.log('available_days type:', typeof apps[0].available_days, 'is Array?', Array.isArray(apps[0].available_days));
    console.log('available_days value:', apps[0].available_days);
    console.log('\n');
    
    console.log('languages type:', typeof apps[0].languages, 'is Array?', Array.isArray(apps[0].languages));
    console.log('languages value:', apps[0].languages);
    console.log('\n');
    
    console.log('status:', apps[0].status);
    console.log('created_at:', apps[0].created_at);
    
    console.log('\n✅ All Applications:');
    apps.forEach((app, index) => {
      console.log(`${index + 1}. ${app.first_name} ${app.last_name} - Status: ${app.status}`);
    });
  }
  
  console.log('\n🏁 Debug Complete!');
})();

