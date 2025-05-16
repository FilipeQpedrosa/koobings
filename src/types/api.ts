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
