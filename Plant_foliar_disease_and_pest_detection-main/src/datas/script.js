// 病虫害识别系统 - JavaScript功能

// 全局变量
let currentImage = null;
let charts = {};
let cameraStream = null;
let mediaRecorder = null;
let recordedChunks = [];
let isRecording = false;
let predictionStartTime = null; // 记录预测开始时间
let currentPredictionResult = null; // 存储当前识别结果

// 病虫害详细信息数据库
const diseaseDatabase = {
    '棉花卷叶病毒害': {
        type: '病毒性病害',
        severity: '高',
        susceptiblePlants: '棉花',
        season: '夏秋季',
        symptoms: '叶片卷曲、黄化、生长迟缓，严重时整株矮化。叶片边缘向内卷曲，叶面出现黄绿相间的斑驳症状，植株生长受到严重影响。',
        controlStrategies: [
            '选用抗病品种，提高植株抗病能力',
            '及时清除田间杂草，减少病毒传播媒介',
            '合理密植，改善田间通风透光条件',
            '加强田间管理，及时施肥浇水',
            '发现病株及时拔除并销毁',
            '使用病毒抑制剂进行化学防治'
        ],
        relatedDiseases: ['棉花黄萎病', '棉花枯萎病', '棉花叶斑病'],
        relatedPests: ['棉蚜', '棉铃虫', '棉叶螨'],
        prevention: ['种子消毒', '轮作倒茬', '生物防治']
    },
    '棉花叶蝉虫病害': {
        type: '虫害',
        severity: '中',
        susceptiblePlants: '棉花',
        season: '夏秋季',
        symptoms: '叶片出现黄白色斑点，严重时叶片枯黄脱落。叶蝉刺吸叶片汁液，造成叶片失绿，影响光合作用，导致植株生长不良。',
        controlStrategies: [
            '利用天敌如瓢虫、草蛉等进行生物防治',
            '使用黄色粘虫板诱杀成虫',
            '合理使用杀虫剂，避免产生抗药性',
            '加强田间管理，及时清除杂草',
            '种植诱虫植物，集中防治',
            '采用物理防治方法如灯光诱杀'
        ],
        relatedDiseases: ['棉花叶斑病', '棉花炭疽病'],
        relatedPests: ['棉蚜', '棉铃虫', '棉叶螨'],
        prevention: ['天敌保护', '环境调控', '抗虫品种']
    },
    '玉米大斑病': {
        type: '真菌性病害',
        severity: '高',
        susceptiblePlants: '玉米',
        season: '夏秋季',
        symptoms: '叶片上出现大型椭圆形病斑，病斑中央灰白色，边缘深褐色。严重时病斑连片，叶片枯死，影响玉米产量和品质。',
        controlStrategies: [
            '选用抗病品种，提高植株抗病能力',
            '合理密植，改善田间通风透光条件',
            '及时清除田间病残体，减少病原菌',
            '轮作倒茬，避免连作',
            '使用杀菌剂进行化学防治',
            '加强田间管理，提高植株抗病性'
        ],
        relatedDiseases: ['玉米小斑病', '玉米锈病', '玉米灰斑病'],
        relatedPests: ['玉米螟', '粘虫', '蚜虫'],
        prevention: ['品种选择', '栽培管理', '化学防治']
    }
};

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function () {
    initializeApp();
    checkAPIStatus();
    setupEventListeners();
});


// 初始化应用
function initializeApp() {
    console.log('病虫害识别系统初始化...');

    // 初始化图表
    initializeCharts();
}

// 设置事件监听器
function setupEventListeners() {
    console.log('设置事件监听器...');

    // 文件上传
    const uploadArea = document.getElementById('upload-area');
    const imageInput = document.getElementById('image-input');

    console.log('上传区域:', uploadArea);
    console.log('文件输入:', imageInput);

    uploadArea.addEventListener('click', () => imageInput.click());
    uploadArea.addEventListener('dragover', handleDragOver);
    uploadArea.addEventListener('dragleave', handleDragLeave);
    uploadArea.addEventListener('drop', handleDrop);

    imageInput.addEventListener('change', handleFileSelect);

    // 按钮事件
    const predictBtn = document.getElementById('predict-btn');
    const clearBtn = document.getElementById('clear-btn');
    const cameraBtn = document.getElementById('camera-btn');
    const captureBtn = document.getElementById('capture-btn');
    const recordBtn = document.getElementById('record-btn');
    const stopRecordBtn = document.getElementById('stop-record-btn');
    const stopCameraBtn = document.getElementById('stop-camera-btn');

    console.log('预测按钮:', predictBtn);
    console.log('清除按钮:', clearBtn);
    console.log('摄像头按钮:', cameraBtn);

    if (predictBtn) {
        predictBtn.addEventListener('click', predictImage);
        console.log('预测按钮事件监听器已添加');
    } else {
        console.error('找不到预测按钮元素');
    }

    if (clearBtn) {
        clearBtn.addEventListener('click', clearImage);
        console.log('清除按钮事件监听器已添加');
    } else {
        console.error('找不到清除按钮元素');
    }

    if (cameraBtn) {
        cameraBtn.addEventListener('click', openCamera);
        console.log('摄像头按钮事件监听器已添加');
    } else {
        console.error('找不到摄像头按钮元素');
    }

    if (captureBtn) {
        captureBtn.addEventListener('click', captureImage);
        console.log('拍照按钮事件监听器已添加');
    } else {
        console.error('找不到拍照按钮元素');
    }

    if (recordBtn) {
        recordBtn.addEventListener('click', startRecording);
        console.log('开始录像按钮事件监听器已添加');
    } else {
        console.error('找不到开始录像按钮元素');
    }

    if (stopRecordBtn) {
        stopRecordBtn.addEventListener('click', stopRecording);
        console.log('结束录像按钮事件监听器已添加');
    } else {
        console.error('找不到结束录像按钮元素');
    }

    if (stopCameraBtn) {
        stopCameraBtn.addEventListener('click', stopCamera);
        console.log('关闭摄像头按钮事件监听器已添加');
    } else {
        console.error('找不到关闭摄像头按钮元素');
    }

    // 收录按钮事件
    const collectBtn = document.getElementById('collect-btn');
    if (collectBtn) {
        collectBtn.addEventListener('click', handleCollectDisease);
        console.log('收录按钮事件监听器已添加');
    } else {
        console.error('找不到收录按钮元素');
    }
}


// 检查API状态并自动启动
async function checkAPIStatusAndAutoStart() {
    const statusDiv = document.getElementById('apiStatus');

    try {
        const response = await fetch('http://localhost:8000/api/health');
        const data = await response.json();

        if (data.status === 'healthy') {
            statusDiv.innerHTML = `
                <div class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg flex items-center">
                    <i class="fas fa-check-circle mr-2"></i>
                    API服务正常运行，模型已加载
                </div>
            `;
        } else {
            throw new Error('API状态异常');
        }
    } catch (error) {
        console.log('API服务未启动，尝试自动启动...');
        statusDiv.innerHTML = `
            <div class="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded-lg flex items-center">
                <i class="fas fa-spinner fa-spin mr-2"></i>
                正在自动启动API服务，请稍候...
            </div>
        `;

        // 尝试自动启动API
        await autoStartAPI();
    }
}

// 自动启动API服务
async function autoStartAPI() {
    try {
        console.log('正在启动API服务...');

        // 显示启动状态
        const statusDiv = document.getElementById('apiStatus');
        statusDiv.innerHTML = `
            <div class="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded-lg flex items-center">
                <i class="fas fa-cog fa-spin mr-2"></i>
                正在启动API服务，这可能需要几秒钟...
            </div>
        `;

        // 启动API服务器
        const response = await fetch('http://localhost:8002/api/start', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            // 等待API启动
            await waitForAPI();
        } else {
            throw new Error('启动API失败');
        }

    } catch (error) {
        console.error('自动启动API失败:', error);
        const statusDiv = document.getElementById('apiStatus');
        statusDiv.innerHTML = `
            <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg flex items-center">
                <i class="fas fa-exclamation-triangle mr-2"></i>
                自动启动失败，请手动启动API服务
                <button onclick="location.reload()" class="ml-4 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm">
                    重试
                </button>
            </div>
        `;
    }
}

// 等待API启动
async function waitForAPI() {
    const maxAttempts = 30; // 最多等待30秒
    let attempts = 0;

    while (attempts < maxAttempts) {
        try {
            const response = await fetch('http://localhost:8000/api/health');
            const data = await response.json();

            if (data.status === 'healthy') {
                const statusDiv = document.getElementById('apiStatus');
                statusDiv.innerHTML = `
                    <div class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg flex items-center">
                        <i class="fas fa-check-circle mr-2"></i>
                        API服务已自动启动，模型已加载
                    </div>
                `;
                console.log('API服务启动成功！');
                return;
            }
        } catch (error) {
            // API还未启动，继续等待
        }

        attempts++;
        await new Promise(resolve => setTimeout(resolve, 1000)); // 等待1秒
    }

    throw new Error('API启动超时');
}

// 检查API状态（保留原函数用于手动检查）
async function checkAPIStatus() {
    const statusDiv = document.getElementById('apiStatus');

    try {
        const response = await fetch('http://localhost:8000/api/health');
        const data = await response.json();

        if (data.status === 'healthy') {
            statusDiv.innerHTML = `
                <div class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg flex items-center text-[1.05rem]">
                    <i class="fas fa-check-circle mr-2"></i>
                    模型基于超3000张病虫害图像数据集，采用深度学习网络进行分类，在测试集上总体准确率超99%。
                </div>
            `;
        } else {
            throw new Error('API状态异常');
        }
    } catch (error) {
        statusDiv.innerHTML = `
            <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg flex items-center">
                <i class="fas fa-exclamation-triangle mr-2"></i>
                API服务未启动，请先启动后端服务
            </div>
        `;
    }
}

// 拖拽处理
function handleDragOver(e) {
    e.preventDefault();
    e.currentTarget.classList.add('dragover');
}

function handleDragLeave(e) {
    e.preventDefault();
    e.currentTarget.classList.remove('dragover');
}

function handleDrop(e) {
    e.preventDefault();
    e.currentTarget.classList.remove('dragover');

    const files = e.dataTransfer.files;
    if (files.length > 0) {
        handleFile(files[0]);
    }
}

// 文件选择处理
function handleFileSelect(e) {
    const file = e.target.files[0];
    if (file) {
        handleFile(file);
    }
}

// 处理文件
function handleFile(file) {
    console.log('=== 视频支持调试 ===');
    console.log('处理文件:', file.name, '类型:', file.type);
    console.log('当前时间:', new Date().toLocaleTimeString());

    // 检查文件类型
    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');
    const isMP4 = file.name.toLowerCase().endsWith('.mp4') || file.type === 'video/mp4';

    if (!isImage && !isVideo && !isMP4) {
        alert('请选择图像或视频文件（支持 JPG, PNG, JPEG, MP4, AVI, MOV 格式）');
        return;
    }

    if (isImage) {
        // 处理图像文件
        console.log('处理图像文件');
        const reader = new FileReader();
        reader.onload = function (e) {
            currentImage = file;
            showImagePreview(e.target.result);
            // 更新图像尺寸
            updateImageSize();
        };
        reader.readAsDataURL(file);
    } else if (isVideo || isMP4) {
        // 处理视频文件（包括.mp4）
        console.log('处理视频文件');
        currentImage = file;
        showVideoPreview(file);
        // 视频文件不显示图像尺寸
        const imageSize = document.getElementById('image-size');
        if (imageSize) {
            imageSize.textContent = '视频文件';
        }
    }
}

// 显示图像预览
function showImagePreview(imageSrc) {
    const previewDiv = document.getElementById('image-preview');
    const videoPreviewDiv = document.getElementById('video-preview');
    const previewImg = document.getElementById('preview-img');
    const uploadArea = document.getElementById('upload-area');

    // 隐藏视频预览，显示图像预览
    videoPreviewDiv.classList.add('hidden');
    previewImg.src = imageSrc;
    previewDiv.classList.remove('hidden');
    uploadArea.classList.add('hidden'); // 隐藏上传区域

    // 清除之前的预测结果
    clearPredictionResult();
}

// 显示视频预览
function showVideoPreview(videoFile) {
    const previewDiv = document.getElementById('image-preview');
    const videoPreviewDiv = document.getElementById('video-preview');
    const previewVideo = document.getElementById('preview-video');
    const uploadArea = document.getElementById('upload-area');

    // 隐藏图像预览，显示视频预览
    previewDiv.classList.add('hidden');
    previewVideo.src = URL.createObjectURL(videoFile);
    videoPreviewDiv.classList.remove('hidden');
    uploadArea.classList.add('hidden'); // 隐藏上传区域

    // 清除之前的预测结果
    clearPredictionResult();

    // 设置提取帧按钮事件
    setupFrameExtraction();
}

// 清除图像
function clearImage() {
    currentImage = null;

    const uploadArea = document.getElementById('upload-area');
    const cameraPreview = document.getElementById('camera-preview');
    const videoPreview = document.getElementById('video-preview');

    document.getElementById('image-preview').classList.add('hidden');
    document.getElementById('video-preview').classList.add('hidden');
    document.getElementById('image-input').value = '';

    // 关闭摄像头（如果正在使用）
    stopCamera();

    // 重新显示上传区域
    uploadArea.classList.remove('hidden');
    cameraPreview.classList.add('hidden');
    videoPreview.classList.add('hidden');

    clearPredictionResult();
}

// 预测图像
async function predictImage() {
    console.log('predictImage函数被调用');
    console.log('currentImage:', currentImage);

    if (!currentImage) {
        alert('请先上传图像');
        return;
    }

    const predictBtn = document.getElementById('predict-btn');
    const resultDiv = document.getElementById('prediction-result');

    console.log('按钮元素:', predictBtn);
    console.log('结果元素:', resultDiv);

    // 记录预测开始时间
    predictionStartTime = Date.now();

    // 更新图像尺寸
    updateImageSize();

    // 显示加载状态
    predictBtn.disabled = true;

    try {
        const formData = new FormData();
        formData.append('image', currentImage);

        console.log('发送预测请求到:', 'http://localhost:8000/api/predict');

        const response = await fetch('http://localhost:8000/api/predict', {
            method: 'POST',
            body: formData
        });

        console.log('响应状态:', response.status);
        console.log('响应头:', response.headers);

        const result = await response.json();
        console.log('预测结果:', result);

        if (response.ok) {
            // API服务器直接返回预测结果，不需要success字段
            showPredictionResult(result);
        } else {
            throw new Error(result.error || '预测失败');
        }
    } catch (error) {
        console.error('预测错误:', error);
        showError('预测失败: ' + error.message);
    } finally {
        predictBtn.disabled = false;
    }
}

// 显示预测结果
function showPredictionResult(result) {
    console.log('显示预测结果:', result);

    const resultDiv = document.getElementById('prediction-result');
    const resultDisplay = document.getElementById('result-display');

    console.log('结果元素:', resultDiv, resultDisplay);

    // 隐藏默认状态，显示结果
    if (resultDiv) resultDiv.classList.add('hidden');
    if (resultDisplay) resultDisplay.classList.remove('hidden');

    const predictions = result.predictions || [];
    console.log('预测结果数组:', predictions);

    if (predictions.length === 0) {
        console.error('没有预测结果');
        return;
    }

    const maxPrediction = predictions.reduce((max, pred) =>
        pred.confidence > max.confidence ? pred : max, predictions[0]);

    console.log('最大预测结果:', maxPrediction);

    // 更新主要结果
    const mainResult = document.getElementById('main-result');
    const mainConfidence = document.getElementById('main-confidence');
    const mainProgress = document.getElementById('main-progress');

    console.log('主要结果元素:', mainResult, mainConfidence, mainProgress);

    if (mainResult) {
        mainResult.textContent = maxPrediction.class_name;
        mainResult.classList.remove('text-green-600');
        mainResult.classList.add('text-green-700');
        console.log('更新主要结果:', maxPrediction.class_name);
    }
    if (mainConfidence) {
        mainConfidence.textContent = (maxPrediction.confidence * 100).toFixed(1) + '%';
        mainConfidence.classList.remove('text-green-600');
        mainConfidence.classList.add('text-green-700');
        console.log('更新置信度:', (maxPrediction.confidence * 100).toFixed(1) + '%');
    }
    if (mainProgress) {
        mainProgress.style.width = (maxPrediction.confidence * 100) + '%';
        console.log('更新进度条:', (maxPrediction.confidence * 100) + '%');
    }

    // 更新其他结果
    const otherResults = predictions.slice(1, 3); // 取前3个结果（除了第一个）
    console.log('其他结果:', otherResults);

    for (let i = 0; i < 2; i++) {
        const resultElement = document.getElementById(`result-${i + 2}`);
        const confidenceElement = document.getElementById(`confidence-${i + 2}`);
        const progressElement = document.getElementById(`progress-${i + 2}`);

        if (otherResults[i]) {
            const pred = otherResults[i];
            const confidencePercent = (pred.confidence * 100).toFixed(1);

            if (resultElement) {
                resultElement.textContent = pred.class_name;
                console.log(`更新结果${i + 2}:`, pred.class_name);
            }
            if (confidenceElement) {
                confidenceElement.textContent = confidencePercent + '%';
                console.log(`更新置信度${i + 2}:`, confidencePercent + '%');
            }
            if (progressElement) {
                progressElement.style.width = confidencePercent + '%';
                console.log(`更新进度条${i + 2}:`, confidencePercent + '%');
            }
        } else {
            // 如果没有更多结果，隐藏这些元素
            const container = resultElement ? resultElement.closest('.flex') : null;
            if (container) container.style.display = 'none';
        }
    }

    // 更新识别详情（真实数值）
    updateRecognitionDetails(result);

    // 显示病虫害详细信息
    showDiseaseDetails(maxPrediction.class_name);

    // 生成知识图谱
    generateKnowledgeGraph(maxPrediction.class_name);

    // 保存当前识别结果，供收录功能使用
    currentPredictionResult = {
        diseaseName: maxPrediction.class_name,
        confidence: maxPrediction.confidence,
        allPredictions: predictions
    };

}

// 更新识别详情
function updateRecognitionDetails(result) {
    // 更新识别时间
    const recognitionTime = document.getElementById('recognition-time');
    if (recognitionTime) {
        const now = new Date();
        recognitionTime.textContent = now.toLocaleString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    }

    // 更新处理时间
    const processingTime = document.getElementById('processing-time');
    if (processingTime && predictionStartTime) {
        const elapsed = (Date.now() - predictionStartTime) / 1000; // 转换为秒
        processingTime.textContent = elapsed.toFixed(2) + '秒';
    }

    // 更新模型版本（从API响应中获取，如果没有则使用默认值）
    const modelVersion = document.getElementById('model-version');
    if (modelVersion) {
        const version = result.model_version || result.version || 'v2.1.0';
        modelVersion.textContent = version;
    }

    // 图像尺寸已经在predictImage开始时更新
}

// 更新图像尺寸
function updateImageSize() {
    const imageSize = document.getElementById('image-size');
    if (imageSize && currentImage) {
        // 如果currentImage是File对象
        if (currentImage instanceof File || currentImage instanceof Blob) {
            // 创建图片对象来获取真实尺寸
            const img = new Image();
            const url = URL.createObjectURL(currentImage);
            img.onload = function () {
                imageSize.textContent = img.width + '×' + img.height;
                URL.revokeObjectURL(url); // 释放URL
            };
            img.onerror = function () {
                // 如果无法加载，尝试使用文件名推断或显示默认值
                imageSize.textContent = '未知';
                URL.revokeObjectURL(url);
            };
            img.src = url;
        } else if (currentImage.src) {
            // 如果currentImage是img元素
            const img = new Image();
            img.onload = function () {
                imageSize.textContent = img.width + '×' + img.height;
            };
            img.src = currentImage.src;
        } else {
            imageSize.textContent = '未知';
        }
    }
}

// 显示错误
function showError(message) {
    const resultDiv = document.getElementById('prediction-result');
    resultDiv.innerHTML = `
        <div class="text-center py-8">
            <i class="fas fa-exclamation-triangle text-4xl text-red-500 mb-4"></i>
            <p class="text-red-600">${message}</p>
        </div>
    `;
}

// 显示病虫害详细信息
function showDiseaseDetails(diseaseName) {
    console.log('显示病虫害详细信息:', diseaseName);

    const diseaseInfo = diseaseDatabase[diseaseName];
    if (!diseaseInfo) {
        console.log('未找到病虫害信息:', diseaseName);
        return;
    }

    // 更新基本信息
    document.getElementById('disease-type').textContent = diseaseInfo.type;
    document.getElementById('severity-level').textContent = diseaseInfo.severity;
    document.getElementById('susceptible-plants').textContent = diseaseInfo.susceptiblePlants;
    document.getElementById('disease-season').textContent = diseaseInfo.season;

    // 更新症状描述
    document.getElementById('symptom-description').textContent = diseaseInfo.symptoms;

    // 更新防控策略
    const strategiesContainer = document.getElementById('control-strategies');
    strategiesContainer.innerHTML = '';

    diseaseInfo.controlStrategies.forEach((strategy, index) => {
        const strategyDiv = document.createElement('div');
        strategyDiv.className = 'flex items-start space-x-2 text-lg text-gray-700';
        strategyDiv.innerHTML = `
            <span class="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-semibold">${index + 1}</span>
            <span class="leading-relaxed">${strategy}</span>
        `;
        strategiesContainer.appendChild(strategyDiv);
    });
}

// 生成知识图谱
function generateKnowledgeGraph(diseaseName) {
    console.log('生成知识图谱:', diseaseName);

    const diseaseInfo = diseaseDatabase[diseaseName];
    if (!diseaseInfo) {
        console.log('未找到病虫害信息:', diseaseName);
        return;
    }

    const graphContainer = document.getElementById('knowledge-graph');

    // 创建SVG画布
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '450');
    svg.setAttribute('viewBox', '0 0 750 450');
    svg.className = 'w-full h-full';

    // 根据病害类型定义不同的知识图谱结构
    // 放大系数：1.5
    const scale = 1.5;
    let nodes = [];
    if (diseaseName === '玉米大斑病') {
        // 玉米大斑病知识图谱 - 农业科普类内容
        nodes = [
            { id: 'center', name: '玉米大斑病', x: 250 * scale, y: 150 * scale, type: 'center', category: '核心病害' },

            // 病害识别类
            { id: 'disease1', name: '玉米小斑病', x: 150 * scale, y: 80 * scale, type: 'disease', category: '易混淆病害' },
            { id: 'disease2', name: '玉米锈病', x: 350 * scale, y: 80 * scale, type: 'disease', category: '常见病害' },
            { id: 'disease3', name: '玉米灰斑病', x: 150 * scale, y: 220 * scale, type: 'disease', category: '相似病害' },

            // 虫害关联
            { id: 'pest1', name: '玉米螟', x: 350 * scale, y: 220 * scale, type: 'pest', category: '主要虫害' },
            { id: 'pest2', name: '粘虫', x: 100 * scale, y: 150 * scale, type: 'pest', category: '迁飞害虫' },
            { id: 'pest3', name: '蚜虫', x: 400 * scale, y: 150 * scale, type: 'pest', category: '刺吸害虫' },

            // 防治技术
            { id: 'control1', name: '抗病品种', x: 250 * scale, y: 50 * scale, type: 'control', category: '预防措施' },
            { id: 'control2', name: '药剂防治', x: 250 * scale, y: 250 * scale, type: 'control', category: '治疗措施' }
        ];
    } else if (diseaseName === '棉花卷叶病毒害') {
        // 棉花卷叶病毒害知识图谱
        nodes = [
            { id: 'center', name: '棉花卷叶病毒害', x: 250 * scale, y: 150 * scale, type: 'center', category: '核心病害' },
            { id: 'disease1', name: '棉花黄萎病', x: 150 * scale, y: 80 * scale, type: 'disease', category: '真菌病害' },
            { id: 'disease2', name: '棉花枯萎病', x: 350 * scale, y: 80 * scale, type: 'disease', category: '土传病害' },
            { id: 'disease3', name: '棉花叶斑病', x: 150 * scale, y: 220 * scale, type: 'disease', category: '叶部病害' },
            { id: 'pest1', name: '棉蚜', x: 350 * scale, y: 220 * scale, type: 'pest', category: '传毒媒介' },
            { id: 'pest2', name: '棉铃虫', x: 100 * scale, y: 150 * scale, type: 'pest', category: '主要害虫' },
            { id: 'pest3', name: '棉叶螨', x: 400 * scale, y: 150 * scale, type: 'pest', category: '刺吸害虫' },
            { id: 'control1', name: '种子消毒', x: 250 * scale, y: 50 * scale, type: 'control', category: '预防措施' },
            { id: 'control2', name: '轮作倒茬', x: 250 * scale, y: 250 * scale, type: 'control', category: '农业防治' }
        ];
    } else if (diseaseName === '棉花叶蝉虫病害') {
        // 棉花叶蝉虫病害知识图谱
        nodes = [
            { id: 'center', name: '棉花叶蝉虫病害', x: 250 * scale, y: 150 * scale, type: 'center', category: '核心虫害' },
            { id: 'disease1', name: '棉花叶斑病', x: 150 * scale, y: 80 * scale, type: 'disease', category: '诱发病害' },
            { id: 'disease2', name: '棉花炭疽病', x: 350 * scale, y: 80 * scale, type: 'disease', category: '次生病害' },
            { id: 'pest1', name: '棉蚜', x: 150 * scale, y: 220 * scale, type: 'pest', category: '同科害虫' },
            { id: 'pest2', name: '棉铃虫', x: 350 * scale, y: 220 * scale, type: 'pest', category: '鳞翅目害虫' },
            { id: 'pest3', name: '棉叶螨', x: 100 * scale, y: 150 * scale, type: 'pest', category: '刺吸害虫' },
            { id: 'control1', name: '天敌保护', x: 250 * scale, y: 50 * scale, type: 'control', category: '生物防治' },
            { id: 'control2', name: '环境调控', x: 250 * scale, y: 250 * scale, type: 'control', category: '生态防治' }
        ];
    }

    // 绘制连接线
    nodes.forEach(node => {
        if (node.id !== 'center') {
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', nodes[0].x);
            line.setAttribute('y1', nodes[0].y);
            line.setAttribute('x2', node.x);
            line.setAttribute('y2', node.y);

            // 根据连接类型设置不同的线条样式
            if (node.type === 'disease') {
                line.setAttribute('stroke', '#f59e0b');
                line.setAttribute('stroke-width', '3');
                line.setAttribute('stroke-dasharray', '7.5,7.5');
            } else if (node.type === 'pest') {
                line.setAttribute('stroke', '#10b981');
                line.setAttribute('stroke-width', '3');
                line.setAttribute('stroke-dasharray', '4.5,4.5');
            } else if (node.type === 'control') {
                line.setAttribute('stroke', '#8b5cf6');
                line.setAttribute('stroke-width', '4.5');
            }

            svg.appendChild(line);
        }
    });

    // 绘制节点
    nodes.forEach(node => {
        // 节点圆圈
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', node.x);
        circle.setAttribute('cy', node.y);
        circle.setAttribute('r', node.type === 'center' ? '75' : '40');

        // 根据类型设置颜色
        let color = '#3b82f6'; // 默认蓝色
        if (node.type === 'center') color = '#ef4444'; // 中心节点红色
        else if (node.type === 'disease') color = '#f59e0b'; // 病害橙色
        else if (node.type === 'pest') color = '#10b981'; // 害虫绿色
        else if (node.type === 'control') color = '#8b5cf6'; // 防治紫色

        circle.setAttribute('fill', color);
        circle.setAttribute('stroke', '#ffffff');
        circle.setAttribute('stroke-width', '4.5');
        svg.appendChild(circle);

        // 节点文字
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', node.x);
        text.setAttribute('y', node.y + 12);
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('font-size', node.type === 'center' ? '19' : '17');
        text.setAttribute('fill', '#ffffff');
        text.setAttribute('font-weight', 'bold');
        // 中心节点不截断文字，其他节点超过8个字符才截断
        text.textContent = node.type === 'center' ? node.name : (node.name.length > 8 ? node.name.substring(0, 8) + '...' : node.name);
        svg.appendChild(text);

        // 添加分类标签
        if (node.category) {
            const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            label.setAttribute('x', node.x);
            label.setAttribute('y', node.y + (node.type === 'center' ? 95 : 60));
            label.setAttribute('text-anchor', 'middle');
            label.setAttribute('font-size', '14');
            label.setAttribute('fill', '#6b7280');
            label.textContent = node.category;
            svg.appendChild(label);
        }
    });

    // 添加图例
    const legend = document.createElement('div');
    legend.className = 'mt-6 grid grid-cols-2 gap-4 text-sm';
    legend.innerHTML = `
        <div class="space-y-2">
            <h6 class="font-semibold text-gray-700 mb-2">节点类型</h6>
            <div class="flex items-center space-x-2">
                <div class="w-4 h-4 bg-red-500 rounded-full"></div>
                <span class="whitespace-nowrap">核心病害</span>
            </div>
            <div class="flex items-center space-x-2">
                <div class="w-4 h-4 bg-orange-500 rounded-full"></div>
                <span class="whitespace-nowrap">相关病害</span>
            </div>
            <div class="flex items-center space-x-2">
                <div class="w-4 h-4 bg-green-500 rounded-full"></div>
                <span class="whitespace-nowrap">相关害虫</span>
            </div>
            <div class="flex items-center space-x-2">
                <div class="w-4 h-4 bg-purple-500 rounded-full"></div>
                <span class="whitespace-nowrap">防治措施</span>
            </div>
        </div>
        <div class="space-y-2">
            <h6 class="font-semibold text-gray-700 mb-2">连接类型</h6>
            <div class="flex items-center space-x-2">
                <div class="w-8 h-0.5 bg-orange-500" style="border-top: 2px dashed #f59e0b;"></div>
                <span class="whitespace-nowrap">病害关联</span>
            </div>
            <div class="flex items-center space-x-2">
                <div class="w-8 h-0.5 bg-green-500" style="border-top: 2px dashed #10b981;"></div>
                <span class="whitespace-nowrap">虫害关联</span>
            </div>
            <div class="flex items-center space-x-2">
                <div class="w-8 h-1 bg-purple-500"></div>
                <span class="whitespace-nowrap">防治关系</span>
            </div>
        </div>
    `;

    // 清空容器并添加新内容
    graphContainer.innerHTML = '';
    graphContainer.appendChild(svg);
    graphContainer.appendChild(legend);
}


// 清除预测结果
function clearPredictionResult() {
    const resultDiv = document.getElementById('prediction-result');
    const resultDisplay = document.getElementById('result-display');

    // 显示默认状态，隐藏结果
    resultDiv.classList.remove('hidden');
    resultDisplay.classList.add('hidden');

    // 重置结果显示
    resultDiv.innerHTML = `
        <div class="text-center py-12">
            <i class="fas fa-microscope text-6xl text-gray-300 mb-4"></i>
            <p class="text-gray-500 text-lg">请上传图像开始识别</p>
        </div>
    `;

    // 重置主要结果显示
    const mainResult = document.getElementById('main-result');
    const mainConfidence = document.getElementById('main-confidence');
    const mainProgress = document.getElementById('main-progress');

    if (mainResult) {
        mainResult.textContent = '请上传图像开始识别';
        mainResult.classList.remove('text-green-700');
        mainResult.classList.add('text-green-600');
    }
    if (mainConfidence) {
        mainConfidence.textContent = '0.0%';
        mainConfidence.classList.remove('text-green-700');
        mainConfidence.classList.add('text-green-600');
    }
    if (mainProgress) {
        mainProgress.style.width = '0%';
    }

    // 重置其他结果显示
    for (let i = 2; i <= 3; i++) {
        const resultElement = document.getElementById(`result-${i}`);
        const confidenceElement = document.getElementById(`confidence-${i}`);
        const progressElement = document.getElementById(`progress-${i}`);

        if (resultElement) {
            resultElement.textContent = '等待识别...';
            const container = resultElement.closest('.flex');
            if (container) container.style.display = 'flex';
        }
        if (confidenceElement) {
            confidenceElement.textContent = '0.0%';
        }
        if (progressElement) {
            progressElement.style.width = '0.0%';
        }
    }

    // 重置识别详情（如果当前没有图片）
    if (!currentImage) {
        const recognitionTime = document.getElementById('recognition-time');
        const processingTime = document.getElementById('processing-time');
        const imageSize = document.getElementById('image-size');

        if (recognitionTime) {
            recognitionTime.textContent = '待识别';
        }
        if (processingTime) {
            processingTime.textContent = '计算中...';
        }
        if (imageSize) {
            imageSize.textContent = '待上传';
        }
    }

    // 重置病虫害详细信息
    document.getElementById('disease-type').textContent = '-';
    document.getElementById('severity-level').textContent = '-';
    document.getElementById('susceptible-plants').textContent = '-';
    document.getElementById('disease-season').textContent = '-';
    document.getElementById('symptom-description').textContent = '-';
    document.getElementById('control-strategies').innerHTML = '<div class="text-lg text-gray-700">-</div>';

    // 重置知识图谱
    const graphContainer = document.getElementById('knowledge-graph');
    graphContainer.innerHTML = `
        <div class="text-center text-gray-500">
            <i class="fas fa-network-wired text-3xl mb-2"></i>
            <p class="text-lg">知识图谱加载中...</p>
        </div>
    `;

}

// 使用示例图像
function useExampleImage(exampleType) {
    console.log('使用示例图像:', exampleType);

    const examples = {
        'example1': {
            url: 'images/棉花卷叶病毒害.jpg',
            name: '棉花卷叶病毒害',
            predictions: [
                { class_name: '棉花卷叶病毒害', confidence: 0.999 },
                { class_name: '棉花叶蝉虫病害', confidence: 0.001 },
                { class_name: '玉米大斑病', confidence: 0.000 }
            ]
        },
        'example2': {
            url: 'images/棉花叶蝉虫病害.jpg',
            name: '棉花叶蝉虫病害',
            predictions: [
                { class_name: '棉花叶蝉虫病害', confidence: 0.998 },
                { class_name: '棉花卷叶病毒害', confidence: 0.001 },
                { class_name: '玉米大斑病', confidence: 0.001 }
            ]
        },
        'example3': {
            url: 'images/玉米大斑病.jpg',
            name: '玉米大斑病',
            predictions: [
                { class_name: '玉米大斑病', confidence: 0.997 },
                { class_name: '棉花卷叶病毒害', confidence: 0.002 },
                { class_name: '棉花叶蝉虫病害', confidence: 0.001 }
            ]
        }
    };

    const example = examples[exampleType];
    if (example) {
        console.log('加载示例:', example);

        // 直接显示图片预览
        showImagePreview(example.url);

        // 模拟识别结果
        setTimeout(() => {
            console.log('显示识别结果:', example.predictions);
            showPredictionResult({ predictions: example.predictions });
        }, 1000);
    }
}

// 初始化图表
function initializeCharts() {
    // 这里可以初始化一些基础图表
    console.log('图表初始化完成');
}








// 工具函数：格式化数字
function formatNumber(num, decimals = 2) {
    return parseFloat(num).toFixed(decimals);
}

// 工具函数：格式化百分比
function formatPercentage(num) {
    return (num * 100).toFixed(1) + '%';
}

// 摄像头相关函数
async function openCamera() {
    try {
        console.log('正在打开摄像头...');

        // 请求摄像头权限
        cameraStream = await navigator.mediaDevices.getUserMedia({
            video: {
                width: { ideal: 640 },
                height: { ideal: 480 },
                facingMode: 'environment' // 使用后置摄像头
            }
        });

        const video = document.getElementById('camera-video');
        const cameraPreview = document.getElementById('camera-preview');
        const uploadArea = document.getElementById('upload-area');

        video.srcObject = cameraStream;
        cameraPreview.classList.remove('hidden');
        uploadArea.classList.add('hidden');

        console.log('摄像头已打开');

    } catch (error) {
        console.error('打开摄像头失败:', error);
        alert('无法访问摄像头，请检查权限设置或尝试使用文件上传功能');
    }
}

function captureImage() {
    try {
        const video = document.getElementById('camera-video');
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        // 设置canvas尺寸
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // 绘制视频帧到canvas
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        // 显示拍照反馈
        showCaptureFeedback();

        // 转换为blob
        canvas.toBlob(function (blob) {
            // 创建File对象
            const file = new File([blob], 'camera-capture.jpg', { type: 'image/jpeg' });
            currentImage = file;

            // 显示图片预览
            const reader = new FileReader();
            reader.onload = function (e) {
                showImagePreview(e.target.result);
                // 更新图像尺寸
                updateImageSize();
            };
            reader.readAsDataURL(file);

            // 关闭摄像头
            stopCamera();

            console.log('拍照完成');

            // 显示识别提示
            showRecognitionPrompt();

            // 自动开始识别
            setTimeout(() => {
                console.log('自动开始识别...');
                predictImage();
            }, 1000); // 延迟1秒让用户看到拍照结果

        }, 'image/jpeg', 0.8);

    } catch (error) {
        console.error('拍照失败:', error);
        alert('拍照失败，请重试');
    }
}

// 显示拍照反馈
function showCaptureFeedback() {
    // 创建拍照闪光效果
    const flash = document.createElement('div');
    flash.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: white;
        z-index: 9999;
        opacity: 0.8;
        pointer-events: none;
    `;
    document.body.appendChild(flash);

    // 0.2秒后移除闪光效果
    setTimeout(() => {
        document.body.removeChild(flash);
    }, 200);
}

// 显示识别提示
function showRecognitionPrompt() {
    const statusDiv = document.getElementById('apiStatus');
    if (statusDiv) {
        statusDiv.innerHTML = `
            <div class="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded-lg flex items-center">
                <i class="fas fa-camera mr-2"></i>
                拍照完成，正在自动识别中...
            </div>
        `;
    }
}

function stopCamera() {
    if (cameraStream) {
        // 如果正在录像，先停止录像
        if (isRecording) {
            stopRecording();
        }

        cameraStream.getTracks().forEach(track => track.stop());
        cameraStream = null;

        const cameraPreview = document.getElementById('camera-preview');
        const uploadArea = document.getElementById('upload-area');

        cameraPreview.classList.add('hidden');
        uploadArea.classList.remove('hidden');

        console.log('摄像头已关闭');
    }
}

// 录像相关函数
function startRecording() {
    try {
        if (!cameraStream) {
            alert('请先打开摄像头');
            return;
        }

        recordedChunks = [];

        // 创建MediaRecorder
        mediaRecorder = new MediaRecorder(cameraStream, {
            mimeType: 'video/webm;codecs=vp9'
        });

        // 监听数据事件
        mediaRecorder.ondataavailable = function (event) {
            if (event.data.size > 0) {
                recordedChunks.push(event.data);
            }
        };

        // 监听停止事件
        mediaRecorder.onstop = function () {
            const blob = new Blob(recordedChunks, { type: 'video/webm' });
            const url = URL.createObjectURL(blob);

            // 创建下载链接
            const a = document.createElement('a');
            a.href = url;
            a.download = `recording-${new Date().getTime()}.webm`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            console.log('录像已保存');
        };

        // 开始录像
        mediaRecorder.start();
        isRecording = true;

        // 更新UI
        updateRecordingUI(true);

        console.log('开始录像');

    } catch (error) {
        console.error('开始录像失败:', error);
        alert('开始录像失败，请重试');
    }
}

function stopRecording() {
    try {
        if (mediaRecorder && isRecording) {
            mediaRecorder.stop();
            isRecording = false;

            // 更新UI
            updateRecordingUI(false);

            console.log('结束录像');
        }
    } catch (error) {
        console.error('结束录像失败:', error);
        alert('结束录像失败');
    }
}

function updateRecordingUI(recording) {
    const recordBtn = document.getElementById('record-btn');
    const stopRecordBtn = document.getElementById('stop-record-btn');
    const recordingIndicator = document.getElementById('recording-indicator');

    if (recording) {
        recordBtn.classList.add('hidden');
        stopRecordBtn.classList.remove('hidden');
        recordingIndicator.classList.remove('hidden');
    } else {
        recordBtn.classList.remove('hidden');
        stopRecordBtn.classList.add('hidden');
        recordingIndicator.classList.add('hidden');
    }
}

// 处理收录按钮点击
function handleCollectDisease() {
    console.log('点击收录按钮');

    // 检查是否有识别结果
    if (!currentPredictionResult) {
        showErrorMessage('请先进行病虫害识别');
        return;
    }

    // 显示收录弹窗
    showCollectModal();
}

// 显示收录弹窗
function showCollectModal() {
    // 获取当前识别结果
    const diseaseName = currentPredictionResult.diseaseName;
    const diseaseInfo = diseaseDatabase[diseaseName];

    // 获取当前时间，格式化为 YYYY-MM-DD
    const now = new Date();
    const currentDate = now.toISOString().split('T')[0];

    // 田块选项（从数据管理模块获取）
    const fieldOptions = [
        { id: 'F-001', name: '玉米田' },
        { id: 'F-002', name: '大豆田' },
        { id: 'F-003', name: '棉花田' },
        { id: 'F-004', name: '大豆田' },
        { id: 'F-005', name: '棉花田' },
        { id: 'F-006', name: '玉米田' },
        { id: 'F-007', name: '大豆田' },
        { id: 'F-008', name: '棉花田' }
    ];

    // 创建弹窗HTML
    const modalHTML = `
        <div id="collect-modal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" style="z-index: 9999;">
            <div class="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
                <div class="flex items-center justify-between mb-6">
                    <h3 class="text-2xl font-bold text-dark">收录病虫害信息</h3>
                    <button id="close-collect-modal" class="text-gray-500 hover:text-gray-700 text-2xl">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                
                <div class="mb-4 p-4 bg-blue-50 rounded-lg">
                    <p class="text-sm text-gray-600 mb-1"><strong>识别结果：</strong></p>
                    <p class="text-lg font-semibold text-blue-700">${diseaseName}</p>
                    <p class="text-sm text-gray-600 mt-1">置信度：${(currentPredictionResult.confidence * 100).toFixed(1)}%</p>
                </div>

                <form id="collect-form" class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                            <i class="fas fa-map-marker-alt mr-1"></i>发生田块 <span class="text-red-500">*</span>
                        </label>
                        <select id="collect-field" required
                            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                            <option value="">请选择田块</option>
                            ${fieldOptions.map(option =>
        `<option value="${option.id}${option.name}">${option.id}${option.name}</option>`
    ).join('')}
                        </select>
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                            <i class="fas fa-calendar-alt mr-1"></i>发生时间 <span class="text-red-500">*</span>
                        </label>
                        <input type="date" id="collect-date" value="${currentDate}" required
                            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    </div>

                    <div class="bg-gray-50 p-3 rounded-lg">
                        <p class="text-sm text-gray-600">
                            <strong>处理状态：</strong> 
                            <span class="text-orange-600 font-semibold">待处理</span>
                        </p>
                    </div>

                    <div class="flex space-x-3 pt-4">
                        <button type="submit" 
                            class="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-lg transition-colors">
                            <i class="fas fa-save mr-2"></i>确认收录
                        </button>
                        <button type="button" id="cancel-collect"
                            class="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 font-medium py-3 px-6 rounded-lg transition-colors">
                            取消
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `;

    // 移除已存在的弹窗
    const existingModal = document.getElementById('collect-modal');
    if (existingModal) {
        existingModal.remove();
    }

    // 添加弹窗到页面
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // 绑定事件
    const modal = document.getElementById('collect-modal');
    const closeBtn = document.getElementById('close-collect-modal');
    const cancelBtn = document.getElementById('cancel-collect');
    const form = document.getElementById('collect-form');

    // 关闭弹窗
    const closeModal = () => {
        modal.remove();
    };

    closeBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // 提交表单
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        savePestRecord();
    });
}

// 保存病虫害记录
function savePestRecord() {
    const fieldInput = document.getElementById('collect-field').value.trim();
    const date = document.getElementById('collect-date').value;

    // 解析田块选择：格式如 "F-001玉米田"
    let fieldId = '';
    let fieldName = '';
    if (fieldInput) {
        // 尝试匹配格式：F-XXX田块名
        const match = fieldInput.match(/^(F-\d+)(.*)$/);
        if (match) {
            fieldId = match[1];
            fieldName = match[2] || '';
        } else {
            // 如果没有匹配到标准格式，使用整个输入作为fieldId
            fieldId = fieldInput;
            fieldName = '';
        }
    }

    // 验证必填项
    if (!fieldId || !date) {
        showErrorMessage('请填写所有必填项');
        return;
    }

    // 获取识别结果信息
    const diseaseName = currentPredictionResult.diseaseName;
    const diseaseInfo = diseaseDatabase[diseaseName];

    // 确定类别（病害或虫害）
    const category = diseaseInfo.type.includes('病害') ? '病害' :
        diseaseInfo.type.includes('虫害') ? '虫害' : '其他';

    // 确定严重程度
    const severityMap = {
        '严重': '严重',
        '高': '高',
        '中': '中',
        '低': '低'
    };
    const level = severityMap[diseaseInfo.severity] || '中';

    // 生成描述信息（症状描述 + 发生时期 + 处理状态）
    function generateDescription(symptoms, season, status) {
        // 从症状中提取关键信息（前30-40字）
        let symptomDesc = '';
        if (symptoms && typeof symptoms === 'string') {
            // 如果症状文本过长，提取关键信息
            if (symptoms.length > 40) {
                // 提取第一个句子或前40字
                const firstSentence = symptoms.split(/[，。]/)[0];
                symptomDesc = firstSentence.length > 40 ? symptoms.substring(0, 37) + '...' : firstSentence;
            } else {
                symptomDesc = symptoms;
            }
        } else if (Array.isArray(symptoms) && symptoms.length > 0) {
            symptomDesc = symptoms[0];
        }

        // 处理季节信息
        let seasonDesc = '';
        if (season) {
            if (season.includes('春季')) seasonDesc = '春季高发期';
            else if (season.includes('夏季')) seasonDesc = '夏季高发期';
            else if (season.includes('秋季')) seasonDesc = '秋季高发期';
            else if (season.includes('冬季')) seasonDesc = '冬季高发期';
            else if (season.includes('夏秋')) seasonDesc = '夏秋季高发期';
            else if (season.includes('春夏')) seasonDesc = '春夏高发期';
            else seasonDesc = season + '高发期';
        }

        // 组合描述
        const parts = [];
        if (symptomDesc) parts.push(symptomDesc);
        if (seasonDesc) parts.push(seasonDesc);
        if (status) parts.push(status);

        return parts.join('，');
    }

    // 生成ID
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    const pestId = `P-${timestamp}-${random}`;

    // 辅助函数：将图片URL转换为base64
    function convertImageUrlToBase64(url) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = function () {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);
                try {
                    const base64 = canvas.toDataURL('image/jpeg', 0.8);
                    resolve(base64);
                } catch (e) {
                    reject(e);
                }
            };
            img.onerror = reject;
            img.src = url;
        });
    }

    // 保存记录函数
    function saveRecordWithImage(imageBase64, imageUrl) {
        // 构建病虫害记录
        const pestRecord = {
            id: pestId,
            title: diseaseName,
            field: fieldName,
            fieldId: fieldId,
            category: category,
            pest: diseaseName,
            level: level,
            date: date,
            status: '待处理',
            severity: diseaseInfo.severity === '严重' ? 80 :
                diseaseInfo.severity === '高' ? 65 :
                    diseaseInfo.severity === '中' ? 50 : 35,
            area: '0.0亩', // 默认值，后续可以从田块数据中获取
            solution: diseaseInfo.controlStrategies[0] || '待制定防治方案',
            description: generateDescription(diseaseInfo.symptoms, diseaseInfo.season, '待处理'),
            symptoms: diseaseInfo.symptoms,
            prevention: diseaseInfo.prevention || [],
            treatment: diseaseInfo.controlStrategies || [],
            images: imageBase64 ? [imageBase64] : (imageUrl ? [imageUrl] : []),
            image: imageBase64 || imageUrl, // 主图片（用于智能防控模块）
            technician: '系统识别',
            notes: `通过AI识别系统自动收录，识别置信度：${(currentPredictionResult.confidence * 100).toFixed(1)}%`,
            nextCheck: date, // 默认与发生日期相同
            cost: 0,
            confidence: currentPredictionResult.confidence, // 保存识别置信度
            crop: diseaseInfo.susceptiblePlants || '未知' // 保存作物类型
        };

        // 保存到localStorage
        savePestToLocalStorage(pestRecord);

        // 关闭弹窗
        const collectModal = document.getElementById('collect-modal');
        if (collectModal) {
            collectModal.remove();
        }

        // 显示成功消息
        showCollectSuccessMessage();

        // 更新按钮状态
        const collectBtn = document.getElementById('collect-btn');
        if (collectBtn) {
            const originalText = collectBtn.innerHTML;
            collectBtn.innerHTML = '<i class="fas fa-check mr-1"></i>已收录';
            collectBtn.classList.remove('bg-blue-500', 'hover:bg-blue-600');
            collectBtn.classList.add('bg-green-500', 'hover:bg-green-600');
            collectBtn.disabled = true;

            setTimeout(() => {
                collectBtn.innerHTML = originalText;
                collectBtn.classList.remove('bg-green-500', 'hover:bg-green-600');
                collectBtn.classList.add('bg-blue-500', 'hover:bg-blue-600');
                collectBtn.disabled = false;
            }, 2000);
        }
    }

    // 将当前图片转换为base64
    if (currentImage) {
        if (currentImage instanceof File || currentImage instanceof Blob) {
            // 如果是File或Blob对象，转换为base64
            const reader = new FileReader();
            reader.onload = function (e) {
                const imageBase64 = e.target.result;
                saveRecordWithImage(imageBase64, null);
            };
            reader.readAsDataURL(currentImage);
            return; // 等待异步转换完成
        } else if (currentImage.src) {
            // 如果是img元素，获取src
            const imageUrl = currentImage.src;
            // 如果是base64或blob URL，直接使用
            if (imageUrl.startsWith('data:') || imageUrl.startsWith('blob:')) {
                saveRecordWithImage(imageUrl, null);
            } else {
                // 如果是普通URL，尝试转换为base64
                convertImageUrlToBase64(imageUrl).then(base64 => {
                    saveRecordWithImage(base64, null);
                }).catch(() => {
                    // 转换失败，使用URL
                    saveRecordWithImage(null, imageUrl);
                });
            }
            return;
        }
    }

    // 如果没有图片，直接保存
    saveRecordWithImage(null, null);
}

// 保存到localStorage
function savePestToLocalStorage(pestRecord) {
    try {
        // 从localStorage获取现有记录
        const existingRecords = JSON.parse(localStorage.getItem('pestRecords') || '[]');

        // 添加新记录
        existingRecords.push(pestRecord);

        // 保存回localStorage
        localStorage.setItem('pestRecords', JSON.stringify(existingRecords));

        console.log('病虫害记录已保存到localStorage:', pestRecord);
        console.log('当前共有', existingRecords.length, '条病虫害记录');

        // 触发自定义事件，通知数据管理页面和智能防控页面更新
        const event = new CustomEvent('pestRecordAdded', {
            detail: pestRecord,
            bubbles: true,
            cancelable: true
        });
        window.dispatchEvent(event);

        // 也尝试在document上触发（确保所有页面都能收到）
        document.dispatchEvent(event);

        console.log('已触发pestRecordAdded事件，通知数据管理模块更新');

    } catch (error) {
        console.error('保存病虫害记录失败:', error);
        showErrorMessage('保存失败，请重试');
    }
}

// 显示错误消息
function showErrorMessage(message) {
    const errorMsg = document.createElement('div');
    errorMsg.className = 'fixed top-20 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 flex items-center space-x-2';
    errorMsg.innerHTML = `
        <i class="fas fa-exclamation-circle"></i>
        <span>${message}</span>
    `;

    document.body.appendChild(errorMsg);

    setTimeout(() => {
        if (document.body.contains(errorMsg)) {
            document.body.removeChild(errorMsg);
        }
    }, 3000);
}

// 显示收录成功消息
function showCollectSuccessMessage() {
    // 创建临时提示消息
    const message = document.createElement('div');
    message.className = 'fixed top-20 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 flex items-center space-x-2';
    message.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>已成功收录</span>
    `;

    document.body.appendChild(message);

    // 3秒后移除消息
    setTimeout(() => {
        if (document.body.contains(message)) {
            document.body.removeChild(message);
        }
    }, 3000);
}

// 工具函数：节流
function throttle(func, limit) {
    let inThrottle;
    return function () {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// 设置视频帧提取功能
function setupFrameExtraction() {
    const extractBtn = document.getElementById('extract-frame-btn');
    const previewVideo = document.getElementById('preview-video');

    if (extractBtn && previewVideo) {
        extractBtn.onclick = function () {
            extractVideoFrame(previewVideo);
        };
    }
}

// 提取视频帧
function extractVideoFrame(video) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    // 设置canvas尺寸
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // 绘制当前帧到canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // 将canvas转换为blob
    canvas.toBlob(function (blob) {
        if (blob) {
            // 创建File对象
            const file = new File([blob], 'extracted-frame.jpg', { type: 'image/jpeg' });
            currentImage = file;

            // 显示提取的帧
            showImagePreview(URL.createObjectURL(blob));
            // 更新图像尺寸
            updateImageSize();

            console.log('视频帧提取成功');
        } else {
            alert('帧提取失败，请重试');
        }
    }, 'image/jpeg', 0.8);
}