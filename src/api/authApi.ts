import {
  instance2,
  ApiResponse,
  RegisterResponseData,
  LoginResponseData,
  CurrentUserData,
  User,
  ResultCodeEnum,
} from 'src/api/api';

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
   * Response: { resultCode: 0, messages: [], data: { user: {...} } }
   * Note: Token is extracted from response headers by interceptor
   */
  async register(params: RegisterParams): Promise<RegisterResponseData> {
    try {
      const response = await instance2.post<ApiResponse<RegisterResponseData>>(
        '/auth/register',
        params
      );
      if (response.data.resultCode !== ResultCodeEnum.Success) {
        throw new Error(response.data.messages[0] || 'Registration failed');
      }
      return response.data.data;
    } catch (error) {
      // Log the full error for debugging
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { status?: number; statusText?: string; data?: unknown; config?: { url?: string; baseURL?: string } } };
        console.error('Registration error:', {
          status: axiosError.response?.status,
          statusText: axiosError.response?.statusText,
          url: axiosError.response?.config?.url,
          baseURL: axiosError.response?.config?.baseURL,
          fullUrl: `${axiosError.response?.config?.baseURL}${axiosError.response?.config?.url}`,
          data: axiosError.response?.data,
        });
      }
      throw error;
    }
  },

  /**
   * Login user
   * POST /api/auth/login
   * Response: { resultCode: 0, messages: [], data: { userId: number } }
   * Note: Token is extracted from response headers by interceptor
   */
  async login(params: LoginParams): Promise<LoginResponseData> {
    const response = await instance2.post<ApiResponse<LoginResponseData>>(
      '/auth/login',
      params
    );
    if (response.data.resultCode !== ResultCodeEnum.Success) {
      throw new Error(response.data.messages[0] || 'Login failed');
    }
    return response.data.data;
  },

  /**
   * Logout user
   * POST /api/auth/logout
   * Requires: Authorization header with JWT token
   */
  async logout(): Promise<void> {
    try {
      await instance2.post<ApiResponse<Record<string, never>>>('/auth/logout');
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
    const response = await instance2.get<ApiResponse<CurrentUserData>>('/auth/me');
    if (response.data.resultCode !== ResultCodeEnum.Success) {
      throw new Error(response.data.messages[0] || 'Failed to get user');
    }
    // Convert backend format (login) to User format (username)
    const userData = response.data.data;
    return {
      id: userData.id,
      email: userData.email,
      username: userData.login, // Map login to username for compatibility
      login: userData.login,
    };
  },
};
