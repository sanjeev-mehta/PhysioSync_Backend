import { Request, Response } from 'express';
import { ChatModel, MessageModel } from '../../models/messages/messages';

export const createMessage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { sender_id, receiver_id, message_text, } = req.body;
    
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

export const getMessages = async (req: Request, res: Response): Promise<void> => {

  const {chatId} = req.params

  try{
      const message = await MessageModel.find({ chat_id: chatId });

      res.status(200).json(message)
  }catch(error){
      console.log(error);
      res.status(500).json(error)
  }
}


export const createChat = async (req: Request, res: Response): Promise<void> => {
   
  const {firstId, secondId} = req.body;

  try {
      const chat = await ChatModel.findOne({
          members: {$all: [firstId, secondId]}
      });

      if(chat){
        res.status(200).json(chat) 
        return
      }  

      const newChat = new ChatModel({
          members: [firstId, secondId]
      });

      const response = await newChat.save();

      res.status(200).json(response);

  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }

};


export const findUserChats = async (req: Request, res: Response): Promise<void> =>{
  const userId = req.params.userId;

  console.log(userId)

  try{
      const chats = await ChatModel.find({
          members: {$in: [userId]}
      })

      res.status(200).json(chats);

  }catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

export const findChat = async (req: Request, res: Response): Promise<void> => {
  const {firstId, secondId}  = req.params;

  try{
      const chat = await ChatModel.findOne({
          members: {$all: [firstId, secondId]}
      });

      res.status(200).json(chat);

  }catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
}