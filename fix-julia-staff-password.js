const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function fixJuliaStaffPassword() {
  try {
    console.log('🔧 Fixing Julia staff password...\n');
    
    // Option 1: Fix the staff password
    const hashedPassword = await bcrypt.hash('ju-unha123', 10);
    
    const updatedStaff = await prisma.staff.update({
      where: { email: 'julia@julia.com' },
      data: { password: hashedPassword },
      select: {
        name: true,
        email: true,
        Business: {
          select: {
            name: true,
            slug: true
          }
        }
      }
    });
    
    console.log('✅ Staff password updated:');
    console.log('   Name:', updatedStaff.name);
    console.log('   Email:', updatedStaff.email);
    console.log('   Business:', updatedStaff.Business.name);
    console.log('   New password: ju-unha123');
    
    // Test the updated password
    const staff = await prisma.staff.findFirst({
      where: { email: 'julia@julia.com' },
      select: { password: true }
    });
    
    const isValid = await bcrypt.compare('ju-unha123', staff.password);
    console.log('   Password test:', isValid ? '✅ VALID' : '❌ INVALID');
    
    await prisma.$disconnect();
  } catch (error) {
    console.error('❌ Error:', error);
    await prisma.$disconnect();
  }
}

fixJuliaStaffPassword(); 