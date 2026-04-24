// 系统配置文件
window.AppConfig = {
    // 系统信息
    system: {
        name: '智能防控系统',
        version: '1.0.0',
        description: '基于AI的农业病虫害智能防控管理平台'
    },

    // API配置
    api: {
        baseUrl: 'https://api.example.com',
        timeout: 10000,
        retryCount: 3
    },

    // 图片识别配置
    imageRecognition: {
        maxFileSize: 10 * 1024 * 1024, // 10MB
        allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
        analysisTimeout: 5000 // 5秒
    },

    // 设备控制配置
    deviceControl: {
        updateInterval: 5000, // 5秒更新一次
        commandTimeout: 3000, // 3秒命令超时
        maxRetries: 3
    },

    // 主题配置
    theme: {
        primaryColor: '#2E7D32',
        secondaryColor: '#4CAF50',
        successColor: '#4CAF50',
        warningColor: '#FF9800',
        errorColor: '#F44336',
        infoColor: '#2196F3'
    },

    // 病虫害数据
    diseases: {
        rice: [
            {
                name: '稻瘟病',
                subtypes: ['叶瘟', '穗瘟', '节瘟', '谷粒瘟'],
                symptoms: ['褐色病斑', '叶片枯黄', '穗部变黑'],
                medicines: [
                    {
                        name: '20% 三环唑可湿性粉剂',
                        dosage: '50克/亩',
                        method: '兑水50公斤喷雾',
                        interval: '7-10天',
                        advantage: '防效达90%，安全间隔期7天'
                    },
                    {
                        name: '40% 稻瘟灵乳油',
                        dosage: '30毫升/亩',
                        method: '兑水40公斤喷雾',
                        interval: '7天',
                        advantage: '内吸性强，持效期长'
                    }
                ]
            },
            {
                name: '稻飞虱',
                subtypes: ['褐飞虱', '白背飞虱', '灰飞虱'],
                symptoms: ['叶片发黄', '植株倒伏', '蜜露分泌'],
                medicines: [
                    {
                        name: '25% 吡蚜酮可湿性粉剂',
                        dosage: '20克/亩',
                        method: '兑水30公斤喷雾',
                        interval: '7天',
                        advantage: '高效低毒，持效期长'
                    }
                ]
            },
            {
                name: '稻纵卷叶螟',
                subtypes: ['幼虫期', '成虫期'],
                symptoms: ['叶片卷曲', '白色条斑', '叶片枯白'],
                medicines: [
                    {
                        name: '5% 甲维盐微乳剂',
                        dosage: '30毫升/亩',
                        method: '兑水40公斤喷雾',
                        interval: '7天',
                        advantage: '杀虫谱广，对鳞翅目特效'
                    }
                ]
            }
        ]
    },

    // 设备类型配置
    deviceTypes: {
        'kill-light': {
            name: '风吸式杀虫灯',
            icon: 'fas fa-lightbulb',
            description: '利用害虫趋光性进行物理防治',
            defaultPower: 100,
            maintenanceInterval: 30 // 天
        },
        'trap': {
            name: '性诱捕器',
            icon: 'fas fa-bug',
            description: '利用性信息素诱捕害虫',
            defaultPower: 95,
            maintenanceInterval: 15 // 天
        },
        'enemy': {
            name: '天敌释放器',
            icon: 'fas fa-dove',
            description: '释放天敌进行生物防治',
            defaultPower: 90,
            maintenanceInterval: 7 // 天
        }
    },

    // 区域配置
    areas: {
        east: {
            name: '东区 - 蔬菜棚',
            color: '#4CAF50',
            devices: ['kill-light-1', 'trap-1']
        },
        west: {
            name: '西区 - 果园',
            color: '#FF9800',
            devices: ['kill-light-2', 'trap-2']
        },
        north: {
            name: '北区 - 水稻田',
            color: '#2196F3',
            devices: ['kill-light-3', 'enemy-1']
        },
        south: {
            name: '南区 - 玉米地',
            color: '#9C27B0',
            devices: ['kill-light-4', 'trap-3', 'enemy-2']
        }
    },

    // 通知配置
    notifications: {
        duration: 3000, // 3秒
        position: 'top-right',
        maxVisible: 5
    },

    // 本地存储配置
    storage: {
        prefix: 'smart_control_',
        keys: {
            userPreferences: 'user_preferences',
            deviceStates: 'device_states',
            analysisHistory: 'analysis_history'
        }
    },

    // 调试配置
    debug: {
        enabled: false,
        logLevel: 'info', // debug, info, warn, error
        showPerformance: false
    }
};

// 工具函数
window.AppUtils = {
    // 获取配置
    getConfig: (path) => {
        return path.split('.').reduce((obj, key) => obj?.[key], window.AppConfig);
    },

    // 设置配置
    setConfig: (path, value) => {
        const keys = path.split('.');
        const lastKey = keys.pop();
        const target = keys.reduce((obj, key) => {
            if (!obj[key]) obj[key] = {};
            return obj[key];
        }, window.AppConfig);
        target[lastKey] = value;
    },

    // 本地存储
    storage: {
        set: (key, value) => {
            try {
                const fullKey = window.AppConfig.storage.prefix + key;
                localStorage.setItem(fullKey, JSON.stringify(value));
                return true;
            } catch (e) {
                console.error('Storage set error:', e);
                return false;
            }
        },

        get: (key, defaultValue = null) => {
            try {
                const fullKey = window.AppConfig.storage.prefix + key;
                const value = localStorage.getItem(fullKey);
                return value ? JSON.parse(value) : defaultValue;
            } catch (e) {
                console.error('Storage get error:', e);
                return defaultValue;
            }
        },

        remove: (key) => {
            try {
                const fullKey = window.AppConfig.storage.prefix + key;
                localStorage.removeItem(fullKey);
                return true;
            } catch (e) {
                console.error('Storage remove error:', e);
                return false;
            }
        }
    },

    // 日志记录
    log: {
        debug: (message, ...args) => {
            if (window.AppConfig.debug.enabled && window.AppConfig.debug.logLevel === 'debug') {
                console.debug(`[DEBUG] ${message}`, ...args);
            }
        },

        info: (message, ...args) => {
            if (window.AppConfig.debug.enabled && ['debug', 'info'].includes(window.AppConfig.debug.logLevel)) {
                console.info(`[INFO] ${message}`, ...args);
            }
        },

        warn: (message, ...args) => {
            if (window.AppConfig.debug.enabled && ['debug', 'info', 'warn'].includes(window.AppConfig.debug.logLevel)) {
                console.warn(`[WARN] ${message}`, ...args);
            }
        },

        error: (message, ...args) => {
            console.error(`[ERROR] ${message}`, ...args);
        }
    }
};







