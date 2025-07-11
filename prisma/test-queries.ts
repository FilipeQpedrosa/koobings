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
        // businessHours: true, // Removed, not in schema
      },
    });
    console.log('Business:', {
      name: business?.name,
      type: business?.type,
      securityEnabled: !!business?.securitySettings,
      features: business?.featureConfiguration?.features.length,
      // businessHours: business?.businessHours?.length, // Removed
    });

    // Test 2: Verify staff and their schedules
    console.log('\n=== Testing Staff ===');
    const staff = await prisma.staff.findMany({
      include: {
        services: true,
      },
    });
    console.log('Staff:', staff.map((s: any) => ({
      name: s.name,
      role: s.role,
      // scheduleDays: s.schedules.length, // Removed
      servicesOffered: s.services.length,
    })));

    // Test 3: Verify services and categories
    console.log('\n=== Testing Services ===');
    const services = await prisma.service.findMany({
      include: {
        category: true,
        // providers: true, // Removed
      },
    });
    console.log('Services:', services.map((s: any) => ({
      name: s.name,
      category: s.category?.name,
      duration: s.duration,
      price: s.price,
      // providersCount: s.providers.length, // Removed
    })));

    // Test 4: Verify clients
    console.log('\n=== Testing Clients ===');
    const clients = await prisma.client.findMany({
      // No includes, as 'relationship' and 'sensitiveInfo' do not exist
    });
    console.log('Clients:', clients.map((c: any) => ({
      name: c.name,
      email: c.email,
    })));

    // Test 5: Verify appointments
    console.log('\n=== Testing Appointments ===');
    const appointments = await prisma.appointments.findMany({
      include: {
        client: true,
        service: true,
        staff: true,
      },
    });
    console.log('Appointments:', appointments.map((a: any) => ({
      id: a.id,
      scheduledFor: a.scheduledFor,
      duration: a.duration,
      status: a.status,
      client: a.client?.name,
      service: a.service?.name,
      staff: a.staff?.name,
    })));

  } catch (error) {
    console.error('Error during testing:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testQueries()
  .catch(console.error); 