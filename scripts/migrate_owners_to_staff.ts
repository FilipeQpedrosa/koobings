import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function migrateOwnersToStaff() {
  const businesses = await prisma.business.findMany();
  let createdCount = 0;

  for (const business of businesses) {
    const existingStaff = await prisma.staff.findUnique({ where: { email: business.email } });
    if (!existingStaff) {
      await prisma.staff.create({
        data: {
          name: business.name,
          email: business.email,
          password: business.passwordHash,
          role: 'ADMIN',
          businessId: business.id,
        },
      });
      console.log(`Created staff for business owner: ${business.email}`);
      createdCount++;
    } else {
      console.log(`Staff already exists for: ${business.email}`);
    }
  }

  console.log(`Migration complete. Created ${createdCount} new staff records.`);
  await prisma.$disconnect();
}

migrateOwnersToStaff().catch((e) => {
  console.error(e);
  prisma.$disconnect();
  process.exit(1);
}); 