import express from 'express';
import ChatController from '../controllers/ChatController.js';

const router = express.Router();

router.post('/chat', ChatController.chat.bind(ChatController));
router.post('/chat/clear', ChatController.clearHistory.bind(ChatController));
router.get('/chat/history/:sessionId', ChatController.getHistory.bind(ChatController));
router.get('/stages', ChatController.getStages.bind(ChatController));

export default router;
