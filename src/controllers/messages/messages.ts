import { Request, Response } from 'express';
import MessageModel, { IMessage } from '../../models/messages/messages';

// Function to create a new message
export const createMessage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { sender_id, receiver_id, message_text } = req.body;
    const newMessage = new MessageModel({
      sender_id,
      receiver_id,
      message_text
    });
    const savedMessage = await newMessage.save();
    res.status(201).json({status: 201, success: true, savedMessage});
    console.log("Message saved successfully");
  } catch (error) {
    console.error('Error saving message:', error);
    res.status(500).json({status: 500, success: false, message: 'Internal Server Error' });
  }
};

// Function to fetch unread message count for a user
export const unreadMessages = async (req: Request, res: Response): Promise<void> => {
  const receiverId = req.params.receiverId;

  try {
    if(!receiverId){
        res.status(409).json({ status: 409, success: false, message: 'Receiver id not found '});
      }
    const unreadCount = await MessageModel.getUnreadMessageCount(receiverId);
    res.status(200).json({ status: 200, success: true, data: unreadCount });
  } catch (error) {
    console.error('Failed to fetch unread message count:', error);
    res.status(500).json({status: 500, success: false, error: 'Failed to fetch unread message count' });
  }
};
