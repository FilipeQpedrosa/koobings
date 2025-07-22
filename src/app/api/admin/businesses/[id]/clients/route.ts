import { NextRequest, NextResponse } from 'next/server';
import { getRequestAuthUser } from '@/lib/jwt';
import { prisma } from '@/lib/prisma';

// GET /api/admin/businesses/[id]/clients
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = getRequestAuthUser(request);
    if (!user || !user.isAdmin || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized - Admin access required' }, { status: 401 });
    }

    const business = await prisma.business.findUnique({
      where: { id: params.id },
      select: { 
        id: true, 
        name: true, 
        slug: true,
        email: true,
        status: true,
        settings: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!business) {
      return NextResponse.json({ error: 'Business not found' }, { status: 404 });
    }

    const settings = business.settings as any || {};
    const clientSettings = {
      // Client access controls
      enabled: settings.clients?.enabled ?? true,
      allowOnlineBooking: settings.clients?.allowOnlineBooking ?? true,
      allowSelfRegistration: settings.clients?.allowSelfRegistration ?? true,
      requireApproval: settings.clients?.requireApproval ?? false,
      maxClientsPerBusiness: settings.clients?.maxClientsPerBusiness ?? 0,
      autoConfirmBookings: settings.clients?.autoConfirmBookings ?? true,
      
      // Admin controls
      adminEnabled: settings.clients?.adminEnabled ?? true,
      adminNotes: settings.clients?.adminNotes ?? '',
      lastUpdatedBy: settings.clients?.lastUpdatedBy ?? null,
      lastUpdatedAt: settings.clients?.lastUpdatedAt ?? null
    };

    return NextResponse.json({
      success: true,
      data: {
        business: {
          id: business.id,
          name: business.name,
          slug: business.slug,
          email: business.email,
          status: business.status,
          createdAt: business.createdAt
        },
        clientSettings
      }
    });

  } catch (error) {
    console.error('Error fetching client settings:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// PUT /api/admin/businesses/[id]/clients
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = getRequestAuthUser(request);
    if (!user || !user.isAdmin || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized - Admin access required' }, { status: 401 });
    }

    const { 
      adminEnabled,
      adminNotes,
      allowOnlineBooking,
      allowSelfRegistration,
      requireApproval,
      maxClientsPerBusiness,
      autoConfirmBookings
    } = await request.json();

    // Get current business settings
    const business = await prisma.business.findUnique({
      where: { id: params.id },
      select: { settings: true, name: true, status: true }
    });

    if (!business) {
      return NextResponse.json({ error: 'Business not found' }, { status: 404 });
    }

    const currentSettings = business.settings as any || {};

    // Update client settings with admin controls
    const updatedSettings = {
      ...currentSettings,
      clients: {
        ...currentSettings.clients,
        // Admin controls
        adminEnabled: adminEnabled ?? currentSettings.clients?.adminEnabled ?? true,
        adminNotes: adminNotes ?? currentSettings.clients?.adminNotes ?? '',
        lastUpdatedBy: user.id,
        lastUpdatedAt: new Date().toISOString(),
        
        // Client settings - only if admin enabled
        enabled: adminEnabled === false ? false : (currentSettings.clients?.enabled ?? true),
        allowOnlineBooking: adminEnabled === false ? false : (allowOnlineBooking ?? currentSettings.clients?.allowOnlineBooking ?? true),
        allowSelfRegistration: adminEnabled === false ? false : (allowSelfRegistration ?? currentSettings.clients?.allowSelfRegistration ?? true),
        requireApproval: adminEnabled === false ? true : (requireApproval ?? currentSettings.clients?.requireApproval ?? false),
        maxClientsPerBusiness: maxClientsPerBusiness ?? currentSettings.clients?.maxClientsPerBusiness ?? 0,
        autoConfirmBookings: adminEnabled === false ? false : (autoConfirmBookings ?? currentSettings.clients?.autoConfirmBookings ?? true)
      }
    };

    // Update business settings
    const updatedBusiness = await prisma.business.update({
      where: { id: params.id },
      data: { 
        settings: updatedSettings,
        updatedAt: new Date()
      },
      select: {
        id: true,
        name: true,
        settings: true,
        updatedAt: true
      }
    });

    console.log(`✅ Client settings updated for business: ${business.name}`);

    return NextResponse.json({
      success: true,
      message: 'Configurações de clientes atualizadas com sucesso',
      data: {
        business: updatedBusiness,
        clientSettings: updatedSettings.clients
      }
    });

  } catch (error) {
    console.error('Error updating client settings:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// DELETE /api/admin/businesses/[id]/clients - Delete all clients for a business or a specific client
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = getRequestAuthUser(request);
    if (!user || !user.isAdmin || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized - Admin access required' }, { status: 401 });
    }

    const url = new URL(request.url);
    const clientId = url.searchParams.get('clientId');

    // Verify business exists
    const business = await prisma.business.findUnique({
      where: { id: params.id },
      select: { id: true, name: true }
    });

    if (!business) {
      return NextResponse.json({ error: 'Business not found' }, { status: 404 });
    }

    if (clientId) {
      // Delete specific client
      console.log(`🗑️ Admin deleting specific client: ${clientId} from business: ${business.name}`);
      
      // Verify client belongs to this business
      const clientToDelete = await prisma.client.findFirst({
        where: { 
          id: clientId,
          businessId: params.id 
        },
        select: {
          id: true,
          name: true,
          email: true,
          _count: {
            select: {
              appointments: true,
              reviews: true,
              payment_methods: true,
              relationship_notes: true,
              visit_history: true,
              ClientRelationship: true
            }
          }
        }
      });

      if (!clientToDelete) {
        return NextResponse.json({ error: 'Client not found in this business' }, { status: 404 });
      }

      // Perform complete deletion in transaction
      const deletionResult = await prisma.$transaction(async (tx) => {
        // Delete all related data first
        const [
          deletedAppointments,
          deletedReviews,
          deletedPaymentMethods,
          deletedNotes,
          deletedVisitHistory,
          deletedRelationships
        ] = await Promise.all([
          tx.appointments.deleteMany({ where: { clientId } }),
          tx.reviews.deleteMany({ where: { clientId } }),
          tx.payment_methods.deleteMany({ where: { clientId } }),
          tx.relationship_notes.deleteMany({ where: { clientId } }),
          tx.visit_history.deleteMany({ where: { clientId } }),
          tx.clientRelationship.deleteMany({ where: { clientId } })
        ]);

        // Finally delete the client
        const deletedClient = await tx.client.delete({
          where: { id: clientId }
        });

        return {
          client: deletedClient,
          deletedCounts: {
            appointments: deletedAppointments.count,
            reviews: deletedReviews.count,
            paymentMethods: deletedPaymentMethods.count,
            relationshipNotes: deletedNotes.count,
            visitHistory: deletedVisitHistory.count,
            clientRelationships: deletedRelationships.count
          }
        };
      });

      console.log(`✅ Admin successfully deleted client: ${deletionResult.client.name}`);

      return NextResponse.json({
        success: true,
        message: `Cliente "${deletionResult.client.name}" foi completamente eliminado pelo admin`,
        data: {
          deletedClient: {
            id: deletionResult.client.id,
            name: deletionResult.client.name,
            email: deletionResult.client.email
          },
          deletedCounts: deletionResult.deletedCounts,
          adminAction: {
            performedBy: user.email,
            businessName: business.name,
            timestamp: new Date().toISOString()
          }
        }
      });

    } else {
      // Delete all clients for the business (bulk operation)
      console.log(`🗑️ Admin performing bulk client deletion for business: ${business.name}`);
      
      const allClients = await prisma.client.findMany({
        where: { businessId: params.id },
        select: { id: true, name: true }
      });

      if (allClients.length === 0) {
        return NextResponse.json({
          success: true,
          message: 'No clients found to delete',
          data: { deletedCount: 0 }
        });
      }

      const clientIds = allClients.map(c => c.id);

      // Perform bulk deletion
      const bulkDeletionResult = await prisma.$transaction(async (tx) => {
        const [
          deletedAppointments,
          deletedReviews,
          deletedPaymentMethods,
          deletedNotes,
          deletedVisitHistory,
          deletedRelationships,
          deletedClients
        ] = await Promise.all([
          tx.appointments.deleteMany({ where: { clientId: { in: clientIds } } }),
          tx.reviews.deleteMany({ where: { clientId: { in: clientIds } } }),
          tx.payment_methods.deleteMany({ where: { clientId: { in: clientIds } } }),
          tx.relationship_notes.deleteMany({ where: { clientId: { in: clientIds } } }),
          tx.visit_history.deleteMany({ where: { clientId: { in: clientIds } } }),
          tx.clientRelationship.deleteMany({ where: { clientId: { in: clientIds } } }),
          tx.client.deleteMany({ where: { businessId: params.id } })
        ]);

        return {
          deletedCounts: {
            clients: deletedClients.count,
            appointments: deletedAppointments.count,
            reviews: deletedReviews.count,
            paymentMethods: deletedPaymentMethods.count,
            relationshipNotes: deletedNotes.count,
            visitHistory: deletedVisitHistory.count,
            clientRelationships: deletedRelationships.count
          }
        };
      });

      console.log(`✅ Admin bulk deletion completed for business: ${business.name}`);

      return NextResponse.json({
        success: true,
        message: `Todos os ${bulkDeletionResult.deletedCounts.clients} clientes do negócio "${business.name}" foram eliminados`,
        data: {
          bulkDeletion: true,
          businessName: business.name,
          deletedCounts: bulkDeletionResult.deletedCounts,
          adminAction: {
            performedBy: user.email,
            timestamp: new Date().toISOString()
          }
        }
      });
    }

  } catch (error) {
    console.error('❌ Error in admin client deletion:', error);
    return NextResponse.json({ 
      error: 'Failed to delete client(s)',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 