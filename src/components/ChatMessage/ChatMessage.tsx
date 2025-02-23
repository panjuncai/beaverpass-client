import { Message } from "@/types/chat";
import { useGetPostQuery } from "@/services/postApi";
import PropTypes from 'prop-types';

interface ChatMessageProps {
  message: Message;
  isSender: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, isSender }) => {
  const { data: post } = useGetPostQuery(message.post?._id || '', {
    skip: message.messageType !== 'post'
  });

  const renderMessageContent = () => {
    switch (message.messageType) {
      case 'post':
        return (
          <div className="bg-gray-50 p-2 rounded">
            <div className="flex items-center">
              <img
                src={post?.images.FRONT}
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
            className="max-w-[200px] rounded"
          />
        );
      default:
        return <p>{message.content}</p>;
    }
  };

  return (
    <div className={`flex ${isSender ? 'justify-end' : 'justify-start'} mb-4`}>
      <div
        className={`max-w-[70%] ${
          isSender ? 'bg-primary text-white' : 'bg-gray-100'
        } p-3 rounded-lg`}
      >
        {renderMessageContent()}
        <div className="text-xs mt-1 text-right">
          {new Date(message.createdAt).toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
};

ChatMessage.propTypes = {
  message: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    roomId: PropTypes.string.isRequired,
    senderId: PropTypes.string.isRequired,
    content: PropTypes.string,
    post: PropTypes.shape({
      _id: PropTypes.string.isRequired
    }),
    createdAt: PropTypes.string.isRequired,
    messageType: PropTypes.oneOf(['text', 'image', 'post']).isRequired,
    readBy: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
  isSender: PropTypes.bool.isRequired
};

export default ChatMessage; 