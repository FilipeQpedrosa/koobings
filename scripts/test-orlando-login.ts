import { PrismaClient } from '@prisma/client';
import { compare } from 'bcryptjs';

const prisma = new PrismaClient();

async function testOrlandoLogin() {
  console.log('🔍 Testing Orlando Login...\n');

  const email = 'barbeariaorlando15@gmail.com';
  const testPassword = 'your-test-password-here'; // Replace with actual password

  try {
    console.log('📧 Testing email:', email);
    
    // Check staff record
    console.log('\n👥 CHECKING STAFF TABLE:');
    const staff = await prisma.staff.findUnique({
      where: { email },
      include: { business: true }
    });
    
    if (staff) {
      console.log('✅ Staff found:');
      console.log(JSON.stringify({
        id: staff.id,
        email: staff.email,
        name: staff.name,
        role: staff.role,
        businessId: staff.businessId,
        businessName: staff.business?.name,
        createdAt: staff.createdAt
      }, null, 2));
      
      // Test password (uncomment if you know the password)
      // const staffPasswordMatch = await compare(testPassword, staff.password);
      // console.log('🔐 Staff password match:', staffPasswordMatch);
    } else {
      console.log('❌ No staff found');
    }

    // Check business record
    console.log('\n🏢 CHECKING BUSINESS TABLE:');
    const business = await prisma.business.findUnique({
      where: { email }
    });
    
    if (business) {
      console.log('✅ Business found:');
      console.log(JSON.stringify({
        id: business.id,
        email: business.email,
        name: business.name,
        ownerName: business.ownerName,
        status: business.status,
        createdAt: business.createdAt
      }, null, 2));
      
      // Test password (uncomment if you know the password)
      // const businessPasswordMatch = await compare(testPassword, business.passwordHash);
      // console.log('🔐 Business password match:', businessPasswordMatch);
    } else {
      console.log('❌ No business found');
    }

    // What should happen during login
    console.log('\n🎯 EXPECTED LOGIN BEHAVIOR:');
    if (staff && business) {
      console.log('⚠️  Both staff and business records exist!');
      console.log('📋 During login, the auth system will:');
      console.log('  1. First check staff table → MATCH found');
      console.log('  2. Return staff user object with:');
      console.log('     - role: "STAFF"');
      console.log('     - businessId:', staff.businessId);
      console.log('     - staffRole:', staff.role);
      console.log('     - name:', staff.name);
      console.log('  3. Skip business table check (staff found first)');
      
      console.log('\n💡 RECOMMENDATION:');
      console.log('Since Orlando is the business owner, we should either:');
      console.log('A) Delete the staff record and keep only business record');
      console.log('B) Update the authentication logic to prefer business over staff');
      console.log('C) Use different email addresses for business vs staff');
    } else if (staff) {
      console.log('✅ Only staff record exists - will login as STAFF');
    } else if (business) {
      console.log('✅ Only business record exists - will login as BUSINESS_OWNER');
    } else {
      console.log('❌ No records found - login will fail');
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testOrlandoLogin().catch(console.error); 