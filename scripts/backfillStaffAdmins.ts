import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const businesses = await prisma.business.findMany();
  for (const business of businesses) {
    const staff = await prisma.staff.findFirst({
      where: { businessId: business.id, role: 'ADMIN' }
    });
    if (!staff) {
      await prisma.staff.create({
        data: {
          name: business.ownerName || business.name,
          email: business.email,
          role: 'ADMIN',
          businessId: business.id,
          password: business.passwordHash || '',
        }
      });
      console.log(`Created admin staff for business: ${business.name}`);
    }
  }
  console.log('Backfill complete.');
}

main().catch(e => {
  console.error(e);
  process.exit(1);
}).finally(() => prisma.$disconnect()); 