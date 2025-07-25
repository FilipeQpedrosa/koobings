import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getRequestAuthUser } from '@/lib/jwt';
import { z } from 'zod';

// Profile update schema validation
const updateProfileSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres').max(100, 'Nome muito longo').optional(),
  phone: z.string().nullable().optional()
});

// GET /api/client/profile - Get client profile and appointments
export async function GET(request: NextRequest) {
  try {
    console.log('[CLIENT_PROFILE_GET] Starting...');
    
    const user = getRequestAuthUser(request);
    
    if (!user || !user.email) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Acesso negado' } },
        { status: 401 }
      );
    }

    console.log('[CLIENT_PROFILE_GET] User authenticated:', user.email);

    // Find client by email
    const client = await prisma.independentClient.findFirst({
      where: { email: user.email },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true
      }
    });

    if (!client) {
      console.log('[CLIENT_PROFILE_GET] Client not found for email:', user.email);
      return NextResponse.json({ success: false, error: { code: 'CLIENT_NOT_FOUND', message: 'Client not found' } }, { status: 404 });
    }

    console.log('[CLIENT_PROFILE_GET] ✅ Profile loaded for client:', client.id);

    return NextResponse.json({ 
      success: true, 
      data: {
        id: client.id,
        name: client.name,
        email: client.email,
        phone: client.phone,
        appointments: client.appointments
      }
    });
  } catch (error) {
    console.error('[CLIENT_PROFILE_GET] Error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'PROFILE_FETCH_ERROR', message: 'Internal server error' } },
      { status: 500 }
    );
  }
}

// PATCH /api/client/profile - Update client profile
export async function PATCH(request: NextRequest) {
  try {
    console.log('[CLIENT_PROFILE_PATCH] Starting...');
    
    const user = getRequestAuthUser(request);
    
    if (!user || !user.email) {
      console.log('[CLIENT_PROFILE_PATCH] No authenticated user');
      return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } }, { status: 401 });
    }

    console.log('[CLIENT_PROFILE_PATCH] Authenticated user:', user.email);

    const body = await request.json();
    console.log('[CLIENT_PROFILE_PATCH] Update data:', body);

    // Validate input
    const validationResult = updateProfileSchema.safeParse(body);
    
    if (!validationResult.success) {
      console.log('[CLIENT_PROFILE_PATCH] Validation failed:', validationResult.error);
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            code: 'VALIDATION_ERROR', 
            message: validationResult.error.errors[0].message 
          } 
        },
        { status: 400 }
      );
    }

    const updateData = validationResult.data;

    // Update client profile
    const updatedClient = await prisma.independentClient.updateMany({
      where: { email: user.email },
      data: {
        ...(updateData.name && { name: updateData.name.trim() }),
        ...(updateData.phone !== undefined && { phone: updateData.phone }),
        updatedAt: new Date()
      }
    });

    if (updatedClient.count === 0) {
      console.log('[CLIENT_PROFILE_PATCH] Client not found for email:', user.email);
      return NextResponse.json({ success: false, error: { code: 'CLIENT_NOT_FOUND', message: 'Client not found' } }, { status: 404 });
    }

    // Fetch updated client data
    const client = await prisma.independentClient.findFirst({
      where: { email: user.email },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true
      }
    });

    console.log('[CLIENT_PROFILE_PATCH] ✅ Profile updated for client:', client?.id);

    return NextResponse.json({ 
      success: true, 
      data: client
    });
  } catch (error) {
    console.error('[CLIENT_PROFILE_PATCH] Error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'PROFILE_UPDATE_ERROR', message: 'Internal server error' } },
      { status: 500 }
    );
  }
} 