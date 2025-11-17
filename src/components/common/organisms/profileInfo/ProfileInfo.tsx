import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { v4 as uuidv4 } from 'uuid';

import { ProfileType } from 'src/types';

import classes from './ProfileInfo.module.css';

type Props = {
  profile: ProfileType;
};

const ProfileInfo: FC<Props> = ({ profile }) => {
  const { t } = useTranslation();
  const info = Object.getOwnPropertyNames(profile);

  return (
    <div className={classes.info}>
      <h5 className={classes.title}>
        {t('profile.about')} <strong>{profile.fullName}</strong>
      </h5>
      <div>
        <span className={classes.property}>{t('profile.summary')}: </span>
        <span className={classes.value}>{profile.aboutMe ?? '-'}</span>
      </div>
      {info.map((item) => {
        if (item === 'lookingForAJob' && profile.lookingForAJob) {
          return (
            <div key={uuidv4()} className={classes.lookingJob}>
              {t('profile.looking')}
            </div>
          );
        } else if (item === 'lookingForAJob' && !profile.lookingForAJob) {
          return <div key={uuidv4()}>{t('profile.notLooking')}</div>;
        } else if (
          item === 'lookingForAJobDescription' &&
          profile.lookingForAJob
        ) {
          return (
            <div key={uuidv4()}>
              <span className={classes.property}>
                {t('profile.description')}:{' '}
              </span>
              <span className={classes.value}>
                {profile.lookingForAJobDescription ?? '-'}
              </span>
            </div>
          );
        } else if (item === 'contacts') {
          return (
            <div key={uuidv4()}>
              <span className={classes.property}>{t('profile.contacts')}</span>:
              {Object.keys(profile['contacts']).map((elem) => (
                <div key={uuidv4()}>
                  <span className={classes.contact}>{elem}: </span>
                  {profile['contacts'][elem as keyof ProfileType['contacts']] ||
                    ' - '}
                </div>
              ))}
            </div>
          );
        }
         return '';
      })}
    </div>
  );
};

export default ProfileInfo;
