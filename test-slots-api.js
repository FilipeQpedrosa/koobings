const fetch = require('node-fetch');

async function testSlotsAPI() {
  console.log('🔍 Testing slots availability API...');
  
  try {
    // Test the API with current month
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1; // getMonth() returns 0-11
    
    const url = `https://koobings.com/api/business/services/slots/availability?year=${year}&month=${month}&businessSlug=mari-nails`;
    
    console.log(`📡 Testing URL: ${url}`);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Add auth token if needed
        'Authorization': 'Bearer YOUR_TOKEN_HERE'
      }
    });
    
    console.log(`📊 Response status: ${response.status}`);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ API Response:', JSON.stringify(data, null, 2));
    } else {
      const errorText = await response.text();
      console.log('❌ API Error:', errorText);
    }
    
  } catch (error) {
    console.error('❌ Request failed:', error.message);
  }
}

testSlotsAPI();