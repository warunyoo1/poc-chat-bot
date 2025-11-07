import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class HistoryManager {
  constructor() {
    this.historyDir = path.join(__dirname, '..', 'history');
    this.ensureHistoryDir();
  }

  async ensureHistoryDir() {
    try {
      await fs.access(this.historyDir);
    } catch {
      await fs.mkdir(this.historyDir, { recursive: true });
      console.log('📁 Created history directory');
    }
  }

  getHistoryPath(sessionId) {
    return path.join(this.historyDir, `${sessionId}.json`);
  }

  async loadHistory(sessionId) {
    try {
      const historyPath = this.getHistoryPath(sessionId);
      const data = await fs.readFile(historyPath, 'utf-8');
      const history = JSON.parse(data);
      console.log(`📖 Loaded history for session: ${sessionId} (${history.length} messages)`);
      return history;
    } catch (error) {
      // ถ้าไม่มีไฟล์ ให้คืน array ว่าง
      console.log(`📝 New session: ${sessionId}`);
      return [];
    }
  }

  async saveHistory(sessionId, history) {
    try {
      const historyPath = this.getHistoryPath(sessionId);
      await fs.writeFile(historyPath, JSON.stringify(history, null, 2), 'utf-8');
      console.log(`💾 Saved history for session: ${sessionId} (${history.length} messages)`);
    } catch (error) {
      console.error('Error saving history:', error);
    }
  }

  async clearHistory(sessionId) {
    try {
      const historyPath = this.getHistoryPath(sessionId);
      await fs.unlink(historyPath);
      console.log(`🗑️ Cleared history for session: ${sessionId}`);
      return true;
    } catch (error) {
      return false;
    }
  }

  async getAllSessions() {
    try {
      const files = await fs.readdir(this.historyDir);
      return files
        .filter(file => file.endsWith('.json'))
        .map(file => file.replace('.json', ''));
    } catch (error) {
      return [];
    }
  }
}

export default new HistoryManager();
