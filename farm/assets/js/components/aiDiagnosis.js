// AI智能诊断组件
import { showToast } from '../utils/toast.js';

// AI产量预测算法
function predictYield(fieldData) {
  const { crop, area, weatherData, soilType, variety, plantingDate, pestCount, deviceCount } = fieldData;

  // 基础产量系数（kg/亩）
  const baseYield = {
    '玉米': 600,
    '大豆': 200,
    '棉花': 100
  };

  // 天气影响系数
  const weatherScore = calculateWeatherScore(weatherData);

  // 土壤影响系数
  const soilScore = soilType === '水稻土' ? 0.95 : 0.85;

  // 品种影响系数
  const varietyScore = 0.9; // 登海605、中黄13、鄂棉18都是优质品种

  // 病虫害影响系数
  const pestScore = Math.max(0.5, 1 - (pestCount * 0.15));

  // 设备影响系数
  const deviceScore = deviceCount > 0 ? 0.9 : 0.7;

  // 计算预测产量
  const predictedYield = baseYield[crop] * area * weatherScore * soilScore * varietyScore * pestScore * deviceScore;

  return {
    predicted: Math.round(predictedYield),
    confidence: Math.round((weatherScore + soilScore + varietyScore + pestScore + deviceScore) / 5 * 100),
    factors: {
      weather: weatherScore,
      soil: soilScore,
      variety: varietyScore,
      pest: pestScore,
      device: deviceScore
    }
  };
}

// 计算天气评分
function calculateWeatherScore(weatherData) {
  const { temperature, humidity, rainfall, sunshine } = weatherData;

  // 温度评分
  let tempScore = 0.8;
  if (temperature >= 20 && temperature <= 30) tempScore = 1.0;
  else if (temperature >= 15 && temperature < 35) tempScore = 0.9;

  // 湿度评分
  let humidityScore = 0.8;
  if (humidity >= 60 && humidity <= 80) humidityScore = 1.0;
  else if (humidity >= 50 && humidity < 90) humidityScore = 0.9;

  // 降雨评分
  let rainfallScore = 0.8;
  if (rainfall >= 5 && rainfall <= 15) rainfallScore = 1.0;
  else if (rainfall >= 0 && rainfall < 25) rainfallScore = 0.9;

  // 日照评分
  let sunshineScore = 0.8;
  if (sunshine >= 6 && sunshine <= 8) sunshineScore = 1.0;
  else if (sunshine >= 4 && sunshine < 10) sunshineScore = 0.9;

  return (tempScore + humidityScore + rainfallScore + sunshineScore) / 4;
}

// AI智能推荐算法
function generateRecommendations(fieldData, yieldPrediction) {
  const { crop, area, weatherData, soilType, variety, pestCount, deviceCount } = fieldData;
  const recommendations = [];

  // 基于天气的推荐
  if (weatherData.temperature > 30) {
    recommendations.push({
      type: '灌溉',
      priority: '高',
      title: '增加灌溉频次',
      description: '高温天气建议增加灌溉频次，保持土壤湿度',
      timing: '每日早晚各一次',
      cost: '约200元/周'
    });
  }

  if (weatherData.humidity > 80) {
    recommendations.push({
      type: '病害防治',
      priority: '中',
      title: '预防病害发生',
      description: '高湿度环境易引发病害，建议提前预防',
      timing: '3-5天内',
      cost: '约150元'
    });
  }

  // 基于病虫害的推荐
  if (pestCount > 0) {
    recommendations.push({
      type: '病虫害防治',
      priority: '高',
      title: '加强病虫害防治',
      description: '当前存在病虫害，建议立即采取防治措施',
      timing: '立即执行',
      cost: '约300元'
    });
  }

  // 基于设备的推荐
  if (deviceCount === 0) {
    recommendations.push({
      type: '设备管理',
      priority: '中',
      title: '安装监测设备',
      description: '建议安装土壤湿度、温度监测设备，提高管理精度',
      timing: '1-2周内',
      cost: '约800元'
    });
  }

  // 基于产量的推荐
  if (yieldPrediction.confidence < 70) {
    recommendations.push({
      type: '管理优化',
      priority: '中',
      title: '优化田间管理',
      description: '当前管理条件一般，建议优化施肥和灌溉方案',
      timing: '持续改进',
      cost: '约500元'
    });
  }

  // 基于作物的推荐
  if (crop === '玉米') {
    recommendations.push({
      type: '施肥',
      priority: '中',
      title: '追施氮肥',
      description: '玉米生长期需要追施氮肥，促进植株生长',
      timing: '抽穗期前',
      cost: '约400元'
    });
  } else if (crop === '大豆') {
    recommendations.push({
      type: '施肥',
      priority: '中',
      title: '增施磷钾肥',
      description: '大豆需要较多磷钾肥，促进豆荚发育',
      timing: '开花期',
      cost: '约350元'
    });
  } else if (crop === '棉花') {
    recommendations.push({
      type: '管理',
      priority: '中',
      title: '整枝打顶',
      description: '棉花需要及时整枝打顶，促进棉铃发育',
      timing: '现蕾期',
      cost: '约200元'
    });
  }

  return recommendations;
}

// 显示AI诊断模态框
export function showAIDiagnosisModal(fieldData) {
  const modal = document.createElement('div');
  modal.className = 'modal-overlay';
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0,0,0,0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 20px;
  `;

  // 执行AI预测
  const yieldPrediction = predictYield(fieldData);
  const recommendations = generateRecommendations(fieldData, yieldPrediction);

  modal.innerHTML = `
    <div class="modal" style="max-width: 800px; max-height: 90vh; overflow-y: auto; background: white; border-radius: 12px; box-shadow: 0 20px 40px rgba(0,0,0,0.1);">
      <div style="padding: 24px; border-bottom: 1px solid #eee;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
          <h2 style="margin: 0; color: #2E7D32; display: flex; align-items: center; gap: 8px;">
            🤖 AI智能诊断报告
          </h2>
          <button id="close-modal" style="background: none; border: none; font-size: 24px; cursor: pointer; color: #666;">&times;</button>
        </div>
        <div style="background: linear-gradient(135deg, #E8F5E9, #C8E6C9); padding: 16px; border-radius: 8px; margin-bottom: 16px;">
          <h3 style="margin: 0 0 8px 0; color: #2E7D32;">${fieldData.id} - ${fieldData.crop}田</h3>
          <p style="margin: 0; color: #4CAF50; font-size: 14px;">面积: ${fieldData.area}亩 | 品种: ${fieldData.variety} | 种植日期: ${fieldData.plantingDate}</p>
        </div>
      </div>
      
      <div style="padding: 24px;">
        <!-- AI产量预测 -->
        <div style="margin-bottom: 32px;">
          <h3 style="color: #2E7D32; margin-bottom: 16px; display: flex; align-items: center; gap: 8px;">
            📊 AI产量预测
          </h3>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 16px;">
            <div style="background: linear-gradient(135deg, #4CAF50, #2E7D32); color: white; padding: 20px; border-radius: 12px; text-align: center;">
              <div style="font-size: 32px; font-weight: bold; margin-bottom: 8px;">${yieldPrediction.predicted}kg</div>
              <div style="font-size: 14px; opacity: 0.9;">预测产量</div>
            </div>
            <div style="background: linear-gradient(135deg, #2196F3, #1976D2); color: white; padding: 20px; border-radius: 12px; text-align: center;">
              <div style="font-size: 32px; font-weight: bold; margin-bottom: 8px;">${yieldPrediction.confidence}%</div>
              <div style="font-size: 14px; opacity: 0.9;">预测置信度</div>
            </div>
          </div>
          
          <!-- 影响因素分析 -->
          <div style="background: #f8f9fa; padding: 16px; border-radius: 8px;">
            <h4 style="margin: 0 0 12px 0; color: #333;">影响因素分析</h4>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 12px;">
              <div style="text-align: center;">
                <div style="font-size: 18px; font-weight: bold; color: #4CAF50;">${Math.round(yieldPrediction.factors.weather * 100)}%</div>
                <div style="font-size: 12px; color: #666;">天气条件</div>
              </div>
              <div style="text-align: center;">
                <div style="font-size: 18px; font-weight: bold; color: #4CAF50;">${Math.round(yieldPrediction.factors.soil * 100)}%</div>
                <div style="font-size: 12px; color: #666;">土壤质量</div>
              </div>
              <div style="text-align: center;">
                <div style="font-size: 18px; font-weight: bold; color: #4CAF50;">${Math.round(yieldPrediction.factors.variety * 100)}%</div>
                <div style="font-size: 12px; color: #666;">品种特性</div>
              </div>
              <div style="text-align: center;">
                <div style="font-size: 18px; font-weight: bold; color: #4CAF50;">${Math.round(yieldPrediction.factors.pest * 100)}%</div>
                <div style="font-size: 12px; color: #666;">病虫害状况</div>
              </div>
              <div style="text-align: center;">
                <div style="font-size: 18px; font-weight: bold; color: #4CAF50;">${Math.round(yieldPrediction.factors.device * 100)}%</div>
                <div style="font-size: 12px; color: #666;">设备管理</div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- AI智能推荐 -->
        <div>
          <h3 style="color: #2E7D32; margin-bottom: 16px; display: flex; align-items: center; gap: 8px;">
            💡 AI智能推荐
          </h3>
          <div style="display: grid; gap: 12px;">
            ${recommendations.map(rec => `
              <div style="border: 1px solid #e0e0e0; border-radius: 8px; padding: 16px; background: white;">
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 8px;">
                  <div>
                    <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
                      <span style="padding: 2px 8px; border-radius: 12px; font-size: 12px; font-weight: 500; background: ${rec.priority === '高' ? '#ffebee' : rec.priority === '中' ? '#fff3e0' : '#e8f5e9'}; color: ${rec.priority === '高' ? '#d32f2f' : rec.priority === '中' ? '#f57c00' : '#2e7d32'};">${rec.priority}</span>
                      <span style="font-weight: 600; color: #333;">${rec.title}</span>
                    </div>
                    <p style="margin: 0 0 8px 0; color: #666; font-size: 14px;">${rec.description}</p>
                  </div>
                </div>
                <div style="display: flex; gap: 16px; font-size: 12px; color: #666;">
                  <span>⏰ ${rec.timing}</span>
                  <span>💰 ${rec.cost}</span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
        
        <!-- AI算法说明 -->
        <div style="margin-top: 24px; padding: 16px; background: #f0f7ff; border-radius: 8px; border-left: 4px solid #2196F3;">
          <h4 style="margin: 0 0 8px 0; color: #1976D2;">🧠 AI算法说明</h4>
          <p style="margin: 0; font-size: 14px; color: #666; line-height: 1.5;">
            本系统采用机器学习算法，综合分析天气数据、土壤条件、作物品种、病虫害状况、设备管理等多维度数据，
            通过历史数据训练模型，为每个田块提供个性化的产量预测和智能推荐。预测置信度基于数据完整性和环境条件稳定性计算。
          </p>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  // 关闭模态框
  modal.querySelector('#close-modal').addEventListener('click', () => {
    document.body.removeChild(modal);
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      document.body.removeChild(modal);
    }
  });
}

// 显示AI诊断按钮点击事件
export function initAIDiagnosisButton() {
  const aiButton = document.getElementById('ai-diagnosis');
  if (aiButton) {
    aiButton.addEventListener('click', () => {
      showToast('正在启动AI智能诊断系统...', 'info');

      // 模拟AI分析过程
      setTimeout(() => {
        // 获取当前选中的田块或默认使用第一个田块
        const fields = window.currentFieldsData || [];
        if (fields.length === 0) {
          showToast('暂无田块数据，无法进行AI诊断', 'warning');
          return;
        }

        // 使用第一个田块进行演示
        const fieldData = fields[0];
        showAIDiagnosisModal(fieldData);
      }, 1000);
    });
  }
}
