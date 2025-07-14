const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkUserData() {
  try {
    console.log('🔍 Checking database for miguel@lanche.com...\n');
    
    // Check Staff table
    const staff = await prisma.staff.findUnique({
      where: { email: 'miguel@lanche.com' }
    });
    
    if (staff) {
      console.log('👨‍💼 FOUND in Staff table:');
      console.log('  - ID:', staff.id);
      console.log('  - Name:', staff.name);
      console.log('  - Email:', staff.email);
      console.log('  - Business ID:', staff.businessId);
      console.log('  - Role:', staff.role);
      console.log('');
    }
    
    // Check Business table
    const business = await prisma.business.findUnique({
      where: { email: 'miguel@lanche.com' }
    });
    
    if (business) {
      console.log('🏢 FOUND in Business table:');
      console.log('  - ID:', business.id);
      console.log('  - Name:', business.name);
      console.log('  - Owner Name:', business.ownerName);
      console.log('  - Email:', business.email);
      console.log('  - Slug:', business.slug);
      console.log('');
    }
    
    // Check System_admins table
    const admin = await prisma.system_admins.findUnique({
      where: { email: 'miguel@lanche.com' }
    });
    
    if (admin) {
      console.log('👑 FOUND in System_admins table:');
      console.log('  - ID:', admin.id);
      console.log('  - Name:', admin.name);
      console.log('  - Email:', admin.email);
      console.log('  - Role:', admin.role);
      console.log('');
    }
    
    if (!staff && !business && !admin) {
      console.log('❌ miguel@lanche.com NOT FOUND in any table!');
    }
    
    console.log('🔍 Also checking for "Pretinho" name...\n');
    
    // Find any records with "Pretinho" name
    const staffWithPretinho = await prisma.staff.findMany({
      where: { 
        name: { contains: 'Pretinho', mode: 'insensitive' }
      }
    });
    
    const businessWithPretinho = await prisma.business.findMany({
      where: { 
        OR: [
          { name: { contains: 'Pretinho', mode: 'insensitive' } },
          { ownerName: { contains: 'Pretinho', mode: 'insensitive' } }
        ]
      }
    });
    
    const adminWithPretinho = await prisma.system_admins.findMany({
      where: { 
        name: { contains: 'Pretinho', mode: 'insensitive' }
      }
    });
    
    if (staffWithPretinho.length > 0) {
      console.log('👨‍💼 Staff records with "Pretinho":');
      staffWithPretinho.forEach(s => {
        console.log(`  - ${s.name} (${s.email}) - ID: ${s.id}`);
      });
      console.log('');
    }
    
    if (businessWithPretinho.length > 0) {
      console.log('🏢 Business records with "Pretinho":');
      businessWithPretinho.forEach(b => {
        console.log(`  - ${b.name} / ${b.ownerName} (${b.email}) - ID: ${b.id}`);
      });
      console.log('');
    }
    
    if (adminWithPretinho.length > 0) {
      console.log('👑 Admin records with "Pretinho":');
      adminWithPretinho.forEach(a => {
        console.log(`  - ${a.name} (${a.email}) - ID: ${a.id}`);
      });
      console.log('');
    }
    
  } catch (error) {
    console.error('❌ Error checking data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkUserData(); 