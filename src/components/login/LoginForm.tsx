import { Button } from '@mui/material';
import { Field, Form, Formik } from 'formik';
import { CheckboxWithLabel, TextField } from 'formik-mui';
import { FC, MouseEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import Captcha from 'src/components/common/atoms/captcha/Captcha';
import PasswordIcon from 'src/components/common/atoms/passwordIcon/PasswordIcon';
import SignUpRedirect from 'src/components/common/atoms/signUpRedirect/SignUpRedirect';
import { LoginType } from 'src/components/login/Login';
import { RootState } from 'src/redux/redux-store';
import { loginValidationSchema } from 'src/utils/validationForms';

import styles from './Login.module.css';

type Props = {
  onSubmit: (values: LoginType) => void;
  onSwitchToRegister?: () => void;
};

const initialValues = {
  email: '',
  password: '',
  rememberMe: false,
  captcha: '',
};

const LoginForm: FC<Props> = ({ onSubmit, onSwitchToRegister }) => {
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
  };
  const { error, captchaImageUrl } = useSelector(
    (state: RootState) => state.auth
  );
  const { t } = useTranslation();
  const [value, setValue] = useState('');

  return (
    <>
      <Formik
        onSubmit={(values) => {
          onSubmit({ ...values, captcha: value });
          setValue('');
        }}
        initialValues={initialValues}
        validationSchema={loginValidationSchema}
      >
        {({ errors, dirty }) => (
          <Form>
            <div className={styles.field}>
              <Field
                fullWidth
                name="email"
                id="email"
                label={t('login.email')}
                placeholder={t('login.email')}
                component={TextField}
                disabled={false}
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
                disabled={false}
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
            {captchaImageUrl && (
              <Captcha
                captchaImageUrl={captchaImageUrl}
                value={value}
                setValue={setValue}
              />
            )}
            {errors && <div className={styles.error}>{error}</div>}
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
                  (!!captchaImageUrl && !value.trim())
                }
              >
                {t('login.enter')}
              </Button>
            </div>
            {onSwitchToRegister ? (
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
            ) : (
            <SignUpRedirect />
            )}
          </Form>
        )}
      </Formik>
    </>
  );
};

export default LoginForm;
