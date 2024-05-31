import express from 'express';
import http from 'http';
import bodyparser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';
import { Server, Socket } from 'socket.io';

import router from './router/index';
import connectDB from './config/dbconfig';
import exerciseCategoryRoutes from './router/exercise/exercise_category_routes';
import exercisesRoutes from './router/exercise/exercises_routes';
import allcategories from './router/exercise/exercise_category_routes';
import messageRoutes from './router/messages/messages';
import path from 'path';
import patientRoutes from './router/Patient/patientRoutes';


const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://127.0.0.1:5501",
    methods: ["GET", "POST"]
  }
});

interface User {
  [key: string]: string;
}

const users: User = {};

io.on('connection', (socket: Socket) => {
  socket.on('new-user-joined', (name: string) => {
    console.log("New user joined:", name);
    users[socket.id] = name;
    socket.broadcast.emit('user-joined', name);
  });

  socket.on('send', (message: string) => {
    socket.broadcast.emit('receive', { message, name: users[socket.id] });
  });

  socket.on('disconnect', () => {
    const userName = users[socket.id];
    if (userName) {
      console.log(`${userName} left`);
      socket.broadcast.emit('left', userName);
      delete users[socket.id];
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
app.use('/api',exercisesRoutes);
app.use('/api',allcategories);
app.use('/api', messageRoutes);
app.use('/api', patientRoutes);


const startServer = async () => {
    await connectDB(); 

    server.listen(8080, () => {
        console.log('Server running on http://localhost:8080/');
    });
};

startServer().catch((err) => {
    console.error('Failed to start server:', err);
});
