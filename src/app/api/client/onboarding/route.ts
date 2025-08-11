import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getRequestAuthUser } from '@/lib/jwt';

// POST /api/client/onboarding - Complete client onboarding
export async function POST(request: NextRequest) {
  try {
    const user = getRequestAuthUser(request);
    
    if (!user || !user.email) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Acesso negado' } },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { 
      name, 
      phone, 
      preferences = {},
      marketingConsent = false 
    } = body;

    // Validate required fields
    if (!name) {
      return NextResponse.json(
        { success: false, error: { code: 'VALIDATION_ERROR', message: 'Nome é obrigatório' } },
        { status: 400 }
      );
    }

    // Update client profile with onboarding data
    const updatedClient = await prisma.independentClient.updateMany({
      where: { email: user.email },
      data: {
        name: name.trim(),
        phone: phone || null,
        preferences: preferences as any,
        marketingConsent,
        onboardingCompleted: true,
        updatedAt: new Date()
      }
    });

    if (updatedClient.count === 0) {
      return NextResponse.json(
        { success: false, error: { code: 'CLIENT_NOT_FOUND', message: 'Cliente não encontrado' } },
        { status: 404 }
      );
    }

    // Fetch updated client data
    const client = await prisma.independentClient.findFirst({
      where: { email: user.email },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        preferences: true,
        onboardingCompleted: true
      }
    });

    console.log('[CLIENT_ONBOARDING] ✅ Onboarding completed for client:', client?.id);

    return NextResponse.json({ 
      success: true, 
      data: client
    });

  } catch (error) {
    console.error('[CLIENT_ONBOARDING] Error completing onboarding:', error);
    return NextResponse.json(
      { success: false, error: { code: 'ONBOARDING_ERROR', message: 'Falha ao completar configuração' } },
      { status: 500 }
    );
  }
}

// GET /api/client/onboarding - Get client onboarding status
export async function GET(request: NextRequest) {
  try {
    const user = getRequestAuthUser(request);
    
    if (!user || !user.email) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Acesso negado' } },
        { status: 401 }
      );
    }

    // Find client by email
    const client = await prisma.independentClient.findFirst({
      where: { email: user.email },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        onboardingCompleted: true,
        preferences: true
      }
    });

    if (!client) {
      return NextResponse.json(
        { success: false, error: { code: 'CLIENT_NOT_FOUND', message: 'Cliente não encontrado' } },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      data: {
        ...client,
        needsOnboarding: !client.onboardingCompleted
      }
    });

  } catch (error) {
    console.error('[CLIENT_ONBOARDING] Error getting onboarding status:', error);
    return NextResponse.json(
      { success: false, error: { code: 'ONBOARDING_STATUS_ERROR', message: 'Falha ao verificar configuração' } },
      { status: 500 }
    );
  }
} 