import DurianModel from '../models/DurianModel.js';
import ChatService from '../services/ChatService.js';

class ChatController {
  async chat(req, res) {
    try {
      const { message, sessionId } = req.body;

      if (!message || message.trim() === '') {
        return res.status(400).json({ 
          error: 'กรุณาส่งข้อความมาด้วยครับ' 
        });
      }

      // ใช้ sessionId จาก request หรือสร้างใหม่
      const session = sessionId || `session_${Date.now()}`;

      const response = await ChatService.processMessage(message, session);

      res.json({
        success: true,
        sessionId: session,
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

  async clearHistory(req, res) {
    try {
      const { sessionId } = req.body;

      if (!sessionId) {
        return res.status(400).json({ 
          error: 'กรุณาระบุ sessionId' 
        });
      }

      const success = await ChatService.clearHistory(sessionId);

      res.json({
        success,
        message: success ? 'ลบประวัติการสนทนาสำเร็จ' : 'ไม่พบประวัติการสนทนา'
      });
    } catch (error) {
      console.error('Clear history error:', error);
      res.status(500).json({ 
        error: 'เกิดข้อผิดพลาดในการลบประวัติ' 
      });
    }
  }

  async getHistory(req, res) {
    try {
      const { sessionId } = req.params;

      if (!sessionId) {
        return res.status(400).json({ 
          error: 'กรุณาระบุ sessionId' 
        });
      }

      const history = await ChatService.getHistory(sessionId);

      res.json({
        success: true,
        sessionId,
        history
      });
    } catch (error) {
      console.error('Get history error:', error);
      res.status(500).json({ 
        error: 'เกิดข้อผิดพลาดในการดึงประวัติ' 
      });
    }
  }
}

export default new ChatController();
