import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testQueries() {
  try {
    // Test 1: Verify business and its relationships
    console.log('\n=== Testing Business ===');
    const business = await prisma.business.findFirst({
      include: {
        securitySettings: true,
        featureConfiguration: {
          include: {
            features: {
              include: {
                options: true,
              },
            },
          },
        },
        businessHours: true,
      },
    });
    console.log('Business:', {
      name: business?.name,
      type: business?.type,
      securityEnabled: !!business?.securitySettings,
      features: business?.featureConfiguration?.features.length,
      businessHours: business?.businessHours.length,
    });

    // Test 2: Verify staff and their schedules
    console.log('\n=== Testing Staff ===');
    const staff = await prisma.staff.findMany({
      include: {
        schedules: true,
        services: true,
      },
    });
    console.log('Staff:', staff.map((s: any) => ({
      name: s.name,
      role: s.role,
      scheduleDays: s.schedules.length,
      servicesOffered: s.services.length,
    })));

    // Test 3: Verify services and categories
    console.log('\n=== Testing Services ===');
    const services = await prisma.service.findMany({
      include: {
        category: true,
        providers: true,
      },
    });
    console.log('Services:', services.map((s: any) => ({
      name: s.name,
      category: s.category?.name,
      duration: s.duration,
      price: s.price,
      providersCount: s.providers.length,
    })));

    // Test 4: Verify clients and their relationships
    console.log('\n=== Testing Clients ===');
    const clients = await prisma.client.findMany({
      include: {
        sensitiveInfo: true,
        relationship: true,
      },
    });
    console.log('Clients:', clients.map((c: any) => ({
      name: c.name,
      status: c.status,
      hasSensitiveInfo: !!c.sensitiveInfo,
      hasRelationship: !!c.relationship,
    })));

    // Test 5: Test creating an appointment
    console.log('\n=== Testing Appointment Creation ===');
    const appointment = await prisma.appointment.create({
      data: {
        startTime: new Date('2024-05-14T10:00:00Z'),
        endTime: new Date('2024-05-14T11:00:00Z'),
        status: 'PENDING',
        businessId: business!.id,
        clientId: clients[0].id,
        serviceId: services[0].id,
        staffId: staff[0].id,
        notes: 'Test appointment',
        payment: {
          create: {
            amount: services[0].price,
            status: 'PENDING',
            paymentMethod: 'CREDIT_CARD',
          },
        },
      },
      include: {
        client: true,
        service: true,
        staff: true,
        payment: true,
      },
    });
    console.log('Created Appointment:', {
      clientName: appointment.client.name,
      serviceName: appointment.service.name,
      providerName: appointment.staff.name,
      startTime: appointment.startTime,
      status: appointment.status,
      paymentStatus: appointment.payment?.status,
    });

  } catch (error) {
    console.error('Error during testing:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testQueries()
  .catch(console.error); 