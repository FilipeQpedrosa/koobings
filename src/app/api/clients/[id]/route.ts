import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function GET(request: Request) {
  const { pathname } = new URL(request.url);
  const id = pathname.split('/').at(-1);
  try {
    const client = await prisma.client.findUnique({
      where: { id: id },
    });

    if (!client) {
      return NextResponse.json(
        { success: false, error: { code: 'CLIENT_NOT_FOUND', message: 'Client not found' } },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: client });
  } catch (error) {
    console.error('Error fetching client:', error);
    return NextResponse.json(
      { success: false, error: { code: 'CLIENT_FETCH_ERROR', message: 'Failed to fetch client' } },
      { status: 500 }
    );
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function PUT(request: Request) {
  const { pathname } = new URL(request.url);
  const id = pathname.split('/').at(-1);
  try {
    const data = await request.json();
    const client = await prisma.client.update({
      where: { id: id },
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        status: data.status,
        notes: data.notes,
      },
    });
    return NextResponse.json({ success: true, data: client });
  } catch (error) {
    console.error('Error updating client:', error);
    return NextResponse.json(
      { success: false, error: { code: 'CLIENT_UPDATE_ERROR', message: 'Failed to update client' } },
      { status: 500 }
    );
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function DELETE(request: Request) {
  const { pathname } = new URL(request.url);
  const id = pathname.split('/').at(-1);
  
  try {
    console.log(`🗑️ Starting complete client deletion for ID: ${id}`);
    
    // First, verify the client exists and get basic info
    const clientToDelete = await prisma.client.findUnique({
      where: { id: id },
      select: {
        id: true,
        name: true,
        email: true,
        businessId: true,
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
      console.log(`❌ Client not found: ${id}`);
      return NextResponse.json(
        { success: false, error: { code: 'CLIENT_NOT_FOUND', message: 'Client not found' } },
        { status: 404 }
      );
    }

    console.log(`🔍 Client found: ${clientToDelete.name} (${clientToDelete.email})`);
    console.log(`📊 Related data counts:`, clientToDelete._count);

    // Perform complete deletion in a transaction
    const deletionResult = await prisma.$transaction(async (tx) => {
      console.log(`🧹 Starting transaction for complete client deletion...`);
      
      // 1. Delete all appointments
      const deletedAppointments = await tx.appointments.deleteMany({
        where: { clientId: id }
      });
      console.log(`✅ Deleted ${deletedAppointments.count} appointments`);

      // 2. Delete all reviews
      const deletedReviews = await tx.reviews.deleteMany({
        where: { clientId: id }
      });
      console.log(`✅ Deleted ${deletedReviews.count} reviews`);

      // 3. Delete all payment methods
      const deletedPaymentMethods = await tx.payment_methods.deleteMany({
        where: { clientId: id }
      });
      console.log(`✅ Deleted ${deletedPaymentMethods.count} payment methods`);

      // 4. Delete all relationship notes
      const deletedNotes = await tx.relationship_notes.deleteMany({
        where: { clientId: id }
      });
      console.log(`✅ Deleted ${deletedNotes.count} relationship notes`);

      // 5. Delete all visit history
      const deletedVisitHistory = await tx.visit_history.deleteMany({
        where: { clientId: id }
      });
      console.log(`✅ Deleted ${deletedVisitHistory.count} visit history records`);

      // 6. Delete all client relationships
      const deletedRelationships = await tx.clientRelationship.deleteMany({
        where: { clientId: id }
      });
      console.log(`✅ Deleted ${deletedRelationships.count} client relationships`);

      // 7. Finally, delete the client record itself
      const deletedClient = await tx.client.delete({
        where: { id: id }
      });
      console.log(`✅ Deleted client record: ${deletedClient.name}`);

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

    console.log(`🎉 Complete client deletion successful!`);
    console.log(`📋 Deletion summary:`, deletionResult.deletedCounts);

    return NextResponse.json({ 
      success: true, 
      message: `Cliente "${deletionResult.client.name}" foi completamente eliminado`,
      data: {
        deletedClient: {
          id: deletionResult.client.id,
          name: deletionResult.client.name,
          email: deletionResult.client.email
        },
        deletedCounts: deletionResult.deletedCounts
      }
    });

  } catch (error) {
    console.error('❌ Error during complete client deletion:', error);
    
    // Provide more specific error handling
    if (error instanceof Error) {
      if (error.message.includes('foreign key constraint')) {
        return NextResponse.json(
          { 
            success: false, 
            error: { 
              code: 'CONSTRAINT_ERROR', 
              message: 'Não foi possível eliminar o cliente devido a dependências na base de dados' 
            } 
          },
          { status: 400 }
        );
      }
    }
    
    return NextResponse.json(
      { 
        success: false, 
        error: { 
          code: 'CLIENT_DELETE_ERROR', 
          message: 'Falha ao eliminar cliente completamente',
          details: error instanceof Error ? error.message : 'Unknown error'
        } 
      },
      { status: 500 }
    );
  }
} 