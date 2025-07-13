const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkBusiness() {
  try {
    const business = await prisma.business.findFirst({
      where: { 
        OR: [
          { email: 'preto@preto.com' },
          { name: { contains: 'preto', mode: 'insensitive' } }
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
    
    console.log('🔍 Business found:', business);
    
    if (business) {
      console.log('📧 Email:', business.email);
      console.log('🔐 Has password:', !!business.passwordHash);
      console.log('🏷️ Status:', business.status);
      console.log('🔗 Slug:', business.slug);
    }
    
    await prisma.$disconnect();
  } catch (error) {
    console.error('❌ Error:', error);
    await prisma.$disconnect();
  }
}

checkBusiness(); 