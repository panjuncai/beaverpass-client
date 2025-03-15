import { useAuth } from "@/hooks/useAuth";
import {
  useGetChatMessagesQuery,
  useSendMessageMutation,
  useMarkAsReadMutation,
} from "@/services/chatApi";
import { useLocation } from "react-router-dom";
import CenteredLoading from "@/components/CenterLoading";
import { ChatRoom, Message } from "@/types/chat";
import ChatMessage from "@/components/ChatMessage/ChatMessage";
import { useState, useRef, useEffect } from "react";
import { useSocket } from "@/hooks/useSocket";
import { useDispatch } from 'react-redux';
import { chatApi } from '@/services/chatApi';
import { TAGS } from "@/services/api";

const TAG_TYPE = TAGS.Chat;

const Chat: React.FC = () => {
  const { session } = useAuth();
  const { state } = useLocation() as { state: { chatRoom: ChatRoom } };
  const { chatRoom } = state;
  const { 
    data: messages, 
    isLoading, 
    refetch: refetchMessages 
  } = useGetChatMessagesQuery(
    chatRoom?._id ?? "",
    {
      skip: !chatRoom?._id,
    }
  );
  const [localMessages, setLocalMessages] = useState<Message[]>([]);
  const [sendMessage] = useSendMessageMutation();
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [markAsRead] = useMarkAsReadMutation();
  const socket = useSocket();
  const currentUserUnreadCount =
    chatRoom.participants.find((p) => p._id === session?.user?.id)?.unreadCount ||
    0;
  const dispatch = useDispatch();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "instant" });
  };

  // 在组件挂载和 chatRoom 变化时重新获取消息
  useEffect(() => {
    if (chatRoom?._id) {
      void refetchMessages();
    }
  }, [chatRoom?._id, refetchMessages]);

  // 修改初始化本地消息列表的逻辑
  useEffect(() => {
    if (messages) {
      // console.log("Received messages from API:", messages.length);
      setLocalMessages(messages);
      // 使用 setTimeout 确保在 DOM 更新后滚动
      setTimeout(() => {
        scrollToBottom();
      }, 100);
    }
  }, [messages]);

  // 添加一个额外的 useEffect 来确保在组件挂载和更新后滚动到底部
  useEffect(() => {
    if (localMessages.length > 0) {
      // 使用 setTimeout 确保在 DOM 更新后滚动
      setTimeout(() => {
        scrollToBottom();
      }, 100);
    }
  }, [localMessages]);

  // 添加一个 useEffect 在组件挂载后滚动到底部
  useEffect(() => {
    // 组件挂载后滚动到底部
    setTimeout(() => {
      scrollToBottom();
    }, 300);
  }, []);

  // Socket.IO 事件监听
  useEffect(() => {
    if (!socket) return;

    if (!session?.user?.id) return;

    // 加入聊天室时发送更多信息
    socket.emit("join_room", {
      roomId: chatRoom._id,
      userId: session?.user?.id,
    });

    // 监听其他用户的在线状态
    socket.on(
      "user_status",
      (data: {
        userId: string;
        roomId: string;
        status: "online" | "offline";
      }) => {
        if (data.roomId === chatRoom._id && data.userId !== session?.user?.id) {
          // console.log(`Other user is ${data.status}`);

          // 如果对方上线，可以自动标记我们发送的消息为已读
          if (data.status === "online") {
            // 可以在这里触发标记已读
            setTimeout(() => {
              socket.emit("mark_read", {
                roomId: chatRoom._id,
                userId: data.userId,
              });
            }, 500);
          }
        }
      }
    );

    // 监听新消息
    socket.on(
      "new_message",
      (data: {
        message: Message;
        receiverOnline: boolean;
        senderId: string;
        receiverId: string;
      }) => {
        console.log(`new_message data: ${JSON.stringify(data)}`);
        if (data.message.roomId === chatRoom._id) {
          // 添加消息到本地列表
          setLocalMessages((prev) => [...prev, data.message]);
          
          // 如果我是接收者且在线，自动标记为已读
          if (data.receiverId === session?.user?.id) {
            // 短暂延迟确保消息已显示
            setTimeout(() => {
              socket.emit("mark_read", {
                roomId: chatRoom._id,
                userId: session?.user?.id,
              });
            }, 500);
          }
          
          // 滚动到底部
          scrollToBottom();
        }
      }
    );

    // 添加消息已读状态监听
    socket.on("messages_read", (data: { roomId: string; userId: string }) => {
      if (data.roomId === chatRoom._id) {
        // 更新本地消息的已读状态
        setLocalMessages((prev) =>
          prev.map((msg) => ({
            ...msg,
            readBy: msg.readBy.includes(data.userId)
              ? msg.readBy
              : [...msg.readBy, data.userId],
          }))
        );
      }
    });

    return () => {
      socket.emit("leave_room", {
        roomId: chatRoom._id,
        userId: session?.user?.id,
      });
      socket.off("new_message");
      socket.off("user_status");
      socket.off("messages_read");
    };
  }, [socket, chatRoom._id, session?.user?.id]);

  // 在组件挂载时清除缓存
  useEffect(() => {
    if (chatRoom?._id) {
      // 清除特定聊天室的消息缓存
      dispatch(
        chatApi.util.invalidateTags([TAG_TYPE])
      );
    }
    
    return () => {
      // 组件卸载时也清除缓存
      dispatch(
        chatApi.util.invalidateTags([TAG_TYPE])
      );
    };
  }, [chatRoom?._id, dispatch]);

  // 在 useGetChatMessagesQuery 之后添加日志
  // useEffect(() => {
  //   console.log("Chat room ID:", chatRoom?._id);
  //   console.log("Messages loading:", isLoading);
  //   console.log("Messages data:", messages);
  // }, [chatRoom?._id, isLoading, messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    if (!session?.user?.id) return;

    try {
      // 获取对方用户ID
      const otherParticipantId = chatRoom.participants.find(
        (p) => p._id !== session?.user?.id
      )?._id;

      // 如果 otherParticipantId 为空，直接返回
      if (!otherParticipantId) return;

      const message = await sendMessage({
        roomId: chatRoom._id,
        content: newMessage.trim(),
        messageType: "text",
      }).unwrap();

      
      if(message){
        // 发送消息时包含房间信息和接收者ID
        socket?.emit("send_message", {
          roomId: chatRoom._id,
          message,
          senderId: session?.user?.id
        });
      }

      setNewMessage("");
      scrollToBottom();
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  // 处理已读逻辑
  useEffect(() => {
    const handleMarkAsRead = async () => {
      console.log("currentUserUnreadCount:", currentUserUnreadCount);
      if (currentUserUnreadCount > 0) {
        try {
          await markAsRead(chatRoom._id).unwrap();
          // 发送已读状态到 socket
          socket?.emit("mark_read", {
            roomId: chatRoom._id,
            userId: session?.user?.id,
          });
        } catch (error) {
          console.error("Failed to mark messages as read:", error);
        }
      }
    };

    void handleMarkAsRead();
  }, [
    chatRoom._id,
    currentUserUnreadCount,
    markAsRead,
    socket,
    session?.user?.id,
  ]);

  if (isLoading) return <CenteredLoading />;

  return (
    <div className="h-full flex flex-col">
      {/* 消息列表容器 */}
      <div className="flex-1 overflow-y-auto p-4">
        {localMessages?.map((message) => (
          <ChatMessage
            key={message._id}
            message={message}
            isSender={message.senderId._id === session?.user?.id}
          />
        ))}
        <div ref={messagesEndRef} />
        <div className="h-1"></div>
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
              if (e.key === "Enter" && !e.shiftKey) {
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
