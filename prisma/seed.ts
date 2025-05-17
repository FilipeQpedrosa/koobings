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

async function cleanup() {
  // Delete all records in the correct order to handle foreign key constraints
  await prisma.staffAvailability.deleteMany();
  await prisma.service.deleteMany();
  await prisma.serviceCategory.deleteMany();
  await prisma.businessHours.deleteMany();
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
    const business = await prisma.business.upsert({
      where: { email: 'test@business.com' },
      update: {},
      create: {
        name: 'Test Salon & Spa',
        type: BusinessType.HAIR_SALON,
        email: 'test@business.com',
        phone: '123-456-7890',
        passwordHash: 'test-password-hash', // In production, this should be properly hashed
        status: 'ACTIVE',
        address: '123 Test Street, Test City',
        businessHours: {
          createMany: {
            data: [
              { dayOfWeek: 0, startTime: '09:00', endTime: '17:00' }, // Sunday
              { dayOfWeek: 1, startTime: '09:00', endTime: '18:00' }, // Monday
              { dayOfWeek: 2, startTime: '09:00', endTime: '18:00' }, // Tuesday
              { dayOfWeek: 3, startTime: '09:00', endTime: '18:00' }, // Wednesday
              { dayOfWeek: 4, startTime: '09:00', endTime: '18:00' }, // Thursday
              { dayOfWeek: 5, startTime: '09:00', endTime: '18:00' }, // Friday
              { dayOfWeek: 6, startTime: '09:00', endTime: '17:00' }, // Saturday
            ],
          },
        },
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
          duration: 60, // minutes
          price: 50.00,
          categoryId: hairCategory.id,
          businessId: business.id,
          isActive: true,
        },
        {
          name: 'Color & Highlights',
          description: 'Full color or highlight treatment',
          duration: 120,
          price: 120.00,
          categoryId: hairCategory.id,
          businessId: business.id,
          isActive: true,
        },
        {
          name: 'Swedish Massage',
          description: '60-minute relaxing massage',
          duration: 60,
          price: 80.00,
          categoryId: spaCategory.id,
          businessId: business.id,
          isActive: true,
        },
        {
          name: 'Facial Treatment',
          description: 'Deep cleansing facial with massage',
          duration: 90,
          price: 95.00,
          categoryId: spaCategory.id,
          businessId: business.id,
          isActive: true,
        },
      ],
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