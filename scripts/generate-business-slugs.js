const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Function to generate slug from business name
function generateSlug(name) {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^a-z0-9\s-]/g, '') // Remove special chars
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-'); // Replace multiple hyphens with single
}

// Ensure unique slug
async function ensureUniqueSlug(baseSlug, excludeId = null) {
  let slug = baseSlug;
  let counter = 1;
  
  while (true) {
    const existing = await prisma.business.findUnique({
      where: { slug }
    });
    
    if (!existing || (excludeId && existing.id === excludeId)) {
      return slug;
    }
    
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
}

async function generateBusinessSlugs() {
  try {
    console.log('🔄 Starting business slug generation...');
    
    // Get all businesses
    const businesses = await prisma.business.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        email: true
      }
    });
    
    console.log(`📊 Found ${businesses.length} total businesses`);
    
    let updateCount = 0;
    
    for (const business of businesses) {
      console.log(`\n🏢 Processing: ${business.name} (${business.email})`);
      
      const baseSlug = generateSlug(business.name);
      const uniqueSlug = await ensureUniqueSlug(baseSlug, business.id);
      
      // Update if slug is different or missing proper format
      if (business.slug !== uniqueSlug) {
        await prisma.business.update({
          where: { id: business.id },
          data: { slug: uniqueSlug }
        });
        
        console.log(`✅ Updated slug: ${business.slug} → ${uniqueSlug}`);
        updateCount++;
      } else {
        console.log(`✨ Slug already correct: ${uniqueSlug}`);
      }
    }
    
    console.log(`\n🎉 Business slug generation complete! Updated ${updateCount} businesses.`);
    
    // Show final results
    const allBusinesses = await prisma.business.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        email: true
      },
      orderBy: { name: 'asc' }
    });
    
    console.log('\n📋 Final business list:');
    allBusinesses.forEach(b => {
      console.log(`  • ${b.name} → ${b.slug} (${b.email})`);
    });
    
  } catch (error) {
    console.error('❌ Error generating slugs:', error);
  } finally {
    await prisma.$disconnect();
  }
}

generateBusinessSlugs(); 