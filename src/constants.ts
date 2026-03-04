export const finishMessage = {
  id: 26059,
  body: 'Я закончил этот мессенджер ',
  translatedBody: null,
  addedAt: '2023-06-03T14:45:30.4',
  senderId: 26059,
  senderName: 'polyakog',
  recipientId: 17658,
  viewed: true,
};

const complimentMessage = {
  id: 17658,
  body: 'Молодец',
  translatedBody: null,
  addedAt: '2023-06-04T11:41:53.867',
  senderId: 17658,
  senderName: 'Yauhen',
  recipientId: 26059,
  viewed: false,
};

export const testMessages = [finishMessage, complimentMessage];

export const testSeparatedMessages = {
  '03.06.2023': [finishMessage],
  '04.06.2023': [complimentMessage],
};
