import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { CustomUser } from '@/lib/auth';
import { createApiHandler, ApiError, createPaginatedResponse } from '@/lib/api-handler';
import * as yup from 'yup';

const categorySchema = yup.object({
  name: yup.string().required(),
  description: yup.string(),
  color: yup.string()
});

type CategoryInput = yup.InferType<typeof categorySchema>;

async function handleRequest(
  req: NextApiRequest,
  res: NextApiResponse,
  user: CustomUser,
  validatedData?: CategoryInput
) {
  const businessId = user.role === 'business' ? user.id : user.businessId!;

  switch (req.method) {
    case 'GET': {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const skip = (page - 1) * limit;

      const [categories, total] = await Promise.all([
        prisma.serviceCategory.findMany({
          where: { 
            businessId,
            isDeleted: false 
          },
          include: { services: true },
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' }
        }),
        prisma.serviceCategory.count({
          where: { 
            businessId,
            isDeleted: false 
          }
        })
      ]);

      return createPaginatedResponse(categories, page, limit, total);
    }

    case 'POST': {
      if (!validatedData) {
        throw new ApiError('VALIDATION_ERROR', 'Invalid category data');
      }

      const category = await prisma.serviceCategory.create({
        data: {
          ...validatedData,
          businessId,
          // Audit fields are automatically added by the API handler
        },
        include: {
          services: true
        }
      });

      return category;
    }

    case 'PUT': {
      if (!validatedData) {
        throw new ApiError('VALIDATION_ERROR', 'Invalid category data');
      }

      const categoryId = req.query.id as string;
      if (!categoryId) {
        throw new ApiError('VALIDATION_ERROR', 'Category ID is required');
      }

      // Check if category exists and belongs to the business
      const existingCategory = await prisma.serviceCategory.findFirst({
        where: {
          id: categoryId,
          businessId,
          isDeleted: false
        }
      });

      if (!existingCategory) {
        throw new ApiError('NOT_FOUND', 'Category not found', 404);
      }

      const category = await prisma.serviceCategory.update({
        where: { id: categoryId },
        data: {
          ...validatedData,
          // Audit fields are automatically added by the API handler
        },
        include: {
          services: true
        }
      });

      return category;
    }

    case 'DELETE': {
      const categoryId = req.query.id as string;
      if (!categoryId) {
        throw new ApiError('VALIDATION_ERROR', 'Category ID is required');
      }

      // Check if category exists and belongs to the business
      const existingCategory = await prisma.serviceCategory.findFirst({
        where: {
          id: categoryId,
          businessId,
          isDeleted: false
        }
      });

      if (!existingCategory) {
        throw new ApiError('NOT_FOUND', 'Category not found', 404);
      }

      // Soft delete the category
      await prisma.serviceCategory.update({
        where: { id: categoryId },
        data: { 
          isDeleted: true,
          lastModifiedBy: user.id // Add audit field for deletion
        }
      });

      return { success: true };
    }

    default:
      throw new ApiError('METHOD_NOT_ALLOWED', 'Method not allowed', 405);
  }
}

const handler = createApiHandler(handleRequest, {
  requiredRole: 'business',
  requiredPermissions: ['manage_categories'],
  rateLimit: {
    limit: 100,
    windowMs: 60 * 1000 // 1 minute
  }
}, categorySchema);

export { handler as GET, handler as POST, handler as PUT, handler as DELETE };