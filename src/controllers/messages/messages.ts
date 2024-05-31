import { Request, Response } from 'express';
import MessageModel from '../../models/messages/messages';


// Controller function to save a new message
export const createMessage = async (req: Request, res: Response): Promise<void> => {
    try {
        const { sender_id, receiver_id, message_text } = req.body;
        const newMessage = new MessageModel({
            sender_id,
            receiver_id,
            message_text
        });
        const savedMessage = await newMessage.save();
        res.status(201).json(savedMessage);
        console.log("message saved successfully");
    } catch (error) {
        console.error('Error saving message:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};