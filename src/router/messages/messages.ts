import  { Router } from 'express';
import { createChat, createMessage, findChat, findUserChats, getMessages, unreadMessages } from '../../controllers/messages/messages';

export default (router: Router) => {
        router.post('/new_messages', createMessage);
        router.get('/unread_count/:receiverId', unreadMessages);
        router.post("/create-chat", createChat);
        router.get("/:userId", findUserChats);
        router.get("/find/:firstId/:secondId", findChat);
        router.get("/get-message/:chatId", getMessages);
}
