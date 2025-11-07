import '../config/env.js'; // โหลด env ก่อน
import { GoogleGenerativeAI } from '@google/generative-ai';
import DurianModel from '../models/DurianModel.js';
import HistoryManager from '../utils/HistoryManager.js';

class ChatService {
  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      console.error('❌ GEMINI_API_KEY not found in environment variables');
      throw new Error('GEMINI_API_KEY not found in environment variables');
    }
    
    console.log('✅ ChatService initialized with API key');
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  async processMessage(message, sessionId = 'default') {
    // โหลด history จากไฟล์
    const history = await HistoryManager.loadHistory(sessionId);
    
    // โหลดข้อมูลทุเรียนทั้งหมด
    const durianData = await DurianModel.getAllStages();
    
    // สร้าง system instruction
    const systemInstruction = `คุณเป็นผู้เชี่ยวชาญด้านการดูแลทุเรียน

ข้อมูลการดูแลทุเรียน:
${JSON.stringify(durianData, null, 2)}

กฎในการตอบ:
1. ตอบเป็นภาษาไทยที่เป็นกันเอง สุภาพ
2. ใช้ข้อมูลจากฐานข้อมูลที่ให้ไปเท่านั้น ห้ามแต่งเพิ่ม
3. ถ้าถามเฉพาะเรื่องน้ำ ให้ตอบแค่เรื่องน้ำ
4. ถ้าถามเฉพาะเรื่องปุ๋ย ให้ตอบแค่เรื่องปุ๋ย
5. ใช้ emoji ให้เหมาะสม เช่น 💧 สำหรับน้ำ, 🌱 สำหรับปุ๋ย
6. จัดรูปแบบให้อ่านง่าย
7. **สำคัญ: จำบทสนทนาก่อนหน้านี้ได้ ถ้าถามว่า "ก่อนหน้านี้ถามอะไร" ให้บอกคำถามที่เคยถามไป**`;

    // สร้าง model พร้อม safety settings
    const model = this.genAI.getGenerativeModel({
      model: 'gemini-2.0-flash-exp',
      safetySettings: [
        {
          category: 'HARM_CATEGORY_HARASSMENT',
          threshold: 'BLOCK_NONE',
        },
        {
          category: 'HARM_CATEGORY_HATE_SPEECH',
          threshold: 'BLOCK_NONE',
        },
      ],
    });

    // สร้าง chat history สำหรับ AI
    const chatHistory = [
      {
        role: 'user',
        parts: [{ text: systemInstruction }]
      },
      {
        role: 'model',
        parts: [{ text: 'เข้าใจครับ ผมพร้อมตอบคำถามเกี่ยวกับการดูแลทุเรียน และจะจำบทสนทนาทั้งหมดไว้ครับ' }]
      }
    ];

    // เพิ่ม history เก่าเข้าไป
    if (history.length > 0) {
      console.log(`📚 Loading ${history.length} previous messages for session: ${sessionId}`);
      history.forEach(msg => {
        chatHistory.push({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.content }]
        });
      });
    }

    // สร้าง chat session พร้อม history
    const chat = model.startChat({
      history: chatHistory,
      generationConfig: {
        maxOutputTokens: 1000,
        temperature: 0.7,
      },
    });

    // ส่งข้อความและรับคำตอบ
    const result = await chat.sendMessage(message);
    const response = result.response;
    const text = response.text();

    // บันทึก history
    history.push({ role: 'user', content: message, timestamp: new Date().toISOString() });
    history.push({ role: 'model', content: text, timestamp: new Date().toISOString() });

    // จำกัด history ไม่ให้เยอะเกินไป (เก็บแค่ 20 ข้อความล่าสุด)
    const limitedHistory = history.length > 20 ? history.slice(-20) : history;

    // บันทึกลงไฟล์
    await HistoryManager.saveHistory(sessionId, limitedHistory);

    return text;
  }

  async clearHistory(sessionId) {
    return await HistoryManager.clearHistory(sessionId);
  }

  async getHistory(sessionId) {
    return await HistoryManager.loadHistory(sessionId);
  }

}

export default new ChatService();
