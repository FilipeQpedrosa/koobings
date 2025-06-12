import { Service, ServiceCategory } from '@prisma/client';

export interface ApiResponse<T> {
  data: T;
  error?: never;
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
        code: error.code,
        message: error.message
      }),
      { status: error.statusCode }
    );
  }

  return new Response(
    JSON.stringify({
      code: 'INTERNAL_ERROR',
      message: 'Internal Server Error'
    }),
    { status: 500 }
  );
}
