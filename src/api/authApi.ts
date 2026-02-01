import { instance, AuthResponse, User } from 'src/api/api';

export type RegisterParams = {
  email: string;
  username: string;
  password: string;
};

export type LoginParams = {
  email: string;
  password: string;
};

export const authApi = {
  /**
   * Register a new user
   * POST /api/auth/register
   */
  async register(params: RegisterParams): Promise<AuthResponse> {
    const response = await instance.post<AuthResponse>('/auth/register', params);
    // Store token on successful registration
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  },

  /**
   * Login user
   * POST /api/auth/login
   */
  async login(params: LoginParams): Promise<AuthResponse> {
    const response = await instance.post<AuthResponse>('/auth/login', params);
    // Store token on successful login
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  },

  /**
   * Get current authenticated user
   * GET /api/auth/me
   * Requires: Authorization header with JWT token
   */
  async getCurrentUser(): Promise<User> {
    const response = await instance.get<User>('/auth/me');
    return response.data;
  },

  /**
   * Logout user (clears token from localStorage)
   */
  logout(): void {
    localStorage.removeItem('token');
  },
};
