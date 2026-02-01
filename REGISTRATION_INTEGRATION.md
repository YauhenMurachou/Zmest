# Registration Integration Guide

Registration functionality has been successfully integrated into the existing login flow while maintaining full backward compatibility with the old API.

## What's New

### 1. Registration Form Component
- **File**: `src/components/login/RegisterForm.tsx`
- New component for user registration
- Uses React Query `useRegister` hook
- Includes validation and error handling
- Supports switching back to login mode

### 2. Updated Login Component
- **File**: `src/components/login/Login.tsx`
- Now supports both login and registration modes
- Toggle between login/register with a button
- Maintains backward compatibility with old Redux login
- Checks auth from both old Redux and new React Query

### 3. Updated Login Form
- **File**: `src/components/login/LoginForm.tsx`
- Added `onSwitchToRegister` prop
- Shows registration button when new backend is available
- Falls back to old SignUpRedirect for backward compatibility

### 4. API Updates
- **File**: `src/api/api.ts`
  - `instance` - Old API (social-network.samuraijs.com) - **unchanged**
  - `instance2` - New backend API (be_zmest) - **with JWT interceptors**

- **File**: `src/api/authApi.ts`
  - Uses `instance2` for new backend
  - `register()` - POST /api/auth/register
  - `login()` - POST /api/auth/login
  - `getCurrentUser()` - GET /api/auth/me

- **File**: `src/api/postsApi.ts`
  - Uses `instance2` for new backend
  - All endpoints updated to match backend response format

### 5. Validation Schema
- **File**: `src/utils/validationForms.ts`
- Added `registerValidationSchema`:
  - Email: required, valid format, max 100 chars
  - Username: 3-30 chars, alphanumeric + underscores only
  - Password: min 6 chars, max 100 chars

### 6. Translations
- Added registration translations in English and Belarusian:
  - `register.title` - "Create account"
  - `register.username` - "Username"
  - `register.register` - "Sign up"
  - `register.registering` - "Creating account..."
  - `register.haveAccount` - "Already have an account?"
  - `register.error` - Error message
  - `validation.short` - "Too short"
  - `validation.usernameFormat` - Username format validation message

## How It Works

### Backward Compatibility

1. **Old Login (Redux)**:
   - Still works via `loginDataThunkCreator`
   - Uses `instance` (old API)
   - Maintains all existing functionality

2. **New Registration (React Query)**:
   - Uses `instance2` (new backend)
   - Stores JWT token in localStorage
   - Automatically authenticates after registration

3. **Dual Auth Check**:
   ```typescript
   const isAuth = isAuthRedux || (isAuthNew && !!authUser);
   ```
   - Checks both old Redux auth and new React Query auth
   - Works seamlessly with both systems

### User Flow

1. **Registration**:
   - User clicks "Sign up" on login page
   - Switches to registration form
   - Fills email, username, password
   - Submits → calls new backend API
   - On success → token stored, user authenticated
   - Can switch back to login if needed

2. **Login**:
   - User can still use old login (Redux)
   - Or use new login (React Query) if implemented
   - Both work independently

## API Endpoints Used

### New Backend (be_zmest)

- **POST** `/api/auth/register`
  ```json
  {
    "email": "user@example.com",
    "username": "johndoe",
    "password": "password123"
  }
  ```
  Response:
  ```json
  {
    "user": { "id": 1, "email": "...", "username": "..." },
    "token": "jwt-token-here"
  }
  ```

- **POST** `/api/auth/login`
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```

- **GET** `/api/auth/me`
  - Requires: `Authorization: Bearer <token>`
  - Returns: User object

## Environment Setup

Create `.env` file:
```env
REACT_APP_API_URL=http://localhost:3000
```

For production:
```env
REACT_APP_API_URL=https://your-backend.railway.app
```

## Testing

### Test Registration

1. Start your backend: `npm run dev` (in backend repo)
2. Start frontend: `npm start`
3. Navigate to `/login`
4. Click "Sign up"
5. Fill in:
   - Email: `test@example.com`
   - Username: `testuser`
   - Password: `password123`
6. Submit
7. Should automatically log in and redirect to profile

### Test with cURL

```bash
# Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "username": "testuser",
    "password": "password123"
  }'
```

## Error Handling

The registration form handles:
- **Validation errors**: Shows field-specific errors
- **Backend errors**: Displays error messages
- **Network errors**: Shows generic error message

Error format from backend:
```json
{
  "error": "Error message",
  "details": {
    "email": ["Invalid email format"],
    "username": ["Username already taken"]
  }
}
```

## Next Steps

1. **Test the integration**: Make sure registration works with your backend
2. **Update login**: Optionally migrate login to use new backend too
3. **Remove old API**: Once fully migrated, can remove old `instance` and Redux auth
4. **Add more features**: Use the new backend for posts, etc.

## Files Modified

- ✅ `src/api/api.ts` - Added instance2 with JWT interceptors
- ✅ `src/api/authApi.ts` - Updated to use instance2
- ✅ `src/api/postsApi.ts` - Updated to use instance2, fixed response format
- ✅ `src/components/login/Login.tsx` - Added registration mode
- ✅ `src/components/login/LoginForm.tsx` - Added switch to registration
- ✅ `src/components/login/RegisterForm.tsx` - New registration form
- ✅ `src/utils/validationForms.ts` - Added registration validation
- ✅ `src/locales/en/translationEN.json` - Added registration translations
- ✅ `src/locales/by/translationBY.json` - Added registration translations
- ✅ `src/components/login/Login.module.css` - Added redirect styles

## Backward Compatibility

✅ **Fully maintained**:
- Old Redux login still works
- Old API (`instance`) unchanged
- Existing components unaffected
- Can use both systems simultaneously
