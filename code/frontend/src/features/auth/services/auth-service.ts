import { apiClient } from '@/lib/api-client';
import type {
  ApiResponse,
  AuthResponse,
  ChangePasswordInput,
  LoginInput,
  RegisterInput,
  UpdateProfileInput,
  UserDto,
} from '../types';

export const authService = {
  register: async (data: RegisterInput): Promise<AuthResponse> => {
    const res = await apiClient.post<ApiResponse<AuthResponse>>('/auth/register', data);
    return res.data.data;
  },

  login: async (data: LoginInput): Promise<AuthResponse> => {
    const res = await apiClient.post<ApiResponse<AuthResponse>>('/auth/login', data);
    return res.data.data;
  },

  refreshToken: async (refreshToken: string): Promise<AuthResponse> => {
    const res = await apiClient.post<ApiResponse<AuthResponse>>('/auth/refresh', { refreshToken });
    return res.data.data;
  },

  logout: async (): Promise<void> => {
    await apiClient.post<ApiResponse<void>>('/auth/logout');
  },

  getCurrentUser: async (): Promise<UserDto> => {
    const res = await apiClient.get<ApiResponse<UserDto>>('/users/me');
    return res.data.data;
  },

  updateProfile: async (data: UpdateProfileInput): Promise<UserDto> => {
    const res = await apiClient.put<ApiResponse<UserDto>>('/users/me', data);
    return res.data.data;
  },

  changePassword: async (data: ChangePasswordInput): Promise<void> => {
    await apiClient.put<ApiResponse<void>>('/users/me/password', data);
  },
};
