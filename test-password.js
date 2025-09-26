const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function testPassword() {
  try {
    console.log('🔍 Testing password for marigabiatti@hotmail.com...');
    
    const staff = await prisma.staff.findUnique({
      where: { email: 'marigabiatti@hotmail.com' },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
        role: true
      }
    });
    
    if (!staff) {
      console.log('❌ Staff not found!');
      return;
    }
    
    console.log('✅ Staff found:', staff.name);
    console.log('🔑 Password hash:', staff.password);
    
    // Test password
    const testPassword = 'mari123';
    const isValid = await bcrypt.compare(testPassword, staff.password);
    
    console.log('🧪 Password test result:', isValid);
    
    if (!isValid) {
      console.log('🔧 Updating password...');
      const newPasswordHash = await bcrypt.hash(testPassword, 12);
      
      await prisma.staff.update({
        where: { id: staff.id },
        data: { password: newPasswordHash }
      });
      
      console.log('✅ Password updated!');
      
      // Test again
      const isValidAfter = await bcrypt.compare(testPassword, newPasswordHash);
      console.log('🧪 Password test after update:', isValidAfter);
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testPassword();
