import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// โหลด .env จาก root directory
dotenv.config({ path: join(__dirname, '..', '.env') });

// Debug
console.log('🔍 Loading environment variables...');
console.log('   PORT:', process.env.PORT);
console.log('   NODE_ENV:', process.env.NODE_ENV);
console.log('   GEMINI_API_KEY:', process.env.GEMINI_API_KEY ? `${process.env.GEMINI_API_KEY.substring(0, 15)}...` : '❌ NOT FOUND');

export default process.env;
