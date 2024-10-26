import { useEffect, useCallback } from 'react';
import socketService from '../services/socketService';

export const useSocket = (roomId: string, userId: string, userName: string) => {
  useEffect(() => {
    const socket = socketService.connect(userId, userName);

    socket.on('participant-joined', (data) => {
      console.log('New participant joined:', data);
    });

    socket.on('participant-left', (data) => {
      console.log('Participant left:', data);
    });

    socket.on('chat-message', (data) => {
      console.log('New message:', data);
    });

    socket.on('stream-update', (data) => {
      console.log('Stream update:', data);
    });

    return () => {
      socketService.disconnect();
    };
  }, [roomId, userId, userName]);

  const joinRoom = useCallback(() => {
    socketService.joinRoom(roomId, userId, userName);
  }, [roomId, userId, userName]);

  const leaveRoom = useCallback(() => {
    socketService.leaveRoom(roomId, userId);
  }, [roomId, userId]);

  const sendMessage = useCallback((message: string) => {
    socketService.sendMessage(roomId, userId, message);
  }, [roomId, userId]);

  const updateStream = useCallback((streamType: 'audio' | 'video', active: boolean) => {
    socketService.updateStream(roomId, userId, streamType, active);
  }, [roomId, userId]);

  return {
    joinRoom,
    leaveRoom,
    sendMessage,
    updateStream
  };
};