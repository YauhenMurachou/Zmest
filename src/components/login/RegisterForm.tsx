import { Button } from '@mui/material';
import { Field, Form, Formik } from 'formik';
import { TextField } from 'formik-mui';
import { FC, MouseEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';

import PasswordIcon from 'src/components/common/atoms/passwordIcon/PasswordIcon';
import { useRegister } from 'src/lib/react-query/hooks';
import { registerValidationSchema } from 'src/utils/validationForms';

import styles from './Login.module.css';

type RegisterType = {
  email: string;
  username: string;
  password: string;
};

const initialValues: RegisterType = {
  email: '',
  username: '',
  password: '',
};

type Props = {
  onSuccess?: () => void;
  onSwitchToLogin?: () => void;
};

const RegisterForm: FC<Props> = ({ onSuccess, onSwitchToLogin }) => {
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
  };
  const { t } = useTranslation();
  const registerMutation = useRegister();

  return (
    <>
      <Formik
        onSubmit={async (values, { setFieldError }) => {
          try {
            await registerMutation.mutateAsync(values);
            onSuccess?.();
          } catch (error: unknown) {
            if (error && typeof error === 'object' && 'response' in error) {
              const axiosError = error as { response?: { data?: { error?: string; details?: Record<string, string[]> } } };
              if (axiosError.response?.data?.details) {
                // Handle validation errors
                Object.entries(axiosError.response.data.details).forEach(([field, messages]) => {
                  setFieldError(field, messages[0]);
                });
              } else if (axiosError.response?.data?.error) {
                setFieldError('email', axiosError.response.data.error);
              }
            }
          }
        }}
        initialValues={initialValues}
        validationSchema={registerValidationSchema}
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
                name="username"
                id="username"
                label={t('register.username')}
                placeholder={t('register.username')}
                component={TextField}
              />
            </div>
            <div className={styles.field}>
              <Field
                fullWidth
                placeholder={t('login.password')}
                name="password"
                id="password"
                type={showPassword ? 'text' : 'password'}
                label={t('login.password')}
                component={TextField}
                InputProps={{
                  endAdornment: (
                    <PasswordIcon
                      showPassword={showPassword}
                      handleClickShowPassword={handleClickShowPassword}
                      handleMouseDownPassword={handleMouseDownPassword}
                    />
                  ),
                }}
              />
            </div>
            {registerMutation.isError && (
              <div className={styles.error}>
                {registerMutation.error instanceof Error
                  ? registerMutation.error.message
                  : t('register.error')}
              </div>
            )}
            <div className={styles.submit}>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                disabled={
                  !!errors.email ||
                  !!errors.username ||
                  !!errors.password ||
                  !dirty ||
                  !isValid ||
                  registerMutation.isPending
                }
              >
                {registerMutation.isPending ? t('register.registering') : t('register.register')}
              </Button>
            </div>
            <div className={styles.redirect}>
              <span>{t('register.haveAccount')}</span>
              <Button
                variant="text"
                onClick={onSwitchToLogin}
                className={styles.registration}
              >
                {t('login.enter')}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default RegisterForm;
