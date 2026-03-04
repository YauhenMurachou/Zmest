import { legacyInstance } from 'src/api/api';
import { Dialog, MessageType, MessagesListType } from 'src/types';

export const dialogsApi = {
  async getAllDialogs(): Promise<Dialog[]> {
    const response = await legacyInstance.get<{
      data: { items: Dialog[]; totalCount: number };
    }>('dialogs');
    return response.data.data.items;
  },
  async startDialog(userId: number): Promise<{ id: number; userId: number }> {
    const response = await legacyInstance.put<{
      data: { id: number; userId: number };
    }>(`dialogs/${userId}`);
    return response.data.data;
  },
  async getMessagesList(
    userId: number,
    page = 1,
    count = 10
  ): Promise<MessagesListType> {
    const response = await legacyInstance.get<{
      data: { items: MessageType[]; totalCount: number };
    }>(`dialogs/${userId}/messages?page=${page}&count=${count}`);
    return {
      items: response.data.data.items,
      totalCount: response.data.data.totalCount,
      error: null,
    };
  },
  async sendMessage(userId: number, body: string): Promise<MessageType> {
    const response = await legacyInstance.post<{ data: MessageType }>(
      `dialogs/${userId}/messages`,
      { body }
    );
    return response.data.data;
  },
  async isMessageViewed(messageId: number) {
    const response = await legacyInstance.get(
      `dialogs/messages/${messageId}/viewed`
    );
    return response.data;
  },
  async setMessageToSpam(messageId: number) {
    const response = await legacyInstance.post(
      `dialogs/messages/${messageId}/spam`
    );
    return response.data;
  },
  async deleteMessage(messageId: number) {
    const response = await legacyInstance.delete(
      `dialogs/messages/${messageId}`
    );
    return response.data;
  },
  async restoreMessage(messageId: number) {
    const response = await legacyInstance.put(
      `dialogs/messages/${messageId}/restore`
    );
    return response.data;
  },
  async getNewestMessages(userId: number, date: string) {
    const response = await legacyInstance.get(
      `dialogs/${userId}/messages/new?newerThen=${date}`
    );
    return response.data;
  },
  async getNewMessagesCount() {
    const response = await legacyInstance.get('dialogs/messages/new/count');
    return response.data;
  },
};
