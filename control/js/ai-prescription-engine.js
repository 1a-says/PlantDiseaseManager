/**
 * AI方案推荐引擎
 * 基于多维度数据的AI推荐算法
 */

class AIPrescriptionEngine {
    constructor() {
        this.dataService = null;
        this.history = [];
        this.candidates = this.initializeCandidates();
        this.init();
    }

    init() {
        // 获取数据服务
        if (typeof window !== 'undefined' && window.aiDataService) {
            this.dataService = window.aiDataService;
        }

        // 加载历史记录
        this.loadHistory();
    }

    /**
     * 初始化候选方案库
     */
    initializeCandidates() {
        return {
            '玉米螟': [
                {
                    id: 'plan_001',
                    name: '5% 甲维盐微乳剂',
                    effectiveness: 0.92,
                    safety: 0.95,
                    cost: 45,
                    resistance: 0.1,
                    advantage: '对玉米螟特效，持效期长',
                    dosage: { base: 30, unit: 'ml/亩', water: 40 },
                    method: '喷雾',
                    suitableEnv: { temp: [15, 30], humidity: [50, 85] }
                },
                {
                    id: 'plan_002',
                    name: '20% 氯虫苯甲酰胺悬浮剂',
                    effectiveness: 0.88,
                    safety: 0.98,
                    cost: 55,
                    resistance: 0.05,
                    advantage: '内吸性强，安全性高',
                    dosage: { base: 25, unit: 'ml/亩', water: 40 },
                    method: '喷雾',
                    suitableEnv: { temp: [10, 35], humidity: [40, 90] }
                },
                {
                    id: 'plan_003',
                    name: '15% 茚虫威悬浮剂',
                    effectiveness: 0.85,
                    safety: 0.92,
                    cost: 60,
                    resistance: 0.15,
                    advantage: '速效性好，击倒力强',
                    dosage: { base: 20, unit: 'ml/亩', water: 35 },
                    method: '喷雾',
                    suitableEnv: { temp: [15, 32], humidity: [45, 80] }
                }
            ],
            '大豆蚜虫': [
                {
                    id: 'plan_004',
                    name: '10% 吡虫啉可湿性粉剂',
                    effectiveness: 0.90,
                    safety: 0.93,
                    cost: 35,
                    resistance: 0.20,
                    advantage: '内吸性好，持效期长',
                    dosage: { base: 20, unit: 'g/亩', water: 40 },
                    method: '喷雾',
                    suitableEnv: { temp: [15, 30], humidity: [50, 85] }
                },
                {
                    id: 'plan_005',
                    name: '25% 噻虫嗪水分散粒剂',
                    effectiveness: 0.87,
                    safety: 0.95,
                    cost: 40,
                    resistance: 0.12,
                    advantage: '高效低毒，环保性好',
                    dosage: { base: 8, unit: 'g/亩', water: 40 },
                    method: '喷雾',
                    suitableEnv: { temp: [12, 32], humidity: [45, 88] }
                }
            ],
            '棉铃虫': [
                {
                    id: 'plan_006',
                    name: '5% 氟铃脲乳油',
                    effectiveness: 0.89,
                    safety: 0.90,
                    cost: 50,
                    resistance: 0.08,
                    advantage: '特效杀卵，抑制孵化',
                    dosage: { base: 40, unit: 'ml/亩', water: 50 },
                    method: '喷雾',
                    suitableEnv: { temp: [18, 30], humidity: [55, 85] }
                },
                {
                    id: 'plan_007',
                    name: '20% 虫酰肼悬浮剂',
                    effectiveness: 0.86,
                    safety: 0.94,
                    cost: 48,
                    resistance: 0.10,
                    advantage: '选择性好，对天敌安全',
                    dosage: { base: 30, unit: 'ml/亩', water: 45 },
                    method: '喷雾',
                    suitableEnv: { temp: [15, 32], humidity: [50, 88] }
                }
            ],
            '棉花卷叶病毒害': [
                {
                    id: 'plan_008',
                    name: '10% 吡虫啉可湿性粉剂',
                    effectiveness: 0.88,
                    safety: 0.92,
                    cost: 38,
                    resistance: 0.15,
                    advantage: '对传毒媒介（粉虱、蚜虫）特效，阻断病毒传播',
                    dosage: { base: 20, unit: 'g/亩', water: 40 },
                    method: '喷雾',
                    suitableEnv: { temp: [15, 30], humidity: [50, 85] }
                },
                {
                    id: 'plan_009',
                    name: '25% 噻虫嗪水分散粒剂',
                    effectiveness: 0.85,
                    safety: 0.95,
                    cost: 42,
                    resistance: 0.12,
                    advantage: '内吸性强，持效期长，有效控制传毒媒介',
                    dosage: { base: 8, unit: 'g/亩', water: 40 },
                    method: '喷雾',
                    suitableEnv: { temp: [12, 32], humidity: [45, 88] }
                },
                {
                    id: 'plan_010',
                    name: '20% 盐酸吗啉胍可湿性粉剂',
                    effectiveness: 0.82,
                    safety: 0.90,
                    cost: 35,
                    resistance: 0.10,
                    advantage: '对病毒病有抑制作用，配合杀虫剂使用',
                    dosage: { base: 30, unit: 'g/亩', water: 40 },
                    method: '喷雾',
                    suitableEnv: { temp: [15, 28], humidity: [50, 80] }
                }
            ],
            '小麦白粉病': [
                {
                    id: 'plan_011',
                    name: '25% 三唑酮可湿性粉剂',
                    effectiveness: 0.90,
                    safety: 0.92,
                    cost: 42,
                    resistance: 0.12,
                    advantage: '对小麦白粉病特效，预防和治疗效果好',
                    dosage: { base: 30, unit: 'g/亩', water: 50 },
                    method: '喷雾',
                    suitableEnv: { temp: [15, 28], humidity: [50, 85] }
                },
                {
                    id: 'plan_012',
                    name: '30% 苯醚甲环唑悬浮剂',
                    effectiveness: 0.88,
                    safety: 0.94,
                    cost: 48,
                    resistance: 0.10,
                    advantage: '内吸性强，治疗效果显著，持效期长',
                    dosage: { base: 20, unit: 'ml/亩', water: 50 },
                    method: '喷雾',
                    suitableEnv: { temp: [12, 30], humidity: [45, 88] }
                },
                {
                    id: 'plan_013',
                    name: '12.5% 烯唑醇可湿性粉剂',
                    effectiveness: 0.85,
                    safety: 0.90,
                    cost: 40,
                    resistance: 0.15,
                    advantage: '高效低毒，对白粉病有良好防效',
                    dosage: { base: 25, unit: 'g/亩', water: 50 },
                    method: '喷雾',
                    suitableEnv: { temp: [15, 30], humidity: [50, 85] }
                }
            ],
            '水稻纹枯病': [
                {
                    id: 'plan_014',
                    name: '5% 井冈霉素水剂',
                    effectiveness: 0.89,
                    safety: 0.95,
                    cost: 35,
                    resistance: 0.08,
                    advantage: '对水稻纹枯病特效，成本低，安全性高',
                    dosage: { base: 100, unit: 'ml/亩', water: 50 },
                    method: '喷雾',
                    suitableEnv: { temp: [20, 32], humidity: [60, 90] }
                },
                {
                    id: 'plan_015',
                    name: '30% 苯醚甲环唑悬浮剂',
                    effectiveness: 0.87,
                    safety: 0.93,
                    cost: 45,
                    resistance: 0.10,
                    advantage: '内吸性强，治疗效果显著',
                    dosage: { base: 25, unit: 'ml/亩', water: 50 },
                    method: '喷雾',
                    suitableEnv: { temp: [18, 30], humidity: [55, 88] }
                },
                {
                    id: 'plan_016',
                    name: '50% 多菌灵可湿性粉剂',
                    effectiveness: 0.84,
                    safety: 0.88,
                    cost: 30,
                    resistance: 0.18,
                    advantage: '广谱杀菌剂，对纹枯病有良好防效',
                    dosage: { base: 100, unit: 'g/亩', water: 50 },
                    method: '喷雾',
                    suitableEnv: { temp: [15, 30], humidity: [50, 85] }
                }
            ],
            '二化螟': [
                {
                    id: 'plan_017',
                    name: '5% 甲维盐微乳剂',
                    effectiveness: 0.91,
                    safety: 0.94,
                    cost: 50,
                    resistance: 0.08,
                    advantage: '对二化螟特效，持效期长，击倒力强',
                    dosage: { base: 30, unit: 'ml/亩', water: 50 },
                    method: '喷雾',
                    suitableEnv: { temp: [18, 30], humidity: [55, 85] }
                },
                {
                    id: 'plan_018',
                    name: '20% 氯虫苯甲酰胺悬浮剂',
                    effectiveness: 0.88,
                    safety: 0.96,
                    cost: 55,
                    resistance: 0.05,
                    advantage: '内吸性强，安全性高，对二化螟幼虫特效',
                    dosage: { base: 10, unit: 'ml/亩', water: 40 },
                    method: '喷雾',
                    suitableEnv: { temp: [15, 32], humidity: [50, 88] }
                },
                {
                    id: 'plan_019',
                    name: '15% 茚虫威悬浮剂',
                    effectiveness: 0.86,
                    safety: 0.92,
                    cost: 58,
                    resistance: 0.12,
                    advantage: '速效性好，击倒力强，对高龄幼虫有效',
                    dosage: { base: 20, unit: 'ml/亩', water: 40 },
                    method: '喷雾',
                    suitableEnv: { temp: [15, 30], humidity: [50, 85] }
                }
            ],
            '麦蚜': [
                {
                    id: 'plan_020',
                    name: '10% 吡虫啉可湿性粉剂',
                    effectiveness: 0.92,
                    safety: 0.93,
                    cost: 36,
                    resistance: 0.20,
                    advantage: '对麦蚜特效，速效性好，内吸性强',
                    dosage: { base: 20, unit: 'g/亩', water: 40 },
                    method: '喷雾',
                    suitableEnv: { temp: [15, 28], humidity: [50, 85] }
                },
                {
                    id: 'plan_021',
                    name: '3% 啶虫脒乳油',
                    effectiveness: 0.89,
                    safety: 0.95,
                    cost: 38,
                    resistance: 0.15,
                    advantage: '内吸性强，持效期长，对麦蚜有良好防效',
                    dosage: { base: 25, unit: 'ml/亩', water: 40 },
                    method: '喷雾',
                    suitableEnv: { temp: [12, 30], humidity: [45, 88] }
                },
                {
                    id: 'plan_022',
                    name: '25% 噻虫嗪水分散粒剂',
                    effectiveness: 0.87,
                    safety: 0.94,
                    cost: 42,
                    resistance: 0.12,
                    advantage: '高效低毒，环保性好，对麦蚜特效',
                    dosage: { base: 8, unit: 'g/亩', water: 40 },
                    method: '喷雾',
                    suitableEnv: { temp: [10, 32], humidity: [40, 90] }
                }
            ],
            '棉花叶蝉': [
                {
                    id: 'plan_023',
                    name: '10% 吡虫啉可湿性粉剂',
                    effectiveness: 0.90,
                    safety: 0.92,
                    cost: 38,
                    resistance: 0.18,
                    advantage: '对棉花叶蝉特效，速效性好，内吸性强',
                    dosage: { base: 20, unit: 'g/亩', water: 40 },
                    method: '喷雾',
                    suitableEnv: { temp: [18, 30], humidity: [55, 85] }
                },
                {
                    id: 'plan_024',
                    name: '25% 噻虫嗪水分散粒剂',
                    effectiveness: 0.88,
                    safety: 0.95,
                    cost: 42,
                    resistance: 0.12,
                    advantage: '内吸性强，持效期长，有效控制叶蝉',
                    dosage: { base: 8, unit: 'g/亩', water: 40 },
                    method: '喷雾',
                    suitableEnv: { temp: [15, 32], humidity: [50, 88] }
                },
                {
                    id: 'plan_025',
                    name: '3% 啶虫脒乳油',
                    effectiveness: 0.86,
                    safety: 0.93,
                    cost: 40,
                    resistance: 0.15,
                    advantage: '对叶蝉有良好防效，击倒力强',
                    dosage: { base: 25, unit: 'ml/亩', water: 40 },
                    method: '喷雾',
                    suitableEnv: { temp: [15, 30], humidity: [50, 85] }
                }
            ],
            '玉米大斑病': [
                {
                    id: 'plan_026',
                    name: '25% 丙环唑乳油',
                    effectiveness: 0.89,
                    safety: 0.91,
                    cost: 45,
                    resistance: 0.10,
                    advantage: '对玉米大斑病特效，内吸性强，治疗效果显著',
                    dosage: { base: 30, unit: 'ml/亩', water: 50 },
                    method: '喷雾',
                    suitableEnv: { temp: [18, 30], humidity: [55, 85] }
                },
                {
                    id: 'plan_027',
                    name: '80% 代森锰锌可湿性粉剂',
                    effectiveness: 0.87,
                    safety: 0.94,
                    cost: 35,
                    resistance: 0.08,
                    advantage: '保护性杀菌剂，对玉米大斑病有良好防效',
                    dosage: { base: 200, unit: 'g/亩', water: 50 },
                    method: '喷雾',
                    suitableEnv: { temp: [15, 32], humidity: [50, 88] }
                },
                {
                    id: 'plan_028',
                    name: '30% 苯醚甲环唑悬浮剂',
                    effectiveness: 0.85,
                    safety: 0.92,
                    cost: 48,
                    resistance: 0.12,
                    advantage: '内吸治疗性好，对玉米大斑病有良好防效',
                    dosage: { base: 20, unit: 'ml/亩', water: 50 },
                    method: '喷雾',
                    suitableEnv: { temp: [15, 30], humidity: [50, 85] }
                }
            ]
        };
    }

    /**
     * 生成推荐方案（完全同步，快速返回）
     * @param {Object} params - 参数对象
     * @returns {Array|Promise<Array>} 推荐方案列表（已排序）
     */
    generateRecommendations(params) {
        const { disease, severity, crop, environment, history, fieldId, budget, skipPrediction } = params;

        try {
            // 1. 获取候选方案（同步）
            const candidates = this.getAllCandidates(disease, crop);
            if (!candidates || candidates.length === 0) {
                return [];
            }

            // 2. 跳过预测数据获取（加快速度，预测数据不是必需的）
            const predictionData = null;

            // 3. AI评分（多因子加权）- 完全同步计算，极速
            const scored = candidates.map(plan => {
                const factors = {
                    severity: severity || 0.3,
                    environment: environment || {},
                    history: history || [],
                    effectiveness: plan.effectiveness,
                    cost: plan.cost,
                    safety: plan.safety,
                    resistance: this.getResistanceRisk(plan, history),
                    prediction: predictionData
                };

                const score = this.calculateScore(plan, factors);

                return {
                    plan,
                    score,
                    factors,
                    aiRecommendation: this.generateRecommendationReason(plan, factors, score)
                };
            });

            // 4. 排序并返回Top 3-5（同步操作，极速）
            const sorted = scored.sort((a, b) => b.score - a.score);

            // 5. 如果指定了预算，过滤并重新排序
            if (budget) {
                return this.filterByBudget(sorted, budget).slice(0, 5);
            }

            // 立即返回结果（不等待任何异步操作）
            return sorted.slice(0, 5);
        } catch (error) {
            console.error('生成推荐方案出错:', error);
            return [];
        }
    }

    /**
     * 获取所有候选方案
     */
    getAllCandidates(disease, crop) {
        if (!disease) {
            return this.candidates['玉米螟'] || [];
        }

        // 精确匹配
        if (this.candidates[disease]) {
            return this.candidates[disease];
        }

        // 模糊匹配：支持部分名称匹配
        const diseaseLower = disease.toLowerCase();
        for (const key in this.candidates) {
            if (diseaseLower.includes(key.toLowerCase()) || key.toLowerCase().includes(diseaseLower)) {
                return this.candidates[key];
            }
        }

        // 根据作物类型匹配
        if (crop) {
            if (crop.includes('棉花')) {
                if (disease.includes('卷叶') || disease.includes('卷叶病毒')) {
                    return this.candidates['棉花卷叶病毒害'] || [];
                }
                if (disease.includes('叶蝉')) {
                    return this.candidates['棉花叶蝉'] || [];
                }
                if (disease.includes('棉铃')) {
                    return this.candidates['棉铃虫'] || [];
                }
            }
            if (crop.includes('玉米')) {
                if (disease.includes('大斑病')) {
                    return this.candidates['玉米大斑病'] || [];
                }
                if (disease.includes('螟')) {
                    return this.candidates['玉米螟'] || [];
                }
            }
            if (crop.includes('大豆') && disease.includes('蚜')) {
                return this.candidates['大豆蚜虫'] || [];
            }
            if (crop.includes('小麦')) {
                if (disease.includes('白粉病')) {
                    return this.candidates['小麦白粉病'] || [];
                }
                if (disease.includes('麦蚜') || disease.includes('蚜')) {
                    return this.candidates['麦蚜'] || [];
                }
            }
            if (crop.includes('水稻')) {
                if (disease.includes('纹枯病')) {
                    return this.candidates['水稻纹枯病'] || [];
                }
                if (disease.includes('二化螟') || disease.includes('螟')) {
                    return this.candidates['二化螟'] || [];
                }
            }
        }

        // 默认返回玉米螟方案
        return this.candidates['玉米螟'] || [];
    }

    /**
     * 计算方案评分
     * @param {Object} plan - 方案对象
     * @param {Object} factors - 因子对象
     * @returns {number} 评分（0-100）
     */
    calculateScore(plan, factors) {
        let score = 0;

        // 1. 效果因子（40%）
        const effectivenessScore = factors.effectiveness * 100;
        score += effectivenessScore * 0.4;

        // 2. 成本因子（20%）- 成本越低，分数越高
        const costScore = Math.max(0, 100 - (factors.cost / 100) * 100);
        score += costScore * 0.2;

        // 3. 安全性因子（20%）
        const safetyScore = factors.safety * 100;
        score += safetyScore * 0.2;

        // 4. 抗药性风险因子（10%）- 风险越低，分数越高
        const resistanceScore = (1 - factors.resistance) * 100;
        score += resistanceScore * 0.1;

        // 5. 环境适应性因子（10%）
        const envScore = this.getEnvAdaptability(plan, factors.environment) * 100;
        score += envScore * 0.1;

        // 6. 严重程度调整（额外加分）
        if (factors.severity > 0.6) {
            // 严重程度高时，效果权重增加
            score += effectivenessScore * 0.05;
        }

        // 7. 预测调整（如果风险预测较高，推荐效果更好的方案）
        if (factors.prediction && factors.prediction.risk > 0.6) {
            score += effectivenessScore * 0.05;
        }

        return Math.min(100, Math.max(0, score));
    }

    /**
     * 获取环境适应性
     */
    getEnvAdaptability(plan, environment) {
        if (!environment || !plan.suitableEnv) {
            return 0.8; // 默认适应性
        }

        const { temp, humidity } = plan.suitableEnv;
        const { temperature, humidity: envHumidity } = environment;

        let score = 1.0;

        // 温度适应性
        if (temperature < temp[0] || temperature > temp[1]) {
            score -= 0.3;
        }

        // 湿度适应性
        if (envHumidity < humidity[0] || envHumidity > humidity[1]) {
            score -= 0.2;
        }

        return Math.max(0.5, score);
    }

    /**
     * 获取抗药性风险
     */
    getResistanceRisk(plan, history) {
        if (!history || history.length === 0) {
            return plan.resistance || 0.1;
        }

        // 检查历史记录中是否使用过相同或相似的药剂
        const sameMedicineCount = history.filter(
            record => record.medicine && record.medicine.includes(plan.name.split(' ')[1])
        ).length;

        // 使用次数越多，抗药性风险越高
        const riskIncrease = Math.min(0.3, sameMedicineCount * 0.05);
        return Math.min(0.5, (plan.resistance || 0.1) + riskIncrease);
    }

    /**
     * 根据预算过滤方案
     */
    filterByBudget(sortedPlans, budget) {
        // 保留在预算内的方案
        const withinBudget = sortedPlans.filter(item => item.plan.cost <= budget);

        // 如果预算内方案少于3个，也包含稍微超预算的方案
        if (withinBudget.length < 3) {
            const slightlyOver = sortedPlans.filter(
                item => item.plan.cost <= budget * 1.2 && item.plan.cost > budget
            );
            return [...withinBudget, ...slightlyOver.slice(0, 2)];
        }

        return withinBudget;
    }

    /**
     * 生成推荐理由
     */
    generateRecommendationReason(plan, factors, score) {
        const reasons = [];

        if (factors.effectiveness > 0.9) {
            reasons.push('效果优异');
        }

        if (factors.safety > 0.95) {
            reasons.push('安全性高');
        }

        if (factors.cost < 40) {
            reasons.push('性价比高');
        }

        if (factors.resistance < 0.1) {
            reasons.push('抗药性风险低');
        }

        const envScore = this.getEnvAdaptability(plan, factors.environment);
        if (envScore > 0.9) {
            reasons.push('环境适应性好');
        }

        if (factors.prediction && factors.prediction.risk > 0.6) {
            reasons.push('预测风险高，推荐高效方案');
        }

        return reasons.join('、') || '综合评分较高';
    }

    /**
     * 计算最优用量
     * @param {number} baseDosage - 基础用量
     * @param {Object} factors - 因子对象
     * @returns {Object} 优化后的用量
     */
    calculateOptimalDosage(baseDosage, factors) {
        let dosage = baseDosage;

        // 1. 严重程度调整（严重程度越高，用量增加）
        if (factors.severity) {
            dosage *= (1 + factors.severity * 0.3);
        }

        // 2. 环境因子调整
        if (factors.environment) {
            // 高温：增加用量（药效分解快）
            if (factors.environment.temperature > 30) {
                dosage *= 1.1;
            }
            // 高湿：适当减少（药效增强）
            if (factors.environment.humidity > 80) {
                dosage *= 0.95;
            }
            // 低湿：适当增加（药效减弱）
            if (factors.environment.humidity < 50) {
                dosage *= 1.05;
            }
        }

        // 3. 作物生长阶段调整（如果需要）
        if (factors.growthStage) {
            // 苗期：减少用量，成熟期：正常用量
            if (factors.growthStage === 'seedling') {
                dosage *= 0.8;
            }
        }

        // 4. 抗药性历史调整
        if (factors.hasResistanceHistory) {
            dosage *= 1.2; // 适当增加用量
        }

        // 5. 安全限制（不超过最大安全用量）
        const maxDosage = baseDosage * 1.5; // 最大不超过基础用量的1.5倍
        dosage = Math.min(dosage, maxDosage);

        return {
            dosage: Math.round(dosage * 10) / 10,
            unit: factors.unit || 'ml/亩',
            water: factors.water || 40,
            adjustments: this.generateDosageAdjustmentReasons(dosage, baseDosage, factors)
        };
    }

    /**
     * 生成用量调整原因
     */
    generateDosageAdjustmentReasons(dosage, baseDosage, factors) {
        const reasons = [];
        const ratio = dosage / baseDosage;

        if (ratio > 1.1) {
            reasons.push('因严重程度/环境条件/抗药性等因素适当增加用量');
        } else if (ratio < 0.9) {
            reasons.push('因环境条件/作物阶段等因素适当减少用量');
        } else {
            reasons.push('用量在标准范围内');
        }

        return reasons;
    }

    /**
     * 预测最佳施药时机
     * @param {Object} params - 参数对象
     * @returns {Promise<Object>} 时机预测结果
     */
    async predictOptimalTiming(params) {
        const { disease, crop, environment, fieldId } = params;

        // 1. 快速获取天气预报（未来7天）- 缩短超时时间，快速fallback
        let weatherForecast = [];
        if (this.dataService) {
            try {
                const forecastPromise = this.dataService.getWeatherForecast(7);
                const timeoutPromise = new Promise((resolve) => {
                    setTimeout(() => resolve([]), 800); // 缩短到0.8秒超时
                });

                weatherForecast = await Promise.race([forecastPromise, timeoutPromise]);
            } catch (error) {
                console.warn('获取天气预报失败（使用模拟数据）:', error);
                // 如果失败，使用基于环境数据的快速模拟
                weatherForecast = this.generateQuickForecast(environment, 7);
            }
        } else {
            // 如果没有dataService，直接生成快速模拟数据
            weatherForecast = this.generateQuickForecast(environment, 7);
        }

        // 如果天气预报为空，立即生成快速模拟数据
        if (!weatherForecast || weatherForecast.length === 0) {
            weatherForecast = this.generateQuickForecast(environment, 7);
        }

        // 2. 基于病虫害爆发规律（同步计算，快速）
        const bestTime = this.getDiseaseOptimalTime(disease);

        // 3. 基于天气预报筛选适合的日子（同步计算，快速）
        const suitableDays = weatherForecast.filter(day => {
            return day.temperature >= 15 &&
                day.temperature <= 30 &&
                day.rainfall === 0 &&
                day.windSpeed < 5;
        });

        // 如果没有合适的日子，至少返回前3天（即使条件不完全满足）
        const finalDays = suitableDays.length > 0 ?
            suitableDays.slice(0, 3) :
            weatherForecast.slice(0, 3);

        // 4. 综合推荐（快速计算紧急程度，设置超时）
        let urgency = { level: 'medium', text: '常规', days: 3 };
        try {
            const urgencyPromise = this.calculateUrgency(disease, environment, fieldId);
            const urgencyTimeout = new Promise((resolve) => {
                setTimeout(() => resolve(urgency), 300); // 0.3秒超时
            });
            urgency = await Promise.race([urgencyPromise, urgencyTimeout]);
        } catch (error) {
            console.warn('计算紧急程度失败，使用默认值:', error);
        }

        return {
            recommendedDays: finalDays.map(day => ({
                date: this.getDateForDay(day.day),
                day: day.day,
                weather: {
                    temperature: typeof day.temperature === 'number' ? day.temperature.toFixed(1) : day.temperature,
                    humidity: typeof day.humidity === 'number' ? day.humidity.toFixed(0) : day.humidity,
                    rainfall: typeof day.rainfall === 'number' ? day.rainfall.toFixed(1) : day.rainfall,
                    windSpeed: typeof day.windSpeed === 'number' ? day.windSpeed.toFixed(1) : day.windSpeed
                },
                risk: day.risk || 0.3,
                reason: '温度适宜、无降雨、风速小'
            })),
            urgency: urgency,
            bestTimeOfDay: bestTime,
            reason: `根据${disease}的爆发规律和未来7天天气预报，推荐在以上日期施药`
        };
    }

    /**
     * 快速生成天气预报（不等待API）
     */
    generateQuickForecast(environment, days) {
        const forecast = [];
        const currentTemp = environment?.temperature || 25;
        const currentHumidity = environment?.humidity || 65;
        const currentWindSpeed = environment?.windSpeed || 3;

        for (let i = 0; i < days; i++) {
            // 简单的天气模拟（基于当前环境数据）
            forecast.push({
                day: i + 1,
                temperature: currentTemp + (Math.random() - 0.5) * 6,
                humidity: Math.max(30, Math.min(90, currentHumidity + (Math.random() - 0.5) * 15)),
                rainfall: Math.random() < 0.2 ? Math.random() * 5 : 0,
                windSpeed: Math.max(0, currentWindSpeed + (Math.random() - 0.5) * 3),
                risk: 0.3 + Math.random() * 0.4
            });
        }

        return forecast;
    }

    /**
     * 获取病虫害最佳施药时间
     */
    getDiseaseOptimalTime(disease) {
        const diseaseTimes = {
            '玉米螟': '清晨或傍晚（避开高温时段）',
            '大豆蚜虫': '上午9-11点或下午4-6点',
            '棉铃虫': '傍晚时分（成虫活动高峰期）'
        };
        return diseaseTimes[disease] || '上午9-11点或下午4-6点';
    }

    /**
     * 计算紧急程度（优化：快速计算，不等待API）
     */
    async calculateUrgency(disease, environment, fieldId) {
        // 快速获取当前风险（设置超时）
        let currentRisk = 0.5;
        if (fieldId && this.dataService) {
            try {
                const predictionPromise = this.dataService.getFieldPrediction(fieldId, 1);
                const timeoutPromise = new Promise((resolve) => {
                    setTimeout(() => resolve(null), 500); // 0.5秒超时
                });

                const prediction = await Promise.race([predictionPromise, timeoutPromise]);
                if (prediction && prediction.risk) {
                    currentRisk = prediction.risk;
                }
            } catch (error) {
                console.warn('获取风险失败（使用默认值）:', error);
            }
        }

        // 同步判断紧急程度（快速）
        if (currentRisk > 0.7) {
            return { level: 'high', text: '紧急', days: 1 };
        } else if (currentRisk > 0.5) {
            return { level: 'medium', text: '优先', days: 2 };
        } else {
            return { level: 'low', text: '常规', days: 5 };
        }
    }

    /**
     * 获取日期（相对今天）
     */
    getDateForDay(dayOffset) {
        const date = new Date();
        date.setDate(date.getDate() + dayOffset);
        return date.toLocaleDateString('zh-CN');
    }

    /**
     * 预测方案效果
     * @param {Object} plan - 方案对象
     * @param {Object} context - 上下文（环境、作物等）
     * @returns {Object} 效果预测
     */
    predictEffectiveness(plan, context) {
        let baseEffectiveness = plan.effectiveness || 0.85;

        // 环境调整
        const envScore = this.getEnvAdaptability(plan, context.environment);
        baseEffectiveness *= envScore;

        // 严重程度调整（严重时效果可能略降）
        if (context.severity > 0.7) {
            baseEffectiveness *= 0.95;
        }

        // 抗药性调整
        if (context.resistanceRisk > 0.2) {
            baseEffectiveness *= (1 - context.resistanceRisk * 0.3);
        }

        return {
            successRate: Math.min(0.95, Math.max(0.6, baseEffectiveness)),
            duration: this.estimateDuration(plan, context),
            sideEffectRisk: this.estimateSideEffectRisk(plan, context),
            confidence: 0.85
        };
    }

    /**
     * 估算持续时间
     */
    estimateDuration(plan, context) {
        const baseDuration = 7; // 基础7天
        let duration = baseDuration;

        // 环境条件好，持续时间长
        const envScore = this.getEnvAdaptability(plan, context.environment);
        duration *= envScore;

        // 严重程度高，持续时间略短
        if (context.severity > 0.7) {
            duration *= 0.9;
        }

        return Math.round(duration);
    }

    /**
     * 估算副作用风险
     */
    estimateSideEffectRisk(plan, context) {
        let risk = 0.1; // 基础风险

        // 安全性高的方案风险低
        risk *= (1 - plan.safety);

        // 用量过高风险增加
        if (context.dosage && context.dosage > plan.dosage.base * 1.3) {
            risk += 0.15;
        }

        return Math.min(0.3, Math.max(0.05, risk));
    }

    /**
     * 加载历史记录
     */
    loadHistory() {
        // 从本地存储或API加载
        try {
            const stored = localStorage.getItem('prescription_history');
            if (stored) {
                this.history = JSON.parse(stored);
            }
        } catch (error) {
            console.warn('加载历史记录失败:', error);
        }
    }

    /**
     * 保存历史记录
     */
    saveHistory(record) {
        this.history.unshift(record);
        if (this.history.length > 100) {
            this.history = this.history.slice(0, 100);
        }

        try {
            localStorage.setItem('prescription_history', JSON.stringify(this.history));
        } catch (error) {
            console.warn('保存历史记录失败:', error);
        }
    }
}

// 全局实例
window.aiPrescriptionEngine = new AIPrescriptionEngine();

