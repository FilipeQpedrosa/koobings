// Create Mari Nails business in database
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createMariNailsBusiness() {
  console.log('🏢 Creating Mari Nails business...');

  try {
    const businessId = '2da6e3d6-ef8b-4ea2-894e-1426d7d39677'; // Same ID from JWT
    
    const business = await prisma.business.create({
      data: {
        id: businessId,
        name: 'Mari Nails',
        email: 'marigabiatti@hotmail.com',
        slug: 'mari-nails',
        passwordHash: 'temp-password-hash', // Will need to be updated
        ownerName: 'Mariana',
        phone: null,
        address: null,
        website: null,
        description: 'Nail salon services',
        logo: null,
        settings: {},
        type: 'HAIR_SALON', // Default type
        status: 'ACTIVE',
        allowStaffToViewAllBookings: false,
        restrictStaffToViewAllClients: false,
        restrictStaffToViewAllNotes: false,
        requireAdminCancelApproval: false,
        updatedAt: new Date()
      }
    });

    console.log('✅ Mari Nails business created successfully:');
    console.log('ID:', business.id);
    console.log('Name:', business.name);
    console.log('Email:', business.email);
    console.log('Slug:', business.slug);

    // Test service creation now
    console.log('\n🧪 Testing service creation with correct business ID...');
    
    const service = await prisma.service.create({
      data: {
        id: require('crypto').randomUUID(),
        businessId: businessId,
        name: 'Test Service',
        description: 'Test Description',
        duration: 30,
        price: 25.00,
        slotsNeeded: 1,
        eventType: 'INDIVIDUAL',
        capacity: 1,
        isActive: true,
        availabilitySchedule: {
          monday: { enabled: true, timeSlots: [] },
          tuesday: { enabled: true, timeSlots: [] },
          wednesday: { enabled: true, timeSlots: [] },
          thursday: { enabled: true, timeSlots: [] },
          friday: { enabled: true, timeSlots: [] },
          saturday: { enabled: false, timeSlots: [] },
          sunday: { enabled: false, timeSlots: [] }
        },
        slots: {},
        updatedAt: new Date()
      }
    });

    console.log('✅ Service created successfully:', service.name);

  } catch (error) {
    console.error('❌ Error creating business:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      meta: error.meta
    });
  } finally {
    await prisma.$disconnect();
  }
}

createMariNailsBusiness();
