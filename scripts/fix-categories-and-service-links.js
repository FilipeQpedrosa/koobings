const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const businessId = process.argv[2];
  if (!businessId) {
    console.error('Usage: node fix-categories-and-service-links.js <businessId>');
    process.exit(1);
  }

  // 1. Update all categories to the correct businessId
  const updatedCategories = await prisma.serviceCategory.updateMany({
    data: { businessId },
  });
  console.log(`Updated ${updatedCategories.count} categories to businessId: ${businessId}`);

  // 2. For all services, disconnect category if it doesn't belong to the business
  const services = await prisma.service.findMany({
    include: { category: true },
  });
  let fixed = 0;
  for (const service of services) {
    if (service.categoryId && service.category && service.category.businessId !== businessId) {
      try {
        await prisma.service.update({
          where: { id: service.id },
          data: { categoryId: null },
        });
        fixed++;
        console.log(`Disconnected category from service ${service.id} (was category ${service.categoryId})`);
      } catch (err) {
        console.error(`Error disconnecting category from service ${service.id}:`, err);
      }
    }
  }
  console.log(`Fixed ${fixed} services with mismatched category links.`);

  await prisma.$disconnect();
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
}); 