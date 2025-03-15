import { Message } from "@/types/chat";
import { useGetPostById } from "@/hooks/usePost";
import { formatDistanceToNow } from "date-fns";
import { enUS } from "date-fns/locale";

interface ChatMessageProps {
  message: Message;
  isSender: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ 
  message, 
  isSender
}) => {
  const { post } = useGetPostById(message.postId);
  const renderMessageContent = () => {
    // console.log(`render message: ${JSON.stringify(message)}`);
    switch (message.messageType) {
      case 'post':
        return (
          <div className="bg-base-100 rounded-lg p-2">
            <div className="flex items-center">
              <img
                src={post?.images?.[0]?.imageUrl ?? ''}
                alt={post?.title}
                className="w-16 h-16 object-cover rounded"
              />
              <div className="ml-2">
                <p className="font-medium">{post?.title}</p>
                <p className="text-sm">${post?.amount}</p>
              </div>
            </div>
          </div>
        );
      case 'image':
        return (
          <img
            src={message.content}
            alt="chat image"
            className="max-w-[200px] rounded-lg"
          />
        );
      default:
        return <p>{message.content}</p>;
    }
  };

  // 检查消息是否已读（对方已读）
  const isRead = () => {
    if (!isSender) return false; // 只有发送者需要显示已读状态
    
    // 检查消息是否被接收者读取
    const otherParticipants = message.readBy.filter(id => id !== message.senderId._id);
    return otherParticipants.length > 0;
  };

  return (
    <div className={`chat ${isSender ? 'chat-end' : 'chat-start'} mb-4`}>
      <div className="chat-header">
        <time className="text-xs opacity-50 ml-2">
          {message.createdAt && formatDistanceToNow(new Date(message.createdAt), {
            addSuffix: true,
            locale: enUS
          })}
        </time>
      </div>
      <div className={`chat-bubble ${isSender ? 'chat-bubble-primary' : ''}`}>
        {renderMessageContent()}
      </div>
      {isSender && (
        <div className="chat-footer opacity-50 mt-1">
          {isRead() ? 'read' : 'unread'}
        </div>
      )}
    </div>
  );
};

export default ChatMessage; 