const fetch = require('node-fetch');

async function testBusinessInfo() {
  console.log('🔍 Testing Business Info API...\n');
  
  try {
    const baseUrl = 'http://localhost:3004'; // Try port 3004 first
    
    // Test different business routes
    const businessesToTest = [
      { slug: 'sporttv', name: 'Sporttv' },
      { slug: 'preto', name: 'Preto' },
      { slug: 'samsung', name: 'Samsung' }
    ];
    
    for (const business of businessesToTest) {
      console.log(`\n🏢 Testing business: ${business.slug}`);
      
      // Test API call with referer header (simulating dashboard request)
      const response = await fetch(`${baseUrl}/api/business/info`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Referer': `${baseUrl}/${business.slug}/staff/dashboard`,
          'Cookie': 'admin-auth-token=test' // Mock admin token
        }
      });
      
      console.log(`📡 Response status: ${response.status}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log(`✅ API Response:`, {
          success: data.success,
          businessName: data.data?.name,
          businessSlug: data.data?.slug,
          businessId: data.data?.id
        });
      } else {
        const errorData = await response.text();
        console.log(`❌ API Error:`, errorData);
      }
    }
    
    // Also test direct database query to see what businesses exist
    console.log('\n📊 Testing database businesses directly...');
    const businessListResponse = await fetch(`${baseUrl}/api/public/businesses`, {
      method: 'GET'
    });
    
    if (businessListResponse.ok) {
      const businessList = await businessListResponse.json();
      console.log('🏢 Businesses in database:', businessList.map(b => ({
        name: b.name,
        slug: b.slug,
        id: b.id
      })));
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    
    // Try port 3000 if 3004 failed
    if (error.message.includes('ECONNREFUSED')) {
      console.log('🔄 Trying port 3000...');
      // Retry with port 3000
      // (implement retry logic here if needed)
    }
  }
}

testBusinessInfo(); 