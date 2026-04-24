#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
简化的植物病害分类训练脚本
不依赖外部包，使用基础Python功能
"""

import os
import sys
import argparse
import logging

# 设置日志
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

def check_dataset():
    """检查数据集是否存在"""
    dataset_path = "plant_dataset"  # 使用plant_dataset目录
    
    if not os.path.exists(dataset_path):
        logger.error(f"数据集目录不存在: {dataset_path}")
        logger.error("请创建 'plant_dataset' 目录并放入图像文件")
        logger.error("数据集结构应该是：")
        logger.error("plant_dataset/")
        logger.error("├── 红绿灯蛾/")
        logger.error("│   ├── image1.jpg")
        logger.error("│   └── ...")
        logger.error("├── 甜菜夜蛾/")
        logger.error("│   ├── image1.jpg")
        logger.error("│   └── ...")
        logger.error("└── ...")
        return False
    
    # 检查类别目录
    classes = [d for d in os.listdir(dataset_path) 
              if os.path.isdir(os.path.join(dataset_path, d))]
    
    if not classes:
        logger.error(f"在 {dataset_path} 中找不到任何类别目录")
        return False
    
    logger.info(f"找到类别: {classes}")
    
    # 检查每个类别是否有图像
    total_images = 0
    for cls in classes:
        cls_dir = os.path.join(dataset_path, cls)
        img_files = [f for f in os.listdir(cls_dir) 
                    if f.lower().endswith(('.jpg', '.jpeg', '.png', '.webp', '.bmp', '.tif', '.tiff'))]
        logger.info(f"类别 '{cls}' 包含 {len(img_files)} 张图像")
        total_images += len(img_files)
    
    logger.info(f"数据集总共包含 {total_images} 张图像")
    
    if total_images == 0:
        logger.error("数据集中没有找到任何图像")
        return False
    
    return True

def main():
    """主函数"""
    parser = argparse.ArgumentParser(description='植物病害分类模型训练')
    parser.add_argument('--epochs', type=int, default=100, help='训练轮数')
    parser.add_argument('--debug', action='store_true', help='开启调试模式')
    args = parser.parse_args()
    
    if args.debug:
        logger.setLevel(logging.DEBUG)
        logger.info("调试模式已启用")
    
    logger.info(f"开始训练，训练轮数: {args.epochs}")
    
    # 检查数据集
    if not check_dataset():
        logger.error("数据集检查失败，程序终止")
        return
    
    logger.info("数据集检查通过")
    logger.info("注意：这是一个简化版本，需要安装以下依赖包才能进行实际训练：")
    logger.info("- torch")
    logger.info("- torchvision") 
    logger.info("- numpy")
    logger.info("- matplotlib")
    logger.info("- pillow")
    logger.info("- scikit-learn")
    logger.info("- split-folders")
    
    logger.info("请运行以下命令安装依赖：")
    logger.info("pip install torch torchvision numpy matplotlib pillow scikit-learn split-folders")
    
    logger.info("然后运行完整的训练脚本：")
    logger.info("python src/datas/orange_classifier_train.py --epochs 100 --debug")

if __name__ == "__main__":
    main()
