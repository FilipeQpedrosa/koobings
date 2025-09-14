// Test script to check services persistence
const testServicesPersistence = async () => {
  try {
    console.log('🧪 Testing services persistence...');
    
    // Test GET request first
    console.log('📋 Testing GET request...');
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
    
    // Wait a bit and test again
    console.log('⏳ Waiting 2 seconds...');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Test GET request again
    console.log('📋 Testing GET request again...');
    const getResponse2 = await fetch('https://koobings.com/api/business/services', {
      credentials: 'include',
      headers: {
        'Cookie': 'business-auth-token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjExOWIxNDI4LTFhNzEtNDgyNS04MGFlLTY0NTU1OTkwNDhkNSIsImVtYWlsIjoibWFyaWdhYmlhdHRpQGhvdG1haWwuY29tIiwibmFtZSI6Ik1hcmlhbmEiLCJyb2xlIjoiU1RBRkYiLCJidXNpbmVzc0lkIjoiMmRhNmUzZDYtZWY4Yi00ZWEyLTg5NGUtMTQyNmQ3ZDM5Njc3IiwiYnVzaW5lc3NOYW1lIjoiTWFyaSBOYWlscyIsImJ1c2luZXNzU2x1ZyI6Im1hcmktbmFpbHMiLCJzdGFmZlJvbGUiOiJBRE1JTiIsImlzQWRtaW4iOnRydWUsImlhdCI6MTc1NzQ4NzM1NCwiZXhwIjoxNzU4MDkyMTU0fQ.Qvd28-LRWg-1n_G4mY0shtK6TwZ7ASZTXJxiM_w30KQ'
      }
    });
    
    const getResult2 = await getResponse2.json();
    console.log('📋 GET Response 2:', getResult2);
    
    if (getResult2.success && getResult2.data) {
      console.log('✅ Services found in second request:', getResult2.data.length);
    } else {
      console.log('❌ Services disappeared in second request:', getResult2.error);
    }
    
  } catch (error) {
    console.error('❌ Test error:', error);
  }
};

testServicesPersistence();
