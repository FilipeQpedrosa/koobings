const https = require('https');
const { randomUUID } = require('crypto');

// Test data
const testData = {
  clientId: 'cmcu4es3q0003wop49kde76zw', // Using business ID temporarily
  serviceId: 'some-service-id',
  staffId: 'some-staff-id', 
  date: '2024-12-20',
  time: '14:00',
  notes: 'Test appointment'
};

// Get actual IDs from database first
console.log('Testing appointment API...');

// Test without auth first
fetch('http://localhost:3000/api/appointments', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(testData)
})
.then(response => response.json())
.then(data => {
  console.log('Response without auth:', data);
})
.catch(error => {
  console.error('Error:', error);
});
