// 绿色防控设备控制模块

class GreenControl {
    constructor() {
        this.devices = [];
        this.selectedArea = 'all';
        this.deviceStates = new Map();
        this.aiController = null;
        this.intelligentMode = false; // AI智能控制模式
        this.autoControlInterval = null;
        this.dataService = null;
        this.init();
    }

    init() {
        this.loadDeviceData();
        this.renderAreaSelector(); // 动态生成区域选择下拉框
        this.bindEvents();
        // 等待SVG加载完成后再渲染设备图标
        setTimeout(() => {
            this.renderDeviceMap();
        }, 100);
        this.renderDeviceList();
        this.startRealTimeUpdates();
        
        // 初始化AI控制器
        this.initAIController();
    }
    
    /**
     * 初始化AI控制器
     */
    initAIController() {
        // 立即检查
        if (typeof window !== 'undefined' && window.aiDeviceController) {
            this.aiController = window.aiDeviceController;
            console.log('✅ AI设备控制器已初始化');
        } else {
            console.warn('⚠️ AI设备控制器未找到，将在1秒后重试');
            // 延迟重试
            setTimeout(() => {
                if (typeof window !== 'undefined' && window.aiDeviceController) {
                    this.aiController = window.aiDeviceController;
                    console.log('✅ AI设备控制器已初始化（延迟）');
                } else {
                    console.error('❌ AI设备控制器初始化失败');
                }
            }, 1000);
        }
        
        if (typeof window !== 'undefined' && window.aiDataService) {
            this.dataService = window.aiDataService;
            console.log('✅ AI数据服务已初始化');
        } else {
            console.warn('⚠️ AI数据服务未找到');
        }
    }
    
    /**
     * 启用智能模式
     */
    async enableIntelligentMode() {
        console.log('=== 启用AI智能控制模式 ===');
        
        // 检查AI控制器是否初始化
        if (!this.aiController) {
            console.warn('AI控制器未初始化，尝试初始化...');
            this.initAIController();
            
            // 等待一下再检查
            await new Promise(resolve => setTimeout(resolve, 500));
            
            if (!this.aiController) {
                console.error('AI控制器初始化失败，无法启用智能模式');
                alert('AI控制器未初始化，请刷新页面重试');
                // 恢复开关状态
                const switchEl = document.getElementById('intelligent-mode');
                if (switchEl) {
                    switchEl.checked = false;
                }
                return;
            }
        }
        
        if (!this.dataService) {
            console.warn('数据服务未初始化，尝试初始化...');
            if (typeof window !== 'undefined' && window.aiDataService) {
                this.dataService = window.aiDataService;
            } else {
                console.error('数据服务未找到，无法启用智能模式');
                alert('数据服务未找到，请刷新页面重试');
                const switchEl = document.getElementById('intelligent-mode');
                if (switchEl) {
                    switchEl.checked = false;
                }
                return;
            }
        }
        
        this.intelligentMode = true;
        console.log('AI智能控制模式已启用');
        
        // 开始自动控制循环（每30秒检查一次）
        if (this.autoControlInterval) {
            clearInterval(this.autoControlInterval);
        }
        
        this.autoControlInterval = setInterval(() => {
            if (this.intelligentMode) {
                this.autoControl();
            }
        }, 30000); // 每30秒检查一次
        
        // 立即执行一次
        console.log('立即执行第一次AI自动控制检查...');
        this.autoControl();
        
        this.updateIntelligentModeUI();
        
        // 显示提示
        if (window.controlApp && window.controlApp.showNotification) {
            window.controlApp.showNotification('AI智能控制模式已启用，系统将每30秒自动检查并做出决策', 'success');
        } else {
            console.log('提示：AI智能控制模式已启用，系统将每30秒自动检查并做出决策');
        }
    }
    
    /**
     * 禁用智能模式
     */
    disableIntelligentMode() {
        this.intelligentMode = false;
        console.log('AI智能控制模式已禁用');
        
        if (this.autoControlInterval) {
            clearInterval(this.autoControlInterval);
            this.autoControlInterval = null;
        }
        
        this.updateIntelligentModeUI();
        
        // 显示提示
        if (window.controlApp && window.controlApp.showNotification) {
            window.controlApp.showNotification('AI智能控制模式已禁用', 'info');
        }
    }
    
    /**
     * 更新智能模式UI
     */
    updateIntelligentModeUI() {
        const intelligentModeSwitch = document.getElementById('intelligent-mode');
        const aiStatus = document.getElementById('ai-status');
        
        console.log('更新智能模式UI:', {
            switch: !!intelligentModeSwitch,
            status: !!aiStatus,
            mode: this.intelligentMode
        });
        
        if (intelligentModeSwitch) {
            intelligentModeSwitch.checked = this.intelligentMode;
        }
        
        if (aiStatus) {
            const indicator = aiStatus.querySelector('.status-indicator');
            const text = aiStatus.querySelector('.status-text');
            
            if (indicator && text) {
                if (this.intelligentMode) {
                    indicator.className = 'status-indicator active';
                    text.textContent = '运行中';
                    console.log('UI更新：运行中');
                } else {
                    indicator.className = 'status-indicator';
                    text.textContent = '待机中';
                    console.log('UI更新：待机中');
                }
            } else {
                console.warn('AI状态指示器元素未找到');
            }
        } else {
            console.warn('AI状态容器未找到');
        }
    }
    
    /**
     * 自动控制（AI决策）
     */
    async autoControl() {
        if (!this.intelligentMode) {
            console.log('智能模式未启用，跳过自动控制');
            return;
        }
        
        if (!this.aiController) {
            console.warn('AI控制器未初始化，跳过自动控制');
            return;
        }
        
        if (!this.dataService) {
            console.warn('数据服务未初始化，跳过自动控制');
            return;
        }
        
        console.log('=== AI自动控制检查开始 ===');
        
        try {
            // 快速获取当前环境数据（带超时）
            let environment = {
                temperature: 25.0,
                humidity: 65.0,
                windSpeed: 3.0,
                rainfall: 0.0
            };
            
            try {
                const envPromise = this.dataService.getEnvironmentData();
                const envTimeout = new Promise((resolve) => setTimeout(() => resolve(environment), 1000));
                environment = await Promise.race([envPromise, envTimeout]);
                console.log('环境数据获取成功:', environment.temperature, '°C');
            } catch (error) {
                console.warn('获取环境数据失败，使用默认值:', error);
            }
            
            // 快速获取风险预测（带超时）
            let predictionData = null;
            try {
                const predPromise = this.dataService.getPredictionData(1);
                const predTimeout = new Promise((resolve) => setTimeout(() => resolve(null), 1000));
                predictionData = await Promise.race([predPromise, predTimeout]);
                console.log('风险预测数据获取:', predictionData ? '成功' : '失败');
            } catch (error) {
                console.warn('获取风险预测失败:', error);
            }
            
            // 为每个设备构建上下文并做出决策
            let decisionCount = 0;
            for (const device of this.devices) {
                if (device.status === 'error' || device.status === 'offline') {
                    continue; // 跳过故障或离线设备
                }
                
                try {
                    // 获取设备所在区域的风险数据
                    const riskPrediction = await this.getDeviceRiskPrediction(device, predictionData);
                    
                    // 构建上下文
                    const context = {
                        riskPrediction: riskPrediction,
                        environment: environment,
                        deviceHistory: this.getDeviceHistory(device),
                        cost: this.getDeviceCost(device),
                        region: device.area,
                        target: this.getDeviceTarget(device)
                    };
                    
                    // AI决策
                    const decision = await this.aiController.makeDecision(device, context);
                    
                    console.log(`设备 ${device.name} AI决策:`, {
                        shouldStart: decision.shouldStart,
                        confidence: Math.round(decision.confidence * 100) + '%',
                        reason: decision.reason
                    });
                    
                    // 执行决策
                    if (decision.shouldStart && !device.running) {
                        console.log(`✅ AI决策: 启动设备 ${device.name}`);
                        this.controlDevice(device.id, 'start', {
                            reason: decision.reason,
                            confidence: decision.confidence,
                            urgency: decision.urgency,
                            aiDecision: true,
                            recommendedParams: decision.recommendedParams
                        });
                        decisionCount++;
                    } else if (!decision.shouldStart && device.running && decision.confidence < 0.4) {
                        // 如果置信度很低且设备正在运行，考虑停止
                        console.log(`⏸️ AI决策: 停止设备 ${device.name}`);
                        this.controlDevice(device.id, 'stop', {
                            reason: 'AI分析显示当前不需要运行',
                            confidence: decision.confidence,
                            aiDecision: true
                        });
                        decisionCount++;
                    }
                } catch (error) {
                    console.error(`设备 ${device.name} 决策出错:`, error);
                }
            }
            
            console.log(`=== AI自动控制检查完成，共做出 ${decisionCount} 个决策 ===`);
        } catch (error) {
            console.error('AI自动控制失败:', error);
        }
    }
    
    /**
     * 获取设备的风险预测
     */
    async getDeviceRiskPrediction(device, predictionData) {
        // 尝试从预测数据中获取设备所在区域的风险
        if (predictionData && predictionData.fields_predictions) {
            // 根据设备所在作物类型或区域匹配风险
            const field = predictionData.fields_predictions.find(
                fp => fp.crop === device.crop || fp.field_id?.includes(device.area)
            );
            
            if (field && field.predictions && field.predictions.length > 0) {
                return {
                    currentRisk: field.predictions[0],
                    risk: field.predictions[0],
                    trend: this.calculateRiskTrend(field.predictions),
                    rate: this.calculateRiskRate(field.predictions)
                };
            }
        }
        
        // 备用：使用统一数据管理器或默认值
        if (typeof window !== 'undefined' && window.unifiedDataManager) {
            const riskData = window.unifiedDataManager.getRiskData();
            if (riskData && riskData.fields) {
                const field = riskData.fields.find(
                    f => f.crop === device.crop || f.region === device.area
                );
                if (field) {
                    return {
                        currentRisk: field.currentRisk || field.risk || 0.5,
                        risk: field.currentRisk || field.risk || 0.5,
                        trend: 'stable',
                        rate: 0
                    };
                }
            }
        }
        
        // 最后备用：默认中等风险
        return {
            currentRisk: 0.5,
            risk: 0.5,
            trend: 'stable',
            rate: 0
        };
    }
    
    /**
     * 计算风险趋势
     */
    calculateRiskTrend(predictions) {
        if (!predictions || predictions.length < 2) {
            return 'stable';
        }
        
        const first = predictions[0];
        const last = predictions[predictions.length - 1];
        
        if (last > first * 1.1) {
            return 'rising';
        } else if (last < first * 0.9) {
            return 'falling';
        } else {
            return 'stable';
        }
    }
    
    /**
     * 计算风险变化率
     */
    calculateRiskRate(predictions) {
        if (!predictions || predictions.length < 2) {
            return 0;
        }
        
        const first = predictions[0];
        const last = predictions[predictions.length - 1];
        
        return (last - first) / first;
    }
    
    /**
     * 获取设备历史记录
     */
    getDeviceHistory(device) {
        // 模拟历史记录（实际应从数据服务获取）
        return [
            {
                deviceId: device.id,
                time: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
                todayCount: device.todayCount,
                effectiveness: device.todayCount > 0 ? Math.min(1, device.todayCount / 300) : 0.5
            }
        ];
    }
    
    /**
     * 获取设备成本
     */
    getDeviceCost(device) {
        // 设备类型对应的每小时成本
        const costPerHour = {
            'kill-light': 5,
            'trap': 2,
            'enemy': 3
        };
        
        return costPerHour[device.type] || 5;
    }
    
    /**
     * 获取设备目标（基于作物和病虫害）
     */
    getDeviceTarget(device) {
        // 返回设备目标（如病虫害类型）
        const targetMap = {
            'kill-light': 'general', // 通用杀虫
            'trap': 'specific', // 特定诱捕
            'enemy': 'biological' // 生物防治
        };
        
        return targetMap[device.type] || 'general';
    }

    loadDeviceData() {
        // 模拟设备数据
        this.devices = [
            {
                id: 'kill-light-1',
                name: '风吸式杀虫灯-01号',
                type: 'kill-light',
                area: 'east',
                crop: '大豆',
                position: { top: '20%', left: '20%' },
                status: 'online',
                running: true,
                todayCount: 230,
                totalCount: 15420,
                power: 85,
                lastMaintenance: '2024-01-15'
            },
            {
                id: 'kill-light-2',
                name: '风吸式杀虫灯-02号',
                type: 'kill-light',
                area: 'west',
                crop: '棉花',
                position: { top: '25%', right: '25%' },
                status: 'online',
                running: false,
                todayCount: 0,
                totalCount: 12890,
                power: 92,
                lastMaintenance: '2024-01-10'
            },
            {
                id: 'kill-light-3',
                name: '风吸式杀虫灯-03号',
                type: 'kill-light',
                area: 'north',
                crop: '玉米',
                position: { bottom: '30%', left: '30%' },
                status: 'online',
                running: true,
                todayCount: 180,
                totalCount: 18920,
                power: 78,
                lastMaintenance: '2024-01-20'
            },
            {
                id: 'kill-light-4',
                name: '风吸式杀虫灯-04号',
                type: 'kill-light',
                area: 'south',
                crop: '玉米',
                position: { bottom: '25%', right: '20%' },
                status: 'error',
                running: false,
                todayCount: 0,
                totalCount: 11200,
                power: 0,
                lastMaintenance: '2024-01-05'
            },
            {
                id: 'trap-1',
                name: '性诱捕器-01号',
                type: 'trap',
                area: 'east',
                crop: '大豆',
                position: { top: '15%', left: '50%' },
                status: 'online',
                running: true,
                todayCount: 45,
                totalCount: 3200,
                power: 95,
                lastMaintenance: '2024-01-18'
            },
            {
                id: 'trap-2',
                name: '性诱捕器-02号',
                type: 'trap',
                area: 'west',
                crop: '棉花',
                position: { top: '60%', left: '15%' },
                status: 'online',
                running: false,
                todayCount: 0,
                totalCount: 2800,
                power: 88,
                lastMaintenance: '2024-01-12'
            },
            {
                id: 'trap-3',
                name: '性诱捕器-03号',
                type: 'trap',
                area: 'south',
                crop: '玉米',
                position: { top: '60%', right: '15%' },
                status: 'online',
                running: true,
                todayCount: 38,
                totalCount: 2900,
                power: 90,
                lastMaintenance: '2024-01-22'
            },
            {
                id: 'enemy-1',
                name: '天敌释放器-01号',
                type: 'enemy',
                area: 'north',
                crop: '大豆',
                position: { top: '40%', left: '40%' },
                status: 'online',
                running: true,
                todayCount: 120,
                totalCount: 8500,
                power: 82,
                lastMaintenance: '2024-01-16'
            },
            {
                id: 'enemy-2',
                name: '天敌释放器-02号',
                type: 'enemy',
                area: 'south',
                crop: '棉花',
                position: { top: '40%', right: '40%' },
                status: 'online',
                running: false,
                todayCount: 0,
                totalCount: 7200,
                power: 91,
                lastMaintenance: '2024-01-14'
            }
        ];

        // 初始化设备状态
        this.devices.forEach(device => {
            this.deviceStates.set(device.id, {
                status: device.status,
                running: device.running,
                power: device.power
            });
        });
    }

    bindEvents() {
        // 区域选择
        const areaSelector = document.getElementById('area-selector');
        if (areaSelector) {
            areaSelector.addEventListener('change', (e) => {
                this.selectedArea = e.target.value;
                this.renderDeviceList();
            });
        }

        // 批量控制
        const bulkStart = document.getElementById('bulk-start');
        if (bulkStart) {
            bulkStart.addEventListener('click', () => {
                this.bulkControl('start');
            });
        }

        const bulkStop = document.getElementById('bulk-stop');
        if (bulkStop) {
            bulkStop.addEventListener('click', () => {
                this.bulkControl('stop');
            });
        }
        
        // AI智能控制模式开关（延迟绑定，确保DOM已加载）
        setTimeout(() => {
            const intelligentModeSwitch = document.getElementById('intelligent-mode');
            if (intelligentModeSwitch) {
                console.log('绑定AI智能控制模式开关');
                intelligentModeSwitch.addEventListener('change', (e) => {
                    console.log('AI智能控制模式开关状态:', e.target.checked);
                    if (e.target.checked) {
                        this.enableIntelligentMode();
                    } else {
                        this.disableIntelligentMode();
                    }
                });
            } else {
                console.warn('AI智能控制模式开关元素未找到');
            }
        }, 500);
    }

    renderAreaSelector() {
        const areaSelector = document.getElementById('area-selector');
        if (!areaSelector) return;

        // 只显示允许的三种作物（大豆、玉米、棉花）
        const allowedCrops = ['大豆', '玉米', '棉花'];
        const crops = new Set(['all']);
        
        this.devices.forEach(dev => {
            if (dev.crop && dev.crop !== '未知' && allowedCrops.includes(dev.crop)) {
                crops.add(dev.crop);
            }
        });

        areaSelector.innerHTML = '';
        crops.forEach(crop => {
            const option = document.createElement('option');
            option.value = crop;
            option.innerText = crop === 'all' ? '全部作物' : crop;
            areaSelector.appendChild(option);
        });
    }

    renderDeviceMap() {
        this.renderSVGMap();
        this.renderDeviceIcons();
    }

    renderSVGMap() {
        const svg = document.getElementById('field-boundaries-svg');
        if (!svg) return;

        // 清空SVG
        svg.innerHTML = '';

        // 8个田块多边形路径（与prediction中的一致）
        const fieldPolygons = {
            'field_001': '5,10 27,10 27,20 19,20 19,47 5,47',
            'field_002': '27,10 49,10 49,47 19,47 19,20 27,20',
            'field_003': '49,10 75,10 75,30 95,30 95,47 49,47',
            'field_004': '75,10 95,10 95,30 75,30',
            'field_005': '5,50 29,50 29,91 5,91',
            'field_006': '29,50 52,50 52,91 29,91',
            'field_007': '52,50 70,50 70,91 52,91',
            'field_008': '70,50 95,50 95,91 70,91'
        };

        // 获取田块数据
        let fields = [];
        if (typeof FieldData !== 'undefined' && FieldData.getAllFields) {
            fields = FieldData.getAllFields();
        } else {
            // 备用数据
            fields = [
                { id: 'field_001', name: '001', risk: 0.15 },
                { id: 'field_002', name: '002', risk: 0.25 },
                { id: 'field_003', name: '003', risk: 0.35 },
                { id: 'field_004', name: '004', risk: 0.45 },
                { id: 'field_005', name: '005', risk: 0.20 },
                { id: 'field_006', name: '006', risk: 0.55 },
                { id: 'field_007', name: '007', risk: 0.30 },
                { id: 'field_008', name: '008', risk: 0.40 }
            ];
        }

        // 创建田块多边形
        fields.forEach(field => {
            const polygonPath = fieldPolygons[field.id];
            if (polygonPath) {
                const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
                polygon.setAttribute('points', polygonPath);
                
                // 根据风险等级设置填充颜色
                const fillColor = this.getRiskFillColor(field.risk);
                polygon.setAttribute('fill', fillColor);
                polygon.setAttribute('stroke', 'rgba(255, 255, 255, 0.4)');
                polygon.setAttribute('stroke-width', '0.5');
                polygon.setAttribute('stroke-linejoin', 'round');
                polygon.style.transition = 'all 0.3s ease';
                polygon.dataset.fieldId = field.id;
                polygon.dataset.fieldData = JSON.stringify(field);

                // 悬停效果
                const hoverFillColor = this.getRiskHoverFillColor(field.risk);
                polygon.addEventListener('mouseenter', () => {
                    polygon.setAttribute('fill', hoverFillColor);
                    polygon.setAttribute('stroke', 'rgba(255, 255, 255, 0.6)');
                    polygon.setAttribute('stroke-width', '0.7');
                });

                polygon.addEventListener('mouseleave', () => {
                    polygon.setAttribute('fill', fillColor);
                    polygon.setAttribute('stroke', 'rgba(255, 255, 255, 0.4)');
                    polygon.setAttribute('stroke-width', '0.5');
                });

                svg.appendChild(polygon);
            }
        });
    }

    getRiskFillColor(risk) {
        const riskValue = parseFloat(risk) || 0;
        if (riskValue <= 0.25) {
            return 'rgba(34, 197, 94, 0.5)'; // 低风险 - 绿色
        } else if (riskValue <= 0.5) {
            return 'rgba(234, 179, 8, 0.5)'; // 中风险 - 黄色
        } else if (riskValue <= 0.75) {
            return 'rgba(249, 115, 22, 0.5)'; // 高风险 - 橙色
        } else {
            return 'rgba(239, 68, 68, 0.5)'; // 极高风险 - 红色
        }
    }

    getRiskHoverFillColor(risk) {
        const riskValue = parseFloat(risk) || 0;
        if (riskValue <= 0.25) {
            return 'rgba(34, 197, 94, 0.55)';
        } else if (riskValue <= 0.5) {
            return 'rgba(234, 179, 8, 0.55)';
        } else if (riskValue <= 0.75) {
            return 'rgba(249, 115, 22, 0.55)';
        } else {
            return 'rgba(239, 68, 68, 0.55)';
        }
    }

    renderDeviceIcons() {
        const fieldMap = document.getElementById('field-map');
        
        // 移除旧的设备图标（保留SVG）
        document.querySelectorAll('.device-icon').forEach(icon => {
            if (icon.parentNode === fieldMap) {
                icon.remove();
            }
        });

        // 设备在SVG地图上的位置（基于viewBox 0-100的百分比坐标）
        const devicePositions = {
            'kill-light-1': { x: 16, y: 15 }, // 对应field_001
            'kill-light-2': { x: 38, y: 15 }, // 对应field_002
            'kill-light-3': { x: 62, y: 20 }, // 对应field_003
            'kill-light-4': { x: 85, y: 20 }, // 对应field_004
            'trap-1': { x: 17, y: 70 },       // 对应field_005
            'trap-2': { x: 40, y: 70 },       // 对应field_006
            'trap-3': { x: 61, y: 70 },       // 对应field_007
            'enemy-1': { x: 82, y: 70 },      // 对应field_008
            'enemy-2': { x: 50, y: 45 }        // 中间位置
        };

        // 添加设备图标
        this.devices.forEach(device => {
            const deviceIcon = document.createElement('div');
            deviceIcon.className = `device-icon ${device.id} ${device.status} ${device.running ? 'online' : 'offline'}`;
            
            // 获取位置
            const pos = devicePositions[device.id] || { x: 50, y: 50 };
            deviceIcon.style.position = 'absolute';
            deviceIcon.style.left = `${pos.x}%`;
            deviceIcon.style.top = `${pos.y}%`;
            deviceIcon.style.transform = 'translate(-50%, -50%)';

            // 设置图标
            const iconMap = {
                'kill-light': 'fas fa-lightbulb',
                'trap': 'fas fa-bug',
                'enemy': 'fas fa-dove'
            };
            deviceIcon.innerHTML = `<i class="${iconMap[device.type]}"></i>`;

            // 添加点击事件
            deviceIcon.addEventListener('click', (e) => {
                e.stopPropagation();
                this.showDeviceTooltip(device, deviceIcon);
            });

            fieldMap.appendChild(deviceIcon);
        });
    }

    renderDeviceList() {
        const deviceList = document.getElementById('device-list');
        const filteredDevices = this.selectedArea === 'all' 
            ? this.devices 
            : this.devices.filter(device => device.crop === this.selectedArea);

        deviceList.innerHTML = filteredDevices.map(device => {
            const state = this.deviceStates.get(device.id);
            const statusClass = state.status === 'error' ? 'error' : (state.running ? 'running' : 'stopped');
            const statusText = state.status === 'error' ? '故障' : (state.running ? '运行中' : '已关闭');

            return `
                <div class="device-card">
                    <div class="device-card-header">
                        <div class="device-info">
                            <div class="device-icon-small ${statusClass}">
                                <i class="${this.getDeviceIcon(device.type)}"></i>
                            </div>
                            <div class="device-details">
                                <h4>${device.name}</h4>
                                <p>今日诱捕: ${device.todayCount} 头</p>
                            </div>
                        </div>
                        <div class="device-status ${statusClass}">${statusText}</div>
                    </div>
                    <div class="device-controls">
                        <button class="device-btn start" 
                                onclick="window.GreenControl.controlDevice('${device.id}', 'start')"
                                ${state.status === 'error' || state.running ? 'disabled' : ''}>
                            启动
                        </button>
                        <button class="device-btn stop" 
                                onclick="window.GreenControl.controlDevice('${device.id}', 'stop')"
                                ${state.status === 'error' || !state.running ? 'disabled' : ''}>
                            停止
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    }

    getDeviceIcon(type) {
        const iconMap = {
            'kill-light': 'fas fa-lightbulb',
            'trap': 'fas fa-bug',
            'enemy': 'fas fa-dove'
        };
        return iconMap[type] || 'fas fa-cog';
    }

    showDeviceTooltip(device, element) {
        // 移除现有提示
        document.querySelectorAll('.device-tooltip').forEach(tooltip => {
            tooltip.remove();
        });

        const tooltip = document.createElement('div');
        tooltip.className = 'device-tooltip show';
        
        const state = this.deviceStates.get(device.id);
        const statusText = state.status === 'error' ? '故障' : (state.running ? '运行中' : '已关闭');
        
        tooltip.innerHTML = `
            <h4>${device.name}</h4>
            <p>状态: ${statusText}</p>
            <p>今日诱捕: ${device.todayCount} 头</p>
            <p>累计诱捕: ${device.totalCount} 头</p>
            <p>电量: ${state.power}%</p>
        `;

        // 定位提示框（适配SVG地图，避免被标题栏遮挡）
        const rect = element.getBoundingClientRect();
        const mapContainer = document.querySelector('.map-container');
        const mapRect = document.getElementById('field-map').getBoundingClientRect();
        
        // 获取地图标题栏的实际高度
        const mapHeader = document.querySelector('.map-header');
        const mapHeaderHeight = mapHeader ? mapHeader.offsetHeight : 60;
        
        // 计算设备相对于地图的位置
        const relativeTop = rect.top - mapRect.top;
        const relativeLeft = rect.left - mapRect.left;
        
        // 临时添加到DOM以获取实际尺寸
        document.getElementById('field-map').appendChild(tooltip);
        const tooltipHeight = tooltip.offsetHeight;
        const tooltipWidth = tooltip.offsetWidth;
        
        // 计算可用空间（考虑标题栏）
        const spaceAbove = relativeTop - mapHeaderHeight;
        const spaceBelow = mapRect.height - relativeTop - rect.height;
        const minSpace = tooltipHeight + 30; // 需要的最小空间（包括边距）
        
        // 判断显示位置：如果上方空间不足且下方有足够空间，则显示在下方
        const showBelow = spaceAbove < minSpace && spaceBelow >= minSpace;
        
        // 计算水平位置（确保不超出地图边界）
        let leftPos = relativeLeft + rect.width / 2;
        if (leftPos < tooltipWidth / 2) {
            leftPos = tooltipWidth / 2;
        } else if (leftPos > mapRect.width - tooltipWidth / 2) {
            leftPos = mapRect.width - tooltipWidth / 2;
        }
        
        // 设置位置和样式
        tooltip.style.position = 'absolute';
        tooltip.style.left = `${leftPos}px`;
        
        if (showBelow) {
            // 显示在下方
            tooltip.style.top = `${relativeTop + rect.height + 10}px`;
            tooltip.style.transform = 'translateX(-50%)';
            tooltip.classList.add('tooltip-below');
        } else {
            // 显示在上方（默认）
            tooltip.style.top = `${relativeTop - 10}px`;
            tooltip.style.transform = 'translateX(-50%) translateY(-100%)';
            tooltip.classList.remove('tooltip-below');
        }
        
        tooltip.style.zIndex = '200';

        // 点击其他地方关闭提示
        setTimeout(() => {
            document.addEventListener('click', function closeTooltip() {
                tooltip.remove();
                document.removeEventListener('click', closeTooltip);
            });
        }, 100);
    }

    controlDevice(deviceId, action, options = {}) {
        const device = this.devices.find(d => d.id === deviceId);
        if (!device) return;

        const state = this.deviceStates.get(deviceId);
        
        let notificationMessage = '';
        
        if (action === 'start' && state.status !== 'error') {
            state.running = true;
            notificationMessage = `${device.name} 已启动`;
            
            // 如果是AI决策，显示AI信息
            if (options.aiDecision) {
                notificationMessage += ` (AI推荐)`;
                if (options.confidence) {
                    notificationMessage += ` [置信度: ${Math.round(options.confidence * 100)}%]`;
                }
                if (options.reason) {
                    console.log('AI决策原因:', options.reason);
                }
                if (options.recommendedParams) {
                    console.log('AI推荐参数:', options.recommendedParams);
                    // 应用推荐的参数
                    this.applyRecommendedParams(device, options.recommendedParams);
                }
            }
            
            if (window.controlApp) {
                window.controlApp.showNotification(notificationMessage, 'success');
            } else {
                console.log(notificationMessage);
            }
        } else if (action === 'stop') {
            state.running = false;
            notificationMessage = `${device.name} 已停止`;
            
            // 如果是AI决策，显示AI信息
            if (options.aiDecision) {
                notificationMessage += ` (AI推荐)`;
                if (options.confidence) {
                    notificationMessage += ` [置信度: ${Math.round(options.confidence * 100)}%]`;
                }
                if (options.reason) {
                    console.log('AI决策原因:', options.reason);
                }
            }
            
            if (window.controlApp) {
                window.controlApp.showNotification(notificationMessage, 'info');
            } else {
                console.log(notificationMessage);
            }
        }

        // 更新设备状态
        this.deviceStates.set(deviceId, state);
        device.running = state.running;
        
        // 重新渲染
        this.renderDeviceIcons();
        this.renderDeviceList();
        
        // 模拟设备响应
        this.simulateDeviceResponse(deviceId, action);
    }
    
    /**
     * 应用AI推荐的参数
     */
    applyRecommendedParams(device, params) {
        if (!params) return;
        
        // 这里可以应用推荐的参数（如时间窗口、强度等）
        // 实际实现取决于设备的控制接口
        console.log(`应用AI推荐参数到设备 ${device.name}:`, params);
        
        // 例如：如果推荐了时间窗口，可以设置定时任务
        if (params.timeWindow) {
            console.log(`设置运行时间窗口: ${params.timeWindow.join(', ')}点`);
        }
        
        if (params.intensity) {
            console.log(`设置工作强度: ${params.intensity}`);
        }
    }

    bulkControl(action) {
        const filteredDevices = this.selectedArea === 'all' 
            ? this.devices 
            : this.devices.filter(device => device.crop === this.selectedArea);

        const controllableDevices = filteredDevices.filter(device => {
            const state = this.deviceStates.get(device.id);
            return state.status !== 'error' && 
                   ((action === 'start' && !state.running) || (action === 'stop' && state.running));
        });

        if (controllableDevices.length === 0) {
            window.controlApp.showNotification('没有可操作的设备', 'warning');
            return;
        }

        // 批量更新状态
        controllableDevices.forEach(device => {
            const state = this.deviceStates.get(device.id);
            state.running = action === 'start';
            this.deviceStates.set(device.id, state);
        });

        // 重新渲染
        this.renderDeviceIcons();
        this.renderDeviceList();

        const actionText = action === 'start' ? '启动' : '停止';
        window.controlApp.showNotification(`已${actionText} ${controllableDevices.length} 台设备`, 'success');
    }

    simulateDeviceResponse(deviceId, action) {
        // 模拟设备响应延迟
        setTimeout(() => {
            const deviceIcon = document.querySelector(`.device-icon.${deviceId}`);
            if (deviceIcon) {
                deviceIcon.style.transform = 'scale(1.2)';
                setTimeout(() => {
                    deviceIcon.style.transform = 'scale(1)';
                }, 200);
            }
        }, 500);
    }

    startRealTimeUpdates() {
        // 模拟实时数据更新
        setInterval(() => {
            this.updateDeviceData();
        }, 5000);
    }

    updateDeviceData() {
        // 随机更新一些设备数据
        this.devices.forEach(device => {
            const state = this.deviceStates.get(device.id);
            
            if (state.running && state.status === 'online') {
                // 随机增加诱捕数量
                if (Math.random() < 0.3) {
                    device.todayCount += Math.floor(Math.random() * 5) + 1;
                }
                
                // 随机电量变化
                if (Math.random() < 0.1) {
                    state.power = Math.max(0, state.power - Math.floor(Math.random() * 3));
                    if (state.power < 20) {
                        state.status = 'error';
                        state.running = false;
                        window.controlApp.showNotification(`${device.name} 电量不足，已自动停止`, 'warning');
                    }
                }
            }
            
            this.deviceStates.set(device.id, state);
        });

        // 更新显示
        this.renderDeviceIcons();
        this.renderDeviceList();
    }

    showDeviceDetails(deviceId) {
        const device = this.devices.find(d => d.id === deviceId);
        if (!device) return;

        const state = this.deviceStates.get(deviceId);
        
        const modalContent = document.getElementById('device-modal-content');
        modalContent.innerHTML = `
            <div class="device-detail-content">
                <div class="device-detail-info">
                    <h4>设备信息</h4>
                    <p><strong>设备名称:</strong> ${device.name}</p>
                    <p><strong>设备类型:</strong> ${this.getDeviceTypeName(device.type)}</p>
                    <p><strong>所属区域:</strong> ${this.getAreaName(device.area)}</p>
                    <p><strong>安装位置:</strong> ${device.position.top}, ${device.position.left || device.position.right}</p>
                    <p><strong>最后维护:</strong> ${device.lastMaintenance}</p>
                </div>
                <div class="device-detail-stats">
                    <h4>运行统计</h4>
                    <div class="stat-item">
                        <span class="stat-label">当前状态</span>
                        <span class="stat-value">${state.status === 'error' ? '故障' : (state.running ? '运行中' : '已关闭')}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">今日诱捕</span>
                        <span class="stat-value">${device.todayCount} 头</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">累计诱捕</span>
                        <span class="stat-value">${device.totalCount} 头</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">电量状态</span>
                        <span class="stat-value">${state.power}%</span>
                    </div>
                </div>
            </div>
        `;

        document.getElementById('device-modal-title').textContent = device.name;
        window.controlApp.showModal('device-modal');
    }

    getDeviceTypeName(type) {
        const typeMap = {
            'kill-light': '风吸式杀虫灯',
            'trap': '性诱捕器',
            'enemy': '天敌释放器'
        };
        return typeMap[type] || '未知设备';
    }

    getAreaName(area) {
        const areaMap = {
            'east': '东区 - 蔬菜棚',
            'west': '西区 - 果园',
            'north': '北区 - 水稻田',
            'south': '南区 - 玉米地'
        };
        return areaMap[area] || '未知区域';
    }
}

// 初始化绿色防控模块
let greenControlInstance = null;

document.addEventListener('DOMContentLoaded', () => {
    greenControlInstance = new GreenControl();
    window.GreenControl = greenControlInstance;
});

// 导出类（用于创建新实例）
window.GreenControlClass = GreenControl;

// 也导出实例（如果已经初始化）
if (greenControlInstance) {
    window.GreenControl = greenControlInstance;
}
