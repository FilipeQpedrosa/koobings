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

  const appointments = await prisma.appointments.findMany({
    include: {
      client: true,
      service: true,
      staff: true,
      // payment: true, // Removed: not in schema. Add back if payment relation is added to Appointment in the future.
    }
  })

  console.log('\nAppointments:')
  console.log('-------------')
  appointments.forEach(apt => {
    console.log(`\n${apt.scheduledFor.toLocaleDateString()} at ${apt.scheduledFor.toLocaleTimeString()}`)
    console.log(`Client: ${apt.client.name}`)
    console.log(`Service: ${apt.service.name} with ${apt.staff.name}`)
    console.log(`Status: ${apt.status}`)
  })

  await prisma.$disconnect()
}

check().catch(console.error) 