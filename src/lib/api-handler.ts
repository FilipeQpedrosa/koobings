import { NextApiRequest, NextApiResponse } from 'next';
import { CustomUser } from './auth';
import { withAuth, withErrorHandler, withMethodCheck, withValidation, withRateLimit } from './middleware';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import * as yup from 'yup';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    hasMore?: boolean;
  };
}

export interface ApiConfig {
  requiredRole?: 'staff' | 'business';
  requiredPermissions?: string[];
  rateLimit?: {
    limit: number;
    windowMs: number;
  };
}

export class ApiError extends Error {
  constructor(
    public code: string,
    message: string,
    public statusCode: number = 400,
    public details?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Helper function to add audit fields to data
function addAuditFields(data: any, user: CustomUser, isUpdate: boolean = false): any {
  const auditData = { ...data };
  
  if (!isUpdate) {
    // For create operations
    auditData.createdBy = user.id;
    auditData.lastModifiedBy = user.id;
  } else {
    // For update operations
    auditData.lastModifiedBy = user.id;
  }
  
  return auditData;
}

export function createApiHandler<T = any, S = any>(
  handler: (
    req: NextApiRequest,
    res: NextApiResponse,
    user: CustomUser,
    validatedData?: S
  ) => Promise<T>,
  config: ApiConfig = {},
  schema?: yup.AnyObjectSchema
) {
  const wrappedHandler = async (req: NextApiRequest, res: NextApiResponse, user: CustomUser) => {
    try {
      let result: T;
      let validatedData: S | undefined;

      if (schema) {
        validatedData = await schema.validate(req.body);
        
        // Add audit fields based on the request method
        if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
          validatedData = addAuditFields(validatedData, user, req.method !== 'POST') as S;
        }
      }

      result = await handler(req, res, user, validatedData);

      const response: ApiResponse<T> = {
        success: true,
        data: result
      };

      return res.json(response);
    } catch (error) {
      console.error('API Error:', error);

      let apiError: ApiResponse['error'];

      if (error instanceof ApiError) {
        apiError = {
          code: error.code,
          message: error.message,
          details: error.details
        };
        res.status(error.statusCode);
      } else if (error instanceof PrismaClientKnownRequestError) {
        apiError = {
          code: `PRISMA_${error.code}`,
          message: 'Database operation failed',
          details: error.meta
        };
        res.status(400);
      } else if (error instanceof yup.ValidationError) {
        apiError = {
          code: 'VALIDATION_ERROR',
          message: 'Invalid input data',
          details: error.errors
        };
        res.status(400);
      } else {
        apiError = {
          code: 'INTERNAL_ERROR',
          message: 'An unexpected error occurred'
        };
        res.status(500);
      }

      return res.json({
        success: false,
        error: apiError
      });
    }
  };

  // Apply middleware in the correct order
  let handlerWithMiddleware = wrappedHandler;

  // Add validation if schema is provided
  if (schema) {
    handlerWithMiddleware = withValidation(schema, handlerWithMiddleware);
  }

  // Add rate limiting if configured
  if (config.rateLimit) {
    handlerWithMiddleware = withRateLimit(
      handlerWithMiddleware,
      config.rateLimit.limit,
      config.rateLimit.windowMs
    );
  }

  // Add method checking
  handlerWithMiddleware = withMethodCheck(['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], handlerWithMiddleware);

  // Add error handling
  handlerWithMiddleware = withErrorHandler(handlerWithMiddleware);

  // Add authentication and authorization
  return withAuth(handlerWithMiddleware, {
    requiredRole: config.requiredRole,
    requiredPermissions: config.requiredPermissions
  });
}

export function createPaginatedResponse<T>(
  data: T[],
  page: number,
  limit: number,
  total: number
): ApiResponse<T[]> {
  return {
    success: true,
    data,
    meta: {
      page,
      limit,
      total,
      hasMore: page * limit < total
    }
  };
}

export function handlePrismaError(error: PrismaClientKnownRequestError): never {
  switch (error.code) {
    case 'P2002':
      throw new ApiError('DUPLICATE_ENTRY', 'A record with this value already exists', 400, error.meta);
    case 'P2025':
      throw new ApiError('NOT_FOUND', 'Record not found', 404);
    case 'P2003':
      throw new ApiError('FOREIGN_KEY_VIOLATION', 'Invalid reference to another record', 400);
    default:
      throw new ApiError('DATABASE_ERROR', 'Database operation failed', 500, {
        code: error.code,
        meta: error.meta
      });
  }
} 