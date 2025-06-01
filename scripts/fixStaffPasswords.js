const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const staffList = await prisma.staff.findMany();
  for (const staff of staffList) {
    // Lowercase email if needed
    const email = staff.email.toLowerCase();

    // If password is not hashed, hash it
    // bcrypt hashes start with $2a$ or $2b$
    const isHashed = staff.password.startsWith('$2a$') || staff.password.startsWith('$2b$');
    let password = staff.password;
    if (!isHashed) {
      password = await bcrypt.hash(staff.password, 10);
      console.log(`Hashing password for ${email}`);
    }

    // Only update if something changed
    if (email !== staff.email || password !== staff.password) {
      await prisma.staff.update({
        where: { id: staff.id },
        data: { email, password },
      });
      console.log(`Updated staff: ${email}`);
    }
  }
  console.log('Done!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 