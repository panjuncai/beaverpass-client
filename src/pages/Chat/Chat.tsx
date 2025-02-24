import { useAuth } from "@/hooks/useAuth";
import { useGetChatMessagesQuery, useSendMessageMutation } from "@/services/chatApi";
import { useLocation } from "react-router-dom";
import CustomNavBar from "@/components/CustomNavBar/CustomNavBar";
import CenteredLoading from "@/components/CenterLoading";
import { ChatRoom } from "@/types/chat";
import ChatMessage from "@/components/ChatMessage/ChatMessage";
import { useState } from "react";

const Chat: React.FC = () => {
  const { loginUser } = useAuth();
  const { state } = useLocation() as { state: { chatRoom: ChatRoom } };
  const { chatRoom } = state;
  const { data: messages, isLoading } = useGetChatMessagesQuery(chatRoom?._id);
  const otherParticipant = chatRoom?.participants.find(p => p._id !== loginUser?._id);
  const [sendMessage] = useSendMessageMutation();
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      await sendMessage({
        roomId: chatRoom._id,
        content: newMessage.trim(),
        messageType: 'text'
      }).unwrap();
      setNewMessage(''); // 清空输入框
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  if (isLoading) return <CenteredLoading />;

  return (
    <div className="flex flex-col h-full">
      <CustomNavBar title="Chat" showBack={true} />
      <div className="flex-1 overflow-auto p-4 pb-20">
        {messages?.map((message) => {
           return <ChatMessage
            key={message._id}
            message={message}
            isSender={message.senderId._id === loginUser?._id}
          />
        })}
      </div>
      
      {/* 发送消息框 */}
      <div className="fixed bottom-12 left-0 right-0 bg-base-100 border-t p-2">
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