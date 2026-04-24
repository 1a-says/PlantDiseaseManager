/**
 * AI智慧农产品识别管理平台 - 配置文件
 * 包含应用配置、图表数据、API端点等
 */

const AgriConfig = {
  // 应用基本信息
  app: {
    name: '智慧农识',
    version: '1.0.0',
    description: 'AI智慧农产品识别管理平台',
    author: 'AgriTech Team',
    contact: {
      email: 'contact@smartagri.ai',
      phone: '400-888-9999',
      address: '北京市海淀区中关村南大街5号'
    }
  },

  // 主题配置
  theme: {
    colors: {
      primary: '#2E7D32',      // 农业绿 - 主色调
      secondary: '#1976D2',    // 科技蓝 - 辅助色
      tertiary: '#4CAF50',     // 亮绿 - 强调色
      dark: '#1E293B',         // 深色 - 文本
      light: '#F8FAFC',        // 浅色 - 背景
      success: '#4CAF50',
      warning: '#FF9800',
      error: '#F44336',
      info: '#2196F3'
    },
    fonts: {
      primary: ['Inter', 'system-ui', 'sans-serif'],
      fallback: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif']
    }
  },

  // 图表配置
  charts: {
    // 病虫害趋势数据
    diseaseTrend: {
      labels: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
      datasets: [
        {
          name: '真菌病害',
          data: [12, 19, 15, 20, 25, 30, 35, 38, 32, 22, 18, 15],
          color: '#2E7D32'
        },
        {
          name: '细菌病害',
          data: [8, 12, 15, 18, 22, 25, 28, 30, 25, 18, 12, 10],
          color: '#1976D2'
        },
        {
          name: '虫害',
          data: [5, 8, 10, 15, 20, 25, 30, 35, 28, 20, 15, 10],
          color: '#FF9800'
        }
      ]
    },

    // 风险预警分布数据
    riskDistribution: {
      labels: ['低风险', '中低风险', '中风险', '中高风险', '高风险'],
      data: [35, 25, 20, 15, 5],
      colors: [
        'rgba(76, 175, 80, 0.7)',
        'rgba(156, 39, 176, 0.7)',
        'rgba(255, 152, 0, 0.7)',
        'rgba(244, 67, 54, 0.7)',
        'rgba(233, 30, 99, 0.7)'
      ]
    },

    // 产量预测数据
    yieldPrediction: {
      labels: ['小麦', '玉米', '水稻', '大豆', '棉花'],
      actual: [480, 520, 550, 200, 120],
      predicted: [495, 535, 540, 195, 125]
    }
  },

  // 识别案例数据
  recognitionCases: [
    {
      id: 1,
      name: '小麦叶锈病',
      image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80',
      accuracy: 98,
      riskLevel: 'high',
      riskLabel: '高风险'
    },
    {
      id: 2,
      name: '玉米灰斑病',
      image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80',
      accuracy: 75,
      riskLevel: 'medium',
      riskLabel: '中风险'
    },
    {
      id: 3,
      name: '水稻稻瘟病',
      image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80',
      accuracy: 62,
      riskLevel: 'medium-low',
      riskLabel: '中低风险'
    },
    {
      id: 4,
      name: '番茄早疫病',
      image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80',
      accuracy: 45,
      riskLevel: 'low',
      riskLabel: '低风险'
    },
    {
      id: 5,
      name: '黄瓜霜霉病',
      image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80',
      accuracy: 30,
      riskLevel: 'very-low',
      riskLabel: '极低风险'
    }
  ],

  // 合作案例数据
  caseStudies: [
    {
      id: 1,
      name: '丰收农场',
      type: '小麦种植基地',
      location: '河南省驻马店市',
      area: '2000亩',
      crops: ['小麦', '玉米'],
      image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80',
      results: {
        efficiency: { label: '病虫害识别效率', value: 60, unit: '%', trend: 'up' },
        loss: { label: '风险损失降低', value: 45, unit: '%', trend: 'down' }
      },
      owner: {
        name: '张建国',
        title: '农场主',
        experience: '15年种植经验',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80'
      }
    },
    {
      id: 2,
      name: '绿水农庄',
      type: '水稻种植基地',
      location: '江苏省扬州市',
      area: '1500亩',
      crops: ['有机水稻'],
      image: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80',
      results: {
        pesticide: { label: '农药使用量', value: 35, unit: '%', trend: 'down' },
        yield: { label: '产量提升', value: 18, unit: '%', trend: 'up' }
      },
      owner: {
        name: '李明',
        title: '农庄负责人',
        experience: '有机种植专家',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80'
      }
    },
    {
      id: 3,
      name: '绿源果蔬合作社',
      type: '果蔬种植基地',
      location: '山东省潍坊市',
      area: '800亩',
      crops: ['草莓', '西红柿', '黄瓜'],
      image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80',
      results: {
        quality: { label: '产品合格率', value: 25, unit: '%', trend: 'up' },
        profit: { label: '经济效益提升', value: 32, unit: '%', trend: 'up' }
      },
      owner: {
        name: '王芳',
        title: '合作社负责人',
        experience: '农业技术推广员',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80'
      }
    }
  ],

  // API配置
  api: {
    baseUrl: 'https://api.smartagri.ai',
    endpoints: {
      recognition: '/api/v1/recognition',
      prediction: '/api/v1/prediction',
      analytics: '/api/v1/analytics',
      cases: '/api/v1/cases'
    },
    timeout: 30000,
    retryAttempts: 3
  },

  // 功能模块配置
  features: [
    {
      id: 'recognition',
      title: 'AI病虫害精准识别',
      description: '基于深度学习图像识别技术，毫秒级匹配病虫害特征库，同步推送科学防治方案。',
      icon: 'fa-microscope',
      color: 'from-primary to-tertiary',
      actionText: '开始识别',
      actionColor: 'tertiary'
    },
    {
      id: 'prediction',
      title: '农业风险智能预测',
      description: '整合气象、土壤、历史病害数据，AI模型提前7-15天预警风险，辅助科学决策。',
      icon: 'fa-line-chart',
      color: 'from-secondary to-blue-400',
      actionText: '查看预测',
      actionColor: 'secondary'
    },
    {
      id: 'management',
      title: '数字化农厂全流程管理',
      description: '从种植规划到收获仓储，全环节数据化监控、优化，提升生产效率与管理水平。',
      icon: 'fa-building',
      color: 'from-tertiary to-green-400',
      actionText: '进入管理',
      actionColor: 'tertiary'
    }
  ],

  // 社交媒体链接
  social: {
    wechat: '#',
    weibo: '#',
    youtube: '#',
    linkedin: '#'
  },

  // 导航菜单
  navigation: [
    { id: 'hero', label: '首页', href: '#hero' },
    { id: 'features', label: '功能', href: '#features' },
    { id: 'analytics', label: '数据分析', href: '#analytics' },
    { id: 'cases', label: '案例', href: '#cases' }
  ],

  // 页面配置
  pages: {
    hero: {
      title: 'AI赋能，开启智慧农业新范式',
      subtitle: '基于深度学习技术，实现农作物病虫害精准识别、风险智能预测与农厂数字化管理，助力农业生产降本增效。',
      backgroundImage: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080&q=80',
      demoImage: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80'
    }
  }
};

// 导出配置
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AgriConfig;
} else {
  window.AgriConfig = AgriConfig;
}
