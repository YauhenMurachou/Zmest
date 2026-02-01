import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';

import LoginAside from 'src/components/common/organisms/loginAside/LoginAside';
import LoginForm from 'src/components/login/LoginForm';
import RegisterForm from 'src/components/login/RegisterForm';
import { useAuth } from 'src/lib/react-query/hooks';
import { loginDataThunkCreator } from 'src/redux/authReducer';
import { RootState } from 'src/redux/redux-store';

import styles from './Login.module.css';

export type LoginType = {
  email: string;
  password: string;
  rememberMe: boolean;
  captcha: string | null;
};

const Login: FC = () => {
  const dispatch = useDispatch();
  const { isAuth: isAuthRedux, userId } = useSelector((state: RootState) => state.auth);
  const { data: authUser, isSuccess: isAuthNew } = useAuth();
  const { t } = useTranslation();
  const [isRegisterMode, setIsRegisterMode] = useState(false);

  // Check auth from both old Redux and new React Query
  const isAuth = isAuthRedux || (isAuthNew && !!authUser);
  const currentUserId = userId || authUser?.id;
  const profilePath = `/Profile/${currentUserId}`;

  const logInFunction = (values: LoginType) => {
    const { email, password, rememberMe, captcha } = values;
    // Use old Redux login for backward compatibility
    dispatch(loginDataThunkCreator(email, password, rememberMe, captcha));
  };

  const handleRegisterSuccess = () => {
    // After successful registration, switch to login mode
    // The user is already logged in via token, so redirect
    setIsRegisterMode(false);
  };

  if (isAuth) {
    return <Redirect to={profilePath} />;
  }

  return (
    <div className={styles.container}>
      <LoginAside />
      <div className={styles.login}>
        <div className={styles.loginForm}>
          <h1 className={styles.title}>
            {isRegisterMode ? t('register.title') : t('login.title')}
          </h1>
          {isRegisterMode ? (
            <RegisterForm
              onSuccess={handleRegisterSuccess}
              onSwitchToLogin={() => setIsRegisterMode(false)}
            />
          ) : (
            <LoginForm
              onSubmit={logInFunction}
              onSwitchToRegister={() => setIsRegisterMode(true)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
