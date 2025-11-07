import express from 'express';
import ChatController from '../controllers/ChatController.js';

const router = express.Router();

router.post('/chat', ChatController.chat.bind(ChatController));

export default router;
