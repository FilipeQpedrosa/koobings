const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function listBusinesses() {
  try {
    console.log('🔍 Listing all businesses...');
    
    const businesses = await prisma.business.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        slug: true,
        status: true
      }
    });
    
    console.log('📊 Found', businesses.length, 'businesses:');
    businesses.forEach((business, index) => {
      console.log(`${index + 1}. ${business.name} (${business.email}) - ${business.slug} - ${business.status}`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

listBusinesses();
