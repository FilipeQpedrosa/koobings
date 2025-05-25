import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = 'admin@example.com';
  const password = 'admin123';
  const name = 'System Admin';
  const role = 'SUPER_ADMIN';

  const existing = await prisma.systemAdmin.findUnique({ where: { email } });
  if (existing) {
    console.log('Admin user already exists:', email);
    return;
  }

  const passwordHash = await bcrypt.hash(password, 12);
  await prisma.systemAdmin.create({
    data: {
      email,
      name,
      role,
      passwordHash,
    },
  });
  console.log('Seeded admin user:', email);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
}).finally(() => prisma.$disconnect()); 