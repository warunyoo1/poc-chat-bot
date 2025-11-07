import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class DurianModel {
  constructor() {
    this.data = null;
  }

  async loadData() {
    if (!this.data) {
      const dataPath = path.join(__dirname, '..', 'data.json');
      const rawData = await fs.readFile(dataPath, 'utf-8');
      this.data = JSON.parse(rawData);
    }
    return this.data;
  }

  async getAllStages() {
    const data = await this.loadData();
    return data;
  }

  async findStageByName(stageName) {
    const data = await this.loadData();
    return data.find(stage => 
      stage['ระยะการพัฒนา'].toLowerCase().includes(stageName.toLowerCase())
    );
  }

  async searchByKeyword(keyword) {
    const data = await this.loadData();
    const lowerKeyword = keyword.toLowerCase();
    
    return data.filter(stage => 
      Object.values(stage).some(value => 
        String(value).toLowerCase().includes(lowerKeyword)
      )
    );
  }
}

export default new DurianModel();
