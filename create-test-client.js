const { PrismaClient } = require('@prisma/client');
const { createId } = require('@paralleldrive/cuid2');

const prisma = new PrismaClient();

async function createTestClient() {
  try {
    console.log('👤 Creating test client...');
    
    // Find the business
    const business = await prisma.business.findUnique({
      where: { email: 'marigabiatti@hotmail.com' }
    });
    
    if (!business) {
      console.log('❌ Business not found!');
      return;
    }
    
    console.log('✅ Found business:', business.name);
    
    // Create test client
    const clientId = createId();
    const client = await prisma.client.create({
      data: {
        id: clientId,
        name: 'Cliente Teste',
        email: 'teste@example.com',
        phone: '123456789',
        businessId: business.id,
        isEligible: true,
        status: 'ACTIVE',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    });
    
    console.log('✅ Test client created:', client.name);
    console.log('🆔 Client ID:', client.id);
    console.log('✅ Is Eligible:', client.isEligible);
    
    console.log('🎉 TEST CLIENT CREATED!');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestClient();
