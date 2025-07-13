const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function checkAndFixSteve() {
  try {
    // Check if steve business exists
    let business = await prisma.business.findFirst({
      where: { 
        OR: [
          { email: 'steve@apple.com' },
          { name: { contains: 'steve', mode: 'insensitive' } },
          { name: { contains: 'apple', mode: 'insensitive' } }
        ]
      },
      select: {
        id: true,
        name: true,
        email: true,
        slug: true,
        passwordHash: true,
        status: true
      }
    });
    
    console.log('🔍 Steve business found:', business);
    
    if (business) {
      // Fix password
      const newPassword = 'steve123';
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      
      console.log('🔄 Updating steve business password...');
      
      const updatedBusiness = await prisma.business.update({
        where: { id: business.id },
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
    } else {
      console.log('❌ Steve business not found');
    }
    
    await prisma.$disconnect();
  } catch (error) {
    console.error('❌ Error:', error);
    await prisma.$disconnect();
  }
}

checkAndFixSteve(); 