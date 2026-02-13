import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';

import LoginAside from 'src/components/common/organisms/loginAside/LoginAside';
import LoginForm from 'src/components/login/LoginForm';
import RegisterForm from 'src/components/login/RegisterForm';
import { useAuth } from 'src/lib/react-query/hooks';
import { RootState } from 'src/redux/redux-store';

import styles from './Login.module.css';

const Login: FC = () => {
  const { t } = useTranslation();
  const [isRegisterMode, setIsRegisterMode] = useState(false);

  // Backward compatibility: Check old Redux auth state
  const { isAuth: isAuthRedux, userId: reduxUserId } = useSelector(
    (state: RootState) => state.auth
  );

  // New backend: Check React Query auth state
  const { data: authUser, isSuccess: isAuthQuerySuccess, refetch: refetchAuth } = useAuth();

  const isAuthenticated = isAuthRedux || (isAuthQuerySuccess && !!authUser);
  const currentUserId = reduxUserId || authUser?.id;
  const profilePath = currentUserId ? `/Profile/${currentUserId}` : '/Profile';

  const handleLoginSuccess = () => {
    // Refetch auth data after successful login to get user info
    refetchAuth();
  };

  const handleRegisterSuccess = () => {
    // After successful registration, user is logged in via token
    // Refetch auth data and switch to login mode
    refetchAuth();
    setIsRegisterMode(false);
  };

  // Redirect if already authenticated
  if (isAuthenticated) {
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
              onSuccess={handleLoginSuccess}
              onSwitchToRegister={() => setIsRegisterMode(true)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
