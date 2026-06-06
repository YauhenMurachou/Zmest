import { api, followAPI, usersAPI } from 'src/api/api';

export const usersApi = {
  async getUsers(
    currentPage = 1,
    pageSize = 10,
    name?: string,
    followed?: boolean
  ) {
    if (followed) {
      const response = await api.get(
        `/users?page=${currentPage}&count=${pageSize}${
          name ? `&term=${name}` : ''
        }&followed=true`
      );
      return response.data;
    }
    // Use new users API - response is already UsersResponse format
    const response = await usersAPI.getUsers(currentPage, pageSize, name || '');
    return response.data;
  },

  async getFriends(currentPage = 1, pageSize = 10, name?: string) {
    return this.getUsers(currentPage, pageSize, name, true);
  },

  async followUsers(userId: number) {
    const response = await followAPI.follow(userId);
    return response.data;
  },

  async unFollowUsers(userId: number) {
    const response = await followAPI.unfollow(userId);
    return response.data;
  },

  async login(
    email: string | null,
    password: string | null,
    rememberMe: boolean | null,
    captcha: string | null
  ) {
    const response = await api.post('/auth/login', {
      email,
      password,
      rememberMe,
      captcha,
    });
    return response.data;
  },

  async logout() {
    const response = await api.post('/auth/logout');
    return response.data;
  },

  async getCaptchaUrl() {
    const response = await api.get('/security/get-captcha-url');
    return response.data;
  },

  async setLogin() {
    const response = await api.get('/auth/me');
    return response.data;
  },
};
