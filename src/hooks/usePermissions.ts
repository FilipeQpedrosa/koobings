import { useAuth } from './useAuth';
import { hasPermission, type Permission, type Role } from '@/lib/permissions';

export function usePermissions() {
  const { user } = useAuth();
  const userRole = (user?.role as Role) || 'PROVIDER';

  const can = (permission: Permission) => {
    return hasPermission(userRole, permission);
  };

  return {
    role: userRole,
    can,
    isAdmin: userRole === 'ADMIN',
    isProvider: userRole === 'PROVIDER',
    isReceptionist: userRole === 'RECEPTIONIST'
  };
} 