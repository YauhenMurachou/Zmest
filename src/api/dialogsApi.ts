import { dialogsAPI } from 'src/api/api';
import { Dialog, MessageType, MessagesListType } from 'src/types';

export const dialogsApi = {
  async getAllDialogs(): Promise<Dialog[]> {
    const response = await dialogsAPI.getAllDialogs();
    return response.data.data.items;
  },

  async startDialog(userId: number): Promise<{ id: number; userId: number }> {
    const response = await dialogsAPI.startDialog(userId);
    return response.data.data;
  },

  async getMessagesList(
    userId: number,
    page = 1,
    count = 10
  ): Promise<MessagesListType> {
    const response = await dialogsAPI.getMessages(userId, page, count);
    return {
      items: response.data.data.items,
      totalCount: response.data.data.totalCount,
      error: null,
    };
  },

  async sendMessage(userId: number, body: string): Promise<MessageType> {
    const response = await dialogsAPI.sendMessage(userId, { body });
    return response.data.data;
  },

  async isMessageViewed(messageId: number) {
    const response = await dialogsAPI.getMessageViewedStatus(messageId);
    return response.data;
  },

  async setMessageToSpam(messageId: number) {
    const response = await dialogsAPI.markAsSpam(messageId);
    return response.data;
  },

  async deleteMessage(messageId: number) {
    const response = await dialogsAPI.deleteMessage(messageId);
    return response.data;
  },

  async restoreMessage(messageId: number) {
    const response = await dialogsAPI.restoreMessage(messageId);
    return response.data;
  },

  async getNewestMessages(userId: number, date: string) {
    const response = await dialogsAPI.getNewMessages(userId, date);
    return response.data;
  },

  async getNewMessagesCount() {
    const response = await dialogsAPI.getNewMessagesCount();
    return response.data;
  },
};
