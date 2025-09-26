const jwt = require('jsonwebtoken');

// Create a test token
const JWT_SECRET = 'super-secret-jwt-key-for-development-only-change-in-production';
const token = jwt.sign({
  id: 'atcxe1rcgldgwx6kvo08pkak',
  email: 'marigabiatti@hotmail.com',
  name: 'Mariana',
  role: 'STAFF',
  businessId: 'ch2lrhzxyfsblcd9fwqfcmma',
  businessName: 'Mari Nails',
  businessSlug: 'mari-nails',
  staffRole: 'ADMIN',
  isAdmin: true
}, JWT_SECRET, { expiresIn: '7d' });

console.log('🔑 Test token created:');
console.log(token);
console.log('\n📋 Use this token to test the API:');
console.log(`curl "https://koobings.com/api/staff/clients" -H "Authorization: Bearer ${token}"`);
