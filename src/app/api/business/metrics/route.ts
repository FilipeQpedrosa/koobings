import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const businessId = session.user.id

    // Get total appointments
    const totalAppointments = await prisma.appointment.count({
      where: {
        businessId,
        isDeleted: false
      }
    })

    // Get total revenue
    const appointments = await prisma.appointment.findMany({
      where: {
        businessId,
        isDeleted: false,
        status: 'COMPLETED'
      },
      select: {
        service: {
          select: {
            price: true
          }
        }
      }
    })
    
    const totalRevenue = appointments.reduce((sum, appointment) => {
      return sum + (appointment.service?.price ? Number(appointment.service.price) : 0)
    }, 0)

    // Get active staff count
    const activeStaff = await prisma.staff.count({
      where: {
        businessId,
        isDeleted: false
      }
    })

    return NextResponse.json({
      totalAppointments,
      totalRevenue,
      activeStaff
    })
  } catch (error) {
    console.error('Error fetching business metrics:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
} 