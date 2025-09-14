// Test script to check slots API with different dates
const testSlotsAPI = async () => {
  try {
    console.log('🧪 Testing slots API...');
    
    // Test with today's date
    const today = new Date().toISOString().split('T')[0];
    console.log('📅 Testing with today:', today);
    
    const response = await fetch(`https://koobings.com/api/availability/slots-v2?serviceId=9fd027f2-e4d2-4ded-8793-613b35a12c3e&staffId=default-staff&date=${today}`, {
      credentials: 'include',
      headers: {
        'Cookie': 'business-auth-token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjExOWIxNDI4LTFhNzEtNDgyNS04MGFlLTY0NTU1OTkwNDhkNSIsImVtYWlsIjoibWFyaWdhYmlhdHRpQGhvdG1haWwuY29tIiwibmFtZSI6Ik1hcmlhbmEiLCJyb2xlIjoiU1RBRkYiLCJidXNpbmVzc0lkIjoiMmRhNmUzZDYtZWY4Yi00ZWEyLTg5NGUtMTQyNmQ3ZDM5Njc3IiwiYnVzaW5lc3NOYW1lIjoiTWFyaSBOYWlscyIsImJ1c2luZXNzU2x1ZyI6Im1hcmktbmFpbHMiLCJzdGFmZlJvbGUiOiJBRE1JTiIsImlzQWRtaW4iOnRydWUsImlhdCI6MTc1NzQ4NzM1NCwiZXhwIjoxNzU4MDkyMTU0fQ.Qvd28-LRWg-1n_G4mY0shtK6TwZ7ASZTXJxiM_w30KQ'
      }
    });
    
    const result = await response.json();
    console.log('📋 Today response:', result);
    
    // Test with tomorrow's date
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];
    console.log('📅 Testing with tomorrow:', tomorrowStr);
    
    const response2 = await fetch(`https://koobings.com/api/availability/slots-v2?serviceId=9fd027f2-e4d2-4ded-8793-613b35a12c3e&staffId=default-staff&date=${tomorrowStr}`, {
      credentials: 'include',
      headers: {
        'Cookie': 'business-auth-token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjExOWIxNDI4LTFhNzEtNDgyNS04MGFlLTY0NTU1OTkwNDhkNSIsImVtYWlsIjoibWFyaWdhYmlhdHRpQGhvdG1haWwuY29tIiwibmFtZSI6Ik1hcmlhbmEiLCJyb2xlIjoiU1RBRkYiLCJidXNpbmVzc0lkIjoiMmRhNmUzZDYtZWY4Yi00ZWEyLTg5NGUtMTQyNmQ3ZDM5Njc3IiwiYnVzaW5lc3NOYW1lIjoiTWFyaSBOYWlscyIsImJ1c2luZXNzU2x1ZyI6Im1hcmktbmFpbHMiLCJzdGFmZlJvbGUiOiJBRE1JTiIsImlzQWRtaW4iOnRydWUsImlhdCI6MTc1NzQ4NzM1NCwiZXhwIjoxNzU4MDkyMTU0fQ.Qvd28-LRWg-1n_G4mY0shtK6TwZ7ASZTXJxiM_w30KQ'
      }
    });
    
    const result2 = await response2.json();
    console.log('📋 Tomorrow response:', result2);
    
  } catch (error) {
    console.error('❌ Test error:', error);
  }
};

testSlotsAPI();
