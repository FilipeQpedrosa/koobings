// Test the exact API code to find the conflict
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testExactAPICode() {
  console.log('🧪 Testing exact API code...');

  try {
    const businessId = '2da6e3d6-ef8b-4ea2-894e-1426d7d39677';
    
    // Exact data from API
    const serviceData = {
      id: require('crypto').randomUUID(),
      updatedAt: new Date(),
      createdAt: new Date(), // This might be the issue!
      businessId,
      name: 'Test Service',
      description: 'Test Description',
      duration: 30,
      slotsNeeded: 1,
      price: 25.00,
      categoryId: null,
      image: null,
      address: null,
      anyTimeAvailable: false,
      availableDays: [],
      endTime: null,
      location: null,
      maxAdvanceDays: 30,
      maxCapacity: 1,
      minAdvanceHours: 24,
      startTime: null,
      slots: {},
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

    console.log('📋 Testing with createdAt manually set...');
    
    // Test 1: With createdAt manually set (like API does)
    try {
      const service1 = await prisma.service.create({
        data: {
          id: serviceData.id,
          businessId: serviceData.businessId,
          name: serviceData.name,
          description: serviceData.description,
          duration: serviceData.duration,
          price: serviceData.price,
          slotsNeeded: serviceData.slotsNeeded,
          eventType: serviceData.eventType,
          capacity: serviceData.capacity,
          isActive: serviceData.isActive,
          availabilitySchedule: serviceData.availabilitySchedule,
          slots: serviceData.slots,
          categoryId: serviceData.categoryId,
          image: serviceData.image,
          address: serviceData.address,
          anyTimeAvailable: serviceData.anyTimeAvailable,
          availableDays: serviceData.availableDays,
          endTime: serviceData.endTime,
          location: serviceData.location,
          maxAdvanceDays: serviceData.maxAdvanceDays,
          maxCapacity: serviceData.maxCapacity,
          minAdvanceHours: serviceData.minAdvanceHours,
          startTime: serviceData.startTime,
          slotConfiguration: null,
          createdAt: serviceData.createdAt, // Manual createdAt
          updatedAt: serviceData.updatedAt
        }
      });
      console.log('✅ Service created with manual createdAt:', service1.name);
    } catch (error) {
      console.error('❌ Error with manual createdAt:', error.message);
    }

    // Test 2: Without createdAt (let Prisma handle it)
    console.log('\n📋 Testing without manual createdAt...');
    try {
      const service2 = await prisma.service.create({
        data: {
          id: require('crypto').randomUUID(),
          businessId: serviceData.businessId,
          name: 'Test Service 2',
          description: serviceData.description,
          duration: serviceData.duration,
          price: serviceData.price,
          slotsNeeded: serviceData.slotsNeeded,
          eventType: serviceData.eventType,
          capacity: serviceData.capacity,
          isActive: serviceData.isActive,
          availabilitySchedule: serviceData.availabilitySchedule,
          slots: serviceData.slots,
          categoryId: serviceData.categoryId,
          image: serviceData.image,
          address: serviceData.address,
          anyTimeAvailable: serviceData.anyTimeAvailable,
          availableDays: serviceData.availableDays,
          endTime: serviceData.endTime,
          location: serviceData.location,
          maxAdvanceDays: serviceData.maxAdvanceDays,
          maxCapacity: serviceData.maxCapacity,
          minAdvanceHours: serviceData.minAdvanceHours,
          startTime: serviceData.startTime,
          slotConfiguration: null,
          updatedAt: new Date()
          // No createdAt - let Prisma handle it
        }
      });
      console.log('✅ Service created without manual createdAt:', service2.name);
    } catch (error) {
      console.error('❌ Error without manual createdAt:', error.message);
    }

  } catch (error) {
    console.error('❌ General error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testExactAPICode();
