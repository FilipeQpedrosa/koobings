import { AdminActivity, SystemAdmin } from '@prisma/client';

export interface AdminActivityWithAdmin extends AdminActivity {
  admin: {
    name: string;
  };
}

export interface DashboardMetrics {
  totalBusinesses: number;
  activeBusinesses: number;
  pendingVerification: number;
  inReview: number;
  recentActivities: AdminActivityWithAdmin[];
} 