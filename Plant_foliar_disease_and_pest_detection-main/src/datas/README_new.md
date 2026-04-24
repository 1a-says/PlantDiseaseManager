# 植物叶片病害与害虫检测系统

## 📝 项目概述

基于神经网络的植物叶片病害与害虫智能检测系统，帮助农户实时监测作物健康状况，提早发现病虫害，提供科学防治建议，助力现代农业生产。

## ✨ 主要功能

- **多输入支持**：支持图像、视频、摄像头实时检测
- **智能识别**：高精度识别多种植物病害与害虫，精准定位受损区域
- **图像分割**：精确分离健康区域与病害区域，评估受损程度
- **自动分析报告**：自动生成检测结果报告，提供防治建议
- **灵活部署**：支持本地部署、服务器部署，适应不同应用场景
- **用户友好界面**：提供Web界面和桌面应用，操作简单直观

虚拟环境

.\venv\Scripts\activate

pyweb界面
streamlit run src/datas/orange_classifier_web.py

# 类别配置

类别配置现在通过 `src/datas/classes_config.yaml` 文件进行管理：

```yaml
names:
  0: 棉花卷叶病毒病
  1: 棉花叶蝉虫害
  2: 玉米大斑病

```

## 如何修改类别

1. 编辑 `src/datas/classes_config.yaml` 文件
2. 修改 `names` 部分，添加或删除类别
3. 更新 `model_config.num_classes` 为正确的类别数量
4. 重新训练模型以适配新的类别

```
3. 开始训练
```bash
python src/datas/orange_classifier_train.py --epochs 100 --debug  
```

4. 图像文件检查和修复（可选）
   
   ```bash
   # 仅扫描数据集完整性
   python src/datas/fix_images.py --scan_only
   
   # 修复损坏的图像文件
   python src/datas/fix_images.py --fix_only
   
   # 扫描并修复（默认）
   python src/datas/fix_images.py
   ```

5. 模型测试
   
   ```bash
   python src/datas/orange_classifier_test.py 


6、启动API服务器
python start_system.py
   ```

### 模型加载失败
如果遇到"模型文件不存在"错误：

1. **检查模型文件**
   ```bash
   ls outputs/orange_classifier.pth
   ```

2. **重新训练模型**
   ```bash
   python src/datas/orange_classifier_train.py --epochs 50
   ```

3. **检查路径配置**
   - 确保在项目根目录运行命令
   - 检查 `outputs/` 目录是否存在

### API服务器启动失败
1. **检查端口占用**
   ```bash
   netstat -ano | findstr :8000
   ```

2. **更换端口**
   - 修改 `app.py` 中的端口号
   - 或使用：`python src/datas/app.py --port 8001`

### 识别结果不准确
1. **检查图片质量**
   - 确保图片清晰
   - 叶片占主要部分
   - 背景简单

2. **重新训练模型**
   ```bash
   python src/datas/orange_classifier_train.py --epochs 100 --debug
   ```

#### 分类模型

1. 组织数据集，每个类别一个文件夹
   
   ```
   plant_dataset/
   ├── 红绿灯蛾/
   │   ├── image1.jpg
   │   └── ...
   ├── 甜菜夜蛾/
   │   ├── image1.jpg
   │   └── ...
   ├── 玉米大斑病/
   │   ├── image1.jpg
   │   └── ...
   └── ...
   ```

## 📋 支持的病害类别

系统目前支持以下常见植物病害和害虫的检测：

## 🔧 技术架构

- **前端模块**：Streamlit Web界面 
- **模型模块**：基于神经网络分类训练
- **后端模块**：基于Python的图像处理与结果分析系统
- **训练模块**：支持自定义数据集训练，迁移学习
- **图像验证模块**：自动检测和修复损坏的图像文件

## 🛠️ 图像文件完整性检查

系统内置了强大的图像文件完整性检查功能，能够：

### 1. 自动检测损坏图像
- 扫描数据集中的所有图像文件
- 识别无法正常读取的损坏文件
- 生成详细的损坏文件报告

### 2. 智能修复损坏图像
- 自动修复可修复的图像文件
- 转换图像格式为标准JPEG
- 优化图像质量和文件大小
- 自动备份原始文件

### 3. 使用方法
```bash
# 检查数据集完整性
python src/datas/fix_images.py --scan_only

# 修复损坏的图像
python src/datas/fix_images.py --fix_only

# 完整扫描和修复
python src/datas/fix_images.py

# 训练时自动修复
python src/datas/orange_classifier_train.py --fix_images --epochs 100
```

### 4. 支持的图像格式
- JPEG (.jpg, .jpeg)
- PNG (.png)
- WebP (.webp)
- BMP (.bmp)
- TIFF (.tiff, .tif)

## 启动可视化页面

src\datas 文件夹下

```bash
streamlit run src/datas/orange_classifier_test.py 
```

## 效果展示

1. 主页
   
   ![主页.png](E:\Project\ComputerVision\Plant_foliar_disease_and_pest_detection\主页.png)

2. 训练过程
   
   ![训练过程.png](E:\Project\ComputerVision\Plant_foliar_disease_and_pest_detection\训练过程.png)

3. 模型预测
   
   ![模型预测.png](E:\Project\ComputerVision\Plant_foliar_disease_and_pest_detection\模型预测.png)

4. 训练指标
   
   ![训练指标.png](E:\Project\ComputerVision\Plant_foliar_disease_and_pest_detection\训练指标.png)
