# ตัวอย่างการใช้งาน API

## API Endpoints

### 1. Chat (หลัก)
`POST /api/chat`

### 2. ลบประวัติการสนทนา
`POST /api/chat/clear`

### 3. ดูประวัติการสนทนา
`GET /api/chat/history/:sessionId`

## ตัวอย่างการใช้งาน

### 1. Chat แบบมี Session (แนะนำ)

```bash
# คำถามแรก - สร้าง session
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d "{\"message\": \"ระยะไข่ปลาให้น้ำอย่างไร\", \"sessionId\": \"123456789\"}"
```

```bash
# คำถามต่อเนื่อง - ใช้ session เดิม (AI จำบทสนทนาได้)
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d "{\"message\": \"แล้วระยะตาปูล่ะ\", \"sessionId\": \"123456789\"}"
```

```bash
# ถามต่อ - AI จำว่าเคยถามเรื่องอะไร
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d "{\"message\": \"ก่อนหน้านี้ผมถามอะไรบ้าง\", \"sessionId\": \"123456789\"}"
```

### 2. Chat แบบไม่มี Session

```bash
# ไม่ส่ง sessionId - ระบบจะสร้างให้อัตโนมัติ
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d "{\"message\": \"ภาคตะวันออก สัปดาห์ที่ 8 ต้องดูแลยังไง\"}"
```

### 3. ถามตามภูมิภาคและเวลา

```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d "{\"message\": \"ผมอยู่ภาคใต้ตอนล่าง ตอนนี้สัปดาห์ที่ 6 ต้องทำอะไรบ้าง\", \"sessionId\": \"user001\"}"
```

### 4. ลบประวัติการสนทนา

```bash
curl -X POST http://localhost:3000/api/chat/clear \
  -H "Content-Type: application/json" \
  -d "{\"sessionId\": \"123456789\"}"
```

### 5. ดูประวัติการสนทนา

```bash
curl http://localhost:3000/api/chat/history/123456789
```

## Response Format

### Chat Response
```json
{
  "success": true,
  "sessionId": "123456789",
  "userMessage": "ระยะไข่ปลาให้น้ำอย่างไร",
  "botResponse": "📌 คำแนะนำ: ดูแลให้ออกพัฒนาต่อเนื่อง (ช่วงไข่ปลา)\n\n💧 การให้น้ำ: 100 ลิตร/ต้น/วัน (10 นาที)..."
}
```

### Clear History Response
```json
{
  "success": true,
  "message": "ลบประวัติการสนทนาสำเร็จ"
}
```

### Get History Response
```json
{
  "success": true,
  "sessionId": "123456789",
  "history": [
    {
      "role": "user",
      "content": "ระยะไข่ปลาให้น้ำอย่างไร",
      "timestamp": "2024-01-01T10:00:00.000Z"
    },
    {
      "role": "model",
      "content": "📌 คำแนะนำ: ...",
      "timestamp": "2024-01-01T10:00:01.000Z"
    }
  ]
}
```

## คุณสมบัติ

✅ **มี Session History** - AI จำบทสนทนาได้ (เก็บ 20 ข้อความล่าสุด)
✅ **ถามต่อเนื่องได้** - "แล้วระยะถัดไปล่ะ", "ก่อนหน้านี้ถามอะไร"
✅ **รองรับหลาย Session** - แต่ละ sessionId เป็นอิสระกัน
✅ **แสดงคำแนะนำทุกครั้ง** - field "คำแนะนำ" จะแสดงเป็นข้อแรกเสมอ

## หมายเหตุ

- ส่ง `sessionId` เพื่อให้ AI จำบทสนทนา
- ไม่ส่ง `sessionId` ระบบจะสร้างให้อัตโนมัติ
- History เก็บไว้ 20 ข้อความล่าสุดต่อ session
- AI จะเชื่อมโยงข้อมูลระหว่างตารางการดูแลและตารางระยะการพัฒนาให้อัตโนมัติ
