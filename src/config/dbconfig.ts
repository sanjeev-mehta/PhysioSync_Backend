require('dotenv').config();
import mongoose from 'mongoose';

const MONGO_URL = process.env.MONGO_URL;

const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URL);
        console.log('Database connected');
    } catch (error) {
        console.error('Database connection error:', error);
    }
};

export default connectDB;
