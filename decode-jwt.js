// Test JWT token to see what businessId is being used
const jwt = require('jsonwebtoken');

// This is the token from the user's browser (from the image description)
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjExOWIxNDI4LTFhNzEtNDgyNS04MGFlLTY0NTU1OTkwNDhkNSIsImVtYWlsIjoibWFyaWdhYmlhdHRpQGhvdG1haWwuY29tIiwibmFtZSI6Ik1hcmlhbmEiLCJyb2xlIjoiU1RBRkYiLCJidXNpbmVzc0lkIjoiMmRhNmUzZDYtZWY4Yi00ZWEyLTg5NGUtMTQyNmQ3ZDM5Njc3IiwiYnVzaW5lc3NOYW1lIjoiTWFyaSBOYWlscyIsImJ1c2luZXNzU2x1ZyI6Im1hcmktbmFpbHMiLCJzdGFmZlJvbGUiOiJBRE1JTiIsImlzQWRtaW4iOnRydWUsImlhdCI6MTc1NzQ4NzM1NCwiZXhwIjoxNzU4MDkyMTU0fQ.Qvd28-LRWg-1n_G4mY0shtK6TwZ7ASZTXJxiM_w30KQ';

try {
  const decoded = jwt.decode(token);
  console.log('🔍 JWT Token decoded:');
  console.log(JSON.stringify(decoded, null, 2));
  
  console.log('\n🎯 Key information:');
  console.log('Business ID:', decoded.businessId);
  console.log('Business Name:', decoded.businessName);
  console.log('Business Slug:', decoded.businessSlug);
  console.log('User Role:', decoded.role);
  console.log('Is Admin:', decoded.isAdmin);
  
} catch (error) {
  console.error('❌ Error decoding token:', error);
}
