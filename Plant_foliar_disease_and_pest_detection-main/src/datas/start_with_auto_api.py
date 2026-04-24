#!/usr/bin/env python3
"""
带自动API启动功能的HTTP服务器
"""

import subprocess
import sys
import os
import time
import threading
import webbrowser

def start_api_starter():
    """启动API启动服务"""
    try:
        print("🚀 启动API启动服务...")
        api_starter_script = os.path.join(os.path.dirname(__file__), 'api_starter.py')
        subprocess.Popen([sys.executable, api_starter_script], 
                        stdout=subprocess.PIPE, 
                        stderr=subprocess.PIPE)
        print("✅ API启动服务已启动")
    except Exception as e:
        print(f"❌ 启动API启动服务失败: {e}")

def start_http_server():
    """启动HTTP服务器"""
    try:
        print("🌐 启动HTTP服务器...")
        subprocess.Popen([sys.executable, '-m', 'http.server', '8001'], 
                        stdout=subprocess.PIPE, 
                        stderr=subprocess.PIPE)
        print("✅ HTTP服务器已启动")
    except Exception as e:
        print(f"❌ 启动HTTP服务器失败: {e}")

def main():
    print("🌱 植物叶片病害与害虫检测系统 - 自动启动版")
    print("=" * 60)
    
    # 检查环境
    project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    venv_path = os.path.join(project_root, 'venv')
    model_path = os.path.join(project_root, 'outputs', 'orange_classifier.pth')
    
    if not os.path.exists(venv_path):
        print("❌ 虚拟环境不存在，请先创建虚拟环境")
        return
    
    if not os.path.exists(model_path):
        print("❌ 模型文件不存在，请先训练模型")
        return
    
    print("✅ 环境检查通过")
    
    # 启动API启动服务（在后台）
    start_api_starter()
    time.sleep(2)  # 等待API启动服务启动
    
    # 启动HTTP服务器（在后台）
    start_http_server()
    time.sleep(2)  # 等待HTTP服务器启动
    
    # 打开浏览器
    try:
        webbrowser.open('http://localhost:8001/index.html')
        print("✅ 浏览器已自动打开")
    except Exception as e:
        print(f"⚠️ 无法自动打开浏览器: {e}")
        print("请手动访问: http://localhost:8001/index.html")
    
    print("\n🎉 系统启动完成！")
    print("📱 访问地址: http://localhost:8001/index.html")
    print("🔧 API启动服务: http://localhost:8002")
    print("💡 现在打开网页时会自动启动API服务")
    print("\n按 Ctrl+C 停止所有服务")
    
    try:
        # 保持主进程运行
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("\n👋 正在关闭服务...")
        print("✅ 所有服务已关闭")

if __name__ == '__main__':
    main()
