import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getRequestAuthUser } from '@/lib/jwt-safe';
import { createId } from '@paralleldrive/cuid2';

// POST /api/staff/clients/[id]/notes - Add a note to a client
export async function POST(req: NextRequest, { params }: any) {
  try {
    const user = getRequestAuthUser(req);
    
    if (!user) {
      console.error('Unauthorized: No JWT token.');
      return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } }, { status: 401 });
    }

    const businessId = user.businessId;
    const staffId = user.id;
    
    if (!businessId || !staffId) {
      return NextResponse.json({ success: false, error: { code: 'MISSING_BUSINESS_ID', message: 'Missing business ID or staff ID' } }, { status: 400 });
    }

    const clientId = params.id;
    
    const data = await req.json();
    const { content } = data;
    
    if (!content || content.trim() === '') {
      return NextResponse.json({ success: false, error: { code: 'CONTENT_REQUIRED', message: 'Note content is required' } }, { status: 400 });
    }

    console.log('🔧 DEBUG: Creating note for client:', clientId, 'by staff:', staffId);

    const note = await prisma.relationship_notes.create({
      data: {
        id: createId(),
        noteType: 'GENERAL',
        content: content.trim(),
        clientId: clientId,
        createdById: staffId,
        businessId: businessId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      include: {
        Staff: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });
    
    console.log('🔧 DEBUG: Note created successfully:', note.id);
    
    const response = NextResponse.json({ success: true, data: note }, { status: 201 });
    
    // Add anti-cache headers to ensure fresh data
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    response.headers.set('Surrogate-Control', 'no-store');
    
    return response;
  } catch (error) {
    console.error('POST /staff/clients/[id]/notes error:', error);
    return NextResponse.json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'Failed to create note' } }, { status: 500 });
  }
} 