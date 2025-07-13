const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createAdmin() {
  try {
    // Create password hash
    const passwordHash = await bcrypt.hash('test123', 12);

    // Update or create admin
    const admin = await prisma.system_admins.upsert({
      where: { email: 'f.queirozpedrosa@gmail.com' },
      update: {
        passwordHash: passwordHash,
        name: 'Filipe Pedrosa',
        role: 'SUPER_ADMIN',
        updatedAt: new Date(),
        isDeleted: false
      },
      create: {
        id: 'admin-' + Date.now(),
        email: 'f.queirozpedrosa@gmail.com',
        name: 'Filipe Pedrosa',
        role: 'SUPER_ADMIN',
        passwordHash: passwordHash,
        updatedAt: new Date(),
        isDeleted: false
      }
    });

    console.log('✅ Admin updated/created successfully:', admin.email);
    console.log('✅ Password: test123');
  } catch (error) {
    console.error('❌ Error creating admin:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin(); 