

import express from 'express';
import { createMessage } from '../../controllers/messages/messages';

const router = express.Router();

// Route to create a new message
router.post('/new_messages', createMessage);

// Route to get all messages
// router.get('/messages', getAllMessages);

export default router;
