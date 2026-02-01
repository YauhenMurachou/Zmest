# Backend Integration Guide

This project is now integrated with the new backend API from [be_zmest](https://github.com/YauhenMurachou/be_zmest).

## Backend API Overview

The backend is a RESTful API built with Node.js, Express, TypeScript, and PostgreSQL. It uses JWT (JSON Web Tokens) for authentication.

### Base URL Configuration

Update the backend URL in `.env` file:

```env
REACT_APP_API_URL=http://localhost:3000
```

Or for production:
```env
REACT_APP_API_URL=https://your-backend.railway.app
```

The API instance is configured in `src/api/api.ts` and automatically uses this environment variable.

## Authentication

The backend uses JWT tokens stored in `localStorage`. The token is automatically added to all API requests via an axios interceptor.

### Available Auth Endpoints

- **POST** `/api/auth/register` - Register a new user
- **POST** `/api/auth/login` - Login user
- **GET** `/api/auth/me` - Get current authenticated user

### Usage Example

```typescript
import { useAuth, useLogin, useRegister, useLogout } from 'src/lib/react-query/hooks';

// Register
const registerMutation = useRegister();
registerMutation.mutate({
  email: 'user@example.com',
  username: 'johndoe',
  password: 'password123',
});

// Login
const loginMutation = useLogin();
loginMutation.mutate({
  email: 'user@example.com',
  password: 'password123',
});

// Get current user
const { data: user, isLoading } = useAuth();

// Logout
const logoutMutation = useLogout();
logoutMutation.mutate();
```

## Posts API

### Available Posts Endpoints

- **GET** `/api/posts?limit=50&offset=0` - Get all posts (with pagination)
- **GET** `/api/posts/:id` - Get post by ID
- **GET** `/api/posts/author/:authorId?limit=50&offset=0` - Get posts by author
- **POST** `/api/posts` - Create a new post (requires authentication)
- **PUT** `/api/posts/:id` - Update a post (requires authentication, author only)
- **DELETE** `/api/posts/:id` - Delete a post (requires authentication, author only)

### Usage Example

```typescript
import {
  usePosts,
  usePost,
  usePostsByAuthor,
  useCreatePost,
  useUpdatePost,
  useDeletePost
} from 'src/lib/react-query/hooks';

// Get all posts with pagination
const { data: postsData, isLoading } = usePosts({
  limit: 50,
  offset: 0,
});

// Get single post
const { data: post, isLoading } = usePost(postId);

// Get posts by author
const { data: authorPosts, isLoading } = usePostsByAuthor(authorId, {
  limit: 20,
  offset: 0,
});

// Create post
const createPostMutation = useCreatePost();
createPostMutation.mutate({
  title: 'My First Post',
  content: 'This is the content of my post',
});

// Update post
const updatePostMutation = useUpdatePost();
updatePostMutation.mutate({
  id: postId,
  params: {
    title: 'Updated Title',
    content: 'Updated content',
  },
});

// Delete post
const deletePostMutation = useDeletePost();
deletePostMutation.mutate({
  id: postId,
  authorId: currentUserId,
});
```

## API Response Types

### Auth Response

```typescript
{
  user: {
    id: number;
    email: string;
    username: string;
    createdAt?: string;
    updatedAt?: string;
  };
  token: string; // JWT token
}
```

### Post

```typescript
{
  id: number;
  title: string;
  content: string;
  authorId: number;
  author?: User;
  createdAt?: string;
  updatedAt?: string;
}
```

### Posts Response

```typescript
{
  posts: Post[];
  total?: number;
}
```

## Token Management

JWT tokens are automatically:
- **Stored** in `localStorage` when you login or register
- **Added** to all API requests via axios interceptor (`Authorization: Bearer <token>`)
- **Removed** from `localStorage` on logout or 401 errors
- **Used** to authenticate protected routes

## Error Handling

The API instance includes error handling:
- **401 Unauthorized**: Automatically clears token and redirects to `/login`
- All errors are properly typed and can be caught in mutation error handlers

Example:
```typescript
const loginMutation = useLogin();
loginMutation.mutate(
  { email: 'user@example.com', password: 'password' },
  {
    onError: (error) => {
      console.error('Login failed:', error);
      // Handle error (show toast, etc.)
    },
    onSuccess: (data) => {
      console.log('Login successful:', data.user);
    },
  }
);
```

## Migration from Old API

The old API functions (`usersApi`, `profileApi`, `dialogsApi`) are still available but not used by the new React Query hooks. You can:

1. **Keep both** during migration period
2. **Gradually migrate** components to use new hooks
3. **Remove old API files** once migration is complete

## Health Check

The backend includes a health check endpoint:
- **GET** `/health` - Health check endpoint

You can use this to verify the backend is running:
```typescript
import { instance } from 'src/api/api';

const checkHealth = async () => {
  try {
    const response = await instance.get('/health');
    console.log('Backend is healthy:', response.data);
  } catch (error) {
    console.error('Backend health check failed:', error);
  }
};
```

## Next Steps

1. **Set up environment variable**: Create `.env` file with your backend URL
2. **Test authentication**: Try registering and logging in
3. **Test posts**: Create, read, update, and delete posts
4. **Update components**: Migrate your components to use the new hooks
5. **Deploy**: Update `REACT_APP_API_URL` for production deployment

## Backend Deployment

See the backend repository for deployment instructions:
- [QUICK_DEPLOY.md](https://github.com/YauhenMurachou/be_zmest/blob/main/QUICK_DEPLOY.md) - Quick start guide
- [DEPLOYMENT.md](https://github.com/YauhenMurachou/be_zmest/blob/main/DEPLOYMENT.md) - Detailed deployment instructions

Recommended platforms:
- **Railway** - Easiest setup, includes PostgreSQL
- **Render** - Good free tier, automatic SSL
- **Fly.io** - Fast performance, global edge
