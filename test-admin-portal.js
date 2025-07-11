const fetch = require('node-fetch');

async function testAdminPortalAccess() {
  try {
    console.log('🧪 Testing Admin Portal Access...\n');
    
    // Step 1: Login as admin
    console.log('1️⃣ Logging in as admin...');
    const loginResponse = await fetch('http://localhost:3000/api/auth/custom-login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'f.queirozpedrosa@gmail.com',
        password: 'filipe2024'
      }),
    });

    if (!loginResponse.ok) {
      console.log('❌ Admin login failed:', loginResponse.status);
      return;
    }

    const loginData = await loginResponse.json();
    console.log('✅ Admin login successful');
    
    // Extract cookies
    const cookies = loginResponse.headers.get('set-cookie') || '';
    console.log('🍪 Cookies:', cookies ? 'Present' : 'None');

    // Step 2: Test accessing different business portals
    const businesses = [
      { name: 'Arthur Personal', slug: 'arthur-personal' },
      { name: 'Julia Unha', slug: 'julia-unha' }, 
      { name: 'Orlando Barbershop', slug: 'barbearia-orlando' },
      { name: 'Ana Clinic', slug: 'ana-clinic' }
    ];

    console.log('\n2️⃣ Testing business portal access...');
    
    for (const business of businesses) {
      console.log(`\n🏢 Testing ${business.name} (${business.slug}):`);
      
      // Test staff dashboard access
      const dashboardUrl = `http://localhost:3000/staff/dashboard?businessSlug=${business.slug}`;
      console.log(`   Dashboard URL: ${dashboardUrl}`);
      
      const dashboardResponse = await fetch(dashboardUrl, {
        headers: {
          'Cookie': cookies
        },
        redirect: 'manual'
      });
      
      console.log(`   Status: ${dashboardResponse.status} ${dashboardResponse.statusText}`);
      
      if (dashboardResponse.status === 307) {
        const location = dashboardResponse.headers.get('location');
        console.log(`   Redirects to: ${location}`);
      }
      
      // Test business info API
      const infoUrl = `http://localhost:3000/api/business/info?businessSlug=${business.slug}`;
      const infoResponse = await fetch(infoUrl, {
        headers: {
          'Cookie': cookies
        }
      });
      
      console.log(`   Business Info API: ${infoResponse.status}`);
      
      if (infoResponse.ok) {
        const infoData = await infoResponse.json();
        console.log(`   Business Name: ${infoData.data?.name || 'N/A'}`);
      }
    }

    console.log('\n✅ Test completed!');
    
  } catch (error) {
    console.error('🚨 Test failed:', error.message);
  }
}

testAdminPortalAccess(); 