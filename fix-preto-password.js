const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function fixPretoPassword() {
  try {
    const newPassword = 'preto123';
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    console.log('🔄 Updating preto business password...');
    
    const updatedBusiness = await prisma.business.update({
      where: { email: 'preto@preto.com' },
      data: { passwordHash: hashedPassword },
      select: {
        id: true,
        name: true,
        email: true,
        slug: true
      }
    });
    
    console.log('✅ Password updated for business:', updatedBusiness);
    console.log('🔐 New password:', newPassword);
    
    await prisma.$disconnect();
  } catch (error) {
    console.error('❌ Error:', error);
    await prisma.$disconnect();
  }
}

fixPretoPassword(); 