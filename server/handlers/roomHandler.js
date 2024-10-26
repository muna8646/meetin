export const roomHandler = (io, socket, rooms) => {
  const joinRoom = ({ roomId, userId, userName }) => {
    const room = rooms.get(roomId);
    if (!room) {
      socket.emit('error', { message: 'Room not found' });
      return;
    }

    // Join the socket room
    socket.join(roomId);
    
    // Add participant to room
    room.participants.push({
      id: userId,
      name: userName,
      socketId: socket.id
    });

    // Notify others in the room
    socket.to(roomId).emit('participant-joined', {
      userId,
      userName
    });

    // Send current participants list to the new joiner
    socket.emit('room-participants', {
      participants: room.participants
    });
  };

  const leaveRoom = ({ roomId, userId }) => {
    const room = rooms.get(roomId);
    if (room) {
      room.participants = room.participants.filter(p => p.id !== userId);
      socket.leave(roomId);
      io.to(roomId).emit('participant-left', { userId });

      // If room is empty, clean it up
      if (room.participants.length === 0) {
        rooms.delete(roomId);
      }
    }
  };

  const broadcastMessage = ({ roomId, message, userId }) => {
    io.to(roomId).emit('chat-message', {
      userId,
      message,
      timestamp: new Date()
    });
  };

  // Handle video/audio streams
  const streamUpdate = ({ roomId, userId, streamType, active }) => {
    io.to(roomId).emit('stream-update', {
      userId,
      streamType, // 'audio' or 'video'
      active
    });
  };

  // Register event handlers
  socket.on('join-room', joinRoom);
  socket.on('leave-room', leaveRoom);
  socket.on('send-message', broadcastMessage);
  socket.on('stream-update', streamUpdate);
};