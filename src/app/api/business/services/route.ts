import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/supabase';
import { z } from 'zod';

const serviceSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  duration: z.number().min(1),
  price: z.number().min(0),
});

const servicesSchema = z.array(serviceSchema);

export async function POST(request: Request) {
  try {
    const session = await getSession();

    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { services } = await request.json();
    
    // Validate input
    const validatedServices = servicesSchema.parse(services);

    // Delete existing services
    await prisma.service.deleteMany({
      where: {
        businessId: session.user.id,
      },
    });

    // Create new services
    await prisma.service.createMany({
      data: validatedServices.map((service) => ({
        businessId: session.user.id,
        name: service.name,
        description: service.description,
        duration: service.duration,
        price: service.price,
      })),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse('Invalid input data', { status: 400 });
    }
    console.error('Error saving services:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const session = await getSession();

    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const services = await prisma.service.findMany({
      where: {
        businessId: session.user.id,
      },
    });

    return NextResponse.json(services);
  } catch (error) {
    console.error('Error fetching services:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 