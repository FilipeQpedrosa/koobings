const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const { createId } = require('@paralleldrive/cuid2');

const prisma = new PrismaClient();

async function createMariStaff() {
  try {
    console.log('👤 Creating Mari Nails staff...');
    
    // Find the business
    const business = await prisma.business.findUnique({
      where: { email: 'marigabiatti@hotmail.com' }
    });
    
    if (!business) {
      console.log('❌ Business not found!');
      return;
    }
    
    console.log('✅ Found business:', business.name);
    
    const password = 'mari123';
    const passwordHash = await bcrypt.hash(password, 12);
    
    // Create admin staff
    const staffId = createId();
    const staff = await prisma.staff.create({
      data: {
        id: staffId,
        name: 'Mariana',
        email: 'marigabiatti@hotmail.com',
        password: passwordHash,
        role: 'ADMIN',
        businessId: business.id,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    });
    
    console.log('✅ Admin staff created:', staff.name);
    console.log('🆔 Staff ID:', staff.id);
    console.log('🔑 Password:', password);
    
    console.log('🎉 MARI NAILS STAFF SETUP COMPLETE!');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createMariStaff();
