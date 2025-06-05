const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const email = 'pipo_pedros@hotmail.com';
  const password = 'Pipoman#1988';
  const name = 'Pipo Pedros';

  // Find any business to assign as businessId (replace with your actual businessId if needed)
  const business = await prisma.business.findFirst();
  if (!business) {
    console.error('No business found. Please create a business first.');
    process.exit(1);
  }

  const existing = await prisma.staff.findUnique({ where: { email } });
  if (existing) {
    console.log('Admin staff already exists:', email);
    return;
  }

  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.staff.create({
    data: {
      email,
      name,
      role: 'ADMIN',
      password: passwordHash,
      businessId: business.id,
    },
  });

  console.log('New admin staff created:', email);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect()); 