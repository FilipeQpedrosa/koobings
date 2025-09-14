const https = require('https');

// Check if we can access customer data directly
function checkCustomerAPI() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'koobings.com',
      port: 443,
      path: '/api/customer/profile',
      method: 'GET',
      headers: {
        'User-Agent': 'Test-Browser/1.0',
        'Cookie': 'auth-token=fake'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        console.log('👤 CUSTOMER PROFILE STATUS:', res.statusCode);
        console.log('📄 CUSTOMER DATA:', data);
        resolve();
      });
    });

    req.on('error', (e) => {
      reject(e);
    });

    req.end();
  });
}

checkCustomerAPI();
