#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
数据集诊断工具
用于检查数据集划分和图像验证的详细情况
"""

import os
import sys
import logging
from pathlib import Path
from PIL import Image, UnidentifiedImageError

# 设置日志
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

def check_dataset_status():
    """检查数据集状态"""
    logger.info("=" * 60)
    logger.info("数据集诊断报告")
    logger.info("=" * 60)
    
    # 1. 检查原始数据集
    logger.info("\n1. 原始数据集检查:")
    plant_dataset_dir = "plant_dataset"
    if not os.path.exists(plant_dataset_dir):
        logger.error(f"原始数据集目录不存在: {plant_dataset_dir}")
        return
    
    class_dirs = [d for d in os.listdir(plant_dataset_dir) 
                 if os.path.isdir(os.path.join(plant_dataset_dir, d))]
    
    logger.info(f"发现类别目录: {class_dirs}")
    
    total_original_images = 0
    valid_images_per_class = {}
    
    for class_name in class_dirs:
        class_dir = os.path.join(plant_dataset_dir, class_name)
        
        # 统计所有图像文件
        img_files = []
        for ext in ['.jpg', '.jpeg', '.png', '.webp', '.bmp', '.tiff', '.tif']:
            img_files.extend(list(Path(class_dir).glob(f'*{ext}')))
            img_files.extend(list(Path(class_dir).glob(f'*{ext.upper()}')))
        
        # 去重（避免重复计算）
        img_files = list(set(img_files))
        
        # 验证图像完整性
        valid_count = 0
        corrupted_count = 0
        
        for img_path in img_files:
            try:
                with Image.open(img_path) as img:
                    img.verify()
                with Image.open(img_path) as img:
                    img.convert('RGB')
                valid_count += 1
            except Exception as e:
                corrupted_count += 1
                logger.warning(f"  损坏图像: {img_path.name}")
        
        valid_images_per_class[class_name] = valid_count
        total_original_images += len(img_files)
        
        logger.info(f"类别 '{class_name}':")
        logger.info(f"  - 总文件数: {len(img_files)}")
        logger.info(f"  - 有效图像: {valid_count}")
        logger.info(f"  - 损坏图像: {corrupted_count}")
    
    logger.info(f"\n原始数据集总计: {total_original_images} 个文件")
    
    # 2. 检查处理后的数据集
    logger.info("\n2. 处理后数据集检查:")
    processed_dir = "outputs/orange_processed_data"
    if os.path.exists(processed_dir):
        processed_classes = [d for d in os.listdir(processed_dir) 
                           if os.path.isdir(os.path.join(processed_dir, d))]
        
        logger.info(f"处理后类别: {processed_classes}")
        
        total_processed_images = 0
        for class_name in processed_classes:
            class_dir = os.path.join(processed_dir, class_name)
            img_files = []
            for ext in ['.jpg', '.jpeg', '.png', '.webp', '.bmp', '.tiff', '.tif']:
                img_files.extend(list(Path(class_dir).glob(f'*{ext}')))
                img_files.extend(list(Path(class_dir).glob(f'*{ext.upper()}')))
            
            # 去重
            img_files = list(set(img_files))
            
            total_processed_images += len(img_files)
            logger.info(f"类别 '{class_name}': {len(img_files)} 张图像")
        
        logger.info(f"处理后数据集总计: {total_processed_images} 张图像")
    else:
        logger.info("处理后数据集不存在")
    
    # 3. 检查划分后的数据集
    logger.info("\n3. 划分后数据集检查:")
    split_dir = "outputs/orange_split_dataset"
    if os.path.exists(split_dir):
        datasets = ['train', 'val', 'test']
        total_split_images = 0
        
        for dataset_name in datasets:
            dataset_dir = os.path.join(split_dir, dataset_name)
            if os.path.exists(dataset_dir):
                dataset_classes = [d for d in os.listdir(dataset_dir) 
                                 if os.path.isdir(os.path.join(dataset_dir, d))]
                
                dataset_total = 0
                logger.info(f"\n{dataset_name.upper()} 集:")
                
                for class_name in dataset_classes:
                    class_dir = os.path.join(dataset_dir, class_name)
                    img_files = []
                    for ext in ['.jpg', '.jpeg', '.png', '.webp', '.bmp', '.tiff', '.tif']:
                        img_files.extend(list(Path(class_dir).glob(f'*{ext}')))
                        img_files.extend(list(Path(class_dir).glob(f'*{ext.upper()}')))
                    
                    # 去重
                    img_files = list(set(img_files))
                    
                    dataset_total += len(img_files)
                    logger.info(f"  - 类别 '{class_name}': {len(img_files)} 张图像")
                
                total_split_images += dataset_total
                logger.info(f"  - {dataset_name.upper()} 集总计: {dataset_total} 张图像")
            else:
                logger.warning(f"{dataset_name} 目录不存在")
        
        logger.info(f"\n划分后数据集总计: {total_split_images} 张图像")
        
        # 计算划分比例
        if total_split_images > 0:
            train_dir = os.path.join(split_dir, 'train')
            val_dir = os.path.join(split_dir, 'val')
            test_dir = os.path.join(split_dir, 'test')
            
            # 计算各集合的实际图像数量
            train_files = []
            val_files = []
            test_files = []
            
            for ext in ['.jpg', '.jpeg', '.png', '.webp', '.bmp', '.tiff', '.tif']:
                train_files.extend(list(Path(train_dir).glob(f'**/*{ext}')))
                train_files.extend(list(Path(train_dir).glob(f'**/*{ext.upper()}')))
                val_files.extend(list(Path(val_dir).glob(f'**/*{ext}')))
                val_files.extend(list(Path(val_dir).glob(f'**/*{ext.upper()}')))
                test_files.extend(list(Path(test_dir).glob(f'**/*{ext}')))
                test_files.extend(list(Path(test_dir).glob(f'**/*{ext.upper()}')))
            
            # 去重
            train_count = len(set(train_files))
            val_count = len(set(val_files))
            test_count = len(set(test_files))
            
            logger.info(f"\n实际划分比例:")
            logger.info(f"  - 训练集: {train_count} 张 ({train_count/total_split_images*100:.1f}%)")
            logger.info(f"  - 验证集: {val_count} 张 ({val_count/total_split_images*100:.1f}%)")
            logger.info(f"  - 测试集: {test_count} 张 ({test_count/total_split_images*100:.1f}%)")
    else:
        logger.info("划分后数据集不存在")
    
    # 4. 总结和建议
    logger.info("\n" + "=" * 60)
    logger.info("诊断总结和建议")
    logger.info("=" * 60)
    
    if total_original_images > 0:
        logger.info(f"原始数据集: {total_original_images} 个文件")
        
        # 检查是否有损坏图像
        total_valid = sum(valid_images_per_class.values())
        total_corrupted = total_original_images - total_valid
        
        if total_corrupted > 0:
            logger.warning(f"发现 {total_corrupted} 个损坏图像文件")
            logger.info("建议运行图像修复工具:")
            logger.info("  python src/datas/fix_images.py --fix_only")
        else:
            logger.info("所有图像文件都有效")
        
        logger.info(f"有效图像: {total_valid} 张")
        
        # 检查类别平衡性
        if len(valid_images_per_class) > 1:
            min_images = min(valid_images_per_class.values())
            max_images = max(valid_images_per_class.values())
            logger.info(f"类别平衡性: 最少 {min_images} 张，最多 {max_images} 张")
            
            if max_images / min_images > 2:
                logger.warning("类别不平衡，建议平衡数据集")

if __name__ == "__main__":
    check_dataset_status()
