# Backend API Update - Operation Result Object Format

The frontend has been updated to match the new backend API structure from [be_zmest](https://github.com/YauhenMurachou/be_zmest).

## Key Changes

### 1. Operation Result Object Format

All API responses now follow the standardized format:

```typescript
{
  resultCode: 0,      // 0 = success, 1 = error
  messages: [],       // Empty array if success, error messages if error
  data: {}            // Response data (varies by endpoint)
}
```

### 2. Updated Response Types

#### Register Response
```typescript
{
  resultCode: 0,
  messages: [],
  data: {
    user: {
      id: number;
      email: string;
      username: string;
      createdAt?: string;
      updatedAt?: string;
    }
  }
}
```

#### Login Response
```typescript
{
  resultCode: 0,
  messages: [],
  data: {
    userId: number
  }
}
```

**Note:** JWT token is not in the response body. It's extracted from response headers (`Authorization` or `x-auth-token`) by the axios interceptor.

#### Get Current User Response
```typescript
{
  resultCode: 0,
  messages: [],
  data: {
    id: number;
    email: string;
    login: string;  // Note: "login" not "username"
  }
}
```

#### Post Response
```typescript
{
  resultCode: 0,
  messages: [],
  data: {
    post: {
      id: number;
      title: string;
      content: string;
      authorId: number;
      author?: User;
      createdAt?: string;
      updatedAt?: string;
    }
  }
}
```

#### Posts List Response
```typescript
{
  resultCode: 0,
  messages: [],
  data: {
    posts: Post[];
    total?: number;
  }
}
```

### 3. Error Response Format

```typescript
{
  resultCode: 1,
  messages: ["Error message here"],
  data: {}
}
```

## Updated API Functions

### Authentication API (`src/api/authApi.ts`)

- ✅ `register()` - Handles Operation Result Object format
- ✅ `login()` - Returns `{ userId: number }`, token from headers
- ✅ `logout()` - **NEW**: `POST /api/auth/logout` endpoint
- ✅ `getCurrentUser()` - Maps `login` field to `username` for compatibility

### Posts API (`src/api/postsApi.ts`)

- ✅ All endpoints updated to handle Operation Result Object format
- ✅ Proper error handling with `resultCode` checks
- ✅ Extracts data from `response.data.data` structure

## Token Management

### How Tokens Work

1. **Token Extraction**:
   - Tokens are extracted from response headers (`Authorization` or `x-auth-token`)
   - Automatically stored in `localStorage` by the response interceptor
   - If backend uses cookies, `withCredentials: true` is enabled

2. **Token Usage**:
   - Token from `localStorage` is automatically added to all requests via request interceptor
   - Header format: `Authorization: Bearer <token>`

3. **Token Storage**:
   - Stored in `localStorage` after successful login/register
   - Cleared on logout or 401 errors

### Important Notes

- **Login/Register don't return token in body**: Token must be in response headers
- **If your backend doesn't send token in headers**: You may need to modify the backend to include it, or use cookies
- **Cookie support**: `withCredentials: true` is enabled for cookie-based auth

## Updated Components

### RegisterForm (`src/components/login/RegisterForm.tsx`)

- ✅ Updated error handling for Operation Result Object format
- ✅ Handles `resultCode: 1` errors
- ✅ Maps error messages to form fields
- ✅ Supports validation error details

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login (returns `userId`, token in headers)
- `POST /api/auth/logout` - **NEW** - Logout user (requires auth)
- `GET /api/auth/me` - Get current user (returns `login` field)

### Posts

- `GET /api/posts?limit=50&offset=0` - Get all posts
- `GET /api/posts/:id` - Get post by ID
- `GET /api/posts/author/:authorId?limit=50&offset=0` - Get posts by author
- `POST /api/posts` - Create post (requires auth)
- `PUT /api/posts/:id` - Update post (requires auth, author only)
- `DELETE /api/posts/:id` - Delete post (requires auth, author only)

## Testing

### Test Registration

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "username": "testuser",
    "password": "password123"
  }'
```

Expected response:
```json
{
  "resultCode": 0,
  "messages": [],
  "data": {
    "user": {
      "id": 1,
      "email": "test@example.com",
      "username": "testuser",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

**Check response headers for JWT token!**

### Test Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "rememberMe": false
  }'
```

Expected response:
```json
{
  "resultCode": 0,
  "messages": [],
  "data": {
    "userId": 1
  }
}
```

**Check response headers for JWT token!**

## Backward Compatibility

✅ **Maintained**:
- Old API (`instance`) still works unchanged
- Old Redux login still functional
- Both systems can coexist

## Migration Checklist

- [x] Update API types to Operation Result Object format
- [x] Update authApi to handle new response format
- [x] Update postsApi to handle new response format
- [x] Add token extraction from headers
- [x] Update error handling in components
- [x] Add logout endpoint support
- [x] Map `login` field to `username` for compatibility
- [x] Update React Query hooks
- [x] Update documentation

## Troubleshooting

### Token Not Working

If authentication fails:

1. **Check if token is in headers**:
   - Open browser DevTools → Network tab
   - Check response headers for `Authorization` or `x-auth-token`
   - If not present, backend needs to send token in headers

2. **Check if using cookies**:
   - If backend uses cookies, ensure `withCredentials: true` is set (already done)
   - Check if cookies are being set in browser DevTools

3. **Manual token storage**:
   - If backend sends token differently, you may need to modify the response interceptor
   - Check backend code to see how tokens are sent

### Error Handling

All API functions now:
- Check `resultCode` before returning data
- Throw errors with messages from `messages` array
- Handle validation errors properly

## Next Steps

1. **Test with your backend**: Make sure token extraction works
2. **Verify token format**: Check if your backend sends token in headers or cookies
3. **Update if needed**: Modify token extraction logic based on your backend implementation
4. **Remove old API**: Once fully migrated, can remove old `instance` and Redux auth
