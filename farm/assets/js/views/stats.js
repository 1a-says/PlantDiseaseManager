// 导入数据源
import { createMockDevices } from '../data/devices.js';
import { createMockPests } from '../data/pests.js';

// 数据缓存 - 避免重复创建大量数据
let cachedDevices = null;
let cachedPests = null;

function getDevices() {
  if (!cachedDevices) {
    cachedDevices = createMockDevices();
  }
  return cachedDevices;
}

function getPests() {
  if (!cachedPests) {
    cachedPests = createMockPests();
  }
  return cachedPests;
}

// 清除缓存（用于数据刷新）
function clearCache() {
  cachedDevices = null;
  cachedPests = null;
}

// 田块基础数据（与fields.js保持一致）
const baseFieldsData = [
  // 上排4个田块 - 根据图片中的实际分布
  {
    id: 'F-001',
    crop: '玉米',
    area: 18.0, // L形田块，比F-002小
    time: '今天 08:45',
    soilType: '水稻土',
    irrigation: '滴灌系统',
    lastHarvest: '2024年10月15日',
    expectedYield: 1800, // 减产20%
    plantingDate: '2024年3月25日',
    variety: '登海605',
    deviceCount: 2, // 设备故障
    pestCount: 1, // 轻微病虫害
    weatherData: {
      temperature: 28.5, // 高温
      humidity: 85, // 高湿度
      rainfall: 15.2, // 过量降雨
      sunshine: 4.2 // 日照不足
    }
  },

  {
    id: 'F-002',
    crop: '大豆',
    area: 24.0, // 矩形田块，比F-001大，与F-003接近
    time: '今天 09:20',
    soilType: '水稻土',
    irrigation: '喷灌',
    lastHarvest: '2024年9月28日',
    expectedYield: 1920,
    plantingDate: '2024年4月15日',
    variety: '中黄13',
    deviceCount: 4,
    pestCount: 0,
    weatherData: {
      temperature: 22.8,
      humidity: 63,
      rainfall: 7.5,
      sunshine: 7.2
    }
  },

  {
    id: 'F-003',
    crop: '棉花',
    area: 32.0, // L形田块，面积较大
    time: '昨天 16:30',
    soilType: '水稻土',
    irrigation: '滴灌系统',
    lastHarvest: '2024年10月30日',
    expectedYield: 960, // 减产25%
    plantingDate: '2024年4月10日',
    variety: '鄂棉18',
    deviceCount: 1, // 设备严重故障
    pestCount: 2, // 中等病虫害
    weatherData: {
      temperature: 26.8, // 高温
      humidity: 78, // 高湿度
      rainfall: 18.5, // 过量降雨
      sunshine: 3.8 // 日照严重不足
    }
  },

  {
    id: 'F-004',
    crop: '大豆',
    area: 6.0, // 小方形田块，面积最小
    time: '今天 10:20',
    soilType: '水稻土',
    irrigation: '滴灌系统',
    lastHarvest: '2024年9月25日',
    expectedYield: 720,
    plantingDate: '2024年4月20日',
    variety: '中黄13',
    deviceCount: 2,
    pestCount: 0,
    weatherData: {
      temperature: 21.8,
      humidity: 69,
      rainfall: 8.8,
      sunshine: 6.2
    }
  },

  // 下排田块 - 按照图片中的颜色分块
  {
    id: 'F-005',
    crop: '棉花',
    area: 26.0, // 矩形田块，与F-006接近
    time: '今天 14:30',
    soilType: '水稻土',
    irrigation: '喷灌',
    lastHarvest: '2024年11月5日',
    expectedYield: 1040,
    plantingDate: '2024年4月5日',
    variety: '鄂棉18',
    deviceCount: 3,
    pestCount: 0,
    weatherData: {
      temperature: 24.2,
      humidity: 68,
      rainfall: 6.8,
      sunshine: 7.5
    }
  },

  {
    id: 'F-006',
    crop: '玉米',
    area: 25.0, // 矩形田块，比F-003小
    time: '今天 11:15',
    soilType: '水稻土',
    irrigation: '喷灌',
    lastHarvest: '2024年10月20日',
    expectedYield: 3000,
    plantingDate: '2024年3月30日',
    variety: '登海605',
    deviceCount: 4,
    pestCount: 0,
    weatherData: {
      temperature: 25.1,
      humidity: 78,
      rainfall: 12.5,
      sunshine: 6.8
    }
  },

  {
    id: 'F-007',
    crop: '大豆',
    area: 15.0, // 矩形田块，面积较小
    time: '今天 13:10',
    soilType: '水稻土',
    irrigation: '滴灌系统',
    lastHarvest: '2024年9月30日',
    expectedYield: 900, // 减产25%
    plantingDate: '2024年4月25日',
    variety: '中黄13',
    deviceCount: 1, // 设备故障
    pestCount: 1, // 轻微病虫害
    weatherData: {
      temperature: 25.2, // 高温
      humidity: 72, // 高湿度
      rainfall: 12.8, // 过量降雨
      sunshine: 5.1 // 日照不足
    }
  },

  {
    id: 'F-008',
    crop: '棉花',
    area: 20.0, // 矩形田块，比F-006小
    time: '昨天 15:50',
    soilType: '水稻土',
    irrigation: '喷灌',
    lastHarvest: '2024年10月25日',
    expectedYield: 800,
    plantingDate: '2024年4月15日',
    variety: '鄂棉18',
    deviceCount: 3,
    pestCount: 0,
    weatherData: {
      temperature: 24.8,
      humidity: 75,
      rainfall: 11.2,
      sunshine: 6.5
    }
  }
];

/**
 * 基于设备监测数据的科学健康率计算
 * 
 * 健康率计算公式：
 * HealthScore = (WeatherScore × 0.6) + (PestImpactScore × 0.4)
 * 
 * 其中：
 * - WeatherScore: 气象环境评分（60%权重）
 * - PestImpactScore: 病虫害影响评分（40%权重）
 */
function calculateHealthScore(field) {
  try {
    // 获取设备数据和病虫害数据
    const devices = getDevices();
    const pests = getPests();

    // 获取该田块的设备数据
    const fieldDevices = devices.filter(device => device.fieldId === field.id);
    const fieldPests = pests.filter(pest => pest.fieldId === field.id);

    if (fieldDevices.length === 0) {
      return 75; // 无设备数据时使用默认值
    }

    // 1. 气象环境评分（60%权重）- 最重要的影响因素
    const weatherScore = calculateScientificWeatherScore(fieldDevices);

    // 2. 病虫害影响评分（40%权重）- 基于活跃病虫害的严重程度
    const pestImpactScore = calculateScientificPestImpactScore(fieldPests);

    // 综合健康率计算
    const healthScore = (weatherScore * 0.6) + (pestImpactScore * 0.4);

    return Math.round(Math.max(20, Math.min(100, healthScore)));
  } catch (error) {
    console.warn('健康度计算失败，使用默认值:', error);
    return 75;
  }
}

/**
 * 科学的气象环境评分计算
 * 
 * 气象环境评分公式：
 * WeatherScore = (TempScore × 0.3) + (HumidityScore × 0.25) + (RainfallScore × 0.2) + (SunshineScore × 0.15) + (PressureScore × 0.1)
 * 
 * 各参数评分标准：
 * - 温度：18-28°C为最佳（100分），15-32°C为良好（80分），其他按距离最佳温度的程度递减
 * - 湿度：60-80%为最佳（100分），50-90%为良好（80分），其他按距离最佳湿度的程度递减
 * - 降雨：5-15mm为最佳（100分），2-25mm为良好（80分），其他按距离最佳降雨量的程度递减
 * - 日照：≥6小时为最佳（100分），4-6小时为良好（80分），其他按日照时长递减
 * - 气压：1000-1020hPa为最佳（100分），其他按距离最佳气压的程度递减
 */
function calculateScientificWeatherScore(devices) {
  const weatherDevices = devices.filter(d => d.category === '气象监测');
  if (weatherDevices.length === 0) return 75;

  let totalScore = 0;
  let deviceCount = 0;

  weatherDevices.forEach(device => {
    const readings = device.dataReadings;
    if (readings) {
      deviceCount++;

      // 温度评分（30%权重）
      const temp = readings.temperature || 22;
      const tempScore = calculateTemperatureScore(temp);

      // 湿度评分（25%权重）
      const humidity = readings.humidity || 65;
      const humidityScore = calculateHumidityScore(humidity);

      // 降雨评分（20%权重）
      const rainfall = readings.rainfall || 8;
      const rainfallScore = calculateRainfallScore(rainfall);

      // 日照评分（15%权重）
      const sunshine = readings.sunshine || 7;
      const sunshineScore = calculateSunshineScore(sunshine);

      // 气压评分（10%权重）
      const pressure = readings.pressure || 1013;
      const pressureScore = calculatePressureScore(pressure);

      // 加权计算
      const deviceScore = (tempScore * 0.3) + (humidityScore * 0.25) +
        (rainfallScore * 0.2) + (sunshineScore * 0.15) + (pressureScore * 0.1);

      totalScore += deviceScore;
    }
  });

  return deviceCount > 0 ? totalScore / deviceCount : 75;
}

// 温度评分计算
function calculateTemperatureScore(temperature) {
  if (temperature >= 18 && temperature <= 28) return 100; // 最佳范围
  else if (temperature >= 15 && temperature <= 32) return 80; // 良好范围
  else if (temperature >= 10 && temperature <= 35) return 60; // 可接受范围
  else return Math.max(20, 100 - Math.abs(temperature - 23) * 2); // 线性递减
}

// 湿度评分计算
function calculateHumidityScore(humidity) {
  if (humidity >= 60 && humidity <= 80) return 100; // 最佳范围
  else if (humidity >= 50 && humidity <= 90) return 80; // 良好范围
  else if (humidity >= 40 && humidity <= 95) return 60; // 可接受范围
  else return Math.max(20, 100 - Math.abs(humidity - 70) * 1.5); // 线性递减
}

// 降雨评分计算
function calculateRainfallScore(rainfall) {
  if (rainfall >= 5 && rainfall <= 15) return 100; // 最佳范围
  else if (rainfall >= 2 && rainfall <= 25) return 80; // 良好范围
  else if (rainfall >= 0 && rainfall <= 35) return 60; // 可接受范围
  else return Math.max(20, 100 - Math.abs(rainfall - 10) * 3); // 线性递减
}

// 日照评分计算
function calculateSunshineScore(sunshine) {
  if (sunshine >= 6) return 100; // 最佳范围
  else if (sunshine >= 4) return 80; // 良好范围
  else if (sunshine >= 2) return 60; // 可接受范围
  else return Math.max(20, sunshine * 15); // 线性递增
}

// 气压评分计算
function calculatePressureScore(pressure) {
  if (pressure >= 1000 && pressure <= 1020) return 100; // 最佳范围
  else if (pressure >= 990 && pressure <= 1030) return 80; // 良好范围
  else if (pressure >= 980 && pressure <= 1040) return 60; // 可接受范围
  else return Math.max(20, 100 - Math.abs(pressure - 1010) * 0.5); // 线性递减
}

/**
 * 科学的设备运行状态评分计算
 * 
 * 设备运行状态评分公式：
 * DeviceStatusScore = (OnlineScore × 0.4) + (BatteryScore × 0.3) + (WorkingScore × 0.3)
 * 
 * 其中：
 * - OnlineScore: 在线状态评分（40%权重）
 * - BatteryScore: 电池电量评分（30%权重）
 * - WorkingScore: 工作时长评分（30%权重）
 */
function calculateScientificDeviceStatusScore(devices) {
  if (devices.length === 0) return 75;

  let totalScore = 0;
  let deviceCount = 0;

  devices.forEach(device => {
    deviceCount++;

    // 在线状态评分（40%权重）
    const onlineScore = device.status === 'online' ? 100 : 0;

    // 电池电量评分（30%权重）
    const readings = device.dataReadings;
    const batteryLevel = readings?.batteryLevel || 0;
    const batteryScore = Math.min(100, batteryLevel); // 直接使用电池百分比

    // 工作时长评分（30%权重）
    const workingHours = readings?.workingHours || 0;
    const workingScore = Math.min(100, workingHours * 10); // 10小时为满分

    // 加权计算
    const deviceScore = (onlineScore * 0.4) + (batteryScore * 0.3) + (workingScore * 0.3);

    totalScore += deviceScore;
  });

  return deviceCount > 0 ? totalScore / deviceCount : 75;
}

/**
 * 科学的防治效果评分计算
 * 
 * 防治效果评分公式：
 * ControlEffectScore = (ChemicalScore × 0.4) + (TrapScore × 0.3) + (CoverageScore × 0.3)
 * 
 * 其中：
 * - ChemicalScore: 药剂余量评分（40%权重）
 * - TrapScore: 诱捕效果评分（30%权重）
 * - CoverageScore: 覆盖面积评分（30%权重）
 */
function calculateScientificControlEffectScore(devices) {
  const controlDevices = devices.filter(d => d.category === '防治设备');
  if (controlDevices.length === 0) return 75;

  let totalScore = 0;
  let deviceCount = 0;

  controlDevices.forEach(device => {
    const readings = device.dataReadings;
    if (readings) {
      deviceCount++;

      // 药剂余量评分（40%权重）
      const chemicalLevel = readings.chemicalLevel || 0;
      const chemicalScore = Math.min(100, chemicalLevel); // 直接使用百分比

      // 诱捕效果评分（30%权重）
      const trapCount = readings.trapCount || 0;
      const trapScore = Math.min(100, trapCount * 5); // 20个为满分

      // 覆盖面积评分（30%权重）
      const coverage = readings.coverage || 0;
      const coverageScore = Math.min(100, coverage); // 直接使用百分比

      // 加权计算
      const deviceScore = (chemicalScore * 0.4) + (trapScore * 0.3) + (coverageScore * 0.3);

      totalScore += deviceScore;
    }
  });

  return deviceCount > 0 ? totalScore / deviceCount : 75;
}

/**
 * 科学的病虫害影响评分计算
 * 
 * 病虫害影响评分公式：
 * PestImpactScore = 100 - (ActivePestPenalty + SeverityPenalty + StatusPenalty)
 * 
 * 其中：
 * - ActivePestPenalty: 活跃病虫害惩罚 = 活跃病虫害数量 × 15
 * - SeverityPenalty: 严重程度惩罚 = Σ(严重程度 × 权重)
 * - StatusPenalty: 状态惩罚 = Σ(状态惩罚系数 × 权重)
 * 
 * 严重程度评分标准：
 * - 低风险：0-30分
 * - 中风险：31-60分  
 * - 高风险：61-90分
 * - 严重风险：91-100分
 * 
 * 状态惩罚系数：
 * - 已解决：0（无惩罚）
 * - 处理中：0.3（轻微惩罚）
 * - 待处理：0.6（中等惩罚）
 * - 复发：0.8（严重惩罚）
 */
function calculateScientificPestImpactScore(pests) {
  if (pests.length === 0) return 100; // 无病虫害，满分

  // 获取活跃病虫害（处理中和待处理状态）
  const activePests = pests.filter(pest =>
    pest.status === '处理中' || pest.status === '待处理'
  );

  // 活跃病虫害惩罚
  const activePestPenalty = activePests.length * 15;

  // 严重程度惩罚计算
  let severityPenalty = 0;
  pests.forEach(pest => {
    const severity = pest.severity || 50;
    let severityWeight = 0;

    if (severity <= 30) severityWeight = 0.1; // 低风险
    else if (severity <= 60) severityWeight = 0.3; // 中风险
    else if (severity <= 90) severityWeight = 0.6; // 高风险
    else severityWeight = 1.0; // 严重风险

    severityPenalty += severity * severityWeight;
  });

  // 状态惩罚计算
  let statusPenalty = 0;
  pests.forEach(pest => {
    let statusWeight = 0;
    switch (pest.status) {
      case '已解决': statusWeight = 0; break;
      case '处理中': statusWeight = 0.3; break;
      case '待处理': statusWeight = 0.6; break;
      case '复发': statusWeight = 0.8; break;
      default: statusWeight = 0.5;
    }

    statusPenalty += 20 * statusWeight; // 基础状态惩罚
  });

  // 综合惩罚计算
  const totalPenalty = activePestPenalty + (severityPenalty / pests.length) + (statusPenalty / pests.length);

  // 最终评分（确保不低于20分）
  const finalScore = Math.max(20, 100 - totalPenalty);

  return Math.round(finalScore);
}

// 聚合所有数据源
function aggregateFieldStats() {
  // 获取设备数据（使用缓存）
  const devices = getDevices();

  // 获取病虫害数据（使用缓存）
  const pests = getPests();

  // 计算田块健康度
  const fieldsWithHealth = baseFieldsData.map(field => ({
    ...field,
    name: `${field.crop}田`,
    health: calculateHealthScore(field)
  }));

  // 按田块聚合设备数据
  const fieldDevices = {};
  devices.forEach(device => {
    if (!fieldDevices[device.fieldId]) {
      fieldDevices[device.fieldId] = [];
    }
    fieldDevices[device.fieldId].push(device);
  });

  // 按田块聚合病虫害数据
  const fieldPests = {};
  pests.forEach(pest => {
    if (!fieldPests[pest.fieldId]) {
      fieldPests[pest.fieldId] = [];
    }
    fieldPests[pest.fieldId].push(pest);
  });

  // 计算综合统计数据
  const totalFields = fieldsWithHealth.length;
  const healthyFields = fieldsWithHealth.filter(f => f.health >= 80);
  const warningFields = fieldsWithHealth.filter(f => f.health >= 60 && f.health < 80);
  const dangerFields = fieldsWithHealth.filter(f => f.health < 60);

  // 计算综合健康率
  const totalHealth = fieldsWithHealth.reduce((sum, field) => sum + field.health, 0);
  const healthRate = Math.round(totalHealth / totalFields);

  // 计算预警数量（基于病虫害和设备状态）
  let alertCount = 0;
  fieldsWithHealth.forEach(field => {
    const fieldPestData = fieldPests[field.id] || [];
    const fieldDeviceData = fieldDevices[field.id] || [];

    let fieldHasAlert = false;

    // 病虫害预警
    const activePests = fieldPestData.filter(pest => pest.status === '待处理' || pest.status === '处理中');
    if (activePests.length > 0) fieldHasAlert = true;

    // 设备故障预警
    const faultyDevices = fieldDeviceData.filter(device => device.status === 'alert' || device.status === 'maintenance');
    if (faultyDevices.length > 0) fieldHasAlert = true;

    // 只有当一个田块有预警时才计数一次
    if (fieldHasAlert) alertCount++;
  });

  // 生成健康度趋势数据（基于实际田块数据的变化）
  const trendData = Array.from({ length: 7 }, (_, i) => {
    // 基于实际田块健康度计算基础值
    const baseHealth = healthRate;

    // 模拟天气影响
    const weatherImpact = Math.sin(i * 0.6) * 12; // 天气周期性影响

    // 模拟病虫害影响（基于实际病虫害数据）
    const pestImpact = Object.values(fieldPests).flat().length * -3; // 病虫害负面影响

    // 模拟设备监测效果
    const deviceBenefit = Object.values(fieldDevices).flat().length * 1.5; // 设备监测正面影响

    // 随机波动
    const randomVariation = (Math.random() - 0.5) * 15;

    // 轻微改善趋势（农场管理优化）
    const improvementTrend = i * 1.5;

    const totalVariation = weatherImpact + pestImpact + deviceBenefit + randomVariation + improvementTrend;
    return Math.max(25, Math.min(90, Math.round(baseHealth + totalVariation)));
  });

  // 健康状态分布
  const distributionData = [
    { name: '健康', value: healthyFields.length, color: '#4CAF50' },
    { name: '预警', value: warningFields.length, color: '#FF9800' },
    { name: '危险', value: dangerFields.length, color: '#F44336' }
  ];

  // 田块健康度排名
  const fieldRanking = fieldsWithHealth
    .map(field => ({
      name: field.name,
      health: field.health,
      pests: fieldPests[field.id]?.length || 0,
      devices: fieldDevices[field.id]?.length || 0
    }))
    .sort((a, b) => b.health - a.health);

  return {
    totalFields,
    healthyFields: healthyFields.map(f => f.name).join(', '),
    warningFields: warningFields.map(f => f.name).join(', '),
    dangerFields: dangerFields.map(f => f.name).join(', '),
    healthRate,
    alertCount,
    trendData,
    distributionData,
    fieldRanking,
    fieldsWithHealth,
    fieldDevices,
    fieldPests
  };
}

export async function render(container) {
  // 全局状态管理
  let globalState = {
    timeRange: 'month', // 时间范围：day, week, month, custom
    comparisonMode: false, // 对比模式
    lastUpdate: new Date(),
    autoRefresh: false,
    refreshInterval: null
  };

  // 获取聚合的田块健康统计数据
  const fieldStats = aggregateFieldStats();

  container.innerHTML = `
    <div style="margin-bottom:16px">
      <div style="display:flex;gap:12px;align-items:center;margin-bottom:12px;flex-wrap:wrap">
        <div class="tag" style="gap:8px;white-space:nowrap">时间范围
          <select id="time-range-select" aria-label="时间范围" style="min-width:80px">
            <option value="day">本日</option>
            <option value="week">本周</option>
            <option value="month" selected>本月</option>
            <option value="custom">自定义</option>
          </select>
        </div>
        <label class="tag" style="gap:6px;white-space:nowrap">
          <input type="checkbox" id="comparison-mode"/> 对比模式
          </label>
        <button id="refresh-stats" class="btn btn-outline" style="padding:8px 12px;white-space:nowrap">刷新数据</button>
        <button id="auto-refresh-toggle" class="btn btn-outline" style="padding:8px 12px;white-space:nowrap;background:#f0f0f0">自动刷新</button>
        </div>
      <div id="last-update" style="font-size:12px;color:var(--color-text-muted);text-align:right">最后更新: ${formatTime(globalState.lastUpdate)}</div>
      </div>
    <div class="grid cols-4" style="margin-bottom:16px">
      <div class="card" style="padding:16px">
        <div>健康率</div>
        <div id="kpi1" style="font-size:28px;font-weight:600">--</div>
        <div style="font-size:14px;color:var(--color-text-muted)">本月综合健康率</div>
        </div>
      <div class="card" style="padding:16px">
        <div>预警数</div>
        <div id="kpi2" style="font-size:28px;font-weight:600">--</div>
        <div style="font-size:14px;color:var(--color-text-muted)">需关注田块</div>
        </div>
      <div class="card" style="padding:16px">
        <div>设备总数</div>
        <div id="kpi3" style="font-size:28px;font-weight:600">--</div>
        <div style="font-size:14px;color:var(--color-text-muted)">在线监测设备</div>
        </div>
      <div class="card" style="padding:16px">
        <div>病虫害</div>
        <div id="kpi4" style="font-size:28px;font-weight:600">--</div>
        <div style="font-size:14px;color:var(--color-text-muted)">活跃病虫害记录</div>
        </div>
      </div>
    <div class="grid cols-2" style="margin-bottom:16px">
       <div class="card" style="padding:12px"><div id="field-health-trend-chart" style="height:400px"></div></div>
      <div class="card" style="padding:12px"><div id="field-health-radar-chart" style="height:400px"></div></div>
    </div>
    <div class="card" style="padding:12px"><div id="pest-bar-chart" style="height:400px"></div></div>
  `;

  // 时间格式化函数
  function formatTime(date) {
    return date.toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  }

  // 更新最后更新时间
  function updateLastUpdateTime() {
    globalState.lastUpdate = new Date();
    const lastUpdateEl = document.getElementById('last-update');
    if (lastUpdateEl) {
      lastUpdateEl.textContent = `最后更新: ${formatTime(globalState.lastUpdate)}`;
    }
  }

  // 刷新所有数据
  function refreshAllData() {
    updateLastUpdateTime();

    // 清除缓存以获取最新数据
    clearCache();

    // 重新获取数据
    const newFieldStats = aggregateFieldStats();

    // 更新KPI数据
    updateKPIData(newFieldStats);

    // 重新渲染图表
    renderCharts(newFieldStats);


    // 显示刷新成功提示
    showToast('数据已刷新', 'success');
  }

  // 更新KPI数据
  function updateKPIData(fieldStats) {
    // 根据实际数据统计
    const totalDevices = 22; // 设备管理中的设备总数
    const activePests = 5; // 病虫害档案中的活跃病虫害数量（3个处理中 + 2个待处理）
    const alertFields = 4; // 需要关注的田块数量（F-001, F-003, F-007, F-008）

    // 数字计数动画 - 健康率以百分比显示
    animateNumber(container.querySelector('#kpi1'), fieldStats.healthRate / 100, 2);
    animateNumber(container.querySelector('#kpi2'), alertFields, 0);
    animateNumber(container.querySelector('#kpi3'), totalDevices, 0);
    animateNumber(container.querySelector('#kpi4'), activePests, 0);
  }

  // 切换自动刷新
  function toggleAutoRefresh() {
    globalState.autoRefresh = !globalState.autoRefresh;
    const autoRefreshBtn = document.getElementById('auto-refresh-toggle');

    if (globalState.autoRefresh) {
      autoRefreshBtn.textContent = '停止刷新';
      autoRefreshBtn.style.background = '#4CAF50';
      autoRefreshBtn.style.color = '#fff';

      // 每30秒自动刷新一次
      globalState.refreshInterval = setInterval(() => {
        refreshAllData();
      }, 30000);

      showToast('已开启自动刷新（30秒间隔）', 'info');
    } else {
      autoRefreshBtn.textContent = '自动刷新';
      autoRefreshBtn.style.background = '#f0f0f0';
      autoRefreshBtn.style.color = '#333';

      if (globalState.refreshInterval) {
        clearInterval(globalState.refreshInterval);
        globalState.refreshInterval = null;
      }

      showToast('已关闭自动刷新', 'info');
    }
  }


  // 绑定事件
  function bindEvents() {
    // 时间范围选择
    const timeRangeSelect = document.getElementById('time-range-select');
    if (timeRangeSelect) {
      timeRangeSelect.addEventListener('change', () => {
        globalState.timeRange = timeRangeSelect.value;
        showToast(`已切换到${timeRangeSelect.options[timeRangeSelect.selectedIndex].text}数据`, 'info');
        refreshAllData();
      });
    }

    // 对比模式切换
    const comparisonModeCheckbox = document.getElementById('comparison-mode');
    if (comparisonModeCheckbox) {
      comparisonModeCheckbox.addEventListener('change', () => {
        globalState.comparisonMode = !globalState.comparisonMode;
        showToast(globalState.comparisonMode ? '对比模式已开启' : '对比模式已关闭', 'info');
      });
    }

    // 刷新数据按钮
    const refreshBtn = document.getElementById('refresh-stats');
    if (refreshBtn) {
      refreshBtn.addEventListener('click', refreshAllData);
    }

    // 自动刷新切换
    const autoRefreshBtn = document.getElementById('auto-refresh-toggle');
    if (autoRefreshBtn) {
      autoRefreshBtn.addEventListener('click', toggleAutoRefresh);
    }
  }

  // 初始化数据
  updateKPIData(fieldStats);
  renderCharts(fieldStats);
  bindEvents();
  updateLastUpdateTime();

  // 页面卸载时清理定时器
  window.addEventListener('beforeunload', () => {
    if (globalState.refreshInterval) {
      clearInterval(globalState.refreshInterval);
    }
  });
}

// 更新最后更新时间
function updateLastUpdateTime() {
  const lastUpdateEl = document.getElementById('last-update');
  if (lastUpdateEl) {
    const now = new Date();
    lastUpdateEl.textContent = `最后更新: ${now.toLocaleTimeString('zh-CN')}`;
  }
}

// 绑定刷新事件
function bindRefreshEvents(container) {
  const refreshBtn = container.querySelector('#refresh-stats');
  if (refreshBtn) {
    refreshBtn.addEventListener('click', () => {
      refreshBtn.disabled = true;
      refreshBtn.textContent = '🔄 刷新中...';

      // 模拟刷新延迟
      setTimeout(() => {
        // 重新渲染整个页面
        render(container);
        refreshBtn.disabled = false;
        refreshBtn.textContent = '🔄 刷新数据';
      }, 1000);
    });
  }
}

// 设置自动刷新
function setupAutoRefresh(container) {
  // 清除之前的定时器
  if (window.statsAutoRefreshTimer) {
    clearInterval(window.statsAutoRefreshTimer);
  }

  // 每5分钟自动刷新一次
  window.statsAutoRefreshTimer = setInterval(() => {
    console.log('自动刷新作物健康统计数据...');
    render(container);
  }, 5 * 60 * 1000); // 5分钟
}


function animateNumber(el, value, decimals = 2) {
  const start = performance.now();
  const duration = 1000;
  const from = 0;
  function frame(t) {
    const p = Math.min(1, (t - start) / duration);
    const v = from + (value - from) * p;
    el.textContent = (decimals ? v.toFixed(decimals) : Math.round(v));
    if (p < 1) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

function renderCharts(fieldStats) {
  // 1. 分组柱状图：病虫害类型按作物分组
  renderPestBarChart(fieldStats);

  // 2. 田块月度健康率趋势图
  renderFieldHealthTrendChart(fieldStats);

  // 3. 雷达图：田块多维度健康评估对比
  renderFieldHealthRadarChart(fieldStats);
}

// 1. 月度活跃病虫害严重程度分布图
function renderPestBarChart(fieldStats) {
  const chart = echarts.init(document.getElementById('pest-bar-chart'));

  // 获取病虫害数据
  const pests = getPests();

  // 按月份和严重程度分组数据
  function generateMonthlyPestData() {
    const months = ['3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月'];
    const severityLevels = ['轻微感染', '中度感染', '重度感染', '严重感染'];

    // 初始化数据结构
    const data = {};
    months.forEach(month => {
      data[month] = {};
      severityLevels.forEach(level => {
        data[month][level] = 0;
      });
    });

    // 处理现有活跃病虫害数据
    pests.forEach(pest => {
      // 只统计活跃病虫害（处理中和待处理状态）
      if (pest.status === '处理中' || pest.status === '待处理') {
        const date = new Date(pest.date);
        const month = date.getMonth() + 1; // 获取月份 (1-12)

        // 将月份映射到图表月份（3-11月）
        const monthMapping = {
          3: '3月', 4: '4月', 5: '5月', 6: '6月', 7: '7月',
          8: '8月', 9: '9月', 10: '10月', 11: '11月'
        };

        const monthName = monthMapping[month];
        if (monthName) {
          // 根据严重程度分类
          let severityLevel = '轻微感染';
          if (pest.severity <= 30) severityLevel = '轻微感染';
          else if (pest.severity <= 60) severityLevel = '中度感染';
          else if (pest.severity <= 90) severityLevel = '重度感染';
          else severityLevel = '严重感染';

          data[monthName][severityLevel]++;
        }
      }
    });

    // 基于现有病虫害数据的科学分析
    // 当前活跃病虫害分析（2025年数据）：
    // P-001: 玉米蚜虫，4月15日，严重程度45%（中度感染），处理中
    // P-002: 棉花蚜虫，4月10日，严重程度65%（重度感染），待处理  
    // P-003: 棉铃虫，7月8日，严重程度50%（中度感染），处理中
    // P-004: 大豆蚜虫，4月12日，严重程度30%（轻微感染），处理中
    // P-005: 棉花红蜘蛛，7月14日，严重程度50%（中度感染），待处理

    // 数据科学合理性分析：
    // 1. 4月：春季蚜虫高发期，符合农业规律（3个活跃病虫害）
    // 2. 7月：夏季螟虫、红蜘蛛高发期，符合农业规律（2个活跃病虫害）
    // 3. 其他月份：基于历史数据和农业科学规律补充

    // 结合农业科学规律和现有数据的月度分布
    // 注意：实际活跃病虫害已通过上面的循环统计，这里只补充历史背景数据
    const historicalData = {
      '3月': { '轻微感染': 0, '中度感染': 0, '重度感染': 0, '严重感染': 0 }, // 春季初期，病虫害很少
      '4月': { '轻微感染': 0, '中度感染': 0, '重度感染': 0, '严重感染': 0 }, // 实际数据已统计（P-001, P-002, P-004）
      '5月': { '轻微感染': 1, '中度感染': 1, '重度感染': 0, '严重感染': 0 }, // 春季后期，蚜虫减少
      '6月': { '轻微感染': 0, '中度感染': 1, '重度感染': 0, '严重感染': 0 }, // 夏季初期，病虫害较少
      '7月': { '轻微感染': 0, '中度感染': 0, '重度感染': 0, '严重感染': 0 }, // 实际数据已统计（P-003, P-005）
      '8月': { '轻微感染': 1, '中度感染': 2, '重度感染': 1, '严重感染': 0 }, // 夏季高峰期，病虫害较多
      '9月': { '轻微感染': 1, '中度感染': 1, '重度感染': 0, '严重感染': 0 }, // 秋季初期，病害开始出现
      '10月': { '轻微感染': 0, '中度感染': 1, '重度感染': 0, '严重感染': 0 }, // 秋季病害高发期
      '11月': { '轻微感染': 0, '中度感染': 0, '重度感染': 0, '严重感染': 0 }  // 秋季后期，病虫害很少
    };

    // 合并实际数据和历史数据
    months.forEach(month => {
      severityLevels.forEach(level => {
        data[month][level] += historicalData[month][level];
      });
    });

    return { months, severityLevels, data };
  }

  const { months, severityLevels, data } = generateMonthlyPestData();

  // 生成堆叠柱状图数据
  const seriesData = severityLevels.map((level, index) => {
    const levelData = months.map(month => data[month][level]);

    return {
      name: level,
      type: 'bar',
      stack: 'total',
      data: levelData,
      itemStyle: {
        color: getSeverityColor(level)
      },
      emphasis: {
        focus: 'series'
      }
    };
  });

  // 获取严重程度颜色
  function getSeverityColor(level) {
    const colors = {
      '轻微感染': '#4CAF50',    // 绿色
      '中度感染': '#FF9800',    // 橙色
      '重度感染': '#FF5722',    // 深橙色
      '严重感染': '#F44336'     // 红色
    };
    return colors[level] || '#95A5A6';
  }

  chart.setOption({
    title: {
      text: '月度活跃病虫害严重程度分布',
      left: 'center',
      top: 10,
      textStyle: {
        fontSize: 18,
        fontWeight: 'bold',
        letterSpacing: 2,
        fontFamily: 'Microsoft YaHei, Arial, sans-serif',
        color: '#2E7D32'
      }
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#4CAF50',
      borderWidth: 1,
      textStyle: { color: '#333' },
      formatter: function (params) {
        let result = `${params[0].axisValue}<br/>`;
        let total = 0;

        params.forEach(param => {
          if (param.value > 0) {
            result += `${param.marker}${param.seriesName}: ${param.value}个<br/>`;
            total += param.value;
          }
        });

        result += `<strong>总计: ${total}个活跃病虫害</strong>`;
        return result;
      }
    },
    legend: {
      data: severityLevels,
      top: 50,
      left: 'center',
      textStyle: {
        fontSize: 14,
        fontWeight: 'bold'
      },
      itemGap: 20
    },
    grid: {
      left: '8%',
      right: '8%',
      top: '25%',
      bottom: '15%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: months,
      axisLine: {
        lineStyle: { color: '#E0E0E0' }
      },
      axisTick: { show: false },
      axisLabel: {
        color: '#666',
        fontSize: 12
      }
    },
    yAxis: {
      type: 'value',
      name: '活跃病虫害数量',
      nameTextStyle: {
        color: '#666',
        fontSize: 12
      },
      axisLine: {
        lineStyle: { color: '#E0E0E0' }
      },
      axisTick: { show: false },
      axisLabel: {
        color: '#666',
        fontSize: 12,
        formatter: '{value}个'
      },
      min: 0,
      max: 8,
      splitNumber: 5,
      splitLine: {
        lineStyle: {
          color: '#F5F5F5',
          type: 'dashed'
        }
      }
    },
    series: seriesData,
    animation: true,
    animationDuration: 1000,
    animationEasing: 'cubicOut'
  });

  // 添加统计信息按钮和弹窗
  const container = document.getElementById('pest-bar-chart').parentElement;

  // 创建统计按钮
  const statsBtn = document.createElement('button');
  statsBtn.innerHTML = '统计信息';
  statsBtn.style.cssText = `
    position: absolute;
    top: 10px;
    right: 10px;
    padding: 8px 12px;
    background: #4CAF50;
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 12px;
    cursor: pointer;
    z-index: 10;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    transition: all 0.3s ease;
  `;

  // 悬停效果
  statsBtn.addEventListener('mouseenter', () => {
    statsBtn.style.background = '#45a049';
    statsBtn.style.transform = 'translateY(-1px)';
    statsBtn.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
  });

  statsBtn.addEventListener('mouseleave', () => {
    statsBtn.style.background = '#4CAF50';
    statsBtn.style.transform = 'translateY(0)';
    statsBtn.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
  });

  // 计算统计数据
  const finalData = seriesData.map(series => series.data[series.data.length - 1]);
  const maxPest = severityLevels[finalData.indexOf(Math.max(...finalData))];
  const maxArea = Math.max(...finalData);
  const totalArea = finalData.reduce((sum, area) => sum + area, 0);

  // 创建弹窗
  function createStatsModal() {
    const modal = document.createElement('div');
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      z-index: 1000;
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity 0.3s ease;
    `;

    modal.innerHTML = `
      <div style="
        background: white;
        border-radius: 12px;
        padding: 24px;
        width: 400px;
        max-width: 90vw;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        transform: scale(0.9);
        transition: transform 0.3s ease;
      ">
        <div style="
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          padding-bottom: 12px;
          border-bottom: 2px solid #4CAF50;
        ">
          <h3 style="margin: 0; color: #2E7D32; font-size: 18px;">病虫害统计信息</h3>
          <button id="close-stats-modal" style="
            background: none;
            border: none;
            font-size: 20px;
            cursor: pointer;
            color: #666;
            padding: 4px;
            border-radius: 4px;
            transition: all 0.2s ease;
          ">✕</button>
          </div>
        
        <div style="display: grid; gap: 16px;">
          <div style="
            background: #f8f9fa;
            padding: 16px;
            border-radius: 8px;
            border-left: 4px solid #4CAF50;
          ">
            <div style="font-weight: bold; color: #333; margin-bottom: 8px;">感染面积统计</div>
            <div style="font-size: 14px; color: #666; line-height: 1.6;">
              <div>最大感染面积: <span style="color: #4CAF50; font-weight: bold;">${maxPest} (${maxArea}亩)</span></div>
              <div>总感染面积: <span style="color: #FF9800; font-weight: bold;">${totalArea.toFixed(1)}亩</span></div>
          </div>
        </div>

          <div style="
            background: #f8f9fa;
            padding: 16px;
            border-radius: 8px;
            border-left: 4px solid #2196F3;
          ">
            <div style="font-weight: bold; color: #333; margin-bottom: 8px;">田块信息</div>
            <div style="font-size: 14px; color: #666; line-height: 1.6;">
              <div>田块总数: <span style="color: #2196F3; font-weight: bold;">4个</span></div>
              <div>监测时间: <span style="color: #2196F3; font-weight: bold;">8月-11月</span></div>
          </div>
        </div>

          <div style="
            background: #f8f9fa;
            padding: 16px;
            border-radius: 8px;
            border-left: 4px solid #FF9800;
          ">
            <div style="font-weight: bold; color: #333; margin-bottom: 8px;">数据详情</div>
            <div style="font-size: 14px; color: #666; line-height: 1.6;">
              ${pestTypes.map((pest, index) => `
                <div>${pest}: <span style="color: #FF9800; font-weight: bold;">${finalData[index]}亩</span></div>
              `).join('')}
            </div>
          </div>
          </div>
        
        <div style="
          margin-top: 20px;
          padding-top: 16px;
          border-top: 1px solid #eee;
          text-align: center;
        ">
          <button id="close-stats-modal-btn" style="
            background: #4CAF50;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            transition: all 0.2s ease;
          ">关闭</button>
      </div>
    </div>
  `;

    // 显示动画
    setTimeout(() => {
      modal.style.opacity = '1';
      modal.querySelector('div').style.transform = 'scale(1)';
    }, 10);

    // 关闭功能
    function closeModal() {
      modal.style.opacity = '0';
      modal.querySelector('div').style.transform = 'scale(0.9)';
      setTimeout(() => {
        document.body.removeChild(modal);
      }, 300);
    }

    modal.querySelector('#close-stats-modal').addEventListener('click', closeModal);
    modal.querySelector('#close-stats-modal-btn').addEventListener('click', closeModal);

    // 点击背景关闭
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });

    // ESC键关闭
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        closeModal();
        document.removeEventListener('keydown', handleEsc);
      }
    };
    document.addEventListener('keydown', handleEsc);

    document.body.appendChild(modal);
  }

  // 绑定点击事件
  statsBtn.addEventListener('click', createStatsModal);

  container.style.position = 'relative';
  container.appendChild(statsBtn);
}

// 2. 田块月度健康率趋势图
function renderFieldHealthTrendChart(fieldStats) {
  const chart = echarts.init(document.getElementById('field-health-trend-chart'));

  // 生成过去12个月的月度数据
  const months = [];
  const currentDate = new Date();
  for (let i = 11; i >= 0; i--) {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
    months.push(date.toLocaleDateString('zh-CN', { year: 'numeric', month: 'short' }));
  }

  // 筛选出玉米田数据
  const cornFields = fieldStats.fieldsWithHealth.filter(field => field.crop === '玉米');

  // 为每个田块生成月度健康率数据
  const allFieldTrendData = fieldStats.fieldsWithHealth.map(field => {
    const trendData = months.map((month, index) => {
      // 基于当前健康度生成历史趋势
      const baseHealth = field.health;

      // 模拟季节性变化（春季播种期健康度较低，夏季生长期较高）
      const seasonalFactor = Math.sin((index - 2) * Math.PI / 6) * 15; // 春季(3-4月)较低，夏季(6-8月)较高

      // 模拟随机波动
      const randomFactor = (Math.random() - 0.5) * 20;

      // 模拟病虫害影响（基于当前病虫害情况）
      const pestImpact = field.pestCount > 0 ? -field.pestCount * 8 : 0;

      // 模拟设备状态影响
      const deviceImpact = field.deviceCount >= 3 ? 5 : -5;

      // 计算最终健康率
      const healthRate = Math.max(20, Math.min(100,
        baseHealth + seasonalFactor + randomFactor + pestImpact + deviceImpact
      ));

      return Math.round(healthRate);
    });

    return {
      name: `${field.id} ${field.name}`,
      type: 'line',
      data: trendData,
      smooth: true,
      symbol: 'circle',
      symbolSize: 6,
      areaStyle: {
        opacity: 0.3
      },
      lineStyle: {
        width: 3
      },
      itemStyle: {
        borderWidth: 2
      },
      // 根据作物类型设置颜色
      itemStyle: {
        color: field.crop === '玉米' ? '#4CAF50' :
          field.crop === '大豆' ? '#FF9800' : '#2196F3'
      },
      lineStyle: {
        color: field.crop === '玉米' ? '#4CAF50' :
          field.crop === '大豆' ? '#FF9800' : '#2196F3'
      },
      areaStyle: {
        color: field.crop === '玉米' ? 'rgba(76, 175, 80, 0.3)' :
          field.crop === '大豆' ? 'rgba(255, 152, 0, 0.3)' : 'rgba(33, 150, 243, 0.3)'
      }
    };
  });

  // 为玉米田数据设置默认显示，其他数据默认隐藏
  const fieldTrendData = allFieldTrendData.map((fieldData, index) => {
    const isCornField = fieldStats.fieldsWithHealth[index].crop === '玉米';
    return {
      ...fieldData,
      // 只有玉米田默认显示，其他田块默认隐藏
      show: isCornField
    };
  });

  chart.setOption({
    title: {
      text: '田块月度健康率趋势',
      left: 'center',
      top: 10,
      textStyle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2E7D32'
      }
    },
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#4CAF50',
      borderWidth: 1,
      textStyle: { color: '#333' },
      formatter: function (params) {
        let result = `${params[0].axisValue}<br/>`;
        params.forEach(param => {
          const fieldInfo = param.seriesName.split(' ');
          const fieldId = fieldInfo[0];
          const fieldName = fieldInfo.slice(1).join(' ');
          result += `${param.marker}${fieldId} ${fieldName}: ${param.value}%<br/>`;
        });
        return result;
      }
    },
    legend: {
      data: allFieldTrendData.map(f => f.name),
      top: 50,
      left: 'center',
      textStyle: { fontSize: 12 },
      itemGap: 15,
      type: 'scroll',
      selected: (() => {
        const selected = {};
        allFieldTrendData.forEach((fieldData, index) => {
          const isCornField = fieldStats.fieldsWithHealth[index].crop === '玉米';
          selected[fieldData.name] = isCornField;
        });
        return selected;
      })()
    },
    grid: {
      left: '8%',
      right: '8%',
      top: '32%',
      bottom: '15%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: months,
      axisLine: {
        lineStyle: { color: '#E0E0E0' }
      },
      axisTick: { show: false },
      axisLabel: {
        color: '#666',
        fontSize: 12,
        rotate: 45
      }
    },
    yAxis: {
      type: 'value',
      name: '健康率 (%)',
      nameTextStyle: {
        color: '#666',
        fontSize: 12
      },
      axisLine: {
        lineStyle: { color: '#E0E0E0' }
      },
      axisTick: { show: false },
      axisLabel: {
        color: '#666',
        fontSize: 12,
        formatter: '{value}%'
      },
      min: 0,
      max: 100,
      splitLine: {
        lineStyle: {
          color: '#F5F5F5',
          type: 'dashed'
        }
      }
    },
    series: allFieldTrendData,
    animation: true,
    animationDuration: 1500,
    animationEasing: 'cubicOut'
  });

  // 添加健康率参考线
  setTimeout(() => {
    chart.setOption({
      series: [
        ...allFieldTrendData,
        {
          name: '健康基准线',
          type: 'line',
          data: Array(months.length).fill(80),
          lineStyle: {
            color: '#4CAF50',
            width: 2,
            type: 'dashed'
          },
          symbol: 'none',
          silent: true,
          z: 0
        },
        {
          name: '预警线',
          type: 'line',
          data: Array(months.length).fill(60),
          lineStyle: {
            color: '#FF9800',
            width: 2,
            type: 'dashed'
          },
          symbol: 'none',
          silent: true,
          z: 0
        }
      ]
    });
  }, 1000);
}

// 3. 田块多维度健康评估对比雷达图
function renderFieldHealthRadarChart(fieldStats) {
  const chart = echarts.init(document.getElementById('field-health-radar-chart'));

  // 获取设备数据和病虫害数据
  const devices = createMockDevices();
  const pests = getPests();

  // 选择要对比的田块（可以选择前3-4个主要田块）
  const selectedFields = fieldStats.fieldsWithHealth.slice(0, 4);

  // 定义雷达图的维度指标
  const indicators = [
    { name: '温度适宜度', max: 100 },
    { name: '湿度适宜度', max: 100 },
    { name: '降雨适宜度', max: 100 },
    { name: '日照充足度', max: 100 },
    { name: '病虫害控制', max: 100 },
    { name: '设备状态', max: 100 }
  ];

  // 为每个田块计算各项指标
  const seriesData = selectedFields.map(field => {
    // 获取该田块的设备数据
    const fieldDevices = devices.filter(d => d.fieldId === field.id);
    const fieldPests = pests.filter(p => p.fieldId === field.id);

    // 计算各项指标
    let tempScore = 75; // 温度适宜度
    let humidityScore = 75; // 湿度适宜度
    let rainfallScore = 75; // 降雨适宜度
    let sunshineScore = 75; // 日照充足度
    let pestControlScore = 100; // 病虫害控制
    let deviceStatusScore = 100; // 设备状态

    // 从设备数据中获取环境指标
    fieldDevices.forEach(device => {
      if (device.dataReadings) {
        const readings = device.dataReadings;

        // 温度评分（最佳范围 18-28°C）
        if (readings.temperature !== undefined) {
          const temp = readings.temperature;
          if (temp >= 18 && temp <= 28) {
            tempScore = Math.max(tempScore, 100);
          } else if (temp >= 15 && temp <= 32) {
            tempScore = Math.max(tempScore, 80);
          } else {
            const dist = Math.min(Math.abs(temp - 18), Math.abs(temp - 28));
            tempScore = Math.max(tempScore, Math.max(40, 100 - dist * 3));
          }
        }

        // 湿度评分（最佳范围 60-80%）
        if (readings.humidity !== undefined) {
          const hum = readings.humidity;
          if (hum >= 60 && hum <= 80) {
            humidityScore = Math.max(humidityScore, 100);
          } else if (hum >= 50 && hum <= 90) {
            humidityScore = Math.max(humidityScore, 80);
          } else {
            const dist = Math.min(Math.abs(hum - 60), Math.abs(hum - 80));
            humidityScore = Math.max(humidityScore, Math.max(40, 100 - dist * 2));
          }
        }

        // 降雨评分（最佳范围 5-15mm）
        if (readings.rainfall !== undefined) {
          const rain = readings.rainfall;
          if (rain >= 5 && rain <= 15) {
            rainfallScore = Math.max(rainfallScore, 100);
          } else if (rain >= 2 && rain <= 25) {
            rainfallScore = Math.max(rainfallScore, 80);
          } else {
            const dist = Math.min(Math.abs(rain - 5), Math.abs(rain - 15));
            rainfallScore = Math.max(rainfallScore, Math.max(40, 100 - dist * 4));
          }
        }

        // 日照评分（最佳 ≥6小时）
        if (readings.sunshine !== undefined) {
          const sun = readings.sunshine;
          if (sun >= 6) {
            sunshineScore = Math.max(sunshineScore, 100);
          } else if (sun >= 4) {
            sunshineScore = Math.max(sunshineScore, 80);
          } else {
            sunshineScore = Math.max(sunshineScore, sun * 15);
          }
        }
      }
    });

    // 如果没有设备数据，使用田块的weatherData
    if (fieldDevices.length === 0 && field.weatherData) {
      const wd = field.weatherData;

      // 温度
      if (wd.temperature) {
        const temp = wd.temperature;
        if (temp >= 18 && temp <= 28) tempScore = 100;
        else if (temp >= 15 && temp <= 32) tempScore = 80;
        else tempScore = Math.max(40, 100 - Math.min(Math.abs(temp - 18), Math.abs(temp - 28)) * 3);
      }

      // 湿度
      if (wd.humidity) {
        const hum = wd.humidity;
        if (hum >= 60 && hum <= 80) humidityScore = 100;
        else if (hum >= 50 && hum <= 90) humidityScore = 80;
        else humidityScore = Math.max(40, 100 - Math.min(Math.abs(hum - 60), Math.abs(hum - 80)) * 2);
      }

      // 降雨
      if (wd.rainfall) {
        const rain = wd.rainfall;
        if (rain >= 5 && rain <= 15) rainfallScore = 100;
        else if (rain >= 2 && rain <= 25) rainfallScore = 80;
        else rainfallScore = Math.max(40, 100 - Math.min(Math.abs(rain - 5), Math.abs(rain - 15)) * 4);
      }

      // 日照
      if (wd.sunshine) {
        const sun = wd.sunshine;
        if (sun >= 6) sunshineScore = 100;
        else if (sun >= 4) sunshineScore = 80;
        else sunshineScore = Math.max(40, sun * 15);
      }
    }

    // 计算病虫害控制评分（基于活跃病虫害）
    const activePests = fieldPests.filter(p =>
      p.status === '待处理' || p.status === '处理中' || p.isActive !== false
    );

    if (activePests.length > 0) {
      const severityMap = { '低': 25, '中': 50, '高': 75, '严重': 100 };
      let totalSeverity = 0;
      activePests.forEach(pest => {
        const severity = pest.severity || (severityMap[pest.level] || 50);
        totalSeverity += severity;
      });
      const avgSeverity = totalSeverity / activePests.length;
      pestControlScore = Math.max(20, 100 - avgSeverity - activePests.length * 10);
    }

    // 计算设备状态评分
    const onlineDevices = fieldDevices.filter(d => d.status === 'online').length;
    const totalDevices = fieldDevices.length || 1;
    deviceStatusScore = Math.round((onlineDevices / totalDevices) * 100);

    return {
      value: [
        Math.round(tempScore),
        Math.round(humidityScore),
        Math.round(rainfallScore),
        Math.round(sunshineScore),
        Math.round(pestControlScore),
        Math.round(deviceStatusScore)
      ],
      name: field.name || `${field.crop}田`
    };
  });

  chart.setOption({
    title: {
      text: '田块多维度健康评估对比',
      left: 'center',
      top: 10,
      textStyle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2E7D32'
      }
    },
    tooltip: {
      trigger: 'item',
      formatter: function (params) {
        let result = `<strong>${params.name}</strong><br/>`;
        params.value.forEach((value, index) => {
          result += `${indicators[index].name}: <span style="color:${params.color}">${value}分</span><br/>`;
        });
        return result;
      }
    },
    legend: {
      data: seriesData.map(item => item.name),
      bottom: 10,
      left: 'center',
      textStyle: {
        fontSize: 12
      }
    },
    radar: {
      indicator: indicators,
      radius: '65%',
      center: ['50%', '48%'],
      name: {
        textStyle: {
          color: '#666',
          fontSize: 12,
          fontWeight: 'bold'
        }
      },
      splitArea: {
        show: true,
        areaStyle: {
          color: ['rgba(76, 175, 80, 0.1)', 'rgba(76, 175, 80, 0.05)']
        }
      },
      splitLine: {
        lineStyle: {
          color: 'rgba(76, 175, 80, 0.3)'
        }
      },
      axisLine: {
        lineStyle: {
          color: 'rgba(76, 175, 80, 0.5)'
        }
      }
    },
    series: [{
      name: '田块健康评估',
      type: 'radar',
      data: seriesData.map((item, index) => {
        const colors = ['#4CAF50', '#2196F3', '#FF9800', '#9C27B0'];
        return {
          ...item,
          itemStyle: {
            color: colors[index % colors.length]
          },
          areaStyle: {
            color: colors[index % colors.length],
            opacity: 0.3
          },
          lineStyle: {
            width: 2,
            color: colors[index % colors.length]
          }
        };
      })
    }]
  });

  // 创建评分标准说明提示框
  const chartContainer = document.getElementById('field-health-radar-chart').parentElement;
  chartContainer.style.position = 'relative';

  // 检查是否已存在图标，避免重复添加
  let existingIcon = chartContainer.querySelector('.radar-info-icon');
  if (existingIcon) {
    existingIcon.remove();
  }
  let existingTooltip = chartContainer.querySelector('.radar-tooltip');
  if (existingTooltip) {
    existingTooltip.remove();
  }

  // 创建信息图标
  const infoIcon = document.createElement('div');
  infoIcon.className = 'radar-info-icon';
  infoIcon.innerHTML = 'ℹ️';
  infoIcon.style.cssText = `
    position: absolute;
    top: 15px;
    right: 15px;
    width: 24px;
    height: 24px;
    background: rgba(33, 150, 243, 0.1);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: help;
    font-size: 16px;
    z-index: 10;
    transition: all 0.3s ease;
    user-select: none;
  `;

  // 创建提示框内容 - 纯文字简洁版本
  const tooltipContent = `
    <div style="
      background: white;
      border-radius: 8px;
      padding: 16px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      max-width: 280px;
      font-size: 13px;
      line-height: 1.8;
      color: #333;
    ">
      <div style="font-weight: 600; margin-bottom: 12px; font-size: 14px; border-bottom: 1px solid #e0e0e0; padding-bottom: 8px;">
        各维度评分标准
      </div>
      
      <div style="margin-bottom: 10px;">
        <strong>温度适宜度：</strong><br>
        18-28°C：100分 | 15-32°C：80分
      </div>
      
      <div style="margin-bottom: 10px;">
        <strong>湿度适宜度：</strong><br>
        60-80%：100分 | 50-90%：80分
      </div>
      
      <div style="margin-bottom: 10px;">
        <strong>降雨适宜度：</strong><br>
        5-15mm：100分 | 2-25mm：80分
      </div>
      
      <div style="margin-bottom: 10px;">
        <strong>日照充足度：</strong><br>
        ≥6小时：100分 | 4-6小时：80分
      </div>
      
      <div style="margin-bottom: 10px;">
        <strong>病虫害控制：</strong><br>
        无病虫害：100分<br>
        有病虫害：100-严重程度-数量×10
      </div>
      
      <div>
        <strong>设备状态：</strong><br>
        在线率 × 100
      </div>
    </div>
  `;

  // 创建提示框
  const tooltip = document.createElement('div');
  tooltip.className = 'radar-tooltip';
  tooltip.innerHTML = tooltipContent;
  tooltip.style.cssText = `
    position: absolute;
    bottom: 35px;
    right: 0;
    display: none;
    z-index: 1000;
    animation: fadeIn 0.3s ease;
  `;

  // 添加CSS动画
  if (!document.getElementById('radar-tooltip-style')) {
    const style = document.createElement('style');
    style.id = 'radar-tooltip-style';
    style.textContent = `
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(-10px); }
        to { opacity: 1; transform: translateY(0); }
      }
    `;
    document.head.appendChild(style);
  }

  // 悬浮显示/隐藏提示框
  infoIcon.addEventListener('mouseenter', () => {
    tooltip.style.display = 'block';
    infoIcon.style.background = 'rgba(33, 150, 243, 0.2)';
    infoIcon.style.transform = 'scale(1.1)';
  });

  infoIcon.addEventListener('mouseleave', () => {
    tooltip.style.display = 'none';
    infoIcon.style.background = 'rgba(33, 150, 243, 0.1)';
    infoIcon.style.transform = 'scale(1)';
  });

  // 添加到容器
  chartContainer.appendChild(infoIcon);
  chartContainer.appendChild(tooltip);

  // 图表尺寸变化时更新图标位置
  chart.on('resize', () => {
    // 图标位置已在CSS中设置，无需调整
  });
}

// 3. 动态田块健康度与病虫害发生率关系分析图（按季度）- 已替换为雷达图，保留作为备用
function renderYieldHealthChart(fieldStats) {
  const chart = echarts.init(document.getElementById('yield-health-chart'));

  // 时间周期定义
  const timePeriods = [
    { name: '播种期', period: 'Q1', months: '1-3月' },
    { name: '生长期', period: 'Q2', months: '4-6月' },
    { name: '成熟期', period: 'Q3', months: '7-9月' },
    { name: '收获期', period: 'Q4', months: '10-12月' }
  ];

  let currentPeriodIndex = 2; // 默认显示成熟期
  let isAutoPlaying = false;
  let autoPlayInterval = null;

  // 生成时间序列数据
  function generateTimeSeriesData() {
    const data = [];
    timePeriods.forEach((periodInfo, periodIndex) => {
      const periodData = generateCropData('玉米', periodIndex, periodInfo);
      const cabbageData = generateCropData('白菜', periodIndex, periodInfo);

      data.push({
        period: periodInfo.period,
        name: periodInfo.name,
        months: periodInfo.months,
        corn: periodData,
        cabbage: cabbageData
      });
    });
    return data;
  }

  // 生成作物数据（基于真实病虫害数据和田块数据）
  function generateCropData(crop, periodIndex, periodInfo) {
    // 获取真实病虫害数据
    const pests = getPests();
    const fieldId = crop === '玉米' ? 'F-001' : 'F-004'; // 玉米田F-001，白菜田F-004

    // 找到对应的田块数据（F-004在baseFieldsData中是大豆田，但在图表中作为白菜田展示）
    let field = baseFieldsData.find(f => f.id === fieldId);

    // 如果F-004不存在或不是目标作物，创建一个临时田块数据用于计算
    if (!field || (crop === '白菜' && field.crop !== '白菜')) {
      // 为白菜创建一个基于F-004数据的临时田块对象（使用实际设备数据）
      if (crop === '白菜' && fieldId === 'F-004') {
        field = {
          id: 'F-004',
          crop: '白菜',
          area: 6.0,
          time: '今天 10:20',
          soilType: '水稻土',
          irrigation: '滴灌系统',
          lastHarvest: '2024年9月25日',
          expectedYield: 720,
          plantingDate: '2024年4月20日',
          variety: '中黄13',
          deviceCount: 2,
          pestCount: 0,
          weatherData: {
            temperature: 21.8,
            humidity: 69,
            rainfall: 8.8,
            sunshine: 6.2
          }
        };
      } else {
        console.warn(`未找到田块 ${fieldId}`);
        return {
          healthScore: 75,
          pestCount: 0,
          pestIncidenceRate: 0,
          pestSeverity: 0,
          fieldId: fieldId,
          crop: crop
        };
      }
    }

    // 使用真实的健康度计算函数
    const healthScore = calculateHealthScore(field);

    // 获取该田块的病虫害数据（只统计活跃的：status为'待处理'或'处理中'）
    const fieldPests = pests.filter(p => {
      return p.fieldId === fieldId &&
        (p.status === '待处理' || p.status === '处理中' || p.isActive !== false);
    });

    // 计算病虫害发生率（基于真实数据）
    let pestCount = fieldPests.length;
    let pestSeverity = 0; // 平均严重程度
    let pestIncidenceRate = 0; // 发生率（百分比）

    if (fieldPests.length > 0) {
      // 计算平均严重程度（使用真实数据中的severity字段，如果没有则根据level计算）
      const severityMap = { '低': 25, '中': 50, '高': 75, '严重': 100 };
      let totalSeverity = 0;
      fieldPests.forEach(pest => {
        // 优先使用severity字段，如果没有则使用level映射
        if (pest.severity !== undefined && pest.severity !== null) {
          totalSeverity += pest.severity;
        } else {
          totalSeverity += (severityMap[pest.level] || 50);
        }
      });
      pestSeverity = Math.round(totalSeverity / fieldPests.length);

      // 计算发生率（基于病虫害数量、严重程度和状态）
      // 基础发生率：每个活跃病虫害贡献基础发生率
      let baseIncidence = fieldPests.length * 10; // 每个病虫害基础10%

      // 根据严重程度调整
      baseIncidence += pestSeverity * 0.4; // 严重程度每1分贡献0.4%

      // 根据状态调整（待处理的影响更大）
      fieldPests.forEach(pest => {
        if (pest.status === '待处理') {
          baseIncidence += 8; // 待处理增加8%
        } else if (pest.status === '处理中') {
          baseIncidence += 4; // 处理中增加4%
        }
      });

      pestIncidenceRate = Math.min(100, Math.round(baseIncidence));
    }

    // 根据季度和作物类型微调（基于农业规律，但不覆盖真实数据）
    // 这个调整是季节性的，基于实际农业经验
    let seasonalAdjustment = 0;
    if (crop === '玉米') {
      if (periodIndex === 1) { // Q2 生长期 - 玉米螟高发期
        seasonalAdjustment = Math.max(0, 5 - pestCount * 2); // 如果真实数据少，适当补充
      } else if (periodIndex === 2) { // Q3 成熟期 - 玉米叶斑病
        seasonalAdjustment = Math.max(0, 3 - pestCount * 1.5);
      }
    } else if (crop === '白菜') {
      if (periodIndex === 0) { // Q1 播种期 - 菜青虫开始
        seasonalAdjustment = Math.max(0, 4 - pestCount * 2);
      } else if (periodIndex === 3) { // Q4 收获期 - 白菜软腐病
        seasonalAdjustment = Math.max(0, 6 - pestCount * 2);
      }
    }

    pestIncidenceRate = Math.min(100, pestIncidenceRate + seasonalAdjustment);

    return {
      healthScore: healthScore,
      pestCount: pestCount,
      pestIncidenceRate: Math.round(pestIncidenceRate),
      pestSeverity: pestSeverity,
      fieldId: fieldId,
      crop: crop,
      fieldName: field.name || `${crop}田`
    };
  }

  const timeSeriesData = generateTimeSeriesData();

  function updateChart() {
    const currentData = timeSeriesData[currentPeriodIndex];

    const cornData = currentData.corn;
    const cabbageData = currentData.cabbage;

    const pestIncidenceData = [];
    const healthData = [];

    // 玉米数据
    pestIncidenceData.push(cornData.pestIncidenceRate || 0);
    healthData.push(cornData.healthScore);

    // 白菜数据
    pestIncidenceData.push(cabbageData.pestIncidenceRate || 0);
    healthData.push(cabbageData.healthScore);

    chart.setOption({
      title: {
        text: `田块健康度与病虫害发生率关系分析 (${currentData.name} ${currentData.months})`,
        left: 'center',
        top: 10,
        textStyle: {
          fontSize: 18,
          fontWeight: 'bold',
          letterSpacing: 2,
          fontFamily: 'Microsoft YaHei, Arial, sans-serif',
          color: '#2E7D32'
        }
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'cross' },
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderColor: '#4CAF50',
        borderWidth: 1,
        textStyle: { color: '#333' },
        formatter: function (params) {
          const cropName = params[0].name;
          const cropIndex = cropName === '玉米' ? 0 : 1;
          const cropData = cropIndex === 0 ? cornData : cabbageData;

          let result = `<strong>${cropName}</strong> (${currentData.name})<br/>`;
          params.forEach(param => {
            if (param.seriesName === '病虫害发生率') {
              result += `${param.seriesName}: <span style="color:#F44336;font-weight:bold">${param.value}%</span><br/>`;
            } else {
              result += `${param.seriesName}: <span style="color:#FF9800;font-weight:bold">${param.value}分</span><br/>`;
            }
          });
          result += `<br/><span style="color:#666;font-size:11px">活跃病虫害: ${cropData.pestCount || 0}种</span><br/>`;
          result += `<span style="color:#666;font-size:11px">平均严重程度: ${cropData.pestSeverity || 0}分</span>`;
          return result;
        }
      },
      legend: {
        data: ['病虫害发生率', '健康评分'],
        top: 50,
        left: 'center',
        textStyle: { fontSize: 14, fontWeight: 'bold' }
      },
      grid: {
        left: '8%',
        right: '8%',
        top: '25%',
        bottom: '20%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: ['玉米', '白菜'],
        axisLine: { lineStyle: { color: '#E0E0E0' } },
        axisLabel: { color: '#666', fontSize: 12, fontWeight: 'bold' }
      },
      yAxis: [
        {
          type: 'value',
          name: '病虫害发生率 (%)',
          nameTextStyle: { color: '#F44336', fontSize: 12, fontWeight: 'bold' },
          axisLine: { lineStyle: { color: '#F44336' } },
          axisLabel: { color: '#F44336', fontSize: 12 },
          min: 0,
          max: 100,
          splitLine: {
            lineStyle: { color: 'rgba(244, 67, 54, 0.2)', type: 'dashed' }
          }
        },
        {
          type: 'value',
          name: '健康评分',
          nameTextStyle: { color: '#FF9800', fontSize: 12, fontWeight: 'bold' },
          axisLine: { lineStyle: { color: '#FF9800' } },
          axisLabel: { color: '#FF9800', fontSize: 12 },
          min: 0,
          max: 100
        }
      ],
      series: [
        {
          name: '病虫害发生率',
          type: 'bar',
          yAxisIndex: 0,
          data: pestIncidenceData,
          itemStyle: {
            color: function (params) {
              const value = params.value;
              // 根据发生率高低显示不同颜色
              if (value >= 50) return '#F44336'; // 红色 - 高发生率
              if (value >= 30) return '#FF9800'; // 橙色 - 中等发生率
              if (value >= 15) return '#FFC107'; // 黄色 - 低发生率
              return '#8BC34A'; // 绿色 - 很低发生率
            },
            borderRadius: [4, 4, 0, 0]
          },
          barWidth: '40%',
          label: {
            show: true,
            position: 'top',
            formatter: '{c}%',
            color: '#F44336',
            fontSize: 12,
            fontWeight: 'bold'
          }
        },
        {
          name: '健康评分',
          type: 'line',
          yAxisIndex: 1,
          data: healthData,
          lineStyle: {
            color: '#FF9800',
            width: 3
          },
          itemStyle: {
            color: '#FF9800',
            borderColor: '#fff',
            borderWidth: 2
          },
          symbol: 'circle',
          symbolSize: 10,
          label: {
            show: true,
            position: 'top',
            formatter: '{c}分',
            color: '#FF9800',
            fontSize: 12,
            fontWeight: 'bold'
          }
        }
      ]
    });
  }

  // 创建时间控制按钮
  function createTimeControls() {
    const container = document.getElementById('yield-health-chart').parentElement;

    // 移除现有的控制按钮
    const existingControls = container.querySelector('.time-controls');
    if (existingControls) {
      existingControls.remove();
    }

    const controlsDiv = document.createElement('div');
    controlsDiv.className = 'time-controls';
    controlsDiv.style.cssText = `
      position: absolute;
      top: 10px;
      right: 10px;
      display: flex;
      gap: 6px;
      z-index: 10;
      flex-wrap: wrap;
    `;

    // 时间周期按钮
    timePeriods.forEach((period, index) => {
      const btn = document.createElement('button');
      btn.textContent = period.period;
      btn.title = `${period.name} (${period.months})`;
      btn.style.cssText = `
        padding: 4px 8px;
        border: 1px solid #4CAF50;
        border-radius: 4px;
        background: ${index === currentPeriodIndex ? '#4CAF50' : '#fff'};
        color: ${index === currentPeriodIndex ? '#fff' : '#4CAF50'};
        cursor: pointer;
        font-size: 11px;
        transition: all 0.2s ease;
        min-width: 32px;
      `;

      btn.addEventListener('click', () => {
        currentPeriodIndex = index;
        updateChart();
        updateTimeButtons();
        if (isAutoPlaying) {
          stopAutoPlay();
        }
      });

      controlsDiv.appendChild(btn);
    });

    // 自动播放按钮
    const autoPlayBtn = document.createElement('button');
    autoPlayBtn.textContent = isAutoPlaying ? '暂停' : '自动播放';
    autoPlayBtn.style.cssText = `
      padding: 4px 8px;
      border: 1px solid #FF9800;
      border-radius: 4px;
      background: ${isAutoPlaying ? '#FF9800' : '#fff'};
      color: ${isAutoPlaying ? '#fff' : '#FF9800'};
      cursor: pointer;
      font-size: 11px;
      transition: all 0.2s ease;
      white-space: nowrap;
    `;

    autoPlayBtn.addEventListener('click', () => {
      if (isAutoPlaying) {
        stopAutoPlay();
      } else {
        startAutoPlay();
      }
    });

    controlsDiv.appendChild(autoPlayBtn);

    // 健康区间分析按钮
    const analysisBtn = document.createElement('button');
    analysisBtn.textContent = '健康区间分析';
    analysisBtn.style.cssText = `
      padding: 4px 8px;
      border: 1px solid #9C27B0;
      border-radius: 4px;
      background: #fff;
      color: #9C27B0;
      cursor: pointer;
      font-size: 11px;
      transition: all 0.2s ease;
      white-space: nowrap;
    `;

    analysisBtn.addEventListener('click', () => {
      showHealthIntervalAnalysis();
    });

    controlsDiv.appendChild(analysisBtn);

    // 确保容器有相对定位
    container.style.position = 'relative';
    container.appendChild(controlsDiv);

    function updateTimeButtons() {
      const buttons = controlsDiv.querySelectorAll('button');
      timePeriods.forEach((period, index) => {
        const btn = buttons[index];
        if (btn) {
          btn.style.background = index === currentPeriodIndex ? '#4CAF50' : '#fff';
          btn.style.color = index === currentPeriodIndex ? '#fff' : '#4CAF50';
        }
      });

      autoPlayBtn.style.background = isAutoPlaying ? '#FF9800' : '#fff';
      autoPlayBtn.style.color = isAutoPlaying ? '#fff' : '#FF9800';
      autoPlayBtn.textContent = isAutoPlaying ? '暂停' : '自动播放';
    }

    function startAutoPlay() {
      isAutoPlaying = true;
      autoPlayInterval = setInterval(() => {
        currentPeriodIndex = (currentPeriodIndex + 1) % timePeriods.length;
        updateChart();
        updateTimeButtons();
      }, 4000);
    }

    function stopAutoPlay() {
      isAutoPlaying = false;
      if (autoPlayInterval) {
        clearInterval(autoPlayInterval);
        autoPlayInterval = null;
      }
    }
  }

  // 健康区间分析弹窗
  function showHealthIntervalAnalysis() {
    const modal = document.createElement('div');
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    `;

    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
      background: white;
      border-radius: 12px;
      padding: 24px;
      width: 90%;
      max-width: 800px;
      max-height: 90%;
      overflow-y: auto;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    `;

    modalContent.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
        <h3 style="margin: 0; color: #2E7D32;">健康区间分析</h3>
        <button id="close-modal" style="background: none; border: none; font-size: 24px; cursor: pointer;">&times;</button>
      </div>
      
      <div id="health-interval-chart" style="height: 400px; margin-bottom: 20px;"></div>
      
      <div style="background: #f5f5f5; padding: 16px; border-radius: 8px; margin-bottom: 16px;">
        <h4 style="margin: 0 0 12px 0; color: #2E7D32;">分析结论</h4>
        <ul style="margin: 0; padding-left: 20px;">
          <li>健康评分在71-100区间时，病虫害发生率通常&lt;20%，田块处于良好状态</li>
          <li>健康评分在41-70区间时，病虫害发生率在20-40%之间，需要加强监测和防治</li>
          <li>健康评分在0-40区间时，病虫害发生率通常&gt;40%，需要紧急干预措施</li>
        </ul>
      </div>
      
      <div style="background: #fff3e0; padding: 16px; border-radius: 8px; margin-bottom: 16px;">
        <h4 style="margin: 0 0 12px 0; color: #f57c00;">异常案例归因分析</h4>
        <div style="font-size: 14px;">
          <p><strong>健康高但病虫害发生率高：</strong>可能是新发病虫害或环境突变导致（如连续降雨诱发病害）</p>
          <p><strong>健康低但病虫害发生率低：</strong>可能是非病虫害因素导致健康度下降（如土壤养分不足、极端天气）</p>
        </div>
      </div>
      
      <div style="background: #e8f5e8; padding: 16px; border-radius: 8px; margin-bottom: 16px;">
        <h4 style="margin: 0 0 12px 0; color: #2e7d32;">健康与病虫害关系模型</h4>
        <div style="font-size: 14px;">
          <p>• 健康评分≥71：病虫害发生率通常&lt;25%，风险可控</p>
          <p>• 健康评分41-70：病虫害发生率25-45%，需要加强预防</p>
          <p>• 健康评分≤40：病虫害发生率通常&gt;45%，存在严重风险</p>
        </div>
      </div>
      
      <div style="background: #f3e5f5; padding: 16px; border-radius: 8px;">
        <h4 style="margin: 0 0 12px 0; color: #7b1fa2;">健康管理建议</h4>
        <div style="font-size: 14px;">
          <p>• 当健康评分&lt;70且病虫害发生率&gt;30%时，建议立即采取防治措施</p>
          <p>• 当健康评分≥80时，可维持当前管理策略，但仍需定期监测病虫害动态</p>
          <p>• 病虫害发生率持续上升时，即使健康评分较高，也应提前预警和预防</p>
        </div>
      </div>
    `;

    modal.appendChild(modalContent);
    document.body.appendChild(modal);

    // 渲染健康区间分析图表
    const intervalChart = echarts.init(document.getElementById('health-interval-chart'));

    // 计算各健康区间的平均病虫害发生率
    const intervals = [
      { name: '低 (0-40)', min: 0, max: 40, color: '#f44336' },
      { name: '中 (41-70)', min: 41, max: 70, color: '#ff9800' },
      { name: '高 (71-100)', min: 71, max: 100, color: '#4caf50' }
    ];

    const cornData = [];
    const cabbageData = [];

    intervals.forEach(interval => {
      // 根据健康区间计算平均病虫害发生率
      // 健康度越低，病虫害发生率越高（反相关关系）
      let cornIncidence, cabbageIncidence;

      if (interval.name.includes('低')) {
        cornIncidence = 55; // 低健康区间，病虫害发生率高
        cabbageIncidence = 48;
      } else if (interval.name.includes('中')) {
        cornIncidence = 32; // 中等健康区间，病虫害发生率中等
        cabbageIncidence = 28;
      } else {
        cornIncidence = 15; // 高健康区间，病虫害发生率低
        cabbageIncidence = 12;
      }

      cornData.push(cornIncidence);
      cabbageData.push(cabbageIncidence);
    });

    intervalChart.setOption({
      title: {
        text: '健康评分区间与平均病虫害发生率关系',
        left: 'center',
        textStyle: { fontSize: 16, color: '#2E7D32' }
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        formatter: function (params) {
          let result = params[0].name + '<br/>';
          params.forEach(param => {
            result += `${param.seriesName}: <span style="color:${param.color};font-weight:bold">${param.value}%</span><br/>`;
          });
          return result;
        }
      },
      legend: {
        data: ['玉米', '白菜'],
        top: 30,
        left: 'center'
      },
      xAxis: {
        type: 'category',
        data: intervals.map(i => i.name),
        axisLabel: { color: '#666' }
      },
      yAxis: {
        type: 'value',
        name: '平均病虫害发生率 (%)',
        nameTextStyle: { color: '#F44336' },
        axisLabel: { color: '#F44336' },
        min: 0,
        max: 100
      },
      series: [
        {
          name: '玉米',
          type: 'bar',
          data: cornData,
          itemStyle: {
            color: function (params) {
              const value = params.value;
              if (value >= 50) return '#F44336';
              if (value >= 30) return '#FF9800';
              return '#8BC34A';
            }
          },
          label: {
            show: true,
            position: 'top',
            formatter: '{c}%',
            color: '#F44336',
            fontSize: 12,
            fontWeight: 'bold'
          }
        },
        {
          name: '白菜',
          type: 'bar',
          data: cabbageData,
          itemStyle: {
            color: function (params) {
              const value = params.value;
              if (value >= 50) return '#F44336';
              if (value >= 30) return '#FF9800';
              return '#8BC34A';
            }
          },
          label: {
            show: true,
            position: 'top',
            formatter: '{c}%',
            color: '#F44336',
            fontSize: 12,
            fontWeight: 'bold'
          }
        }
      ]
    });

    // 关闭弹窗
    document.getElementById('close-modal').addEventListener('click', () => {
      document.body.removeChild(modal);
    });

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        document.body.removeChild(modal);
      }
    });
  }

  // 初始化图表
  updateChart();
  createTimeControls();
}

// 辅助函数：计算病虫害抗性
function calculatePestResistance(fields, fieldPests) {
  if (fields.length === 0) return 75; // 默认抗性值

  let totalResistance = 0;
  fields.forEach(field => {
    const fieldPestData = fieldPests[field.id] || [];
    const resolvedPests = fieldPestData.filter(p => p.status === '已解决').length;
    const totalPests = fieldPestData.length;

    if (totalPests === 0) {
      totalResistance += 85; // 无病虫害，抗性较高
    } else {
      const resistanceRate = (resolvedPests / totalPests) * 100;
      // 根据病虫害严重程度调整抗性
      const avgSeverity = fieldPestData.reduce((sum, p) => sum + (p.severity || 50), 0) / totalPests;
      const adjustedResistance = resistanceRate - (avgSeverity - 50) * 0.3;
      totalResistance += Math.max(30, Math.min(95, adjustedResistance));
    }
  });

  return Math.round(totalResistance / fields.length);
}

// 辅助函数：计算生长周期稳定性
function calculateGrowthStability(fields) {
  if (fields.length === 0) return 75; // 默认稳定性值

  let totalStability = 0;
  fields.forEach(field => {
    const weather = field.weatherData;
    // 基于温度、湿度、降雨的稳定性计算
    const tempStability = weather.temperature >= 15 && weather.temperature <= 30 ? 100 :
      weather.temperature >= 10 && weather.temperature <= 35 ? 80 : 60;
    const humidityStability = weather.humidity >= 50 && weather.humidity <= 80 ? 100 :
      weather.humidity >= 40 && weather.humidity <= 90 ? 80 : 60;
    const rainfallStability = weather.rainfall >= 5 && weather.rainfall <= 15 ? 100 :
      weather.rainfall >= 2 && weather.rainfall <= 25 ? 80 : 60;

    const fieldStability = (tempStability + humidityStability + rainfallStability) / 3;
    totalStability += fieldStability;
  });

  return Math.round(totalStability / fields.length);
}

// 辅助函数：计算设备监测覆盖率
function calculateDeviceCoverage(fields, fieldDevices) {
  if (fields.length === 0) return 60; // 默认覆盖率

  let totalCoverage = 0;
  fields.forEach(field => {
    const deviceCount = fieldDevices[field.id]?.length || 0;
    // 根据田块面积调整设备需求
    const area = field.area || 10; // 默认10亩
    const requiredDevices = Math.ceil(area / 5); // 每5亩需要1台设备
    const coverage = Math.min(100, (deviceCount / requiredDevices) * 100);
    totalCoverage += coverage;
  });

  return Math.round(totalCoverage / fields.length);
}

// 辅助函数：计算产量预期达成率
function calculateYieldRate(fields) {
  if (fields.length === 0) return 80; // 默认达成率

  let totalRate = 0;
  fields.forEach(field => {
    // 基于健康度、环境条件、病虫害情况综合评估
    const healthRate = field.health;
    const weatherBonus = field.weatherData.temperature >= 20 && field.weatherData.temperature <= 28 ? 10 : 0;
    const pestPenalty = field.pestCount > 0 ? field.pestCount * 5 : 0;

    const yieldRate = Math.min(100, Math.max(50, healthRate + weatherBonus - pestPenalty + Math.random() * 10 - 5));
    totalRate += yieldRate;
  });

  return Math.round(totalRate / fields.length);
}









