const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function cleanProductionDatabase() {
  try {
    console.log('🚨 ATENÇÃO: Este script vai APAGAR TODOS OS DADOS da base de dados!');
    console.log('⏳ Iniciando limpeza da base de dados...');
    
    // Disable foreign key checks temporarily
    await prisma.$executeRaw`SET FOREIGN_KEY_CHECKS = 0;`;
    
    console.log('📋 Limpando dados em ordem de dependência...');
    
    // 1. Relationship notes (depends on clients, staff)
    console.log('🗑️ Removendo notas de relacionamento...');
    await prisma.relationship_notes.deleteMany({});
    
    // 2. Appointments (depends on clients, staff, services)
    console.log('🗑️ Removendo agendamentos...');
    await prisma.appointments.deleteMany({});
    
    // 3. Client relationships (depends on clients)
    console.log('🗑️ Removendo relacionamentos de clientes...');
    await prisma.client_relationships.deleteMany({});
    
    // 4. Staff availability (depends on staff)
    console.log('🗑️ Removendo disponibilidade do staff...');
    await prisma.staff_availability.deleteMany({});
    
    // 5. Staff unavailability (depends on staff)
    console.log('🗑️ Removendo indisponibilidade do staff...');
    await prisma.staff_unavailability.deleteMany({});
    
    // 6. Staff services (depends on staff, services)
    console.log('🗑️ Removendo serviços do staff...');
    await prisma.staff_services.deleteMany({});
    
    // 7. Clients (depends on businesses)
    console.log('🗑️ Removendo clientes...');
    await prisma.client.deleteMany({});
    
    // 8. Staff (depends on businesses)
    console.log('🗑️ Removendo staff...');
    await prisma.staff.deleteMany({});
    
    // 9. Services (depends on businesses, categories)
    console.log('🗑️ Removendo serviços...');
    await prisma.service.deleteMany({});
    
    // 10. Categories (depends on businesses)
    console.log('🗑️ Removendo categorias...');
    await prisma.category.deleteMany({});
    
    // 11. Business hours (depends on businesses)
    console.log('🗑️ Removendo horários de funcionamento...');
    await prisma.business_hours.deleteMany({});
    
    // 12. Businesses (main entities)
    console.log('🗑️ Removendo empresas...');
    await prisma.business.deleteMany({});
    
    // 13. Users (authentication)
    console.log('🗑️ Removendo usuários...');
    await prisma.user.deleteMany({});
    
    // Re-enable foreign key checks
    await prisma.$executeRaw`SET FOREIGN_KEY_CHECKS = 1;`;
    
    console.log('✅ Base de dados limpa com sucesso!');
    console.log('🎉 Pronto para receber dados reais de produção!');
    
    // Reset auto-increment counters (optional)
    console.log('🔄 Resetando contadores de auto-incremento...');
    const tables = [
      'business', 'user', 'staff', 'client', 'category', 'service', 
      'appointments', 'staff_availability', 'staff_unavailability', 
      'staff_services', 'client_relationships', 'relationship_notes', 
      'business_hours'
    ];
    
    for (const table of tables) {
      try {
        await prisma.$executeRawUnsafe(`ALTER TABLE ${table} AUTO_INCREMENT = 1;`);
      } catch (error) {
        console.log(`ℹ️ Tabela ${table} não tem auto-increment ou já está resetada`);
      }
    }
    
    console.log('✅ Contadores resetados!');
    console.log('');
    console.log('📊 RESUMO DA LIMPEZA:');
    console.log('• Todos os dados de teste foram removidos');
    console.log('• Estrutura das tabelas mantida intacta');
    console.log('• Contadores de ID resetados para 1');
    console.log('• Sistema pronto para dados de produção');
    console.log('');
    console.log('🚀 Pode agora criar o primeiro negócio real!');
    
  } catch (error) {
    console.error('❌ Erro durante a limpeza:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Execute only if run directly
if (require.main === module) {
  console.log('');
  console.log('🧹 SCRIPT DE LIMPEZA DA BASE DE DADOS DE PRODUÇÃO');
  console.log('================================================');
  console.log('');
  
  // Add a safety confirmation
  const args = process.argv.slice(2);
  if (!args.includes('--confirm')) {
    console.log('⚠️  SEGURANÇA: Este script apaga TODOS os dados!');
    console.log('');
    console.log('Para confirmar a execução, execute:');
    console.log('node src/scripts/clean-production-database.js --confirm');
    console.log('');
    process.exit(1);
  }
  
  cleanProductionDatabase()
    .then(() => {
      console.log('✅ Script executado com sucesso!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Falha na execução:', error);
      process.exit(1);
    });
}

module.exports = { cleanProductionDatabase }; 