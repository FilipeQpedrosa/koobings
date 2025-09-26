const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function listStaff() {
  try {
    console.log('🔍 Listing all staff...');
    
    const staff = await prisma.staff.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        businessId: true
      }
    });
    
    console.log('📊 Found', staff.length, 'staff members:');
    staff.forEach((member, index) => {
      console.log(`${index + 1}. ${member.name} (${member.email}) - ${member.role} - Business: ${member.businessId}`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

listStaff();
