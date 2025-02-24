import { Message } from "@/types/chat";
import { useGetPostQuery } from "@/services/postApi";

interface ChatMessageProps {
  message: Message;
  isSender: boolean;
  senderAvatar?: string;
  receiverAvatar?: string;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ 
  message, 
  isSender,
  senderAvatar = "/avators/1.png",
  receiverAvatar = "/avators/2.png"
}) => {
  const { data: post } = useGetPostQuery(message.postId || '', {
    skip: message.messageType !== 'post'
  });

  const renderMessageContent = () => {
    switch (message.messageType) {
      case 'post':
        return (
          <div className="bg-base-100 rounded-lg p-2">
            <div className="flex items-center">
              <img
                src={post?.images.FRONT ?? undefined}
                alt={post?.title}
                className="w-16 h-16 object-cover rounded"
              />
              <div className="ml-2">
                <p className="font-medium">{post?.title}</p>
                <p className="text-sm">${post?.price.amount}</p>
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

  return (
    <div className={`chat ${isSender ? 'chat-end' : 'chat-start'} mb-4`}>
      <div className="chat-image avatar">
        <div className="w-10 rounded-full">
          <img src={isSender ? senderAvatar : receiverAvatar} alt="avatar" />
        </div>
      </div>
      <div className="chat-header">
        {isSender ? 'You' : 'Seller'}
        <time className="text-xs opacity-50 ml-2">
          {new Date(message.createdAt).toLocaleTimeString()}
        </time>
      </div>
      <div className={`chat-bubble ${isSender ? 'chat-bubble-primary' : ''}`}>
        {renderMessageContent()}
      </div>
      <div className="chat-footer opacity-50">
        {/* 可以添加消息状态，比如已读/未读 */}
        {isSender ? 'Sent' : 'Received'}
      </div>
    </div>
  );
};

export default ChatMessage; 