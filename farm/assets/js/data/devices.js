// 设备分类
export const deviceCategories = ['全部', '病虫害监测', '气象监测', '防治设备'];

// 获取设备图标
export function getDeviceIcon(category) {
  const icons = {
    '病虫害监测': '📹',
    '气象监测': '🌡️',
    '防治设备': '🚜'
  };
  return icons[category] || '📱';
}

// 生成默认读数
export function generateDefaultReadings() {
  return {
    temperature: 25.0,
    humidity: 60,
    soilMoisture: 70,
    ph: 6.5,
    conductivity: 1.2
  };
}

// 设备模拟数据
export function createMockDevices() {
  // 基于田块管理数据创建设备数据，使用真实的农业设备
  const devices = [
    // F-001玉米田设备（deviceCount: 2，设备正常）
    {
      id: 'DEV-001',
      name: '田间监测摄像头',
      category: '病虫害监测',
      location: 'F-001 玉米田',
      fieldId: 'F-001',
      status: 'online',
      description: '高清田间监测摄像头，支持AI病虫害识别和实时监控',
      dataReadings: {
        pestCount: 1, // 检测到1种病虫害
        pestLevel: '中',
        detectionAccuracy: 95,
        lastDetection: '2025-01-15 08:45'
      },
      settings: {
        name: '田间监测摄像头',
        location: 'F-001 玉米田',
        frequency: 5,
        thresholdMin: 0,
        thresholdMax: 10,
        alerts: true
      },
      maintenanceRecords: [
        {
          id: 'MAINT-001-001',
          type: '定期检查',
          date: '2024-10-20',
          technician: '张师傅',
          status: '已完成',
          note: '摄像头运行正常，识别准确'
        }
      ]
    },
    {
      id: 'DEV-002',
      name: '气象监测站',
      category: '气象监测',
      location: 'F-001 玉米田',
      fieldId: 'F-001',
      status: 'online',
      description: '多参数气象监测站，监测温度、湿度、降雨量、日照等环境参数',
      dataReadings: {
        temperature: 28.5, // 高温
        humidity: 85, // 高湿度
        rainfall: 15.2, // 过量降雨
        sunshine: 4.2, // 日照不足
        pressure: 1013.2, // 气压
        uvIndex: 6.8 // 紫外线指数
      },
      settings: {
        name: '气象监测站',
        location: 'F-001 玉米田',
        frequency: 3,
        thresholdMin: 15,
        thresholdMax: 30,
        alerts: true
      },
      maintenanceRecords: [
        {
          id: 'MAINT-002-001',
          type: '定期检查',
          date: '2024-10-15',
          technician: '李师傅',
          status: '已完成',
          note: '设备运行正常，数据准确'
        }
      ]
    },
    {
      id: 'DEV-002B',
      name: '杀虫灯',
      category: '防治设备',
      location: 'F-001 玉米田',
      fieldId: 'F-001',
      status: 'online',
      description: '智能杀虫灯，利用特定波长光源诱杀害虫，环保无污染',
      dataReadings: {
        lightIntensity: 85, // 光照强度
        trapCount: 12, // 诱杀数量
        batteryLevel: 78, // 电池电量
        lastTrap: '2025-01-15 20:30', // 最后诱杀时间
        workingHours: 8.5 // 工作时长
      },
      settings: {
        name: '杀虫灯',
        location: 'F-001 玉米田',
        frequency: 1,
        thresholdMin: 0,
        thresholdMax: 100,
        alerts: true
      },
      maintenanceRecords: [
        {
          id: 'MAINT-002B-001',
          type: '定期检查',
          date: '2024-10-15',
          technician: '李师傅',
          status: '已完成',
          note: '杀虫灯运行正常，诱杀效果良好'
        }
      ]
    },

    // F-002大豆田设备（deviceCount: 4，设备正常）
    {
      id: 'DEV-003',
      name: '田间监测摄像头',
      category: '病虫害监测',
      location: 'F-002 大豆田',
      fieldId: 'F-002',
      status: 'online',
      description: '高清田间监测摄像头，支持AI病虫害识别和实时监控',
      dataReadings: {
        pestCount: 0, // 未检测到病虫害
        pestLevel: '无',
        detectionAccuracy: 98,
        lastDetection: '2025-01-14 16:30'
      },
      settings: {
        name: '田间监测摄像头',
        location: 'F-002 大豆田',
        frequency: 5,
        thresholdMin: 0,
        thresholdMax: 10,
        alerts: true
      },
      maintenanceRecords: [
        {
          id: 'MAINT-003-001',
          type: '定期检查',
          date: '2024-10-15',
          technician: '王师傅',
          status: '已完成',
          note: '摄像头运行正常，识别准确'
        }
      ]
    },
    {
      id: 'DEV-004',
      name: '气象监测站',
      category: '气象监测',
      location: 'F-002 大豆田',
      fieldId: 'F-002',
      status: 'online',
      description: '多参数气象监测站，监测温度、湿度、降雨量、日照等环境参数',
      dataReadings: {
        temperature: 22.8,
        humidity: 63,
        rainfall: 7.5,
        sunshine: 7.2,
        pressure: 1015.6,
        uvIndex: 8.2
      },
      settings: {
        name: '气象监测站',
        location: 'F-002 大豆田',
        frequency: 3,
        thresholdMin: 15,
        thresholdMax: 30,
        alerts: true
      },
      maintenanceRecords: []
    },
    {
      id: 'DEV-005',
      name: '植保无人机',
      category: '防治设备',
      location: 'F-002 大豆田',
      fieldId: 'F-002',
      status: 'online',
      description: '智能植保无人机，支持精准施药和自动作业',
      dataReadings: {
        sprayVolume: 0, // 当前未喷雾
        chemicalLevel: 85, // 药剂余量85%
        lastSpray: '2025-01-10 14:20',
        coverage: 100 // 覆盖面积100%
      },
      settings: {
        name: '植保无人机',
        location: 'F-002 大豆田',
        frequency: 1,
        thresholdMin: 0,
        thresholdMax: 100,
        alerts: true
      },
      maintenanceRecords: []
    },
    {
      id: 'DEV-006A',
      name: '诱捕器',
      category: '防治设备',
      location: 'F-002 大豆田',
      fieldId: 'F-002',
      status: 'online',
      description: '智能诱捕器，利用性信息素诱捕特定害虫，精准防治',
      dataReadings: {
        trapStatus: '正常', // 诱捕器状态
        pestCount: 8, // 诱捕数量
        lureLevel: 65, // 诱饵余量
        lastTrap: '2025-01-15 18:45', // 最后诱捕时间
        targetPest: '大豆蚜虫' // 目标害虫
      },
      settings: {
        name: '诱捕器',
        location: 'F-002 大豆田',
        frequency: 1,
        thresholdMin: 0,
        thresholdMax: 100,
        alerts: true
      },
      maintenanceRecords: [
        {
          id: 'MAINT-006A-001',
          type: '定期检查',
          date: '2024-10-15',
          technician: '王师傅',
          status: '已完成',
          note: '诱捕器运行正常，诱捕效果良好'
        }
      ]
    },

    // F-003棉花田设备（deviceCount: 2，设备正常）
    {
      id: 'DEV-007',
      name: '田间监测摄像头',
      category: '病虫害监测',
      location: 'F-003 棉花田',
      fieldId: 'F-003',
      status: 'online',
      description: '高清田间监测摄像头，支持AI病虫害识别和实时监控',
      dataReadings: {
        pestCount: 2, // 检测到2种病虫害
        pestLevel: '高',
        detectionAccuracy: 96,
        lastDetection: '2025-01-15 10:30'
      },
      settings: {
        name: '田间监测摄像头',
        location: 'F-003 棉花田',
        frequency: 5,
        thresholdMin: 0,
        thresholdMax: 10,
        alerts: true
      },
      maintenanceRecords: [
        {
          id: 'MAINT-007-001',
          type: '定期检查',
          date: '2024-10-21',
          technician: '赵师傅',
          status: '已完成',
          note: '摄像头运行正常，识别准确'
        }
      ]
    },
    {
      id: 'DEV-007A',
      name: '杀虫灯',
      category: '防治设备',
      location: 'F-003 棉花田',
      fieldId: 'F-003',
      status: 'online',
      description: '智能杀虫灯，利用特定波长光源诱杀害虫，环保无污染',
      dataReadings: {
        lightIntensity: 92, // 光照强度
        trapCount: 18, // 诱杀数量
        batteryLevel: 82, // 电池电量
        lastTrap: '2025-01-15 21:15', // 最后诱杀时间
        workingHours: 9.2 // 工作时长
      },
      settings: {
        name: '杀虫灯',
        location: 'F-003 棉花田',
        frequency: 1,
        thresholdMin: 0,
        thresholdMax: 100,
        alerts: true
      },
      maintenanceRecords: [
        {
          id: 'MAINT-007A-001',
          type: '定期检查',
          date: '2024-10-21',
          technician: '赵师傅',
          status: '已完成',
          note: '杀虫灯运行正常，诱杀效果良好'
        }
      ]
    },

    // F-004大豆田设备（deviceCount: 2，设备正常）
    {
      id: 'DEV-008',
      name: '田间监测摄像头',
      category: '病虫害监测',
      location: 'F-004 大豆田',
      fieldId: 'F-004',
      status: 'online',
      description: '高清田间监测摄像头，支持AI病虫害识别和实时监控',
      dataReadings: {
        pestCount: 0, // 未检测到病虫害
        pestLevel: '无',
        detectionAccuracy: 97,
        lastDetection: '2025-01-14 12:15'
      },
      settings: {
        name: '田间监测摄像头',
        location: 'F-004 大豆田',
        frequency: 5,
        thresholdMin: 0,
        thresholdMax: 10,
        alerts: true
      },
      maintenanceRecords: []
    },
    {
      id: 'DEV-009',
      name: '气象监测站',
      category: '气象监测',
      location: 'F-004 大豆田',
      fieldId: 'F-004',
      status: 'online',
      description: '多参数气象监测站，监测温度、湿度、降雨量、日照等环境参数',
      dataReadings: {
        temperature: 21.8,
        humidity: 69,
        rainfall: 8.8,
        sunshine: 6.2,
        pressure: 1012.8,
        uvIndex: 7.5
      },
      settings: {
        name: '气象监测站',
        location: 'F-004 大豆田',
        frequency: 3,
        thresholdMin: 15,
        thresholdMax: 30,
        alerts: true
      },
      maintenanceRecords: []
    },

    // F-005棉花田设备（deviceCount: 3，设备正常）
    {
      id: 'DEV-010',
      name: '田间监测摄像头',
      category: '病虫害监测',
      location: 'F-005 棉花田',
      fieldId: 'F-005',
      status: 'online',
      description: '高清田间监测摄像头，支持AI病虫害识别和实时监控',
      dataReadings: {
        pestCount: 0, // 未检测到病虫害
        pestLevel: '无',
        detectionAccuracy: 96,
        lastDetection: '2025-01-14 09:45'
      },
      settings: {
        name: '田间监测摄像头',
        location: 'F-005 棉花田',
        frequency: 5,
        thresholdMin: 0,
        thresholdMax: 10,
        alerts: true
      },
      maintenanceRecords: []
    },
    {
      id: 'DEV-011',
      name: '气象监测站',
      category: '气象监测',
      location: 'F-005 棉花田',
      fieldId: 'F-005',
      status: 'online',
      description: '多参数气象监测站，监测温度、湿度、降雨量、日照等环境参数',
      dataReadings: {
        temperature: 24.2,
        humidity: 68,
        rainfall: 6.8,
        sunshine: 7.5,
        pressure: 1014.3,
        uvIndex: 8.8
      },
      settings: {
        name: '气象监测站',
        location: 'F-005 棉花田',
        frequency: 3,
        thresholdMin: 15,
        thresholdMax: 30,
        alerts: true
      },
      maintenanceRecords: []
    },
    {
      id: 'DEV-012',
      name: '植保无人机',
      category: '防治设备',
      location: 'F-005 棉花田',
      fieldId: 'F-005',
      status: 'online',
      description: '智能植保无人机，支持精准施药和自动作业',
      dataReadings: {
        sprayVolume: 0, // 当前未喷雾
        chemicalLevel: 92, // 药剂余量92%
        lastSpray: '2025-01-08 16:30',
        coverage: 100 // 覆盖面积100%
      },
      settings: {
        name: '植保无人机',
        location: 'F-005 棉花田',
        frequency: 1,
        thresholdMin: 0,
        thresholdMax: 100,
        alerts: true
      },
      maintenanceRecords: []
    },

    // F-006玉米田设备（deviceCount: 4，设备正常）
    {
      id: 'DEV-013',
      name: '田间监测摄像头',
      category: '病虫害监测',
      location: 'F-006 玉米田',
      fieldId: 'F-006',
      status: 'online',
      description: '高清田间监测摄像头，支持AI病虫害识别和实时监控',
      dataReadings: {
        pestCount: 0, // 未检测到病虫害
        pestLevel: '无',
        detectionAccuracy: 98,
        lastDetection: '2025-01-14 11:20'
      },
      settings: {
        name: '田间监测摄像头',
        location: 'F-006 玉米田',
        frequency: 5,
        thresholdMin: 0,
        thresholdMax: 10,
        alerts: true
      },
      maintenanceRecords: []
    },
    {
      id: 'DEV-014',
      name: '气象监测站',
      category: '气象监测',
      location: 'F-006 玉米田',
      fieldId: 'F-006',
      status: 'online',
      description: '多参数气象监测站，监测温度、湿度、降雨量、日照等环境参数',
      dataReadings: {
        temperature: 25.1,
        humidity: 78,
        rainfall: 12.5,
        sunshine: 6.8,
        pressure: 1011.5,
        uvIndex: 7.2
      },
      settings: {
        name: '气象监测站',
        location: 'F-006 玉米田',
        frequency: 3,
        thresholdMin: 15,
        thresholdMax: 30,
        alerts: true
      },
      maintenanceRecords: []
    },
    {
      id: 'DEV-015',
      name: '植保无人机',
      category: '防治设备',
      location: 'F-006 玉米田',
      fieldId: 'F-006',
      status: 'online',
      description: '智能植保无人机，支持精准施药和自动作业',
      dataReadings: {
        sprayVolume: 0, // 当前未喷雾
        chemicalLevel: 78, // 药剂余量78%
        lastSpray: '2025-01-12 10:15',
        coverage: 100 // 覆盖面积100%
      },
      settings: {
        name: '植保无人机',
        location: 'F-006 玉米田',
        frequency: 1,
        thresholdMin: 0,
        thresholdMax: 100,
        alerts: true
      },
      maintenanceRecords: []
    },
    {
      id: 'DEV-016A',
      name: '诱捕器',
      category: '防治设备',
      location: 'F-006 玉米田',
      fieldId: 'F-006',
      status: 'online',
      description: '智能诱捕器，利用性信息素诱捕特定害虫，精准防治',
      dataReadings: {
        trapStatus: '正常', // 诱捕器状态
        pestCount: 15, // 诱捕数量
        lureLevel: 58, // 诱饵余量
        lastTrap: '2025-01-15 19:20', // 最后诱捕时间
        targetPest: '玉米螟' // 目标害虫
      },
      settings: {
        name: '诱捕器',
        location: 'F-006 玉米田',
        frequency: 1,
        thresholdMin: 0,
        thresholdMax: 100,
        alerts: true
      },
      maintenanceRecords: [
        {
          id: 'MAINT-016A-001',
          type: '定期检查',
          date: '2024-10-15',
          technician: '周师傅',
          status: '已完成',
          note: '诱捕器运行正常，诱捕效果良好'
        }
      ]
    },

    // F-007大豆田设备（deviceCount: 1，设备正常）
    {
      id: 'DEV-017',
      name: '田间监测摄像头',
      category: '病虫害监测',
      location: 'F-007 大豆田',
      fieldId: 'F-007',
      status: 'online',
      description: '高清田间监测摄像头，支持AI病虫害识别和实时监控',
      dataReadings: {
        pestCount: 1, // 检测到1种病虫害
        pestLevel: '低',
        detectionAccuracy: 97,
        lastDetection: '2025-01-15 13:10'
      },
      settings: {
        name: '田间监测摄像头',
        location: 'F-007 大豆田',
        frequency: 5,
        thresholdMin: 0,
        thresholdMax: 10,
        alerts: true
      },
      maintenanceRecords: [
        {
          id: 'MAINT-017-001',
          type: '定期检查',
          date: '2024-10-22',
          technician: '孙师傅',
          status: '已完成',
          note: '摄像头运行正常，识别准确'
        }
      ]
    },

    // F-008棉花田设备（deviceCount: 2，设备正常）
    {
      id: 'DEV-018',
      name: '田间监测摄像头',
      category: '病虫害监测',
      location: 'F-008 棉花田',
      fieldId: 'F-008',
      status: 'online',
      description: '高清田间监测摄像头，支持AI病虫害识别和实时监控',
      dataReadings: {
        pestCount: 1, // 检测到1种病虫害
        pestLevel: '中',
        detectionAccuracy: 94,
        lastDetection: '2025-01-14 15:45'
      },
      settings: {
        name: '田间监测摄像头',
        location: 'F-008 棉花田',
        frequency: 5,
        thresholdMin: 0,
        thresholdMax: 10,
        alerts: true
      },
      maintenanceRecords: []
    },
    {
      id: 'DEV-019',
      name: '植保无人机',
      category: '防治设备',
      location: 'F-008 棉花田',
      fieldId: 'F-008',
      status: 'online',
      description: '智能植保无人机，支持精准施药和自动作业',
      dataReadings: {
        sprayVolume: 0, // 当前未喷雾
        chemicalLevel: 65, // 药剂余量65%
        lastSpray: '2025-01-14 14:20',
        coverage: 100 // 覆盖面积100%
      },
      settings: {
        name: '植保无人机',
        location: 'F-008 棉花田',
        frequency: 1,
        thresholdMin: 0,
        thresholdMax: 100,
        alerts: true
      },
      maintenanceRecords: []
    },
    {
      id: 'DEV-019A',
      name: '杀虫灯',
      category: '防治设备',
      location: 'F-008 棉花田',
      fieldId: 'F-008',
      status: 'online',
      description: '智能杀虫灯，利用特定波长光源诱杀害虫，环保无污染',
      dataReadings: {
        lightIntensity: 88, // 光照强度
        trapCount: 22, // 诱杀数量
        batteryLevel: 75, // 电池电量
        lastTrap: '2025-01-15 21:45', // 最后诱杀时间
        workingHours: 8.8 // 工作时长
      },
      settings: {
        name: '杀虫灯',
        location: 'F-008 棉花田',
        frequency: 1,
        thresholdMin: 0,
        thresholdMax: 100,
        alerts: true
      },
      maintenanceRecords: [
        {
          id: 'MAINT-019A-001',
          type: '定期检查',
          date: '2024-10-15',
          technician: '李师傅',
          status: '已完成',
          note: '杀虫灯运行正常，诱杀效果良好'
        }
      ]
    }
  ];

  return devices;
}