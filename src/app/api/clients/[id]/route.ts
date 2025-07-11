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
    await prisma.client.delete({
      where: { id: id },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting client:', error);
    return NextResponse.json(
      { success: false, error: { code: 'CLIENT_DELETE_ERROR', message: 'Failed to delete client' } },
      { status: 500 }
    );
  }
} 