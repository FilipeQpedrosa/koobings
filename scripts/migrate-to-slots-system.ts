/**
 * 🔄 MIGRAÇÃO PARA SISTEMA DE SLOTS
 * 
 * Script para migrar dados existentes do sistema antigo de durações livres
 * para o novo sistema de slots fixos de 30 minutos
 */

import { PrismaClient } from '@prisma/client';
import { 
  durationToSlots, 
  timeToSlotIndex, 
  slotsToDuration,
  isValidTimeFormat,
  getDefaultBusinessSlotConfig
} from '../src/lib/slot-manager';
import { format } from 'date-fns';

const prisma = new PrismaClient();

interface MigrationStats {
  services: {
    total: number;
    migrated: number;
    errors: number;
  };
  appointments: {
    total: number;
    migrated: number;
    errors: number;
  };
  staffAvailability: {
    total: number;
    migrated: number;
    errors: number;
  };
  businessConfigs: {
    created: number;
    errors: number;
  };
}

async function migrateServices(): Promise<{ migrated: number; errors: number }> {
  console.log('\n🛠️ MIGRANDO SERVIÇOS...');
  
  const services = await prisma.service.findMany({
    where: {
      OR: [
        { slotsNeeded: { equals: null } },
        { slotsNeeded: 0 }
      ]
    }
  });

  console.log(`📋 Encontrados ${services.length} serviços para migrar`);
  
  let migrated = 0;
  let errors = 0;

  for (const service of services) {
    try {
      // Calcular slots necessários baseado na duração
      const slotsNeeded = durationToSlots(service.duration);
      const calculatedDuration = slotsToDuration(slotsNeeded);
      
      // Criar configuração de slots
      const slotConfiguration = {
        originalDuration: service.duration,
        calculatedSlotsNeeded: slotsNeeded,
        adjustedDuration: calculatedDuration,
        migrationTimestamp: new Date().toISOString(),
        notes: service.duration !== calculatedDuration 
          ? `Duration adjusted from ${service.duration}min to ${calculatedDuration}min for slot alignment`
          : 'Perfect slot alignment'
      };

      await prisma.service.update({
        where: { id: service.id },
        data: {
          slotsNeeded,
          duration: calculatedDuration, // Ajustar duração para alinhamento perfeito
          slotConfiguration
        }
      });

      console.log(`✅ ${service.name}: ${service.duration}min → ${slotsNeeded} slots (${calculatedDuration}min)`);
      migrated++;
      
    } catch (error) {
      console.error(`❌ Erro ao migrar serviço ${service.name}:`, error);
      errors++;
    }
  }

  return { migrated, errors };
}

async function migrateAppointments(): Promise<{ migrated: number; errors: number }> {
  console.log('\n📅 MIGRANDO AGENDAMENTOS...');
  
  const appointments = await prisma.appointments.findMany({
    where: {
      OR: [
        { startSlot: { equals: null } },
        { endSlot: { equals: null } },
        { slotsUsed: { equals: null } }
      ]
    },
    include: {
      Service: { select: { slotsNeeded: true, duration: true } }
    }
  });

  console.log(`📋 Encontrados ${appointments.length} agendamentos para migrar`);
  
  let migrated = 0;
  let errors = 0;

  for (const appointment of appointments) {
    try {
      // Extrair horário do scheduledFor
      const appointmentTime = format(new Date(appointment.scheduledFor), 'HH:mm');
      
      if (!isValidTimeFormat(appointmentTime)) {
        throw new Error(`Invalid time format: ${appointmentTime}`);
      }

      // Calcular slots
      const startSlot = timeToSlotIndex(appointmentTime);
      const slotsUsed = appointment.Service.slotsNeeded || durationToSlots(appointment.duration);
      const endSlot = startSlot + slotsUsed;

      // Validar que não ultrapassa o dia
      if (endSlot > 48) {
        throw new Error(`Appointment extends beyond day: ends at slot ${endSlot}`);
      }

      // Criar detalhes dos slots
      const slotDetails = {
        startTime: appointmentTime,
        endTime: format(new Date(appointment.scheduledFor.getTime() + slotsUsed * 30 * 60 * 1000), 'HH:mm'),
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

      console.log(`✅ Appointment ${appointment.id}: ${appointmentTime} → slots ${startSlot}-${endSlot}`);
      migrated++;
      
    } catch (error) {
      console.error(`❌ Erro ao migrar appointment ${appointment.id}:`, error);
      errors++;
    }
  }

  return { migrated, errors };
}

async function migrateStaffAvailability(): Promise<{ migrated: number; errors: number }> {
  console.log('\n👥 MIGRANDO DISPONIBILIDADE DO STAFF...');
  
  const staffAvailabilities = await prisma.staffAvailability.findMany({
    where: {
      OR: [
        { slotSchedule: { equals: null } },
        { workingSlots: { equals: null } }
      ]
    }
  });

  console.log(`📋 Encontrados ${staffAvailabilities.length} registros de disponibilidade para migrar`);
  
  let migrated = 0;
  let errors = 0;

  for (const availability of staffAvailabilities) {
    try {
      const schedule = availability.schedule as any;
      const slotSchedule: any = {};
      const workingSlots: any = {};

      // Converter cada dia da semana
      const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
      
      for (const day of daysOfWeek) {
        const daySchedule = schedule[day];
        
        if (daySchedule && daySchedule.isWorking && daySchedule.start && daySchedule.end) {
          try {
            const startSlot = timeToSlotIndex(daySchedule.start);
            const endSlot = timeToSlotIndex(daySchedule.end);
            
            // Gerar array de slots disponíveis
            const daySlots: number[] = [];
            for (let slot = startSlot; slot < endSlot; slot++) {
              daySlots.push(slot);
            }

            slotSchedule[day] = {
              isWorking: true,
              startSlot,
              endSlot,
              availableSlots: daySlots,
              originalStart: daySchedule.start,
              originalEnd: daySchedule.end
            };

            workingSlots[day] = daySlots;
            
          } catch (error) {
            console.warn(`⚠️ Erro ao processar ${day} para staff ${availability.staffId}:`, error);
            // Manter dia como não trabalhado
            slotSchedule[day] = { isWorking: false, availableSlots: [] };
            workingSlots[day] = [];
          }
        } else {
          // Dia não trabalhado
          slotSchedule[day] = { isWorking: false, availableSlots: [] };
          workingSlots[day] = [];
        }
      }

      await prisma.staffAvailability.update({
        where: { id: availability.id },
        data: {
          slotSchedule: {
            ...slotSchedule,
            migrationTimestamp: new Date().toISOString(),
            version: 'v2'
          },
          workingSlots
        }
      });

      console.log(`✅ Staff ${availability.staffId}: Convertido para sistema de slots`);
      migrated++;
      
    } catch (error) {
      console.error(`❌ Erro ao migrar disponibilidade staff ${availability.staffId}:`, error);
      errors++;
    }
  }

  return { migrated, errors };
}

async function createBusinessSlotConfigurations(): Promise<{ created: number; errors: number }> {
  console.log('\n🏢 CRIANDO CONFIGURAÇÕES DE SLOTS PARA NEGÓCIOS...');
  
  const businesses = await prisma.business.findMany({
    where: {
      BusinessSlotConfiguration: null
    }
  });

  console.log(`📋 Encontrados ${businesses.length} negócios sem configuração de slots`);
  
  let created = 0;
  let errors = 0;

  for (const business of businesses) {
    try {
      const defaultConfig = getDefaultBusinessSlotConfig();
      
      await prisma.businessSlotConfiguration.create({
        data: {
          id: `slot_config_${business.id}`,
          businessId: business.id,
          slotDurationMinutes: defaultConfig.slotDurationMinutes,
          slotsPerDay: defaultConfig.slotsPerDay,
          startHour: defaultConfig.startHour,
          endHour: defaultConfig.endHour,
          timeZone: defaultConfig.timeZone,
          slotConfiguration: {
            defaultWorkingHours: defaultConfig.workingHours,
            migrationTimestamp: new Date().toISOString(),
            version: 'v2'
          },
          updatedAt: new Date()
        }
      });

      console.log(`✅ Business ${business.name}: Configuração de slots criada`);
      created++;
      
    } catch (error) {
      console.error(`❌ Erro ao criar configuração para business ${business.name}:`, error);
      errors++;
    }
  }

  return { created, errors };
}

async function validateMigration(): Promise<void> {
  console.log('\n🔍 VALIDANDO MIGRAÇÃO...');
  
  // Verificar serviços
  const servicesWithoutSlots = await prisma.service.count({
    where: {
      OR: [
        { slotsNeeded: { equals: null } },
        { slotsNeeded: 0 }
      ]
    }
  });

  // Verificar appointments
  const appointmentsWithoutSlots = await prisma.appointments.count({
    where: {
      OR: [
        { startSlot: { equals: null } },
        { endSlot: { equals: null } },
        { slotsUsed: { equals: null } }
      ]
    }
  });

  // Verificar staff availability
  const staffWithoutSlots = await prisma.staffAvailability.count({
    where: {
      OR: [
        { slotSchedule: { equals: null } },
        { workingSlots: { equals: null } }
      ]
    }
  });

  // Verificar business configs
  const businessesWithoutConfig = await prisma.business.count({
    where: {
      BusinessSlotConfiguration: null
    }
  });

  console.log('\n📊 RESULTADOS DA VALIDAÇÃO:');
  console.log(`- Serviços sem slots: ${servicesWithoutSlots}`);
  console.log(`- Appointments sem slots: ${appointmentsWithoutSlots}`);
  console.log(`- Staff sem slot schedule: ${staffWithoutSlots}`);
  console.log(`- Businesses sem config: ${businessesWithoutConfig}`);

  if (servicesWithoutSlots === 0 && appointmentsWithoutSlots === 0 && 
      staffWithoutSlots === 0 && businessesWithoutConfig === 0) {
    console.log('✅ MIGRAÇÃO COMPLETADA COM SUCESSO!');
  } else {
    console.log('⚠️ Migração incompleta - alguns registros ainda precisam ser processados');
  }
}

async function runMigration(): Promise<void> {
  console.log('🚀 INICIANDO MIGRAÇÃO PARA SISTEMA DE SLOTS\n');
  console.log('=' .repeat(60));

  const stats: MigrationStats = {
    services: { total: 0, migrated: 0, errors: 0 },
    appointments: { total: 0, migrated: 0, errors: 0 },
    staffAvailability: { total: 0, migrated: 0, errors: 0 },
    businessConfigs: { created: 0, errors: 0 }
  };

  try {
    // 1. Migrar serviços
    const serviceResults = await migrateServices();
    stats.services.migrated = serviceResults.migrated;
    stats.services.errors = serviceResults.errors;

    // 2. Migrar appointments
    const appointmentResults = await migrateAppointments();
    stats.appointments.migrated = appointmentResults.migrated;
    stats.appointments.errors = appointmentResults.errors;

    // 3. Migrar disponibilidade do staff
    const staffResults = await migrateStaffAvailability();
    stats.staffAvailability.migrated = staffResults.migrated;
    stats.staffAvailability.errors = staffResults.errors;

    // 4. Criar configurações de business
    const businessResults = await createBusinessSlotConfigurations();
    stats.businessConfigs.created = businessResults.created;
    stats.businessConfigs.errors = businessResults.errors;

    // 5. Validar migração
    await validateMigration();

    // Relatório final
    console.log('\n' + '=' .repeat(60));
    console.log('📊 RELATÓRIO FINAL DA MIGRAÇÃO');
    console.log('=' .repeat(60));
    console.log(`🛠️ Serviços: ${stats.services.migrated} migrados, ${stats.services.errors} erros`);
    console.log(`📅 Appointments: ${stats.appointments.migrated} migrados, ${stats.appointments.errors} erros`);
    console.log(`👥 Staff Availability: ${stats.staffAvailability.migrated} migrados, ${stats.staffAvailability.errors} erros`);
    console.log(`🏢 Business Configs: ${stats.businessConfigs.created} criados, ${stats.businessConfigs.errors} erros`);
    
    const totalMigrated = stats.services.migrated + stats.appointments.migrated + stats.staffAvailability.migrated + stats.businessConfigs.created;
    const totalErrors = stats.services.errors + stats.appointments.errors + stats.staffAvailability.errors + stats.businessConfigs.errors;
    
    console.log(`\n🎯 TOTAL: ${totalMigrated} registros processados, ${totalErrors} erros`);
    
    if (totalErrors === 0) {
      console.log('🎉 MIGRAÇÃO COMPLETADA SEM ERROS!');
    } else {
      console.log(`⚠️ Migração completada com ${totalErrors} erros - revisar logs acima`);
    }

  } catch (error) {
    console.error('💥 ERRO CRÍTICO NA MIGRAÇÃO:', error);
    process.exit(1);
  }
}

// Executar migração se script for chamado diretamente
if (require.main === module) {
  runMigration()
    .then(() => {
      console.log('\n✅ Script de migração finalizado');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Erro fatal:', error);
      process.exit(1);
    })
    .finally(() => {
      prisma.$disconnect();
    });
}

export { runMigration, validateMigration };
