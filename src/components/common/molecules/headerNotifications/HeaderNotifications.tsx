import MusicNoteIcon from '@mui/icons-material/MusicNote';
import MusicOffIcon from '@mui/icons-material/MusicOff';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import NotificationsOffOutlinedIcon from '@mui/icons-material/NotificationsOffOutlined';
import { Tooltip } from '@mui/material';
import classNames from 'classnames';
import { FC, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import ChangeLanguage from 'src/components/common/molecules/changeLanguage/ChangeLanguage';

import classes from './HeaderNotifications.module.css';

const HeaderNotifications: FC = () => {
  const [isMuted, setIsMuted] = useState(false);
  const [isOffNotifications, setIsOffNotifications] = useState(false);
  const { t } = useTranslation();

  // Load from localStorage on mount only (no loop deps)
  useEffect(() => {
    try {
      const muted = localStorage.getItem('isMuted');
      if (muted !== null) {
        setIsMuted(JSON.parse(muted));
      }
    } catch {
      // Ignore parse errors
    }

    try {
      const notifications = localStorage.getItem('isOffNotifications');
      if (notifications !== null) {
        setIsOffNotifications(JSON.parse(notifications));
      }
    } catch {
      // Ignore parse errors
    }
  }, []); // Empty deps - load once

  const handleMute = useCallback(() => {
    const newValue = !isMuted;
    setIsMuted(newValue);
    localStorage.setItem('isMuted', JSON.stringify(newValue));
  }, [isMuted]);

  const handleOffNotifications = useCallback(() => {
    const newValue = !isOffNotifications;
    setIsOffNotifications(newValue);
    localStorage.setItem('isOffNotifications', JSON.stringify(newValue));
  }, [isOffNotifications]);

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
