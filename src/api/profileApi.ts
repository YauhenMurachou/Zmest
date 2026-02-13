import { legacyInstance } from 'src/api/api';
import { EditProfileType } from 'src/types';

export const profileApi = {
  async getProfile(userId: number | null) {
    const response = await legacyInstance.get(`/profile/${userId}`);
    return response.data;
  },

  async getStatus(userId: number) {
    const response = await legacyInstance.get(`/profile/status/${userId}`);
    return response.data;
  },

  async updateStatus(status: string) {
    const response = await legacyInstance.put(`/profile/status`, {
      status,
    });
    return response.data;
  },

  async editProfileInfo(profile: EditProfileType) {
    const response = await legacyInstance.put(`/profile`, profile);
    return response.data;
  },

  async sendPhoto(file: string | Blob) {
    const formData = new FormData();
    formData.append('image', file);
    const response = await legacyInstance.put(`/profile/photo`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};
