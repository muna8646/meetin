import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import { roomHandler } from './handlers/roomHandler.js';
import { userHandler } from './handlers/userHandler.js';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

// In-memory storage (replace with a database in production)
const rooms = new Map();
const users = new Map();

// REST API endpoints
app.post('/api/rooms', (req, res) => {
  const roomId = uuidv4();
  const room = {
    id: roomId,
    participants: [],
    createdAt: new Date(),
    hostId: req.body.hostId
  };
  
  rooms.set(roomId, room);
  res.json({ roomId, room });
});

app.get('/api/rooms/:roomId', (req, res) => {
  const room = rooms.get(req.params.roomId);
  if (!room) {
    return res.status(404).json({ error: 'Room not found' });
  }
  res.json(room);
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Handle room-related events
  roomHandler(io, socket, rooms);
  
  // Handle user-related events
  userHandler(io, socket, users);

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    // Clean up user data
    users.delete(socket.id);
    // Notify rooms where the user was participating
    rooms.forEach(room => {
      if (room.participants.includes(socket.id)) {
        room.participants = room.participants.filter(id => id !== socket.id);
        io.to(room.id).emit('participant-left', { userId: socket.id });
      }
    });
  });
});

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});