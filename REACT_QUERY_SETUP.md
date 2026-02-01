# TanStack Query (React Query) Integration Guide

This project has been set up with TanStack Query for better data fetching and state management, integrated with the [be_zmest backend](https://github.com/YauhenMurachou/be_zmest).

## Backend Integration

This project is configured to work with the new backend API. See [BACKEND_INTEGRATION.md](./BACKEND_INTEGRATION.md) for detailed backend API documentation.

## Installation

First, install the required packages:

```bash
npm install @tanstack/react-query
npm install --save-dev @tanstack/react-query-devtools
```

## Project Structure

```
src/
├── api/
│   ├── api.ts                      # Axios instance with JWT interceptor
│   ├── authApi.ts                  # Authentication API functions
│   └── postsApi.ts                 # Posts API functions
├── lib/
│   └── react-query/
│       ├── queryClient.ts          # QueryClient configuration
│       ├── queryKeys.ts             # Centralized query keys factory
│       └── hooks/
│           ├── useAuth.ts          # Authentication hooks
│           ├── usePosts.ts         # Posts hooks
│           └── index.ts            # Exports all hooks
└── providers/
    └── QueryProvider.tsx           # QueryClientProvider wrapper
```

## Usage Examples

### Authentication

```typescript
import { useAuth, useLogin, useRegister, useLogout } from 'src/lib/react-query/hooks';

// Get current user
const { data: user, isLoading } = useAuth();

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

// Logout
const logoutMutation = useLogout();
logoutMutation.mutate();
```

### Posts

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

## Migration Strategy

You can gradually migrate from Redux/Thunk to React Query:

1. **Start with new features** - Use React Query hooks for new API calls
2. **Migrate incrementally** - Replace Redux thunks one feature at a time
3. **Keep Redux for local state** - Continue using Redux for UI state that doesn't come from the server
4. **Coexistence** - Both can work together during migration

## Query Keys

All query keys are centralized in `src/lib/react-query/queryKeys.ts`. This ensures:
- Consistency across the app
- Easy invalidation
- Type safety
- Better debugging

## Configuration

The QueryClient is configured in `src/lib/react-query/queryClient.ts` with:
- `refetchOnWindowFocus: false` - Prevents refetching when window regains focus
- `retry: 1` - Retries failed requests once
- `staleTime: 5 minutes` - Data is considered fresh for 5 minutes

You can adjust these settings based on your needs.

## DevTools

React Query DevTools are automatically included in development mode. Press the floating button in the bottom-left corner to open the DevTools panel.

## Next Steps

1. Install the packages: `npm install @tanstack/react-query @tanstack/react-query-devtools`
2. Review the hooks in `src/lib/react-query/hooks/`
3. Start using the hooks in your components
4. Gradually migrate from Redux thunks to React Query hooks

## Backend Integration

The project is already configured for the be_zmest backend. To set up:

1. Create a `.env` file with your backend URL:
```env
REACT_APP_API_URL=http://localhost:3000
```

2. For production, update the URL to your deployed backend:
```env
REACT_APP_API_URL=https://your-backend.railway.app
```

3. The API instance automatically:
   - Uses the `REACT_APP_API_URL` environment variable
   - Adds JWT tokens from localStorage to all requests
   - Handles 401 errors by clearing tokens and redirecting to login

See [BACKEND_INTEGRATION.md](./BACKEND_INTEGRATION.md) for detailed API documentation.

## Benefits

- ✅ Automatic caching and background updates
- ✅ Built-in loading and error states
- ✅ Optimistic updates support
- ✅ Request deduplication
- ✅ Automatic refetching on window focus (configurable)
- ✅ Pagination and infinite scroll support
- ✅ Better TypeScript support
- ✅ Less boilerplate code
