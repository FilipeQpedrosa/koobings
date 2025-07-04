import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function debugUsers() {
  console.log('🔍 Debugging Users in Database...\n');

  try {
    // Check system admins
    console.log('👑 SYSTEM ADMINS:');
    const admins = await prisma.systemAdmin.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      }
    });
    console.log(JSON.stringify(admins, null, 2));
    console.log(`Total: ${admins.length}\n`);

    // Check businesses
    console.log('🏢 BUSINESSES:');
    const businesses = await prisma.business.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        ownerName: true,
        status: true,
        createdAt: true,
      }
    });
    console.log(JSON.stringify(businesses, null, 2));
    console.log(`Total: ${businesses.length}\n`);

    // Check staff members
    console.log('👥 STAFF MEMBERS:');
    const staff = await prisma.staff.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        businessId: true,
        business: {
          select: {
            name: true,
            email: true,
          }
        },
        createdAt: true,
      }
    });
    console.log(JSON.stringify(staff, null, 2));
    console.log(`Total: ${staff.length}\n`);

    // Check for duplicate emails
    console.log('⚠️  CHECKING FOR DUPLICATE EMAILS:');
    const allEmails = [
      ...admins.map(a => ({ email: a.email, type: 'admin', name: a.name })),
      ...businesses.map(b => ({ email: b.email, type: 'business', name: b.name || b.ownerName })),
      ...staff.map(s => ({ email: s.email, type: 'staff', name: s.name, business: s.business?.name })),
    ];

    const emailCounts = allEmails.reduce((acc, user) => {
      acc[user.email] = (acc[user.email] || []);
      acc[user.email].push(user);
      return acc;
    }, {} as Record<string, any[]>);

    const duplicates = Object.entries(emailCounts).filter(([_, users]) => users.length > 1);
    
    if (duplicates.length > 0) {
      console.log('❌ DUPLICATE EMAILS FOUND:');
      duplicates.forEach(([email, users]) => {
        console.log(`Email: ${email}`);
        users.forEach(user => {
          console.log(`  - ${user.type}: ${user.name}${user.business ? ` (${user.business})` : ''}`);
        });
        console.log('');
      });
    } else {
      console.log('✅ No duplicate emails found');
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

debugUsers().catch(console.error); 