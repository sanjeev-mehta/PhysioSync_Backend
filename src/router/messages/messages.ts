

import  { Router } from 'express';
import { createMessage } from '../../controllers/messages/messages';

export default (router: Router) => {

// Route to create a new message
router.post('/new_messages', createMessage);

// Route to get all messages
// router.get('/messages', getAllMessages);
}
