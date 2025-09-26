const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function resetMariPassword() {
  try {
    console.log('🔧 Resetting Mari Nails password...');
    
    const email = 'marigabiatti@hotmail.com';
    const newPassword = 'mari123';
    
    // Generate new hash
    console.log('🔒 Generating new password hash...');
    const newPasswordHash = await bcrypt.hash(newPassword, 12);
    console.log('✅ New hash generated, length:', newPasswordHash.length);
    
    // Update the business password
    console.log('💾 Updating business password in database...');
    const updatedBusiness = await prisma.business.update({
      where: { email },
      data: { passwordHash: newPasswordHash }
    });
    
    console.log('✅ Password updated successfully!');
    console.log('📧 Business email:', updatedBusiness.email);
    console.log('🔑 New password:', newPassword);
    
    // Test the new password
    console.log('🧪 Testing new password...');
    const testMatch = await bcrypt.compare(newPassword, newPasswordHash);
    console.log('🔐 Test result:', testMatch);
    
    if (testMatch) {
      console.log('🎉 PASSWORD RESET SUCCESSFUL!');
    } else {
      console.log('❌ Password reset failed!');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

resetMariPassword();
