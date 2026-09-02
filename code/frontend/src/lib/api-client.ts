import axios from 'axios';
import { useAuthStore } from '@/store/auth-store';
import { toast } from 'sonner';
import i18n from '@/lib/i18n';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT Bearer token to outgoing requests
apiClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().accessToken;
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Track recent toast error messages to prevent toast spamming
let lastToastMessage = '';
let lastToastTime = 0;

// Auto-refresh token on 401/403 Unauthorized with double-retry protection
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;

    // Handle 401 or 403 Token Expiry/Invalid Auth
    if (
      (status === 401 || (status === 403 && useAuthStore.getState().accessToken)) &&
      originalRequest &&
      !originalRequest._retry &&
      !originalRequest.url?.includes('/auth/login') &&
      !originalRequest.url?.includes('/auth/refresh')
    ) {
      originalRequest._retry = true;
      try {
        const refreshToken = useAuthStore.getState().refreshToken;
        if (!refreshToken) {
          useAuthStore.getState().clearAuth();
          return Promise.reject(error);
        }

        const res = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          refreshToken,
        });

        if (res.data?.data?.accessToken) {
          const newAccessToken = res.data.data.accessToken;
          useAuthStore.getState().setAccessToken(newAccessToken);
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        useAuthStore.getState().clearAuth();
        return Promise.reject(refreshError);
      }
    } else if (status !== 401 && typeof window !== 'undefined') {
      const isMutation = originalRequest?.method && originalRequest.method.toLowerCase() !== 'get';

      // Only trigger global floating toast notifications for user MUTATIONS (POST, PUT, DELETE, PATCH).
      // Background GET queries handle their own error states in components via React Query without popup toast noise.
      if (isMutation) {
        let msg = error.response?.data?.message;
        if (!msg) {
          const isNetworkError = !error.response;
          msg = isNetworkError ? i18n.t('error.networkError') : i18n.t('error.generic');
        }

        const now = Date.now();
        if (msg !== lastToastMessage || now - lastToastTime > 3000) {
          lastToastMessage = msg;
          lastToastTime = now;
          toast.error(msg);
        }
      }
    }
    return Promise.reject(error);
  }
);
