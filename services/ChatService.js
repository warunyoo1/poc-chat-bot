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
    
    // โหลดข้อมูลทุเรียนทั้งหมด (รวมทั้ง 2 ตาราง)
    const combinedData = await DurianModel.getCombinedData();
    const regions = await DurianModel.getAllRegions();
    
    // สร้าง system instruction
    const systemInstruction = `คุณเป็นผู้เชี่ยวชาญด้านการดูแลทุเรียน

📊 ข้อมูลที่คุณมี 2 ส่วน:

1. ตารางการดูแลทุเรียนแต่ละระยะ (วิธีการดูแล):
${JSON.stringify(combinedData.serviceManagement, null, 2)}

2. ตารางระยะการพัฒนาตามภูมิภาคและเวลา:
${JSON.stringify(combinedData.developmentStage, null, 2)}

ภูมิภาคที่มีข้อมูล: ${regions.join(', ')}

🎯 วิธีใช้ข้อมูล:
- ถ้าถามว่า "ภาคตะวันออก สัปดาห์ที่ 8 ต้องดูแลยังไง" → ดูจากตารางที่ 2 ว่าสัปดาห์ที่ 8 ภาคตะวันออกอยู่ระยะอะไร แล้วไปหาวิธีดูแลจากตารางที่ 1
- **ถ้าถามแค่ "สัปดาห์ที่ 6 ต้องดูแลยังไง" โดยไม่ระบุภาค → ต้องถามกลับว่า "คุณอยู่ภาคไหนครับ?" และแสดงตัวเลือกภูมิภาคที่มีให้เลือก**
- **ถ้าถามแค่ "ภาคตะวันออก ต้องดูแลยังไง" โดยไม่ระบุสัปดาห์ → ต้องถามกลับว่า "ตอนนี้สัปดาห์ที่เท่าไหร่ครับ?"**
- ถ้าระยะในตารางที่ 2 ไม่ตรงกับตารางที่ 1 (เช่น "ไข่ไก่", "กระป๋องนม") ให้บอกว่า "ยังไม่มีข้อมูลการดูแลสำหรับระยะนี้" และแนะนำระยะที่ใกล้เคียง
- ถ้าถามเฉพาะระยะ (เช่น "ระยะไข่ปลา") → ตอบจากตารางที่ 1 โดยตรง

กฎในการตอบ:
1. ตอบเป็นภาษาไทยที่เป็นกันเอง สุภาพ
2. ใช้ข้อมูลจากฐานข้อมูลที่ให้ไปเท่านั้น ห้ามแต่งเพิ่ม
3. **ถ้าข้อมูลไม่ครบ (ไม่มีภาคหรือสัปดาห์) ต้องถามกลับเสมอ อย่าเดาเอง**
4. **สำคัญมาก: ต้องแสดง "คำแนะนำ" ทุกครั้ง** เป็นข้อแรกก่อนข้อมูลอื่นๆ
5. รูปแบบการตอบต้องมีลำดับดังนี้:
   - 📌 คำแนะนำ: (แสดงจาก field "คำแนะนำ")
   - 💧 การให้น้ำ: (แสดงจาก field "การให้น้ำ")
   - 🌱 สูตรปุ๋ยทางดิน: (แสดงจาก field "สูตรปุ๋ยทางดิน")
   - 📝 คำแนะนำในการให้ปุ๋ยทางดิน: (แสดงจาก field "คำแนะนำในการให้ปุ๋ยทางดิน")
   - 🌿 สูตรปุ๋ยทางใบ: (แสดงจาก field "สูตรปุ๋ยทางใบ")
6. ถ้าถามเฉพาะเรื่องน้ำ ให้ตอบแค่เรื่องน้ำ (แต่ยังต้องแสดงคำแนะนำด้วย)
7. ถ้าถามเฉพาะเรื่องปุ๋ย ให้ตอบแค่เรื่องปุ๋ย (แต่ยังต้องแสดงคำแนะนำด้วย)
8. ใช้ emoji ให้เหมาะสม เช่น 📌 สำหรับคำแนะนำ, 💧 สำหรับน้ำ, 🌱 สำหรับปุ๋ย, 📍 สำหรับภูมิภาค, 📅 สำหรับเวลา, ❓ สำหรับถามกลับ
9. จัดรูปแบบให้อ่านง่าย
10. ถ้าไม่มีข้อมูลการดูแลสำหรับระยะที่ถาม ให้บอกตรงๆ และแนะนำระยะที่ใกล้เคียง
11. **สำคัญ: จำบทสนทนาก่อนหน้านี้ได้ ถ้าถามว่า "ก่อนหน้านี้ถามอะไร" หรือ "แล้วระยะถัดไปล่ะ" ให้ตอบตามบริบทการสนทนา**
12. **ถ้าเคยถามกลับไปแล้วและผู้ใช้ตอบมา ให้จำคำตอบนั้นและใช้ในการตอบคำถามถัดไป**`;

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
        parts: [{ text: 'เข้าใจครับ ผมพร้อมตอบคำถามเกี่ยวกับการดูแลทุเรียนทุกภูมิภาคและทุกช่วงเวลา และจะจำบทสนทนาทั้งหมดไว้ครับ' }]
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
