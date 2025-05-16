import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function check() {
  const business = await prisma.business.findFirst({
    include: {
      _count: {
        select: {
          staff: true,
          services: true,
          clients: true,
          appointments: true
        }
      }
    }
  })
  
  console.log('\nBusiness Summary:')
  console.log('----------------')
  console.log('Name:', business?.name)
  console.log('Email:', business?.email)
  console.log('\nCounts:')
  console.log('Staff members:', business?._count.staff)
  console.log('Services:', business?._count.services)
  console.log('Clients:', business?._count.clients)
  console.log('Appointments:', business?._count.appointments)

  const appointments = await prisma.appointment.findMany({
    include: {
      client: true,
      service: true,
      staff: true,
      payment: true
    }
  })

  console.log('\nAppointments:')
  console.log('-------------')
  appointments.forEach(apt => {
    console.log(`\n${apt.startTime.toLocaleDateString()} at ${apt.startTime.toLocaleTimeString()}`)
    console.log(`Client: ${apt.client.name}`)
    console.log(`Service: ${apt.service.name} with ${apt.staff.name}`)
    console.log(`Status: ${apt.status}`)
    console.log(`Payment: ${apt.payment?.status} - $${apt.payment?.amount}`)
  })

  await prisma.$disconnect()
}

check().catch(console.error) 