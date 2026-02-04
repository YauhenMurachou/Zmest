import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { authApi, RegisterParams, LoginParams } from 'src/api/authApi';
import { queryKeys } from 'src/lib/react-query/queryKeys';

const TOKEN_STORAGE_KEY = 'token';

const hasToken = (): boolean => {
  if (typeof window === 'undefined') {
    return false;
  }
  return !!localStorage.getItem(TOKEN_STORAGE_KEY);
};

/**
 * Get current authenticated user
 * GET /api/auth/me
 * Only fetches if token exists in localStorage
 */
export const useAuth = () =>
  useQuery({
    queryKey: queryKeys.auth.me,
    queryFn: async () => await authApi.getCurrentUser(),
    retry: false,
    enabled: () => hasToken(),
  });

/**
 * Register mutation
 * POST /api/auth/register
 * Token is extracted from response headers by interceptor
 */
export const useRegister = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: RegisterParams) => await authApi.register(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.me });
    },
  });
};

/**
 * Login mutation
 * POST /api/auth/login
 * Response: { resultCode: 0, messages: [], data: { userId: number } }
 * Token is extracted from response headers by interceptor
 */
export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: LoginParams) => await authApi.login(params),
    onSuccess: () => {
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
      queryClient.clear();
    },
  });
};
