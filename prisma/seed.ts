import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Clean up existing data
  await prisma.$transaction([
    prisma.payment.deleteMany(),
    prisma.appointment.deleteMany(),
    prisma.dataAccessLog.deleteMany(),
    prisma.staffPermission.deleteMany(),
    prisma.patientDataRule.deleteMany(),
    prisma.schedule.deleteMany(),
    prisma.businessHours.deleteMany(),
    prisma.service.deleteMany(),
    prisma.serviceCategory.deleteMany(),
    prisma.patientSensitiveInfo.deleteMany(),
    prisma.relationshipNote.deleteMany(),
    prisma.patientRelationship.deleteMany(),
    prisma.staff.deleteMany(),
    prisma.patient.deleteMany(),
    prisma.securitySettings.deleteMany(),
    prisma.business.deleteMany(),
  ])

  // Create a test business
  const business = await prisma.business.create({
    data: {
      name: 'Beauty & Wellness Center',
      type: 'HAIR_SALON',
      email: 'contact@beautywellness.com',
      status: 'ACTIVE',
    },
  })

  // Create business hours
  const businessHours = await Promise.all(
    [0, 1, 2, 3, 4, 5, 6].map(day => 
      prisma.businessHours.create({
        data: {
          businessId: business.id,
          dayOfWeek: day,
          startTime: day === 0 || day === 6 ? '10:00' : '09:00', // Later start on weekends
          endTime: day === 0 || day === 6 ? '16:00' : '18:00',   // Earlier close on weekends
          isClosed: day === 0, // Closed on Sundays
        },
      })
    )
  );

  // Create staff members
  const staffMembers = await Promise.all([
    prisma.staff.create({
      data: {
        email: 'sarah@beautywellness.com',
        name: 'Sarah Johnson',
        role: 'PROVIDER',
        password: await hash('password123', 12),
        businessId: business.id,
        schedules: {
          create: [
            { dayOfWeek: 1, startTime: '09:00', endTime: '17:00' },
            { dayOfWeek: 2, startTime: '09:00', endTime: '17:00' },
            { dayOfWeek: 3, startTime: '09:00', endTime: '17:00' },
            { dayOfWeek: 4, startTime: '09:00', endTime: '17:00' },
            { dayOfWeek: 5, startTime: '09:00', endTime: '17:00' },
          ]
        }
      },
    }),
    prisma.staff.create({
      data: {
        email: 'michael@beautywellness.com',
        name: 'Michael Chen',
        role: 'PROVIDER',
        password: await hash('password123', 12),
        businessId: business.id,
        schedules: {
          create: [
            { dayOfWeek: 2, startTime: '10:00', endTime: '18:00' },
            { dayOfWeek: 3, startTime: '10:00', endTime: '18:00' },
            { dayOfWeek: 4, startTime: '10:00', endTime: '18:00' },
            { dayOfWeek: 5, startTime: '10:00', endTime: '18:00' },
            { dayOfWeek: 6, startTime: '10:00', endTime: '16:00' },
          ]
        }
      },
    }),
    prisma.staff.create({
      data: {
        email: 'emma@beautywellness.com',
        name: 'Emma Davis',
        role: 'PROVIDER',
        password: await hash('password123', 12),
        businessId: business.id,
        schedules: {
          create: [
            { dayOfWeek: 1, startTime: '09:00', endTime: '17:00' },
            { dayOfWeek: 2, startTime: '09:00', endTime: '17:00' },
            { dayOfWeek: 4, startTime: '09:00', endTime: '17:00' },
            { dayOfWeek: 5, startTime: '09:00', endTime: '17:00' },
            { dayOfWeek: 6, startTime: '10:00', endTime: '15:00' },
          ]
        }
      },
    }),
    prisma.staff.create({
      data: {
        email: 'sofia@beautywellness.com',
        name: 'Sofia Rodriguez',
        role: 'PROVIDER',
        password: await hash('password123', 12),
        businessId: business.id,
        schedules: {
          create: [
            { dayOfWeek: 2, startTime: '09:00', endTime: '17:00' },
            { dayOfWeek: 3, startTime: '09:00', endTime: '17:00' },
            { dayOfWeek: 4, startTime: '09:00', endTime: '17:00' },
            { dayOfWeek: 5, startTime: '09:00', endTime: '17:00' },
            { dayOfWeek: 6, startTime: '10:00', endTime: '15:00' },
          ]
        }
      },
    }),
    // Additional staff members
    prisma.staff.create({
      data: {
        email: 'david@beautywellness.com',
        name: 'David Wilson',
        role: 'PROVIDER',
        password: await hash('password123', 12),
        businessId: business.id,
        schedules: {
          create: [
            { dayOfWeek: 1, startTime: '10:00', endTime: '18:00' },
            { dayOfWeek: 2, startTime: '10:00', endTime: '18:00' },
            { dayOfWeek: 3, startTime: '10:00', endTime: '18:00' },
            { dayOfWeek: 4, startTime: '10:00', endTime: '18:00' },
            { dayOfWeek: 5, startTime: '10:00', endTime: '18:00' },
          ]
        }
      },
    }),
    prisma.staff.create({
      data: {
        email: 'maria@beautywellness.com',
        name: 'Maria Garcia',
        role: 'PROVIDER',
        password: await hash('password123', 12),
        businessId: business.id,
        schedules: {
          create: [
            { dayOfWeek: 1, startTime: '09:00', endTime: '17:00' },
            { dayOfWeek: 3, startTime: '09:00', endTime: '17:00' },
            { dayOfWeek: 4, startTime: '09:00', endTime: '17:00' },
            { dayOfWeek: 5, startTime: '09:00', endTime: '17:00' },
            { dayOfWeek: 6, startTime: '10:00', endTime: '16:00' },
          ]
        }
      },
    }),
  ])

  // Create service categories
  const hairCategory = await prisma.serviceCategory.create({
    data: {
      name: 'Hair',
      description: 'Hair care services',
      businessId: business.id,
    },
  })

  const nailsCategory = await prisma.serviceCategory.create({
    data: {
      name: 'Nails',
      description: 'Nail care services',
      businessId: business.id,
    },
  })

  const skinCategory = await prisma.serviceCategory.create({
    data: {
      name: 'Skincare',
      description: 'Skin care services',
      businessId: business.id,
    },
  })

  const massageCategory = await prisma.serviceCategory.create({
    data: {
      name: 'Massage',
      description: 'Massage services',
      businessId: business.id,
    },
  })

  // Create services and assign providers
  const services = await Promise.all([
    prisma.service.create({
      data: {
        name: 'Haircut & Styling',
        description: 'Professional haircut and styling service tailored to your preferences',
        duration: 60,
        price: 50,
        businessId: business.id,
        categoryId: hairCategory.id,
        recurring: false,
        providers: {
          connect: [
            { id: staffMembers[0].id }, // Sarah
            { id: staffMembers[4].id }, // David
          ]
        }
      },
    }),
    prisma.service.create({
      data: {
        name: 'Hair Coloring',
        description: 'Professional hair coloring service with quality products',
        duration: 120,
        price: 100,
        businessId: business.id,
        categoryId: hairCategory.id,
        recurring: false,
        providers: {
          connect: [
            { id: staffMembers[0].id }, // Sarah
            { id: staffMembers[4].id }, // David
          ]
        }
      },
    }),
    prisma.service.create({
      data: {
        name: 'Manicure & Pedicure',
        description: 'Complete nail care treatment for hands and feet',
        duration: 90,
        price: 65,
        businessId: business.id,
        categoryId: nailsCategory.id,
        recurring: false,
        providers: {
          connect: [
            { id: staffMembers[2].id }, // Emma
            { id: staffMembers[5].id }, // Maria
          ]
        }
      },
    }),
    prisma.service.create({
      data: {
        name: 'Facial Treatment',
        description: 'Rejuvenating facial treatment with premium skincare products',
        duration: 75,
        price: 85,
        businessId: business.id,
        categoryId: skinCategory.id,
        recurring: true,
        providers: {
          connect: [
            { id: staffMembers[3].id }, // Sofia
            { id: staffMembers[5].id }, // Maria
          ]
        }
      },
    }),
    prisma.service.create({
      data: {
        name: 'Massage Therapy',
        description: 'Relaxing full-body massage to relieve stress and tension',
        duration: 60,
        price: 70,
        businessId: business.id,
        categoryId: massageCategory.id,
        recurring: false,
        providers: {
          connect: [
            { id: staffMembers[1].id }, // Michael
            { id: staffMembers[4].id }, // David
          ]
        }
      },
    }),
    prisma.service.create({
      data: {
        name: 'Spa Package',
        description: 'Complete spa treatment including massage, facial, and nail care',
        duration: 180,
        price: 150,
        businessId: business.id,
        categoryId: massageCategory.id,
        recurring: true,
        providers: {
          connect: [
            { id: staffMembers[1].id }, // Michael
            { id: staffMembers[2].id }, // Emma
            { id: staffMembers[3].id }, // Sofia
            { id: staffMembers[5].id }, // Maria
          ]
        }
      },
    }),
  ])

  // Create a test patient/user
  const patient = await prisma.patient.create({
    data: {
      name: 'Test Patient',
      email: 'patient@test.com',
      phone: '987-654-3210',
      status: 'ACTIVE',
      businesses: {
        connect: { id: business.id },
      },
      relationships: {
        create: {
          businessId: business.id,
          status: 'ACTIVE',
          relationshipStartDate: new Date(),
        },
      },
    },
  })

  // Create test appointments
  const today = new Date()
  const nextWeek = new Date(today)
  nextWeek.setDate(today.getDate() + 7)

  await prisma.appointment.create({
    data: {
      startTime: new Date(today.setHours(10, 0, 0, 0)),
      endTime: new Date(today.setHours(10, 30, 0, 0)),
      status: 'CONFIRMED',
      businessId: business.id,
      patientId: patient.id,
      serviceId: services[0].id,
      staffId: staffMembers[0].id,
    },
  })

  await prisma.appointment.create({
    data: {
      startTime: new Date(nextWeek.setHours(14, 0, 0, 0)),
      endTime: new Date(nextWeek.setHours(16, 0, 0, 0)),
      status: 'PENDING',
      businessId: business.id,
      patientId: patient.id,
      serviceId: services[1].id,
      staffId: staffMembers[0].id,
    },
  })

  console.log('Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 