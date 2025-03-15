import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './useAuth';

export const useSocket = () => {
  const { session } = useAuth();
  const socketRef = useRef<Socket>();

  useEffect(() => {
    // 确保用户已登录
    if (!session?.user?.id) return;
    const SOCKET_API_URI = import.meta.env.VITE_SOCKET_API_URI as string;
    // console.log(API_URI);
    // 创建 socket 连接
    const socket = io(SOCKET_API_URI, {
      auth: {
        userId: session?.user?.id
      }
    });

    // 连接事件处理
    socket.on('connect', () => {
      console.log('Socket connected');
    });

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    // 添加在线状态监听
    socket.on('user_status', (data: { userId: string; roomId: string; status: 'online' | 'offline' }) => {
      console.log(`User ${data.userId} is ${data.status} in room ${data.roomId}`);
    });

    socketRef.current = socket;

    // 清理函数
    return () => {
      socket.disconnect();
    };
  }, [session?.user?.id]);

  return socketRef.current;
}; 