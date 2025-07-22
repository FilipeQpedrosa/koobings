const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function fixMariEmail() {
  try {
    console.log('🔧 [FIX] Corrigindo email do Mari Nails...\n');

    // Find Mari Nails business
    const mariNails = await prisma.business.findFirst({
      where: {
        OR: [
          { name: { contains: 'Mari', mode: 'insensitive' } },
          { slug: 'mari-nails' }
        ]
      }
    });

    if (!mariNails) {
      console.log('❌ Mari Nails não encontrado!');
      return;
    }

    console.log('📋 Mari Nails encontrado:');
    console.log(`   ID: ${mariNails.id}`);
    console.log(`   Nome: ${mariNails.name}`);
    console.log(`   Email atual: ${mariNails.email}`);
    console.log();

    // Update the email
    const updatedBusiness = await prisma.business.update({
      where: { id: mariNails.id },
      data: {
        email: 'marigabiatti@hotmail.com',
        updatedAt: new Date()
      }
    });

    console.log('✅ Email atualizado com sucesso!');
    console.log(`   Email novo: ${updatedBusiness.email}`);
    console.log();

    // Also check if we need to update staff email
    const staffAdmin = await prisma.staff.findFirst({
      where: {
        businessId: mariNails.id,
        role: 'ADMIN'
      }
    });

    if (staffAdmin && staffAdmin.email === 'admin@marinails.com') {
      console.log('👤 Atualizando email do staff admin...');
      await prisma.staff.update({
        where: { id: staffAdmin.id },
        data: {
          email: 'marigabiatti@hotmail.com',
          updatedAt: new Date()
        }
      });
      console.log('✅ Email do staff admin atualizado!');
    }

    console.log('🎉 Correção completa! Mari Nails agora tem o email correto.');

  } catch (error) {
    console.error('❌ Erro ao corrigir email:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixMariEmail(); 