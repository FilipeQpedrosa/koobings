import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const DEFAULT_SCHEDULE = {
  monday:    { start: '09:00', end: '17:00', isWorking: true, timeSlots: [{ start: '09:00', end: '17:00' }] },
  tuesday:   { start: '09:00', end: '17:00', isWorking: true, timeSlots: [{ start: '09:00', end: '17:00' }] },
  wednesday: { start: '09:00', end: '17:00', isWorking: true, timeSlots: [{ start: '09:00', end: '17:00' }] },
  thursday:  { start: '09:00', end: '17:00', isWorking: true, timeSlots: [{ start: '09:00', end: '17:00' }] },
  friday:    { start: '09:00', end: '17:00', isWorking: true, timeSlots: [{ start: '09:00', end: '17:00' }] },
  saturday:  { start: '', end: '', isWorking: false, timeSlots: [] },
  sunday:    { start: '', end: '', isWorking: false, timeSlots: [] },
};

async function main() {
  const staffList = await prisma.staff.findMany();
  let updated = 0;
  for (const staff of staffList) {
    await prisma.staffAvailability.upsert({
      where: { staffId: staff.id },
      update: { schedule: DEFAULT_SCHEDULE },
      create: {
        staffId: staff.id,
        schedule: DEFAULT_SCHEDULE,
      },
    });
    console.log(`Set default availability for staff: ${staff.name} (${staff.email})`);
    updated++;
  }
  if (updated === 0) {
    console.log('All staff already have availability.');
  } else {
    console.log(`Default availability set for ${updated} staff.`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 