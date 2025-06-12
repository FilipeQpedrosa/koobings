import { Service, ServiceCategory } from '@prisma/client';
import type { ApiErrorResponse } from '@/lib/utils/api/types';

export interface ApiResponse<T> {
  data: T;
  error?: never;
}

export type ApiResult<T> = ApiResponse<T> | ApiErrorResponse;

export interface ServiceResponse extends Service {
  category: ServiceCategory | null;
}

export interface CategoryResponse extends ServiceCategory {
  _count: {
    services: number;
  };
}
