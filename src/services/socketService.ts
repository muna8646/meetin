import { io, Socket } from 'socket.io-client';

class SocketService {
  private socket: Socket | null = null;
  private static instance: SocketService;

  private constructor() {}

  static getInstance(): SocketService {
    if (!SocketService.instance) {
      SocketService.instance = new SocketService();
    }
    return SocketService.instance;
  }

  connect(userId: string, userName: string) {
    this.socket = io('http://localhost:3000', {
      query: { userId, userName }
    });

    this.socket.on('connect', () => {
      console.log('Connected to server');
    });

    this.socket.on('error', (error) => {
      console.error('Socket error:', error);
    });

    return this.socket;
  }

  joinRoom(roomId: string, userId: string, userName: string) {
    if (!this.socket) return;
    
    this.socket.emit('join-room', { roomId, userId, userName });
  }

  leaveRoom(roomId: string, userId: string) {
    if (!this.socket) return;
    
    this.socket.emit('leave-room', { roomId, userId });
  }

  updateStream(roomId: string, userId: string, streamType: 'audio' | 'video', active: boolean) {
    if (!this.socket) return;
    
    this.socket.emit('stream-update', { roomId, userId, streamType, active });
  }

  sendMessage(roomId: string, userId: string, message: string) {
    if (!this.socket) return;
    
    this.socket.emit('send-message', { roomId, userId, message });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

export default SocketService.getInstance();