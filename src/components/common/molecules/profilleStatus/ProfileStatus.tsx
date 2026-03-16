import { Tooltip } from '@mui/material';
import TextField from '@mui/material/TextField';
import {
  ChangeEvent,
  MouseEventHandler,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import i18n from 'src/i18n';

import styles from './ProfileStatus.module.css';

type Props = {
  status: string;
  updateStatus?: (status: string) => void;
  isOwner: boolean;
};

const ProfileStatus = ({
  status: propsStatus,
  updateStatus,
  isOwner,
}: Props) => {
  const [editMode, setEditMode] = useState(false);
  const [localStatus, setLocalStatus] = useState(propsStatus);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!editMode) {
      setLocalStatus(propsStatus);
    }
  }, [propsStatus, editMode]);

  const activateEditMode = useCallback(() => {
    setEditMode(true);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      setEditMode(false);
    }, 3000);
  }, []);

  const deactivateEditMode = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setEditMode(false);
  }, []);
  useEffect(
    () => () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    },
    []
  );

  const handleBlurStatus = useCallback(() => {
    const trimmedStatus = localStatus.trim();
    if (updateStatus && trimmedStatus !== propsStatus) {
      updateStatus(trimmedStatus);
    }
    deactivateEditMode();
  }, [localStatus, propsStatus, updateStatus, deactivateEditMode]);

  const onStatusChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setLocalStatus(e.target.value);
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        handleBlurStatus();
      }
    },
    [handleBlurStatus]
  );

  return (
    <>
      <div className={styles.subtitle}>{i18n.t('status.status')}</div>
      {!editMode ? (
        <Tooltip
          title={isOwner ? (i18n.t('status.click') as string) : ''}
          arrow
          placement="bottom"
        >
          <span
            onClick={
              isOwner
                ? (activateEditMode as MouseEventHandler<HTMLSpanElement>)
                : undefined
            }
            role="button"
            className={isOwner ? styles.status : undefined}
          >
            {propsStatus ?? '...'}
          </span>
        </Tooltip>
      ) : null}
      {isOwner && (editMode || !propsStatus) && (
        <TextField
          onBlur={handleBlurStatus}
          onChange={onStatusChange}
          value={localStatus}
          autoFocus
          variant="standard"
          onKeyDown={handleKeyDown}
        />
      )}
    </>
  );
};

export default ProfileStatus;
