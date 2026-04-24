#!/usr/bin/env python3
"""
一键启动脚本 - 自动启动API和HTTP服务器
"""

import subprocess
import sys
import os
import time
import webbrowser

def main():
    print("🌱 植物叶片病害与害虫检测系统 - 一键启动")
    print("=" * 50)
    
    # 切换到项目目录
    project_root = os.path.dirname(os.path.abspath(__file__))
    os.chdir(project_root)
    
    print(f"📁 项目目录: {project_root}")
    
    # 检查环境
    venv_path = os.path.join(project_root, 'venv')
    model_path = os.path.join(project_root, 'outputs', 'orange_classifier.pth')
    
    if not os.path.exists(venv_path):
        print("❌ 虚拟环境不存在，请先创建虚拟环境")
        return
    
    if not os.path.exists(model_path):
        print("❌ 模型文件不存在，请先训练模型")
        return
    
    print("✅ 环境检查通过")
    
    try:
        # 启动API启动服务
        print("🚀 启动API启动服务...")
        api_starter = subprocess.Popen([
            sys.executable, 
            'src/datas/api_starter.py'
        ], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        
        time.sleep(3)  # 等待API启动服务启动
        
        # 启动HTTP服务器
        print("🌐 启动HTTP服务器...")
        http_server = subprocess.Popen([
            sys.executable, '-m', 'http.server', '8001'
        ], cwd='src/datas', stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        
        time.sleep(2)  # 等待HTTP服务器启动
        
        # 打开浏览器
        print("🌐 打开浏览器...")
        webbrowser.open('http://localhost:8001/index.html')
        
        print("\n🎉 系统启动完成！")
        print("📱 访问地址: http://localhost:8001/index.html")
        print("💡 现在打开网页时会自动启动API服务")
        print("\n按 Ctrl+C 停止所有服务")
        
        # 保持运行
        try:
            while True:
                time.sleep(1)
        except KeyboardInterrupt:
            print("\n👋 正在关闭服务...")
            api_starter.terminate()
            http_server.terminate()
            print("✅ 所有服务已关闭")
            
    except Exception as e:
        print(f"❌ 启动失败: {e}")

if __name__ == '__main__':
    main()
