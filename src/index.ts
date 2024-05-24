import express from 'express';
import http from 'http';
import bodyparser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';
import router from './router/index'
import connectDB from './config/dbconfig';

const app = express();

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

    const server = http.createServer(app);
    server.listen(8080, () => {
        console.log('Server running on http://localhost:8080/');
    });
};

startServer().catch((err) => {
    console.error('Failed to start server:', err);
});
