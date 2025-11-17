import { Button } from '@mui/material';
import { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';

import SettingsForm from 'src/components/common/organisms/settingsForm/SettingsForm';
import { authActions } from 'src/redux/authReducer';
import {
  editProfileThunkCreator,
  setUserProfileThunkCreator,
} from 'src/redux/profilePageReducer';
import { RootState } from 'src/redux/redux-store';
import { EditProfileType, ProfileType } from 'src/types';

import classes from './Settings.module.css';

const Settings: FC = () => {
  const [editMode, setEditMode] = useState(false);
  const { userId, email, login, isAuth } = useSelector(
    (state: RootState) => state.auth
  );
  const profile = useSelector((state: RootState) => state.profilePage.profile);
  const dispatch = useDispatch();
  const { t } = useTranslation();

  useEffect(() => {
    dispatch(setUserProfileThunkCreator(userId));
  }, [dispatch, userId]);

  const handleProfileInfoEdit = (formData: EditProfileType) => {
    dispatch(editProfileThunkCreator(formData));
    if (formData.fullName !== login) {
      dispatch(
        authActions.setUserDataActionCreator(
          userId,
          email,
          formData.fullName,
          true
        )
      );
    }
    setEditMode(false);
  };

  const info = profile ? Object.getOwnPropertyNames(profile) : {};
  const { photos, ...editProfile } = profile ?? {};

  if (!isAuth) {
    return <Redirect to="/Login" />;
  }

  return (
    <div>
      {!editMode ? (
        <div className={classes.title}>
          <Button
            variant="contained"
            onClick={() => setEditMode((prevState) => !prevState)}
          >
            {t('settings.edit')}
          </Button>
        </div>
      ) : (
        <SettingsForm
          info={info as []}
          editProfile={editProfile as ProfileType}
          onSubmit={handleProfileInfoEdit}
          toggleEditMode={() => setEditMode((prevState) => !prevState)}
        />
      )}
    </div>
  );
};

export default Settings;
