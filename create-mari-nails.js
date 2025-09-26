const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const { createId } = require('@paralleldrive/cuid2');

const prisma = new PrismaClient();

async function createMariNails() {
  try {
    console.log('🏢 Creating Mari Nails business...');
    
    const businessId = createId();
    const password = 'mari123';
    const passwordHash = await bcrypt.hash(password, 12);
    
    // Create business
    const business = await prisma.business.create({
      data: {
        id: businessId,
        name: 'Mari Nails',
        email: 'marigabiatti@hotmail.com',
        slug: 'mari-nails',
        passwordHash: passwordHash,
        status: 'ACTIVE',
        type: 'HAIR_SALON',
        address: 'Rua da Saudade 76',
        phone: '',
        website: null,
        description: '',
        logo: null,
        settings: {
          plan: 'standard',
          features: {
            apiAccess: false,
            multipleStaff: true,
            customBranding: false,
            advancedReports: true,
            smsNotifications: false,
            calendarIntegration: true
          },
          visibility: {
            isPublic: true,
            adminNotes: '',
            showInSearch: true,
            adminApproved: true,
            lastUpdatedAt: new Date().toISOString(),
            lastUpdatedBy: 'system',
            showInMarketplace: true,
            allowOnlineBooking: true
          }
        },
        allowStaffToViewAllBookings: false,
        restrictStaffToViewAllClients: false,
        restrictStaffToViewAllNotes: false,
        requireAdminCancelApproval: false,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    });
    
    console.log('✅ Business created:', business.name);
    console.log('📧 Email:', business.email);
    console.log('🔑 Password:', password);
    console.log('🆔 Business ID:', business.id);
    
    // Create admin staff
    const staffId = createId();
    const staff = await prisma.staff.create({
      data: {
        id: staffId,
        name: 'Mariana',
        email: 'marigabiatti@hotmail.com',
        password: passwordHash,
        role: 'ADMIN',
        businessId: businessId,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    });
    
    console.log('✅ Admin staff created:', staff.name);
    console.log('🆔 Staff ID:', staff.id);
    
    console.log('🎉 MARI NAILS SETUP COMPLETE!');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createMariNails();
