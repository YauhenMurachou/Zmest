import { AxiosResponse } from 'axios';

import {
  ApiResponse,
  CurrentUserData,
  LoginResponseData,
  RegisterResponseData,
  ResultCodeEnum,
  User,
  api,
} from 'src/api/api';

const TOKEN_KEY = 'token';

const saveTokenFromResponse = (response: AxiosResponse): void => {
  // 1. Prefer token in response body (avoids CORS header exposure)
  const bodyToken = response.data?.data?.token;
  if (bodyToken && typeof bodyToken === 'string') {
    localStorage.setItem(TOKEN_KEY, bodyToken);
    return;
  }

  // 2. Fallback: token in Authorization or X-Auth-Token header
  const authHeader =
    response.headers?.['authorization'] ?? response.headers?.['Authorization'];
  const headerToken = authHeader;
  if (headerToken && typeof headerToken === 'string') {
    const token = headerToken.startsWith('Bearer ')
      ? headerToken.slice(7)
      : headerToken;
    localStorage.setItem(TOKEN_KEY, token);
  }
};

export type RegisterParams = {
  email: string;
  username: string;
  password: string;
};

export type LoginParams = {
  email: string;
  password: string;
  rememberMe?: boolean;
};

export const authApi = {
  /**
   * Register a new user
   * POST /api/auth/register
   * Response: { resultCode: 0, messages: [], data: { user: {...}, token? } }
   * Token is saved from body or header for subsequent /auth/me requests.
   */
  async register(params: RegisterParams): Promise<RegisterResponseData> {
    const response = await api.post<ApiResponse<RegisterResponseData>>(
      '/auth/register',
      params
    );

    if (response.data.resultCode !== ResultCodeEnum.Success) {
      const errorMessage = response.data.messages?.[0] || 'Registration failed';
      throw new Error(errorMessage);
    }

    saveTokenFromResponse(response);
    return response.data.data;
  },

  /**
   * Login user
   * POST /api/auth/login
   * Response: { resultCode: 0, messages: [], data: { userId, token? } }
   * Token is saved from body or Authorization header for subsequent /auth/me requests.
   */
  async login(params: LoginParams): Promise<LoginResponseData> {
    const response = await api.post<ApiResponse<LoginResponseData>>(
      '/auth/login',
      params
    );

    console.log('respose,data', response.data);

    if (response.data.resultCode !== ResultCodeEnum.Success) {
      const errorMessage = response.data.messages?.[0] || 'Login failed';
      throw new Error(errorMessage);
    }

    saveTokenFromResponse(response);
    return response.data.data;
  },

  /**
   * Logout user
   * POST /api/auth/logout
   * Requires: Authorization header with JWT token
   */
  async logout(): Promise<void> {
    try {
      await api.post<ApiResponse<Record<string, never>>>('/auth/logout');
    } catch (error) {
      // Even if logout fails on server, clear token locally
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
    }
  },

  /**
   * Get current authenticated user
   * GET /api/auth/me
   * Requires: Authorization header with JWT token
   * Response: { resultCode: 0, messages: [], data: { id, email, login } }
   */
  async getCurrentUser(): Promise<User> {
    const response = await api.get<ApiResponse<CurrentUserData>>('/auth/me');

    if (response.data.resultCode !== ResultCodeEnum.Success) {
      const errorMessage = response.data.messages?.[0] || 'Failed to get user';
      throw new Error(errorMessage);
    }

    const userData = response.data.data;
    return {
      id: userData.id,
      name: userData.login,
      email: userData.email,
      username: userData.login,
      login: userData.login,
      photos: {
        small: null,
        large: null,
      },
      followed: false,
    };
  },
};
