export type Timeout = ReturnType<typeof setTimeout>;

export type ID = { id: number; page?: number };

export type UserType = {
  id: number;
  name: string;
  status: string;
  photos: { small: string | null; large: string | null };
  followed: boolean;
  city?: boolean;
  country?: boolean;
  uniqueUrlName: null | string;
};

export type FriendsType = {
  error: string | null;
  items: UserType[];
  totalCount: number;
};

export type ProfileType = {
  userId: number | null;
  lookingForAJob: boolean;
  lookingForAJobDescription: string;
  fullName: string;
  aboutMe: string;
  contacts: ContactsType;
  photos: { small: string | null; large: string | null } | null;
};

export type EditProfileType = Omit<ProfileType, 'userId' | 'photos'>;

type ContactsType = {
  github: string | null;
  vk: string | null;
  facebook: string | null;
  instagram: string | null;
  twitter: string | null;
  website: string | null;
  youtube: string | null;
  mainLink: string | null;
};

export type Dialog = {
  id: number;
  userId: number;
  userName: string;
  lastMessage?: string;
  lastMessageAddedAt?: string;
  newMessages: number;
  // Backward compatibility fields (optional)
  hasNewMessages?: boolean;
  lastDialogActivityDate?: string;
  lastUserActivityDate?: string;
  newMessagesCount?: number;
  photos: {
    small: string | null | undefined;
    large: string | null | undefined;
  };
};

export type MessageType = {
  id: number;
  body: string;
  addedAt: string;
  senderId: number;
  recipientId: number;
  viewed: boolean;
  spam?: boolean;
  deletedBy?: boolean;
  // Backward compatibility fields (optional)
  senderName?: string;
  translatedBody?: string | null;
};

export type MessagesListType = {
  items: MessageType[];
  totalCount: number;
  error: null | string;
};

export type NewMessage = { id: number; body: string };

export type ChatMessage = {
  userName: string;
  photo: string;
  message: string;
  userId: number;
  id?: string;
  deleted?: boolean;
  deletedMessage?: string;
};

export type ChatStatus = 'pending' | 'ready';

export type SeparateMessagesType = {
  [key: string]: MessageType[];
};
