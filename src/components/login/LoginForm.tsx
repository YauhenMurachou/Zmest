import { Button } from '@mui/material';
import { Field, Form, Formik } from 'formik';
import { CheckboxWithLabel, TextField } from 'formik-mui';
import { FC, MouseEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';

import PasswordIcon from 'src/components/common/atoms/passwordIcon/PasswordIcon';
import { ResultCodeEnum } from 'src/api/api';
import { useLogin } from 'src/lib/react-query/hooks';
import { loginValidationSchema } from 'src/utils/validationForms';

import styles from './Login.module.css';

type OperationResultError = {
  response?: {
    data?: {
      resultCode?: number;
      messages?: string[];
    };
  };
};

const isOperationResultError = (error: unknown): error is OperationResultError =>
  error !== null &&
  typeof error === 'object' &&
  'response' in error &&
  error.response !== null &&
  typeof error.response === 'object' &&
  'data' in error.response &&
  error.response.data !== null &&
  typeof error.response.data === 'object' &&
  'resultCode' in error.response.data &&
  error.response.data.resultCode === ResultCodeEnum.Error;

type LoginFormValues = {
  email: string;
  password: string;
  rememberMe: boolean;
};

type LoginFormProps = {
  onSuccess?: () => void;
  onSwitchToRegister?: () => void;
};

const initialFormValues: LoginFormValues = {
  email: '',
  password: '',
  rememberMe: false,
};

const LoginForm: FC<LoginFormProps> = ({ onSuccess, onSwitchToRegister }) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const { t } = useTranslation();
  const loginMutation = useLogin();

  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prev) => !prev);
  };

  const handlePasswordMouseDown = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const handleSubmit = async (values: LoginFormValues, setFieldError: (field: string, message: string) => void) => {
    try {
      await loginMutation.mutateAsync({
        email: values.email,
        password: values.password,
        rememberMe: values.rememberMe,
      });
      onSuccess?.();
    } catch (error) {
      handleLoginError(error, setFieldError);
    }
  };

  const handleLoginError = (
    error: unknown,
    setFieldError: (field: string, message: string) => void
  ) => {
    if (isOperationResultError(error)) {
      const errorMessages = error.response?.data?.messages || [];
      const firstMessage = errorMessages[0] || t('login.error');

      if (errorMessages.some((msg) => msg.toLowerCase().includes('email'))) {
        setFieldError('email', firstMessage);
      } else if (errorMessages.some((msg) => msg.toLowerCase().includes('password'))) {
        setFieldError('password', firstMessage);
      } else {
        setFieldError('email', firstMessage);
      }
      return;
    }

    if (error instanceof Error) {
      setFieldError('email', error.message);
      return;
    }

    setFieldError('email', t('login.error'));
  };

  return (
    <Formik
      initialValues={initialFormValues}
      validationSchema={loginValidationSchema}
      onSubmit={(values, { setFieldError }) => {
        handleSubmit(values, setFieldError);
      }}
    >
      {({ errors, dirty, isValid }) => (
        <Form>
          <div className={styles.field}>
            <Field
              fullWidth
              name="email"
              id="email"
              label={t('login.email')}
              placeholder={t('login.email')}
              component={TextField}
            />
          </div>
          <div className={styles.field}>
            <Field
              fullWidth
              name="password"
              id="password"
              type={isPasswordVisible ? 'text' : 'password'}
              label={t('login.password')}
              placeholder={t('login.password')}
              component={TextField}
              InputProps={{
                endAdornment: (
                  <PasswordIcon
                    showPassword={isPasswordVisible}
                    handleClickShowPassword={togglePasswordVisibility}
                    handleMouseDownPassword={handlePasswordMouseDown}
                  />
                ),
              }}
            />
          </div>
          {loginMutation.isError && (
            <div className={styles.error}>
              {loginMutation.error instanceof Error
                ? loginMutation.error.message
                : t('login.error')}
            </div>
          )}
          <div className={styles.field}>
            <Field
              type="checkbox"
              component={CheckboxWithLabel}
              name="rememberMe"
              Label={{ label: t('login.remember') }}
            />
          </div>
          <div className={styles.submit}>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={
                !!errors.email ||
                !!errors.password ||
                !dirty ||
                !isValid ||
                loginMutation.isPending
              }
            >
              {loginMutation.isPending ? t('login.loggingIn') : t('login.enter')}
            </Button>
          </div>
          {onSwitchToRegister && (
            <div className={styles.redirect}>
              <span>{t('login.account')}</span>
              <Button
                variant="text"
                onClick={onSwitchToRegister}
                className={styles.registration}
              >
                {t('login.registration')}
              </Button>
            </div>
          )}
        </Form>
      )}
    </Formik>
  );
};

export default LoginForm;
