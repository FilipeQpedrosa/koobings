const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkClientAccount() {
  try {
    console.log('🔍 Verificando contas de cliente independente...\n');
    
    // Check for independent client with email filipe@koobings.com
    const client = await prisma.independentClient.findFirst({
      where: {
        email: 'filipe@koobings.com'
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        password: true // Will show that it exists without revealing the hash
      }
    });

    if (client) {
      console.log('✅ CONTA CLIENTE INDEPENDENTE ENCONTRADA:');
      console.log('ID:', client.id);
      console.log('Nome:', client.name);
      console.log('Email:', client.email);
      console.log('Telefone:', client.phone || 'Não definido');
      console.log('Status:', client.status);
      console.log('Criado em:', client.createdAt);
      console.log('Atualizado em:', client.updatedAt);
      console.log('Password existe:', client.password ? 'SIM (hash protegida)' : 'NÃO');
      console.log('\n✅ CONFIRMAÇÃO: É uma conta CLIENTE INDEPENDENTE (não vinculada a empresa específica)');
    } else {
      console.log('❌ NENHUMA CONTA CLIENTE INDEPENDENTE ENCONTRADA com email: filipe@koobings.com');
    }

    // Also check if there's any old Client record (business-specific)
    console.log('\n📋 Verificando também tabela Client (vinculada a empresas):');
    const businessClient = await prisma.client.findFirst({
      where: {
        email: 'filipe@koobings.com'
      }
    });

    if (businessClient) {
      console.log('⚠️  ENCONTRADA conta Cliente vinculada a empresa:');
      console.log('ID:', businessClient.id);
      console.log('Nome:', businessClient.name);
      console.log('BusinessId:', businessClient.businessId);
    } else {
      console.log('✅ Nenhuma conta Cliente vinculada a empresa encontrada');
    }

    // Count total independent clients
    const totalIndependentClients = await prisma.independentClient.count();
    console.log('\n📊 Total de clientes independentes na base de dados:', totalIndependentClients);

  } catch (error) {
    console.error('❌ Erro ao verificar cliente:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkClientAccount(); 