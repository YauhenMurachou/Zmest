import { profileApi } from 'src/api/profileApi';
import { usersApi } from 'src/api/usersApi';
import { CommonActionTypes, CommonThunkType } from 'src/redux/redux-store';

const SET_USER_DATA = 'SET_USER_DATA';
const STOP_SUBMIT = 'STOP_SUBMIT';
const SET_CAPTCHA_URL = 'SET_CAPTCHA_URL';
const SET_OWNER_AVATAR = 'SET_OWNER_AVATAR';

type AuthInitialStateType = {
  isAuth: boolean | null;
  userId: number | null;
  email: string | null;
  login: string | null;
  error?: string | null;
  captchaImageUrl?: string | null;
  ownerAvatar?: string | null;
};

const initialState: AuthInitialStateType = {
  isAuth: null,
  userId: null,
  email: null,
  login: null,
};

export const authActions = {
  setUserDataActionCreator: (
    userId: number | null,
    email: string | null,
    login: string | null,
    isAuth: boolean | null,
    error?: null,
    captchaImageUrl?: null
  ) =>
    ({
      type: SET_USER_DATA,
      data: { userId, email, login, isAuth, error, captchaImageUrl },
    } as const),
  stopSubmitActionCreator: (error: string) =>
    ({
      type: STOP_SUBMIT,
      data: { error },
    } as const),
  setCaptchaActionCreator: (captchaImageUrl: string) =>
    ({
      type: SET_CAPTCHA_URL,
      data: { captchaImageUrl },
    } as const),
  setAvatarActionCreator: (ownerAvatar: string) =>
    ({
      type: SET_OWNER_AVATAR,
      data: { ownerAvatar },
    } as const),
};

export type AuthActionsType = CommonActionTypes<typeof authActions>;

export const authReducer = (
  state = initialState,
  action: AuthActionsType
): AuthInitialStateType => {
  switch (action.type) {
    case SET_USER_DATA: {
      return {
        ...state,
        ...action.data,
      };
    }
    case STOP_SUBMIT: {
      return {
        ...state,
        ...action.data,
      };
    }
    case SET_CAPTCHA_URL: {
      return {
        ...state,
        ...action.data,
      };
    }
    case SET_OWNER_AVATAR: {
      return {
        ...state,
        ...action.data,
      };
    }

    default:
      return state;
  }
};

export const setUserDataThunkCreator =
  (): CommonThunkType<AuthActionsType> => async (dispatch) => {
    // Only try to fetch current user if JWT token exists
    if (typeof window === 'undefined') {
      return;
    }

    const token = localStorage.getItem('token');

    if (!token) {
      // No token → user is not authenticated, but app can still be initialized
      dispatch(authActions.setUserDataActionCreator(null, null, null, false));
      return;
    }

    try {
      const data = await usersApi.setLogin();

      if (data.resultCode === 0 && data.data) {
        const { id, email, login } = data.data;
        dispatch(authActions.setUserDataActionCreator(id, email, login, true));

        profileApi.getProfile(id).then((profileData) => {
          dispatch(authActions.setAvatarActionCreator(profileData.photos.small));
        });
      } else {
        // Token exists but backend says unauthenticated (e.g., expired/invalid token)
        // Clear token and mark user as logged out, but don't break app initialization
        localStorage.removeItem('token');
        dispatch(authActions.setUserDataActionCreator(null, null, null, false));
      }
    } catch (error) {
      // Let network errors bubble up so appReducer can show CORSE error,
      // but don't rethrow 401-style auth issues (they should already be handled by interceptor)
      if (error instanceof Error && error.message === 'Network Error') {
        throw error;
      }

      // For other errors, treat as unauthenticated and continue
      localStorage.removeItem('token');
      dispatch(authActions.setUserDataActionCreator(null, null, null, false));
    }
  };

export const loginDataThunkCreator =
  (
    email: string | null,
    password: string | null,
    rememberMe: boolean | null,
    captchaImageUrl: string | null
  ): CommonThunkType<AuthActionsType, void> =>
  (dispatch) => {
    usersApi
      .login(email, password, rememberMe, captchaImageUrl)
      .then((data) => {
        if (data.resultCode === 0) {
          dispatch(setUserDataThunkCreator());
        } else {
          const message =
            data.messages.length > 0 ? data.messages[0] : 'Неизвестная ошибка';
          dispatch(authActions.stopSubmitActionCreator(message));
          if (data.resultCode === 10) {
            dispatch(getCaptchaUrlThunkCreator());
          }
        }
      });
  };

const getCaptchaUrlThunkCreator =
  (): CommonThunkType<AuthActionsType, void> => (dispatch) => {
    usersApi.getCaptchaUrl().then((data) => {
      const captchaUrl = data.url;
      dispatch(authActions.setCaptchaActionCreator(captchaUrl));
    });
  };

export const logoutDataThunkCreator =
  (): CommonThunkType<AuthActionsType, void> => (dispatch) => {
    usersApi.logout().then((data) => {
      if (data.resultCode === 0) {
        dispatch(
          authActions.setUserDataActionCreator(
            null,
            null,
            null,
            null,
            null,
            null
          )
        );
      }
    });
  };
