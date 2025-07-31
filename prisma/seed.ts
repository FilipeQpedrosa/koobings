import { PrismaClient, BusinessType, StaffRole } from '@prisma/client'
import { hash } from 'bcryptjs'
import { randomUUID } from 'crypto'

const prisma = new PrismaClient()

async function cleanup() {
  // Delete all records in the correct order to handle foreign key constraints
  await prisma.system_admins.deleteMany();
  await prisma.reviews.deleteMany();
  await prisma.appointments.deleteMany();
  await prisma.recurring_appointments.deleteMany();
  await prisma.payment_methods.deleteMany();
  await prisma.notifications.deleteMany();
  await prisma.visit_history.deleteMany();
  await prisma.relationship_notes.deleteMany();
  await prisma.data_access_logs.deleteMany();
  await prisma.staff_permissions.deleteMany();
  await (prisma.staffAvailability as any).deleteMany();
  // Delete StaffUnavailability before Staff to avoid foreign key constraint
  await (prisma.staffUnavailability as any).deleteMany();
  await prisma.feature_options.deleteMany();
  await prisma.features.deleteMany();
  await prisma.feature_configurations.deleteMany();
  await prisma.security_settings.deleteMany();
  await prisma.business_verifications.deleteMany();
  await (prisma.client as any).deleteMany();
  await (prisma.staff as any).deleteMany();
  await (prisma.service as any).deleteMany();
  await prisma.service_categories.deleteMany();
  await (prisma.business as any).deleteMany();
}

async function main() {
  // Clean up existing data
  await cleanup();

  try {
    const now = new Date();
    
    // Create Filipe as the ONLY system admin
    await prisma.system_admins.create({
      data: {
        id: randomUUID(),
        email: 'f.queirozpedrosa@gmail.com',
        name: 'Filipe Pedrosa',
        role: 'SUPER_ADMIN',
        passwordHash: await hash('Pipo1234', 10),
        createdAt: now,
        updatedAt: now,
      },
    });

    // Create Sandra as a business owner
    const business = await (prisma.business as any).create({
      data: {
        id: randomUUID(),
        name: 'Onport',
        slug: 'onport',
        ownerName: 'Sandra',
        email: 'sandra@gmail.com',
        phone: '914603522',
        address: 'Rua Senhora do Porto 852',
        type: BusinessType.HAIR_SALON,
        passwordHash: await hash('admin123', 10),
        createdAt: now,
        updatedAt: now,
        settings: {
          timezone: 'UTC',
          currency: 'USD',
          language: 'en',
          notificationsEnabled: true,
          defaultAppointmentDuration: 60
        }
      },
    });

    // Create Sandra as a staff admin for her business
    await (prisma.staff as any).create({
      data: {
        id: randomUUID(),
        name: 'Sandra',
        email: 'sandra@gmail.com',
        password: await hash('admin123', 10),
        role: StaffRole.ADMIN,
        businessId: business.id,
        createdAt: now,
        updatedAt: now,
      },
    });

    // Create a test business
    const testBusiness = await (prisma.business as any).create({
      data: {
        id: randomUUID(),
        name: 'Test Salon & Spa',
        slug: 'test-salon',
        email: 'test@business.com',
        phone: '123-456-7890',
        address: '123 Test Street, Test City',
        type: BusinessType.HAIR_SALON,
        passwordHash: await hash('test123', 10),
        createdAt: now,
        updatedAt: now,
        settings: {
          timezone: 'UTC',
          currency: 'USD',
          language: 'en',
          notificationsEnabled: true,
          defaultAppointmentDuration: 60
        }
      },
    });

    // Create service categories
    const hairCategory = await prisma.service_categories.create({
      data: {
        id: randomUUID(),
        name: 'Hair Services',
        description: 'Professional hair care services',
        businessId: business.id,
        color: '#FF9999',
        createdAt: now,
        updatedAt: now,
      },
    });

    const spaCategory = await prisma.service_categories.create({
      data: {
        id: randomUUID(),
        name: 'Spa Services',
        description: 'Relaxing spa treatments',
        businessId: business.id,
        color: '#99FF99',
        createdAt: now,
        updatedAt: now,
      },
    });

    // Create services
    await (prisma.service as any).createMany({
      data: [
        {
          id: randomUUID(),
          name: 'Haircut & Style',
          description: 'Professional haircut and styling',
          duration: 60,
          price: 50.00,
          categoryId: hairCategory.id,
          businessId: business.id,
          createdAt: now,
          updatedAt: now,
        },
        {
          id: randomUUID(),
          name: 'Color & Highlights',
          description: 'Full color or highlight treatment',
          duration: 120,
          price: 120.00,
          categoryId: hairCategory.id,
          businessId: business.id,
          createdAt: now,
          updatedAt: now,
        },
        {
          id: randomUUID(),
          name: 'Swedish Massage',
          description: '60-minute relaxing massage',
          duration: 60,
          price: 80.00,
          categoryId: spaCategory.id,
          businessId: business.id,
          createdAt: now,
          updatedAt: now,
        },
        {
          id: randomUUID(),
          name: 'Facial Treatment',
          description: 'Deep cleansing facial with massage',
          duration: 90,
          price: 95.00,
          categoryId: spaCategory.id,
          businessId: business.id,
          createdAt: now,
          updatedAt: now,
        },
      ],
    });

    // Create a test staff member
    const staffMember = await (prisma.staff as any).create({
      data: {
        id: randomUUID(),
        name: 'John Doe',
        email: 'john@test.com',
        password: await hash('staff123', 10),
        role: StaffRole.STANDARD,
        businessId: testBusiness.id,
        createdAt: now,
        updatedAt: now,
      },
    });

    // Create staff availability
    await (prisma.staffAvailability as any).create({
      data: {
        id: randomUUID(),
        staffId: staffMember.id,
        createdAt: now,
        updatedAt: now,
        schedule: {
          monday: { start: '09:00', end: '17:00' },
          tuesday: { start: '09:00', end: '17:00' },
          wednesday: { start: '09:00', end: '17:00' },
          thursday: { start: '09:00', end: '17:00' },
          friday: { start: '09:00', end: '17:00' }
        }
      }
    });

    console.log('Database has been seeded. 🌱');
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