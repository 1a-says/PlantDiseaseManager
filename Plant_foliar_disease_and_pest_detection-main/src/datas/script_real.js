/**
 * 病虫害识别系统 - 真实模型预测版本
 * 需要配合Python后端API使用
 */

// 全局变量
let uploadedImage = null;
let predictionResults = null;
let modelLoaded = false;

// API配置
const API_CONFIG = {
    baseUrl: 'http://localhost:8000', // Python后端API地址
    endpoints: {
        predict: '/api/predict',
        health: '/api/health',
        classes: '/api/classes'
    }
};

/**
 * 检查后端API是否可用
 */
async function checkAPIHealth() {
    try {
        const response = await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.health}`);
        if (response.ok) {
            modelLoaded = true;
            console.log('模型API连接成功');
            return true;
        }
    } catch (error) {
        console.warn('无法连接到模型API，将使用模拟预测:', error.message);
        modelLoaded = false;
    }
    return false;
}

/**
 * 真实预测功能 - 调用Python后端API
 */
async function predictImageReal() {
    if (!uploadedImage) {
        showAlert('请先上传图像', 'warning');
        return;
    }

    // 显示加载模态框
    const loadingModal = new bootstrap.Modal(document.getElementById('loadingModal'));
    loadingModal.show();

    try {
        // 将base64图像转换为Blob
        const response = await fetch(uploadedImage);
        const blob = await response.blob();
        
        // 创建FormData
        const formData = new FormData();
        formData.append('image', blob, 'image.jpg');
        
        // 发送预测请求
        const predictResponse = await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.predict}`, {
            method: 'POST',
            body: formData
        });
        
        if (!predictResponse.ok) {
            throw new Error(`预测请求失败: ${predictResponse.status}`);
        }
        
        const results = await predictResponse.json();
        
        // 显示真实预测结果
        displayPredictionResults(results.predictions);
        
    } catch (error) {
        console.error('预测失败:', error);
        showAlert(`预测失败: ${error.message}`, 'danger');
        
        // 如果API失败，回退到模拟预测
        console.log('回退到模拟预测');
        const mockResults = generateMockResults();
        displayPredictionResults(mockResults);
    } finally {
        loadingModal.hide();
    }
}

/**
 * 获取类别信息
 */
async function loadClasses() {
    try {
        const response = await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.classes}`);
        if (response.ok) {
            const data = await response.json();
            return data.classes;
        }
    } catch (error) {
        console.warn('无法获取类别信息:', error.message);
    }
    
    // 返回默认类别
    return ['棉花卷叶病毒病', '棉花叶蝉虫害', '玉米大斑病'];
}

/**
 * 更新预测按钮状态
 */
function updatePredictButton() {
    const predictBtn = document.getElementById('predictBtn');
    if (modelLoaded) {
        predictBtn.innerHTML = '<i class="fas fa-search me-2"></i>开始预测';
        predictBtn.classList.remove('btn-secondary');
        predictBtn.classList.add('btn-primary');
    } else {
        predictBtn.innerHTML = '<i class="fas fa-flask me-2"></i>模拟预测';
        predictBtn.classList.remove('btn-primary');
        predictBtn.classList.add('btn-secondary');
    }
}

/**
 * 显示API状态
 */
function showAPIStatus() {
    const statusDiv = document.getElementById('apiStatus');
    if (statusDiv) {
        if (modelLoaded) {
            statusDiv.innerHTML = `
                <div class="alert alert-success">
                    <i class="fas fa-check-circle me-2"></i>
                    模型API已连接，可以进行真实预测
                </div>
            `;
        } else {
            statusDiv.innerHTML = `
                <div class="alert alert-warning">
                    <i class="fas fa-exclamation-triangle me-2"></i>
                    模型API未连接，将使用模拟预测
                    <br><small>请确保Python后端服务正在运行</small>
                </div>
            `;
        }
    }
}

/**
 * 修改后的预测函数
 */
async function predictImage() {
    if (modelLoaded) {
        await predictImageReal();
    } else {
        // 使用模拟预测
        if (!uploadedImage) {
            showAlert('请先上传图像', 'warning');
            return;
        }

        const loadingModal = new bootstrap.Modal(document.getElementById('loadingModal'));
        loadingModal.show();

        setTimeout(() => {
            const mockResults = generateMockResults();
            displayPredictionResults(mockResults);
            loadingModal.hide();
        }, 2000);
    }
}

/**
 * 页面初始化 - 增强版
 */
document.addEventListener('DOMContentLoaded', async function() {
    // 初始化拖拽上传
    initDragAndDrop();
    
    // 检查API连接
    await checkAPIHealth();
    
    // 更新UI状态
    updatePredictButton();
    showAPIStatus();
    
    // 加载训练指标
    loadTrainingMetrics();
    
    // 添加重置按钮事件
    const resetBtn = document.getElementById('resetBtn');
    if (resetBtn) {
        resetBtn.addEventListener('click', resetPrediction);
    }
    
    // 添加键盘快捷键
    document.addEventListener('keydown', function(e) {
        // Ctrl + U 上传图像
        if (e.ctrlKey && e.key === 'u') {
            e.preventDefault();
            document.getElementById('imageInput').click();
        }
        
        // Ctrl + P 开始预测
        if (e.ctrlKey && e.key === 'p') {
            e.preventDefault();
            predictImage();
        }
    });
    
    console.log('病虫害识别系统已初始化');
    console.log('模型状态:', modelLoaded ? '已连接' : '未连接');
});

// 保留原有的其他函数...
// (这里包含之前script.js中的所有其他函数)

