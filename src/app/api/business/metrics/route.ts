import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user || !session.user.id) {
      console.error('Unauthorized: No session or user.');
      return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } }, { status: 401 })
    }

    const businessId = session.user.id

    // Get total appointments
    const totalAppointments = await prisma.appointments.count({
      where: {
        businessId
      }
    })

    // Get total revenue
    const appointments = await prisma.appointments.findMany({
      where: {
        businessId,
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
    
    const totalRevenue = appointments.reduce((sum: number, appointment: { service?: { price?: number } }) => {
      return sum + (appointment.service?.price ? Number(appointment.service.price) : 0)
    }, 0)

    // Get active staff count
    const activeStaff = await prisma.staff.count({
      where: {
        businessId
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        totalAppointments,
        totalRevenue,
        activeStaff
      }
    })
  } catch (error) {
    console.error('GET /business/metrics error:', error)
    return NextResponse.json({ success: false, error: { code: 'METRICS_FETCH_ERROR', message: 'Internal Server Error' } }, { status: 500 })
  }
}

// TODO: Add rate limiting middleware for abuse protection in the future. 