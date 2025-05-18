export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: ApiError;
  metadata?: ApiMetadata;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
}

export interface ApiMetadata {
  page?: number;
  limit?: number;
  total?: number;
  timestamp?: string;
}

export class ApiError extends Error {
  constructor(
    public code: string,
    message: string,
    public statusCode: number = 500,
    public details?: Record<string, any>
  ) {
    super(message);
    this.name = 'ApiError';
  }

  static BadRequest(message: string, details?: Record<string, any>) {
    return new ApiError('BAD_REQUEST', message, 400, details);
  }

  static Unauthorized(message: string = 'Unauthorized') {
    return new ApiError('UNAUTHORIZED', message, 401);
  }

  static Forbidden(message: string = 'Forbidden') {
    return new ApiError('FORBIDDEN', message, 403);
  }

  static NotFound(message: string = 'Resource not found') {
    return new ApiError('NOT_FOUND', message, 404);
  }

  static ValidationError(details: Record<string, any>) {
    return new ApiError('VALIDATION_ERROR', 'Validation failed', 422, details);
  }

  static InternalError(message: string = 'Internal server error') {
    return new ApiError('INTERNAL_ERROR', message, 500);
  }
}

export function createApiResponse<T>(
  data?: T,
  metadata?: ApiMetadata
): ApiResponse<T> {
  return {
    success: true,
    data,
    metadata: {
      ...metadata,
      timestamp: new Date().toISOString(),
    },
  };
}

export function createErrorResponse(
  error: ApiError | Error
): ApiResponse {
  if (error instanceof ApiError) {
    return {
      success: false,
      error: {
        code: error.code,
        message: error.message,
        details: error.details,
      },
      metadata: {
        timestamp: new Date().toISOString(),
      },
    };
  }

  // Handle unknown errors
  return {
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: 'An unexpected error occurred',
    },
    metadata: {
      timestamp: new Date().toISOString(),
    },
  };
} 