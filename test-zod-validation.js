// Test Zod validation vs Prisma schema mismatch
const { z } = require('zod');

// Exact Zod schema from API
const schema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  duration: z.number().int().positive(),
  price: z.number().nonnegative(),
  categoryId: z.string().optional(),
  image: z.string().optional(),
  location: z.string().optional(),
  address: z.string().optional(),
  maxCapacity: z.number().int().positive().optional(),
  availableDays: z.array(z.number().int().min(0).max(6)).optional(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  minAdvanceHours: z.number().int().positive().optional(),
  maxAdvanceDays: z.number().int().positive().optional(),
  anyTimeAvailable: z.boolean().optional(),
  slotsNeeded: z.number().int().positive().optional(),
  slotConfiguration: z.any().optional(),
  templateId: z.string().optional(),
  eventType: z.enum(['INDIVIDUAL', 'GROUP']).optional(),
  capacity: z.number().int().positive().optional(),
  availabilitySchedule: z.any().optional(),
  isActive: z.boolean().optional(),
  slots: z.any().optional(),
});

// Test data from frontend
const frontendData = {
  name: 'Test Service',
  description: 'Test Description',
  duration: 30,
  price: 25.00,
  slotsNeeded: 1,
  eventType: 'INDIVIDUAL',
  capacity: 1,
  availabilitySchedule: {
    monday: { enabled: true, timeSlots: [] },
    tuesday: { enabled: true, timeSlots: [] },
    wednesday: { enabled: true, timeSlots: [] },
    thursday: { enabled: true, timeSlots: [] },
    friday: { enabled: true, timeSlots: [] },
    saturday: { enabled: false, timeSlots: [] },
    sunday: { enabled: false, timeSlots: [] }
  },
  isActive: true
};

console.log('🧪 Testing Zod validation...');

try {
  const validatedData = schema.parse(frontendData);
  console.log('✅ Zod validation passed');
  console.log('Validated data:', JSON.stringify(validatedData, null, 2));
  
  // Check for potential issues
  console.log('\n🔍 Potential issues:');
  console.log('duration:', validatedData.duration, typeof validatedData.duration);
  console.log('price:', validatedData.price, typeof validatedData.price);
  console.log('slotsNeeded:', validatedData.slotsNeeded, typeof validatedData.slotsNeeded);
  console.log('capacity:', validatedData.capacity, typeof validatedData.capacity);
  console.log('eventType:', validatedData.eventType, typeof validatedData.eventType);
  console.log('isActive:', validatedData.isActive, typeof validatedData.isActive);
  
  // Check for undefined values that might cause issues
  const undefinedFields = Object.entries(validatedData).filter(([key, value]) => value === undefined);
  if (undefinedFields.length > 0) {
    console.log('⚠️ Undefined fields:', undefinedFields);
  } else {
    console.log('✅ No undefined fields');
  }
  
} catch (error) {
  console.error('❌ Zod validation failed:', error);
  if (error instanceof z.ZodError) {
    console.error('Zod errors:', error.errors);
  }
}
