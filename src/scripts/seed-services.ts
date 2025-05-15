import { PrismaClient, StaffRole } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  try {
    // Delete existing data
    await prisma.patientRelationship.deleteMany();
    await prisma.staffAvailability.deleteMany();
    await prisma.schedule.deleteMany();
    await prisma.appointment.deleteMany();
    await prisma.service.deleteMany();
    await prisma.serviceCategory.deleteMany();
    await prisma.staff.deleteMany();
    await prisma.businessHours.deleteMany();
    await prisma.business.deleteMany();

    // Create a business
    const business = await prisma.business.create({
      data: {
        name: "Beauty & Wellness Center",
        type: "HAIR_SALON",
        email: "contact-" + Date.now() + "@beautywellness.com",
        phone: "123-456-7890",
        address: "123 Main St, City, State 12345"
      }
    });

    // Create business hours
    const businessHours = await Promise.all(
      Array.from({ length: 7 }, (_, i) => 
        prisma.businessHours.create({
          data: {
            businessId: business.id,
            dayOfWeek: i,
            startTime: "09:00",
            endTime: "17:00",
            isClosed: i === 0 || i === 6 // Closed on Sunday (0) and Saturday (6)
          }
        })
      )
    );

    // Create service categories
    const categories = await Promise.all([
      prisma.serviceCategory.create({
        data: {
          name: "Hair Care",
          description: "Professional hair care services",
          color: "#FFD700",
          businessId: business.id
        }
      }),
      prisma.serviceCategory.create({
        data: {
          name: "Skin Care",
          description: "Facial and skin treatments",
          color: "#98FB98",
          businessId: business.id
        }
      }),
      prisma.serviceCategory.create({
        data: {
          name: "Nail Care",
          description: "Manicure and pedicure services",
          color: "#FF69B4",
          businessId: business.id
        }
      })
    ]);

    // Create staff members
    const staffMembers = await Promise.all([
      prisma.staff.create({
        data: {
          name: "Sarah Johnson",
          email: "sarah@beautywellness.com",
          password: await hash("password123", 10),
          role: StaffRole.PROVIDER,
          businessId: business.id,
          schedules: {
            create: Array.from({ length: 5 }, (_, i) => ({
              dayOfWeek: i + 1, // Monday to Friday
              startTime: "09:00",
              endTime: "17:00"
            }))
          }
        }
      }),
      prisma.staff.create({
        data: {
          name: "David Wilson",
          email: "david@beautywellness.com",
          password: await hash("password123", 10),
          role: StaffRole.PROVIDER,
          businessId: business.id,
          schedules: {
            create: Array.from({ length: 5 }, (_, i) => ({
              dayOfWeek: i + 1, // Monday to Friday
              startTime: "09:00",
              endTime: "17:00"
            }))
          }
        }
      })
    ]);

    // Create services and associate them with staff
    const services = await Promise.all([
      prisma.service.create({
        data: {
          name: "Haircut & Styling",
          description: "Professional haircut and styling service",
          duration: 60,
          price: 50.00,
          categoryId: categories[0].id,
          businessId: business.id,
          providers: {
            connect: staffMembers.map(staff => ({ id: staff.id }))
          }
        }
      }),
      prisma.service.create({
        data: {
          name: "Facial Treatment",
          description: "Rejuvenating facial treatment",
          duration: 45,
          price: 65.00,
          categoryId: categories[1].id,
          businessId: business.id,
          providers: {
            connect: [{ id: staffMembers[0].id }]
          }
        }
      }),
      prisma.service.create({
        data: {
          name: "Manicure",
          description: "Professional nail care service",
          duration: 30,
          price: 35.00,
          categoryId: categories[2].id,
          businessId: business.id,
          providers: {
            connect: [{ id: staffMembers[1].id }]
          }
        }
      })
    ]);

    console.log("Seeding completed successfully!");
  } catch (error) {
    console.error("Error seeding data:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main(); 