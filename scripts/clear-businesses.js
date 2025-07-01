const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function clearBusinesses() {
  try {
    console.log('🗑️ A apagar todos os businesses...');

    // Delete in order due to foreign key constraints
    await prisma.appointment.deleteMany({});
    console.log('✅ Appointments apagados');

    await prisma.staffUnavailability.deleteMany({});
    console.log('✅ Staff unavailabilities apagados');

    await prisma.staffAvailability.deleteMany({});
    console.log('✅ Staff availabilities apagados');

    await prisma.dataAccessLog.deleteMany({});
    console.log('✅ Data access logs apagados');

    await prisma.staffPermission.deleteMany({});
    console.log('✅ Staff permissions apagados');

    await prisma.relationshipNote.deleteMany({});
    console.log('✅ Relationship notes apagados');

    await prisma.clientRelationship.deleteMany({});
    console.log('✅ Client relationships apagados');

    await prisma.visitHistory.deleteMany({});
    console.log('✅ Visit history apagado');

    await prisma.review.deleteMany({});
    console.log('✅ Reviews apagados');

    await prisma.paymentMethod.deleteMany({});
    console.log('✅ Payment methods apagados');

    await prisma.client.deleteMany({});
    console.log('✅ Clients apagados');

    await prisma.service.deleteMany({});
    console.log('✅ Services apagados');

    await prisma.serviceCategory.deleteMany({});
    console.log('✅ Service categories apagados');

    await prisma.staff.deleteMany({});
    console.log('✅ Staff apagados');

    await prisma.businessHours.deleteMany({});
    console.log('✅ Business hours apagados');

    await prisma.featureConfiguration.deleteMany({});
    console.log('✅ Feature configurations apagados');

    await prisma.securitySettings.deleteMany({});
    console.log('✅ Security settings apagados');

    await prisma.businessVerification.deleteMany({});
    console.log('✅ Business verifications apagados');

    await prisma.business.deleteMany({});
    console.log('✅ Businesses apagados');

    console.log('🎉 Todos os businesses e dados relacionados foram apagados!');
    
  } catch (error) {
    console.error('❌ Erro ao apagar businesses:', error);
  } finally {
    await prisma.$disconnect();
  }
}

clearBusinesses(); 