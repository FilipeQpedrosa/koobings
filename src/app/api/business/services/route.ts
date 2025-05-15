import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET: List all services for a business
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const staff = await prisma.staff.findUnique({
      where: { email: session.user?.email },
      include: { business: true }
    });

    if (!staff) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const services = await prisma.service.findMany({
      where: { businessId: staff.businessId },
      select: {
        id: true,
        name: true,
        duration: true,
      },
      orderBy: { name: 'asc' },
    });

    return NextResponse.json(services);
  } catch (error) {
    console.error('Error fetching services:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

// POST: Create a new service
export async function POST(request: Request) {
  const supabase = createClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const formData = await request.formData()
    const name = formData.get('name') as string
    const description = formData.get('description') as string
    const price = parseFloat(formData.get('price') as string)
    const duration = parseInt(formData.get('duration') as string)
    const categoryId = formData.get('categoryId') as string

    const business = await prisma.business.findFirst({
      where: { email: session.user.email }
    })

    if (!business) {
      return NextResponse.json({ error: 'Business not found' }, { status: 404 })
    }

    const service = await prisma.service.create({
      data: {
        name,
        description,
        price,
        duration,
        categoryId: categoryId || null,
        business: {
          connect: { id: business.id }
        }
      },
      include: {
        category: true,
        providers: true
      }
    })

    return NextResponse.json(service)
  } catch (error) {
    console.error('Error creating service:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}