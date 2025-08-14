import MusicNoteIcon from '@mui/icons-material/MusicNote';
import MusicOffIcon from '@mui/icons-material/MusicOff';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import NotificationsOffOutlinedIcon from '@mui/icons-material/NotificationsOffOutlined';
import { Tooltip } from '@mui/material';
import classNames from 'classnames';
import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';

import ChangeLanguage from 'src/components/common/molecules/changeLanguage/ChangeLanguage';

import classes from './HeaderNotifications.module.css';

const HeaderNotifications: FC = () => {
  const [isMuted, setIsMuted] = useState(false);
  const [isOffNotifications, setIsOffNotifications] = useState(false);

  // useEffect(() => {
  //   const isMuted = JSON.parse(localStorage.getItem('isMuted') || '[]');
  //   setIsMuted(isMuted);
  // }, [isMuted]);

  // useEffect(() => {
  //   const isOffNotifications = JSON.parse(
  //     localStorage.getItem('isOffNotifications') || '[]'
  //   );
  //   setIsOffNotifications(isOffNotifications);
  // }, [isOffNotifications]);

  const { t } = useTranslation();

  const handleMute = () => {
    setIsMuted(!isMuted);
    localStorage.setItem('isMuted', JSON.stringify(!isMuted));
  };

  const handleOffNotifications = () => {
    setIsOffNotifications(!isOffNotifications);
    localStorage.setItem(
      'isOffNotifications',
      JSON.stringify(!isOffNotifications)
    );
  };

  return (
    <>
      <ChangeLanguage />
      <Tooltip
        title={
          isMuted
            ? (t('header.unmute') as string)
            : (t('header.mute') as string)
        }
        arrow
      >
        <span
          onClick={handleMute}
          role="button"
          className={classNames(classes.mute, {
            [classes.disabled]: isOffNotifications,
          })}
        >
          {isMuted ? <MusicOffIcon /> : <MusicNoteIcon />}
        </span>
      </Tooltip>
      <Tooltip
        title={
          isOffNotifications
            ? (t('header.on') as string)
            : (t('header.off') as string)
        }
        arrow
      >
        <span
          onClick={handleOffNotifications}
          role="button"
          className={classes.mute}
        >
          {isOffNotifications ? (
            <NotificationsOffOutlinedIcon />
          ) : (
            <NotificationsNoneOutlinedIcon />
          )}
        </span>
      </Tooltip>
    </>
  );
};

export default HeaderNotifications;
