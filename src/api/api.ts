import axios, { AxiosError } from 'axios';

// Backend API base URL - update this to match your deployed backend
const BACKEND_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';
export enum ResultCodeEnum {
  Success = 0,
  Error = 1,
}

export const instance = axios.create({
  withCredentials: true,
  baseURL: 'https://social-network.samuraijs.com/api/1.0/',
  headers: { 'API-KEY': 'dfa9082f-57f9-4359-8c49-339d0a7e601b3' },
});

export const instance2 = axios.create({
  baseURL: `${BACKEND_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add JWT token to requests for new backend (instance2)
instance2.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle errors for new backend (instance2)
instance2.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Types for backend responses
export type ApiError = {
  message: string;
  error?: string;
};

export type AuthResponse = {
  user: {
    id: number;
    email: string;
    username: string;
    createdAt?: string;
    updatedAt?: string;
  };
  token: string;
};

export type User = {
  id: number;
  email: string;
  username: string;
  createdAt?: string;
  updatedAt?: string;
};

export type Post = {
  id: number;
  title: string;
  content: string;
  authorId: number;
  author?: User;
  createdAt?: string;
  updatedAt?: string;
};

export type PostsResponse = {
  posts: Post[];
  total?: number;
};
