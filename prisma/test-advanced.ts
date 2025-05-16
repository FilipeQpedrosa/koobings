import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testAdvancedFeatures() {
  try {
    // Get test data
    const business = await prisma.business.findFirst();
    const staff = await prisma.staff.findMany();
    const clients = await prisma.client.findMany();
    const services = await prisma.service.findMany();

    if (!business || staff.length === 0 || clients.length === 0 || services.length === 0) {
      throw new Error('Required test data not found');
    }

    // 1. Test Security and Access Control
    console.log('\n=== Testing Security Features ===');

    // Create staff permission
    const permission = await prisma.staffPermission.create({
      data: {
        staffId: staff[0].id,
        businessId: business.id,
        resource: 'client_sensitive_info',
        accessLevel: 'RESTRICTED',
        conditions: {
          requireReason: true,
          expiresInHours: 24,
        },
      },
    });
    console.log('Created Staff Permission:', permission);

    // Log data access
    const accessLog = await prisma.dataAccessLog.create({
      data: {
        businessId: business.id,
        staffId: staff[0].id,
        clientId: clients[0].id,
        accessType: 'VIEW',
        resource: 'client_sensitive_info',
        reason: 'Appointment preparation',
        ipAddress: '127.0.0.1',
        userAgent: 'Test Script',
        successful: true,
      },
    });
    console.log('Created Access Log:', accessLog);

    // 2. Test Appointment Scheduling Rules
    console.log('\n=== Testing Scheduling Rules ===');

    // Try to create overlapping appointments
    const baseDate = new Date('2024-05-15T10:00:00Z');
    
    // First appointment
    const appointment1 = await prisma.appointment.create({
      data: {
        startTime: baseDate,
        endTime: new Date(baseDate.getTime() + 60 * 60 * 1000), // 1 hour later
        status: 'CONFIRMED',
        businessId: business.id,
        clientId: clients[0].id,
        serviceId: services[0].id,
        staffId: staff[0].id,
        payment: {
          create: {
            amount: services[0].price,
            status: 'PENDING',
            paymentMethod: 'CREDIT_CARD',
          },
        },
      },
    });
    console.log('Created First Appointment:', {
      startTime: appointment1.startTime,
      endTime: appointment1.endTime,
      status: appointment1.status,
    });

    // Try to create overlapping appointment (should fail in real implementation)
    try {
      const appointment2 = await prisma.appointment.create({
        data: {
          startTime: new Date(baseDate.getTime() + 30 * 60 * 1000), // 30 minutes after first appointment start
          endTime: new Date(baseDate.getTime() + 90 * 60 * 1000), // 1.5 hours after first appointment start
          status: 'PENDING',
          businessId: business.id,
          clientId: clients[1].id,
          serviceId: services[0].id,
          staffId: staff[0].id,
        },
      });
      console.log('Warning: Created overlapping appointment - scheduling rules should prevent this');
    } catch (error) {
      console.log('Successfully prevented overlapping appointment');
    }

    // 3. Test Payment Flow
    console.log('\n=== Testing Payment Flow ===');

    // Create appointment with payment
    const appointmentWithPayment = await prisma.appointment.create({
      data: {
        startTime: new Date('2024-05-16T14:00:00Z'),
        endTime: new Date('2024-05-16T15:00:00Z'),
        status: 'PENDING',
        businessId: business.id,
        clientId: clients[0].id,
        serviceId: services[0].id,
        staffId: staff[0].id,
        payment: {
          create: {
            amount: services[0].price,
            status: 'PENDING',
            paymentMethod: 'CREDIT_CARD',
          },
        },
      },
      include: {
        payment: true,
      },
    });

    // Update payment status to completed
    const updatedPayment = await prisma.payment.update({
      where: {
        appointmentId: appointmentWithPayment.id,
      },
      data: {
        status: 'COMPLETED',
      },
    });

    // Update appointment status based on payment
    const confirmedAppointment = await prisma.appointment.update({
      where: {
        id: appointmentWithPayment.id,
      },
      data: {
        status: 'CONFIRMED',
      },
      include: {
        client: true,
        service: true,
        payment: true,
      },
    });

    console.log('Payment Flow Test:', {
      appointmentStatus: confirmedAppointment.status,
      paymentStatus: confirmedAppointment.payment?.status,
      amount: confirmedAppointment.payment?.amount,
      service: confirmedAppointment.service.name,
      client: confirmedAppointment.client.name,
    });

    // 4. Test Client Data Rules
    console.log('\n=== Testing Client Data Rules ===');

    const dataRule = await prisma.clientDataRule.create({
      data: {
        businessId: business.id,
        clientId: clients[0].id,
        staffId: staff[0].id,
        resource: 'medical_records',
        accessLevel: 'RESTRICTED',
        reason: 'Treatment planning',
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      },
    });

    console.log('Created Client Data Rule:', {
      resource: dataRule.resource,
      accessLevel: dataRule.accessLevel,
      validityPeriod: {
        from: dataRule.startDate,
        to: dataRule.endDate,
      },
    });

  } catch (error) {
    console.error('Error during advanced testing:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testAdvancedFeatures()
  .catch(console.error); 