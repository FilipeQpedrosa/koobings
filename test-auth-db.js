// Test authentication and database access
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testAuthAndDB() {
  console.log('🧪 Testing authentication and database access...');

  try {
    // Test 1: Check if business exists
    const businessId = '2da6e3d6-ef8b-4ea2-894e-1426d7d39677';
    console.log('🔍 Checking business:', businessId);
    
    const business = await prisma.business.findUnique({
      where: { id: businessId }
    });
    
    if (!business) {
      console.error('❌ Business not found:', businessId);
      return;
    }
    console.log('✅ Business found:', business.name);

    // Test 2: Check services for this business
    console.log('\n🔍 Checking services for business...');
    
    const services = await prisma.service.findMany({
      where: { businessId },
      orderBy: { createdAt: 'desc' }
    });
    
    console.log('✅ Services found:', services.length);
    services.forEach((service, index) => {
      console.log(`${index + 1}. ${service.name} (${service.id})`);
    });

    // Test 3: Check if there are any services at all
    console.log('\n🔍 Checking all services in database...');
    
    const allServices = await prisma.service.findMany({
      select: {
        id: true,
        name: true,
        businessId: true
      }
    });
    
    console.log('✅ Total services in database:', allServices.length);
    allServices.forEach((service, index) => {
      console.log(`${index + 1}. ${service.name} (Business: ${service.businessId})`);
    });

    // Test 4: Check if there are any businesses at all
    console.log('\n🔍 Checking all businesses...');
    
    const allBusinesses = await prisma.business.findMany({
      select: {
        id: true,
        name: true,
        slug: true
      }
    });
    
    console.log('✅ Total businesses in database:', allBusinesses.length);
    allBusinesses.forEach((business, index) => {
      console.log(`${index + 1}. ${business.name} (${business.slug}) - ID: ${business.id}`);
    });

  } catch (error) {
    console.error('❌ Error:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      meta: error.meta
    });
  } finally {
    await prisma.$disconnect();
  }
}

testAuthAndDB();
