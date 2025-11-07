import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class DurianModel {
  constructor() {
    this.data = null;
    this.developmentStageData = null;
  }

  async loadData() {
    if (!this.data) {
      const dataPath = path.join(__dirname, '..', 'data', 'service-management-table.json');
      const rawData = await fs.readFile(dataPath, 'utf-8');
      this.data = JSON.parse(rawData);
    }
    return this.data;
  }

  async loadDevelopmentStageData() {
    if (!this.developmentStageData) {
      const dataPath = path.join(__dirname, '..', 'data', 'development-stage-table.json');
      const rawData = await fs.readFile(dataPath, 'utf-8');
      this.developmentStageData = JSON.parse(rawData);
    }
    return this.developmentStageData;
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

  async getStageByRegionAndWeek(region, week) {
    const developmentData = await this.loadDevelopmentStageData();
    const weekData = developmentData.find(item => item['สัปดาห์'] === week);
    
    if (!weekData) {
      return null;
    }

    const stageName = weekData[region];
    if (!stageName) {
      return null;
    }

    return {
      week: weekData['สัปดาห์'],
      month: weekData['เดือน'],
      region: region,
      stageName: stageName,
      weekData: weekData
    };
  }

  async getStageByRegionAndMonth(region, month) {
    const developmentData = await this.loadDevelopmentStageData();
    return developmentData.filter(item => 
      item['เดือน'] === month
    ).map(item => ({
      week: item['สัปดาห์'],
      month: item['เดือน'],
      region: region,
      stageName: item[region]
    }));
  }

  async getAllRegions() {
    const developmentData = await this.loadDevelopmentStageData();
    if (developmentData.length === 0) return [];
    
    const firstItem = developmentData[0];
    return Object.keys(firstItem).filter(key => 
      key !== 'สัปดาห์' && key !== 'เดือน'
    );
  }

  async getCombinedData() {
    const serviceData = await this.loadData();
    const developmentData = await this.loadDevelopmentStageData();
    
    return {
      serviceManagement: serviceData,
      developmentStage: developmentData
    };
  }
}

export default new DurianModel();
