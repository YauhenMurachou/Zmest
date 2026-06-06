import { api, profileAPI } from 'src/api/api';
import { EditProfileType } from 'src/types';

export const profileApi = {
  async getProfile(userId: number | null) {
    if (userId === null) {
      throw new Error('User ID is required');
    }
    const response = await profileAPI.getProfile(userId);
    return response.data;
  },

  async getStatus(userId: number) {
    const response = await profileAPI.getStatus(userId);
    return response.data;
  },

  async updateStatus(status: string) {
    const response = await profileAPI.updateStatus(status);
    return response.data;
  },

  async editProfileInfo(profile: EditProfileType) {
    const response = await profileAPI.updateProfile(profile);
    return response.data;
  },

  async sendPhoto(file: string | Blob) {
    const formData = new FormData();
    formData.append('image', file);
    const response = await api.put(`/profile/photo`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};
