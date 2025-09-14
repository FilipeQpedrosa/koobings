const https = require('https');

// Test login first
function testLogin() {
  return new Promise((resolve, reject) => {
    const loginData = JSON.stringify({
      email: 'pipo_pedros@hotmail.com',
      password: 'Filipe123'
    });

    const options = {
      hostname: 'koobings.com',
      port: 443,
      path: '/api/auth/client/signin',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Test-Browser/1.0'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      
      // Extract cookies from response
      const cookies = res.headers['set-cookie'];
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        console.log('🔑 LOGIN RESPONSE:', res.statusCode);
        console.log('🍪 LOGIN COOKIES:', cookies);
        console.log('📄 LOGIN DATA:', data);
        
        if (cookies) {
          resolve(cookies);
        } else {
          reject('No cookies received');
        }
      });
    });

    req.on('error', (e) => {
      reject(e);
    });

    req.write(loginData);
    req.end();
  });
}

// Test logout with cookies
function testLogout(cookies) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'koobings.com',
      port: 443,
      path: '/api/auth/client/logout',
      method: 'POST',
      headers: {
        'Cookie': cookies.join('; '),
        'User-Agent': 'Test-Browser/1.0'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      
      const logoutCookies = res.headers['set-cookie'];
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        console.log('🚪 LOGOUT RESPONSE:', res.statusCode);
        console.log('🍪 LOGOUT COOKIES:', logoutCookies);
        console.log('📄 LOGOUT DATA:', data);
        resolve();
      });
    });

    req.on('error', (e) => {
      reject(e);
    });

    req.end();
  });
}

// Test profile access after logout
function testProfileAfterLogout(originalCookies) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'koobings.com',
      port: 443,
      path: '/api/customer/profile',
      method: 'GET',
      headers: {
        'Cookie': originalCookies.join('; '),
        'User-Agent': 'Test-Browser/1.0'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        console.log('👤 PROFILE AFTER LOGOUT:', res.statusCode);
        console.log('📄 PROFILE DATA:', data);
        resolve();
      });
    });

    req.on('error', (e) => {
      reject(e);
    });

    req.end();
  });
}

// Run the full test
async function runLogoutTest() {
  try {
    console.log('🧪 TESTING COMPLETE LOGOUT FLOW...\n');
    
    const loginCookies = await testLogin();
    console.log('\n⏱️  Waiting 2 seconds...\n');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    await testLogout(loginCookies);
    console.log('\n⏱️  Waiting 2 seconds...\n');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    await testProfileAfterLogout(loginCookies);
    
    console.log('\n✅ LOGOUT FLOW TEST COMPLETED');
  } catch (error) {
    console.error('❌ TEST ERROR:', error);
  }
}

runLogoutTest();
