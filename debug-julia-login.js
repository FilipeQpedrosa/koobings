const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function debugJuliaLogin() {
  try {
    console.log('🔍 Debugging Julia login...\n');
    
    // Check staff record
    const staff = await prisma.staff.findFirst({
      where: { email: 'julia@julia.com' },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
        businessId: true,
        Business: {
          select: {
            name: true,
            slug: true
          }
        }
      }
    });
    
    if (staff) {
      console.log('👤 STAFF RECORD FOUND:');
      console.log('   Name:', staff.name);
      console.log('   Email:', staff.email);
      console.log('   Business:', staff.Business.name);
      console.log('   Business Slug:', staff.Business.slug);
      console.log('   Has password:', !!staff.password);
      
      // Test staff password
      if (staff.password) {
        const isValid = await bcrypt.compare('ju-unha123', staff.password);
        console.log('   Staff password valid:', isValid);
      }
    }
    
    console.log('\n');
    
    // Check business owner record
    const business = await prisma.business.findFirst({
      where: { email: 'julia@julia.com' },
      select: {
        id: true,
        name: true,
        email: true,
        slug: true,
        passwordHash: true
      }
    });
    
    if (business) {
      console.log('🏢 BUSINESS OWNER RECORD FOUND:');
      console.log('   Name:', business.name);
      console.log('   Email:', business.email);
      console.log('   Slug:', business.slug);
      console.log('   Has password:', !!business.passwordHash);
      
      // Test business password
      if (business.passwordHash) {
        const isValid = await bcrypt.compare('ju-unha123', business.passwordHash);
        console.log('   Business password valid:', isValid);
      }
    }
    
    console.log('\n🔧 RECOMMENDATION:');
    if (staff && business) {
      console.log('   - Julia exists as both STAFF and BUSINESS_OWNER');
      console.log('   - Login system tries STAFF first, then BUSINESS_OWNER');
      console.log('   - Need to fix STAFF password or remove duplicate');
    }
    
    await prisma.$disconnect();
  } catch (error) {
    console.error('❌ Error:', error);
    await prisma.$disconnect();
  }
}

debugJuliaLogin(); 