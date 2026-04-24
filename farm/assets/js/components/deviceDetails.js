import { showToast } from '../utils/toast.js';
// 生成默认读数
function generateDefaultReadings() {
  return {
    temperature: 25.0,
    humidity: 60,
    soilMoisture: 70,
    ph: 6.5,
    conductivity: 1.2
  };
}

// 生成真实读数
function generateRealisticReadings() {
  return {
    temperature: (Math.random() * 10 + 20).toFixed(1),
    humidity: Math.floor(Math.random() * 30 + 50),
    soilMoisture: Math.floor(Math.random() * 20 + 60),
    ph: (Math.random() * 1 + 6).toFixed(1),
    conductivity: (Math.random() * 0.5 + 1).toFixed(1)
  };
}

// 数据标签映射
function getDataLabel(key) {
  const labels = {
    temperature: '温度',
    humidity: '湿度',
    soilMoisture: '土壤湿度',
    windSpeed: '风速',
    rainfall: '降雨量',
    sunshine: '日照',
    nitrogen: '氮含量',
    phosphorus: '磷含量',
    potassium: '钾含量',
    imageCapture: '图像采集',
    nightVision: '夜视功能',
    resolution: '分辨率',
    status: '状态',
    lastCommand: '最后指令',
    batteryLevel: '电池电量',
    valveStatus: '阀门状态',
    lastIrrigation: '最后灌溉',
    sprinklerStatus: '喷灌状态',
    waterPressure: '水压',
    pestDensity: '害虫密度',
    detectedPests: '检测到的害虫',
    ph: 'pH值',
    conductivity: '电导率',
    storageUsed: '存储使用率',
    lastMotion: '最后移动检测',
    windDirection: '风向',
    windGust: '阵风速度',
    windLevel: '风力等级',
    pressure: '气压',
    uvIndex: '紫外线指数',
    organicMatter: '有机质',
    soilTemp: '土壤温度',
    moisture: '湿度',
    flowRate: '流量',
    totalWaterUsed: '总用水量',
    nextSchedule: '下次计划',
    dewPoint: '露点',
    heatIndex: '体感温度',
    comfortLevel: '舒适度',
    pestCount: '害虫数量',
    pestLevel: '风险等级',
    detectionAccuracy: '检测精度',
    lastDetection: '最后检测',
    trapStatus: '诱捕器状态',
    lightIntensity: '光照强度',
    co2Level: '二氧化碳浓度',
    waterLevel: '水位',
    lastWatering: '最后浇水',
    sprayVolume: '喷雾量',
    chemicalLevel: '药剂余量',
    lastSpray: '最后喷雾',
    coverage: '覆盖面积',
    soilTemperature: '土壤温度',
    nutrients: '养分状况',
    lightIntensity: '光照强度',
    trapCount: '诱杀数量',
    batteryLevel: '电池电量',
    lastTrap: '最后诱杀',
    workingHours: '工作时长',
    trapStatus: '诱捕器状态',
    lureLevel: '诱饵余量',
    targetPest: '目标害虫'
  };
  return labels[key] || key;
}

// 数据值格式化
function formatDataValue(key, value) {
  if (Array.isArray(value)) {
    return value.join(', ');
  }
  if (typeof value === 'object') {
    return JSON.stringify(value);
  }
  if (key.includes('temperature') || key.includes('humidity') || key.includes('moisture')) {
    return value + (key.includes('temperature') ? '°C' : '%');
  }
  if (key.includes('speed') || key.includes('pressure')) {
    return value + (key.includes('speed') ? 'm/s' : 'bar');
  }
  if (key.includes('level') || key.includes('content')) {
    return value + '%';
  }
  if (key.includes('ph')) {
    return value;
  }
  if (key.includes('conductivity')) {
    return value + ' mS/cm';
  }
  if (key.includes('storageUsed')) {
    return value;
  }
  if (key.includes('windDirection')) {
    return value;
  }
  if (key.includes('uvIndex')) {
    return value;
  }
  if (key.includes('flowRate')) {
    return value + ' L/min';
  }
  if (key.includes('totalWaterUsed')) {
    return value + ' L';
  }
  if (key.includes('lightIntensity')) {
    return value + ' lux';
  }
  if (key.includes('co2Level')) {
    return value + ' ppm';
  }
  return value;
}

// 设备数据查看
export function showDeviceData(deviceId, devices) {
  const device = devices.find(d => d.id === deviceId);
  if (!device) return;

  const modal = document.createElement('div');
  modal.style.cssText = `
    position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
    background: rgba(0,0,0,0.5); z-index: 1000; display: flex; 
    align-items: center; justify-content: center;
  `;

  modal.innerHTML = `
    <div style="background: white; border-radius: 12px; padding: 24px; width: 600px; max-width: 90vw; box-shadow: 0 10px 30px rgba(0,0,0,0.3);">
      <h3 style="margin: 0 0 20px 0; color: var(--color-primary-900); font-size: 24px;">${device.name} - 数据查看</h3>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 20px; font-size: 18px;">
        <div>
          <strong>设备ID:</strong> ${device.id}
        </div>
        <div>
          <strong>设备类型:</strong> ${device.category}
        </div>
        <div>
          <strong>安装位置:</strong> ${device.location}
        </div>
      </div>
      <div style="margin-bottom: 20px;">
        <h4 style="margin: 0 0 12px 0; color: var(--color-primary-700); font-size: 20px;">实时数据</h4>
        <div style="background: #f8f9fa; border-radius: 8px; padding: 16px; font-size: 18px;">
          ${Object.entries(device.dataReadings).map(([key, value]) => `
            <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e9ecef;">
              <span style="font-weight: 500;">${getDataLabel(key)}:</span>
              <span style="color: var(--color-primary-600);">${formatDataValue(key, value)}</span>
            </div>
          `).join('')}
        </div>
      </div>
      <div style="display: flex; gap: 12px; justify-content: flex-end;">
        <button type="button" id="close-data-btn" class="btn btn-outline" style="font-size: 16px; padding: 10px 16px;">关闭</button>
        <button type="button" id="refresh-data-btn" class="btn btn-primary" style="font-size: 16px; padding: 10px 16px;">刷新数据</button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  // 关闭按钮
  modal.querySelector('#close-data-btn').addEventListener('click', () => {
    document.body.removeChild(modal);
  });

  // 刷新数据按钮
  modal.querySelector('#refresh-data-btn').addEventListener('click', () => {
    // 生成合理的传感器数据
    device.dataReadings = generateRealisticReadings(device);
    showToast('数据已刷新', 'success');
    document.body.removeChild(modal);
    showDeviceData(deviceId, devices); // 重新打开模态框显示新数据
  });

  // 点击背景关闭
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      document.body.removeChild(modal);
    }
  });
}

// 设备设置
export function showDeviceSettings(deviceId, devices, renderGrid) {
  const device = devices.find(d => d.id === deviceId);
  if (!device) return;

  const modal = document.createElement('div');
  modal.style.cssText = `
    position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
    background: rgba(0,0,0,0.5); z-index: 1000; display: flex; 
    align-items: center; justify-content: center;
  `;

  // 获取设备设置，如果没有则使用默认值
  const deviceSettings = device.settings || {
    name: device.name,
    location: device.location,
    frequency: 5,
    thresholdMin: 0,
    thresholdMax: 100,
    alerts: true
  };

  modal.innerHTML = `
    <div style="background: white; border-radius: 12px; padding: 24px; width: 500px; max-width: 90vw; box-shadow: 0 10px 30px rgba(0,0,0,0.3);">
      <h3 style="margin: 0 0 20px 0; color: var(--color-primary-900);">${device.name} - 设备设置</h3>
      <form id="device-settings-form">
        <div style="margin-bottom: 16px;">
          <label style="display: block; margin-bottom: 8px; font-weight: 500;">设备名称</label>
          <input type="text" id="settings-name" value="${deviceSettings.name}" 
                 style="width: 100%; padding: 12px; border: 1px solid var(--color-border); border-radius: 8px; font-size: 14px;">
        </div>
        <div style="margin-bottom: 16px;">
          <label style="display: block; margin-bottom: 8px; font-weight: 500;">安装位置</label>
          <input type="text" id="settings-location" value="${deviceSettings.location}" 
                 style="width: 100%; padding: 12px; border: 1px solid var(--color-border); border-radius: 8px; font-size: 14px;">
        </div>
        <div style="margin-bottom: 16px;">
          <label style="display: block; margin-bottom: 8px; font-weight: 500;">数据采集频率</label>
          <select id="settings-frequency" 
                  style="width: 100%; padding: 12px; border: 1px solid var(--color-border); border-radius: 8px; font-size: 14px;">
            <option value="1" ${deviceSettings.frequency === 1 ? 'selected' : ''}>每分钟</option>
            <option value="5" ${deviceSettings.frequency === 5 ? 'selected' : ''}>每5分钟</option>
            <option value="10" ${deviceSettings.frequency === 10 ? 'selected' : ''}>每10分钟</option>
            <option value="15" ${deviceSettings.frequency === 15 ? 'selected' : ''}>每15分钟</option>
            <option value="30" ${deviceSettings.frequency === 30 ? 'selected' : ''}>每30分钟</option>
            <option value="60" ${deviceSettings.frequency === 60 ? 'selected' : ''}>每小时</option>
          </select>
        </div>
        <div style="margin-bottom: 16px;">
          <label style="display: block; margin-bottom: 8px; font-weight: 500;">报警阈值设置</label>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
            <input type="number" id="settings-threshold-min" placeholder="最小值" value="${deviceSettings.thresholdMin || ''}"
                   style="padding: 8px; border: 1px solid var(--color-border); border-radius: 6px; font-size: 14px;">
            <input type="number" id="settings-threshold-max" placeholder="最大值" value="${deviceSettings.thresholdMax || ''}"
                   style="padding: 8px; border: 1px solid var(--color-border); border-radius: 6px; font-size: 14px;">
          </div>
        </div>
        <div style="margin-bottom: 16px;">
          <label style="display: flex; align-items: center; gap: 8px; font-weight: 500;">
            <input type="checkbox" id="settings-alerts" ${deviceSettings.alerts ? 'checked' : ''}>
            启用报警通知
          </label>
        </div>
        <div style="display: flex; gap: 12px; justify-content: flex-end;">
          <button type="button" id="cancel-settings-btn" class="btn btn-outline">取消</button>
          <button type="submit" class="btn btn-primary">保存设置</button>
        </div>
      </form>
    </div>
  `;

  document.body.appendChild(modal);

  // 取消按钮
  modal.querySelector('#cancel-settings-btn').addEventListener('click', () => {
    document.body.removeChild(modal);
  });

  // 点击背景关闭
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      document.body.removeChild(modal);
    }
  });

  // 表单提交
  modal.querySelector('#device-settings-form').addEventListener('submit', (e) => {
    e.preventDefault();

    // 更新设备设置
    device.name = modal.querySelector('#settings-name').value;
    device.location = modal.querySelector('#settings-location').value;

    // 更新设备设置对象
    if (!device.settings) {
      device.settings = {};
    }
    device.settings.name = modal.querySelector('#settings-name').value;
    device.settings.location = modal.querySelector('#settings-location').value;
    device.settings.frequency = parseInt(modal.querySelector('#settings-frequency').value);
    device.settings.thresholdMin = parseFloat(modal.querySelector('#settings-threshold-min').value) || 0;
    device.settings.thresholdMax = parseFloat(modal.querySelector('#settings-threshold-max').value) || 100;
    device.settings.alerts = modal.querySelector('#settings-alerts').checked;

    showToast('设备设置已保存', 'success');
    document.body.removeChild(modal);
    if (renderGrid) {
      renderGrid(); // 重新渲染以显示更新
    }
  });
}

// 维护记录
export function showMaintenanceRecords(deviceId, devices) {
  const device = devices.find(d => d.id === deviceId);
  if (!device) return;

  // 使用设备的维护记录数据
  const maintenanceRecords = device.maintenanceRecords || [];

  const modal = document.createElement('div');
  modal.style.cssText = `
    position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
    background: rgba(0,0,0,0.5); z-index: 1000; display: flex; 
    align-items: center; justify-content: center;
  `;

  modal.innerHTML = `
    <div style="background: white; border-radius: 12px; padding: 24px; width: 700px; max-width: 90vw; box-shadow: 0 10px 30px rgba(0,0,0,0.3);">
      <h3 style="margin: 0 0 20px 0; color: var(--color-primary-900);">${device.name} - 维护记录</h3>
      ${maintenanceRecords.length > 0 ? `
        <div style="margin-bottom: 16px; max-height: 400px; overflow-y: auto;">
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="background: #f8f9fa;">
                <th style="padding: 12px; text-align: left; border-bottom: 1px solid #dee2e6;">维护类型</th>
                <th style="padding: 12px; text-align: left; border-bottom: 1px solid #dee2e6;">日期</th>
                <th style="padding: 12px; text-align: left; border-bottom: 1px solid #dee2e6;">技术员</th>
                <th style="padding: 12px; text-align: left; border-bottom: 1px solid #dee2e6;">状态</th>
                <th style="padding: 12px; text-align: left; border-bottom: 1px solid #dee2e6;">维护详情</th>
                <th style="padding: 12px; text-align: left; border-bottom: 1px solid #dee2e6;">下次维护</th>
              </tr>
            </thead>
            <tbody>
              ${maintenanceRecords.map(record => `
                <tr>
                  <td style="padding: 12px; border-bottom: 1px solid #f0f0f0;">${record.type}</td>
                  <td style="padding: 12px; border-bottom: 1px solid #f0f0f0;">${record.date}</td>
                  <td style="padding: 12px; border-bottom: 1px solid #f0f0f0;">${record.technician}</td>
                  <td style="padding: 12px; border-bottom: 1px solid #f0f0f0;">
                    <span class="tag ${record.status === '已完成' ? 'success' : record.status === '进行中' ? 'warning' : record.status === '待处理' ? 'info' : 'danger'}">${record.status}</span>
                  </td>
                  <td style="padding: 12px; border-bottom: 1px solid #f0f0f0; font-size: 12px; color: var(--color-text-muted); max-width: 200px; word-wrap: break-word;">${record.note}</td>
                  <td style="padding: 12px; border-bottom: 1px solid #f0f0f0; font-size: 12px; color: var(--color-text-muted); max-width: 150px; word-wrap: break-word;">${record.nextMaintenance || '-'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      ` : `
        <div style="text-align: center; padding: 40px; color: var(--color-text-muted);">
          <div style="font-size: 48px; margin-bottom: 16px;">🔧</div>
          <div style="font-size: 16px; margin-bottom: 8px;">暂无维护记录</div>
          <div style="font-size: 14px;">该设备还没有维护记录</div>
        </div>
      `}
      <div style="display: flex; gap: 12px; justify-content: flex-end;">
        <button type="button" id="close-records-btn" class="btn btn-outline">关闭</button>
        <button type="button" id="add-record-btn" class="btn btn-primary">添加记录</button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  // 关闭按钮
  modal.querySelector('#close-records-btn').addEventListener('click', () => {
    document.body.removeChild(modal);
  });

  // 添加记录按钮
  modal.querySelector('#add-record-btn').addEventListener('click', () => {
    showAddMaintenanceRecordModal(device, devices);
  });

  // 点击背景关闭
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      document.body.removeChild(modal);
    }
  });
}

// 添加维护记录模态框
function showAddMaintenanceRecordModal(device, devices) {
  const modal = document.createElement('div');
  modal.style.cssText = `
    position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
    background: rgba(0,0,0,0.5); z-index: 1000; display: flex; 
    align-items: center; justify-content: center;
  `;

  modal.innerHTML = `
    <div style="background: white; border-radius: 12px; padding: 24px; width: 500px; max-width: 90vw; box-shadow: 0 10px 30px rgba(0,0,0,0.3);">
      <h3 style="margin: 0 0 20px 0; color: var(--color-primary-900);">添加维护记录 - ${device.name}</h3>
      <form id="add-maintenance-form">
        <div style="margin-bottom: 16px;">
          <label style="display: block; margin-bottom: 8px; font-weight: 500;">维护类型</label>
          <select id="maintenance-type" required 
                  style="width: 100%; padding: 12px; border: 1px solid var(--color-border); border-radius: 8px; font-size: 14px;">
            <option value="">请选择维护类型</option>
            <option value="定期检查">定期检查</option>
            <option value="清洁保养">清洁保养</option>
            <option value="校准调试">校准调试</option>
            <option value="电池更换">电池更换</option>
            <option value="固件更新">固件更新</option>
            <option value="故障维修">故障维修</option>
            <option value="预防性维护">预防性维护</option>
            <option value="性能优化">性能优化</option>
          </select>
        </div>
        <div style="margin-bottom: 16px;">
          <label style="display: block; margin-bottom: 8px; font-weight: 500;">维护日期</label>
          <input type="date" id="maintenance-date" required 
                 style="width: 100%; padding: 12px; border: 1px solid var(--color-border); border-radius: 8px; font-size: 14px;">
        </div>
        <div style="margin-bottom: 16px;">
          <label style="display: block; margin-bottom: 8px; font-weight: 500;">技术员</label>
          <select id="maintenance-technician" required 
                  style="width: 100%; padding: 12px; border: 1px solid var(--color-border); border-radius: 8px; font-size: 14px;">
            <option value="">请选择技术员</option>
            <option value="张师傅">张师傅</option>
            <option value="李师傅">李师傅</option>
            <option value="王师傅">王师傅</option>
            <option value="赵师傅">赵师傅</option>
            <option value="孙师傅">孙师傅</option>
            <option value="周师傅">周师傅</option>
            <option value="吴师傅">吴师傅</option>
            <option value="郑师傅">郑师傅</option>
            <option value="钱师傅">钱师傅</option>
          </select>
        </div>
        <div style="margin-bottom: 16px;">
          <label style="display: block; margin-bottom: 8px; font-weight: 500;">维护状态</label>
          <select id="maintenance-status" required 
                  style="width: 100%; padding: 12px; border: 1px solid var(--color-border); border-radius: 8px; font-size: 14px;">
            <option value="已完成">已完成</option>
            <option value="进行中">进行中</option>
            <option value="待处理">待处理</option>
            <option value="已取消">已取消</option>
          </select>
        </div>
        <div style="margin-bottom: 16px;">
          <label style="display: block; margin-bottom: 8px; font-weight: 500;">维护详情</label>
          <textarea id="maintenance-note" placeholder="请详细描述维护内容、发现的问题、采取的措施等" rows="4" required
                    style="width: 100%; padding: 12px; border: 1px solid var(--color-border); border-radius: 8px; font-size: 14px; resize: vertical;"></textarea>
        </div>
        <div style="margin-bottom: 16px;">
          <label style="display: block; margin-bottom: 8px; font-weight: 500;">下次维护建议</label>
          <textarea id="next-maintenance" placeholder="建议下次维护的时间、内容等（可选）" rows="2"
                    style="width: 100%; padding: 12px; border: 1px solid var(--color-border); border-radius: 8px; font-size: 14px; resize: vertical;"></textarea>
        </div>
        <div style="display: flex; gap: 12px; justify-content: flex-end;">
          <button type="button" id="cancel-maintenance-btn" class="btn btn-outline">取消</button>
          <button type="submit" class="btn btn-primary">添加记录</button>
        </div>
      </form>
    </div>
  `;

  // 设置默认日期为今天
  const today = new Date().toISOString().split('T')[0];
  modal.querySelector('#maintenance-date').value = today;

  document.body.appendChild(modal);

  // 取消按钮
  modal.querySelector('#cancel-maintenance-btn').addEventListener('click', () => {
    document.body.removeChild(modal);
  });

  // 点击背景关闭
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      document.body.removeChild(modal);
    }
  });

  // 表单提交
  modal.querySelector('#add-maintenance-form').addEventListener('submit', (e) => {
    e.preventDefault();

    const maintenanceType = modal.querySelector('#maintenance-type').value;
    const maintenanceDate = modal.querySelector('#maintenance-date').value;
    const technician = modal.querySelector('#maintenance-technician').value;
    const status = modal.querySelector('#maintenance-status').value;
    const note = modal.querySelector('#maintenance-note').value;
    const nextMaintenance = modal.querySelector('#next-maintenance').value;

    // 创建新的维护记录
    const newRecord = {
      id: `MAINT-${Date.now()}-${device.id}`,
      type: maintenanceType,
      date: maintenanceDate,
      technician: technician,
      status: status,
      note: note,
      nextMaintenance: nextMaintenance || null,
      createdAt: new Date().toISOString()
    };

    // 添加到设备的维护记录中
    if (!device.maintenanceRecords) {
      device.maintenanceRecords = [];
    }

    // 按日期降序插入（最新的在前面）
    device.maintenanceRecords.unshift(newRecord);

    // 根据维护类型更新设备状态
    updateDeviceStatusAfterMaintenance(device, maintenanceType, status);

    showToast('维护记录添加成功！', 'success');
    document.body.removeChild(modal);

    // 重新打开维护记录模态框显示更新后的数据
    showMaintenanceRecords(device.id, devices);
  });
}

// 根据维护类型更新设备状态
function updateDeviceStatusAfterMaintenance(device, maintenanceType, status) {
  // 如果维护状态是"已完成"，根据维护类型更新设备状态
  if (status === '已完成') {
    switch (maintenanceType) {
      case '故障维修':
        // 故障维修完成后，设备状态应该恢复正常
        if (device.status === 'maintenance' || device.status === 'alert') {
          device.status = 'online';
        }
        break;
      case '电池更换':
        // 电池更换后，更新电池相关数据
        if (device.dataReadings.batteryLevel !== undefined) {
          device.dataReadings.batteryLevel = 100;
        }
        break;
      case '固件更新':
        // 固件更新后，设备可能需要重启
        break;
      case '校准调试':
        // 校准调试后，数据应该更准确
        break;
      case '清洁保养':
        // 清洁保养后，设备状态良好
        break;
    }
  } else if (status === '进行中') {
    // 如果维护正在进行中，设备状态设为维护中
    device.status = 'maintenance';
  }

}
