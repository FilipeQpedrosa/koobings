// Test script to diagnose Prisma database issues
const testPrismaConnection = async () => {
  try {
    console.log('🧪 Testing Prisma connection...');
    
    // Test 1: Simple connection test
    console.log('📋 Test 1: Testing basic Prisma connection...');
    const response1 = await fetch('https://koobings.com/api/debug-prisma', {
      credentials: 'include',
      headers: {
        'Cookie': 'business-auth-token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjExOWIxNDI4LTFhNzEtNDgyNS04MGFlLTY0NTU1OTkwNDhkNSIsImVtYWlsIjoibWFyaWdhYmlhdHRpQGhvdG1haWwuY29tIiwibmFtZSI6Ik1hcmlhbmEiLCJyb2xlIjoiU1RBRkYiLCJidXNpbmVzc0lkIjoiMmRhNmUzZDYtZWY4Yi00ZWEyLTg5NGUtMTQyNmQ3ZDM5Njc3IiwiYnVzaW5lc3NOYW1lIjoiTWFyaSBOYWlscyIsImJ1c2luZXNzU2x1ZyI6Im1hcmktbmFpbHMiLCJzdGFmZlJvbGUiOiJBRE1JTiIsImlzQWRtaW4iOnRydWUsImlhdCI6MTc1NzQ4NzM1NCwiZXhwIjoxNzU4MDkyMTU0fQ.Qvd28-LRWg-1n_G4mY0shtK6TwZ7ASZTXJxiM_w30KQ'
      }
    });
    
    const result1 = await response1.json();
    console.log('📋 Prisma connection test:', result1);
    
    // Test 2: Try to create a minimal service
    console.log('📋 Test 2: Testing minimal service creation...');
    const minimalService = {
      name: 'Test Service',
      description: 'Test Description',
      duration: 30,
      price: 10,
      slotsNeeded: 1,
      eventType: 'INDIVIDUAL',
      capacity: 1,
      isActive: true
    };
    
    const response2 = await fetch('https://koobings.com/api/business/services', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': 'business-auth-token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjExOWIxNDI4LTFhNzEtNDgyNS04MGFlLTY0NTU1OTkwNDhkNSIsImVtYWlsIjoibWFyaWdhYmlhdHRpQGhvdG1haWwuY29tIiwibmFtZSI6Ik1hcmlhbmEiLCJyb2xlIjoiU1RBRkYiLCJidXNpbmVzc0lkIjoiMmRhNmUzZDYtZWY4Yi00ZWEyLTg5NGUtMTQyNmQ3ZDM5Njc3IiwiYnVzaW5lc3NOYW1lIjoiTWFyaSBOYWlscyIsImJ1c2luZXNzU2x1ZyI6Im1hcmktbmFpbHMiLCJzdGFmZlJvbGUiOiJBRE1JTiIsImlzQWRtaW4iOnRydWUsImlhdCI6MTc1NzQ4NzM1NCwiZXhwIjoxNzU4MDkyMTU0fQ.Qvd28-LRWg-1n_G4mY0shtK6TwZ7ASZTXJxiM_w30KQ'
      },
      credentials: 'include',
      body: JSON.stringify(minimalService)
    });
    
    const result2 = await response2.json();
    console.log('📋 Service creation test:', result2);
    
    if (!response2.ok) {
      console.log('❌ Service creation failed with status:', response2.status);
      console.log('❌ Error details:', result2);
    } else {
      console.log('✅ Service created successfully!');
    }
    
  } catch (error) {
    console.error('❌ Test error:', error);
  }
};

testPrismaConnection();
