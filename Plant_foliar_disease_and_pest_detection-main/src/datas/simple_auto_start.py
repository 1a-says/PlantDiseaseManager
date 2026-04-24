#!/usr/bin/env python3
"""
简化的自动启动脚本
直接启动Flask API和HTTP服务器
"""

import subprocess
import sys
import os
import time
import webbrowser
import threading

def start_flask_api():
    """启动Flask API服务器"""
    try:
        print("🚀 启动Flask API服务器...")
        
        # 获取虚拟环境Python路径
        project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        venv_python = os.path.join(project_root, 'venv', 'Scripts', 'python.exe')
        api_script = os.path.join(project_root, 'src', 'datas', 'app.py')
        
        print(f"Python路径: {venv_python}")
        print(f"API脚本: {api_script}")
        print(f"工作目录: {project_root}")
        
        # 启动API服务器
        process = subprocess.Popen(
            [venv_python, api_script],
            cwd=project_root,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True
        )
        
        print(f"✅ Flask API服务器已启动，进程ID: {process.pid}")
        return process
        
    except Exception as e:
        print(f"❌ 启动Flask API失败: {e}")
        return None

def start_http_server():
    """启动HTTP服务器"""
    try:
        print("🌐 启动HTTP服务器...")
        
        # 切换到src/datas目录
        current_dir = os.path.dirname(os.path.abspath(__file__))
        
        process = subprocess.Popen(
            [sys.executable, '-m', 'http.server', '8001'],
            cwd=current_dir,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True
        )
        
        print(f"✅ HTTP服务器已启动，进程ID: {process.pid}")
        return process
        
    except Exception as e:
        print(f"❌ 启动HTTP服务器失败: {e}")
        return None

def wait_for_api():
    """等待API启动"""
    import requests
    
    print("⏳ 等待API服务启动...")
    max_attempts = 30
    
    for i in range(max_attempts):
        try:
            response = requests.get("http://localhost:8000/api/health", timeout=2)
            if response.status_code == 200:
                print("✅ API服务已就绪")
                return True
        except:
            pass
        
        print(f"⏳ 等待中... ({i+1}/{max_attempts})")
        time.sleep(1)
    
    print("❌ API服务启动超时")
    return False

def main():
    print("🌱 植物叶片病害与害虫检测系统 - 简化启动版")
    print("=" * 60)
    
    # 检查环境
    project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    venv_path = os.path.join(project_root, 'venv')
    venv_python = os.path.join(venv_path, 'Scripts', 'python.exe')
    model_path = os.path.join(project_root, 'outputs', 'orange_classifier.pth')
    
    print(f"📁 项目根目录: {project_root}")
    print(f"🐍 虚拟环境路径: {venv_path}")
    print(f"🐍 Python路径: {venv_python}")
    
    if not os.path.exists(venv_python):
        print("❌ 虚拟环境Python不存在，请先创建虚拟环境")
        return
    
    if not os.path.exists(model_path):
        print("❌ 模型文件不存在，请先训练模型")
        return
    
    print("✅ 环境检查通过")
    
    try:
        # 启动Flask API服务器
        api_process = start_flask_api()
        if not api_process:
            print("❌ 无法启动API服务器")
            return
        
        # 等待API启动
        if not wait_for_api():
            print("❌ API启动失败")
            api_process.terminate()
            return
        
        # 启动HTTP服务器
        http_process = start_http_server()
        if not http_process:
            print("❌ 无法启动HTTP服务器")
            api_process.terminate()
            return
        
        # 等待HTTP服务器启动
        time.sleep(2)
        
        # 打开浏览器
        print("🌐 打开浏览器...")
        webbrowser.open('http://localhost:8001/index.html')
        
        print("\n🎉 系统启动完成！")
        print("📱 访问地址: http://localhost:8001/index.html")
        print("🔧 API服务: http://localhost:8000")
        print("\n按 Ctrl+C 停止所有服务")
        
        # 保持运行
        try:
            while True:
                time.sleep(1)
        except KeyboardInterrupt:
            print("\n👋 正在关闭服务...")
            api_process.terminate()
            http_process.terminate()
            print("✅ 所有服务已关闭")
            
    except Exception as e:
        print(f"❌ 启动失败: {e}")

if __name__ == '__main__':
    main()
