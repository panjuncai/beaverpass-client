import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './useAuth';

export const useSocket = () => {
  const { loginUser } = useAuth();
  const socketRef = useRef<Socket>();

  useEffect(() => {
    // 确保用户已登录
    if (!loginUser?._id) return;
    const SOCKET_API_URI = import.meta.env.VITE_SOCKET_API_URI;
    // console.log(API_URI);
    // 创建 socket 连接
    const socket = io(SOCKET_API_URI, {
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