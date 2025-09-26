import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getRequestAuthUser } from '@/lib/jwt-safe';

export const dynamic = 'force-dynamic';

// GET: Export service occupancy data to Excel
export async function GET(request: NextRequest) {
  try {
    console.log('📊 GET /api/business/services/export-excel - Starting...');

    const user = getRequestAuthUser(request);
    if (!user) {
      return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } }, { status: 401 });
    }

    const businessId = user.businessId;
    if (!businessId) {
      return NextResponse.json({ success: false, error: { code: 'MISSING_BUSINESS_ID', message: 'Missing business ID' } }, { status: 400 });
    }

    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    if (!startDate || !endDate) {
      return NextResponse.json({ success: false, error: { code: 'MISSING_DATES', message: 'Start date and end date are required' } }, { status: 400 });
    }

    console.log('📊 Exporting data from', startDate, 'to', endDate);

    // Get appointments in the date range
    const appointments = await prisma.appointments.findMany({
      where: {
        businessId,
        scheduledFor: {
          gte: new Date(startDate),
          lte: new Date(endDate)
        }
      },
      include: {
        Service: {
          select: {
            name: true,
            duration: true,
            price: true
          }
        },
        Client: {
          select: {
            name: true,
            email: true,
            phone: true
          }
        },
        Staff: {
          select: {
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        scheduledFor: 'asc'
      }
    });

    // Get services configuration
    const services = await prisma.service.findMany({
      where: {
        businessId,
        isActive: true
      },
      select: {
        id: true,
        name: true,
        slots: true,
        maxCapacity: true
      }
    });

    // Get staff
    const staff = await prisma.staff.findMany({
      where: { businessId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true
      }
    });

    // Generate CSV data
    const csvData = generateCSVData(appointments, services, staff, startDate, endDate);

    console.log('📊 Generated CSV with', csvData.split('\n').length - 1, 'rows');

    return new NextResponse(csvData, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="service-occupancy-${startDate}-to-${endDate}.csv"`
      }
    });

  } catch (error: any) {
    console.error('❌ Error exporting Excel:', error);
    return NextResponse.json({ 
      success: false, 
      error: { 
        code: 'INTERNAL_ERROR', 
        message: error.message || 'Internal Server Error' 
      } 
    }, { status: 500 });
  }
}

function generateCSVData(appointments: any[], services: any[], staff: any[], startDate: string, endDate: string): string {
  const headers = [
    'Data',
    'Dia da Semana',
    'Serviço',
    'Horário Início',
    'Horário Fim',
    'Staff',
    'Cliente',
    'Email Cliente',
    'Telefone Cliente',
    'Status',
    'Duração (min)',
    'Preço (€)',
    'Notas'
  ];

  const rows = appointments.map(apt => {
    const scheduledDate = new Date(apt.scheduledFor);
    const dayNames = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    
    return [
      scheduledDate.toLocaleDateString('pt-PT'),
      dayNames[scheduledDate.getDay()],
      apt.Service?.name || 'N/A',
      scheduledDate.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' }),
      new Date(scheduledDate.getTime() + (apt.Service?.duration || 60) * 60000).toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' }),
      apt.Staff?.name || 'N/A',
      apt.Client?.name || 'N/A',
      apt.Client?.email || 'N/A',
      apt.Client?.phone || 'N/A',
      apt.status || 'PENDING',
      apt.Service?.duration || 60,
      apt.Service?.price || 0,
      apt.notes || ''
    ];
  });

  // Add summary rows
  const summaryRows = [
    [],
    ['RESUMO'],
    ['Total de Marcações', appointments.length],
    ['Período', `${startDate} a ${endDate}`],
    ['Serviços Ativos', services.length],
    ['Staff Ativo', staff.length],
    []
  ];

  const allRows = [headers, ...rows, ...summaryRows];
  
  return allRows.map(row => 
    row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')
  ).join('\n');
}
