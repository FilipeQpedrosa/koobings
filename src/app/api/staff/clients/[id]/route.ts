import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getRequestAuthUser } from '@/lib/jwt-safe';

// GET /api/staff/clients/[id] - Get client details, history, and notes
export async function GET(req: NextRequest) {
  const user = getRequestAuthUser(req);
  if (!user) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const businessId = user.businessId;
  if (!businessId) {
    return NextResponse.json({ success: false, error: 'Business ID missing' }, { status: 400 });
  }

  const clientId = new URL(req.url).pathname.split('/').at(-1);

  try {
    // Get business settings for note restrictions
    const business = await prisma.business.findUnique({
      where: { id: businessId },
      select: {
        restrictStaffToViewAllNotes: true
      }
    });

    if (!business) {
      return NextResponse.json({ success: false, error: 'Business not found' }, { status: 404 });
    }

    const restrictNotes = business.restrictStaffToViewAllNotes && user.role === 'STAFF';

    // Get client (must belong to the same business)
    const client = await prisma.client.findUnique({
      where: { 
        id: clientId,
        businessId: businessId // Ensure client belongs to this business
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        notes: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        businessId: true
      }
    });

    if (!client) {
      return NextResponse.json({ success: false, error: 'Client not found' }, { status: 404 });
    }

    // Get appointments for this client
    const appointments = await prisma.appointments.findMany({
      where: {
        clientId: clientId,
        businessId: businessId
      },
      select: {
        id: true,
        scheduledFor: true,
        duration: true,
        status: true,
        notes: true,
        createdAt: true,
        Service: {
          select: {
            name: true,
            price: true
          }
        },
        Staff: {
          select: {
            name: true
          }
        }
      },
      orderBy: { scheduledFor: 'desc' }
    });

    // Get relationship notes for this client
    const notesWhere = restrictNotes 
      ? { clientId: clientId, createdById: user.id }
      : { clientId: clientId };

    const notes = await prisma.relationship_notes.findMany({
      where: notesWhere,
      select: {
        id: true,
        content: true,
        createdAt: true,
        Staff: {
          select: {
            name: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ 
      success: true, 
      data: {
        client,
        appointments,
        notes
      }
    }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
        'Surrogate-Control': 'no-store'
      }
    });

  } catch (error) {
    console.error('Error fetching client details:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

// PUT /api/staff/clients/[id] - Update client info
export async function PUT(req: NextRequest) {
  const user = getRequestAuthUser(req);
  if (!user) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const businessId = user.businessId;
  if (!businessId) {
    return NextResponse.json({ success: false, error: 'Business ID missing' }, { status: 400 });
  }

  const clientId = new URL(req.url).pathname.split('/').at(-1);
  
  try {
    const data = await req.json();
    const { name, email, phone, notes, status } = data;

    // Ensure client belongs to the same business
    const existingClient = await prisma.client.findUnique({
      where: { 
        id: clientId,
        businessId: businessId
      }
    });

    if (!existingClient) {
      return NextResponse.json({ success: false, error: 'Client not found' }, { status: 404 });
    }

    // Update client
    const updatedClient = await prisma.client.update({
      where: { id: clientId },
      data: { 
        name, 
        email, 
        phone,
        notes,
        status,
        updatedAt: new Date()
      }
    });

    return NextResponse.json({ success: true, data: updatedClient });

  } catch (error) {
    console.error('Error updating client:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/staff/clients/[id] - Soft delete client
export async function DELETE(req: NextRequest) {
  const user = getRequestAuthUser(req);
  if (!user) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const businessId = user.businessId;
  if (!businessId) {
    return NextResponse.json({ success: false, error: 'Business ID missing' }, { status: 400 });
  }

  const clientId = new URL(req.url).pathname.split('/').at(-1);
  
  try {
    // Ensure client belongs to the same business
    const existingClient = await prisma.client.findUnique({
      where: { 
        id: clientId,
        businessId: businessId,
        isDeleted: false
      },
      include: {
        _count: {
          select: {
            appointments: true
          }
        }
      }
    });

    if (!existingClient) {
      return NextResponse.json({ success: false, error: 'Client not found' }, { status: 404 });
    }

    // Check if client has appointments
    if (existingClient._count.appointments > 0) {
      // Soft delete - just mark as deleted to preserve appointment history
      const deletedClient = await prisma.client.update({
        where: { id: clientId },
        data: { 
          isDeleted: true,
          updatedAt: new Date()
        }
      });

      return NextResponse.json({ 
        success: true, 
        message: 'Client deleted successfully',
        data: deletedClient 
      });
    } else {
      // Hard delete if no appointments
      await prisma.client.delete({
        where: { id: clientId }
      });

      return NextResponse.json({ 
        success: true, 
        message: 'Client deleted successfully' 
      });
    }

  } catch (error) {
    console.error('Error deleting client:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
} 