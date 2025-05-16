import { PrismaClient } from '@prisma/client';
import { sendAppointmentReminder } from '../src/lib/email';
import { addHours } from 'date-fns';

async function main() {
  console.log('Starting email test...');
  
  const prisma = new PrismaClient();

  try {
    // Get a test business
    const business = await prisma.business.findFirst();
    if (!business) {
      throw new Error('No test business found. Please run npm run db:seed first.');
    }

    // Get a test client
    const client = await prisma.client.findFirst({
      where: { businessId: business.id },
      include: {
        sensitiveInfo: true,
      },
    });
    if (!client) {
      throw new Error('No test client found. Please run npm run db:seed first.');
    }

    // Get a test service
    const service = await prisma.service.findFirst({
      where: { businessId: business.id },
    });
    if (!service) {
      throw new Error('No test service found. Please run npm run db:seed first.');
    }

    // Get a test staff member
    const staff = await prisma.staff.findFirst({
      where: { businessId: business.id },
    });
    if (!staff) {
      throw new Error('No test staff found. Please run npm run db:seed first.');
    }

    // Create a test appointment
    const startTime = addHours(new Date(), 24); // Tomorrow
    const endTime = addHours(startTime, 1); // 1 hour duration

    const appointment = await prisma.appointment.create({
      data: {
        startTime,
        endTime,
        status: 'CONFIRMED',
        businessId: business.id,
        clientId: client.id,
        serviceId: service.id,
        staffId: staff.id,
      },
      include: {
        client: {
          include: {
            sensitiveInfo: true,
          },
        },
        service: true,
        staff: true,
        business: true,
      },
    });

    // Send a test reminder
    console.log('Sending test reminder email...');
    const result = await sendAppointmentReminder({
      appointment: appointment as any,
    });

    if (result.success) {
      console.log('✅ Test email sent successfully!');
      console.log('Message ID:', result.messageId);
    } else {
      console.error('❌ Failed to send test email:', result.error);
    }

  } catch (error) {
    console.error('Error during test:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch(console.error); 