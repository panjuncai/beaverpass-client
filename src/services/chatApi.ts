import { ChatRoom, Message, MessageType } from '@/types/chat';
import { createApiWithBaseUrl, TAGS } from './api';


const TAG_TYPE = { type: TAGS.Chat };

export const chatApi = createApiWithBaseUrl('/chat', 'chatApi').injectEndpoints({
  endpoints: (builder) => ({
    getChatMessages: builder.query<Message[], string>({
      query: (roomId) => ({
        url: `/rooms/${roomId}/messages`,
        method: 'GET',
      }),
      providesTags: [TAG_TYPE],
    }),
    
    sendMessage: builder.mutation<
      Message, 
      { roomId: string; content?: string; postId?: string; messageType: MessageType }
    >({
      query: (data) => ({
        url: `/rooms/${data.roomId}/messages`,
        method: 'POST',
        data,
      }),
      invalidatesTags: [TAG_TYPE],
    }),
    
    createChatRoom: builder.mutation<ChatRoom, { sellerId: string }>({
      query: (data) => ({
        url: '/rooms',
        method: 'POST',
        data,
      }),
      invalidatesTags: [TAG_TYPE],
    }),
    markAsRead: builder.mutation<void, string>({
      query: (roomId) => ({
        url: `/rooms/${roomId}/read`,
        method: 'POST',
      }),
      invalidatesTags: [TAG_TYPE],
    }),
    getRoomWithUser: builder.query<ChatRoom | null, string>({
      query: (userId) => ({
        url: `/rooms/user/${userId}`,
        method: 'GET',
      }),
      providesTags: [TAG_TYPE],
    }),
  }),
});

export const {
  useGetChatMessagesQuery,
  useSendMessageMutation,
  useCreateChatRoomMutation,
  useGetRoomWithUserQuery,
  useMarkAsReadMutation,
} = chatApi; 