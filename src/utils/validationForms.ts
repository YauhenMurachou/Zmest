import i18n from 'src/i18n';
import * as Yup from 'yup';

const isDomain = /(^(\w[a-z\d-]*\.)+[a-z]{2,}$)/i;
const { t } = i18n;

const validateContact = Yup.string()
  .trim()
  .nullable()
  .matches(isDomain, t('validation.domain') as string);
const longStringValidate = Yup.string()
  .trim()
  .max(25, t('validation.long') as string)
  .required(t('validation.required') as string);

export const newPostSchema = Yup.object().shape({
  newPost: Yup.string()
    .min(3, 'Too Short!')
    .max(30, 'Too Long Post, maximum length 30 symbols!'),
});

export const profielValidationSchema = Yup.object().shape({
  fullName: Yup.string()
    .trim()
    .max(15, t('validation.long') as string)
    .required(t('validation.required') as string),
  aboutMe: longStringValidate,
  lookingForAJob: Yup.boolean(),
  lookingForAJobDescription: longStringValidate,
  contacts: Yup.object().shape({
    facebook: validateContact,
    github: validateContact,
    vk: validateContact,
    instagram: validateContact,
    twitter: validateContact,
    website: validateContact,
    youtube: validateContact,
    mainLink: validateContact,
  }),
});

export const loginValidationSchema = Yup.object().shape({
  email: Yup.string()
    .max(35, t('validation.long') as string)
    .required(t('validation.required') as string)
    .email(t('validation.email') as string),
  password: Yup.string()
    .max(15, t('validation.long') as string)
    .required(t('validation.required') as string),
});

export const registerValidationSchema = Yup.object().shape({
  email: Yup.string()
    .max(100, t('validation.long') as string)
    .required(t('validation.required') as string)
    .email(t('validation.email') as string),
  username: Yup.string()
    .min(3, t('validation.short') as string || 'Username must be at least 3 characters')
    .max(30, t('validation.long') as string)
    .required(t('validation.required') as string)
    .matches(/^[a-zA-Z0-9_]+$/, t('validation.usernameFormat') as string || 'Username can only contain letters, numbers, and underscores'),
  password: Yup.string()
    .min(6, t('validation.short') as string || 'Password must be at least 6 characters')
    .max(100, t('validation.long') as string)
    .required(t('validation.required') as string),
});

export const isProfileFormChanged = <T extends { [key: string]: any }>(
  values: T,
  initialValues: T
): boolean =>
  Object.entries(values).some(([key, field]) => {
    const initial = initialValues[key];

    if (typeof field === 'string') {
      return (
        field.trim() !== (typeof initial === 'string' ? initial.trim() : '')
      );
    }

    if (typeof field === 'boolean') {
      return field !== (typeof initial === 'boolean' ? initial : false);
    }

    if (typeof field === 'object') {
      return field && isProfileFormChanged(field, initial || {});
    }

    return false;
  });
