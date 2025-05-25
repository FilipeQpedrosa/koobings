const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const businessId = process.argv[2];
  if (!businessId) {
    console.error('Usage: node fix-services-business-id.js <businessId>');
    process.exit(1);
  }
  const updated = await prisma.service.updateMany({
    data: { businessId },
  });
  console.log(`Updated ${updated.count} services to businessId: ${businessId}`);
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
}); 