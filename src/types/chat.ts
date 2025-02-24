export type MessageType = 'text' | 'image' | 'post';

export interface Message {
  _id: string;
  roomId: string;
  senderId: {_id: string;};
  content?: string;  // 可选，因为 post 类型消息不需要
  postId?: string;
  createdAt: string;
  messageType: MessageType;
  readBy: string[];  // 用户ID数组
}

export interface ChatRoom {
  _id: string;
  participants: {
    _id: string;
    firstName: string;
    lastName: string;
    avatar?: string;
    unreadCount: number;
  }[];
  lastMessage: Message | null;
  createdAt: string;
} 