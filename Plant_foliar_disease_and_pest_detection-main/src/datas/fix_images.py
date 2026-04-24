#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
图像文件修复工具
用于检查和修复损坏的图像文件
"""

import os
import sys
import argparse
import logging
from pathlib import Path
import shutil
from PIL import Image, UnidentifiedImageError

# 设置日志
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

def check_image_integrity(img_path):
    """检查单个图像文件的完整性"""
    try:
        with Image.open(img_path) as img:
            img.verify()  # 验证图像完整性
        return True, None
    except (IOError, UnidentifiedImageError, OSError) as e:
        return False, str(e)

def fix_corrupted_images(img_dir, backup_dir=None, convert_format='JPEG'):
    """批量修复损坏的图像文件"""
    logger.info(f"开始修复图像目录: {img_dir}")
    
    if backup_dir:
        os.makedirs(backup_dir, exist_ok=True)
        logger.info(f"备份目录: {backup_dir}")
    
    fixed_count = 0
    failed_count = 0
    skipped_count = 0
    
    # 获取所有图像文件（递归搜索子目录）
    img_files = []
    for ext in ['.jpg', '.jpeg', '.png', '.webp', '.bmp', '.tiff', '.tif']:
        # 搜索根目录
        img_files.extend(list(Path(img_dir).glob(f'*{ext}')))
        img_files.extend(list(Path(img_dir).glob(f'*{ext.upper()}')))
        # 递归搜索子目录
        img_files.extend(list(Path(img_dir).glob(f'**/*{ext}')))
        img_files.extend(list(Path(img_dir).glob(f'**/*{ext.upper()}')))
    
    # 去重
    img_files = list(set(img_files))
    
    logger.info(f"发现 {len(img_files)} 个图像文件需要检查")
    
    for img_path in img_files:
        try:
            # 检查图像完整性
            is_valid, error = check_image_integrity(img_path)
            
            if is_valid:
                # 图像有效，尝试优化格式
                try:
                    with Image.open(img_path) as img:
                        # 备份原文件（如果需要）
                        if backup_dir:
                            backup_path = os.path.join(backup_dir, img_path.name)
                            shutil.copy2(img_path, backup_path)
                        
                        # 转换为RGB格式
                        img_rgb = img.convert('RGB')
                        
                        # 如果原文件不是目标格式，转换并保存
                        if convert_format == 'JPEG' and img_path.suffix.lower() not in ['.jpg', '.jpeg']:
                            output_path = img_path.with_suffix('.jpg')
                            img_rgb.save(output_path, "JPEG", quality=95, optimize=True)
                            
                            # 删除原文件
                            img_path.unlink()
                            logger.info(f"格式转换: {img_path.name} -> {output_path.name}")
                        else:
                            # 重新保存以优化文件
                            img_rgb.save(img_path, quality=95, optimize=True)
                            logger.info(f"优化完成: {img_path.name}")
                        
                        fixed_count += 1
                        
                except Exception as e:
                    logger.warning(f"优化失败但图像有效: {img_path.name}, 错误: {str(e)}")
                    skipped_count += 1
            else:
                # 图像损坏，尝试修复
                logger.warning(f"发现损坏图像: {img_path.name}, 错误: {error}")
                
                try:
                    # 备份损坏的文件
                    if backup_dir:
                        backup_path = os.path.join(backup_dir, f"corrupted_{img_path.name}")
                        shutil.copy2(img_path, backup_path)
                    
                    # 尝试强制打开并修复
                    with Image.open(img_path) as img:
                        img_rgb = img.convert('RGB')
                        
                        # 保存为高质量JPEG
                        output_path = img_path.with_suffix('.jpg')
                        img_rgb.save(output_path, "JPEG", quality=95, optimize=True)
                        
                        # 删除原文件
                        img_path.unlink()
                        
                        fixed_count += 1
                        logger.info(f"修复成功: {img_path.name} -> {output_path.name}")
                        
                except Exception as e:
                    failed_count += 1
                    logger.error(f"修复失败: {img_path.name}, 错误: {str(e)}")
                    
        except Exception as e:
            failed_count += 1
            logger.error(f"处理失败: {img_path.name}, 错误: {str(e)}")
    
    logger.info(f"图像处理完成:")
    logger.info(f"  - 成功处理: {fixed_count} 个")
    logger.info(f"  - 跳过: {skipped_count} 个")
    logger.info(f"  - 失败: {failed_count} 个")
    
    return fixed_count, skipped_count, failed_count

def scan_dataset_integrity(dataset_dir):
    """扫描整个数据集的图像完整性"""
    logger.info(f"开始扫描数据集完整性: {dataset_dir}")
    
    if not os.path.exists(dataset_dir):
        logger.error(f"数据集目录不存在: {dataset_dir}")
        return
    
    total_files = 0
    valid_files = 0
    corrupted_files = []
    
    # 扫描每个类别目录
    class_dirs = [d for d in os.listdir(dataset_dir) 
                 if os.path.isdir(os.path.join(dataset_dir, d))]
    
    logger.info(f"发现类别目录: {class_dirs}")
    
    for class_name in class_dirs:
        class_dir = os.path.join(dataset_dir, class_name)
        logger.info(f"扫描类别: {class_name}")
        
        # 获取所有图像文件（递归搜索）
        img_files = []
        for ext in ['.jpg', '.jpeg', '.png', '.webp', '.bmp', '.tiff', '.tif']:
            img_files.extend(list(Path(class_dir).glob(f'*{ext}')))
            img_files.extend(list(Path(class_dir).glob(f'*{ext.upper()}')))
            img_files.extend(list(Path(class_dir).glob(f'**/*{ext}')))
            img_files.extend(list(Path(class_dir).glob(f'**/*{ext.upper()}')))
        
        # 去重
        img_files = list(set(img_files))
        
        logger.info(f"  发现 {len(img_files)} 个图像文件")
        
        # 检查每个图像文件
        for img_path in img_files:
            total_files += 1
            is_valid, error = check_image_integrity(img_path)
            
            if is_valid:
                valid_files += 1
            else:
                corrupted_files.append((str(img_path), error))
                logger.warning(f"  损坏图像: {img_path.name}, 错误: {error}")
    
    logger.info(f"数据集扫描完成:")
    logger.info(f"  - 总文件数: {total_files}")
    logger.info(f"  - 有效文件: {valid_files}")
    logger.info(f"  - 损坏文件: {len(corrupted_files)}")
    
    if corrupted_files:
        logger.warning(f"损坏文件列表:")
        for file_path, error in corrupted_files[:20]:  # 只显示前20个
            logger.warning(f"  - {file_path}: {error}")
        if len(corrupted_files) > 20:
            logger.warning(f"  ... 还有 {len(corrupted_files) - 20} 个损坏文件")
    
    return total_files, valid_files, corrupted_files

def main():
    """主函数"""
    parser = argparse.ArgumentParser(description='图像文件修复工具')
    parser.add_argument('--dataset_dir', type=str, default='plant_dataset', 
                       help='数据集目录路径')
    parser.add_argument('--backup_dir', type=str, 
                       help='备份目录路径（可选）')
    parser.add_argument('--scan_only', action='store_true', 
                       help='仅扫描，不修复')
    parser.add_argument('--fix_only', action='store_true', 
                       help='仅修复，不扫描')
    parser.add_argument('--convert_format', type=str, default='JPEG',
                       choices=['JPEG', 'PNG'], help='转换格式')
    parser.add_argument('--debug', action='store_true', help='开启调试模式')
    
    args = parser.parse_args()
    
    if args.debug:
        logger.setLevel(logging.DEBUG)
        logger.info("调试模式已启用")
    
    # 检查数据集目录
    if not os.path.exists(args.dataset_dir):
        logger.error(f"数据集目录不存在: {args.dataset_dir}")
        return
    
    # 扫描数据集完整性
    if not args.fix_only:
        logger.info("=" * 50)
        logger.info("开始扫描数据集完整性")
        logger.info("=" * 50)
        scan_dataset_integrity(args.dataset_dir)
    
    # 修复损坏的图像
    if not args.scan_only:
        logger.info("=" * 50)
        logger.info("开始修复损坏的图像")
        logger.info("=" * 50)
        
        fixed_count, skipped_count, failed_count = fix_corrupted_images(
            args.dataset_dir, 
            args.backup_dir, 
            args.convert_format
        )
        
        if failed_count > 0:
            logger.warning(f"有 {failed_count} 个文件修复失败，请手动检查")
        else:
            logger.info("所有图像文件处理完成！")

if __name__ == "__main__":
    main()