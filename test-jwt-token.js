// Test the exact authentication flow
const jwt = require('jsonwebtoken');

// Simulate the JWT token from the user
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjExOWIxNDI4LTFhNzEtNDgyNS04MGFlLTY0NTU1OTkwNDhkNSIsImVtYWlsIjoibWFyaWdhYmlhdHRpQGhvdG1haWwuY29tIiwibmFtZSI6Ik1hcmlhbmEiLCJyb2xlIjoiU1RBRkYiLCJidXNpbmVzc0lkIjoiMmRhNmUzZDYtZWY4Yi00ZWEyLTg5NGUtMTQyNmQ3ZDM5Njc3IiwiYnVzaW5lc3NOYW1lIjoiTWFyaSBOYWlscyIsImJ1c2luZXNzU2x1ZyI6Im1hcmktbmFpbHMiLCJzdGFmZlJvbGUiOiJBRE1JTiIsImlzQWRtaW4iOnRydWUsImlhdCI6MTc1NzQ4NzM1NCwiZXhwIjoxNzU4MDkyMTU0fQ.Qvd28-LRWg-1n_G4mY0shtK6TwZ7ASZTXJxiM_w30KQ';

console.log('🧪 Testing JWT token...');

try {
  // Decode without verification (like the API does)
  const decoded = jwt.decode(token);
  console.log('✅ JWT decoded successfully');
  console.log('User data:', {
    id: decoded.id,
    email: decoded.email,
    name: decoded.name,
    role: decoded.role,
    businessId: decoded.businessId,
    businessName: decoded.businessName,
    businessSlug: decoded.businessSlug,
    staffRole: decoded.staffRole,
    isAdmin: decoded.isAdmin
  });

  // Check if token is expired
  const now = Math.floor(Date.now() / 1000);
  console.log('\n🔍 Token validation:');
  console.log('Current time:', now);
  console.log('Token issued at:', decoded.iat);
  console.log('Token expires at:', decoded.exp);
  console.log('Token expired?', now > decoded.exp);
  
  if (now > decoded.exp) {
    console.log('❌ TOKEN IS EXPIRED! This could be the issue.');
  } else {
    console.log('✅ Token is still valid');
  }

} catch (error) {
  console.error('❌ Error decoding token:', error);
}
