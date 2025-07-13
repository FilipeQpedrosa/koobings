const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function fixJuUnhaPassword() {
  try {
    console.log('🔍 Verificando negócio ju-unha...');
    
    // Find the business
    const business = await prisma.business.findFirst({
      where: { 
        OR: [
          { email: 'julia@julia.com' },
          { slug: 'ju-unha' },
          { name: { contains: 'ju-unha', mode: 'insensitive' } }
        ]
      },
      select: {
        id: true,
        name: true,
        email: true,
        slug: true,
        passwordHash: true
      }
    });
    
    if (!business) {
      console.log('❌ Negócio ju-unha não encontrado');
      return;
    }
    
    console.log('🏢 Negócio encontrado:', business.name);
    console.log('📧 Email:', business.email);
    console.log('🔗 Slug:', business.slug);
    
    // Test current password
    const currentPassword = 'ju-unha123';
    const isCurrentValid = await bcrypt.compare(currentPassword, business.passwordHash);
    console.log('🔐 Password atual válida:', isCurrentValid);
    
    if (!isCurrentValid) {
      console.log('🔄 Atualizando password...');
      
      // Set new password
      const newPassword = 'ju-unha123';
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      
      const updatedBusiness = await prisma.business.update({
        where: { id: business.id },
        data: { passwordHash: hashedPassword },
        select: {
          name: true,
          email: true,
          slug: true
        }
      });
      
      console.log('✅ Password atualizada para:', updatedBusiness.name);
      console.log('🔐 Nova password:', newPassword);
    }
    
    await prisma.$disconnect();
  } catch (error) {
    console.error('❌ Erro:', error);
    await prisma.$disconnect();
  }
}

fixJuUnhaPassword(); 