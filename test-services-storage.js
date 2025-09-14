// Test script to check services storage
const testServicesStorage = async () => {
  try {
    console.log('🧪 Testing services storage...');
    
    // Test GET request
    const getResponse = await fetch('https://koobings.com/api/business/services', {
      credentials: 'include',
      headers: {
        'Cookie': 'business-auth-token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjExOWIxNDI4LTFhNzEtNDgyNS04MGFlLTY0NTU1OTkwNDhkNSIsImVtYWlsIjoibWFyaWdhYmlhdHRpQGhvdG1haWwuY29tIiwibmFtZSI6Ik1hcmlhbmEiLCJyb2xlIjoiU1RBRkYiLCJidXNpbmVzc0lkIjoiMmRhNmUzZDYtZWY4Yi00ZWEyLTg5NGUtMTQyNmQ3ZDM5Njc3IiwiYnVzaW5lc3NOYW1lIjoiTWFyaSBOYWlscyIsImJ1c2luZXNzU2x1ZyI6Im1hcmktbmFpbHMiLCJzdGFmZlJvbGUiOiJBRE1JTiIsImlzQWRtaW4iOnRydWUsImlhdCI6MTc1NzQ4NzM1NCwiZXhwIjoxNzU4MDkyMTU0fQ.Qvd28-LRWg-1n_G4mY0shtK6TwZ7ASZTXJxiM_w30KQ'
      }
    });
    
    const getResult = await getResponse.json();
    console.log('📋 GET Response:', getResult);
    
    if (getResult.success && getResult.data) {
      console.log('✅ Services found:', getResult.data.length);
      getResult.data.forEach((service, index) => {
        console.log(`  ${index + 1}. ${service.name} (ID: ${service.id})`);
      });
    } else {
      console.log('❌ No services found or error:', getResult.error);
    }
    
  } catch (error) {
    console.error('❌ Test error:', error);
  }
};

testServicesStorage();
