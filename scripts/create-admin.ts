import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function createAdmin() {
  try {
    // Delete existing admin if exists
    await prisma.systemAdmin.deleteMany({
      where: { email: 'f.queirozpedrosa@gmail.com' }
    });

    // Create new admin with correct password
    const hashedPassword = await hash('admin123', 12);
    
    const admin = await prisma.systemAdmin.create({
      data: {
        email: 'f.queirozpedrosa@gmail.com',
        name: 'Filipe Pedrosa',
        role: 'SUPER_ADMIN',
        passwordHash: hashedPassword,
      },
    });

    console.log('✅ Admin criado com sucesso!');
    console.log('📧 Email: f.queirozpedrosa@gmail.com');
    console.log('🔑 Password: admin123');
    console.log('👑 Role: SUPER_ADMIN');
    
  } catch (error) {
    console.error('❌ Erro ao criar admin:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin(); 