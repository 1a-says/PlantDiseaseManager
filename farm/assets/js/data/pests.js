// 病虫害数据管理
export const pestCategories = ['病害', '虫害', '草害', '其他'];

export const pestLevels = ['低', '中', '高', '严重'];

export const pestStatuses = ['待处理', '处理中', '已解决', '复发'];

// 生成病虫害ID
export function generatePestId() {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `P-${timestamp}-${random}`;
}

export const fieldOptions = [
  { id: 'F-001', name: '玉米田' },
  { id: 'F-002', name: '大豆田' },
  { id: 'F-003', name: '棉花田' },
  { id: 'F-004', name: '大豆田' },
  { id: 'F-005', name: '棉花田' },
  { id: 'F-006', name: '玉米田' },
  { id: 'F-007', name: '大豆田' },
  { id: 'F-008', name: '棉花田' }
];

// 从localStorage加载收录的病虫害记录
function loadCollectedPests() {
  try {
    const collectedRecords = JSON.parse(localStorage.getItem('pestRecords') || '[]');
    return collectedRecords;
  } catch (error) {
    console.error('加载收录的病虫害记录失败:', error);
    return [];
  }
}

// 基于农业实际规律的病虫害档案数据
export function createMockPests() {
  // 获取收录的记录
  const collectedPests = loadCollectedPests();

  // 合并收录的记录和模拟数据
  const mockPests = [
    // 2025年当前活跃病虫害
    // F-001玉米田 - 玉米蚜虫（处理中）- 春季常见虫害
    {
      id: 'P-001',
      title: '玉米蚜虫',
      field: '玉米田',
      fieldId: 'F-001',
      category: '虫害',
      pest: 'Rhopalosiphum maidis',
      level: '中',
      date: '2025-04-15',
      status: '处理中',
      severity: 45,
      area: '18.0亩',
      solution: '使用吡虫啉防治',
      description: '蚜虫聚集在叶片背面吸食汁液，春季高发期，正在处理中',
      symptoms: ['叶片卷曲', '蜜露分泌', '轻微病毒传播'],
      prevention: ['天敌保护', '合理施肥', '及时灌溉'],
      treatment: ['吡虫啉喷雾', '生物防治'],
      images: ['pest-001-1.jpg'],
      technician: '张农技师',
      notes: '春季蚜虫高发期，正在处理中',
      nextCheck: '2025-01-25',
      cost: 120,
      treatmentRecords: [
        {
          id: 'TR-001',
          date: '2025-01-15',
          method: '吡虫啉喷雾防治',
          chemical: '吡虫啉 10% 可湿性粉剂',
          dosage: '15g/亩，兑水30L',
          result: '处理中',
          technician: '张农技师',
          effect: '蚜虫数量明显减少，叶片卷曲情况有所改善',
          notes: '第一次喷雾，效果良好，需要继续观察'
        },
        {
          id: 'TR-002',
          date: '2025-01-18',
          method: '生物防治配合',
          chemical: '瓢虫释放',
          dosage: '1000头/亩',
          result: '处理中',
          technician: '张农技师',
          effect: '天敌控制效果良好，蚜虫密度继续下降',
          notes: '生物防治与化学防治结合，效果更佳'
        }
      ]
    },

    // F-003棉花田 - 棉花蚜虫（待处理）- 春季常见虫害
    {
      id: 'P-002',
      title: '棉花蚜虫',
      field: '棉花田',
      fieldId: 'F-003',
      category: '虫害',
      pest: 'Aphis gossypii',
      level: '高',
      date: '2025-04-10',
      status: '待处理',
      severity: 65,
      area: '32.0亩',
      solution: '使用吡虫啉防治',
      description: '吸食叶片汁液，春季高发期，待处理',
      symptoms: ['叶片严重卷曲', '大量蜜露分泌', '病毒传播'],
      prevention: ['天敌保护', '合理密植', '及时排水'],
      treatment: ['吡虫啉', '啶虫脒', '生物农药'],
      images: ['pest-002-1.jpg'],
      technician: '赵农技师',
      notes: '春季蚜虫高发期，待处理',
      nextCheck: '2025-01-20',
      cost: 200
      // 待处理状态，无处理记录
    },

    // F-003棉花田 - 棉铃虫（处理中）- 夏季常见虫害
    {
      id: 'P-003',
      title: '棉铃虫',
      field: '棉花田',
      fieldId: 'F-003',
      category: '虫害',
      pest: 'Helicoverpa armigera',
      level: '中',
      date: '2025-07-08',
      status: '处理中',
      severity: 50,
      area: '32.0亩',
      solution: '使用氯氰菊酯防治',
      description: '幼虫蛀食棉铃，夏季高发期，正在处理中',
      symptoms: ['棉铃蛀孔', '棉铃脱落', '产量损失'],
      prevention: ['生物防治', '诱虫灯', '及时收获'],
      treatment: ['氯氰菊酯', '苏云金杆菌'],
      images: ['pest-003-1.jpg'],
      technician: '赵农技师',
      notes: '夏季棉铃虫高发期，正在处理中',
      nextCheck: '2025-01-18',
      cost: 180,
      treatmentRecords: [
        {
          id: 'TR-002',
          date: '2025-01-08',
          method: '氯氰菊酯喷雾防治',
          chemical: '氯氰菊酯 5% 乳油',
          dosage: '20ml/亩，兑水40L',
          result: '处理中',
          technician: '赵农技师',
          effect: '棉铃虫幼虫死亡率达到85%，棉铃蛀孔明显减少',
          notes: '使用高效氯氰菊酯，效果显著，需要二次防治'
        },
        {
          id: 'TR-003',
          date: '2025-01-12',
          method: '苏云金杆菌生物防治',
          chemical: '苏云金杆菌 BT 制剂',
          dosage: '50g/亩，兑水30L',
          result: '处理中',
          technician: '赵农技师',
          effect: '生物防治效果良好，无抗药性风险',
          notes: '配合化学防治，综合防治效果更佳'
        },
        {
          id: 'TR-004',
          date: '2025-01-16',
          method: '诱虫灯物理防治',
          chemical: '太阳能诱虫灯',
          dosage: '1台/2亩',
          result: '处理中',
          technician: '赵农技师',
          effect: '夜间诱杀成虫，减少产卵量',
          notes: '物理防治与化学防治结合，效果更全面'
        }
      ]
    },

    // F-007大豆田 - 大豆蚜虫（处理中）- 春季常见虫害
    {
      id: 'P-004',
      title: '大豆蚜虫',
      field: '大豆田',
      fieldId: 'F-007',
      category: '虫害',
      pest: 'Aphis glycines',
      level: '低',
      date: '2025-04-12',
      status: '处理中',
      severity: 30,
      area: '15.0亩',
      solution: '使用吡虫啉防治',
      description: '吸食叶片汁液，春季轻微发生，正在处理中',
      symptoms: ['叶片轻微卷曲', '少量蜜露分泌'],
      prevention: ['天敌保护', '合理密植', '及时排水'],
      treatment: ['吡虫啉', '生物防治'],
      images: ['pest-004-1.jpg'],
      technician: '郑农技师',
      notes: '春季轻微发生，正在处理中',
      nextCheck: '2025-01-22',
      cost: 90,
      treatmentRecords: [
        {
          id: 'TR-005',
          date: '2025-01-12',
          method: '啶虫脒喷雾防治',
          chemical: '啶虫脒 3% 乳油',
          dosage: '25ml/亩，兑水35L',
          result: '处理中',
          technician: '郑农技师',
          effect: '蚜虫密度下降60%，叶片状况明显改善',
          notes: '啶虫脒对蚜虫特效，但需要注意抗药性'
        },
        {
          id: 'TR-006',
          date: '2025-01-17',
          method: '生物防治配合',
          chemical: '蚜茧蜂释放',
          dosage: '500头/亩',
          result: '处理中',
          technician: '郑农技师',
          effect: '天敌寄生率提高，蚜虫自然控制效果良好',
          notes: '生物防治与化学防治轮换使用，避免抗药性'
        }
      ]
    },

    // F-008棉花田 - 棉花红蜘蛛（待处理）- 夏季常见虫害
    {
      id: 'P-005',
      title: '棉花红蜘蛛',
      field: '棉花田',
      fieldId: 'F-008',
      category: '虫害',
      pest: 'Tetranychus urticae',
      level: '中',
      date: '2025-07-14',
      status: '待处理',
      severity: 50,
      area: '20.0亩',
      solution: '使用阿维菌素防治',
      description: '吸食叶片汁液，夏季高发期，待处理',
      symptoms: ['叶片黄化', '蜘蛛网', '叶片脱落'],
      prevention: ['天敌保护', '合理密植', '及时灌溉'],
      treatment: ['阿维菌素', '生物防治'],
      images: ['pest-005-1.jpg'],
      technician: '李农技师',
      notes: '夏季红蜘蛛高发期，待处理',
      nextCheck: '2025-01-24',
      cost: 150
      // 待处理状态，无处理记录
    },

    // 2024年历史数据 - 体现病虫害的重复发生规律
    // F-001玉米田 - 玉米蚜虫（已解决）- 2024年春季
    {
      id: 'P-006',
      title: '玉米蚜虫',
      field: '玉米田',
      fieldId: 'F-001',
      category: '虫害',
      pest: 'Rhopalosiphum maidis',
      level: '中',
      date: '2024-03-15',
      status: '已解决',
      severity: 50,
      area: '18.0亩',
      solution: '使用吡虫啉防治',
      description: '蚜虫聚集在叶片背面吸食汁液，春季高发期，已得到控制',
      symptoms: ['叶片卷曲', '蜜露分泌', '轻微病毒传播'],
      prevention: ['天敌保护', '合理施肥', '及时灌溉'],
      treatment: ['吡虫啉喷雾', '生物防治'],
      images: ['pest-006-1.jpg'],
      technician: '张农技师',
      notes: '2024年春季蚜虫已得到控制',
      nextCheck: '2024-03-25',
      cost: 150,
      treatmentRecords: [
        {
          id: 'TR-007',
          date: '2024-03-15',
          method: '吡虫啉喷雾防治',
          chemical: '吡虫啉 10% 可湿性粉剂',
          dosage: '15g/亩，兑水30L',
          result: '已解决',
          technician: '张农技师',
          effect: '蚜虫完全控制，叶片恢复正常，无病毒传播',
          notes: '春季防治及时，效果显著'
        },
        {
          id: 'TR-008',
          date: '2024-03-20',
          method: '生物防治巩固',
          chemical: '瓢虫释放',
          dosage: '800头/亩',
          result: '已解决',
          technician: '张农技师',
          effect: '天敌建立稳定种群，长期控制效果良好',
          notes: '生物防治巩固化学防治效果，防止复发'
        }
      ]
    },

    // F-001玉米田 - 玉米大斑病（已解决）- 2024年秋季
    {
      id: 'P-007',
      title: '玉米大斑病',
      field: '玉米田',
      fieldId: 'F-001',
      category: '病害',
      pest: 'Exserohilum turcicum',
      level: '中',
      date: '2024-10-15',
      status: '已解决',
      severity: 55,
      area: '18.0亩',
      solution: '使用丙环唑防治',
      description: '叶片出现病斑，秋季湿度大时发生，已得到控制',
      symptoms: ['叶片病斑', '轻微黄化', '光合作用略降'],
      prevention: ['合理密植', '增施钾肥', '及时排水'],
      treatment: ['丙环唑喷雾', '代森锰锌'],
      images: ['pest-007-1.jpg'],
      technician: '张农技师',
      notes: '2024年秋季病害已得到控制',
      nextCheck: '2024-10-25',
      cost: 200,
      treatmentRecords: [
        {
          id: 'TR-009',
          date: '2024-10-15',
          method: '代森锰锌喷雾防治',
          chemical: '代森锰锌 80% 可湿性粉剂',
          dosage: '200g/亩，兑水50L',
          result: '已解决',
          technician: '张农技师',
          effect: '病斑停止扩展，叶片健康恢复，产量损失控制在5%以内',
          notes: '秋季防治及时，效果显著，建议明年提前预防'
        },
        {
          id: 'TR-010',
          date: '2024-10-20',
          method: '叶面肥补充',
          chemical: '磷酸二氢钾 + 微量元素',
          dosage: '100g/亩，兑水30L',
          result: '已解决',
          technician: '张农技师',
          effect: '增强植株抗病能力，促进叶片恢复',
          notes: '营养补充配合药剂防治，效果更佳'
        }
      ]
    },

    // F-002大豆田 - 大豆蚜虫（已解决）- 2024年春季
    {
      id: 'P-008',
      title: '大豆蚜虫',
      field: '大豆田',
      fieldId: 'F-002',
      category: '虫害',
      pest: 'Aphis glycines',
      level: '中',
      date: '2024-04-20',
      status: '已解决',
      severity: 45,
      area: '24.0亩',
      solution: '使用吡虫啉防治',
      description: '吸食叶片汁液，春季高发期，已得到控制',
      symptoms: ['叶片卷曲', '蜜露分泌'],
      prevention: ['天敌保护', '合理密植', '及时排水'],
      treatment: ['吡虫啉', '生物防治'],
      images: ['pest-008-1.jpg'],
      technician: '王农技师',
      notes: '2024年春季蚜虫已得到控制',
      nextCheck: '2024-04-30',
      cost: 150,
      treatmentRecords: [
        {
          id: 'TR-015',
          date: '2024-04-10',
          method: '吡虫啉喷雾防治',
          chemical: '吡虫啉 10% 可湿性粉剂',
          dosage: '15g/亩，兑水30L',
          result: '已解决',
          technician: '赵农技师',
          effect: '蚜虫完全控制，叶片恢复正常，无病毒传播',
          notes: '春季防治及时，效果显著'
        },
        {
          id: 'TR-016',
          date: '2024-04-15',
          method: '生物防治巩固',
          chemical: '瓢虫释放',
          dosage: '800头/亩',
          result: '已解决',
          technician: '赵农技师',
          effect: '天敌建立稳定种群，长期控制效果良好',
          notes: '生物防治巩固化学防治效果，防止复发'
        }
      ]
    },

    // F-002大豆田 - 大豆根腐病（已解决）- 2024年夏季
    {
      id: 'P-009',
      title: '大豆根腐病',
      field: '大豆田',
      fieldId: 'F-002',
      category: '病害',
      pest: 'Fusarium oxysporum',
      level: '低',
      date: '2024-07-20',
      status: '已解决',
      severity: 35,
      area: '24.0亩',
      solution: '使用恶霉灵防治',
      description: '根部出现病斑，夏季高温高湿时发生，已得到控制',
      symptoms: ['根部病斑', '轻微黄化', '生长缓慢'],
      prevention: ['种子消毒', '合理密植', '及时排水'],
      treatment: ['恶霉灵', '多菌灵'],
      images: ['pest-009-1.jpg'],
      technician: '王农技师',
      notes: '2024年夏季根腐病已得到控制',
      nextCheck: '2024-07-30',
      cost: 120,
      treatmentRecords: [
        {
          id: 'TR-013',
          date: '2024-07-20',
          method: '恶霉灵灌根防治',
          chemical: '恶霉灵 30% 水剂',
          dosage: '50ml/亩，兑水100L',
          result: '已解决',
          technician: '王农技师',
          effect: '根部病斑停止扩展，植株恢复健康生长',
          notes: '灌根防治效果显著，建议加强排水管理'
        },
        {
          id: 'TR-014',
          date: '2024-07-25',
          method: '多菌灵叶面喷雾',
          chemical: '多菌灵 50% 可湿性粉剂',
          dosage: '100g/亩，兑水40L',
          result: '已解决',
          technician: '王农技师',
          effect: '增强植株抗病能力，防止病害扩散',
          notes: '叶面喷雾配合灌根，防治效果更全面'
        }
      ]
    },

    // F-003棉花田 - 棉花蚜虫（已解决）- 2024年春季
    {
      id: 'P-010',
      title: '棉花蚜虫',
      field: '棉花田',
      fieldId: 'F-003',
      category: '虫害',
      pest: 'Aphis gossypii',
      level: '中',
      date: '2024-04-10',
      status: '已解决',
      severity: 50,
      area: '32.0亩',
      solution: '使用吡虫啉防治',
      description: '吸食叶片汁液，春季高发期，已得到控制',
      symptoms: ['叶片卷曲', '蜜露分泌'],
      prevention: ['天敌保护', '合理密植', '及时排水'],
      treatment: ['吡虫啉', '生物防治'],
      images: ['pest-010-1.jpg'],
      technician: '赵农技师',
      notes: '2024年春季蚜虫已得到控制',
      nextCheck: '2024-04-20',
      cost: 180,
      treatmentRecords: [
        {
          id: 'TR-010-001',
          date: '2024-04-10',
          method: '吡虫啉喷雾防治',
          chemical: '吡虫啉 10% 可湿性粉剂',
          dosage: '20g/亩，兑水40L',
          result: '已解决',
          technician: '赵农技师',
          effect: '蚜虫完全控制，叶片恢复正常',
          notes: '春季蚜虫防治效果良好，无复发'
        },
        {
          id: 'TR-010-002',
          date: '2024-04-15',
          method: '生物防治巩固',
          chemical: '瓢虫释放',
          dosage: '800头/亩',
          result: '已解决',
          technician: '赵农技师',
          effect: '天敌控制效果显著，蚜虫密度降至安全水平',
          notes: '生物防治与化学防治结合，效果持久'
        }
      ]
    },

    // F-003棉花田 - 棉铃虫（已解决）- 2024年夏季
    {
      id: 'P-011',
      title: '棉铃虫',
      field: '棉花田',
      fieldId: 'F-003',
      category: '虫害',
      pest: 'Helicoverpa armigera',
      level: '中',
      date: '2024-08-15',
      status: '已解决',
      severity: 55,
      area: '32.0亩',
      solution: '使用氯氰菊酯防治',
      description: '幼虫蛀食棉铃，夏季高发期，已得到控制',
      symptoms: ['棉铃蛀孔', '棉铃脱落', '产量损失'],
      prevention: ['生物防治', '诱虫灯', '及时收获'],
      treatment: ['氯氰菊酯', '苏云金杆菌'],
      images: ['pest-011-1.jpg'],
      technician: '赵农技师',
      notes: '2024年夏季棉铃虫已得到控制',
      nextCheck: '2024-08-25',
      cost: 200,
      treatmentRecords: [
        {
          id: 'TR-017',
          date: '2024-08-15',
          method: '氯氰菊酯喷雾防治',
          chemical: '氯氰菊酯 5% 乳油',
          dosage: '20ml/亩，兑水40L',
          result: '已解决',
          technician: '赵农技师',
          effect: '棉铃虫幼虫死亡率达到90%，棉铃蛀孔完全控制',
          notes: '夏季防治及时，效果显著'
        },
        {
          id: 'TR-018',
          date: '2024-08-20',
          method: '苏云金杆菌生物防治',
          chemical: '苏云金杆菌 BT 制剂',
          dosage: '50g/亩，兑水30L',
          result: '已解决',
          technician: '赵农技师',
          effect: '生物防治效果良好，无抗药性风险',
          notes: '生物防治与化学防治结合，效果更佳'
        }
      ]
    },

    // F-003棉花田 - 棉花立枯病（已解决）- 2024年春季
    {
      id: 'P-012',
      title: '棉花立枯病',
      field: '棉花田',
      fieldId: 'F-003',
      category: '病害',
      pest: 'Rhizoctonia solani',
      level: '中',
      date: '2024-04-20',
      status: '已解决',
      severity: 40,
      area: '32.0亩',
      solution: '使用恶霉灵防治',
      description: '幼苗茎基部出现褐色病斑，春季低温高湿时发生，已得到控制',
      symptoms: ['茎基褐斑', '幼苗生长缓慢'],
      prevention: ['种子消毒', '合理密植', '及时排水'],
      treatment: ['恶霉灵喷雾', '多菌灵'],
      images: ['pest-012-1.jpg'],
      technician: '赵农技师',
      notes: '2024年春季病害已得到控制',
      nextCheck: '2024-04-30',
      cost: 120,
      treatmentRecords: [
        {
          id: 'TR-019',
          date: '2024-04-20',
          method: '恶霉灵灌根防治',
          chemical: '恶霉灵 30% 水剂',
          dosage: '50ml/亩，兑水100L',
          result: '已解决',
          technician: '赵农技师',
          effect: '茎基褐斑停止扩展，幼苗恢复健康生长',
          notes: '灌根防治效果显著，建议加强排水管理'
        },
        {
          id: 'TR-020',
          date: '2024-04-25',
          method: '多菌灵叶面喷雾',
          chemical: '多菌灵 50% 可湿性粉剂',
          dosage: '100g/亩，兑水40L',
          result: '已解决',
          technician: '赵农技师',
          effect: '增强植株抗病能力，防止病害扩散',
          notes: '叶面喷雾配合灌根，防治效果更全面'
        }
      ]
    },

    // F-004大豆田 - 大豆蚜虫（已解决）- 2024年春季
    {
      id: 'P-013',
      title: '大豆蚜虫',
      field: '大豆田',
      fieldId: 'F-004',
      category: '虫害',
      pest: 'Aphis glycines',
      level: '低',
      date: '2024-05-10',
      status: '已解决',
      severity: 35,
      area: '6.0亩',
      solution: '使用吡虫啉防治',
      description: '吸食叶片汁液，春季轻微发生，已得到控制',
      symptoms: ['叶片轻微卷曲', '少量蜜露分泌'],
      prevention: ['天敌保护', '合理密植', '及时排水'],
      treatment: ['吡虫啉', '生物防治'],
      images: ['pest-013-1.jpg'],
      technician: '刘农技师',
      notes: '2024年春季轻微发生，已得到控制',
      nextCheck: '2024-05-20',
      cost: 80,
      treatmentRecords: [
        {
          id: 'TR-021',
          date: '2024-05-10',
          method: '吡虫啉喷雾防治',
          chemical: '吡虫啉 10% 可湿性粉剂',
          dosage: '15g/亩，兑水30L',
          result: '已解决',
          technician: '刘农技师',
          effect: '蚜虫完全控制，叶片恢复正常，无病毒传播',
          notes: '春季防治及时，效果显著'
        },
        {
          id: 'TR-022',
          date: '2024-05-15',
          method: '生物防治巩固',
          chemical: '蚜茧蜂释放',
          dosage: '400头/亩',
          result: '已解决',
          technician: '刘农技师',
          effect: '天敌建立稳定种群，长期控制效果良好',
          notes: '生物防治巩固化学防治效果，防止复发'
        }
      ]
    },

    // F-004大豆田 - 大豆锈病（已解决）- 2024年秋季
    {
      id: 'P-014',
      title: '大豆锈病',
      field: '大豆田',
      fieldId: 'F-004',
      category: '病害',
      pest: 'Phakopsora pachyrhizi',
      level: '中',
      date: '2024-09-10',
      status: '已解决',
      severity: 45,
      area: '6.0亩',
      solution: '使用丙环唑防治',
      description: '叶片出现锈色病斑，秋季高发期，已得到控制',
      symptoms: ['叶片锈斑', '轻微黄化'],
      prevention: ['抗病品种', '合理密植', '及时排水'],
      treatment: ['丙环唑', '三唑酮'],
      images: ['pest-014-1.jpg'],
      technician: '刘农技师',
      notes: '2024年秋季锈病已得到控制',
      nextCheck: '2024-09-20',
      cost: 100,
      treatmentRecords: [
        {
          id: 'TR-023',
          date: '2024-09-10',
          method: '丙环唑喷雾防治',
          chemical: '丙环唑 25% 乳油',
          dosage: '30ml/亩，兑水40L',
          result: '已解决',
          technician: '刘农技师',
          effect: '锈斑停止扩展，叶片健康恢复，产量损失控制在3%以内',
          notes: '秋季防治及时，效果显著'
        },
        {
          id: 'TR-024',
          date: '2024-09-15',
          method: '叶面肥补充',
          chemical: '磷酸二氢钾 + 微量元素',
          dosage: '100g/亩，兑水30L',
          result: '已解决',
          technician: '刘农技师',
          effect: '增强植株抗病能力，促进叶片恢复',
          notes: '营养补充配合药剂防治，效果更佳'
        }
      ]
    },

    // F-005棉花田 - 棉花蚜虫（已解决）- 2024年春季
    {
      id: 'P-015',
      title: '棉花蚜虫',
      field: '棉花田',
      fieldId: 'F-005',
      category: '虫害',
      pest: 'Aphis gossypii',
      level: '中',
      date: '2024-04-15',
      status: '已解决',
      severity: 50,
      area: '26.0亩',
      solution: '使用吡虫啉防治',
      description: '吸食叶片汁液，春季高发期，已得到控制',
      symptoms: ['叶片卷曲', '蜜露分泌'],
      prevention: ['天敌保护', '合理密植', '及时排水'],
      treatment: ['吡虫啉', '生物防治'],
      images: ['pest-015-1.jpg'],
      technician: '陈农技师',
      notes: '2024年春季蚜虫已得到控制',
      nextCheck: '2024-04-25',
      cost: 160,
      treatmentRecords: [
        {
          id: 'TR-015-001',
          date: '2024-04-15',
          method: '吡虫啉喷雾防治',
          chemical: '吡虫啉 10% 可湿性粉剂',
          dosage: '18g/亩，兑水35L',
          result: '已解决',
          technician: '陈农技师',
          effect: '蚜虫密度显著下降，叶片卷曲情况改善',
          notes: '春季蚜虫防治及时，效果良好'
        },
        {
          id: 'TR-015-002',
          date: '2024-04-20',
          method: '生物防治巩固',
          chemical: '瓢虫释放',
          dosage: '600头/亩',
          result: '已解决',
          technician: '陈农技师',
          effect: '天敌控制效果显著，蚜虫完全控制',
          notes: '生物防治与化学防治结合，效果持久'
        }
      ]
    },

    // F-005棉花田 - 棉花红蜘蛛（已解决）- 2024年夏季
    {
      id: 'P-016',
      title: '棉花红蜘蛛',
      field: '棉花田',
      fieldId: 'F-005',
      category: '虫害',
      pest: 'Tetranychus urticae',
      level: '中',
      date: '2024-07-10',
      status: '已解决',
      severity: 50,
      area: '26.0亩',
      solution: '使用阿维菌素防治',
      description: '吸食叶片汁液，夏季高发期，已得到控制',
      symptoms: ['叶片黄化', '蜘蛛网', '叶片脱落'],
      prevention: ['天敌保护', '合理密植', '及时灌溉'],
      treatment: ['阿维菌素', '生物防治'],
      images: ['pest-016-1.jpg'],
      technician: '陈农技师',
      notes: '2024年夏季红蜘蛛已得到控制',
      nextCheck: '2024-07-20',
      cost: 180,
      treatmentRecords: [
        {
          id: 'TR-016-001',
          date: '2024-07-10',
          method: '阿维菌素喷雾防治',
          chemical: '阿维菌素 1.8% 乳油',
          dosage: '25ml/亩，兑水40L',
          result: '已解决',
          technician: '陈农技师',
          effect: '红蜘蛛密度显著下降，叶片黄化情况改善',
          notes: '夏季红蜘蛛防治及时，效果良好'
        },
        {
          id: 'TR-016-002',
          date: '2024-07-15',
          method: '生物防治配合',
          chemical: '捕食螨释放',
          dosage: '500头/亩',
          result: '已解决',
          technician: '陈农技师',
          effect: '天敌控制效果显著，红蜘蛛完全控制',
          notes: '生物防治与化学防治结合，效果持久'
        }
      ]
    },

    // F-005棉花田 - 棉花黄萎病（已解决）- 2024年秋季
    {
      id: 'P-017',
      title: '棉花黄萎病',
      field: '棉花田',
      fieldId: 'F-005',
      category: '病害',
      pest: 'Verticillium dahliae',
      level: '低',
      date: '2024-10-12',
      status: '已解决',
      severity: 35,
      area: '26.0亩',
      solution: '使用恶霉灵防治',
      description: '叶片黄化萎蔫，秋季高发期，已得到控制',
      symptoms: ['叶片黄化', '轻微萎蔫'],
      prevention: ['抗病品种', '合理密植', '及时排水'],
      treatment: ['恶霉灵', '多菌灵'],
      images: ['pest-017-1.jpg'],
      technician: '陈农技师',
      notes: '2024年秋季黄萎病已得到控制',
      nextCheck: '2024-10-22',
      cost: 140,
      treatmentRecords: [
        {
          id: 'TR-017-001',
          date: '2024-10-12',
          method: '恶霉灵灌根防治',
          chemical: '恶霉灵 30% 水剂',
          dosage: '50ml/亩，兑水50L',
          result: '已解决',
          technician: '陈农技师',
          effect: '黄萎病症状明显改善，植株恢复健康',
          notes: '秋季黄萎病防治及时，效果良好'
        },
        {
          id: 'TR-017-002',
          date: '2024-10-17',
          method: '多菌灵叶面喷雾',
          chemical: '多菌灵 50% 可湿性粉剂',
          dosage: '40g/亩，兑水40L',
          result: '已解决',
          technician: '陈农技师',
          effect: '病害完全控制，植株生长正常',
          notes: '综合防治措施效果显著'
        }
      ]
    },

    // F-006玉米田 - 玉米蚜虫（已解决）- 2024年春季
    {
      id: 'P-018',
      title: '玉米蚜虫',
      field: '玉米田',
      fieldId: 'F-006',
      category: '虫害',
      pest: 'Rhopalosiphum maidis',
      level: '中',
      date: '2024-03-20',
      status: '已解决',
      severity: 45,
      area: '25.0亩',
      solution: '使用吡虫啉防治',
      description: '蚜虫聚集在叶片背面吸食汁液，春季高发期，已得到控制',
      symptoms: ['叶片卷曲', '蜜露分泌', '轻微病毒传播'],
      prevention: ['天敌保护', '合理施肥', '及时灌溉'],
      treatment: ['吡虫啉喷雾', '生物防治'],
      images: ['pest-018-1.jpg'],
      technician: '周农技师',
      notes: '2024年春季蚜虫已得到控制',
      nextCheck: '2024-03-30',
      cost: 150,
      treatmentRecords: [
        {
          id: 'TR-018-001',
          date: '2024-03-20',
          method: '吡虫啉喷雾防治',
          chemical: '吡虫啉 10% 可湿性粉剂',
          dosage: '20g/亩，兑水40L',
          result: '已解决',
          technician: '周农技师',
          effect: '蚜虫密度显著下降，叶片卷曲情况改善',
          notes: '春季蚜虫防治及时，效果良好'
        },
        {
          id: 'TR-018-002',
          date: '2024-03-25',
          method: '生物防治巩固',
          chemical: '瓢虫释放',
          dosage: '700头/亩',
          result: '已解决',
          technician: '周农技师',
          effect: '天敌控制效果显著，蚜虫完全控制',
          notes: '生物防治与化学防治结合，效果持久'
        }
      ]
    },

    // F-006玉米田 - 玉米螟（已解决）- 2024年夏季
    {
      id: 'P-019',
      title: '玉米螟',
      field: '玉米田',
      fieldId: 'F-006',
      category: '虫害',
      pest: 'Ostrinia nubilalis',
      level: '中',
      date: '2024-08-15',
      status: '已解决',
      severity: 50,
      area: '25.0亩',
      solution: '使用氯氰菊酯防治',
      description: '幼虫蛀食茎秆，夏季高发期，已得到控制',
      symptoms: ['茎秆蛀孔', '轻微倒伏'],
      prevention: ['生物防治', '诱虫灯', '及时收获'],
      treatment: ['氯氰菊酯', '苏云金杆菌'],
      images: ['pest-019-1.jpg'],
      technician: '周农技师',
      notes: '2024年夏季玉米螟已得到控制',
      nextCheck: '2024-08-25',
      cost: 160,
      treatmentRecords: [
        {
          id: 'TR-019-001',
          date: '2024-08-15',
          method: '氯氰菊酯喷雾防治',
          chemical: '氯氰菊酯 10% 乳油',
          dosage: '30ml/亩，兑水40L',
          result: '已解决',
          technician: '周农技师',
          effect: '玉米螟幼虫死亡率显著提高，茎秆蛀孔减少',
          notes: '夏季玉米螟防治及时，效果良好'
        },
        {
          id: 'TR-019-002',
          date: '2024-08-20',
          method: '苏云金杆菌生物防治',
          chemical: '苏云金杆菌 8000IU/mg',
          dosage: '50g/亩，兑水35L',
          result: '已解决',
          technician: '周农技师',
          effect: '生物防治效果显著，玉米螟完全控制',
          notes: '生物防治与化学防治结合，效果持久'
        }
      ]
    },

    // F-006玉米田 - 玉米叶斑病（已解决）- 2024年秋季
    {
      id: 'P-020',
      title: '玉米叶斑病',
      field: '玉米田',
      fieldId: 'F-006',
      category: '病害',
      pest: 'Bipolaris maydis',
      level: '低',
      date: '2024-09-20',
      status: '已解决',
      severity: 30,
      area: '25.0亩',
      solution: '使用丙环唑防治',
      description: '叶片出现病斑，秋季高发期，已得到控制',
      symptoms: ['叶片病斑', '轻微黄化'],
      prevention: ['抗病品种', '合理密植', '及时排水'],
      treatment: ['丙环唑', '代森锰锌'],
      images: ['pest-020-1.jpg'],
      technician: '周农技师',
      notes: '2024年秋季叶斑病已得到控制',
      nextCheck: '2024-09-30',
      cost: 120,
      treatmentRecords: [
        {
          id: 'TR-020-001',
          date: '2024-09-20',
          method: '丙环唑喷雾防治',
          chemical: '丙环唑 25% 乳油',
          dosage: '25ml/亩，兑水40L',
          result: '已解决',
          technician: '周农技师',
          effect: '叶斑病症状明显改善，叶片健康恢复',
          notes: '秋季叶斑病防治及时，效果良好'
        },
        {
          id: 'TR-020-002',
          date: '2024-09-25',
          method: '代森锰锌保护性防治',
          chemical: '代森锰锌 70% 可湿性粉剂',
          dosage: '60g/亩，兑水40L',
          result: '已解决',
          technician: '周农技师',
          effect: '病害完全控制，叶片生长正常',
          notes: '保护性防治措施效果显著'
        }
      ]
    },

    // F-007大豆田 - 大豆蚜虫（已解决）- 2024年春季
    {
      id: 'P-021',
      title: '大豆蚜虫',
      field: '大豆田',
      fieldId: 'F-007',
      category: '虫害',
      pest: 'Aphis glycines',
      level: '中',
      date: '2024-04-25',
      status: '已解决',
      severity: 40,
      area: '15.0亩',
      solution: '使用吡虫啉防治',
      description: '吸食叶片汁液，春季高发期，已得到控制',
      symptoms: ['叶片卷曲', '蜜露分泌'],
      prevention: ['天敌保护', '合理密植', '及时排水'],
      treatment: ['吡虫啉', '生物防治'],
      images: ['pest-021-1.jpg'],
      technician: '郑农技师',
      notes: '2024年春季蚜虫已得到控制',
      nextCheck: '2024-05-05',
      cost: 120,
      treatmentRecords: [
        {
          id: 'TR-021-001',
          date: '2024-04-25',
          method: '吡虫啉喷雾防治',
          chemical: '吡虫啉 10% 可湿性粉剂',
          dosage: '15g/亩，兑水30L',
          result: '已解决',
          technician: '郑农技师',
          effect: '蚜虫密度显著下降，叶片卷曲情况改善',
          notes: '春季蚜虫防治及时，效果良好'
        },
        {
          id: 'TR-021-002',
          date: '2024-04-30',
          method: '生物防治巩固',
          chemical: '瓢虫释放',
          dosage: '500头/亩',
          result: '已解决',
          technician: '郑农技师',
          effect: '天敌控制效果显著，蚜虫完全控制',
          notes: '生物防治与化学防治结合，效果持久'
        }
      ]
    },

    // F-007大豆田 - 大豆锈病（已解决）- 2024年秋季
    {
      id: 'P-022',
      title: '大豆锈病',
      field: '大豆田',
      fieldId: 'F-007',
      category: '病害',
      pest: 'Phakopsora pachyrhizi',
      level: '低',
      date: '2024-10-18',
      status: '已解决',
      severity: 35,
      area: '15.0亩',
      solution: '使用丙环唑防治',
      description: '叶片出现锈色病斑，秋季高发期，已得到控制',
      symptoms: ['叶片轻微锈斑', '轻微黄化'],
      prevention: ['抗病品种', '合理密植', '及时排水'],
      treatment: ['丙环唑', '三唑酮'],
      images: ['pest-022-1.jpg'],
      technician: '郑农技师',
      notes: '2024年秋季轻微发生，已得到控制',
      nextCheck: '2024-10-28',
      cost: 120,
      treatmentRecords: [
        {
          id: 'TR-022-001',
          date: '2024-10-18',
          method: '丙环唑喷雾防治',
          chemical: '丙环唑 25% 乳油',
          dosage: '20ml/亩，兑水30L',
          result: '已解决',
          technician: '郑农技师',
          effect: '锈斑停止扩展，叶片健康恢复',
          notes: '秋季锈病防治及时，效果良好'
        },
        {
          id: 'TR-022-002',
          date: '2024-10-23',
          method: '三唑酮保护性防治',
          chemical: '三唑酮 20% 乳油',
          dosage: '15ml/亩，兑水30L',
          result: '已解决',
          technician: '郑农技师',
          effect: '病害完全控制，叶片生长正常',
          notes: '保护性防治措施效果显著'
        }
      ]
    },

    // F-008棉花田 - 棉花蚜虫（已解决）- 2024年春季
    {
      id: 'P-023',
      title: '棉花蚜虫',
      field: '棉花田',
      fieldId: 'F-008',
      category: '虫害',
      pest: 'Aphis gossypii',
      level: '中',
      date: '2024-04-05',
      status: '已解决',
      severity: 50,
      area: '20.0亩',
      solution: '使用吡虫啉防治',
      description: '吸食叶片汁液，春季高发期，已得到控制',
      symptoms: ['叶片卷曲', '蜜露分泌'],
      prevention: ['天敌保护', '合理密植', '及时排水'],
      treatment: ['吡虫啉', '生物防治'],
      images: ['pest-023-1.jpg'],
      technician: '李农技师',
      notes: '2024年春季蚜虫已得到控制',
      nextCheck: '2024-04-15',
      cost: 140,
      treatmentRecords: [
        {
          id: 'TR-023-001',
          date: '2024-04-05',
          method: '吡虫啉喷雾防治',
          chemical: '吡虫啉 10% 可湿性粉剂',
          dosage: '20g/亩，兑水40L',
          result: '已解决',
          technician: '李农技师',
          effect: '蚜虫密度显著下降，叶片卷曲情况改善',
          notes: '春季蚜虫防治及时，效果良好'
        },
        {
          id: 'TR-023-002',
          date: '2024-04-10',
          method: '生物防治巩固',
          chemical: '瓢虫释放',
          dosage: '800头/亩',
          result: '已解决',
          technician: '李农技师',
          effect: '天敌控制效果显著，蚜虫完全控制',
          notes: '生物防治与化学防治结合，效果持久'
        }
      ]
    },

    // F-008棉花田 - 棉花红蜘蛛（已解决）- 2024年夏季
    {
      id: 'P-024',
      title: '棉花红蜘蛛',
      field: '棉花田',
      fieldId: 'F-008',
      category: '虫害',
      pest: 'Tetranychus urticae',
      level: '中',
      date: '2024-07-25',
      status: '已解决',
      severity: 50,
      area: '20.0亩',
      solution: '使用阿维菌素防治',
      description: '吸食叶片汁液，夏季高发期，已得到控制',
      symptoms: ['叶片黄化', '蜘蛛网', '叶片脱落'],
      prevention: ['天敌保护', '合理密植', '及时灌溉'],
      treatment: ['阿维菌素', '生物防治'],
      images: ['pest-024-1.jpg'],
      technician: '李农技师',
      notes: '2024年夏季红蜘蛛已得到控制',
      nextCheck: '2024-08-05',
      cost: 150,
      treatmentRecords: [
        {
          id: 'TR-024-001',
          date: '2024-07-25',
          method: '阿维菌素喷雾防治',
          chemical: '阿维菌素 1.8% 乳油',
          dosage: '30ml/亩，兑水40L',
          result: '已解决',
          technician: '李农技师',
          effect: '红蜘蛛密度显著下降，叶片黄化情况改善',
          notes: '夏季红蜘蛛防治及时，效果良好'
        },
        {
          id: 'TR-024-002',
          date: '2024-07-30',
          method: '生物防治配合',
          chemical: '捕食螨释放',
          dosage: '600头/亩',
          result: '已解决',
          technician: '李农技师',
          effect: '天敌控制效果显著，红蜘蛛完全控制',
          notes: '生物防治与化学防治结合，效果持久'
        }
      ]
    },

    // F-012小麦田 - 小麦白粉病（已解决）- 2024年春季
    {
      id: 'P-025',
      title: '小麦白粉病',
      field: '小麦田',
      fieldId: 'F-012',
      category: '病害',
      pest: 'Blumeria graminis',
      level: '中',
      date: '2024-03-20',
      status: '已解决',
      severity: 45,
      area: '28.0亩',
      solution: '使用三唑酮防治',
      description: '叶片出现白色粉状物，春季高发期，已得到控制',
      symptoms: ['叶片白粉', '轻微黄化', '光合作用略降'],
      prevention: ['抗病品种', '合理密植', '增施磷钾肥'],
      treatment: ['三唑酮喷雾', '丙环唑'],
      images: ['pest-025-1.jpg'],
      technician: '孙农技师',
      notes: '2024年春季白粉病已得到控制',
      nextCheck: '2024-03-30',
      cost: 180,
      treatmentRecords: [
        {
          id: 'TR-025-001',
          date: '2024-03-20',
          method: '三唑酮喷雾防治',
          chemical: '三唑酮 20% 乳油',
          dosage: '30ml/亩，兑水40L',
          result: '已解决',
          technician: '孙农技师',
          effect: '白粉病症状明显改善，叶片健康恢复，产量损失控制在5%以内',
          notes: '春季防治及时，效果显著，建议明年提前预防'
        },
        {
          id: 'TR-025-002',
          date: '2024-03-25',
          method: '叶面肥补充',
          chemical: '磷酸二氢钾 + 微量元素',
          dosage: '100g/亩，兑水30L',
          result: '已解决',
          technician: '孙农技师',
          effect: '增强植株抗病能力，促进叶片恢复',
          notes: '营养补充配合药剂防治，效果更佳'
        }
      ]
    },

    // F-013水稻田 - 水稻纹枯病（已解决）- 2024年夏季
    {
      id: 'P-026',
      title: '水稻纹枯病',
      field: '水稻田',
      fieldId: 'F-013',
      category: '病害',
      pest: 'Rhizoctonia solani',
      level: '中',
      date: '2024-07-15',
      status: '已解决',
      severity: 50,
      area: '35.0亩',
      solution: '使用井冈霉素防治',
      description: '叶鞘和茎秆出现病斑，夏季高温高湿时发生，已得到控制',
      symptoms: ['叶鞘病斑', '茎秆病斑', '轻微倒伏'],
      prevention: ['合理密植', '增施钾肥', '及时排水'],
      treatment: ['井冈霉素', '多菌灵'],
      images: ['pest-026-1.jpg'],
      technician: '吴农技师',
      notes: '2024年夏季纹枯病已得到控制',
      nextCheck: '2024-07-25',
      cost: 200,
      treatmentRecords: [
        {
          id: 'TR-026-001',
          date: '2024-07-15',
          method: '井冈霉素喷雾防治',
          chemical: '井冈霉素 5% 水剂',
          dosage: '100ml/亩，兑水50L',
          result: '已解决',
          technician: '吴农技师',
          effect: '病斑停止扩展，叶鞘和茎秆健康恢复，产量损失控制在6%以内',
          notes: '夏季防治及时，效果显著，建议加强排水管理'
        },
        {
          id: 'TR-026-002',
          date: '2024-07-20',
          method: '多菌灵叶面喷雾',
          chemical: '多菌灵 50% 可湿性粉剂',
          dosage: '100g/亩，兑水40L',
          result: '已解决',
          technician: '吴农技师',
          effect: '增强植株抗病能力，防止病害扩散',
          notes: '叶面喷雾配合药剂防治，防治效果更全面'
        }
      ]
    },

    // F-015水稻田 - 二化螟（已解决）- 2024年夏季
    {
      id: 'P-027',
      title: '二化螟',
      field: '水稻田',
      fieldId: 'F-015',
      category: '虫害',
      pest: 'Chilo suppressalis',
      level: '中',
      date: '2024-08-10',
      status: '已解决',
      severity: 55,
      area: '30.0亩',
      solution: '使用氯虫苯甲酰胺防治',
      description: '幼虫蛀食茎秆，夏季高发期，已得到控制',
      symptoms: ['茎秆蛀孔', '枯心苗', '白穗'],
      prevention: ['生物防治', '诱虫灯', '及时收获'],
      treatment: ['氯虫苯甲酰胺', '苏云金杆菌'],
      images: ['pest-027-1.jpg'],
      technician: '钱农技师',
      notes: '2024年夏季二化螟已得到控制',
      nextCheck: '2024-08-20',
      cost: 220,
      treatmentRecords: [
        {
          id: 'TR-027-001',
          date: '2024-08-10',
          method: '氯虫苯甲酰胺喷雾防治',
          chemical: '氯虫苯甲酰胺 20% 悬浮剂',
          dosage: '10ml/亩，兑水40L',
          result: '已解决',
          technician: '钱农技师',
          effect: '二化螟幼虫死亡率达到90%，茎秆蛀孔完全控制，白穗率降至2%以下',
          notes: '夏季防治及时，效果显著'
        },
        {
          id: 'TR-027-002',
          date: '2024-08-15',
          method: '苏云金杆菌生物防治',
          chemical: '苏云金杆菌 BT 制剂',
          dosage: '50g/亩，兑水30L',
          result: '已解决',
          technician: '钱农技师',
          effect: '生物防治效果良好，无抗药性风险',
          notes: '生物防治与化学防治结合，效果更佳'
        },
        {
          id: 'TR-027-003',
          date: '2024-08-18',
          method: '诱虫灯物理防治',
          chemical: '太阳能诱虫灯',
          dosage: '1台/2亩',
          result: '已解决',
          technician: '钱农技师',
          effect: '夜间诱杀成虫，减少产卵量',
          notes: '物理防治与化学防治结合，效果更全面'
        }
      ]
    },

    // F-016小麦田 - 麦蚜（已解决）- 2024年春季
    {
      id: 'P-028',
      title: '麦蚜',
      field: '小麦田',
      fieldId: 'F-016',
      category: '虫害',
      pest: 'Sitobion avenae',
      level: '中',
      date: '2024-04-08',
      status: '已解决',
      severity: 48,
      area: '32.0亩',
      solution: '使用吡虫啉防治',
      description: '吸食叶片和穗部汁液，春季高发期，已得到控制',
      symptoms: ['叶片卷曲', '蜜露分泌', '穗部受害'],
      prevention: ['天敌保护', '合理密植', '及时排水'],
      treatment: ['吡虫啉', '生物防治'],
      images: ['pest-028-1.jpg'],
      technician: '周农技师',
      notes: '2024年春季麦蚜已得到控制',
      nextCheck: '2024-04-18',
      cost: 190,
      treatmentRecords: [
        {
          id: 'TR-028-001',
          date: '2024-04-08',
          method: '吡虫啉喷雾防治',
          chemical: '吡虫啉 10% 可湿性粉剂',
          dosage: '20g/亩，兑水40L',
          result: '已解决',
          technician: '周农技师',
          effect: '麦蚜密度显著下降，叶片和穗部恢复正常，无病毒传播',
          notes: '春季防治及时，效果显著'
        },
        {
          id: 'TR-028-002',
          date: '2024-04-13',
          method: '生物防治巩固',
          chemical: '瓢虫释放',
          dosage: '800头/亩',
          result: '已解决',
          technician: '周农技师',
          effect: '天敌建立稳定种群，长期控制效果良好',
          notes: '生物防治巩固化学防治效果，防止复发'
        }
      ]
    }
  ];

  // 定义允许的田块ID范围（F-001 到 F-008）
  const allowedFieldIds = ['F-001', 'F-002', 'F-003', 'F-004', 'F-005', 'F-006', 'F-007', 'F-008'];

  // 过滤收录的记录，只保留F-001到F-008的田块
  const filteredCollectedPests = collectedPests.filter(pest => {
    const fieldId = pest.fieldId || '';
    return allowedFieldIds.includes(fieldId);
  });

  // 过滤模拟数据，只保留F-001到F-008的田块
  const filteredMockPests = mockPests.filter(pest => {
    const fieldId = pest.fieldId || '';
    return allowedFieldIds.includes(fieldId);
  });

  // 将过滤后的收录记录添加到前面（最新的在前面）
  return [...filteredCollectedPests, ...filteredMockPests];
}