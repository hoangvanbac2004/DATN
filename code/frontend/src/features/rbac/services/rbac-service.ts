import { apiClient } from '@/lib/api-client';
import type { ApiResponse } from '@/features/auth/types';
import type { Role, Permission, UpdateRolePermissionsPayload } from '../types';

export const rbacService = {
  getAllRoles: async (): Promise<Role[]> => {
    const res = await apiClient.get<ApiResponse<Role[]>>('/roles');
    return res.data.data;
  },

  getAllPermissions: async (): Promise<Permission[]> => {
    const res = await apiClient.get<ApiResponse<Permission[]>>('/permissions');
    return res.data.data;
  },

  updateRolePermissions: async (
    roleId: string,
    data: UpdateRolePermissionsPayload
  ): Promise<Role> => {
    const res = await apiClient.put<ApiResponse<Role>>(`/roles/${roleId}/permissions`, data);
    return res.data.data;
  },
};
