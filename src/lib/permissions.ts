export type Permission =
  | 'manage_staff'
  | 'manage_services'
  | 'manage_schedule'
  | 'view_reports'
  | 'manage_clients'
  | 'manage_appointments'
  | 'manage_settings'
  | 'view_dashboard';

export type Role = 'ADMIN' | 'PROVIDER' | 'RECEPTIONIST';

export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  ADMIN: [
    'manage_staff',
    'manage_services',
    'manage_schedule',
    'view_reports',
    'manage_clients',
    'manage_appointments',
    'manage_settings',
    'view_dashboard'
  ],
  PROVIDER: [
    'manage_schedule',
    'view_reports',
    'manage_appointments',
    'view_dashboard'
  ],
  RECEPTIONIST: [
    'manage_clients',
    'manage_appointments',
    'view_dashboard'
  ]
};

export function hasPermission(role: Role, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) || false;
}

export function getPermissionsForRole(role: Role): Permission[] {
  return ROLE_PERMISSIONS[role] || [];
}

export function getAllPermissions(): Permission[] {
  return Array.from(new Set(Object.values(ROLE_PERMISSIONS).flat()));
}

export function canAccessRoute(role: Role, route: string): boolean {
  const routePermissions: Record<string, Permission[]> = {
    '/dashboard/staff': ['manage_staff'],
    '/dashboard/services': ['manage_services'],
    '/dashboard/schedule': ['manage_schedule'],
    '/dashboard/reports': ['view_reports'],
    '/dashboard/clients': ['manage_clients'],
    '/dashboard/appointments': ['manage_appointments'],
    '/dashboard/settings': ['manage_settings']
  };

  const requiredPermissions = routePermissions[route];
  if (!requiredPermissions) return true; // Public route

  return requiredPermissions.some(permission => hasPermission(role, permission));
} 