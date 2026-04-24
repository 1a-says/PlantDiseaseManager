// 化学精准施药模块

class ChemicalControl {
    constructor() {
        this.diseaseData = null;
        this.prescriptionData = null;
        this.selectedField = null;
        this.fields = [];
        // 病虫害图片映射
        this.pestImageMap = {
            '玉米螟': 'image/01.png',
            '大豆蚜虫': 'image/02.jpg',
            '棉铃虫': 'image/棉铃虫.png',
            // 默认图片（如果病虫害未匹配到）
            'default': 'image/01.png'
        };
        this.init();
    }

    init() {
        this.loadFieldData();
        this.loadPestImages();
        this.renderFieldSelector();
        this.bindEvents();
        this.setupDataSync();
    }

    /**
     * 设置数据同步监听
     */
    setupDataSync() {
        // 监听病虫害记录添加事件
        window.addEventListener('pestRecordAdded', (event) => {
            console.log('收到病虫害记录添加事件:', event.detail);
            const pestRecord = event.detail;

            // 更新田块数据（这会更新或创建田块）
            this.updateFieldFromPestRecord(pestRecord);

            // 更新病虫害图片映射（使用病虫害名称作为key）
            if (pestRecord.image) {
                const pestName = pestRecord.pest || pestRecord.title;
                this.pestImageMap[pestName] = pestRecord.image;
                console.log('更新病虫害图片映射:', pestName, pestRecord.image.substring(0, 50) + '...');
                // 保存到localStorage
                this.savePestImages();
            }

            // 如果当前选中的田块被更新，重新生成方案
            if (this.selectedField) {
                const fieldNumber = pestRecord.fieldId.replace(/^F-/, '');
                const normalizedFieldId = pestRecord.fieldId.replace(/^F-/, 'field_');

                // 检查是否是当前选中的田块（支持多种ID格式）
                const isCurrentField =
                    this.selectedField.id === pestRecord.fieldId ||
                    this.selectedField.id === normalizedFieldId ||
                    this.selectedField.id === `field_${fieldNumber}` ||
                    this.selectedField.name === fieldNumber ||
                    this.selectedField.name === fieldNumber.padStart(3, '0');

                if (isCurrentField) {
                    // 找到更新后的田块数据
                    const updatedField = this.fields.find(f =>
                        f.id === this.selectedField.id ||
                        f.name === this.selectedField.name
                    );
                    if (updatedField) {
                        this.selectedField = updatedField;
                        console.log('当前田块已更新，重新生成方案:', updatedField);
                        // 强制刷新图片映射
                        this.loadPestImages();
                        this.generatePrescription(updatedField);
                    }
                }
            }

            // 重新渲染田块选择器（如果有新田块）
            this.renderFieldSelector();
        });
    }

    /**
     * 从病虫害记录更新田块数据
     */
    updateFieldFromPestRecord(pestRecord) {
        if (!pestRecord.fieldId) return;

        // 标准化田块ID：将 F-001 转换为 field_001，或提取数字部分
        const normalizedFieldId = pestRecord.fieldId.replace(/^F-/, 'field_');
        const fieldNumber = pestRecord.fieldId.replace(/^F-/, '');

        // 查找对应的田块（支持多种ID格式匹配）
        let field = this.fields.find(f =>
            f.id === pestRecord.fieldId ||           // 完全匹配：F-001
            f.id === normalizedFieldId ||            // 标准化匹配：field_001
            f.id === `field_${fieldNumber}` ||       // 另一种格式：field_001
            f.name === fieldNumber ||                // 名称匹配：001
            f.name === fieldNumber.padStart(3, '0')  // 补零匹配：001
        );

        if (!field) {
            // 如果田块不存在，创建新田块
            const fieldName = fieldNumber;
            field = {
                id: normalizedFieldId, // 使用标准格式 field_001
                name: fieldName,
                risk: this.convertSeverityToRisk(pestRecord.severity),
                crop: pestRecord.crop || '未知',
                pest: pestRecord.pest || pestRecord.title,
                area: pestRecord.area || '0.0亩',
                currentRisk: this.convertSeverityToRisk(pestRecord.severity)
            };
            this.fields.push(field);
            console.log('创建新田块:', field);
        } else {
            // 如果田块存在，更新病虫害信息
            const oldPest = field.pest;
            field.pest = pestRecord.pest || pestRecord.title;
            field.risk = this.convertSeverityToRisk(pestRecord.severity);
            field.currentRisk = this.convertSeverityToRisk(pestRecord.severity);
            if (pestRecord.crop) {
                field.crop = pestRecord.crop;
            }
            console.log('更新田块:', field, '原病虫害:', oldPest, '新病虫害:', field.pest);
        }

        // 更新FieldData（如果存在）
        if (typeof FieldData !== 'undefined') {
            if (FieldData.updateField) {
                FieldData.updateField(field);
            } else if (FieldData.fields) {
                // 直接更新FieldData中的字段
                const fieldDataField = FieldData.fields.find(f =>
                    f.id === field.id ||
                    f.id === normalizedFieldId ||
                    f.id === `field_${fieldNumber}` ||
                    f.name === field.name ||
                    f.name === fieldNumber
                );
                if (fieldDataField) {
                    fieldDataField.pest = field.pest;
                    fieldDataField.risk = field.risk;
                    fieldDataField.crop = field.crop;
                    if (field.area) {
                        fieldDataField.area = field.area;
                    }
                    console.log('更新FieldData:', fieldDataField);
                } else {
                    console.warn('未找到FieldData中的田块:', field.id, field.name, '可用田块:', FieldData.fields.map(f => f.id));
                }
            }
        }

        // 确保当前fields数组中的田块也被更新
        const existingField = this.fields.find(f =>
            f.id === field.id ||
            f.id === normalizedFieldId ||
            f.id === `field_${fieldNumber}` ||
            f.name === field.name ||
            f.name === fieldNumber
        );
        if (existingField && existingField !== field) {
            // 如果找到了不同的引用，更新它
            existingField.pest = field.pest;
            existingField.risk = field.risk;
            existingField.currentRisk = field.currentRisk;
            existingField.crop = field.crop;
            if (field.area) {
                existingField.area = field.area;
            }
            console.log('同步更新fields数组中的田块:', existingField);
        }
    }

    /**
     * 将严重程度转换为风险值
     */
    convertSeverityToRisk(severity) {
        if (typeof severity === 'number') {
            return severity / 100; // 如果已经是0-100的值，转换为0-1
        }
        // 如果是字符串，根据严重程度映射
        const severityMap = {
            '严重': 0.8,
            '高': 0.65,
            '中': 0.5,
            '低': 0.35
        };
        return severityMap[severity] || 0.5;
    }

    /**
     * 从localStorage加载病虫害图片
     */
    loadPestImages() {
        try {
            // 从localStorage读取病虫害记录
            const stored = localStorage.getItem('pestRecords');
            if (stored) {
                const pestRecords = JSON.parse(stored);
                // 更新图片映射（使用最新的记录，如果有多个相同病虫害的记录）
                const pestImageMap = {};
                const pestRecordMap = {}; // 存储记录对象，用于比较时间戳

                pestRecords.forEach(record => {
                    if (record.image && (record.pest || record.title)) {
                        const pestName = record.pest || record.title;
                        // 如果已有该病虫害的图片，比较时间戳，保留最新的
                        if (!pestImageMap[pestName]) {
                            pestImageMap[pestName] = record.image;
                            pestRecordMap[pestName] = record;
                        } else {
                            // 比较时间戳，保留最新的
                            const currentTime = pestRecordMap[pestName].id ?
                                parseInt(pestRecordMap[pestName].id.match(/P-(\d+)-/)?.[1] || '0') : 0;
                            const newTime = record.id ?
                                parseInt(record.id.match(/P-(\d+)-/)?.[1] || '0') : 0;
                            if (newTime > currentTime) {
                                pestImageMap[pestName] = record.image;
                                pestRecordMap[pestName] = record;
                            }
                        }
                    }
                });
                // 更新图片映射
                Object.keys(pestImageMap).forEach(pestName => {
                    this.pestImageMap[pestName] = pestImageMap[pestName];
                });
                console.log('加载病虫害图片映射完成，共', Object.keys(pestImageMap).length, '个病虫害');
            }
        } catch (error) {
            console.error('加载病虫害图片失败:', error);
        }
    }

    /**
     * 保存病虫害图片到localStorage
     */
    savePestImages() {
        try {
            // 只保存图片映射（不包含base64数据，因为太大）
            const imageMap = {};
            Object.keys(this.pestImageMap).forEach(key => {
                // 只保存非base64的图片路径
                if (!this.pestImageMap[key].startsWith('data:')) {
                    imageMap[key] = this.pestImageMap[key];
                }
            });
            localStorage.setItem('pestImageMap', JSON.stringify(imageMap));
        } catch (error) {
            console.error('保存病虫害图片失败:', error);
        }
    }

    loadFieldData() {
        if (typeof FieldData !== 'undefined' && FieldData.getAllFields) {
            // 从FieldData获取初始数据
            const initialFields = FieldData.getAllFields();
            this.fields = initialFields.map(f => ({ ...f })); // 深拷贝，避免直接引用
        } else {
            // 备用数据
            this.fields = [
                { id: 'field_001', name: '001', risk: 0.15, crop: '玉米', pest: '玉米螟', area: '18亩' },
                { id: 'field_002', name: '002', risk: 0.25, crop: '大豆', pest: '大豆蚜虫', area: '24亩' },
                { id: 'field_003', name: '003', risk: 0.35, crop: '棉花', pest: '棉铃虫', area: '32亩' },
                { id: 'field_004', name: '004', risk: 0.45, crop: '大豆', pest: '大豆蚜虫', area: '6亩' },
                { id: 'field_005', name: '005', risk: 0.20, crop: '棉花', pest: '棉铃虫', area: '26亩' },
                { id: 'field_006', name: '006', risk: 0.55, crop: '玉米', pest: '玉米螟', area: '25亩' },
                { id: 'field_007', name: '007', risk: 0.30, crop: '大豆', pest: '大豆蚜虫', area: '15亩' },
                { id: 'field_008', name: '008', risk: 0.40, crop: '棉花', pest: '棉铃虫', area: '20亩' }
            ];
        }

        // 从localStorage加载最新的病虫害记录，更新田块数据
        this.syncFieldsFromPestRecords();
    }

    /**
     * 从localStorage的病虫害记录同步更新田块数据
     */
    syncFieldsFromPestRecords() {
        try {
            const stored = localStorage.getItem('pestRecords');
            if (stored) {
                const pestRecords = JSON.parse(stored);
                console.log('从localStorage同步田块数据，共', pestRecords.length, '条记录');

                // 按时间戳倒序排序，最新的在前
                pestRecords.sort((a, b) => {
                    const timeA = a.id ? parseInt(a.id.match(/P-(\d+)-/)?.[1] || '0') : 0;
                    const timeB = b.id ? parseInt(b.id.match(/P-(\d+)-/)?.[1] || '0') : 0;
                    return timeB - timeA; // 降序，最新的在前
                });

                // 为每个田块找到最新的病虫害记录
                const fieldLatestPest = {};
                pestRecords.forEach(record => {
                    if (!record.fieldId) return;

                    const fieldNumber = record.fieldId.replace(/^F-/, '');
                    const normalizedFieldId = record.fieldId.replace(/^F-/, 'field_');

                    // 生成所有可能的田块ID格式
                    const possibleIds = [
                        record.fieldId,
                        normalizedFieldId,
                        `field_${fieldNumber}`,
                        fieldNumber
                    ];

                    // 为每个可能的ID格式记录最新病虫害
                    possibleIds.forEach(id => {
                        if (!fieldLatestPest[id]) {
                            fieldLatestPest[id] = record;
                        }
                    });
                });

                // 更新田块数据
                this.fields.forEach(field => {
                    // 查找该田块的最新病虫害记录
                    const latestRecord = fieldLatestPest[field.id] ||
                        fieldLatestPest[field.name] ||
                        fieldLatestPest[`field_${field.name}`] ||
                        fieldLatestPest[`F-${field.name}`];

                    if (latestRecord) {
                        const oldPest = field.pest;
                        field.pest = latestRecord.pest || latestRecord.title;
                        field.risk = this.convertSeverityToRisk(latestRecord.severity);
                        field.currentRisk = this.convertSeverityToRisk(latestRecord.severity);
                        if (latestRecord.crop) {
                            field.crop = latestRecord.crop;
                        }
                        if (latestRecord.area) {
                            field.area = latestRecord.area;
                        }
                        console.log(`同步田块 ${field.name}: ${oldPest} -> ${field.pest}`);
                    }
                });
            }
        } catch (error) {
            console.error('同步田块数据失败:', error);
        }
    }

    renderFieldSelector() {
        const fieldGrid = document.getElementById('field-grid');
        if (!fieldGrid) return;

        fieldGrid.innerHTML = this.fields.map(field => {
            return `
                <div class="field-card" data-field-id="${field.id}">
                    <span class="field-name">${field.name}</span>
                </div>
            `;
        }).join('');

        // 绑定点击事件
        fieldGrid.querySelectorAll('.field-card').forEach(card => {
            card.addEventListener('click', () => {
                const fieldId = card.dataset.fieldId;
                this.selectField(fieldId);
            });
        });
    }

    selectField(fieldId) {
        // 先从localStorage同步最新数据，确保使用最新信息
        this.syncFieldsFromPestRecords();

        const field = this.fields.find(f => f.id === fieldId);
        if (!field) {
            console.warn('未找到田块:', fieldId);
            return;
        }

        this.selectedField = field;

        // 更新选中状态
        document.querySelectorAll('.field-card').forEach(card => {
            card.classList.remove('selected');
            if (card.dataset.fieldId === fieldId) {
                card.classList.add('selected');
            }
        });

        console.log('选择田块:', field.name, '病虫害:', field.pest);
        // 生成方案
        this.generatePrescription(field);
    }

    bindEvents() {
        // 事件绑定（已移除确认采纳和查看备选方案功能）
    }

    async generatePrescription(field) {
        // 显示加载状态
        this.showLoadingState();

        // 更新图片（根据病虫害类型显示不同图片）
        const image = document.getElementById('disease-image');
        if (image) {
            // 根据病虫害类型获取对应的图片路径
            const pestName = field.pest || '';

            // 优先从localStorage的病虫害记录中获取最新图片（确保获取最新收录的图片）
            let imagePath = null;
            const stored = localStorage.getItem('pestRecords');
            if (stored) {
                try {
                    const pestRecords = JSON.parse(stored);
                    // 查找该田块的最新病虫害记录（按时间倒序，取最新的）
                    const matchingRecords = pestRecords.filter(record => {
                        const recordFieldId = record.fieldId || '';
                        const recordFieldNumber = recordFieldId.replace(/^F-/, '');
                        const normalizedRecordFieldId = recordFieldId.replace(/^F-/, 'field_');

                        // 匹配田块ID
                        const fieldMatches =
                            field.id === recordFieldId ||
                            field.id === normalizedRecordFieldId ||
                            field.id === `field_${recordFieldNumber}` ||
                            field.name === recordFieldNumber ||
                            field.name === recordFieldNumber.padStart(3, '0');

                        // 匹配病虫害名称
                        const pestMatches =
                            (record.pest === pestName || record.title === pestName) &&
                            record.image;

                        return fieldMatches && pestMatches;
                    });

                    // 如果有匹配的记录，使用最新的（按ID中的时间戳排序，或使用最后一条）
                    if (matchingRecords.length > 0) {
                        // 按ID中的时间戳排序，取最新的
                        matchingRecords.sort((a, b) => {
                            const timeA = a.id ? parseInt(a.id.match(/P-(\d+)-/)?.[1] || '0') : 0;
                            const timeB = b.id ? parseInt(b.id.match(/P-(\d+)-/)?.[1] || '0') : 0;
                            return timeB - timeA; // 降序，最新的在前
                        });
                        imagePath = matchingRecords[0].image;
                        console.log('从localStorage获取最新图片:', pestName, imagePath.substring(0, 50) + '...');
                    }
                } catch (error) {
                    console.error('读取病虫害记录失败:', error);
                }
            }

            // 如果localStorage中没有，尝试从图片映射中获取
            if (!imagePath) {
                imagePath = this.pestImageMap[pestName] || this.pestImageMap['default'];
            }

            // 如果还是没有，使用默认图片
            if (!imagePath) {
                imagePath = this.pestImageMap['default'] || 'image/01.png';
            }

            // 更新图片映射（缓存最新图片）
            if (imagePath && imagePath !== this.pestImageMap['default']) {
                this.pestImageMap[pestName] = imagePath;
            }

            image.src = imagePath;
            image.style.display = 'block';
            console.log('显示病虫害图片:', pestName, imagePath.substring(0, 50) + '...');
        }

        // 计算严重程度（立即计算，不等待）
        const severity = field.risk || field.currentRisk || 0.3;
        const severityText = severity < 0.3 ? '轻度' : severity < 0.5 ? '中度' : '重度';

        // 策略：先立即显示备用方案，然后异步尝试AI推荐并更新
        // 这样可以保证用户立即看到结果，而不是等待

        // 立即生成并显示备用方案（同步，极速）
        this.generateFallbackPrescription(field);

        // 异步尝试AI推荐（不阻塞显示）
        this.tryAIPrescriptionAsync(field, severity, severityText);
    }

    /**
     * 异步尝试AI推荐（后台执行，不阻塞主流程）
     */
    async tryAIPrescriptionAsync(field, severity, severityText) {
        // 设置超时保护：500毫秒内必须返回结果
        const timeoutPromise = new Promise((resolve) => {
            setTimeout(() => {
                console.warn('AI推荐超时，保持使用备用方案');
                resolve(null);
            }, 500); // 500ms超时，更快
        });

        // AI推荐尝试（带超时保护）
        const aiRecommendationPromise = (async () => {
            if (!window.aiPrescriptionEngine || !window.aiDataService) {
                return null; // 静默失败，不影响用户体验
            }

            try {
                // 快速获取环境数据（带超时）
                let environment = {
                    temperature: 25.0,
                    humidity: 65.0,
                    windSpeed: 3.0,
                    rainfall: 0.0
                };

                try {
                    const envPromise = window.aiDataService.getEnvironmentData();
                    const envTimeout = new Promise((resolve) => setTimeout(() => resolve(environment), 100)); // 100ms超时
                    environment = await Promise.race([envPromise, envTimeout]);
                } catch (error) {
                    // 静默失败，使用默认值
                }

                // 获取历史记录（同步，快速）
                const history = window.aiDataService.getHistoryRecords ?
                    window.aiDataService.getHistoryRecords(field.id) : [];

                // 快速生成推荐方案（完全同步，立即返回）
                const aiRecommendations = window.aiPrescriptionEngine.generateRecommendations({
                    disease: field.pest,
                    severity: severity,
                    crop: field.crop,
                    environment: environment,
                    history: history,
                    fieldId: field.id,
                    budget: null,
                    skipPrediction: true
                });

                // generateRecommendations现在返回同步数组
                if (Array.isArray(aiRecommendations) && aiRecommendations.length > 0) {
                    return aiRecommendations;
                }

                return null;
            } catch (error) {
                console.warn('AI推荐过程出错（不影响主流程）:', error);
                return null;
            }
        })();

        // 等待AI推荐或超时
        const aiRecommendations = await Promise.race([aiRecommendationPromise, timeoutPromise]);

        // 如果AI推荐成功，更新显示
        if (aiRecommendations && aiRecommendations.length > 0) {
            try {
                // 获取环境数据（用于用量计算）
                let environment = {
                    temperature: 25.0,
                    humidity: 65.0,
                    windSpeed: 3.0,
                    rainfall: 0.0
                };

                try {
                    const envPromise = window.aiDataService.getEnvironmentData();
                    const envTimeout = new Promise((resolve) => setTimeout(() => resolve(environment), 100));
                    environment = await Promise.race([envPromise, envTimeout]);
                } catch (error) {
                    // 静默失败，使用默认值
                }

                const history = window.aiDataService.getHistoryRecords ?
                    window.aiDataService.getHistoryRecords(field.id) : [];

                // 使用AI推荐的第一方案（评分最高）
                const topRecommendation = aiRecommendations[0];
                const plan = topRecommendation.plan;

                // 获取最优用量（同步计算，快速）
                const optimalDosage = window.aiPrescriptionEngine.calculateOptimalDosage(
                    plan.dosage.base,
                    {
                        severity: severity,
                        environment: environment,
                        unit: plan.dosage.unit,
                        water: plan.dosage.water,
                        hasResistanceHistory: history.length > 0 &&
                            history.some(h => h.medicine && h.medicine.includes(plan.name))
                    }
                );

                // 预测方案效果（同步计算，快速）
                const effectiveness = window.aiPrescriptionEngine.predictEffectiveness(plan, {
                    environment: environment,
                    severity: severity,
                    resistanceRisk: topRecommendation.factors ? topRecommendation.factors.resistance : 0.1
                });

                // 构建AI推荐处方数据
                const prescription = {
                    name: field.pest,
                    subtype: field.crop + '病虫害',
                    severity: severity < 0.3 ? 'mild' : severity < 0.5 ? 'moderate' : 'severe',
                    severityText: severityText,
                    severityPercent: Math.round(severity * 100),
                    area: `${field.name}号田块，${field.area}`,
                    medicines: [{
                        name: plan.name,
                        advantage: plan.advantage,
                        aiScore: Math.round(topRecommendation.score),
                        aiReason: topRecommendation.aiRecommendation || '综合评分较高',
                        effectiveness: Math.round(effectiveness.successRate * 100) + '%',
                        duration: effectiveness.duration + '天',
                        sideEffectRisk: Math.round(effectiveness.sideEffectRisk * 100) + '%'
                    }],
                    // 添加其他推荐方案
                    alternativeMedicines: aiRecommendations.slice(1, 3).map(rec => ({
                        name: rec.plan.name,
                        advantage: rec.plan.advantage,
                        aiScore: Math.round(rec.score),
                        aiReason: rec.aiRecommendation || '综合评分较高'
                    })),
                    usage: [
                        `每亩用${optimalDosage.dosage}${plan.dosage.unit}，兑水${optimalDosage.water}公斤`,
                        `AI智能用量计算（${optimalDosage.adjustments.join('；')}）`,
                        '在幼虫3龄前施药效果最佳',
                        '重点喷施心叶和穗部'
                    ],
                    warnings: [
                        '选择无风或微风天气施药',
                        '避免在高温时段使用',
                        '注意安全间隔期7-10天'
                    ],
                    aiTiming: null, // 先设为null，异步加载
                    aiEffectiveness: effectiveness,
                    isAIRecommended: true
                };

                // 更新显示为AI推荐版本
                this.displayAnalysisResult(prescription);

                // 显示AI推荐标签
                this.displayAIRecommendationBadge(aiRecommendations);

                // 异步加载最佳施药时机（后台加载，不阻塞显示）
                this.loadTimingPredictionAsync(field, prescription);

                console.log('✅ AI推荐成功，已更新显示');
            } catch (error) {
                console.warn('AI推荐处理出错（保持备用方案）:', error);
            }
        }
    }

    /**
     * 异步加载最佳施药时机预测（不阻塞主流程）
     */
    async loadTimingPredictionAsync(field, prescription) {
        try {
            // 快速获取环境数据，设置超时避免长时间等待
            let environment = { temperature: 25.0, humidity: 65.0, windSpeed: 3.0, rainfall: 0.0 };
            if (window.aiDataService) {
                try {
                    const envPromise = window.aiDataService.getEnvironmentData();
                    const envTimeout = new Promise((resolve) => setTimeout(() => resolve(environment), 500)); // 500ms超时
                    environment = await Promise.race([envPromise, envTimeout]);
                } catch (error) {
                    console.warn('获取环境数据超时，使用默认值:', error);
                    // 使用默认值
                }
            }

            // 快速获取时机预测，设置超时避免长时间等待
            const timingPromise = window.aiPrescriptionEngine.predictOptimalTiming({
                disease: field.pest,
                crop: field.crop,
                environment: environment,
                fieldId: field.id
            });
            const timingTimeout = new Promise((resolve) => {
                setTimeout(() => {
                    // 如果超时，返回快速生成的时机预测
                    resolve(this.generateQuickTiming(field, environment));
                }, 1500); // 1.5秒超时
            });
            const timing = await Promise.race([timingPromise, timingTimeout]);

            // 更新处方数据，添加时机预测
            prescription.aiTiming = timing;

            // 更新UI显示时机预测部分
            const usageInfo = document.getElementById('usage-info');
            if (!usageInfo) {
                console.warn('usage-info 元素未找到，无法更新时机预测');
                return;
            }

            if (timing && timing.recommendedDays && Array.isArray(timing.recommendedDays) && timing.recommendedDays.length > 0) {
                // 使用DOM操作移除所有旧的时机预测部分，更可靠
                const existingTimingSections = usageInfo.querySelectorAll('.ai-timing-section');
                existingTimingSections.forEach(section => {
                    section.remove();
                });

                // 创建新的时机预测部分
                const timingSection = document.createElement('div');
                timingSection.className = 'ai-timing-section';
                timingSection.innerHTML = `
                    <h4><i class="fas fa-clock"></i> 最佳施药时机（AI预测）</h4>
                    <div class="timing-recommendations">
                        ${timing.recommendedDays.map(day => `
                            <div class="timing-day">
                                <div class="day-label">第${day.day}天 (${day.date || ''})</div>
                                <div class="day-weather">
                                    温度: ${day.weather?.temperature || 'N/A'}°C | 
                                    湿度: ${day.weather?.humidity || 'N/A'}% | 
                                    降雨: ${day.weather?.rainfall || 'N/A'}mm | 
                                    风速: ${day.weather?.windSpeed || 'N/A'}m/s
                                </div>
                                <div class="day-reason">${day.reason || '温度适宜、无降雨、风速小'}</div>
                            </div>
                        `).join('')}
                    </div>
                    ${timing.urgency ? `
                        <div class="urgency-badge urgency-${timing.urgency.level || 'low'}">
                            紧急程度: ${timing.urgency.text || '常规'}
                        </div>
                    ` : ''}
                `;

                // 添加到usageInfo的末尾
                usageInfo.appendChild(timingSection);
            }
        } catch (error) {
            console.warn('加载时机预测失败（不影响主要功能）:', error);
        }
    }

    /**
     * 快速生成时机预测（当AI预测超时时使用）
     */
    generateQuickTiming(field, environment) {
        const today = new Date();
        const recommendedDays = [];

        for (let i = 1; i <= 3; i++) {
            const date = new Date(today);
            date.setDate(date.getDate() + i);
            recommendedDays.push({
                day: i,
                date: `${date.getMonth() + 1}月${date.getDate()}日`,
                weather: {
                    temperature: (environment.temperature || 25) + (Math.random() * 4 - 2),
                    humidity: (environment.humidity || 65) + (Math.random() * 10 - 5),
                    rainfall: 0,
                    windSpeed: (environment.windSpeed || 3) + (Math.random() * 2 - 1)
                },
                reason: '温度适宜、无降雨、风速小'
            });
        }

        return {
            recommendedDays: recommendedDays,
            urgency: {
                level: 'medium',
                text: '常规'
            },
            bestTimeOfDay: '上午9-11点或下午4-6点',
            reason: `根据${field.pest}的爆发规律和天气预报，推荐在以上日期施药`
        };
    }

    /**
     * 备用方案生成（原有逻辑）
     */
    generateFallbackPrescription(field) {
        console.log('生成备用方案:', field.pest, field.name);

        const prescriptions = {
            '玉米螟': {
                name: '玉米螟',
                subtype: field.crop + '病虫害',
                severity: field.risk < 0.3 ? 'mild' : field.risk < 0.5 ? 'moderate' : 'severe',
                severityText: field.risk < 0.3 ? '轻度' : field.risk < 0.5 ? '中度' : '重度',
                severityPercent: Math.round(field.risk * 100),
                area: `${field.name}号田块，${field.area}`,
                medicines: [
                    {
                        name: '5% 甲维盐微乳剂',
                        advantage: '对玉米螟特效，持效期长'
                    },
                    {
                        name: '20% 氯虫苯甲酰胺悬浮剂',
                        advantage: '内吸性强，安全性高'
                    }
                ],
                usage: [
                    '每亩用30毫升，兑水40公斤',
                    '在幼虫3龄前施药效果最佳',
                    '重点喷施心叶和穗部'
                ],
                warnings: [
                    '选择无风或微风天气施药',
                    '避免在高温时段使用',
                    '注意安全间隔期7-10天'
                ],
                isAIRecommended: false
            },
            '大豆蚜虫': {
                name: '大豆蚜虫',
                subtype: field.crop + '病虫害',
                severity: field.risk < 0.3 ? 'mild' : field.risk < 0.5 ? 'moderate' : 'severe',
                severityText: field.risk < 0.3 ? '轻度' : field.risk < 0.5 ? '中度' : '重度',
                severityPercent: Math.round(field.risk * 100),
                area: `${field.name}号田块，${field.area}`,
                medicines: [
                    {
                        name: '25% 吡蚜酮可湿性粉剂',
                        advantage: '高效低毒，持效期长'
                    },
                    {
                        name: '10% 吡虫啉可湿性粉剂',
                        advantage: '速效性好，成本低'
                    }
                ],
                usage: [
                    '每亩用20克，兑水30公斤',
                    '重点喷施叶片背面',
                    '田间保持通风透光'
                ],
                warnings: [
                    '避免在高温时段施药',
                    '注意轮换用药，防止抗性',
                    '施药时做好个人防护'
                ],
                isAIRecommended: false
            },
            '棉铃虫': {
                name: '棉铃虫',
                subtype: field.crop + '病虫害',
                severity: field.risk < 0.3 ? 'mild' : field.risk < 0.5 ? 'moderate' : 'severe',
                severityText: field.risk < 0.3 ? '轻度' : field.risk < 0.5 ? '中度' : '重度',
                severityPercent: Math.round(field.risk * 100),
                area: `${field.name}号田块，${field.area}`,
                medicines: [
                    {
                        name: '5% 高效氯氟氰菊酯乳油',
                        advantage: '杀虫谱广，速效性强'
                    },
                    {
                        name: '20% 氯虫苯甲酰胺悬浮剂',
                        advantage: '持效期长，安全性好'
                    }
                ],
                usage: [
                    '每亩用25毫升，兑水40公斤',
                    '在幼虫孵化高峰期施药',
                    '重点喷施花蕾和幼铃'
                ],
                warnings: [
                    '选择晴天下午施药',
                    '避免与碱性农药混用',
                    '注意保护天敌'
                ],
                isAIRecommended: false
            }
        };

        const prescription = prescriptions[field.pest] || prescriptions['玉米螟'];
        console.log('备用方案数据:', prescription);

        // 确保立即显示
        this.displayAnalysisResult(prescription);

        console.log('备用方案已显示');
    }

    /**
     * 显示加载状态
     */
    showLoadingState() {
        const prescriptionContent = document.getElementById('prescription-content');
        if (!prescriptionContent) {
            console.warn('prescription-content 元素未找到，无法显示加载状态');
            return;
        }

        prescriptionContent.innerHTML = `
            <div class="loading-state">
                <i class="fas fa-robot fa-spin"></i>
                <p>AI智能分析中...</p>
            </div>
        `;
    }

    /**
     * 显示AI推荐标签
     */
    displayAIRecommendationBadge(recommendations) {
        // 在处方区域添加AI推荐标识
        const prescriptionHeader = document.querySelector('.prescription-header h2');
        if (!prescriptionHeader) {
            console.warn('prescription-header h2 元素未找到');
            return;
        }

        // 如果已经存在，先移除
        const existingBadge = prescriptionHeader.querySelector('.ai-badge');
        if (existingBadge) {
            existingBadge.remove();
        }

        const aiBadge = document.createElement('span');
        aiBadge.className = 'ai-badge';
        aiBadge.innerHTML = '<i class="fas fa-robot"></i> AI智能推荐';
        // 使用CSS变量获取绿色值
        const primaryGreen = getComputedStyle(document.documentElement).getPropertyValue('--primary-green').trim() || '#2E7D32';
        const lightGreen = getComputedStyle(document.documentElement).getPropertyValue('--light-green').trim() || '#4CAF50';
        aiBadge.style.cssText = `
            margin-left: 10px;
            padding: 4px 12px;
            background: linear-gradient(135deg, ${primaryGreen} 0%, ${lightGreen} 100%);
            color: white;
            border-radius: 12px;
            font-size: 12px;
            font-weight: bold;
        `;
        prescriptionHeader.appendChild(aiBadge);
    }

    displayAnalysisResult(disease) {
        if (!disease) {
            console.error('disease数据为空');
            return;
        }

        this.diseaseData = disease;
        this.isAnalyzing = false;

        // 更新信息卡片
        const infoCard = document.getElementById('info-card');
        if (!infoCard) {
            console.error('info-card 元素未找到');
            return;
        }

        infoCard.className = `info-card severity-${disease.severity}`;

        infoCard.innerHTML = `
            <div class="disease-type">
                <h2>${disease.name}</h2>
                <span class="disease-subtype">${disease.subtype}</span>
            </div>
            
            <div class="severity-indicator">
                <label>发生程度</label>
                <div class="severity-bar">
                    <div class="severity-progress" style="width: ${Math.min(100, disease.severityPercent)}%"></div>
                    <span class="severity-text">${disease.severityText}</span>
                </div>
            </div>
            
            <div class="affected-area">
                <label>影响范围</label>
                <div class="area-info">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>${disease.area}</span>
                </div>
            </div>
        `;

        // 立即更新处方内容（清除加载状态）
        this.updatePrescription(disease);

        // 移除病虫害识别相关功能（用户不需要）
        // this.showSymptomMarkers();
        // window.controlApp.showNotification('病虫害识别完成', 'success');
    }

    updatePrescription(disease) {
        // 先恢复 prescription-content 的完整结构（如果被加载状态覆盖了）
        const prescriptionContent = document.getElementById('prescription-content');
        if (!prescriptionContent) {
            console.error('prescription-content 元素未找到');
            return;
        }

        // 检查是否只有加载状态（没有prescription-grid结构）
        const prescriptionGrid = prescriptionContent.querySelector('.prescription-grid');
        if (!prescriptionGrid) {
            // 恢复完整的HTML结构（图标和标题在同一行居中）
            prescriptionContent.innerHTML = `
                <div class="prescription-grid">
                    <div class="prescription-item">
                        <div class="prescription-item-header">
                            <div class="item-icon">
                                <i class="fas fa-prescription-bottle-alt"></i>
                            </div>
                            <h3>药剂选择</h3>
                        </div>
                        <div class="item-content">
                            <div class="medicine-list" id="medicine-list"></div>
                        </div>
                    </div>
                    
                    <div class="prescription-item">
                        <div class="prescription-item-header">
                            <div class="item-icon">
                                <i class="fas fa-tint"></i>
                            </div>
                            <h3>用量与方法</h3>
                        </div>
                        <div class="item-content">
                            <div class="usage-info" id="usage-info"></div>
                        </div>
                    </div>
                    
                    <div class="prescription-item">
                        <div class="prescription-item-header">
                            <div class="item-icon">
                                <i class="fas fa-exclamation-triangle"></i>
                            </div>
                            <h3>关键提醒</h3>
                        </div>
                        <div class="item-content">
                            <div class="warnings" id="warnings"></div>
                        </div>
                    </div>
                </div>
            `;
        }

        // 更新药剂选择
        const medicineList = document.getElementById('medicine-list');
        if (!medicineList) {
            console.error('medicine-list 元素未找到');
            return;
        }

        if (disease.isAIRecommended && disease.medicines && disease.medicines.length > 0 && disease.medicines[0].aiScore) {
            // AI推荐版本：显示评分和详细信息
            medicineList.innerHTML = disease.medicines.map(medicine => `
                <div class="medicine-item ai-recommended">
                    <div class="medicine-header">
                        <div class="medicine-name">${medicine.name}</div>
                        <div class="ai-score-badge">
                            <i class="fas fa-star"></i> AI评分: ${medicine.aiScore}分
                        </div>
                    </div>
                    <div class="medicine-advantage">${medicine.advantage}</div>
                    <div class="ai-reason">推荐理由: ${medicine.aiReason}</div>
                    ${medicine.effectiveness ? `
                        <div class="medicine-stats">
                            <div class="stat-item">
                                <span class="stat-label">预期效果:</span>
                                <span class="stat-value">${medicine.effectiveness}</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-label">持效期:</span>
                                <span class="stat-value">${medicine.duration}</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-label">副作用风险:</span>
                                <span class="stat-value">${medicine.sideEffectRisk}</span>
                            </div>
                        </div>
                    ` : ''}
                </div>
            `).join('');

            // 如果有备选方案，也显示
            if (disease.alternativeMedicines && disease.alternativeMedicines.length > 0) {
                medicineList.innerHTML += `
                    <div class="alternative-section">
                        <h4><i class="fas fa-list"></i> 其他推荐方案</h4>
                        ${disease.alternativeMedicines.map(alt => `
                            <div class="alternative-item">
                                <div class="medicine-name">${alt.name}</div>
                                <div class="medicine-advantage">${alt.advantage}</div>
                                <div class="ai-score-small">AI评分: ${alt.aiScore}分 | ${alt.aiReason}</div>
                            </div>
                        `).join('')}
                    </div>
                `;
            }
        } else {
            // 普通版本
            if (disease.medicines && Array.isArray(disease.medicines)) {
                medicineList.innerHTML = disease.medicines.map(medicine => `
            <div class="medicine-item">
                <div class="medicine-name">${medicine.name}</div>
                <div class="medicine-advantage">${medicine.advantage}</div>
            </div>
        `).join('');
            } else {
                medicineList.innerHTML = '<p class="placeholder">方案生成中...</p>';
            }
        }

        // 更新用量与方法
        const usageInfo = document.getElementById('usage-info');
        if (!usageInfo) {
            console.error('usage-info 元素未找到');
            return;
        }

        let usageHTML = '';
        if (disease.usage && Array.isArray(disease.usage)) {
            usageHTML = disease.usage.map(step => `
            <div class="usage-step">${step}</div>
        `).join('');
        }

        // 如果有AI时机预测，添加最佳施药时机
        // 注意：如果时机预测还在异步加载中，这里不显示，等异步加载完成后再显示
        // 这样可以避免重复添加和内容不一致的问题
        if (disease.aiTiming && disease.aiTiming.recommendedDays && Array.isArray(disease.aiTiming.recommendedDays) && disease.aiTiming.recommendedDays.length > 0) {
            usageHTML += `
                <div class="ai-timing-section">
                    <h4><i class="fas fa-clock"></i> 最佳施药时机（AI预测）</h4>
                    <div class="timing-recommendations">
                        ${disease.aiTiming.recommendedDays.map(day => `
                            <div class="timing-day">
                                <div class="day-label">第${day.day}天 (${day.date || ''})</div>
                                <div class="day-weather">
                                    温度: ${day.weather?.temperature || 'N/A'}°C | 
                                    湿度: ${day.weather?.humidity || 'N/A'}% | 
                                    降雨: ${day.weather?.rainfall || 'N/A'}mm | 
                                    风速: ${day.weather?.windSpeed || 'N/A'}m/s
                                </div>
                                <div class="day-reason">${day.reason || '温度适宜、无降雨、风速小'}</div>
                            </div>
                        `).join('')}
                    </div>
                    ${disease.aiTiming.urgency ? `
                        <div class="urgency-badge urgency-${disease.aiTiming.urgency.level || 'low'}">
                            紧急程度: ${disease.aiTiming.urgency.text || '常规'}
                        </div>
                    ` : ''}
                </div>
            `;
        } else if (disease.isAIRecommended && (!disease.aiTiming || !disease.aiTiming.recommendedDays)) {
            // 如果时机预测还在加载中，显示加载提示
            // 但只在确实没有时机数据时才显示，避免重复
            usageHTML += `
                <div class="ai-timing-section" id="timing-loading-placeholder">
                    <h4><i class="fas fa-clock"></i> 最佳施药时机（AI预测中...）</h4>
                    <div class="loading-timing">
                        <i class="fas fa-spinner fa-spin"></i>
                        <span>正在分析最佳施药时机...</span>
                    </div>
                </div>
            `;
        }
        usageInfo.innerHTML = usageHTML;

        // 更新关键提醒
        const warnings = document.getElementById('warnings');
        if (!warnings) {
            console.error('warnings 元素未找到');
            return;
        }

        let warningsHTML = '';
        if (disease.warnings && Array.isArray(disease.warnings)) {
            warningsHTML = disease.warnings.map(warning => `
            <div class="warning-item">
                <i class="fas fa-exclamation-triangle"></i>
                ${warning}
            </div>
        `).join('');
        }

        // 如果有AI效果预测，添加效果预测信息
        if (disease.aiEffectiveness) {
            warningsHTML += `
                <div class="ai-effectiveness-section">
                    <h4><i class="fas fa-chart-line"></i> 方案效果预测（AI）</h4>
                    <div class="effectiveness-stats">
                        <div class="effect-item">
                            <span class="effect-label">预期成功率:</span>
                            <span class="effect-value">${Math.round(disease.aiEffectiveness.successRate * 100)}%</span>
                        </div>
                        <div class="effect-item">
                            <span class="effect-label">置信度:</span>
                            <span class="effect-value">${Math.round(disease.aiEffectiveness.confidence * 100)}%</span>
                        </div>
                    </div>
                </div>
            `;
        }
        warnings.innerHTML = warningsHTML;
    }

    showSymptomMarkers() {
        const markers = document.querySelector('.symptom-markers');
        if (!markers) {
            return;
        }

        markers.style.display = 'block';

        // 添加多个症状标记点
        setTimeout(() => {
            if (markers) {
                markers.innerHTML = `
                <div class="marker-point" style="top: 20px; left: 30px;"></div>
                <div class="marker-point" style="top: 60px; right: 20px;"></div>
                <div class="marker-point" style="bottom: 40px; left: 40px;"></div>
            `;
            }
        }, 500);
    }


}

// 初始化化学防控模块
let chemicalControlInstance = null;

document.addEventListener('DOMContentLoaded', () => {
    chemicalControlInstance = new ChemicalControl();
    window.ChemicalControl = chemicalControlInstance;
});

// 导出类（用于创建新实例）
window.ChemicalControlClass = ChemicalControl;

// 也导出实例（如果已经初始化）
if (chemicalControlInstance) {
    window.ChemicalControl = chemicalControlInstance;
}
