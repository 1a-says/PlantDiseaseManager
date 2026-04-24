#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
病虫害识别系统 - Python后端API服务器
提供模型预测服务
"""

import os
import sys
import torch
import torchvision.transforms as transforms
from PIL import Image
import numpy as np
from flask import Flask, request, jsonify
from flask_cors import CORS
import io
import base64
import logging
import traceback

# 添加项目路径
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# 导入模型相关模块
from datas.orange_classifier_common import OrangeClassifier, Config

# 设置日志
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# 创建Flask应用
app = Flask(__name__)
CORS(app)  # 允许跨域请求

# 全局变量
model = None
class_names = None
transform = None
device = None

def load_model():
    """加载训练好的模型"""
    global model, class_names, transform, device
    
    try:
        # 配置
        config = Config()
        device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        
        # 加载类别配置
        import yaml
        config_path = os.path.join(os.path.dirname(__file__), "classes_config.yaml")
        
        if os.path.exists(config_path):
            with open(config_path, 'r', encoding='utf-8') as f:
                class_config = yaml.safe_load(f)
            class_names = list(class_config['names'].values())
            num_classes = class_config['model_config']['num_classes']
        else:
            # 默认配置
            class_names = ['棉花卷叶病毒病', '棉花叶蝉虫害', '玉米大斑病']
            num_classes = 3
        
        logger.info(f"类别: {class_names}")
        logger.info(f"类别数量: {num_classes}")
        
        # 创建模型
        model = OrangeClassifier(num_classes=num_classes, pretrained=False)
        
        # 加载模型权重
        model_path = os.path.join(config.output_dir, "orange_classifier.pth")
        
        if not os.path.exists(model_path):
            raise FileNotFoundError(f"模型文件不存在: {model_path}")
        
        model.load_state_dict(torch.load(model_path, map_location=device))
        model = model.to(device)
        model.eval()
        
        # 定义图像预处理
        transform = transforms.Compose([
            transforms.Resize((224, 224)),
            transforms.ToTensor(),
            transforms.Normalize(
                mean=[0.485, 0.456, 0.406],
                std=[0.229, 0.224, 0.225]
            )
        ])
        
        logger.info("模型加载成功")
        return True
        
    except Exception as e:
        logger.error(f"模型加载失败: {str(e)}")
        logger.error(traceback.format_exc())
        return False

def preprocess_image(image):
    """预处理图像"""
    try:
        # 确保图像是RGB格式
        if image.mode != 'RGB':
            image = image.convert('RGB')
        
        # 应用变换
        image_tensor = transform(image).unsqueeze(0)
        return image_tensor.to(device)
        
    except Exception as e:
        logger.error(f"图像预处理失败: {str(e)}")
        raise

def predict_image(image_tensor):
    """进行预测"""
    try:
        with torch.no_grad():
            outputs = model(image_tensor)
            probabilities = torch.softmax(outputs, dim=1)
            
            # 获取预测结果
            _, predicted = torch.max(outputs, 1)
            predicted_class = predicted.item()
            
            # 获取所有类别的概率
            probs = probabilities[0].cpu().numpy()
            
            # 创建结果列表
            results = []
            for i, (class_name, prob) in enumerate(zip(class_names, probs)):
                results.append({
                    'class': class_name,
                    'confidence': float(prob),
                    'class_id': i
                })
            
            # 按置信度排序
            results.sort(key=lambda x: x['confidence'], reverse=True)
            
            return {
                'predictions': results,
                'predicted_class': class_names[predicted_class],
                'predicted_class_id': predicted_class,
                'max_confidence': float(probs[predicted_class])
            }
            
    except Exception as e:
        logger.error(f"预测失败: {str(e)}")
        raise

@app.route('/api/health', methods=['GET'])
def health_check():
    """健康检查接口"""
    return jsonify({
        'status': 'healthy',
        'model_loaded': model is not None,
        'device': str(device) if device else 'unknown',
        'classes': class_names if class_names else []
    })

@app.route('/api/classes', methods=['GET'])
def get_classes():
    """获取类别信息接口"""
    return jsonify({
        'classes': class_names if class_names else [],
        'num_classes': len(class_names) if class_names else 0
    })

@app.route('/api/predict', methods=['POST'])
def predict():
    """预测接口"""
    try:
        # 检查模型是否加载
        if model is None:
            return jsonify({'error': '模型未加载'}), 500
        
        # 获取上传的图像
        if 'image' not in request.files:
            return jsonify({'error': '未找到图像文件'}), 400
        
        file = request.files['image']
        if file.filename == '':
            return jsonify({'error': '未选择文件'}), 400
        
        # 读取图像
        image = Image.open(io.BytesIO(file.read()))
        
        # 预处理图像
        image_tensor = preprocess_image(image)
        
        # 进行预测
        result = predict_image(image_tensor)
        
        logger.info(f"预测完成: {result['predicted_class']} (置信度: {result['max_confidence']:.4f})")
        
        return jsonify(result)
        
    except Exception as e:
        logger.error(f"预测接口错误: {str(e)}")
        logger.error(traceback.format_exc())
        return jsonify({'error': f'预测失败: {str(e)}'}), 500

@app.route('/api/predict_base64', methods=['POST'])
def predict_base64():
    """Base64图像预测接口"""
    try:
        # 检查模型是否加载
        if model is None:
            return jsonify({'error': '模型未加载'}), 500
        
        # 获取Base64图像数据
        data = request.get_json()
        if 'image' not in data:
            return jsonify({'error': '未找到图像数据'}), 400
        
        # 解码Base64图像
        image_data = data['image']
        if image_data.startswith('data:image'):
            image_data = image_data.split(',')[1]
        
        image_bytes = base64.b64decode(image_data)
        image = Image.open(io.BytesIO(image_bytes))
        
        # 预处理图像
        image_tensor = preprocess_image(image)
        
        # 进行预测
        result = predict_image(image_tensor)
        
        logger.info(f"Base64预测完成: {result['predicted_class']} (置信度: {result['max_confidence']:.4f})")
        
        return jsonify(result)
        
    except Exception as e:
        logger.error(f"Base64预测接口错误: {str(e)}")
        logger.error(traceback.format_exc())
        return jsonify({'error': f'预测失败: {str(e)}'}), 500

@app.route('/api/metrics', methods=['GET'])
def get_metrics():
    """获取模型指标接口"""
    try:
        # 尝试加载指标文件
        config = Config()
        metrics_path = os.path.join(config.output_dir, "metrics.json")
        
        if os.path.exists(metrics_path):
            import json
            with open(metrics_path, 'r', encoding='utf-8') as f:
                metrics = json.load(f)
            return jsonify(metrics)
        else:
            return jsonify({'error': '指标文件不存在'}), 404
            
    except Exception as e:
        logger.error(f"获取指标失败: {str(e)}")
        return jsonify({'error': f'获取指标失败: {str(e)}'}), 500

@app.route('/', methods=['GET'])
def index():
    """根路径"""
    return jsonify({
        'message': '病虫害识别API服务',
        'version': '1.0.0',
        'endpoints': {
            'health': '/api/health',
            'classes': '/api/classes',
            'predict': '/api/predict',
            'predict_base64': '/api/predict_base64',
            'metrics': '/api/metrics'
        }
    })

if __name__ == '__main__':
    # 加载模型
    if not load_model():
        logger.error("模型加载失败，服务启动中止")
        sys.exit(1)
    
    # 启动服务
    logger.info("启动病虫害识别API服务...")
    logger.info("服务地址: http://localhost:8000")
    logger.info("API文档: http://localhost:8000")
    
    app.run(
        host='0.0.0.0',
        port=8000,
        debug=False,
        threaded=True
    )

