import CloseIcon from '@mui/icons-material/Close';
import { IconButton } from '@mui/material';
import PopperComponent, { PopperPlacementType } from '@mui/material/Popper';
import classNames from 'classnames';
import { FC, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';

import { Timeout, UserType } from 'src/types';

import classes from './Popper.module.css';

type Props = {
  anchorEl?: HTMLElement;
  isOpen: boolean;
  placement: PopperPlacementType;
  handleClose: () => void;
  companion: UserType;
};

const positionClass: Record<PopperPlacementType, string> = {
  'bottom-start': 'bottomStart',
  'bottom-end': 'bottomEnd',
  auto: '',
  'auto-start': '',
  'auto-end': '',
  top: '',
  bottom: '',
  right: '',
  left: '',
  'top-start': '',
  'top-end': '',
  'right-start': '',
  'right-end': '',
  'left-start': '',
  'left-end': '',
};
// Full all values if it will be necessary

const Popper: FC<Props> = ({
  anchorEl,
  isOpen,
  placement,
  handleClose,
  companion,
}) => {
  useEffect(() => {
    let timeoutId: Timeout;
    if (isOpen) {
      timeoutId = setTimeout(() => {
        handleClose();
      }, 6000);
    }
    return () => clearTimeout(timeoutId);
  }, [handleClose, isOpen]);

  const { t } = useTranslation();
  const { name, id } = companion || {};
  const dialogPath = `/Dialogs/${id}`;
  const profilePath = `/profile/${id}`;

  return (
    <PopperComponent
      open={isOpen}
      anchorEl={anchorEl}
      placement={placement}
      className={classNames(classes.wrapper, classes[positionClass[placement]])}
    >
      <div className={classes.title}>
        <span>{t('popper.done')}</span>
        <span className={classes.closeIcon}>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </span>
      </div>
      <div>
        <div>
          <NavLink to={dialogPath}>{t('popper.message')}</NavLink>
          {t('popper.sent')} <NavLink to={profilePath}>{name}</NavLink>
        </div>
      </div>
    </PopperComponent>
  );
};

export default Popper;
