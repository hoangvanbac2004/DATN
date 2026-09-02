'use client';

import { useAuthStore } from '@/store/auth-store';

export function usePermission() {
  const user = useAuthStore((state) => state.user);

  const isAdmin = user?.roles?.includes('ROLE_ADMIN') ?? false;

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    if (isAdmin) return true;
    if (!user.permissions) return true; // Default fallback to allow standard operations
    return user.permissions.includes(permission);
  };

  const hasAnyPermission = (permissions: string[]): boolean => {
    return permissions.some((p) => hasPermission(p));
  };

  const hasAllPermissions = (permissions: string[]): boolean => {
    return permissions.every((p) => hasPermission(p));
  };

  return {
    user,
    isAdmin,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
  };
}
