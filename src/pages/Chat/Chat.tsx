import { useAuth } from "@/hooks/useAuth";
import { useGetChatMessagesQuery } from "@/services/chatApi";
import { useLocation } from "react-router-dom";
import CustomNavBar from "@/components/CustomNavBar/CustomNavBar";
import CenteredLoading from "@/components/CenterLoading";
import { ChatRoom } from "@/types/chat";
import ChatMessage from "@/components/ChatMessage/ChatMessage";

const Chat: React.FC = () => {
  const { loginUser } = useAuth();
  const { state } = useLocation() as { state: { chatRoom: ChatRoom } };
  const { chatRoom } = state;
  const { data: messages, isLoading } = useGetChatMessagesQuery(chatRoom?._id);

  if (isLoading) return <CenteredLoading />;

  return (
    <div className="flex flex-col h-full">
      <CustomNavBar title="Chat" showBack={true} />
      <div className="flex-1 overflow-auto">
        {messages?.map((message) => (
          <ChatMessage
            key={message._id}
            message={message}
            isSender={message.senderId === loginUser?._id}
          />
        
        ))}
      </div>
    </div>
  );
};

export default Chat; 