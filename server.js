// โหลด environment variables ก่อนอื่นหมด
import './config/env.js';

import express from 'express';
import cors from 'cors';
import chatRoutes from './routes/chatRoutes.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ 
    message: 'Durian Care AI Chatbot API',
    version: '1.0.0',
    endpoints: {
      chat: 'POST /api/chat',
      stages: 'GET /api/stages'
    }
  });
});

app.use('/api', chatRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
