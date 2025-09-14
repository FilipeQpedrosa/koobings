// Test service creation with exact data from frontend
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testServiceCreation() {
  console.log('🧪 Testing service creation with frontend data...');

  try {
    // Simulate the exact data that frontend sends
    const frontendData = {
      name: 'Test Service Debug',
      description: 'Test Description',
      duration: 30,
      price: 25.00,
      slotsNeeded: 1,
      eventType: 'INDIVIDUAL',
      capacity: 1,
      availabilitySchedule: {
        monday: { enabled: true, timeSlots: [] },
        tuesday: { enabled: true, timeSlots: [] },
        wednesday: { enabled: true, timeSlots: [] },
        thursday: { enabled: true, timeSlots: [] },
        friday: { enabled: true, timeSlots: [] },
        saturday: { enabled: false, timeSlots: [] },
        sunday: { enabled: false, timeSlots: [] }
      },
      isActive: true
    };

    console.log('📋 Frontend data:', JSON.stringify(frontendData, null, 2));

    // Test 1: Check if business exists
    const businessId = '2da6e3d6-ef8b-4ea2-894e-1426d7d39677';
    const business = await prisma.business.findUnique({
      where: { id: businessId }
    });
    
    if (!business) {
      console.error('❌ Business not found:', businessId);
      return;
    }
    console.log('✅ Business found:', business.name);

    // Test 2: Try to create service with exact frontend data
    console.log('\n🔧 Creating service with frontend data...');
    
    const service = await prisma.service.create({
      data: {
        id: require('crypto').randomUUID(),
        businessId: businessId,
        name: frontendData.name,
        description: frontendData.description,
        duration: frontendData.duration,
        price: frontendData.price,
        slotsNeeded: frontendData.slotsNeeded,
        eventType: frontendData.eventType,
        capacity: frontendData.capacity,
        isActive: frontendData.isActive,
        availabilitySchedule: frontendData.availabilitySchedule,
        slots: {},
        updatedAt: new Date()
      }
    });

    console.log('✅ Service created successfully:', {
      id: service.id,
      name: service.name,
      businessId: service.businessId
    });

    // Test 3: Verify service can be retrieved
    const retrievedService = await prisma.service.findUnique({
      where: { id: service.id }
    });
    
    if (retrievedService) {
      console.log('✅ Service retrieved successfully:', retrievedService.name);
    } else {
      console.error('❌ Service not found after creation');
    }

  } catch (error) {
    console.error('❌ Service creation failed:', error);
    console.error('❌ Error details:', {
      message: error.message,
      code: error.code,
      meta: error.meta
    });
  } finally {
    await prisma.$disconnect();
  }
}

testServiceCreation();
