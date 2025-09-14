// Analyze conflicts between API data and Prisma schema
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function analyzeConflicts() {
  console.log('🔍 Analyzing conflicts between API and Prisma schema...');

  try {
    // Test data that frontend sends (from the form)
    const frontendData = {
      name: 'Test Service',
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

    // What the API prepares (from serviceData)
    const serviceData = {
      id: require('crypto').randomUUID(),
      updatedAt: new Date(),
      createdAt: new Date(),
      businessId: '2da6e3d6-ef8b-4ea2-894e-1426d7d39677',
      name: frontendData.name,
      description: frontendData.description || '',
      duration: frontendData.duration, // 30
      slotsNeeded: frontendData.slotsNeeded,
      price: frontendData.price,
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
      eventType: frontendData.eventType,
      capacity: frontendData.capacity,
      availabilitySchedule: frontendData.availabilitySchedule,
      isActive: frontendData.isActive
    };

    console.log('\n📋 Service data prepared by API:', JSON.stringify(serviceData, null, 2));

    // Check Prisma schema requirements
    console.log('\n🔍 Prisma Schema Analysis:');
    console.log('Required fields (no ?): id, createdAt, updatedAt, name, duration, price, businessId, maxAdvanceDays, minAdvanceHours, slotsNeeded, capacity, eventType, isActive');
    console.log('Optional fields (?): description, categoryId, image, address, anyTimeAvailable, availableDays, endTime, location, maxCapacity, slots, startTime, slotConfiguration, availabilitySchedule');

    // Test creation with exact API data
    console.log('\n🧪 Testing service creation with API data...');
    
    const service = await prisma.service.create({
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
        slotConfiguration: null, // This was the fix
        updatedAt: new Date()
      }
    });

    console.log('✅ Service created successfully:', service.name);

    // Test with minimal data
    console.log('\n🧪 Testing with minimal data...');
    
    const minimalService = await prisma.service.create({
      data: {
        id: require('crypto').randomUUID(),
        businessId: serviceData.businessId,
        name: 'Minimal Service',
        duration: 30,
        price: 10.00,
        updatedAt: new Date()
      }
    });

    console.log('✅ Minimal service created:', minimalService.name);

  } catch (error) {
    console.error('❌ Error:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      meta: error.meta
    });
  } finally {
    await prisma.$disconnect();
  }
}

analyzeConflicts();
