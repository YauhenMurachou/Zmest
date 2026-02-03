import axios, { AxiosError } from 'axios';

// Backend API base URL - update this to match your deployed backend
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

export const instance = axios.create({
  withCredentials: true,
  baseURL: 'https://social-network.samuraijs.com/api/1.0/',
  headers: { 'API-KEY': 'dfa9082f-57f9-4359-8c49-339d0a7e601b3' },
});

export const instance2 = axios.create({
  baseURL: BACKEND_URL ? `${BACKEND_URL}/api` : '/api', // Use relative path in dev (proxy), full URL in prod
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Enable cookies if backend uses them for JWT
});

// Log the configured backend URL for debugging
const apiBaseUrl = `${BACKEND_URL}/api`.replace(/\/\/api$/, '/api'); // Handle empty BACKEND_URL case
console.log('Backend API URL configured:', apiBaseUrl || '/api (using proxy)');

// Request interceptor to add JWT token to requests for new backend (instance2)
instance2.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Log request URL for debugging
    if (process.env.NODE_ENV === 'development') {
      console.log('API Request:', {
        method: config.method?.toUpperCase(),
        url: `${config.baseURL}${config.url}`,
        fullUrl: config.url,
        baseURL: config.baseURL,
      });
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle errors and extract tokens for new backend (instance2)
instance2.interceptors.response.use(
  (response) => {
    // Extract JWT token from response headers if present
    // Backend may send token in Authorization header or custom header
    const authHeader = response.headers['authorization'] || response.headers['Authorization'];
    const customHeader = response.headers['x-auth-token'] || response.headers['X-Auth-Token'];
    const token = authHeader || customHeader;

    if (token) {
      // Remove 'Bearer ' prefix if present
      const cleanToken = typeof token === 'string' && token.startsWith('Bearer ')
        ? token.substring(7)
        : token;
      if (typeof cleanToken === 'string') {
        localStorage.setItem('token', cleanToken);
      }
    }
    // Note: If backend uses cookies only, token will be automatically sent with requests
    // via withCredentials: true, and we don't need to store it in localStorage

    return response;
  },
  (error: AxiosError) => {
    // Log error details for debugging
    if (process.env.NODE_ENV === 'development') {
      console.error('API Error:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        url: error.config?.url,
        baseURL: error.config?.baseURL,
        fullUrl: `${error.config?.baseURL}${error.config?.url}`,
        data: error.response?.data,
      });
    }
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
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

// Register response data
export type RegisterResponseData = {
  user: {
    id: number;
    email: string;
    username: string;
    createdAt?: string;
    updatedAt?: string;
  };
};

// Login response data
export type LoginResponseData = {
  userId: number;
};

// Get current user response data (note: uses "login" not "username")
export type CurrentUserData = {
  id: number;
  email: string;
  login: string; // Backend returns "login" not "username"
};

export type User = {
  id: number;
  email: string;
  username?: string; // For compatibility
  login?: string; // From backend
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

// Posts response data
export type PostsResponseData = {
  posts: Post[];
  total?: number;
};
