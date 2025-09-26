const jwt = require('jsonwebtoken');

// Use the JWT_SECRET from Vercel
const JWT_SECRET = 'FKiY9XE+3tC+yVKPrfNRxcDZLAihNF3TjvJhC1g3FIs=';
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

console.log('🔑 Token with Vercel JWT_SECRET:');
console.log(token);
console.log('\n📋 Test command:');
console.log(`curl "https://koobings.com/api/staff/clients" -H "Authorization: Bearer ${token}"`);
