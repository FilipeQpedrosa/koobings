import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = 'f.queirozpedrosa@gmail.com';
  const newPassword = 'Pipoman#1988';
  const passwordHash = await hash(newPassword, 10);

  const admin = await prisma.systemAdmin.findUnique({ where: { email } });
  if (!admin) {
    console.error(`No system admin found with email: ${email}`);
    process.exit(1);
  }

  await prisma.systemAdmin.update({
    where: { email },
    data: { passwordHash },
  });

  console.log(`Password for ${email} has been reset.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 