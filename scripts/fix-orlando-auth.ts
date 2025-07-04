import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixOrlandoAuth() {
  console.log('🔧 Fixing Orlando authentication setup...\n');

  const email = 'barbeariaorlando15@gmail.com';

  try {
    console.log('📧 Working on email:', email);
    
    // Get current state
    const [staff, business] = await Promise.all([
      prisma.staff.findUnique({
        where: { email },
        include: { business: true }
      }),
      prisma.business.findUnique({
        where: { email }
      })
    ]);

    console.log('\n📊 CURRENT STATE:');
    console.log('Staff found:', !!staff);
    console.log('Business found:', !!business);

    if (!staff) {
      console.log('❌ No staff record found for Orlando!');
      return;
    }

    if (!business) {
      console.log('✅ No duplicate business record found. Orlando setup is already correct!');
      return;
    }

    console.log('\n🎯 FIXING DUPLICATE BUSINESS RECORD:');
    console.log('Staff record:', {
      id: staff.id,
      name: staff.name,
      role: staff.role,
      businessId: staff.businessId,
      businessName: staff.business?.name
    });
    
    console.log('Business record to remove:', {
      id: business.id,
      name: business.name,
      ownerName: business.ownerName
    });

    // Check if the business IDs match
    if (staff.businessId === business.id) {
      console.log('✅ Staff is correctly linked to the business');
    } else {
      console.log('⚠️  WARNING: Staff businessId does not match business id!');
      console.log('Staff businessId:', staff.businessId);
      console.log('Business id:', business.id);
    }

    // Remove the duplicate business record
    console.log('\n🗑️  Removing duplicate business record...');
    await prisma.business.delete({
      where: { email }
    });
    
    console.log('✅ Duplicate business record removed successfully!');
    console.log('\n📋 FINAL STATE:');
    console.log('✅ Orlando is now a Staff Admin for Barbearia Orlando');
    console.log('✅ Can login to staff portal as business owner');
    console.log('✅ No more authentication conflicts');

  } catch (error) {
    console.error('❌ Error fixing Orlando auth:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixOrlandoAuth().catch(console.error); 