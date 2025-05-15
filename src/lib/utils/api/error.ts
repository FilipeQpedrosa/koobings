import { Service, ServiceCategory } from '@prisma/client';

export interface ApiResponse<T> {
  data: T;
  error?: never;
}

export interface ApiError {
  error: string;
  code: string;
  data?: never;
}

export type ApiResult<T> = ApiResponse<T> | ApiError;

export interface ServiceResponse extends Service {
  category: ServiceCategory | null;
}

export interface CategoryResponse extends ServiceCategory {
  _count: {
    services: number;
  };
}

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export function handleApiError(error: unknown) {
  console.error('API Error:', error);

  if (error instanceof ApiError) {
    return new Response(
      JSON.stringify({
        error: error.message,
        code: error.code
      }),
      { status: error.statusCode }
    );
  }

  return new Response(
    JSON.stringify({
      error: 'Internal Server Error',
      code: 'INTERNAL_ERROR'
    }),
    { status: 500 }
  );
}
