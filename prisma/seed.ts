import { PrismaClient, BusinessType, StaffRole, BusinessStatus, PatientStatus, AppointmentStatus, Prisma } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

type BusinessSettings = {
  [key: string]: string | number | boolean | undefined;
  timezone: string;
  currency: string;
  language: string;
  notificationsEnabled?: boolean;
  defaultAppointmentDuration?: number;
}

async function main() {
  // Clean up existing data
  await prisma.$transaction([
    prisma.payment.deleteMany(),
    prisma.appointmentReminder.deleteMany(),
    prisma.appointmentCancellation.deleteMany(),
    prisma.appointment.deleteMany(),
    prisma.review.deleteMany(),
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
    prisma.patientPreference.deleteMany(),
    prisma.staff.deleteMany(),
    prisma.patient.deleteMany(),
    prisma.securitySettings.deleteMany(),
    prisma.business.deleteMany(),
  ])

  try {
    // Create initial business
    const businessSettings: BusinessSettings = {
      timezone: 'America/New_York',
      currency: 'USD',
      language: 'en',
      notificationsEnabled: true,
      defaultAppointmentDuration: 60
    }

    const businessPassword = await hash('admin123', 12)
    const businessData: Prisma.BusinessCreateInput = {
      name: 'Wellness Center',
      type: BusinessType.PSYCHOLOGY,
      email: 'admin@wellnesscenter.com',
      password: businessPassword,
      status: BusinessStatus.ACTIVE,
      phone: '+1234567890',
      address: '123 Healing Street, New York, NY 10001',
      settings: businessSettings,
      securitySettings: {
        create: {
          requireMFA: true,
          sensitiveDataAccessExpiry: 60,
          autoRevokeInactiveAccess: true,
          inactivityThreshold: 30,
          requireAccessReason: true,
          enableAccessLogs: true
        }
      }
    }

    const business = await prisma.business.create({
      data: businessData
    })

    // Create staff members
    const staffMembers = [
      {
        name: 'Dr. Sarah Johnson',
        email: 'sarah.johnson@wellnesscenter.com',
        role: StaffRole.ADMIN
      },
      {
        name: 'Dr. Michael Chen',
        email: 'michael.chen@wellnesscenter.com',
        role: StaffRole.PROVIDER
      }
    ]

    const createdStaff = await Promise.all(
      staffMembers.map(async (staff) => {
        const staffPassword = await hash('staff123', 12)
        return prisma.staff.create({
          data: {
            name: staff.name,
            email: staff.email,
            password: staffPassword,
            role: staff.role,
            businessId: business.id
          }
        })
      })
    )

    // Create service categories
    const categories = [
      {
        name: 'Therapy Sessions',
        description: 'Individual and group therapy sessions',
        color: '#4CAF50'
      },
      {
        name: 'Assessments',
        description: 'Psychological assessments and evaluations',
        color: '#2196F3'
      }
    ]

    const createdCategories = await Promise.all(
      categories.map((category) =>
        prisma.serviceCategory.create({
          data: {
            ...category,
            businessId: business.id
          }
        })
      )
    )

    // Create services
    const services = [
      {
        name: 'Individual Therapy',
        description: 'One-on-one therapy session',
        duration: 60,
        price: 150.00,
        categoryId: createdCategories[0].id
      },
      {
        name: 'Group Therapy',
        description: 'Group therapy session',
        duration: 90,
        price: 80.00,
        categoryId: createdCategories[0].id
      },
      {
        name: 'Psychological Assessment',
        description: 'Comprehensive psychological evaluation',
        duration: 120,
        price: 250.00,
        categoryId: createdCategories[1].id
      }
    ]

    await Promise.all(
      services.map((service) =>
        prisma.service.create({
          data: {
            ...service,
            businessId: business.id,
            providers: {
              connect: createdStaff.map(staff => ({ id: staff.id }))
            }
          }
        })
      )
    )

    // Create business hours for weekdays
    const weekdays = [1, 2, 3, 4, 5] // Monday to Friday
    
    await Promise.all(
      weekdays.map((dayOfWeek) =>
        prisma.businessHours.create({
          data: {
            businessId: business.id,
            dayOfWeek,
            startTime: '09:00',
            endTime: '17:00'
          }
        })
      )
    )

    // Create staff availability
    await Promise.all(
      createdStaff.flatMap((staff) =>
        [...Array(7)].map((_, i) =>
          prisma.staffAvailability.create({
            data: {
              staffId: staff.id,
              date: new Date(Date.now() + (i * 24 * 60 * 60 * 1000)), // Next 7 days
              startTime: '09:00',
              endTime: '17:00'
            }
          })
        )
      )
    )

    // Create demo patient
    const patient = await prisma.patient.create({
      data: {
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        phone: '+1987654321',
        dateOfBirth: new Date('1990-01-15'),
        gender: 'Female',
        address: '456 Patient Lane, New York, NY 10002',
        status: PatientStatus.ACTIVE,
        businesses: {
          connect: { id: business.id }
        },
        sensitiveInfo: {
          create: {
            email: 'jane.smith@example.com',
            medicalInfo: 'No known allergies',
            notes: 'Regular therapy sessions for anxiety management'
          }
        }
      }
    })

    console.log('Seed data created successfully')
  } catch (error) {
    console.error('Error creating seed data:', error)
    throw error
  }
}

main()
  .catch((e) => {
    console.error('Error seeding data:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 