import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const staffList = await prisma.staff.findMany({
    include: { availability: true }
  });
  for (const staff of staffList) {
    console.log(`\nStaff: ${staff.name} (${staff.email})`);
    if (!staff.availability) {
      console.log('  No availability set.');
      continue;
    }
    console.dir(staff.availability.schedule, { depth: null });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 