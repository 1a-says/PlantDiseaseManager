/**
 * AI数据服务 - 连接prediction系统的API和数据处理
 * 提供统一的数据接口供AI模块使用
 */

class AIDataService {
    constructor(baseURL = 'http://localhost:5000/api') {
        this.baseURL = baseURL;
        this.apiClient = null;
        this.isConnected = false;
        this.cache = {
            prediction: null,
            environment: null,
            risk: null,
            lastUpdate: 0
        };
        this.cacheTimeout = 30000; // 30秒缓存
        this.init();
    }

    init() {
        // 初始化API客户端（从prediction系统）
        // 等待APIClient加载
        setTimeout(() => {
            if (typeof window !== 'undefined' && window.APIClient) {
                this.apiClient = new window.APIClient(this.baseURL);
                console.log('AI数据服务已连接到prediction API');
            } else if (typeof APIClient !== 'undefined') {
                this.apiClient = new APIClient(this.baseURL);
                console.log('AI数据服务已连接到prediction API');
            } else {
                console.warn('APIClient未找到，将使用fallback数据');
                // 创建一个简单的fallback客户端
                const self = this;
                this.apiClient = {
                    async getPrediction(data, days) {
                        return self._generateFallbackPrediction(data, days);
                    }
                };
            }
        }, 500);
        
        // 定期更新数据
        setInterval(() => {
            this.refreshData();
        }, 60000); // 每分钟更新一次
    }

    /**
     * 刷新数据
     */
    async refreshData() {
        try {
            // 获取预测数据
            const predictionData = await this.getPredictionData();
            if (predictionData) {
                this.cache.prediction = predictionData;
                this.cache.lastUpdate = Date.now();
            }
        } catch (error) {
            console.warn('刷新数据失败:', error);
        }
    }

    /**
     * 获取预测数据
     * @param {number} days - 预测天数
     * @returns {Promise<Object>} 预测结果
     */
    async getPredictionData(days = 7) {
        try {
            const now = Date.now();
            
            // 检查缓存
            if (this.cache.prediction && (now - this.cache.lastUpdate) < this.cacheTimeout) {
                return this.cache.prediction;
            }

            // 构建请求数据
            const requestData = {
                environment: await this.getEnvironmentData(),
                riskData: await this.getRiskData(),
                historyData: await this.getHistoryData(),
                days: days
            };

            // 调用API
            if (this.apiClient && typeof this.apiClient.getPrediction === 'function') {
                const result = await this.apiClient.getPrediction(requestData, days);
                
                if (result && result.success) {
                    this.cache.prediction = result;
                    this.cache.lastUpdate = now;
                    return result;
                }
            }
            
            // 如果API不可用，生成fallback数据
            console.warn('API不可用，使用fallback数据');
            const fallbackResult = this._generateFallbackPrediction(requestData, days);
            this.cache.prediction = fallbackResult;
            this.cache.lastUpdate = now;
            return fallbackResult;
        } catch (error) {
            console.error('获取预测数据失败:', error);
            // 返回fallback数据
            return this._generateFallbackPrediction(
                { environment: {}, riskData: {}, historyData: [] },
                days
            );
        }
    }
    
    /**
     * 生成fallback预测数据（当API不可用时）
     */
    _generateFallbackPrediction(data, days) {
        const predictions = [];
        for (let i = 0; i < days; i++) {
            predictions.push({
                day: i + 1,
                risk: 0.3 + Math.random() * 0.4,
                confidence: 0.8 + Math.random() * 0.15,
                timestamp: new Date(Date.now() + (i + 1) * 24 * 60 * 60 * 1000).toISOString()
            });
        }
        
        return {
            success: true,
            timestamp: new Date().toISOString(),
            predictions: {
                model_type: 'Fallback',
                predictions: predictions,
                total_days: days
            },
            fields_predictions: []
        };
    }

    /**
     * 获取环境数据（优化：立即返回，快速）
     * @returns {Promise<Object>} 环境数据
     */
    async getEnvironmentData() {
        // 立即返回默认值，不等待任何异步操作
        const defaultEnv = {
            temperature: 25.0,
            humidity: 65.0,
            windSpeed: 3.0,
            rainfall: 0.0,
            basicData: {
                soilTemperature: 22.5,
                soilMoisture: 18.0,
                leafMoisture: 0.0,
                waterlogging: 0.0,
                cropGrowth: 70.0
            }
        };
        
        try {
            // 尝试从prediction系统获取（同步调用，快速）
            if (typeof window !== 'undefined' && window.unifiedDataManager) {
                const envData = window.unifiedDataManager.getEnvironmentData();
                if (envData && typeof envData === 'object') {
                    // 合并数据，确保所有字段都存在
                    return {
                        ...defaultEnv,
                        ...envData,
                        basicData: {
                            ...defaultEnv.basicData,
                            ...(envData.basicData || {})
                        }
                    };
                }
            }
        } catch (error) {
            // 忽略错误，使用默认值
        }

        // 立即返回默认值（不等待）
        return defaultEnv;
    }

    /**
     * 获取风险数据
     * @returns {Promise<Object>} 风险数据
     */
    async getRiskData() {
        try {
            // 尝试从prediction系统获取
            if (typeof window !== 'undefined' && window.unifiedDataManager) {
                const riskData = window.unifiedDataManager.getRiskData();
                if (riskData) {
                    return riskData;
                }
            }

            // 备用：从FieldData获取
            if (typeof FieldData !== 'undefined') {
                const fields = FieldData.getAllFields();
                return {
                    fields: fields.map(field => ({
                        id: field.id,
                        name: field.name,
                        currentRisk: field.risk || field.currentRisk || 0.3,
                        crop: field.crop,
                        pest: field.pest,
                        area: field.area
                    }))
                };
            }

            // 最后备用：空数据
            return { fields: [] };
        } catch (error) {
            console.warn('获取风险数据失败:', error);
            return { fields: [] };
        }
    }

    /**
     * 获取历史数据
     * @returns {Promise<Array>} 历史数据
     */
    async getHistoryData() {
        try {
            // 尝试从prediction系统获取
            if (typeof window !== 'undefined' && window.unifiedDataManager) {
                const historyData = window.unifiedDataManager.getHistoryData();
                if (historyData && historyData.length > 0) {
                    return historyData;
                }
            }

            // 备用：空数组
            return [];
        } catch (error) {
            console.warn('获取历史数据失败:', error);
            return [];
        }
    }

    /**
     * 获取特定田地的风险预测
     * @param {string} fieldId - 田地ID
     * @param {number} day - 预测天数（1-7）
     * @returns {Promise<Object|null>} 预测结果
     */
    async getFieldPrediction(fieldId, day = 1) {
        try {
            const predictionData = await this.getPredictionData(7);
            
            if (!predictionData || !predictionData.fields_predictions) {
                return null;
            }

            // 查找特定田地的预测
            const fieldPrediction = predictionData.fields_predictions.find(
                fp => fp.field_id === fieldId
            );

            if (!fieldPrediction || !fieldPrediction.predictions) {
                return null;
            }

            // 返回指定天数的预测
            const dayIndex = day - 1;
            if (dayIndex >= 0 && dayIndex < fieldPrediction.predictions.length) {
                return {
                    risk: fieldPrediction.predictions[dayIndex],
                    confidence: predictionData.predictions?.predictions?.[dayIndex]?.confidence || 0.85,
                    day: day
                };
            }

            return null;
        } catch (error) {
            console.error('获取田地预测失败:', error);
            return null;
        }
    }

    /**
     * 获取未来几天的天气预报（基于环境数据预测）
     * @param {number} days - 预测天数
     * @returns {Promise<Array>} 天气预报数组
     */
    async getWeatherForecast(days = 7) {
        try {
            const predictionData = await this.getPredictionData(days);
            const environment = await this.getEnvironmentData();
            
            if (!predictionData || !predictionData.predictions) {
                // 基于当前环境数据生成简单预测
                return this.generateSimpleForecast(environment, days);
            }

            // 从预测数据中提取天气预报信息
            const forecast = [];
            const predictions = predictionData.predictions.predictions || [];

            predictions.forEach((pred, index) => {
                forecast.push({
                    day: pred.day || (index + 1),
                    temperature: this.estimateTemperature(environment.temperature, index),
                    humidity: this.estimateHumidity(environment.humidity, index),
                    rainfall: this.estimateRainfall(pred.risk, index),
                    windSpeed: this.estimateWindSpeed(environment.windSpeed, index),
                    risk: pred.risk || 0.3
                });
            });

            return forecast;
        } catch (error) {
            console.error('获取天气预报失败:', error);
            return this.generateSimpleForecast(await this.getEnvironmentData(), days);
        }
    }

    /**
     * 生成简单的天气预报（备用）
     */
    generateSimpleForecast(currentEnv, days) {
        const forecast = [];
        for (let i = 0; i < days; i++) {
            forecast.push({
                day: i + 1,
                temperature: currentEnv.temperature + (Math.random() - 0.5) * 4,
                humidity: currentEnv.humidity + (Math.random() - 0.5) * 10,
                rainfall: Math.random() < 0.2 ? Math.random() * 5 : 0,
                windSpeed: currentEnv.windSpeed + (Math.random() - 0.5) * 2,
                risk: 0.3 + Math.random() * 0.4
            });
        }
        return forecast;
    }

    /**
     * 估算温度（基于当前温度和风险）
     */
    estimateTemperature(currentTemp, dayOffset) {
        // 简单的温度变化模型（昼夜变化）
        const dailyVariation = 6 * Math.sin((dayOffset * 2 * Math.PI) / 7);
        return currentTemp + dailyVariation;
    }

    /**
     * 估算湿度
     */
    estimateHumidity(currentHumidity, dayOffset) {
        // 基于风险值的湿度变化
        const variation = (Math.random() - 0.5) * 15;
        return Math.max(30, Math.min(90, currentHumidity + variation));
    }

    /**
     * 估算降雨
     */
    estimateRainfall(risk, dayOffset) {
        // 高风险时降雨概率增加
        if (risk > 0.6 && Math.random() < 0.3) {
            return Math.random() * 8;
        }
        return Math.random() < 0.15 ? Math.random() * 5 : 0;
    }

    /**
     * 估算风速
     */
    estimateWindSpeed(currentWindSpeed, dayOffset) {
        return Math.max(0, currentWindSpeed + (Math.random() - 0.5) * 3);
    }

    /**
     * 获取田地信息
     * @param {string} fieldId - 田地ID
     * @returns {Object|null} 田地信息
     */
    getFieldInfo(fieldId) {
        if (typeof FieldData !== 'undefined') {
            return FieldData.getFieldById(fieldId);
        }
        return null;
    }

    /**
     * 获取历史用药记录（模拟）
     * @param {string} fieldId - 田地ID
     * @returns {Array} 历史记录
     */
    getHistoryRecords(fieldId) {
        // 模拟历史用药记录
        return [
            {
                date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
                medicine: '5% 甲维盐微乳剂',
                dosage: '30ml/亩',
                effect: '良好',
                cost: 120
            },
            {
                date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
                medicine: '20% 氯虫苯甲酰胺悬浮剂',
                dosage: '25ml/亩',
                effect: '良好',
                cost: 150
            }
        ];
    }
}

// 全局实例
window.aiDataService = new AIDataService();

