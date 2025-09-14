// Find the correct business ID
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function findBusiness() {
  console.log('🔍 Finding businesses in database...');

  try {
    const businesses = await prisma.business.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        slug: true
      }
    });

    console.log('📋 Found businesses:');
    businesses.forEach((business, index) => {
      console.log(`${index + 1}. ID: ${business.id}`);
      console.log(`   Name: ${business.name}`);
      console.log(`   Email: ${business.email}`);
      console.log(`   Slug: ${business.slug}`);
      console.log('');
    });

    if (businesses.length === 0) {
      console.log('❌ No businesses found in database');
    } else {
      console.log(`✅ Found ${businesses.length} business(es)`);
    }

  } catch (error) {
    console.error('❌ Error finding businesses:', error);
  } finally {
    await prisma.$disconnect();
  }
}

findBusiness();
