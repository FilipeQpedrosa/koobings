#!/usr/bin/env ts-node

/**
 * 📊 RELATÓRIO DE STATUS DOS SERVIÇOS ANTIGOS
 * 
 * Verifica o que aconteceu com os serviços antigos após a implementação do sistema de slots.
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkServicesStatus() {
  console.log('📊 RELATÓRIO DE STATUS DOS SERVIÇOS ANTIGOS');
  console.log('==========================================\n');

  try {
    // 1. Verificar todos os serviços
    const allServices = await prisma.service.findMany({
      select: {
        id: true,
        name: true,
        duration: true,
        slotsNeeded: true,
        slotConfiguration: true,
        createdAt: true,
        updatedAt: true,
        Business: {
          select: {
            name: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    console.log(`📋 Total de serviços no sistema: ${allServices.length}`);

    if (allServices.length === 0) {
      console.log('\n💡 SITUAÇÃO ATUAL:');
      console.log('==================');
      console.log('✅ Não há serviços antigos no sistema');
      console.log('✅ O sistema está pronto para usar templates de slots');
      console.log('✅ Novos serviços serão criados automaticamente com slots');
      console.log('\n🎯 PRÓXIMOS PASSOS:');
      console.log('===================');
      console.log('1. Acesse /staff/settings/services');
      console.log('2. Use "Criar em Massa" para criar serviços rapidamente');
      console.log('3. Ou crie serviços individuais usando templates');
      console.log('4. Todos os novos serviços terão slots pré-definidos');
      return;
    }

    // 2. Categorizar serviços
    const servicesWithSlots = allServices.filter(s => s.slotsNeeded && s.slotsNeeded > 0);
    const servicesWithoutSlots = allServices.filter(s => !s.slotsNeeded || s.slotsNeeded === 0);
    const servicesWithTemplates = allServices.filter(s => (s.slotConfiguration as any)?.templateId);

    console.log(`✅ Serviços com slots: ${servicesWithSlots.length}`);
    console.log(`⚠️ Serviços sem slots: ${servicesWithoutSlots.length}`);
    console.log(`🎯 Serviços criados por templates: ${servicesWithTemplates.length}`);

    // 3. Detalhar serviços sem slots
    if (servicesWithoutSlots.length > 0) {
      console.log('\n⚠️ SERVIÇOS QUE PRECISAM DE MIGRAÇÃO:');
      console.log('====================================');
      servicesWithoutSlots.forEach(service => {
        console.log(`📝 ${service.name} (${service.duration}min) - Business: ${service.Business.name}`);
        console.log(`   Criado em: ${service.createdAt.toLocaleDateString()}`);
        console.log(`   Atualizado em: ${service.updatedAt.toLocaleDateString()}`);
      });
    }

    // 4. Detalhar serviços com slots
    if (servicesWithSlots.length > 0) {
      console.log('\n✅ SERVIÇOS COM SLOTS (MIGRADOS):');
      console.log('=================================');
      servicesWithSlots.forEach(service => {
        const isTemplateBased = (service.slotConfiguration as any)?.templateId;
        const templateInfo = isTemplateBased ? `🎯 Template: ${(service.slotConfiguration as any).templateId}` : '📝 Criado manualmente';
        
        console.log(`📝 ${service.name} (${service.slotsNeeded} slots, ${service.duration}min)`);
        console.log(`   ${templateInfo}`);
        console.log(`   Business: ${service.Business.name}`);
      });
    }

    // 5. Verificar appointments
    const allAppointments = await prisma.appointments.findMany({
      select: {
        id: true,
        scheduledFor: true,
        duration: true,
        startSlot: true,
        endSlot: true,
        slotsUsed: true,
        Service: {
          select: {
            name: true,
            slotsNeeded: true
          }
        }
      }
    });

    console.log(`\n📅 Total de agendamentos: ${allAppointments.length}`);

    const appointmentsWithSlots = allAppointments.filter(a => a.startSlot !== null && a.endSlot !== null);
    const appointmentsWithoutSlots = allAppointments.filter(a => a.startSlot === null || a.endSlot === null);

    console.log(`✅ Agendamentos com slots: ${appointmentsWithSlots.length}`);
    console.log(`⚠️ Agendamentos sem slots: ${appointmentsWithoutSlots.length}`);

    // 6. Verificar templates disponíveis
    const templates = await prisma.slotTemplate.findMany({
      where: { isActive: true },
      select: {
        id: true,
        name: true,
        slotsNeeded: true,
        duration: true,
        category: true,
        isDefault: true,
        businessId: true
      }
    });

    console.log(`\n🎯 Templates disponíveis: ${templates.length}`);
    const globalTemplates = templates.filter(t => t.isDefault);
    const customTemplates = templates.filter(t => !t.isDefault);
    
    console.log(`🌍 Templates globais: ${globalTemplates.length}`);
    console.log(`🏢 Templates personalizados: ${customTemplates.length}`);

    // 7. Resumo e recomendações
    console.log('\n📊 RESUMO E RECOMENDAÇÕES:');
    console.log('===========================');

    if (servicesWithoutSlots.length === 0 && appointmentsWithoutSlots.length === 0) {
      console.log('🎉 SITUAÇÃO IDEAL:');
      console.log('✅ Todos os serviços têm slots configurados');
      console.log('✅ Todos os agendamentos têm slots configurados');
      console.log('✅ Sistema de templates funcionando');
      console.log('\n🚀 SISTEMA PRONTO PARA USO!');
    } else {
      console.log('⚠️ AÇÕES NECESSÁRIAS:');
      
      if (servicesWithoutSlots.length > 0) {
        console.log(`1. Migrar ${servicesWithoutSlots.length} serviços para slots`);
        console.log('   Execute: npx ts-node scripts/migrate-existing-services.ts');
      }
      
      if (appointmentsWithoutSlots.length > 0) {
        console.log(`2. Migrar ${appointmentsWithoutSlots.length} agendamentos para slots`);
        console.log('   Execute: npx ts-node scripts/migrate-existing-services.ts');
      }
      
      console.log('\n3. Após migração, todos os serviços terão slots pré-definidos');
      console.log('4. Novos serviços usarão templates automaticamente');
    }

    console.log('\n🎯 BENEFÍCIOS DO NOVO SISTEMA:');
    console.log('==============================');
    console.log('✅ Slots pré-definidos (não mais horários livres)');
    console.log('✅ Templates reutilizáveis para criação rápida');
    console.log('✅ Criação em massa de serviços');
    console.log('✅ Escalabilidade sem repetição manual');
    console.log('✅ Consistência temporal (sempre múltiplos de 30min)');

  } catch (error) {
    console.error('❌ Erro ao verificar status:', error);
    throw error;
  }
}

async function main() {
  try {
    await checkServicesStatus();
  } catch (error) {
    console.error('💥 Falha na verificação:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { checkServicesStatus };
