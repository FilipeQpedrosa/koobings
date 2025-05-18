export type UserRole = 'CUSTOMER' | 'BUSINESS_OWNER' | 'STAFF';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  businessId?: string;
}

export interface DashboardSession {
  user: User;
  expires: string;
}

export interface BusinessOwnerDashboardData {
  totalAppointments: number;
  totalRevenue: number;
  totalCustomers: number;
  recentActivity: Array<{
    id: string;
    type: 'appointment' | 'review' | 'payment';
    description: string;
    timestamp: string;
  }>;
}

export interface StaffDashboardData {
  totalAppointments: number;
  completedServices: number;
  upcomingAppointments: number;
  appointments: Array<{
    id: string;
    customerName: string;
    serviceName: string;
    dateTime: string;
    status: 'scheduled' | 'completed' | 'cancelled';
  }>;
}

export interface DashboardMetrics {
  appointments: {
    total: number;
    completed: number;
    upcoming: number;
    cancelled: number;
  };
  revenue: {
    total: number;
    thisMonth: number;
    lastMonth: number;
  };
  customers: {
    total: number;
    new: number;
    returning: number;
  };
  staff: {
    total: number;
    active: number;
  };
} 