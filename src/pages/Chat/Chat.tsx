import { useAuth } from "@/hooks/useAuth";
import { useGetChatMessagesQuery, useSendMessageMutation, useMarkAsReadMutation } from "@/services/chatApi";
import { useLocation } from "react-router-dom";
import CenteredLoading from "@/components/CenterLoading";
import { ChatRoom, Message } from "@/types/chat";
import ChatMessage from "@/components/ChatMessage/ChatMessage";
import { useState, useRef, useEffect } from "react";
import { useSocket } from "@/hooks/useSocket";

const Chat: React.FC = () => {
  const { loginUser } = useAuth();
  const { state } = useLocation() as { state: { chatRoom: ChatRoom } };
  const { chatRoom } = state;
  const { data: messages, isLoading } = useGetChatMessagesQuery(chatRoom?._id);
  const [localMessages, setLocalMessages] = useState<Message[]>([]);
  const [sendMessage] = useSendMessageMutation();
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [markAsRead] = useMarkAsReadMutation();
  const socket = useSocket();
  const currentUserUnreadCount = chatRoom.participants.find(
    p => p._id === loginUser?._id
  )?.unreadCount || 0;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "instant" });
  };

  // 初始化本地消息列表
  useEffect(() => {
    if (messages) {
      setLocalMessages(messages);
    }
  }, [messages]);


  
  // Socket.IO 事件监听
  useEffect(() => {
    if (!socket) return;

    // 监听新消息
    socket.on('new_message', (newMessage: Message) => {
      if (newMessage.roomId === chatRoom._id) {
        setLocalMessages(prev => [...prev, newMessage]);
        scrollToBottom();
      }
    });

    // 监听消息已读状态
    socket.on('message_read', (data: { roomId: string; userId: string }) => {
      if (data.roomId === chatRoom._id) {
        // 可以在这里更新消息的已读状态
        // 或者直接触发重新获取消息列表
      }
    });

    return () => {
      socket.off('new_message');
      socket.off('message_read');
    };
  }, [socket, chatRoom._id]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const message = await sendMessage({
        roomId: chatRoom._id,
        content: newMessage.trim(),
        messageType: 'text'
      }).unwrap();

      // 发送 socket 事件
      socket?.emit('send_message', {
        roomId: chatRoom._id,
        message
      });

      setNewMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  // 处理已读逻辑
  useEffect(() => {
    const handleMarkAsRead = async () => {
      if (currentUserUnreadCount > 0) {
        try {
          await markAsRead(chatRoom._id).unwrap();
          // 发送已读状态到 socket
          socket?.emit('mark_read', {
            roomId: chatRoom._id,
            userId: loginUser?._id
          });
        } catch (error) {
          console.error('Failed to mark messages as read:', error);
        }
      }
    };

    void handleMarkAsRead();
  }, [chatRoom._id, currentUserUnreadCount, markAsRead, socket, loginUser?._id]);

  if (isLoading) return <CenteredLoading />;

  return (
    <div className="h-full flex flex-col">
      {/* 消息列表容器 */}
      <div className="flex-1 overflow-y-auto p-4">
        {localMessages?.map((message) => (
          <ChatMessage
            key={message._id}
            message={message}
            isSender={message.senderId._id === loginUser?._id}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>
      {/* 发送消息框 */}
      <div className="p-2">
        <div className="flex items-center gap-2 max-w-4xl mx-auto">
          <input
            type="text"
            placeholder="Type a message..."
            className="input input-bordered flex-1"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                void handleSendMessage();
              }
            }}
          />
          <button 
            className="btn btn-circle btn-primary"
            onClick={() => void handleSendMessage()}
            disabled={!newMessage.trim()}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              className="w-6 h-6"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M5 12h14M12 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat; 