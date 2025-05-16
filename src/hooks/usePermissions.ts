import { useSession } from 'next-auth/react';
import { hasPermission, type Permission, type Role } from '@/lib/permissions';

export function usePermissions() {
  const { data: session } = useSession();
  const userRole = (session?.user?.role as Role) || 'PROVIDER';

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