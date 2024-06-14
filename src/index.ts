import express from 'express';
import http from 'http';
import bodyparser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';
import { Server, Socket } from 'socket.io';
import mongoose from 'mongoose'; 

import router from './router/index';
import connectDB from './config/dbconfig';
import exerciseCategoryRoutes from './router/exercise/exercise_category_routes';
import exercisesRoutes from './router/exercise/exercises_routes';
import allcategories from './router/exercise/exercise_category_routes';
import messageRoutes from './router/messages/messages';
import path from 'path';
import patientRoutes from './router/Patient/patientRoutes';
import MessageModel from './models/messages/messages'; 
import Patient from './models/Patient/patientModel';


const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://127.0.0.1:5500",
    methods: ["GET", "POST"]
  }
});

interface User {
  [key: string]: string;
}

const users: User = {};

io.on('connection', (socket: Socket) => {
  console.log('A user connected:', socket.id);

  socket.on('new-user-joined', (userId: string) => {
    console.log("New user joined:", userId);
    users[userId] = socket.id;;
    socket.broadcast.emit('user-joined', userId);
  });

  socket.on('send', async (data: { senderId: string, receiverId: string, message: string }) => {
    const { senderId, receiverId, message } = data;

    try {
      const newMessage = await MessageModel.create({
        sender_id: senderId,
        receiver_id: receiverId,
        message_text: message,
      });
      console.log('Message saved to database:', newMessage);
    } catch (error) {
      console.error('Error saving message to database:', error);
    }
    console.log(message, senderId);

    const receiverSocketId = users[receiverId]; // Get the socket ID for the receiver
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('receive', { sender: senderId, message });
    }
  });

  socket.on('disconnect', () => {
    const userId = Object.keys(users).find(key => users[key] === socket.id);
    if (userId) {
      console.log(`${userId} left`);
      socket.broadcast.emit('left', userId);
      delete users[userId]; 
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
app.use('/api', exerciseCategoryRoutes);
app.use('/api', exercisesRoutes);
app.use('/api', allcategories);
app.use('/api', messageRoutes);
app.use('/api', patientRoutes);


const PORT = process.env.myPort;

const startServer = async () => {
  await connectDB();

  server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}/`);
  });
};

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});