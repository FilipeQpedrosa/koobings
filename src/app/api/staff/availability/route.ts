import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createApiHandler, ApiError } from '@/lib/api-handler';
import * as yup from 'yup';
import { CustomUser } from '@/lib/auth';
import { NextApiRequest, NextApiResponse } from 'next';

// Schema for regular schedule
const scheduleSchema = yup.object({
  dayOfWeek: yup.number().min(0).max(6).required(),
  startTime: yup.string().matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).required(),
  endTime: yup.string().matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).required(),
});

// Schema for availability exceptions
const availabilitySchema = yup.object({
  date: yup.date().required(),
  isAvailable: yup.boolean().required(),
  reason: yup.string().when('isAvailable', {
    is: false,
    then: yup.string().required(),
    otherwise: yup.string(),
  }),
});

type ScheduleInput = yup.InferType<typeof scheduleSchema>;
type AvailabilityInput = yup.InferType<typeof availabilitySchema>;

async function handleRequest(
  req: NextApiRequest,
  res: NextApiResponse,
  user: CustomUser,
  validatedData?: ScheduleInput | AvailabilityInput
) {
  const businessId = user.role === 'business' ? user.id : user.businessId;
  const staffId = req.query.staffId as string;

  if (!staffId) {
    throw new ApiError('VALIDATION_ERROR', 'Staff ID is required');
  }

  // Verify staff belongs to the business
  const staff = await prisma.staff.findFirst({
    where: {
      id: staffId,
      businessId,
    },
  });

  if (!staff) {
    throw new ApiError('NOT_FOUND', 'Staff member not found');
  }

  switch (req.method) {
    case 'GET': {
      const { searchParams } = new URL(req.url || '');
      const date = searchParams.get('date');

      if (date) {
        // Get availability for a specific date
        const availability = await prisma.staffAvailability.findFirst({
          where: {
            staffId,
            date: new Date(date),
          },
        });

        const schedule = await prisma.schedule.findFirst({
          where: {
            staffId,
            dayOfWeek: new Date(date).getDay(),
          },
        });

        return {
          regular: schedule,
          exception: availability,
        };
      }

      // Get all schedules and upcoming availability exceptions
      const [schedules, exceptions] = await Promise.all([
        prisma.schedule.findMany({
          where: { staffId },
          orderBy: { dayOfWeek: 'asc' },
        }),
        prisma.staffAvailability.findMany({
          where: {
            staffId,
            date: {
              gte: new Date(),
            },
          },
          orderBy: { date: 'asc' },
        }),
      ]);

      return {
        schedules,
        exceptions,
      };
    }

    case 'POST': {
      const { searchParams } = new URL(req.url || '');
      const type = searchParams.get('type');

      if (type === 'schedule') {
        const scheduleData = validatedData as ScheduleInput;
        
        // Check for existing schedule
        const existingSchedule = await prisma.schedule.findFirst({
          where: {
            staffId,
            dayOfWeek: scheduleData.dayOfWeek,
          },
        });

        if (existingSchedule) {
          // Update existing schedule
          const schedule = await prisma.schedule.update({
            where: { id: existingSchedule.id },
            data: {
              startTime: scheduleData.startTime,
              endTime: scheduleData.endTime,
              lastModifiedBy: user.id,
            },
          });
          return schedule;
        }

        // Create new schedule
        const schedule = await prisma.schedule.create({
          data: {
            ...scheduleData,
            staffId,
            createdBy: user.id,
            lastModifiedBy: user.id,
          },
        });
        return schedule;
      }

      if (type === 'availability') {
        const availabilityData = validatedData as AvailabilityInput;
        
        // Check for existing availability exception
        const existingAvailability = await prisma.staffAvailability.findFirst({
          where: {
            staffId,
            date: availabilityData.date,
          },
        });

        if (existingAvailability) {
          // Update existing availability
          const availability = await prisma.staffAvailability.update({
            where: { id: existingAvailability.id },
            data: {
              isAvailable: availabilityData.isAvailable,
              reason: availabilityData.reason,
              lastModifiedBy: user.id,
            },
          });
          return availability;
        }

        // Create new availability exception
        const availability = await prisma.staffAvailability.create({
          data: {
            ...availabilityData,
            staffId,
            createdBy: user.id,
            lastModifiedBy: user.id,
          },
        });
        return availability;
      }

      throw new ApiError('VALIDATION_ERROR', 'Invalid availability type');
    }

    case 'DELETE': {
      const { searchParams } = new URL(req.url || '');
      const type = searchParams.get('type');
      const id = searchParams.get('id');

      if (!type || !id) {
        throw new ApiError('VALIDATION_ERROR', 'Type and ID are required');
      }

      if (type === 'schedule') {
        await prisma.schedule.delete({
          where: { id },
        });
      } else if (type === 'availability') {
        await prisma.staffAvailability.delete({
          where: { id },
        });
      } else {
        throw new ApiError('VALIDATION_ERROR', 'Invalid type');
      }

      return { success: true };
    }

    default:
      throw new ApiError('METHOD_NOT_ALLOWED', 'Method not allowed', 405);
  }
}

// Create handlers for different HTTP methods
const getHandler = createApiHandler(handleRequest, {
  requiredRole: 'staff',
  requiredPermissions: ['view_staff_availability'],
});

const postHandler = createApiHandler(handleRequest, {
  requiredRole: 'staff',
  requiredPermissions: ['manage_staff_availability'],
}, scheduleSchema);

const deleteHandler = createApiHandler(handleRequest, {
  requiredRole: 'staff',
  requiredPermissions: ['manage_staff_availability'],
});

export { getHandler as GET, postHandler as POST, deleteHandler as DELETE }; 