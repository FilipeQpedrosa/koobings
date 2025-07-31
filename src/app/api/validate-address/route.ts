import { NextRequest, NextResponse } from 'next/server';
import { validateAddress } from '@/lib/googleMaps';
import { z } from 'zod';

const schema = z.object({
  address: z.string().min(1, 'Morada é obrigatória'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { address } = schema.parse(body);

    const result = await validateAddress(address);
    
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        isValid: false,
        error: 'Dados inválidos'
      }, { status: 400 });
    }

    console.error('Address validation API error:', error);
    return NextResponse.json({
      isValid: false,
      error: 'Erro interno do servidor'
    }, { status: 500 });
  }
} 