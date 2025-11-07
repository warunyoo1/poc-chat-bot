# Durian Care AI Chatbot Backend

AI Chatbot สำหรับให้คำแนะนำการดูแลทุเรียน พัฒนาด้วย Node.js, Express และ Google Gemini AI ในรูปแบบ MVC Architecture

## 🏗️ โครงสร้างโปรเจค (MVC)

```
├── config/
│   └── env.js                                  # โหลด environment variables
├── models/
│   └── DurianModel.js                          # จัดการข้อมูลจาก data/
├── controllers/
│   └── ChatController.js                       # จัดการ HTTP request/response
├── services/
│   └── ChatService.js                          # Business logic และเชื่อมต่อ Gemini AI
├── routes/
│   └── chatRoutes.js                           # กำหนด API endpoints
├── data/
│   ├── service-management-table.json           # ข้อมูลการดูแลทุเรียน (13 ระยะ)
│   └── development-stage-table.json            # ตารางระยะการพัฒนาตามภูมิภาค
├── server.js                                   # Entry point
├── .env                                        # Environment variables (API keys)
└── package.json                                # Dependencies
```

## 🔄 Flow การทำงาน

### 1. เริ่มต้นระบบ (Server Startup)
```
server.js
  ↓
โหลด config/env.js (โหลด .env)
  ↓
สร้าง Express app
  ↓
เชื่อมต่อ routes/chatRoutes.js
  ↓
เริ่ม HTTP server (port 3000)
```

### 2. การประมวลผลคำถาม (Request Flow)

```
User ส่ง POST /api/chat
  ↓
routes/chatRoutes.js
  ↓
controllers/ChatController.js
  │
  ├─→ ตรวจสอบ request body
  │
  └─→ เรียก services/ChatService.js
        ↓
      1. โหลดข้อมูลจาก models/DurianModel.js
         ↓
      2. DurianModel อ่านข้อมูลจาก data/service-management-table.json
         ↓
      3. สร้าง system instruction พร้อมข้อมูลทุเรียน
         ↓
      4. เชื่อมต่อ Gemini AI (gemini-2.0-flash-exp)
         ↓
      5. ส่งคำถาม + ข้อมูล + history ไปให้ AI
         ↓
      6. AI วิเคราะห์และตอบคำถาม
         ↓
      7. บันทึก history การสนทนา
         ↓
      8. ส่งคำตอบกลับ
         ↓
controllers/ChatController.js
  ↓
ส่ง JSON response กลับไปหา User
```

### 3. โครงสร้าง MVC

**Model (DurianModel.js)**
- จัดการข้อมูลจาก data/service-management-table.json
- ฟังก์ชัน: `getAllStages()`, `findStageByName()`, `searchByKeyword()`

**View**
- ไม่มี (เป็น REST API ส่ง JSON response)

**Controller (ChatController.js)**
- รับ HTTP request
- เรียก Service
- ส่ง HTTP response

**Service (ChatService.js)**
- Business logic หลัก
- เชื่อมต่อ Gemini AI
- จัดการ chat history
- ประมวลผลคำถามและคำตอบ

## 🚀 การติดตั้งและรัน

### 1. ติดตั้ง Dependencies
```bash
npm install
```

### 2. ตั้งค่า Environment Variables
สร้างไฟล์ `.env`:
```env
PORT=3000
NODE_ENV=development
GEMINI_API_KEY=your_gemini_api_key_here
```

**วิธีสร้าง Gemini API Key:**
1. ไปที่ https://aistudio.google.com/app/apikey
2. Login ด้วย Google Account
3. คลิก "Create API Key"
4. Copy API key มาใส่ใน `.env`

### 3. รัน Server
```bash
# Development mode (auto-reload)
npm run dev

# Production mode
npm start
```

Server จะรันที่ http://localhost:3000

## 📡 API Endpoints

### 1. Chat with Bot (หลัก)
**Endpoint:** `POST /api/chat`

**Request:**
```json
{
  "sessionId": "123456789",
  "message": "ภาคใต้ตอนล่าง สัปดาห์ที่ 6 ต้องดูแลยังไง"
}
```

**Response:**
```json
{
  "success": true,
  "sessionId": "123456789",
  "userMessage": "ภาคใต้ตอนล่าง สัปดาห์ที่ 6 ต้องดูแลยังไง",
  "botResponse": "📌 คำแนะนำ: ดูแลให้ออกพัฒนาต่อเนื่อง...\n💧 การให้น้ำ: 100 ลิตร/ต้น/วัน..."
}
```

### 2. Clear Chat History
**Endpoint:** `POST /api/chat/clear`

**Request:**
```json
{
  "sessionId": "123456789"
}
```

**Response:**
```json
{
  "success": true,
  "message": "ลบประวัติการสนทนาสำเร็จ"
}
```

### 3. Get Chat History
**Endpoint:** `GET /api/chat/history/:sessionId`

**Response:**
```json
{
  "success": true,
  "sessionId": "123456789",
  "history": [
    {
      "role": "user",
      "content": "ระยะไข่ปลาต้องดูแลยังไง",
      "timestamp": "2025-11-07T10:00:00.000Z"
    },
    {
      "role": "model",
      "content": "📌 คำแนะนำ: ...",
      "timestamp": "2025-11-07T10:00:01.000Z"
    }
  ]
}
```

### 4. Health Check
**Endpoint:** `GET /`

**Response:**
```json
{
  "message": "Durian Care AI Chatbot API",
  "version": "1.0.0",
  "endpoints": {
    "chat": "POST /api/chat",
    "clearHistory": "POST /api/chat/clear",
    "getHistory": "GET /api/chat/history/:sessionId"
  }
}
```

## 🧪 ทดสอบ API

### ใช้ curl

```bash
# ทดสอบ chat พร้อม session
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d "{\"sessionId\": \"123456789\", \"message\": \"ระยะไข่ปลาให้น้ำอย่างไร\"}"

# ถามต่อเนื่อง (AI จำบทสนทนา)
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d "{\"sessionId\": \"123456789\", \"message\": \"แล้วระยะตาปูล่ะ\"}"

# ถามแบบไม่ครบข้อมูล (AI จะถามกลับ)
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d "{\"sessionId\": \"123456789\", \"message\": \"สัปดาห์ที่ 6 ต้องดูแลยังไง\"}"

# ดู history
curl http://localhost:3000/api/chat/history/123456789

# ลบ history
curl -X POST http://localhost:3000/api/chat/clear \
  -H "Content-Type: application/json" \
  -d "{\"sessionId\": \"123456789\"}"
```

### ใช้ Postman หรือ Thunder Client
1. Method: POST
2. URL: http://localhost:3000/api/chat
3. Headers: `Content-Type: application/json`
4. Body (raw JSON):
```json
{
  "sessionId": "user001",
  "message": "ภาคตะวันออก สัปดาห์ที่ 8 ต้องดูแลยังไง"
}
```

## 💡 ตัวอย่างคำถามที่ถามได้

### ถามตามระยะโดยตรง
- "ระยะแตกใบอ่อนชุดที่ 1 ต้องทำอย่างไร"
- "การให้น้ำในระยะดอกขาว"
- "สูตรปุ๋ยในระยะไข่ปลา"
- "ปุ๋ยทางดินระยะตาปู"

### ถามตามภูมิภาคและเวลา
- "ภาคตะวันออก สัปดาห์ที่ 8 ต้องดูแลยังไง"
- "ผมอยู่ภาคใต้ตอนล่าง ตอนนี้สัปดาห์ที่ 6 ต้องทำอะไรบ้าง"
- "ภาคเหนือตอนล่าง เดือนมกราคม สัปดาห์ที่ 2 อยู่ระยะอะไร"

### ถามแบบไม่ครบข้อมูล (AI จะถามกลับ)
- "สัปดาห์ที่ 6 ต้องดูแลยังไง" → AI ถาม: "คุณอยู่ภาคไหนครับ?"
- "ภาคตะวันออก ต้องดูแลยังไง" → AI ถาม: "ตอนนี้สัปดาห์ที่เท่าไหร่ครับ?"

### ถามต่อเนื่อง (ใช้ sessionId เดียวกัน)
- "ก่อนหน้านี้ผมถามอะไร"
- "แล้วระยะถัดไปล่ะ"
- "ภาคกลาง" (ตอบคำถามที่ AI ถามกลับ)

## 🤖 AI Features

### Gemini AI Integration
- **Model:** gemini-2.0-flash-exp
- **Temperature:** 0.7 (ความสร้างสรรค์ปานกลาง)
- **Max Tokens:** 1000
- **Safety Settings:** ปิดการ block content

### Chat History
- เก็บประวัติการสนทนา 20 ข้อความล่าสุดต่อ session
- บันทึกลงไฟล์ `history/{sessionId}.json`
- ทำให้ AI จำบริบทการสนทนาได้
- ตอบคำถามต่อเนื่องได้แม่นยำขึ้น

### ข้อมูล 2 ตาราง
1. **service-management-table.json** - วิธีการดูแลแต่ละระยะ (13 ระยะ)
2. **development-stage-table.json** - ตารางระยะการพัฒนาตามภูมิภาคและสัปดาห์

AI จะเชื่อมโยงข้อมูลทั้ง 2 ตารางอัตโนมัติ

### System Instruction
AI ได้รับคำสั่งให้:
1. ตอบเป็นภาษาไทยที่เป็นกันเอง
2. **แสดง "คำแนะนำ" ทุกครั้ง** เป็นข้อแรกเสมอ
3. **ถามกลับเมื่อข้อมูลไม่ครบ** (ไม่มีภาคหรือสัปดาห์)
4. ใช้ข้อมูลจากฐานข้อมูลเท่านั้น ห้ามแต่งเพิ่ม
5. จำบทสนทนาก่อนหน้าได้
6. ใช้ emoji ให้เหมาะสม
7. จัดรูปแบบให้อ่านง่าย

## 📊 ข้อมูลในระบบ

### ตารางการดูแลทุเรียน (13 ระยะ)
1. แตกใบอ่อนชุดที่ 1
2. แตกใบอ่อนชุดที่ 1–2
3. แตกใบอ่อนชุดที่ 2
4. แตกใบอ่อนชุดที่ 2–3
5. แตกใบอ่อนชุดที่ 3
6. ใบแก่สมบูรณ์
7. สะสมอาหาร
8. ไข่ปลา
9. ตาปู
10. เหยียดตีนหนู
11. มะเขือพวง
12. หัวกำไล
13. ดอกขาว

แต่ละระยะมีข้อมูล:
- 📌 คำแนะนำ
- 💧 การให้น้ำ
- 🌱 สูตรปุ๋ยทางดิน
- 📝 คำแนะนำในการให้ปุ๋ยทางดิน
- 🌿 สูตรปุ๋ยทางใบ

### ตารางระยะการพัฒนาตามภูมิภาค
ครอบคลุม 6 ภูมิภาค:
- ภาคตะวันออก
- ภาคเหนือตอนล่าง
- ภาคตะวันออกเฉียงเหนือ
- ภาคกลาง
- ภาคใต้ตอนกลาง
- ภาคใต้ตอนล่าง

แสดงระยะการพัฒนาตามสัปดาห์ (สัปดาห์ที่ 1-13) และเดือน (ม.ค.-มี.ค.)

## 🛠️ Technologies

- **Runtime:** Node.js v20+
- **Framework:** Express.js
- **AI:** Google Gemini AI (gemini-2.0-flash-exp)
- **Architecture:** MVC Pattern
- **Language:** JavaScript (ES Modules)

## 📝 Dependencies

```json
{
  "express": "^4.18.2",
  "cors": "^2.8.5",
  "dotenv": "^16.3.1",
  "@google/generative-ai": "^0.21.0"
}
```

## 🔧 Troubleshooting

### API Key ไม่ทำงาน
1. ตรวจสอบว่าสร้าง API key ที่ https://aistudio.google.com/app/apikey
2. ตรวจสอบว่าไฟล์ `.env` อยู่ใน root directory
3. Restart server หลังแก้ไข `.env`
4. ดู console log ว่า API key โหลดสำเร็จหรือไม่

### Server ไม่ start
1. ตรวจสอบว่า port 3000 ว่างหรือไม่
2. ลองเปลี่ยน PORT ในไฟล์ `.env`
3. ตรวจสอบว่าติดตั้ง dependencies ครบหรือไม่: `npm install`

### AI ตอบไม่ตรงคำถาม
1. ลองถามใหม่ด้วยคำที่ชัดเจนขึ้น
2. ระบุชื่อระยะที่ต้องการ
3. ระบุว่าถามเรื่องน้ำหรือปุ๋ย

## 📄 License

MIT

## 👨‍💻 Author

Durian Care AI Chatbot - 2024
