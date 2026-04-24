#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
植物叶片病害与害虫检测系统启动脚本
"""

import os
import sys
import subprocess
import time
import webbrowser
import threading
from pathlib import Path

def check_venv():
    """检查虚拟环境"""
    venv_path = Path("venv")
    if not venv_path.exists():
        print("❌ 虚拟环境不存在，请先创建虚拟环境")
        print("运行: python -m venv venv")
        return False
    
    # 检查激活脚本
    if os.name == 'nt':  # Windows
        activate_script = venv_path / "Scripts" / "activate.bat"
    else:  # Linux/Mac
        activate_script = venv_path / "bin" / "activate"
    
    if not activate_script.exists():
        print("❌ 虚拟环境激活脚本不存在")
        return False
    
    print("✅ 虚拟环境检查通过")
    return True

def check_dependencies():
    """检查依赖包"""
    required_packages = [
        'torch', 'torchvision', 'PIL', 'flask', 'flask_cors', 'requests'
    ]
    
    missing_packages = []
    for package in required_packages:
        try:
            __import__(package)
        except ImportError:
            missing_packages.append(package)
    
    if missing_packages:
        print(f"❌ 缺少依赖包: {', '.join(missing_packages)}")
        print("正在安装依赖包...")
        
        # 安装依赖
        if os.name == 'nt':  # Windows
            pip_cmd = "venv\\Scripts\\pip"
        else:  # Linux/Mac
            pip_cmd = "venv/bin/pip"
        
        for package in missing_packages:
            # 处理包名映射
            install_package = package
            if package == 'PIL':
                install_package = 'pillow'
            elif package == 'flask_cors':
                install_package = 'flask-cors'
            
            print(f"正在安装 {install_package}...")
            subprocess.run([pip_cmd, "install", install_package], check=True)
        
        print("✅ 依赖包安装完成")
    else:
        print("✅ 依赖包检查通过")
    
    return True

def check_model():
    """检查模型文件"""
    model_path = Path("outputs/orange_classifier.pth")
    if not model_path.exists():
        print("❌ 模型文件不存在")
        print("请先训练模型或检查模型文件路径")
        return False
    
    print("✅ 模型文件检查通过")
    return True

def print_app_log(process):
    """实时打印 app.py 的输出日志"""
    while True:
        line = process.stdout.readline()
        if not line:
            break
        print(f"[APP 日志] {line.strip()}")

def check_api_health():
    """检查API健康状态，支持重试"""
    try:
        import requests
    except ImportError:
        print("❌ requests模块未安装，无法进行健康检查")
        return False
    
    max_retries = 5
    retry_interval = 2  # 每次重试间隔2秒
    
    for i in range(max_retries):
        try:
            response = requests.get("http://localhost:8000/api/health", timeout=5)
            if response.status_code == 200:
                print("✅ API服务器健康检查通过")
                return True
        except Exception as e:
            print(f"[重试 {i+1}/{max_retries}] 连接API失败: {e}")
            if i < max_retries - 1:
                time.sleep(retry_interval)
    
    return False

def start_api_server():
    """启动API服务器"""
    print("🚀 启动API服务器...")
    
    # 获取项目根目录
    project_root = os.getcwd()
    app_dir = os.path.join(project_root, "src", "datas")
    
    # 确保app.py目录存在
    if not os.path.exists(app_dir):
        print(f"❌ app.py目录不存在: {app_dir}")
        return None
    
    # 获取虚拟环境Python路径
    if os.name == 'nt':  # Windows
        venv_python = os.path.join(project_root, "venv", "Scripts", "python.exe")
    else:  # Linux/Mac
        venv_python = os.path.join(project_root, "venv", "bin", "python")
    
    # 检查虚拟环境Python是否存在
    if not os.path.exists(venv_python):
        print(f"❌ 虚拟环境Python不存在: {venv_python}")
        return None
    
    try:
        print(f"使用Python路径: {venv_python}")
        print(f"工作目录: {app_dir}")
        
        # 启动API服务器，指定工作目录
        process = subprocess.Popen([
            venv_python, "app.py"
        ], 
        cwd=app_dir,  # 显式指定工作目录
        stdout=subprocess.PIPE, 
        stderr=subprocess.STDOUT,
        text=True,
        bufsize=1,
        universal_newlines=True
        )
        
        # 启动日志打印线程
        log_thread = threading.Thread(target=lambda: print_app_log(process), daemon=True)
        log_thread.start()
        
        # 等待服务器启动
        print("⏳ 等待API服务器启动...")
        time.sleep(5)
        
        # 检查服务器是否启动成功
        if check_api_health():
            print("✅ API服务器启动成功")
            return process
        else:
            print("❌ API服务器启动失败")
            process.terminate()
            return None
            
    except Exception as e:
        print(f"❌ 启动API服务器失败: {e}")
        return None

def start_http_server():
    """启动HTTP服务器"""
    print("🌐 启动HTTP服务器...")
    
    try:
        # 获取项目根目录
        project_root = os.getcwd()
        http_dir = os.path.join(project_root, "src", "datas")
        
        # 确保HTTP服务器目录存在
        if not os.path.exists(http_dir):
            print(f"❌ HTTP服务器目录不存在: {http_dir}")
            return None
        
        # 获取虚拟环境Python路径
        if os.name == 'nt':  # Windows
            venv_python = os.path.join(project_root, "venv", "Scripts", "python.exe")
        else:  # Linux/Mac
            venv_python = os.path.join(project_root, "venv", "bin", "python")
        
        # 启动HTTP服务器，指定工作目录
        process = subprocess.Popen([
            venv_python, "-m", "http.server", "8001"
        ], 
        cwd=http_dir,  # 显式指定工作目录
        stdout=subprocess.PIPE, 
        stderr=subprocess.PIPE,
        text=True
        )
        
        # 等待服务器启动
        time.sleep(2)
        
        print("✅ HTTP服务器启动成功")
        return process
        
    except Exception as e:
        print(f"❌ 启动HTTP服务器失败: {e}")
        return None

def main():
    """主函数"""
    print("🌱 植物叶片病害与害虫检测系统")
    print("=" * 50)
    
    # 检查虚拟环境
    if not check_venv():
        return
    
    # 检查依赖包
    if not check_dependencies():
        return
    
    # 检查模型文件
    if not check_model():
        return
    
    print("\n🚀 启动系统...")
    
    # 启动API服务器
    api_process = start_api_server()
    if not api_process:
        return
    
    # 启动HTTP服务器
    http_process = start_http_server()
    if not http_process:
        api_process.terminate()
        return
    
    print("\n✅ 系统启动完成！")
    print("📱 访问地址:")
    print("   - Web界面: http://localhost:8001/index.html")
    print("   - API接口: http://localhost:8000/api/health")
    print("\n💡 使用说明:")
    print("   1. 打开浏览器访问上述地址")
    print("   2. 上传植物叶片图片进行识别")
    print("   3. 查看识别结果和置信度")
    print("\n⚠️  按 Ctrl+C 停止服务器")
    
    # 自动打开浏览器
    try:
        webbrowser.open("http://localhost:8001/index.html")
    except:
        pass
    
    try:
        # 等待用户中断
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("\n🛑 正在停止服务器...")
        api_process.terminate()
        http_process.terminate()
        print("✅ 服务器已停止")

if __name__ == "__main__":
    main()