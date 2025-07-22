const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function diagnoseAndFix() {
  try {
    console.log('🔍 COMPREHENSIVE ADMIN DIAGNOSIS...');
    
    // Step 1: Check connection
    console.log('\n1️⃣ Testing database connection...');
    await prisma.$connect();
    console.log('✅ Database connected');
    
    // Step 2: List all admins
    console.log('\n2️⃣ Listing all admins...');
    const allAdmins = await prisma.system_admins.findMany({
      select: { id: true, email: true, name: true, role: true, passwordHash: true }
    });
    
    console.log(`Found ${allAdmins.length} admin(s):`);
    allAdmins.forEach((admin, i) => {
      console.log(`  ${i+1}. ${admin.email} (${admin.name}) - Role: ${admin.role}`);
      console.log(`     ID: ${admin.id}`);
      console.log(`     Hash length: ${admin.passwordHash.length}`);
    });
    
    // Step 3: Create missing admin@koobings.com
    console.log('\n3️⃣ Ensuring admin@koobings.com exists...');
    const targetEmail = 'admin@koobings.com';
    const targetPassword = 'admin123';
    
    let targetAdmin = allAdmins.find(a => a.email === targetEmail);
    
    if (!targetAdmin) {
      console.log('❌ admin@koobings.com not found, creating...');
      const hashedPassword = await bcrypt.hash(targetPassword, 12);
      
      targetAdmin = await prisma.system_admins.create({
        data: {
          id: 'admin-koobings-fix-' + Date.now(),
          email: targetEmail,
          name: 'Admin Koobings',
          role: 'SUPER_ADMIN',
          passwordHash: hashedPassword,
          createdAt: new Date(),
          updatedAt: new Date(),
          isDeleted: false
        }
      });
      console.log('✅ Created admin@koobings.com');
    } else {
      console.log('✅ admin@koobings.com exists');
      
      // Update password to be sure
      const hashedPassword = await bcrypt.hash(targetPassword, 12);
      await prisma.system_admins.update({
        where: { id: targetAdmin.id },
        data: { passwordHash: hashedPassword }
      });
      console.log('✅ Password updated');
    }
    
    // Step 4: Test password
    console.log('\n4️⃣ Testing admin@koobings.com password...');
    const finalAdmin = await prisma.system_admins.findUnique({
      where: { email: targetEmail }
    });
    
    if (finalAdmin) {
      const passwordTest = await bcrypt.compare(targetPassword, finalAdmin.passwordHash);
      console.log(`Password test result: ${passwordTest}`);
      
      if (passwordTest) {
        console.log('\n🎉 ADMIN DIAGNOSIS COMPLETE!');
        console.log('✅ admin@koobings.com is ready');
        console.log('✅ Password: admin123');
        console.log('✅ Can be used for login');
      } else {
        console.log('\n❌ Password test failed!');
      }
    }
    
    // Step 5: Test API simulation
    console.log('\n5️⃣ Simulating API call...');
    const email = 'admin@koobings.com';
    const password = 'admin123';
    
    const admin = await prisma.system_admins.findUnique({
      where: { email }
    });
    
    if (!admin) {
      console.log('❌ API simulation: Admin not found');
    } else {
      console.log('✅ API simulation: Admin found');
      const isValid = await bcrypt.compare(password, admin.passwordHash);
      console.log(`✅ API simulation: Password valid: ${isValid}`);
      
      if (isValid) {
        console.log('✅ API simulation: Login would succeed');
        console.log('   Response would be:', {
          success: true,
          user: {
            id: admin.id,
            email: admin.email,
            name: admin.name,
            role: 'ADMIN',
            isAdmin: true
          }
        });
      }
    }
    
  } catch (error) {
    console.error('❌ Diagnosis failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

diagnoseAndFix(); 