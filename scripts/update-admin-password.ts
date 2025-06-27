import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const email = 'f.queirozpedrosa@gmail.com'; // Email do admin
  const passwordHash = '$2a$10$Vh1IM6t5GTtYSSgg0kSXhOkb/Q0FWdLgauujK2R5u8CicaPCxVxIG'; // Hash de Pipoman#1988

  const updated = await prisma.systemAdmin.update({
    where: { email },
    data: { passwordHash },
  });

  console.log('SystemAdmin atualizado:', updated);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 