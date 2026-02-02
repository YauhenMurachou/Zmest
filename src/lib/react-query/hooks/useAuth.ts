import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { authApi, RegisterParams, LoginParams } from 'src/api/authApi';
import { queryKeys } from 'src/lib/react-query/queryKeys';

/**
 * Get current authenticated user
 * GET /api/auth/me
 */
export const useAuth = () =>
  useQuery({
    queryKey: queryKeys.auth.me,
    queryFn: async () => {
      const user = await authApi.getCurrentUser();
      return user;
    },
    retry: false,
    enabled: !!localStorage.getItem('token'), // Only fetch if token exists
  });

/**
 * Register mutation
 * POST /api/auth/register
 */
export const useRegister = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: RegisterParams) => {
      const data = await authApi.register(params);
      return data;
    },
    onSuccess: () => {
      // Invalidate and refetch auth data after successful registration
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.me });
    },
  });
};

/**
 * Login mutation
 * POST /api/auth/login
 * Response: { resultCode: 0, messages: [], data: { userId: number } }
 * Note: Token is extracted from response headers by interceptor
 */
export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: LoginParams) => {
      const data = await authApi.login(params);
      return data;
    },
    onSuccess: () => {
      // Invalidate and refetch auth data after successful login
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.me });
    },
  });
};

/**
 * Logout mutation
 * POST /api/auth/logout
 * Requires: Authentication
 * Clears token from localStorage and calls backend logout
 */
export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await authApi.logout();
    },
    onSuccess: () => {
      // Clear all queries on logout
      queryClient.clear();
    },
  });
};
