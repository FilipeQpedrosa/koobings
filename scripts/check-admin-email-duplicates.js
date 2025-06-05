const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const email = 'f.queirozpedrosa@gmail.com';

  const systemAdmins = await prisma.systemAdmin.findMany({ where: { email } });
  const staff = await prisma.staff.findMany({ where: { email } });
  const businesses = await prisma.business.findMany({ where: { email } });

  console.log('--- systemAdmin table ---');
  console.log(systemAdmins);
  console.log('--- staff table ---');
  console.log(staff);
  console.log('--- business table ---');
  console.log(businesses);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect()); 