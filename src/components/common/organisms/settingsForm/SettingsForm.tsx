import { Button } from '@mui/material';
import { Field, Form, Formik } from 'formik';
import { CheckboxWithLabel, TextField } from 'formik-mui';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { v4 as uuidv4 } from 'uuid';

import { EditProfileType } from 'src/types';
import {
  isProfileFormChanged,
  profielValidationSchema,
} from 'src/utils/validationForms';

import classes from './SettingsForm.module.css';

type Props = {
  info: string[];
  onSubmit: (values: EditProfileType) => void | Promise<unknown>;
  editProfile: EditProfileType;
  toggleEditMode?: () => void;
};

const SettingsForm: FC<Props> = ({
  info,
  onSubmit,
  editProfile,
  toggleEditMode,
}) => {
  const { t } = useTranslation();
  const exceptions = ['photos', 'userId', 'fullName'];
  return (
    <>
      <Formik
        onSubmit={onSubmit}
        initialValues={editProfile}
        validationSchema={profielValidationSchema}
      >
        {({ dirty, isValid, values }) => {
          const isFormChanged = isProfileFormChanged<EditProfileType>(
            values,
            editProfile
          );

          return (
            <Form className={classes.formWrapper}>
              <h3 className={classes.title}>{t('settings.title')}</h3>
              <div className={classes.property}>
                <Field
                  name="fullName"
                  id="fullName"
                  component={TextField}
                  variant="standard"
                  helperText={t('settings.fullName')}
                />
              </div>
              {info.map((item, index) => {
                if (exceptions.includes(item)) {
                  return undefined;
                } else if (
                  typeof editProfile[item as keyof EditProfileType] ===
                  'boolean'
                ) {
                  return (
                    <div className={classes.property} key={uuidv4()}>
                      <Field
                        Label={{ label: t('settings.job') }}
                        name={item}
                        id={item}
                        type="checkbox"
                        component={CheckboxWithLabel}
                        style={{ display: 'flex' }}
                      />
                    </div>
                  );
                } else if (
                  typeof editProfile[item as keyof EditProfileType] !== 'object'
                ) {
                  return (
                    <div className={classes.property}>
                      <Field
                        name={item}
                        key={index}
                        id={item}
                        component={TextField}
                        variant="standard"
                        helperText={item}
                      />
                    </div>
                  );
                } else {
                  return (
                    <div key={uuidv4()} className={classes.contactsWrapper}>
                      <h4 className={classes.title}>{item}</h4>
                      <div className={classes.contacts}>
                        {Object.keys(editProfile['contacts']).map((elem) => (
                          <Field
                            name={`contacts.${elem}`}
                            id={`contacts.${elem}`}
                            component={TextField}
                            variant="standard"
                            helperText={elem}
                            validateonchange={false}
                            validateOnBlur={true}
                            className={classes.contact}
                            key={uuidv4()}
                          />
                        ))}
                      </div>
                    </div>
                  );
                }
              })}
              <div className={classes.buttons}>
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  disabled={!dirty || !isValid || !isFormChanged}
                >
                  {t('profile.save')}
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={toggleEditMode}
                >
                  {t('profile.back')}
                </Button>
              </div>
            </Form>
          );
        }}
      </Formik>
    </>
  );
};

export default SettingsForm;
