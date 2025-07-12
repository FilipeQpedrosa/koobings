// Test script to verify appointment creation
const testAppointmentCreation = async () => {
  try {
    console.log('🧪 Testing appointment creation...');
    
    // First, get valid staff IDs for the business
    console.log('📤 Getting staff for business...');
    const staffResponse = await fetch('http://localhost:3000/api/client/staff?businessSlug=advogados-bla-bla');
    const staffResult = await staffResponse.json();
    
    console.log('📥 Staff response:', JSON.stringify(staffResult, null, 2));
    
    if (!staffResult.success || !staffResult.data.staff.length) {
      console.log('❌ No staff found for business');
      return;
    }
    
    const staffId = staffResult.data.staff[0].id;
    console.log('✅ Using staff ID:', staffId);
    
    // Get valid services for the business
    console.log('📤 Getting services for business...');
    const servicesResponse = await fetch('http://localhost:3000/api/client/services?businessSlug=advogados-bla-bla');
    const servicesResult = await servicesResponse.json();
    
    console.log('📥 Services response:', JSON.stringify(servicesResult, null, 2));
    
    if (!servicesResult.success || !servicesResult.data.services || !servicesResult.data.services.length) {
      console.log('❌ No services found for business');
      return;
    }
    
    const serviceId = servicesResult.data.services[0].id;
    console.log('✅ Using service ID:', serviceId);
    
    // Test data for appointment creation
    const testData = {
      businessSlug: 'advogados-bla-bla',
      clientName: 'João Silva',
      clientEmail: 'joao.silva@example.com',
      clientPhone: '912345678',
      serviceId: serviceId,
      staffId: staffId,
      scheduledFor: '2024-07-12T10:00:00',
      notes: 'Consulta de teste'
    };

    console.log('📤 Sending request to /api/client/appointments...');
    
    const response = await fetch('http://localhost:3000/api/client/appointments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });

    const result = await response.json();
    
    console.log('📥 Response status:', response.status);
    console.log('📥 Response data:', JSON.stringify(result, null, 2));
    
    if (response.ok && result.success) {
      console.log('✅ Appointment creation successful!');
      console.log('📋 Appointment ID:', result.data.id);
    } else {
      console.log('❌ Appointment creation failed');
      console.log('🔍 Error details:', result.error);
    }
    
  } catch (error) {
    console.error('💥 Network error:', error.message);
  }
};

// Wait for server to start and then run test
setTimeout(testAppointmentCreation, 5000); 