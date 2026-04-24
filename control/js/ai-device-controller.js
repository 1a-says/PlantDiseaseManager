/**
 * AI设备控制决策引擎
 * 基于多因子数据的智能启停决策
 */

class AIDeviceController {
    constructor() {
        this.dataService = null;
        this.decisionHistory = [];
        this.optimizationCache = {};
        this.init();
    }

    init() {
        // 获取数据服务
        if (typeof window !== 'undefined' && window.aiDataService) {
            this.dataService = window.aiDataService;
        }
    }

    /**
     * 决策是否启动设备
     * @param {Object} device - 设备对象
     * @param {Object} context - 上下文（风险、环境、历史等）
     * @returns {Promise<Object>} 决策结果
     */
    async makeDecision(device, context) {
        const { riskPrediction, environment, deviceHistory, cost, region } = context;
        
        // 初始化决策对象
        const decision = {
            shouldStart: false,
            confidence: 0,
            reason: '',
            urgency: 'low',
            recommendedParams: null
        };
        
        // 1. 风险因子（权重50%）
        const currentRisk = riskPrediction?.currentRisk || riskPrediction?.risk || 0.5;
        const riskTrend = riskPrediction?.trend || 'stable';
        const riskRate = riskPrediction?.rate || 0;
        
        if (currentRisk > 0.6) {
            decision.shouldStart = true;
            decision.confidence += 0.5;
            decision.reason += '高风险预警; ';
            decision.urgency = 'high';
        } else if (currentRisk > 0.4) {
            decision.confidence += 0.3;
            decision.reason += '中等风险; ';
            decision.urgency = 'medium';
        }
        
        // 2. 趋势因子（权重20%）
        if (riskTrend === 'rising' && riskRate > 0.1) {
            decision.shouldStart = true;
            decision.confidence += 0.2;
            decision.reason += '风险上升趋势明显; ';
            if (decision.urgency === 'low') {
                decision.urgency = 'medium';
            }
        } else if (riskTrend === 'falling' && riskRate < -0.05) {
            decision.confidence -= 0.1;
            decision.reason += '风险下降; ';
        }
        
        // 3. 环境因子（权重15%）
        const envScore = this.evaluateEnvironment(environment, device.type);
        if (envScore > 0.7) {
            decision.shouldStart = true;
            decision.confidence += 0.15;
            decision.reason += '环境条件适宜; ';
        } else if (envScore < 0.3) {
            decision.confidence -= 0.1;
            decision.reason += '环境条件不佳; ';
        }
        
        // 4. 历史效果因子（权重10%）
        const effectiveness = this.getHistoricalEffectiveness(deviceHistory, device);
        if (effectiveness > 0.6) {
            decision.confidence += 0.1;
            decision.reason += '历史效果良好; ';
        } else if (effectiveness < 0.4) {
            decision.confidence -= 0.05;
            decision.reason += '历史效果一般; ';
        }
        
        // 5. 成本效益因子（权重5%）
        const costBenefit = this.calculateCostBenefit(cost, riskPrediction);
        if (costBenefit > 0.8) {
            decision.confidence += 0.05;
            decision.reason += '成本效益高; ';
        } else if (costBenefit < 0.5) {
            decision.confidence -= 0.03;
            decision.reason += '成本效益一般; ';
        }
        
        // 6. 设备状态检查
        if (device.status === 'error' || device.status === 'offline') {
            decision.shouldStart = false;
            decision.confidence = 0;
            decision.reason = '设备故障或离线，无法启动; ';
            return decision;
        }
        
        // 最终决策：置信度>0.6则启动
        decision.shouldStart = decision.confidence >= 0.6;
        
        // 如果决策启动，优化设备参数
        if (decision.shouldStart) {
            decision.recommendedParams = await this.optimizeParameters(device, context);
        }
        
        // 记录决策历史
        this.recordDecision(device.id, decision, context);
        
        return decision;
    }

    /**
     * 评估环境条件
     * @param {Object} environment - 环境数据
     * @param {string} deviceType - 设备类型
     * @returns {number} 环境评分（0-1）
     */
    evaluateEnvironment(environment, deviceType) {
        if (!environment) {
            return 0.5; // 默认中等
        }
        
        let score = 0.5;
        
        // 温度评估（15-30°C为最佳）
        const temp = environment.temperature || 25;
        if (temp >= 15 && temp <= 30) {
            score += 0.2;
        } else if (temp < 10 || temp > 35) {
            score -= 0.2;
        }
        
        // 湿度评估（50-80%为最佳）
        const humidity = environment.humidity || 65;
        if (humidity >= 50 && humidity <= 80) {
            score += 0.15;
        } else if (humidity < 30 || humidity > 90) {
            score -= 0.15;
        }
        
        // 风速评估（无风或微风为佳）
        const windSpeed = environment.windSpeed || 3;
        if (windSpeed < 5) {
            score += 0.1;
        } else if (windSpeed > 8) {
            score -= 0.1;
        }
        
        // 降雨评估（无雨为佳）
        const rainfall = environment.rainfall || 0;
        if (rainfall === 0) {
            score += 0.05;
        } else if (rainfall > 5) {
            score -= 0.2;
        }
        
        // 设备类型特殊要求
        if (deviceType === 'kill-light') {
            // 杀虫灯：夜间效果好
            const hour = new Date().getHours();
            if (hour >= 18 || hour <= 6) {
                score += 0.1;
            }
        }
        
        return Math.max(0, Math.min(1, score));
    }

    /**
     * 获取历史效果
     * @param {Array} deviceHistory - 设备历史记录
     * @param {Object} device - 设备对象
     * @returns {number} 效果评分（0-1）
     */
    getHistoricalEffectiveness(deviceHistory, device) {
        if (!deviceHistory || deviceHistory.length === 0) {
            return 0.6; // 默认中等效果
        }
        
        // 计算平均效果
        const records = deviceHistory.filter(record => record.deviceId === device.id);
        if (records.length === 0) {
            return 0.6;
        }
        
        const totalEffectiveness = records.reduce((sum, record) => {
            // 基于捕获量或效果评分
            const effectiveness = record.effectiveness || 
                                 (record.todayCount > 0 ? Math.min(1, record.todayCount / 300) : 0.5);
            return sum + effectiveness;
        }, 0);
        
        return totalEffectiveness / records.length;
    }

    /**
     * 计算成本效益
     * @param {number} cost - 成本
     * @param {Object} riskPrediction - 风险预测
     * @returns {number} 成本效益比（0-1）
     */
    calculateCostBenefit(cost, riskPrediction) {
        if (!riskPrediction || cost === undefined) {
            return 0.7; // 默认中等
        }
        
        const risk = riskPrediction.currentRisk || riskPrediction.risk || 0.5;
        
        // 风险越高，效益越高
        // 成本越低，效益越高
        const riskBenefit = risk * 0.7;
        const costBenefit = Math.max(0, 1 - (cost / 200)) * 0.3;
        
        return Math.min(1, riskBenefit + costBenefit);
    }

    /**
     * 优化设备参数
     * @param {Object} device - 设备对象
     * @param {Object} context - 上下文
     * @returns {Promise<Object>} 优化后的参数
     */
    async optimizeParameters(device, context) {
        const cacheKey = `${device.id}_${Date.now() - (Date.now() % 3600000)}`; // 每小时缓存
        
        if (this.optimizationCache[cacheKey]) {
            return this.optimizationCache[cacheKey];
        }
        
        const { history, currentEnvironment, target, riskPrediction } = context;
        
        // 运行时间窗口优化
        const timeWindow = this.optimizeTimeWindow(history || [], currentEnvironment, device);
        
        // 工作强度优化
        const intensity = this.optimizeIntensity(target, currentEnvironment, riskPrediction);
        
        // 触发阈值优化
        const triggerThreshold = this.optimizeThreshold(history || [], riskPrediction);
        
        const optimizedParams = {
            timeWindow,
            intensity,
            triggerThreshold,
            duration: this.calculateOptimalDuration(riskPrediction, device)
        };
        
        this.optimizationCache[cacheKey] = optimizedParams;
        return optimizedParams;
    }

    /**
     * 优化时间窗口
     */
    optimizeTimeWindow(history, environment, device) {
        // 分析历史数据，找出效果最好的时间段
        const effectivenessByHour = {};
        
        history.forEach(record => {
            if (record.deviceId === device.id && record.time) {
                const hour = new Date(record.time).getHours();
                if (!effectivenessByHour[hour]) {
                    effectivenessByHour[hour] = { total: 0, count: 0 };
                }
                const effectiveness = record.effectiveness || 
                                     (record.todayCount > 0 ? Math.min(1, record.todayCount / 300) : 0.5);
                effectivenessByHour[hour].total += effectiveness;
                effectivenessByHour[hour].count++;
            }
        });
        
        // 找出效果最好的3-5小时作为工作时间窗口
        if (Object.keys(effectivenessByHour).length > 0) {
            const sorted = Object.entries(effectivenessByHour)
                .map(([hour, data]) => ({
                    hour: parseInt(hour),
                    avg: data.total / data.count
                }))
                .sort((a, b) => b.avg - a.avg)
                .slice(0, 4);
            
            return sorted.map(s => s.hour);
        }
        
        // 默认时间窗口（根据设备类型）
        if (device.type === 'kill-light') {
            return [18, 19, 20, 21, 22, 23, 0, 1, 2, 3, 4, 5]; // 夜间
        } else if (device.type === 'trap') {
            return [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18]; // 白天
        }
        
        return [8, 9, 10, 11, 12, 13, 14, 15, 16, 17]; // 默认白天
    }

    /**
     * 优化工作强度
     */
    optimizeIntensity(target, environment, riskPrediction) {
        const risk = riskPrediction?.currentRisk || riskPrediction?.risk || 0.5;
        
        // 风险越高，强度越高
        if (risk > 0.7) {
            return 'high'; // 高效模式
        } else if (risk > 0.4) {
            return 'medium'; // 标准模式
        } else {
            return 'low'; // 节能模式
        }
    }

    /**
     * 优化触发阈值
     */
    optimizeThreshold(history, riskPrediction) {
        // 基于历史效果和当前风险动态调整阈值
        const risk = riskPrediction?.currentRisk || riskPrediction?.risk || 0.5;
        
        // 风险高时降低阈值（更容易触发）
        if (risk > 0.7) {
            return 0.4;
        } else if (risk > 0.5) {
            return 0.5;
        } else {
            return 0.6; // 风险低时提高阈值
        }
    }

    /**
     * 计算最优运行时长
     */
    calculateOptimalDuration(riskPrediction, device) {
        const risk = riskPrediction?.currentRisk || riskPrediction?.risk || 0.5;
        
        // 基础时长
        let duration = 8; // 8小时
        
        // 风险高时延长运行时间
        if (risk > 0.7) {
            duration = 12;
        } else if (risk > 0.5) {
            duration = 10;
        }
        
        // 设备类型调整
        if (device.type === 'kill-light') {
            duration = Math.min(12, duration); // 杀虫灯最多12小时
        }
        
        return duration;
    }

    /**
     * 优化设备组合
     * @param {string} region - 区域
     * @param {Array} devices - 可用设备列表
     * @param {number} riskLevel - 风险等级
     * @returns {Object} 推荐组合
     */
    optimizeDeviceCombination(region, devices, riskLevel) {
        // 获取该区域的所有设备
        const availableDevices = devices.filter(d => d.area === region || region === 'all');
        
        // 基于风险等级推荐设备组合
        if (riskLevel > 0.7) {
            // 高风险：建议同时启用杀虫灯+诱捕器+天敌
            return {
                combination: availableDevices.filter(d => 
                    d.type === 'kill-light' || d.type === 'trap' || d.type === 'enemy'
                ).slice(0, 3),
                strategy: '全面防控',
                priority: 'high'
            };
        } else if (riskLevel > 0.4) {
            // 中风险：杀虫灯+诱捕器
            return {
                combination: availableDevices.filter(d => 
                    d.type === 'kill-light' || d.type === 'trap'
                ).slice(0, 2),
                strategy: '双重防护',
                priority: 'medium'
            };
        } else {
            // 低风险：仅诱捕器（低成本）
            return {
                combination: availableDevices.filter(d => d.type === 'trap').slice(0, 1),
                strategy: '监控模式',
                priority: 'low'
            };
        }
    }

    /**
     * 能耗优化决策
     * @param {Array} devices - 设备列表
     * @param {number} budget - 预算
     * @param {Object} risk - 风险数据
     * @returns {Object} 优化结果
     */
    optimizeEnergyConsumption(devices, budget, risk) {
        // 在预算和风险之间找平衡
        const solutions = this.generateSolutions(devices, budget, risk);
        
        // 找到最优解（成本/风险比最优）
        const optimized = solutions.reduce((best, current) => {
            const currentScore = this.evaluateSolution(current, risk);
            const bestScore = this.evaluateSolution(best, risk);
            return currentScore > bestScore ? current : best;
        });
        
        return {
            selectedDevices: optimized.devices,
            expectedCost: optimized.cost,
            expectedRisk: optimized.risk,
            efficiency: optimized.cost > 0 ? optimized.risk / optimized.cost : 0 // 风险/成本比（越小越好）
        };
    }

    /**
     * 生成解决方案
     */
    generateSolutions(devices, budget, risk) {
        const solutions = [];
        const riskLevel = risk?.currentRisk || risk?.risk || 0.5;
        
        // 方案1：全开（高风险）
        if (riskLevel > 0.7) {
            const cost = devices.reduce((sum, d) => sum + (d.costPerHour || 5), 0) * 12;
            if (cost <= budget * 1.2) {
                solutions.push({
                    devices: [...devices],
                    cost,
                    risk: riskLevel * 0.7 // 全开时风险降低30%
                });
            }
        }
        
        // 方案2：选择性价比高的设备
        const sortedDevices = [...devices].sort((a, b) => {
            const aValue = (a.effectiveness || 0.7) / (a.costPerHour || 5);
            const bValue = (b.effectiveness || 0.7) / (b.costPerHour || 5);
            return bValue - aValue;
        });
        
        let selectedDevices = [];
        let totalCost = 0;
        for (const device of sortedDevices) {
            const cost = (device.costPerHour || 5) * 10;
            if (totalCost + cost <= budget) {
                selectedDevices.push(device);
                totalCost += cost;
            }
        }
        
        if (selectedDevices.length > 0) {
            solutions.push({
                devices: selectedDevices,
                cost: totalCost,
                risk: riskLevel * (1 - selectedDevices.length * 0.1) // 每增加一个设备风险降低10%
            });
        }
        
        return solutions.length > 0 ? solutions : [{
            devices: [],
            cost: 0,
            risk: riskLevel
        }];
    }

    /**
     * 评估解决方案
     */
    evaluateSolution(solution, risk) {
        // 综合评分：效果高、成本低、风险低
        const riskReduction = (risk?.currentRisk || risk?.risk || 0.5) - solution.risk;
        const costEfficiency = solution.cost > 0 ? riskReduction / solution.cost : 0;
        const deviceCount = solution.devices.length;
        
        return riskReduction * 0.6 + costEfficiency * 100 * 0.3 + deviceCount * 0.1;
    }

    /**
     * 记录决策历史
     */
    recordDecision(deviceId, decision, context) {
        this.decisionHistory.unshift({
            deviceId,
            decision,
            context,
            timestamp: new Date().toISOString()
        });
        
        // 只保留最近100条记录
        if (this.decisionHistory.length > 100) {
            this.decisionHistory = this.decisionHistory.slice(0, 100);
        }
    }
}

// 全局实例
window.aiDeviceController = new AIDeviceController();

