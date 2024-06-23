import  { Router } from 'express';
import { createMessage, unreadMessages } from '../../controllers/messages/messages';

export default (router: Router) => {
router.post('/new_messages', createMessage);
router.get('/unread_count/:receiverId', unreadMessages);
}
