import express from 'express';
import ChatController from '../controllers/ChatController.js';

const router = express.Router();

router.post('/chat', ChatController.chat.bind(ChatController));
router.post('/chat/clear', ChatController.clearHistory.bind(ChatController));//ลบ history ส่วนเสริม
router.get('/chat/history/:sessionId', ChatController.getHistory.bind(ChatController));//ดู history ส่วนเสริม

export default router;
