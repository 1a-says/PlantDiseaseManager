from flask import Flask, request, jsonify
from flask_cors import CORS
import torch
import torchvision.transforms as transforms
from PIL import Image
import numpy as np
import os
import sys
import json
from pathlib import Path
import time

# 添加项目根目录到Python路径
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# 导入分类器模型
from datas.orange_classifier_common import OrangeClassifier, Config

app = Flask(__name__)
CORS(app)  # 允许跨域请求

# 全局变量
model = None
class_names = None
transform = None

def load_model():
    """加载预训练模型"""
    global model, class_names, transform
    
    try:
        # 获取项目根目录
        project_root = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
        
        # 模型路径
        model_path = os.path.join(project_root, 'outputs', 'orange_classifier.pth')
        print(f"项目根目录: {project_root}")
        print(f"模型路径: {model_path}")
        print(f"模型文件是否存在: {os.path.exists(model_path)}")
        
        # 加载类别配置
        class_config_path = os.path.join(project_root, 'outputs', 'class_config.json')
        print(f"类别配置路径: {class_config_path}")
        print(f"类别配置文件是否存在: {os.path.exists(class_config_path)}")
        if os.path.exists(class_config_path):
            with open(class_config_path, 'r', encoding='utf-8') as f:
                class_config = json.load(f)
                class_names = list(class_config['names'].values())
                num_classes = class_config['model_config']['num_classes']
        else:
            # 默认类别
            class_names = ["棉花卷叶病毒害", "棉花叶蝉虫病害", "玉米大斑病"]
            num_classes = 3
        
        # 创建模型
        model = OrangeClassifier(num_classes=num_classes, pretrained=False)
        
        if os.path.exists(model_path):
            model.load_state_dict(torch.load(model_path, map_location=torch.device('cpu')))
            model.eval()
            print(f"模型加载成功: {model_path}")
        else:
            print(f"模型文件不存在: {model_path}")
            return False
        
        # 图像预处理
        transform = transforms.Compose([
            transforms.Resize((224, 224)),
            transforms.ToTensor(),
            transforms.Normalize(
                mean=[0.485, 0.456, 0.406],
                std=[0.229, 0.224, 0.225]
            )
        ])
        
        return True
        
    except Exception as e:
        print(f"加载模型出错: {str(e)}")
        return False

def preprocess_image(image):
    """预处理图像"""
    global transform
    return transform(image).unsqueeze(0)

@app.route('/api/health', methods=['GET'])
def health_check():
    """健康检查接口"""
    return jsonify({
        'status': 'healthy',
        'model_loaded': model is not None,
        'class_names': class_names
    })

@app.route('/api/predict', methods=['POST'])
def predict():
    """预测接口"""
    try:
        if model is None:
            return jsonify({'error': '模型未加载'}), 500
        
        # 检查是否有文件上传
        if 'image' not in request.files:
            return jsonify({'error': '没有上传图像'}), 400
        
        file = request.files['image']
        if file.filename == '':
            return jsonify({'error': '没有选择文件'}), 400
        
        # 打开图像
        image = Image.open(file.stream).convert('RGB')
        
        # 预处理图像
        input_tensor = preprocess_image(image)
        
        # 记录开始时间
        start_time = time.time()
        
        # 进行预测
        with torch.no_grad():
            output = model(input_tensor)
            probabilities = torch.nn.functional.softmax(output, dim=1)[0]
        
        # 计算预测时间
        pred_time = time.time() - start_time
        
        # 获取预测类别和概率
        pred_probs, pred_classes = torch.topk(probabilities, len(class_names))
        
        # 转换为Python列表
        pred_probs = pred_probs.cpu().numpy()
        pred_classes = pred_classes.cpu().numpy()
        
        # 构建结果
        predictions = []
        for i in range(len(class_names)):
            predictions.append({
                'class_name': class_names[pred_classes[i]],
                'confidence': float(pred_probs[i])
            })
        
        return jsonify({
            'predictions': predictions,
            'prediction_time': pred_time,
            'image_size': image.size
        })
        
    except Exception as e:
        return jsonify({'error': f'预测出错: {str(e)}'}), 500

@app.route('/api/classes', methods=['GET'])
def get_classes():
    """获取类别列表"""
    return jsonify({
        'class_names': class_names,
        'num_classes': len(class_names) if class_names else 0
    })

if __name__ == '__main__':
    print("正在加载模型...")
    if load_model():
        print("模型加载成功，启动服务器...")
        print(f"类别名称: {class_names}")
        app.run(host='0.0.0.0', port=8000, debug=True)
    else:
        print("模型加载失败，请检查模型文件")
