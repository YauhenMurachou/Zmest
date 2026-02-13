import {
  ApiResponse,
  CurrentUserData,
  instance,
  instance2,
  legacyInstance,
} from 'src/api/api';

export const usersApi = {
  async getUsers(
    currentPage = 1,
    pageSize = 100,
    name?: string,
    friend?: boolean
  ) {
    if (friend) {
      return instance
        .get(
          `users?page=${currentPage}&count=${pageSize}${
            name ? `&term=${name}` : ''
          }&friend=true`
        )
        .then((r) => r.data);
    }
    const response = await legacyInstance.get<{
      items: Array<{
        id: number;
        name: string;
        status: string | null;
        photos: { small: string | null; large: string | null };
        followed: boolean;
      }>;
      totalCount: number;
      error: null;
    }>(
      `/users?page=${currentPage}&count=${pageSize}${
        name ? `&term=${name}` : ''
      }`
    );
    const data = response.data;
    return {
      items: data.items.map((u) => ({
        ...u,
        status: u.status ?? '',
        photos: {
          small: u.photos?.small ?? '',
          large: u.photos?.large ?? '',
        },
      })),
      totalCount: data.totalCount,
    };
  },

  async getFriends(currentPage = 1, pageSize = 100, name?: string) {
    return instance
      .get(
        `users?page=${currentPage}&count=${pageSize}${
          name ? `&term=${name}` : ''
        }&friend=true`
      )
      .then((r) => r.data);
  },

  async followUsers(userId: number) {
    const response = await legacyInstance.post<
      ApiResponse<Record<string, never>>
    >(`/follow/${userId}`);
    return response.data;
  },

  async unFollowUsers(userId: number) {
    const response = await legacyInstance.delete<
      ApiResponse<Record<string, never>>
    >(`/follow/${userId}`);
    return response.data;
  },

  // async setLogin() {
  //   const response = await instance.get(`auth/me`);
  //   return response.data;
  // },

  async login(
    email: string | null,
    password: string | null,
    rememberMe: boolean | null,
    captcha: string | null
  ) {
    const response = await instance.post(`auth/login`, {
      email,
      password,
      rememberMe,
      captcha,
    });
    return response.data;
  },

  async logout() {
    const response = await instance.delete(`auth/login`);
    return response.data;
  },

  async getCaptchaUrl() {
    const response = await legacyInstance.get<{ url: string }>(
      `/security/get-captcha-url`
    );
    return response.data;
  },

  /**
   * Get current authenticated user from the new backend
   * Replaces old https://social-network.samuraijs.com/api/1.0/auth/me request
   * GET /api/auth/me -> { resultCode, messages, data: { id, email, login } }
   */
  async setLogin() {
    const response = await instance2.get<ApiResponse<CurrentUserData>>(
      '/auth/me'
    );
    return response.data;
  },
};
