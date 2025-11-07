# ตัวอย่างการใช้งาน API

## API Endpoint เดียว: POST /api/chat

ระบบใช้ API เส้นเดียว ส่งคำถามอะไรก็ได้ AI จะตอบให้อัตโนมัติ

## ตัวอย่างคำถามที่ AI ตอบได้

### 1. ถามตามระยะโดยตรง

```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d "{\"message\": \"ระยะไข่ปลาให้น้ำอย่างไร\"}"
```

```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d "{\"message\": \"สูตรปุ๋ยในระยะตาปู\"}"
```

### 2. ถามตามภูมิภาคและเวลา

```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d "{\"message\": \"ภาคตะวันออก สัปดาห์ที่ 8 ต้องดูแลยังไง\"}"
```

```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d "{\"message\": \"ผมอยู่ภาคใต้ตอนล่าง ตอนนี้สัปดาห์ที่ 6 ต้องทำอะไรบ้าง\"}"
```

```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d "{\"message\": \"ภาคเหนือตอนล่าง เดือนมกราคม สัปดาห์ที่ 2 อยู่ระยะอะไร\"}"
```

### 3. ถามทั่วไป

```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d "{\"message\": \"มีกี่ภูมิภาค\"}"
```

```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d "{\"message\": \"สัปดาห์ที่ 8 แต่ละภาคอยู่ระยะอะไร\"}"
```

## Response Format

```json
{
  "success": true,
  "userMessage": "ภาคตะวันออก สัปดาห์ที่ 8 ต้องดูแลยังไง",
  "botResponse": "📍 ภาคตะวันออก สัปดาห์ที่ 8 (เดือน ก.พ.) อยู่ในระยะ **ไข่ไก่**\n\n..."
}
```

## หมายเหตุ

- ใช้ API เส้นเดียว: `POST /api/chat`
- ส่งคำถามอะไรก็ได้ AI จะวิเคราะห์และตอบให้อัตโนมัติ
- AI จะเชื่อมโยงข้อมูลระหว่างตารางการดูแลและตารางระยะการพัฒนาให้เอง
- ระยะบางระยะ (เช่น "ไข่ไก่", "กระป๋องนม") อาจยังไม่มีข้อมูลการดูแล AI จะแนะนำระยะที่ใกล้เคียง
