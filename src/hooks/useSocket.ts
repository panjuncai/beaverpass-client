import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './useAuth';

export const useSocket = () => {
  const { loginUser } = useAuth();
  const socketRef = useRef<Socket>();

  useEffect(() => {
    // 确保用户已登录
    if (!loginUser?._id) return;

    // 创建 socket 连接
    const socket = io(import.meta.env.VITE_API_URL, {
      auth: {
        userId: loginUser._id
      }
    });

    // 连接事件处理
    socket.on('connect', () => {
      console.log('Socket connected');
    });

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    socketRef.current = socket;

    // 清理函数
    return () => {
      socket.disconnect();
    };
  }, [loginUser?._id]);

  return socketRef.current;
}; 