import { PrismaClient, BusinessType, StaffRole } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function cleanup() {
  // Delete all records in the correct order to handle foreign key constraints
  await prisma.staffAvailability.deleteMany();
  await prisma.service.deleteMany();
  await prisma.serviceCategory.deleteMany();
  await prisma.staff.deleteMany();
  await prisma.securitySettings.deleteMany();
  await prisma.featureOption.deleteMany();
  await prisma.feature.deleteMany();
  await prisma.featureConfiguration.deleteMany();
  await prisma.businessVerification.deleteMany();
  await prisma.business.deleteMany();
}

async function main() {
  // Clean up existing data
  await cleanup();

  try {
    // Create a test business
    const business = await prisma.business.create({
      data: {
        name: 'Test Salon & Spa',
        email: 'test@business.com',
        phone: '123-456-7890',
        address: '123 Test Street, Test City',
        type: BusinessType.HAIR_SALON,
        passwordHash: await hash('test123', 10),
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
    const hairCategory = await prisma.serviceCategory.create({
      data: {
        name: 'Hair Services',
        description: 'Professional hair care services',
        businessId: business.id,
        color: '#FF9999',
      },
    });

    const spaCategory = await prisma.serviceCategory.create({
      data: {
        name: 'Spa Services',
        description: 'Relaxing spa treatments',
        businessId: business.id,
        color: '#99FF99',
      },
    });

    // Create services
    await prisma.service.createMany({
      data: [
        {
          name: 'Haircut & Style',
          description: 'Professional haircut and styling',
          duration: 60,
          price: 50.00,
          categoryId: hairCategory.id,
          businessId: business.id,
        },
        {
          name: 'Color & Highlights',
          description: 'Full color or highlight treatment',
          duration: 120,
          price: 120.00,
          categoryId: hairCategory.id,
          businessId: business.id,
        },
        {
          name: 'Swedish Massage',
          description: '60-minute relaxing massage',
          duration: 60,
          price: 80.00,
          categoryId: spaCategory.id,
          businessId: business.id,
        },
        {
          name: 'Facial Treatment',
          description: 'Deep cleansing facial with massage',
          duration: 90,
          price: 95.00,
          categoryId: spaCategory.id,
          businessId: business.id,
        },
      ],
    });

    // Create a test staff member
    const staffMember = await prisma.staff.create({
      data: {
        name: 'John Doe',
        email: 'john@test.com',
        password: await hash('staff123', 10),
        role: StaffRole.STANDARD,
        businessId: business.id,
      },
    });

    // Create staff availability
    await prisma.staffAvailability.create({
      data: {
        staffId: staffMember.id,
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