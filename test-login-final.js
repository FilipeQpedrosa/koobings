const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function testLogin() {
  try {
    console.log('🔍 VERIFICANDO ORLANDO NA BASE DE DADOS...');
    
    // Find Orlando in Staff table
    const orlando = await prisma.staff.findUnique({
      where: { email: 'barbeariaorlando15@gmail.com' },
      include: { business: true }
    });
    
    if (!orlando) {
      console.log('❌ Orlando não encontrado na tabela Staff');
      return;
    }
    
    console.log('✅ Orlando encontrado:', {
      name: orlando.name,
      email: orlando.email,
      businessName: orlando.businessName,
      role: orlando.role,
      businessId: orlando.businessId,
      businessFromRelation: orlando.business?.name
    });
    
    // Test password
    const passwordMatch = await bcrypt.compare('orlando123', orlando.password);
    console.log('🔐 Password match:', passwordMatch);
    
    if (passwordMatch) {
      console.log('✅ LOGIN DEVERIA FUNCIONAR!');
      console.log('📊 Dados para sessão:', {
        id: orlando.id,
        email: orlando.email,
        name: orlando.name,
        role: 'STAFF',
        businessId: orlando.businessId,
        staffRole: orlando.role,
        businessName: orlando.businessName || orlando.business?.name,
        permissions: orlando.role === 'ADMIN' ? ['canManageBusiness'] : ['canViewSchedule']
      });
    } else {
      console.log('❌ PASSWORD INCORRECTA!');
    }
    
  } catch (error) {
    console.error('❌ Erro:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testLogin(); 