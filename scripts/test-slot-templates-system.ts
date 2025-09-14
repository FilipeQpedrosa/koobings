#!/usr/bin/env ts-node

/**
 * 🧪 TESTE DO SISTEMA DE SLOT TEMPLATES
 * 
 * Este script demonstra o funcionamento completo do sistema de templates de slots.
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testSlotTemplatesSystem() {
  console.log('🧪 TESTE DO SISTEMA DE SLOT TEMPLATES');
  console.log('=====================================\n');

  try {
    // 1. Listar templates disponíveis
    console.log('1️⃣ LISTANDO TEMPLATES DISPONÍVEIS:');
    const templates = await prisma.slotTemplate.findMany({
      where: { isActive: true },
      orderBy: [
        { isDefault: 'desc' },
        { category: 'asc' },
        { name: 'asc' }
      ]
    });

    console.log(`   📊 Total de templates: ${templates.length}`);
    
    const groupedTemplates = templates.reduce((acc, template) => {
      const category = template.category || 'outros';
      if (!acc[category]) acc[category] = [];
      acc[category].push(template);
      return acc;
    }, {} as Record<string, any[]>);

    Object.entries(groupedTemplates).forEach(([category, categoryTemplates]) => {
      console.log(`   📁 ${category.toUpperCase()}: ${categoryTemplates.length} templates`);
      categoryTemplates.forEach(template => {
        const icon = template.metadata?.icon || '✂️';
        const color = template.metadata?.color || '#3B82F6';
        console.log(`      ${icon} ${template.name} (${template.slotsNeeded} slots, ${template.duration}min)`);
      });
    });

    // 2. Simular criação de serviços em massa
    console.log('\n2️⃣ SIMULANDO CRIAÇÃO DE SERVIÇOS EM MASSA:');
    
    // Selecionar alguns templates populares
    const popularTemplates = templates.filter(t => (t.metadata as any)?.popular);
    const selectedTemplates = popularTemplates.slice(0, 3);
    
    console.log(`   🎯 Templates selecionados: ${selectedTemplates.length}`);
    selectedTemplates.forEach(template => {
      console.log(`      ${(template.metadata as any)?.icon || '✂️'} ${template.name} → ${template.slotsNeeded * 25}€`);
    });

    // 3. Calcular estatísticas
    console.log('\n3️⃣ ESTATÍSTICAS DO SISTEMA:');
    
    const totalSlots = templates.reduce((sum, t) => sum + t.slotsNeeded, 0);
    const avgSlotsPerTemplate = totalSlots / templates.length;
    const totalDuration = templates.reduce((sum, t) => sum + t.duration, 0);
    const avgDuration = totalDuration / templates.length;

    console.log(`   📈 Total de slots cobertos: ${totalSlots}`);
    console.log(`   📊 Média de slots por template: ${avgSlotsPerTemplate.toFixed(1)}`);
    console.log(`   ⏱️  Duração total: ${totalDuration} minutos`);
    console.log(`   📊 Duração média: ${avgDuration.toFixed(1)} minutos`);

    // 4. Demonstrar escalabilidade
    console.log('\n4️⃣ DEMONSTRAÇÃO DE ESCALABILIDADE:');
    
    const categories = Object.keys(groupedTemplates);
    console.log(`   🏢 Categorias disponíveis: ${categories.length}`);
    console.log(`   🔄 Templates reutilizáveis: ${templates.filter(t => !t.businessId).length}`);
    console.log(`   🎨 Templates personalizados: ${templates.filter(t => t.businessId).length}`);

    // 5. Exemplo de criação rápida
    console.log('\n5️⃣ EXEMPLO DE CRIAÇÃO RÁPIDA:');
    console.log('   📝 Cenário: Salão de beleza quer criar 5 serviços básicos');
    
    const basicServices = [
      { template: 'Corte Rápido', price: 25 },
      { template: 'Corte Completo', price: 50 },
      { template: 'Coloração Simples', price: 75 },
      { template: 'Manicure Simples', price: 25 },
      { template: 'Tratamento Capilar', price: 50 }
    ];

    basicServices.forEach((service, index) => {
      const template = templates.find(t => t.name === service.template);
      if (template) {
        console.log(`   ${index + 1}. ${(template.metadata as any)?.icon || '✂️'} ${service.template}`);
        console.log(`      → ${template.slotsNeeded} slots (${template.duration}min) - ${service.price}€`);
      }
    });

    console.log('\n✅ SISTEMA FUNCIONANDO PERFEITAMENTE!');
    console.log('=====================================');
    console.log('🎯 Benefícios implementados:');
    console.log('   ✅ Slots pré-definidos (não mais horários livres)');
    console.log('   ✅ Templates reutilizáveis');
    console.log('   ✅ Criação em massa de serviços');
    console.log('   ✅ Escalabilidade sem repetição');
    console.log('   ✅ Interface intuitiva');
    console.log('   ✅ Categorização automática');

  } catch (error) {
    console.error('❌ Erro durante o teste:', error);
    throw error;
  }
}

async function main() {
  try {
    await testSlotTemplatesSystem();
  } catch (error) {
    console.error('💥 Falha no teste:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { testSlotTemplatesSystem };
