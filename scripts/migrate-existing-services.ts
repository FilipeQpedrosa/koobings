#!/usr/bin/env ts-node

/**
 * 🔄 MIGRAÇÃO SIMPLES PARA SISTEMA DE SLOTS
 * 
 * Script simplificado para migrar serviços antigos para o novo sistema de slots.
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function migrateExistingServices() {
  console.log('🔄 MIGRAÇÃO DE SERVIÇOS ANTIGOS PARA SLOTS');
  console.log('==========================================\n');

  try {
    // 1. Verificar serviços existentes
    const allServices = await prisma.service.findMany({
      select: {
        id: true,
        name: true,
        duration: true,
        slotsNeeded: true,
        slotConfiguration: true
      }
    });

    console.log(`📊 Total de serviços encontrados: ${allServices.length}`);

    // 2. Identificar serviços que precisam de migração
    const servicesToMigrate = allServices.filter(service => 
      !service.slotsNeeded || service.slotsNeeded === 0
    );

    console.log(`🔄 Serviços que precisam de migração: ${servicesToMigrate.length}`);

    if (servicesToMigrate.length === 0) {
      console.log('✅ Todos os serviços já estão migrados!');
      return;
    }

    // 3. Migrar serviços
    let migrated = 0;
    let errors = 0;

    for (const service of servicesToMigrate) {
      try {
        // Calcular slots necessários (duração ÷ 30 minutos)
        const slotsNeeded = Math.ceil(service.duration / 30);
        const adjustedDuration = slotsNeeded * 30; // Alinhar com slots

        // Criar configuração de slots
        const slotConfiguration = {
          originalDuration: service.duration,
          calculatedSlotsNeeded: slotsNeeded,
          adjustedDuration: adjustedDuration,
          migrationTimestamp: new Date().toISOString(),
          migrationNotes: service.duration !== adjustedDuration 
            ? `Duração ajustada de ${service.duration}min para ${adjustedDuration}min para alinhamento com slots`
            : 'Alinhamento perfeito com slots'
        };

        await prisma.service.update({
          where: { id: service.id },
          data: {
            slotsNeeded,
            duration: adjustedDuration,
            slotConfiguration
          }
        });

        console.log(`✅ ${service.name}: ${service.duration}min → ${slotsNeeded} slots (${adjustedDuration}min)`);
        migrated++;

      } catch (error) {
        console.error(`❌ Erro ao migrar ${service.name}:`, error);
        errors++;
      }
    }

    // 4. Verificar appointments existentes
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
            slotsNeeded: true,
            name: true
          }
        }
      }
    });

    console.log(`\n📅 Total de agendamentos encontrados: ${allAppointments.length}`);

    const appointmentsToMigrate = allAppointments.filter(apt => 
      !apt.startSlot || !apt.endSlot || !apt.slotsUsed
    );

    console.log(`🔄 Agendamentos que precisam de migração: ${appointmentsToMigrate.length}`);

    // 5. Migrar appointments
    let aptMigrated = 0;
    let aptErrors = 0;

    for (const appointment of appointmentsToMigrate) {
      try {
        const appointmentDate = new Date(appointment.scheduledFor);
        const timeString = appointmentDate.toTimeString().slice(0, 5); // HH:MM
        
        // Converter horário para slot (cada slot = 30min)
        const hours = parseInt(timeString.split(':')[0]);
        const minutes = parseInt(timeString.split(':')[1]);
        const startSlot = hours * 2 + Math.floor(minutes / 30);
        
        // Calcular slots necessários
        const slotsUsed = appointment.Service.slotsNeeded || Math.ceil(appointment.duration / 30);
        const endSlot = startSlot + slotsUsed;

        // Validar que não ultrapassa o dia
        if (endSlot > 48) {
          console.warn(`⚠️ Appointment ${appointment.id} ultrapassa o dia (slot ${endSlot})`);
          continue;
        }

        // Criar detalhes dos slots
        const slotDetails = {
          startTime: timeString,
          endTime: new Date(appointmentDate.getTime() + slotsUsed * 30 * 60 * 1000).toTimeString().slice(0, 5),
          originalDuration: appointment.duration,
          calculatedSlots: slotsUsed,
          migrationTimestamp: new Date().toISOString()
        };

        await prisma.appointments.update({
          where: { id: appointment.id },
          data: {
            startSlot,
            endSlot,
            slotsUsed,
            slotDetails
          }
        });

        console.log(`✅ Appointment ${appointment.id}: ${timeString} → slots ${startSlot}-${endSlot}`);
        aptMigrated++;

      } catch (error) {
        console.error(`❌ Erro ao migrar appointment ${appointment.id}:`, error);
        aptErrors++;
      }
    }

    // 6. Relatório final
    console.log('\n📊 RELATÓRIO DA MIGRAÇÃO');
    console.log('========================');
    console.log(`🛠️ Serviços migrados: ${migrated}/${servicesToMigrate.length}`);
    console.log(`📅 Agendamentos migrados: ${aptMigrated}/${appointmentsToMigrate.length}`);
    console.log(`❌ Erros em serviços: ${errors}`);
    console.log(`❌ Erros em agendamentos: ${aptErrors}`);

    // 7. Verificação final
    const remainingServices = await prisma.service.count({
      where: {
        OR: [
          { slotsNeeded: 0 }
        ]
      }
    });

    const remainingAppointments = await prisma.appointments.count({
      where: {
        OR: [
          { startSlot: { equals: null } },
          { endSlot: { equals: null } },
          { slotsUsed: { equals: null } }
        ]
      }
    });

    console.log('\n🔍 VERIFICAÇÃO FINAL');
    console.log('===================');
    console.log(`🛠️ Serviços sem slots: ${remainingServices}`);
    console.log(`📅 Agendamentos sem slots: ${remainingAppointments}`);

    if (remainingServices === 0 && remainingAppointments === 0) {
      console.log('\n🎉 MIGRAÇÃO CONCLUÍDA COM SUCESSO!');
      console.log('✅ Todos os dados foram migrados para o sistema de slots');
    } else {
      console.log('\n⚠️ MIGRAÇÃO PARCIAL');
      console.log('Alguns dados ainda precisam ser migrados manualmente');
    }

  } catch (error) {
    console.error('💥 Erro durante a migração:', error);
    throw error;
  }
}

async function main() {
  try {
    await migrateExistingServices();
  } catch (error) {
    console.error('💥 Falha na migração:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { migrateExistingServices };
