const fetch = require('node-fetch');

async function testSessionIsolation() {
  console.log('🧪 Testing Session Isolation Fix...\n');
  
  try {
    // Step 1: Clear all sessions first
    console.log('1️⃣ Clearing all sessions...');
    const clearResponse = await fetch('http://localhost:3000/api/auth/emergency-cleanup', {
      method: 'POST'
    });
    const clearData = await clearResponse.json();
    console.log('✅ Clear response:', clearData.message);
    
    // Step 2: Login as business user (Clube K / Neymar)
    console.log('\n2️⃣ Logging in as business user (clube@k.com / Neymar)...');
    const clubeLogin = await fetch('http://localhost:3000/api/auth/custom-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'clube@k.com',
        password: 'neymar123'
      })
    });
    
    if (clubeLogin.ok) {
      const clubeData = await clubeLogin.json();
      console.log('✅ Clube K login successful');
      console.log('📋 User:', clubeData.user?.name);
      console.log('🏢 Business:', clubeData.user?.businessSlug);
      
      // Get cookies
      const clubeCookies = clubeLogin.headers.get('set-cookie') || '';
      console.log('🍪 Clube K cookies set:', !!clubeCookies);
      
      // Step 3: Try to access correct business route
      console.log('\n3️⃣ Testing access to correct business route (clube-k)...');
      const correctAccess = await fetch(`http://localhost:3000/${clubeData.user?.businessSlug}/staff/dashboard`, {
        headers: { 'Cookie': clubeCookies }
      });
      console.log('✅ Correct business access:', correctAccess.status === 200 ? 'ALLOWED' : 'DENIED');
      
      // Step 4: Try to access wrong business route (should be blocked)
      console.log('\n4️⃣ Testing access to WRONG business route (amazon)...');
      const wrongAccess = await fetch('http://localhost:3000/amazon/staff/dashboard', {
        headers: { 'Cookie': clubeCookies }
      });
      console.log('🚨 Wrong business access:', wrongAccess.status === 200 ? 'ALLOWED (BAD!)' : 'BLOCKED (GOOD!)');
      
      if (wrongAccess.status !== 200) {
        console.log('✅ Session isolation is working correctly!');
      } else {
        console.log('❌ Session isolation FAILED - user can access wrong business!');
      }
      
    } else {
      const errorData = await clubeLogin.json();
      console.log('❌ Clube K login failed:', errorData.error);
    }
    
    // Step 5: Login as different user (Amazon / Jeff Bezos)
    console.log('\n5️⃣ Logging in as different business user (amazon@amazon.com / Jeff Bezos)...');
    const amazonLogin = await fetch('http://localhost:3000/api/auth/custom-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'amazon@amazon.com',
        password: 'bezos123'
      })
    });
    
    if (amazonLogin.ok) {
      const amazonData = await amazonLogin.json();
      console.log('✅ Amazon login successful');
      console.log('📋 User:', amazonData.user?.name);
      console.log('🏢 Business:', amazonData.user?.businessSlug);
      
      const amazonCookies = amazonLogin.headers.get('set-cookie') || '';
      
      // Step 6: Test Amazon user trying to access Clube K (should be blocked)
      console.log('\n6️⃣ Testing Amazon user access to Clube K routes (should be blocked)...');
      const crossAccess = await fetch('http://localhost:3000/clube-k/staff/dashboard', {
        headers: { 'Cookie': amazonCookies }
      });
      console.log('🚨 Cross business access:', crossAccess.status === 200 ? 'ALLOWED (BAD!)' : 'BLOCKED (GOOD!)');
      
      if (crossAccess.status !== 200) {
        console.log('✅ Cross-business protection is working!');
      } else {
        console.log('❌ Cross-business protection FAILED!');
      }
    } else {
      const errorData = await amazonLogin.json();
      console.log('❌ Amazon login failed:', errorData.error);
    }
    
    // Step 7: Test admin access (if admin exists)
    console.log('\n7️⃣ Testing admin access...');
    const adminLogin = await fetch('http://localhost:3000/api/auth/custom-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'f.queirozpedrosa@gmail.com',
        password: 'filipe2024'
      })
    });
    
    if (adminLogin.ok) {
      const adminData = await adminLogin.json();
      console.log('✅ Admin login successful');
      console.log('📋 User:', adminData.user?.name);
      console.log('👑 Role:', adminData.user?.role);
      
      const adminCookies = adminLogin.headers.get('set-cookie') || '';
      
      // Test admin access to business routes (should be allowed)
      console.log('\n8️⃣ Testing admin access to business routes...');
      const adminBusinessAccess = await fetch('http://localhost:3000/clube-k/staff/dashboard', {
        headers: { 'Cookie': adminCookies }
      });
      console.log('👑 Admin business access:', adminBusinessAccess.status === 200 ? 'ALLOWED' : 'DENIED');
      
      if (adminBusinessAccess.status === 200) {
        console.log('✅ Admin can access all businesses (correct behavior)');
      }
    } else {
      console.log('❌ Admin login failed (admin might not exist)');
    }
    
    console.log('\n🎯 Session Isolation Test completed!');
    console.log('\n📋 Summary:');
    console.log('- Users should only access their own business routes');
    console.log('- Wrong business access should be BLOCKED');
    console.log('- Admin should have access to all businesses');
    console.log('- Cookie contamination should be prevented');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testSessionIsolation(); 