import express from 'express';
import http from 'http';
import bodyparser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';
import { Server, Socket } from 'socket.io';
import router from './router/index';
import connectDB from './config/dbconfig';
import MessageModel from './models/messages/messages';


const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins or specify your frontend origin
    methods: ["GET", "POST"]
  }
});

interface User {
  [key: string]: string;
}

const users: User = {};

const onlineUsers: Set<string> = new Set();

const updateOnlineUsers = () => {
  io.emit('onlineUsers', Array.from(onlineUsers));
};

io.on('connection', (socket: Socket) => {
  console.log('A user connected:', socket.id);

  socket.on('register', (userId) => {
    // users[userId] = socket.id;
  onlineUsers.add(userId);
    socket.join(userId);
    console.log(`User ${userId} joined room ${userId}`);
  });

  socket.on('getOnlineUsers', () => {
    socket.emit('onlineUsers', Array.from(onlineUsers));
  });

  socket.on('send', async (data) => {
    const { senderId, receiverId, message, is_media } = data;
    try {
      const newMessage = await MessageModel.create({
        sender_id: senderId,
        receiver_id: receiverId,
        message_text: message,
        is_read: false,
        is_media: is_media
      });
      console.log('Message saved to database:', newMessage);
    } catch (error) {
      console.error('Error saving message to database:', error);
    }

    io.to(receiverId).emit('receive', { sender: senderId, message });
    console.log(`Message sent to receiver ${receiverId}`);
  });

  socket.on('messageRead', async (messageIds) => {
    try {
        await MessageModel.updateMany(
            { _id: { $in: messageIds } },
            { is_read: true }
        );
        console.log(`Messages ${messageIds.join(', ')} marked as read`);
        socket.emit('messageReadResponse', { success: true });
    } catch (error) {
        console.error('Error updating message statuses:', error);
        socket.emit('messageReadResponse', { success: false });
    }
});

  socket.on('fetchPreviousMessages', async (data) => {
    const { senderId, receiverId } = data;
    try {
      const messages = await MessageModel.find({
        $or: [
          { sender_id: senderId, receiver_id: receiverId },
          { sender_id: receiverId, receiver_id: senderId }
        ]
      }).sort({ createdAt: -1 }).limit(100); 
      socket.emit('previousMessages', messages);
      console.log(`Fetched previous messages for ${senderId} and ${receiverId}`);
    } catch (error) {
      console.error('Error fetching previous messages:', error);
    }
  });

  

  socket.on('disconnect', () => {
    const userId = Object.keys(users).find(key => users[key] === socket.id);
    if (userId) {
      delete users[userId];
      onlineUsers.delete(userId);

      console.log(`${userId} left`);
      updateOnlineUsers();

      socket.broadcast.emit('left', userId);
    }
  });
});

app.use(cors({
  credentials: true,
}));

app.use(express.json());
app.use(compression());
app.use(cookieParser());
app.use(bodyparser.json());
app.use('/', router());

const startServer = async () => {
  await connectDB();

  server.listen(8080, '0.0.0.0', () => {
    console.log('Server running on http://35.182.100.191:8080/');
  });
};
startServer().catch((err) => {
  console.error('Failed to start server:', err);
});