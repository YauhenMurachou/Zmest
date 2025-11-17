import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';

import DialogTitle from 'src/components/dialogs/dialogTitle/DialogTitle';
import DialogsHeader from 'src/components/dialogs/dialogsHeader/DialogsHeader';
import {
  dialogOpenedAction,
  getDialogsAction,
  getTitlesAction,
  messagesListCleared,
} from 'src/redux/dialogsReducer';
import { RootState } from 'src/redux/redux-store';

import classes from './Dialogs.module.css';

const Dialogs: FC = () => {
  const dispatch = useDispatch();
  const { isAuth, dialogs, messagesTitles } = useSelector(
    (state: RootState) => ({
      isAuth: state.auth,
      dialogs: state.dialogs.dialogs,
      messagesTitles: state.dialogs.messagesTitles,
    })
  );

  useEffect(() => {
    dispatch(getDialogsAction());
  }, []); // eslint-disable-line

  useEffect(
    () => () => {
      dispatch(messagesListCleared());
    },
    [] // eslint-disable-line
  );

  useEffect(() => {
    const dialogsIds = dialogs.map((dialog) => dialog.id);
    if (dialogsIds.length !== messagesTitles.length) {
      dialogsIds.map((id) => dispatch(getTitlesAction({ id })));
    }
  }, [dialogs]); // eslint-disable-line

  const titlesObject = Object.fromEntries(messagesTitles);

  const openDialog = (id: number) => dispatch(dialogOpenedAction({ id }));

  if (!isAuth.isAuth) {
    return <Redirect to="/Login" />;
  }

  return (
    <ul className={classes.dialogs}>
      <DialogsHeader />
      {dialogs.map((dialog, index) => (
        <DialogTitle
          key={dialog.id}
          dialog={dialog}
          title={titlesObject[dialog.id]}
          openDialog={() => openDialog(dialog.id)}
          isLast={index === dialogs.length - 1}
        />
      ))}
    </ul>
  );
};

export default Dialogs;
