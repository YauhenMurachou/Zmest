import { FC, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import MessagesHeader from 'src/components/common/molecules/messagesHeader/MessagesHeader';
import { SendMessageForm } from 'src/components/common/molecules/sendMessageForm/SendMessageForm';
import { MessagesList } from 'src/components/common/organisms/messagesList/MessagesList';
import {
  getDialogsAction,
  getMessagesListAction,
  messagesListCleared,
  sendMessageAction,
  updateTitleAction,
} from 'src/redux/dialogsReducer';
import { RootState } from 'src/redux/redux-store';

import classes from './DialogOpened.module.css';

const DialogOpened: FC = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const id = +useParams<{ id: string }>().id;
  const dialogs = useSelector((state: RootState) => state.dialogs.dialogs);
  const messages = useSelector(
    (state: RootState) => state.dialogs.messagesList
  );
  const currentDialog = dialogs.find((dialog) => dialog.id === id);
  const friendAvatar = currentDialog?.photos?.small ?? undefined;
  const { userName, lastUserActivityDate } = currentDialog || {};

  useEffect(() => {
    dispatch(getDialogsAction());
  }, []); // eslint-disable-line

  useEffect(() => {
    dispatch(getMessagesListAction({ id }));
  }, [id]); // eslint-disable-line

  useEffect(
    () => () => {
      dispatch(messagesListCleared());
    },
    [] // eslint-disable-line
  );

  const sendMessage = (newMessage: string) => {
    const message = { id, body: newMessage };
    dispatch(sendMessageAction(message));
    dispatch(updateTitleAction(message));
  };

  return (
    <div className={classes.wrapper}>
      <MessagesHeader
        friendAvatar={friendAvatar}
        userName={userName}
        userId={id}
        lastUserActivityDate={lastUserActivityDate}
      />
      {messages?.items.length ? (
        <MessagesList
          messages={messages}
          friendAvatar={friendAvatar}
          dialogId={id}
        />
      ) : (
        <div>{t('dialogs.empty')}</div>
      )}
      <SendMessageForm sendMessageDialog={sendMessage} />
    </div>
  );
};

export default DialogOpened;
