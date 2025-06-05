const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const email = 'f.queirozpedrosa@gmail.com';
  const password = 'Pipoman#1988';
  const name = 'Filipe Queiroz Pedrosa';

  const passwordHash = await bcrypt.hash(password, 10);

  // Upsert: if the user exists, update password and role; otherwise, create
  await prisma.systemAdmin.upsert({
    where: { email },
    update: {
      name,
      passwordHash,
      role: 'SUPER_ADMIN',
    },
    create: {
      email,
      name,
      passwordHash,
      role: 'SUPER_ADMIN',
    },
  });

  console.log('SUPER_ADMIN ensured:');
  console.log('Email:', email);
  console.log('Password:', password);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect()); 