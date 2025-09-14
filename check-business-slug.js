// Check if business exists by slug
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkBusinessBySlug() {
  console.log('🔍 Checking business by slug...');

  try {
    // Check by slug
    const businessBySlug = await prisma.business.findUnique({
      where: { slug: 'mari-nails' }
    });

    if (businessBySlug) {
      console.log('✅ Business found by slug:');
      console.log('ID:', businessBySlug.id);
      console.log('Name:', businessBySlug.name);
      console.log('Email:', businessBySlug.email);
      console.log('Slug:', businessBySlug.slug);
    } else {
      console.log('❌ No business found with slug: mari-nails');
    }

    // Check by email
    const businessByEmail = await prisma.business.findUnique({
      where: { email: 'marigabiatti@hotmail.com' }
    });

    if (businessByEmail) {
      console.log('\n✅ Business found by email:');
      console.log('ID:', businessByEmail.id);
      console.log('Name:', businessByEmail.name);
      console.log('Email:', businessByEmail.email);
      console.log('Slug:', businessByEmail.slug);
    } else {
      console.log('\n❌ No business found with email: marigabiatti@hotmail.com');
    }

    // List all businesses
    console.log('\n📋 All businesses in database:');
    const allBusinesses = await prisma.business.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        slug: true
      }
    });

    allBusinesses.forEach((business, index) => {
      console.log(`${index + 1}. ${business.name} (${business.slug})`);
      console.log(`   ID: ${business.id}`);
      console.log(`   Email: ${business.email}`);
      console.log('');
    });

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkBusinessBySlug();
