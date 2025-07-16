const { exec } = require('child_process');

async function testAuthAndServices() {
  console.log('🧪 Testing authentication and services endpoint...');
  
  // Get the emergency cleanup endpoint first to clear any bad tokens
  const cleanupCommand = `curl -X POST "http://localhost:3002/api/auth/emergency-cleanup" -H "Content-Type: application/json" -v -c cookies.txt`;
  
  console.log('🧹 Step 1: Emergency cleanup...');
  exec(cleanupCommand, (error, stdout, stderr) => {
    if (error) {
      console.error('❌ Emergency cleanup failed:', error);
      return;
    }
    console.log('✅ Emergency cleanup done');
    
    // Try to access services endpoint now
    const servicesCommand = `curl -X GET "http://localhost:3002/api/business/services" -H "Content-Type: application/json" -v -b cookies.txt`;
    
    console.log('🔍 Step 2: Testing services endpoint...');
    exec(servicesCommand, (error2, stdout2, stderr2) => {
      console.log('📄 Services response:');
      console.log(stdout2);
      
      if (stderr2) {
        console.log('🔧 Debug info:');
        console.log(stderr2);
      }
    });
  });
}

testAuthAndServices(); 