import os
import numpy as np
import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import DataLoader
import torchvision.transforms as transforms
from torchvision.datasets import ImageFolder
from torchvision.models import resnet18
import matplotlib.pyplot as plt
import splitfolders
import traceback
# import kagglehub  # 注释掉kagglehub导入
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, cohen_kappa_score, hamming_loss

# 设置随机种子以确保结果可重复
torch.manual_seed(42)
np.random.seed(42)

# 配置参数类
class Config:
    def __init__(self):
        self.batch_size = 32
        self.num_epochs = 10
        self.learning_rate = 0.001
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.img_size = 224
        self.dataset_name = "plant_dataset"
        self.test_size = 0.1
        self.val_size = 0.1

# 创建配置实例
config = Config()
batch_size = config.batch_size
num_epochs = config.num_epochs
learning_rate = config.learning_rate
device = config.device
print(f"使用设备: {device}")

# 下载数据集 - 修改为使用本地数据集
def download_dataset():
    print("使用本地数据集...")
    # 检查是否存在本地数据集目录
    local_dataset_path = "plant_dataset"  # 使用plant_dataset目录
    if os.path.exists(local_dataset_path):
        print(f"找到本地数据集: {local_dataset_path}")
        return local_dataset_path
    else:
        print(f"未找到本地数据集目录: {local_dataset_path}")
        print("请手动创建数据集目录并放入图像文件")
        return None

# 数据集划分
def split_dataset(input_path, output_path, config):
    print(f"使用split-folders划分数据集...")
    print(f"输入目录: {input_path}")
    print(f"输出目录: {output_path}")
    
    # 检查输入目录
    if not os.path.exists(input_path):
        print(f"输入目录不存在: {input_path}")
        return False
    
    # 检查输入目录中是否有足够的类别和图像
    classes = [d for d in os.listdir(input_path) 
              if os.path.isdir(os.path.join(input_path, d))]
    
    print(f"在输入目录中找到以下类别: {classes}")
    
    if not classes:
        print(f"在 {input_path} 中找不到任何类别目录")
        return False
    
    # 检查每个类别是否有足够的图像
    valid_classes = True
    for cls in classes:
        cls_dir = os.path.join(input_path, cls)
        img_files = [f for f in os.listdir(cls_dir) 
                    if f.lower().endswith(('.jpg', '.jpeg', '.png', '.webp', '.bmp', '.tif', '.tiff'))]
        print(f"类别 '{cls}' 包含 {len(img_files)} 张图像")
        
        if len(img_files) == 0:
            print(f"类别 '{cls}' 中没有图像文件")
            valid_classes = False
    
    if not valid_classes:
        print("一些类别目录中没有找到图像文件")
        return False
    
    # 删除已存在的输出目录
    if os.path.exists(output_path):
        print(f"输出目录已存在，将被删除: {output_path}")
        import shutil
        shutil.rmtree(output_path)
    
    try:
        # 使用ratio方法按比例划分数据集
        train_ratio = 1 - config.test_size - config.val_size
        print(f"开始划分数据集，比例为: 训练={train_ratio}, 验证={config.val_size}, 测试={config.test_size}")
        splitfolders.ratio(
            input_path, 
            output=output_path, 
            seed=42, 
            ratio=(train_ratio, config.val_size, config.test_size)
        )
        
        # 检查划分后的数据集
        datasets = ['train', 'val', 'test']
        for dataset in datasets:
            dataset_dir = os.path.join(output_path, dataset)
            if not os.path.exists(dataset_dir):
                print(f"{dataset} 目录不存在: {dataset_dir}")
                return False
            
            dataset_classes = [d for d in os.listdir(dataset_dir) 
                              if os.path.isdir(os.path.join(dataset_dir, d))]
            
            if not dataset_classes:
                print(f"在 {dataset_dir} 中找不到任何类别目录")
                return False
            
            for cls in dataset_classes:
                cls_dir = os.path.join(dataset_dir, cls)
                img_files = [f for f in os.listdir(cls_dir) 
                            if f.lower().endswith(('.jpg', '.jpeg', '.png', '.webp', '.bmp', '.tif', '.tiff'))]
                print(f"{dataset} 集中类别 '{cls}' 包含 {len(img_files)} 张图像")
                
                if len(img_files) == 0:
                    print(f"{dataset} 集中类别 '{cls}' 没有图像文件")
                    return False
        
        print(f"数据集已成功划分到: {output_path}")
        return True
    except Exception as e:
        print(f"划分数据集时出错: {str(e)}")
        return False

# 数据加载和转换
def load_data(data_path, config):
    """加载已划分的数据集，并应用数据变换"""
    print(f"加载数据集: {data_path}")
    
    try:
        # 定义训练数据转换
        train_transform = transforms.Compose([
            transforms.Resize((config.img_size, config.img_size)),
            transforms.RandomHorizontalFlip(),  # 随机水平翻转
            transforms.RandomRotation(10),  # 随机旋转±10度
            transforms.RandomAffine(0, shear=10, scale=(0.8, 1.2)),  # 随机仿射变换
            transforms.ColorJitter(brightness=0.2, contrast=0.2, saturation=0.2),  # 颜色抖动
            transforms.ToTensor(),
            transforms.Normalize(
                mean=[0.485, 0.456, 0.406],
                std=[0.229, 0.224, 0.225]
            )
        ])
        
        # 验证和测试数据转换（没有增强）
        eval_transform = transforms.Compose([
            transforms.Resize((config.img_size, config.img_size)),
            transforms.ToTensor(),
            transforms.Normalize(
                mean=[0.485, 0.456, 0.406],
                std=[0.229, 0.224, 0.225]
            )
        ])
        
        # 检查数据路径
        train_dir = os.path.join(data_path, 'train')
        val_dir = os.path.join(data_path, 'val')
        test_dir = os.path.join(data_path, 'test')
        
        print(f"训练目录: {train_dir}")
        print(f"验证目录: {val_dir}")
        print(f"测试目录: {test_dir}")
        
        if not all(os.path.exists(p) for p in [train_dir, val_dir, test_dir]):
            missing = [p for p in [train_dir, val_dir, test_dir] if not os.path.exists(p)]
            print(f"数据目录不存在: {missing}")
            return None, None, None, None
        
        # 检查每个目录中的类别
        for dir_name, dir_path in [("训练", train_dir), ("验证", val_dir), ("测试", test_dir)]:
            classes = [d for d in os.listdir(dir_path) if os.path.isdir(os.path.join(dir_path, d))]
            print(f"{dir_name}目录中的类别: {classes}")
            
            if "FIELD IMAGES" in classes:
                print(f"发现原始数据集结构，数据集可能未被正确处理。请检查 {dir_path}")
                return None, None, None, None
            
            for cls in classes:
                cls_path = os.path.join(dir_path, cls)
                img_files = [f for f in os.listdir(cls_path) if f.lower().endswith(('.jpg', '.jpeg', '.png', '.webp', '.bmp', '.tif', '.tiff'))]
                print(f"{dir_name}目录中类别 '{cls}' 包含 {len(img_files)} 张图像")
                
                if len(img_files) == 0:
                    print(f"{dir_name}目录中类别 '{cls}' 没有图像文件")
                    return None, None, None, None
        
        # 创建数据集
        print(f"创建训练数据集: {train_dir}")
        train_dataset = ImageFolder(train_dir, transform=train_transform)
        
        print(f"创建验证数据集: {val_dir}")
        val_dataset = ImageFolder(val_dir, transform=eval_transform)
        
        print(f"创建测试数据集: {test_dir}")
        test_dataset = ImageFolder(test_dir, transform=eval_transform)
        
        # 创建数据加载器
        train_loader = DataLoader(
            train_dataset, 
            batch_size=config.batch_size, 
            shuffle=True,
            num_workers=0,  # Windows下设置为0避免多进程问题
            pin_memory=True if config.device.type == 'cuda' else False
        )
        
        val_loader = DataLoader(
            val_dataset, 
            batch_size=config.batch_size, 
            shuffle=False,
            num_workers=0,  # Windows下设置为0避免多进程问题
            pin_memory=True if config.device.type == 'cuda' else False
        )
        
        test_loader = DataLoader(
            test_dataset, 
            batch_size=config.batch_size, 
            shuffle=False,
            num_workers=0,  # Windows下设置为0避免多进程问题
            pin_memory=True if config.device.type == 'cuda' else False
        )
        
        print(f"类别: {train_dataset.classes}")
        print(f"类别索引映射: {train_dataset.class_to_idx}")
        print(f"训练集样本数: {len(train_dataset)}")
        print(f"验证集样本数: {len(val_dataset)}")
        print(f"测试集样本数: {len(test_dataset)}")
        
        # 检查是否有足够的样本
        if len(train_dataset) == 0 or len(val_dataset) == 0 or len(test_dataset) == 0:
            print("数据集中某些部分没有样本")
            return None, None, None, None
        
        # 检查是否有足够的类别
        if len(train_dataset.classes) < 2:
            print(f"数据集类别数量不足: {len(train_dataset.classes)}")
            return None, None, None, None
        
        return train_loader, val_loader, test_loader, train_dataset.classes
    
    except Exception as e:
        print(f"加载数据时出错: {str(e)}")
        import traceback
        print(traceback.format_exc())
        return None, None, None, None

# 构建分类模型
class OrangeClassifier(nn.Module):
    def __init__(self, num_classes=3, pretrained=True):
        super(OrangeClassifier, self).__init__()
        print(f"创建OrangeClassifier模型, 类别数={num_classes}, 使用预训练={pretrained}")
        
        # 使用预训练的ResNet18作为基础模型
        self.model = resnet18(pretrained=pretrained)
        
        # 添加Dropout层以防止过拟合
        self.model.fc = nn.Sequential(
            nn.Dropout(0.5),
            nn.Linear(self.model.fc.in_features, num_classes)
        )
        
    def forward(self, x):
        return self.model(x)

# 训练模型
def train_model(model, train_loader, val_loader, criterion, optimizer, scheduler, num_epochs, device, save_path="best_model.pth"):
    history = {
        'train_loss': [],
        'val_loss': [],
        'train_acc': [],
        'val_acc': []
    }
    
    best_val_acc = 0.0
    best_model_wts = None
    
    for epoch in range(num_epochs):
        # 训练阶段
        model.train()
        running_loss = 0.0
        correct = 0
        total = 0
        
        for images, labels in train_loader:
            images, labels = images.to(device), labels.to(device)
            
            # 梯度清零
            optimizer.zero_grad()
            
            # 前向传播
            outputs = model(images)
            loss = criterion(outputs, labels)
            
            # 反向传播和优化
            loss.backward()
            optimizer.step()
            
            # 统计损失和准确率
            running_loss += loss.item() * images.size(0)
            _, predicted = torch.max(outputs, 1)
            total += labels.size(0)
            correct += (predicted == labels).sum().item()
        
        epoch_loss = running_loss / len(train_loader.dataset)
        epoch_acc = correct / total
        history['train_loss'].append(epoch_loss)
        history['train_acc'].append(epoch_acc)
        
        # 验证阶段
        model.eval()
        val_loss = 0.0
        val_correct = 0
        val_total = 0
        
        with torch.no_grad():
            for images, labels in val_loader:
                images, labels = images.to(device), labels.to(device)
                outputs = model(images)
                loss = criterion(outputs, labels)
                
                val_loss += loss.item() * images.size(0)
                _, predicted = torch.max(outputs, 1)
                val_total += labels.size(0)
                val_correct += (predicted == labels).sum().item()
        
        val_epoch_loss = val_loss / len(val_loader.dataset)
        val_epoch_acc = val_correct / val_total
        history['val_loss'].append(val_epoch_loss)
        history['val_acc'].append(val_epoch_acc)
        
        # 更新学习率
        if scheduler:
            scheduler.step(val_epoch_loss)
            print(f'  当前学习率: {optimizer.param_groups[0]["lr"]:.6f}')
        
        print(f'Epoch {epoch+1}/{num_epochs}, '
              f'Train Loss: {epoch_loss:.4f}, Train Acc: {epoch_acc:.4f}, '
              f'Val Loss: {val_epoch_loss:.4f}, Val Acc: {val_epoch_acc:.4f}')
        
        # 保存最佳模型
        if val_epoch_acc > best_val_acc:
            print(f'  验证准确率提升: {best_val_acc:.4f} -> {val_epoch_acc:.4f}')
            best_val_acc = val_epoch_acc
            best_model_wts = model.state_dict().copy()
            torch.save(best_model_wts, save_path)
            print(f'  保存最佳模型到: {save_path}')
    
    # 训练完成，加载最佳模型
    if best_model_wts:
        model.load_state_dict(best_model_wts)
        print(f'训练完成! 最佳验证准确率: {best_val_acc:.4f}')
    
    return model, history

# 评估模型
def evaluate_model(model, dataloader, device, classes):
    model.eval()
    all_labels = []
    all_preds = []
    
    with torch.no_grad():
        for images, labels in dataloader:
            images, labels = images.to(device), labels.to(device)
            outputs = model(images)
            _, predicted = torch.max(outputs, 1)
            
            all_labels.extend(labels.cpu().numpy())
            all_preds.extend(predicted.cpu().numpy())
    
    # 计算各种评估指标
    metrics = {
        'accuracy': accuracy_score(all_labels, all_preds),
        'precision': precision_score(all_labels, all_preds, average='weighted', zero_division=0),
        'recall': recall_score(all_labels, all_preds, average='weighted', zero_division=0),
        'f1': f1_score(all_labels, all_preds, average='weighted', zero_division=0),
        'kappa': cohen_kappa_score(all_labels, all_preds),
        'hamming_loss': hamming_loss(all_labels, all_preds)
    }
    
    print("\n模型评估指标:")
    print(f"准确率 (Accuracy): {metrics['accuracy']:.4f}")
    print(f"精确率 (Precision): {metrics['precision']:.4f}")
    print(f"召回率 (Recall): {metrics['recall']:.4f}")
    print(f"F1分数 (F1 Score): {metrics['f1']:.4f}")
    print(f"Kappa系数 (Cohen's Kappa): {metrics['kappa']:.4f}")
    print(f"汉明损失 (Hamming Loss): {metrics['hamming_loss']:.4f}")
    
    return metrics

# 绘制训练历史图表
def plot_history(history):
    plt.figure(figsize=(12, 4))
    
    # 绘制损失
    plt.subplot(1, 2, 1)
    plt.plot(history['train_loss'], label='训练损失')
    plt.plot(history['val_loss'], label='验证损失')
    plt.title('模型损失')
    plt.xlabel('Epoch')
    plt.ylabel('损失')
    plt.legend()
    
    # 绘制准确率
    plt.subplot(1, 2, 2)
    plt.plot(history['train_acc'], label='训练准确率')
    plt.plot(history['val_acc'], label='验证准确率')
    plt.title('模型准确率')
    plt.xlabel('Epoch')
    plt.ylabel('准确率')
    plt.legend()
    
    plt.tight_layout()
    plt.savefig('training_history.png')
    plt.show()

def main():
    # 下载数据集
    dataset_path = download_dataset()
    
    if dataset_path is None:
        print("错误：无法找到数据集。请创建 'dataset' 目录并放入图像文件。")
        print("数据集结构应该是：")
        print("dataset/")
        print("├── 类别1/")
        print("│   ├── image1.jpg")
        print("│   └── ...")
        print("├── 类别2/")
        print("│   ├── image1.jpg")
        print("│   └── ...")
        print("└── ...")
        return
    
    # 划分数据集
    split_path = "orange_split_dataset"
    if not split_dataset(dataset_path, split_path, config):
        print("数据集划分失败，程序终止")
        return
    
    # 加载数据
    train_loader, val_loader, test_loader, classes = load_data(split_path, config)
    
    if None in [train_loader, val_loader, test_loader, classes]:
        print("数据加载失败，程序终止")
        return
    
    # 创建模型
    model = OrangeClassifier(num_classes=len(classes), pretrained=True)
    model = model.to(device)
    
    # 定义损失函数和优化器
    criterion = nn.CrossEntropyLoss()
    optimizer = optim.Adam(model.parameters(), lr=learning_rate)
    
    # 学习率调度器 (ReduceLROnPlateau)
    scheduler = optim.lr_scheduler.ReduceLROnPlateau(
        optimizer, mode='min', factor=0.1, patience=3
    )
    
    # 训练模型
    trained_model, history = train_model(
        model, train_loader, val_loader, criterion, optimizer, scheduler, num_epochs, device, "orange_classifier.pth"
    )
    
    # 评估模型
    evaluate_model(trained_model, test_loader, device, classes)
    
    # 绘制训练历史
    plot_history(history)
    
    # 保存模型
    torch.save(trained_model.state_dict(), 'orange_classifier.pth')
    print("模型已保存为 'orange_classifier.pth'")

if __name__ == "__main__":
    main() 