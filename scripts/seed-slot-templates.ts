#!/usr/bin/env ts-node

/**
 * 🌟 SEED SLOT TEMPLATES
 * 
 * Este script popula o banco com templates padrão de slots reutilizáveis.
 * Os templates permitem criar serviços rapidamente sem repetição manual.
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Templates padrão do sistema (globais)
const DEFAULT_TEMPLATES = [
  // CORTES
  {
    name: 'Corte Rápido',
    description: 'Corte simples e rápido',
    slotsNeeded: 1, // 30 minutos
    duration: 30,
    category: 'corte',
    isDefault: true,
    metadata: {
      color: '#3B82F6',
      icon: '✂️',
      popular: true
    }
  },
  {
    name: 'Corte Completo',
    description: 'Corte com lavagem e finalização',
    slotsNeeded: 2, // 1 hora
    duration: 60,
    category: 'corte',
    isDefault: true,
    metadata: {
      color: '#3B82F6',
      icon: '✂️',
      popular: true
    }
  },
  {
    name: 'Corte + Barba',
    description: 'Corte de cabelo e barba',
    slotsNeeded: 2, // 1 hora
    duration: 60,
    category: 'corte',
    isDefault: true,
    metadata: {
      color: '#3B82F6',
      icon: '✂️',
      popular: false
    }
  },

  // COLORAÇÃO
  {
    name: 'Coloração Simples',
    description: 'Coloração básica sem decapagem',
    slotsNeeded: 3, // 1h30
    duration: 90,
    category: 'coloração',
    isDefault: true,
    metadata: {
      color: '#EC4899',
      icon: '🎨',
      popular: true
    }
  },
  {
    name: 'Coloração Completa',
    description: 'Coloração com decapagem e tratamento',
    slotsNeeded: 4, // 2 horas
    duration: 120,
    category: 'coloração',
    isDefault: true,
    metadata: {
      color: '#EC4899',
      icon: '🎨',
      popular: true
    }
  },
  {
    name: 'Mechas',
    description: 'Aplicação de mechas',
    slotsNeeded: 4, // 2 horas
    duration: 120,
    category: 'coloração',
    isDefault: true,
    metadata: {
      color: '#EC4899',
      icon: '🎨',
      popular: false
    }
  },

  // TRATAMENTOS
  {
    name: 'Tratamento Capilar',
    description: 'Tratamento hidratante',
    slotsNeeded: 2, // 1 hora
    duration: 60,
    category: 'tratamento',
    isDefault: true,
    metadata: {
      color: '#10B981',
      icon: '💆‍♀️',
      popular: true
    }
  },
  {
    name: 'Tratamento Intensivo',
    description: 'Tratamento profundo com máscara',
    slotsNeeded: 3, // 1h30
    duration: 90,
    category: 'tratamento',
    isDefault: true,
    metadata: {
      color: '#10B981',
      icon: '💆‍♀️',
      popular: false
    }
  },

  // MANICURE/PEDICURE
  {
    name: 'Manicure Simples',
    description: 'Manicure básica',
    slotsNeeded: 1, // 30 minutos
    duration: 30,
    category: 'manicure',
    isDefault: true,
    metadata: {
      color: '#F59E0B',
      icon: '💅',
      popular: true
    }
  },
  {
    name: 'Manicure Completa',
    description: 'Manicure com esmaltação',
    slotsNeeded: 2, // 1 hora
    duration: 60,
    category: 'manicure',
    isDefault: true,
    metadata: {
      color: '#F59E0B',
      icon: '💅',
      popular: true
    }
  },
  {
    name: 'Pedicure',
    description: 'Pedicure completa',
    slotsNeeded: 2, // 1 hora
    duration: 60,
    category: 'pedicure',
    isDefault: true,
    metadata: {
      color: '#F59E0B',
      icon: '🦶',
      popular: true
    }
  },

  // MASSAGEM
  {
    name: 'Massagem Relaxante',
    description: 'Massagem de 30 minutos',
    slotsNeeded: 1, // 30 minutos
    duration: 30,
    category: 'massagem',
    isDefault: true,
    metadata: {
      color: '#8B5CF6',
      icon: '🤲',
      popular: true
    }
  },
  {
    name: 'Massagem Completa',
    description: 'Massagem de 1 hora',
    slotsNeeded: 2, // 1 hora
    duration: 60,
    category: 'massagem',
    isDefault: true,
    metadata: {
      color: '#8B5CF6',
      icon: '🤲',
      popular: true
    }
  },

  // SLOTS ESPECIAIS
  {
    name: 'Consulta',
    description: 'Consulta inicial',
    slotsNeeded: 1, // 30 minutos
    duration: 30,
    category: 'consulta',
    isDefault: true,
    metadata: {
      color: '#6B7280',
      icon: '💬',
      popular: false
    }
  },
  {
    name: 'Retoque',
    description: 'Retoque rápido',
    slotsNeeded: 1, // 30 minutos
    duration: 30,
    category: 'retoque',
    isDefault: true,
    metadata: {
      color: '#6B7280',
      icon: '🔄',
      popular: false
    }
  }
];

async function seedSlotTemplates() {
  console.log('🌱 Iniciando seed dos templates de slots...');

  try {
    // Verificar se já existem templates padrão
    const existingTemplates = await prisma.slotTemplate.findMany({
      where: { isDefault: true }
    });

    if (existingTemplates.length > 0) {
      console.log(`⚠️  Já existem ${existingTemplates.length} templates padrão. Pulando seed.`);
      return;
    }

    // Criar templates padrão
    console.log('📝 Criando templates padrão...');
    
    for (const template of DEFAULT_TEMPLATES) {
      await prisma.slotTemplate.create({
        data: {
          ...template,
          businessId: null // Templates globais
        }
      });
      console.log(`✅ Template criado: ${template.name} (${template.slotsNeeded} slots)`);
    }

    console.log(`🎉 Seed concluído! ${DEFAULT_TEMPLATES.length} templates criados.`);

    // Estatísticas
    const stats = await prisma.slotTemplate.groupBy({
      by: ['category'],
      _count: { id: true }
    });

    console.log('\n📊 Estatísticas por categoria:');
    stats.forEach(stat => {
      console.log(`  ${stat.category}: ${stat._count.id} templates`);
    });

  } catch (error) {
    console.error('❌ Erro durante o seed:', error);
    throw error;
  }
}

async function main() {
  try {
    await seedSlotTemplates();
  } catch (error) {
    console.error('💥 Falha no seed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { seedSlotTemplates };
