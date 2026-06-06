import axios, { AxiosError } from 'axios';

// Backend API base URL
// In development, use relative path to leverage proxy (avoids CORS)
// In production, use full URL
const BACKEND_URL =
  process.env.NODE_ENV === 'development'
    ? '' // Use relative path in development (proxy will handle it)
    : process.env.REACT_APP_API_URL || 'http://localhost:3000';

export enum ResultCodeEnum {
  Success = 0,
  Error = 1,
}

export const api = axios.create({
  baseURL: BACKEND_URL ? `${BACKEND_URL}/api` : '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor to add JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (process.env.NODE_ENV === 'development') {
      console.log('API Request:', {
        method: config.method?.toUpperCase(),
        url: config.url,
        baseURL: config.baseURL,
      });
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle errors and extract tokens
api.interceptors.response.use(
  (response) => {
    const authHeader =
      response.headers['authorization'] || response.headers['Authorization'];
    const token = authHeader;

    if (token) {
      const cleanToken =
        typeof token === 'string' && token.startsWith('Bearer ')
          ? token.substring(7)
          : token;
      if (typeof cleanToken === 'string') {
        localStorage.setItem('token', cleanToken);
      }
    }
    return response;
  },
  (error: AxiosError) => {
    if (process.env.NODE_ENV === 'development') {
      console.error('API Error:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        url: error.config?.url,
        data: error.response?.data,
      });
    }

    if (error.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('token');
      const currentPath = window.location.pathname;
      if (currentPath !== '/login') {
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

console.log(
  'Backend API URL configured:',
  BACKEND_URL ? `${BACKEND_URL}/api` : '/api (using proxy)'
);

// Operation Result Object format - all backend responses follow this structure
export type ApiResponse<T> = {
  resultCode: ResultCodeEnum;
  messages: string[];
  data: T;
};

// Types for backend responses
export type ApiError = {
  message: string;
  error?: string;
};

// Auth Types
export type RegisterRequestData = {
  email: string;
  username: string;
  password: string;
};

export type RegisterResponseData = {
  user: {
    id: number;
    email: string;
    username: string;
    createdAt?: string;
    updatedAt?: string;
  };
};

export type LoginRequestData = {
  email: string;
  password: string;
  rememberMe?: boolean;
};

export type LoginResponseData = {
  userId: number;
  token?: string;
};

export type CurrentUserData = {
  id: number;
  email: string;
  login: string;
};

// User Types
export type User = {
  id: number;
  name: string;
  status?: string;
  photos: {
    small: string | null;
    large: string | null;
  };
  followed: boolean;
  email?: string;
  username?: string;
  login?: string;
};

export type UsersResponse = {
  items: User[];
  totalCount: number;
  error: string | null;
};

// Profile Types
export type ProfileContacts = {
  facebook: string | null;
  github: string | null;
  instagram: string | null;
  mainLink: string | null;
  twitter: string | null;
  vk: string | null;
  website: string | null;
  youtube: string | null;
};

export type Profile = {
  aboutMe: string;
  contacts: ProfileContacts;
  lookingForAJob: boolean;
  lookingForAJobDescription: string;
  fullName: string;
  userId: number;
  photos: {
    small: string | null;
    large: string | null;
  };
};

export type UpdateProfileRequestData = {
  aboutMe?: string;
  contacts?: ProfileContacts;
  lookingForAJob?: boolean;
  lookingForAJobDescription?: string;
  fullName?: string;
};

// Post Types
export type Post = {
  id: number;
  title: string;
  content: string;
  authorId: number;
  author?: User;
  createdAt?: string;
  updatedAt?: string;
};

export type CreatePostRequestData = {
  title: string;
  content: string;
};

export type UpdatePostRequestData = {
  title?: string;
  content?: string;
};

export type PostsResponseData = {
  posts: Post[];
  limit?: number;
  offset?: number;
};

export type PostResponseData = {
  post: Post;
};

// Dialog Types
export type Dialog = {
  id: number;
  userId: number;
  userName: string;
  lastMessage: string;
  lastMessageAddedAt: string;
  newMessages: number;
  photos: {
    small: string | null;
    large: string | null;
  };
};

export type DialogsResponseData = {
  items: Dialog[];
  totalCount: number;
};

export type Message = {
  id: number;
  body: string;
  senderId: number;
  recipientId: number;
  addedAt: string;
  viewed: boolean;
  spam: boolean;
  deletedBy: boolean;
};

export type MessagesResponseData = {
  items: Message[];
  totalCount: number;
};

export type SendMessageRequestData = {
  body: string;
};

export type MessageViewedStatus = {
  messageId: number;
  viewed: boolean;
};

export type NewMessagesCount = {
  userId: number;
  newMessages: number;
};

export type NewMessagesCountResponseData = {
  items: NewMessagesCount[];
};

// Captcha Type
export type CaptchaResponseData = {
  url: string;
};

// ==================== API Functions ====================

// Auth API
export const authAPI = {
  register: (data: RegisterRequestData) =>
    api.post<ApiResponse<RegisterResponseData>>('/auth/register', data),

  login: (data: LoginRequestData) =>
    api.post<ApiResponse<LoginResponseData>>('/auth/login', data),

  logout: () => api.post<ApiResponse<{}>>('/auth/logout'),

  me: () => api.get<ApiResponse<CurrentUserData>>('/auth/me'),
};

// Users API
export const usersAPI = {
  getUsers: (page = 1, count = 10, term = '') =>
    api.get<UsersResponse>(`/users?page=${page}&count=${count}&term=${term}`),
};

// Profile API
export const profileAPI = {
  getProfile: (userId: number) => api.get<Profile>(`/profile/${userId}`),

  getStatus: (userId: number) => api.get<string>(`/profile/status/${userId}`),

  updateStatus: (status: string) =>
    api.put<ApiResponse<{}>>('/profile/status', { status }),

  updateProfile: (data: UpdateProfileRequestData) =>
    api.put<ApiResponse<{}>>('/profile', data),
};

// Follow API
export const followAPI = {
  checkFollow: (userId: number) => api.get<boolean>(`/follow/${userId}`),

  follow: (userId: number) => api.post<ApiResponse<{}>>(`/follow/${userId}`),

  unfollow: (userId: number) =>
    api.delete<ApiResponse<{}>>(`/follow/${userId}`),
};

// Posts API
export const postsAPI = {
  createPost: (data: CreatePostRequestData) =>
    api.post<ApiResponse<PostResponseData>>('/posts', data),

  getAllPosts: (limit?: number, offset?: number) =>
    api.get<ApiResponse<PostsResponseData>>('/posts', {
      params: { limit, offset },
    }),

  getPostById: (postId: number) =>
    api.get<ApiResponse<PostResponseData>>(`/posts/${postId}`),

  getPostsByAuthor: (authorId: number, limit?: number, offset?: number) =>
    api.get<ApiResponse<PostsResponseData>>(`/posts/author/${authorId}`, {
      params: { limit, offset },
    }),

  updatePost: (postId: number, data: UpdatePostRequestData) =>
    api.put<ApiResponse<PostResponseData>>(`/posts/${postId}`, data),

  deletePost: (postId: number) =>
    api.delete<ApiResponse<{}>>(`/posts/${postId}`),
};

// Security API
export const securityAPI = {
  getCaptchaUrl: () =>
    api.get<ApiResponse<CaptchaResponseData>>('/security/get-captcha-url'),
};

// Dialogs API
export const dialogsAPI = {
  startDialog: (userId: number) =>
    api.put<ApiResponse<{ id: number; userId: number }>>(`/dialogs/${userId}`),

  getAllDialogs: () => api.get<ApiResponse<DialogsResponseData>>('/dialogs'),

  getMessages: (userId: number, page = 1, count = 10) =>
    api.get<ApiResponse<MessagesResponseData>>(`/dialogs/${userId}/messages`, {
      params: { page, count },
    }),

  sendMessage: (userId: number, data: SendMessageRequestData) =>
    api.post<ApiResponse<Message>>(`/dialogs/${userId}/messages`, data),

  getMessageViewedStatus: (messageId: number) =>
    api.get<ApiResponse<MessageViewedStatus>>(
      `/dialogs/messages/${messageId}/viewed`
    ),

  markAsSpam: (messageId: number) =>
    api.post<ApiResponse<{}>>(`/dialogs/messages/${messageId}/spam`),

  deleteMessage: (messageId: number) =>
    api.delete<ApiResponse<{}>>(`/dialogs/messages/${messageId}`),

  restoreMessage: (messageId: number) =>
    api.put<ApiResponse<{}>>(`/dialogs/messages/${messageId}/restore`),

  getNewMessages: (userId: number, newerThen: string) =>
    api.get<ApiResponse<MessagesResponseData>>(
      `/dialogs/${userId}/messages/new`,
      {
        params: { newerThen },
      }
    ),

  getNewMessagesCount: () =>
    api.get<ApiResponse<NewMessagesCountResponseData>>(
      '/dialogs/messages/new/count'
    ),
};
