import DurianModel from '../models/DurianModel.js';
import ChatService from '../services/ChatService.js';

class ChatController {
  async chat(req, res) {
    try {
      const { message } = req.body;

      if (!message || message.trim() === '') {
        return res.status(400).json({ 
          error: 'กรุณาส่งข้อความมาด้วยครับ' 
        });
      }

      const response = await ChatService.processMessage(message);

      res.json({
        success: true,
        userMessage: message,
        botResponse: response
      });
    } catch (error) {
      console.error('Chat error:', error);
      res.status(500).json({ 
        error: 'เกิดข้อผิดพลาดในการประมวลผล กรุณาลองใหม่อีกครั้งครับ' 
      });
    }
  }

}

export default new ChatController();
