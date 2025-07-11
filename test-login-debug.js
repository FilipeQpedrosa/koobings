const fetch = require('node-fetch');

async function testLogin() {
  console.log('🧪 Testing Orlando login process...');
  
  try {
    // Step 1: Get CSRF token
    console.log('📡 Step 1: Getting CSRF token...');
    const csrfResponse = await fetch('http://localhost:3000/api/auth/csrf');
    const csrfData = await csrfResponse.json();
    console.log('🔑 CSRF Response:', csrfData);
    
    if (!csrfResponse.ok) {
      throw new Error(`CSRF request failed: ${csrfResponse.status}`);
    }
    
    // Step 2: Attempt login
    console.log('📡 Step 2: Attempting login...');
    const loginResponse = await fetch('http://localhost:3000/api/auth/callback/credentials', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cookie': `next-auth.csrf-token=${csrfData.csrfToken}`,
      },
      body: new URLSearchParams({
        csrfToken: csrfData.csrfToken,
        email: 'barbeariaorlando15@gmail.com',
        password: 'orlando123',
        role: 'STAFF',
        callbackUrl: 'http://localhost:3000'
      })
    });
    
    console.log('📋 Login Response Status:', loginResponse.status);
    console.log('📋 Login Response Headers:', Object.fromEntries(loginResponse.headers.entries()));
    
    const loginText = await loginResponse.text();
    console.log('📋 Login Response Body:', loginText);
    
    // Step 3: Check session
    console.log('📡 Step 3: Checking session...');
    const sessionResponse = await fetch('http://localhost:3000/api/auth/session', {
      headers: {
        'Cookie': loginResponse.headers.get('set-cookie') || ''
      }
    });
    
    const sessionData = await sessionResponse.json();
    console.log('👤 Session Data:', sessionData);
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testLogin(); 