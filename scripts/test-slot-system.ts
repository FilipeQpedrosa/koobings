/**
 * 🧪 TESTE DO SISTEMA DE SLOTS
 * 
 * Script de teste para validar o funcionamento completo do sistema de slots
 */

import { PrismaClient } from '@prisma/client';
import { 
  timeToSlotIndex, 
  slotIndexToTime,
  durationToSlots,
  slotsToDuration,
  generateDaySlots,
  generateAvailableSlotRanges,
  isSlotRangeAvailable,
  calculateOccupiedSlots,
  isValidSlotRange,
  formatSlotRange,
  SLOT_CONSTANTS
} from '../src/lib/slot-manager';

const prisma = new PrismaClient();

// Cores para output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m'
};

function log(color: keyof typeof colors, message: string) {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function testSlotManagerFunctions() {
  log('cyan', '\n🧪 TESTANDO FUNÇÕES DO SLOT MANAGER');
  log('cyan', '=' .repeat(50));

  let passed = 0;
  let failed = 0;

  // Teste 1: Conversão de tempo para slot
  try {
    const slot9 = timeToSlotIndex('09:00');
    const slot930 = timeToSlotIndex('09:30');
    const slot14 = timeToSlotIndex('14:00');
    
    if (slot9 === 18 && slot930 === 19 && slot14 === 28) {
      log('green', '✅ Conversão tempo → slot funcionando');
      passed++;
    } else {
      log('red', `❌ Conversão tempo → slot falhou: 09:00=${slot9} (esperado 18), 09:30=${slot930} (esperado 19), 14:00=${slot14} (esperado 28)`);
      failed++;
    }
  } catch (error) {
    log('red', `❌ Erro na conversão tempo → slot: ${error}`);
    failed++;
  }

  // Teste 2: Conversão de slot para tempo
  try {
    const time18 = slotIndexToTime(18);
    const time19 = slotIndexToTime(19);
    const time28 = slotIndexToTime(28);
    
    if (time18 === '09:00' && time19 === '09:30' && time28 === '14:00') {
      log('green', '✅ Conversão slot → tempo funcionando');
      passed++;
    } else {
      log('red', `❌ Conversão slot → tempo falhou: 18=${time18} (esperado 09:00), 19=${time19} (esperado 09:30), 28=${time28} (esperado 14:00)`);
      failed++;
    }
  } catch (error) {
    log('red', `❌ Erro na conversão slot → tempo: ${error}`);
    failed++;
  }

  // Teste 3: Conversão duração para slots
  try {
    const slots30 = durationToSlots(30);
    const slots60 = durationToSlots(60);
    const slots90 = durationToSlots(90);
    const slots45 = durationToSlots(45); // Deve arredondar para cima
    
    if (slots30 === 1 && slots60 === 2 && slots90 === 3 && slots45 === 2) {
      log('green', '✅ Conversão duração → slots funcionando');
      passed++;
    } else {
      log('red', `❌ Conversão duração → slots falhou: 30min=${slots30}, 60min=${slots60}, 90min=${slots90}, 45min=${slots45}`);
      failed++;
    }
  } catch (error) {
    log('red', `❌ Erro na conversão duração → slots: ${error}`);
    failed++;
  }

  // Teste 4: Geração de slots do dia
  try {
    const daySlots = generateDaySlots('2024-01-15');
    
    if (daySlots.length === 48 && daySlots[0].startTime === '00:00' && daySlots[47].startTime === '23:30') {
      log('green', '✅ Geração de slots do dia funcionando');
      passed++;
    } else {
      log('red', `❌ Geração de slots do dia falhou: ${daySlots.length} slots, primeiro: ${daySlots[0]?.startTime}, último: ${daySlots[47]?.startTime}`);
      failed++;
    }
  } catch (error) {
    log('red', `❌ Erro na geração de slots do dia: ${error}`);
    failed++;
  }

  // Teste 5: Validação de ranges
  try {
    const valid1 = isValidSlotRange(10, 12);
    const valid2 = isValidSlotRange(0, 48);
    const invalid1 = isValidSlotRange(10, 10);
    const invalid2 = isValidSlotRange(47, 49);
    
    if (valid1 && valid2 && !invalid1 && !invalid2) {
      log('green', '✅ Validação de ranges funcionando');
      passed++;
    } else {
      log('red', `❌ Validação de ranges falhou: ${valid1}, ${valid2}, ${invalid1}, ${invalid2}`);
      failed++;
    }
  } catch (error) {
    log('red', `❌ Erro na validação de ranges: ${error}`);
    failed++;
  }

  // Teste 6: Verificação de disponibilidade
  try {
    const occupiedSlots = [10, 11, 15, 16, 17];
    const available1 = isSlotRangeAvailable(8, 2, occupiedSlots); // 8-10, deve ser true
    const available2 = isSlotRangeAvailable(12, 2, occupiedSlots); // 12-14, deve ser true
    const notAvailable1 = isSlotRangeAvailable(9, 2, occupiedSlots); // 9-11, deve ser false (conflito)
    const notAvailable2 = isSlotRangeAvailable(15, 2, occupiedSlots); // 15-17, deve ser false (conflito)
    
    if (available1 && available2 && !notAvailable1 && !notAvailable2) {
      log('green', '✅ Verificação de disponibilidade funcionando');
      passed++;
    } else {
      log('red', `❌ Verificação de disponibilidade falhou: ${available1}, ${available2}, ${notAvailable1}, ${notAvailable2}`);
      failed++;
    }
  } catch (error) {
    log('red', `❌ Erro na verificação de disponibilidade: ${error}`);
    failed++;
  }

  log('cyan', `\n📊 Resultado dos testes: ${passed} ✅ | ${failed} ❌`);
  return { passed, failed };
}

async function testDatabaseIntegration() {
  log('magenta', '\n🗄️ TESTANDO INTEGRAÇÃO COM BANCO DE DADOS');
  log('magenta', '=' .repeat(50));

  let passed = 0;
  let failed = 0;

  try {
    // Verificar se schema foi aplicado
    const services = await prisma.service.findMany({ take: 1 });
    const serviceWithSlots = services.find(s => s.slotsNeeded !== null && s.slotsNeeded !== undefined);

    if (serviceWithSlots) {
      log('green', '✅ Schema de slots aplicado - serviços com slotsNeeded encontrados');
      passed++;
    } else {
      log('yellow', '⚠️ Nenhum serviço com slotsNeeded encontrado (pode ser normal se ainda não migrado)');
    }

    // Verificar appointments com slots  
    const appointments = await prisma.appointments.findMany({ take: 1 });
    const appointmentWithSlots = appointments.find(a => a.startSlot !== null && a.startSlot !== undefined);

    if (appointmentWithSlots) {
      log('green', '✅ Schema de slots aplicado - appointments com startSlot encontrados');
      passed++;
    } else {
      log('yellow', '⚠️ Nenhum appointment com startSlot encontrado (pode ser normal se ainda não migrado)');
    }

    // Verificar business configurations
    const businessConfig = await prisma.businessSlotConfiguration.findFirst();

    if (businessConfig) {
      log('green', '✅ Configurações de slots encontradas');
      passed++;
    } else {
      log('yellow', '⚠️ Nenhuma configuração de slots encontrada (pode ser normal se ainda não criada)');
    }

    // Verificar staff availability com slots
    const staffAvailabilities = await prisma.staffAvailability.findMany({ take: 1 });
    const staffWithSlots = staffAvailabilities.find(s => s.slotSchedule !== null && s.slotSchedule !== undefined);

    if (staffWithSlots) {
      log('green', '✅ Staff availability com slots encontrado');
      passed++;
    } else {
      log('yellow', '⚠️ Nenhum staff availability com slots encontrado (pode ser normal se ainda não migrado)');
    }

  } catch (error) {
    log('red', `❌ Erro na integração com banco: ${error}`);
    failed++;
  }

  log('magenta', `\n📊 Resultado da integração: ${passed} ✅ | ${failed} ❌`);
  return { passed, failed };
}

async function simulateSlotBooking() {
  log('blue', '\n📅 SIMULANDO PROCESSO DE AGENDAMENTO');
  log('blue', '=' .repeat(50));

  try {
    // Simular cenário: cliente quer agendar coloração (3 slots) para amanhã às 14:00
    const date = '2024-01-16';
    const requestedTime = '14:00';
    const slotsNeeded = 3; // 90 minutos

    log('cyan', `📋 Cenário: Agendamento de coloração para ${date} às ${requestedTime}`);
    log('cyan', `   - Slots necessários: ${slotsNeeded} (${slotsToDuration(slotsNeeded)} minutos)`);

    // 1. Converter horário para slot
    const startSlot = timeToSlotIndex(requestedTime);
    const endSlot = startSlot + slotsNeeded;
    
    log('cyan', `   - Slot range: ${startSlot}-${endSlot} (${slotIndexToTime(startSlot)}-${slotIndexToTime(endSlot)})`);

    // 2. Simular appointments existentes
    const existingAppointments = [
      { startSlot: 20, endSlot: 22 }, // 10:00-11:00
      { startSlot: 24, endSlot: 26 }, // 12:00-13:00
      { startSlot: 32, endSlot: 34 }, // 16:00-17:00
    ];

    const occupiedSlots = existingAppointments.flatMap(apt => 
      Array.from({length: apt.endSlot - apt.startSlot}, (_, i) => apt.startSlot + i)
    );

    log('cyan', `   - Slots ocupados: [${occupiedSlots.join(', ')}]`);

    // 3. Verificar disponibilidade
    const isAvailable = isSlotRangeAvailable(startSlot, slotsNeeded, occupiedSlots);
    
    if (isAvailable) {
      log('green', '✅ Horário disponível para agendamento!');
      
      // 4. Simular criação do appointment
      const appointmentData = {
        startSlot,
        endSlot,
        slotsUsed: slotsNeeded,
        startTime: slotIndexToTime(startSlot),
        endTime: slotIndexToTime(endSlot),
        duration: slotsToDuration(slotsNeeded)
      };
      
      log('green', `   - Appointment criado: ${JSON.stringify(appointmentData, null, 2)}`);
    } else {
      log('red', '❌ Horário não disponível!');
      
      // Sugerir horários alternativos
      const allWorkingSlots = Array.from({length: 18}, (_, i) => i + 18); // 09:00-18:00
      const availableSlots = allWorkingSlots.filter(slot => !occupiedSlots.includes(slot));
      const availableRanges = generateAvailableSlotRanges(availableSlots, slotsNeeded, date);
      
      log('yellow', `   - Horários alternativos disponíveis: ${availableRanges.length}`);
      availableRanges.slice(0, 3).forEach(range => {
        log('yellow', `     • ${formatSlotRange(range)}`);
      });
    }

    return true;

  } catch (error) {
    log('red', `❌ Erro na simulação: ${error}`);
    return false;
  }
}

async function testPerformance() {
  log('yellow', '\n⚡ TESTE DE PERFORMANCE');
  log('yellow', '=' .repeat(50));

  try {
    // Teste 1: Conversões em massa
    const start1 = Date.now();
    for (let i = 0; i < 10000; i++) {
      timeToSlotIndex('14:30');
      slotIndexToTime(29);
      durationToSlots(90);
    }
    const end1 = Date.now();
    log('cyan', `   - 30.000 conversões: ${end1 - start1}ms`);

    // Teste 2: Geração de slots para múltiplos dias
    const start2 = Date.now();
    const dates = Array.from({length: 30}, (_, i) => `2024-01-${(i + 1).toString().padStart(2, '0')}`);
    const allSlots = dates.map(date => generateDaySlots(date));
    const end2 = Date.now();
    log('cyan', `   - Geração de slots para 30 dias (${allSlots.flat().length} slots): ${end2 - start2}ms`);

    // Teste 3: Cálculo de disponibilidade complexo
    const start3 = Date.now();
    const occupiedSlots = Array.from({length: 100}, (_, i) => Math.floor(Math.random() * 48));
    for (let i = 0; i < 1000; i++) {
      isSlotRangeAvailable(Math.floor(Math.random() * 40), 3, occupiedSlots);
    }
    const end3 = Date.now();
    log('cyan', `   - 1.000 verificações de disponibilidade: ${end3 - start3}ms`);

    log('green', '✅ Testes de performance concluídos');
    return true;

  } catch (error) {
    log('red', `❌ Erro no teste de performance: ${error}`);
    return false;
  }
}

async function runAllTests() {
  log('cyan', '🚀 INICIANDO TESTES COMPLETOS DO SISTEMA DE SLOTS');
  log('cyan', '=' .repeat(60));

  const results = {
    slotManager: await testSlotManagerFunctions(),
    database: await testDatabaseIntegration(),
    simulation: await simulateSlotBooking(),
    performance: await testPerformance()
  };

  // Resumo final
  log('cyan', '\n' + '=' .repeat(60));
  log('cyan', '📊 RESUMO DOS TESTES');
  log('cyan', '=' .repeat(60));

  const totalPassed = results.slotManager.passed + results.database.passed;
  const totalFailed = results.slotManager.failed + results.database.failed;
  const functionalTests = results.simulation && results.performance;

  log('green', `✅ Testes unitários: ${totalPassed} passou, ${totalFailed} falhou`);
  log(functionalTests ? 'green' : 'red', `${functionalTests ? '✅' : '❌'} Testes funcionais: ${functionalTests ? 'PASSOU' : 'FALHOU'}`);

  if (totalFailed === 0 && functionalTests) {
    log('green', '\n🎉 TODOS OS TESTES PASSARAM! Sistema de slots está funcionando perfeitamente.');
  } else {
    log('red', '\n⚠️ Alguns testes falharam. Revisar implementação.');
  }

  // Mostrar constantes do sistema
  log('blue', '\n📋 CONSTANTES DO SISTEMA:');
  log('blue', `   - Duração do slot: ${SLOT_CONSTANTS.SLOT_DURATION_MINUTES} minutos`);
  log('blue', `   - Slots por dia: ${SLOT_CONSTANTS.SLOTS_PER_DAY}`);
  log('blue', `   - Slots por hora: ${SLOT_CONSTANTS.SLOTS_PER_HOUR}`);
  log('blue', `   - Horário padrão: slot ${SLOT_CONSTANTS.DEFAULT_WORKING_START_SLOT}-${SLOT_CONSTANTS.DEFAULT_WORKING_END_SLOT}`);
  log('blue', `   - Equivalente a: ${slotIndexToTime(SLOT_CONSTANTS.DEFAULT_WORKING_START_SLOT)}-${slotIndexToTime(SLOT_CONSTANTS.DEFAULT_WORKING_END_SLOT)}`);

  return { totalPassed, totalFailed, functionalTests };
}

// Executar testes se script for chamado diretamente
if (require.main === module) {
  runAllTests()
    .then((results) => {
      if (results.totalFailed === 0 && results.functionalTests) {
        process.exit(0);
      } else {
        process.exit(1);
      }
    })
    .catch((error) => {
      console.error('💥 Erro fatal nos testes:', error);
      process.exit(1);
    })
    .finally(() => {
      prisma.$disconnect();
    });
}

export { runAllTests };
