#!/usr/bin/env python3
"""
API自动启动服务
用于从Web界面启动Flask API服务器
"""

import os
import sys
import subprocess
import json
import time
import threading
from flask import Flask, request, jsonify
from flask_cors import CORS

# 添加项目根目录到Python路径
project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(project_root)

app = Flask(__name__)
CORS(app)

# 全局变量存储API进程
api_process = None

def start_flask_api():
    """启动Flask API服务器"""
    global api_process
    
    try:
        # 获取虚拟环境Python路径
        venv_python = os.path.join(project_root, 'venv', 'Scripts', 'python.exe')
        if not os.path.exists(venv_python):
            venv_python = os.path.join(project_root, 'venv', 'bin', 'python')
        
        # Flask API脚本路径
        api_script = os.path.join(project_root, 'src', 'datas', 'app.py')
        
        print(f"启动Flask API服务器...")
        print(f"Python路径: {venv_python}")
        print(f"API脚本: {api_script}")
        print(f"工作目录: {project_root}")
        
        # 检查文件是否存在
        if not os.path.exists(venv_python):
            print(f"❌ 虚拟环境Python不存在: {venv_python}")
            return False
        
        if not os.path.exists(api_script):
            print(f"❌ API脚本不存在: {api_script}")
            return False
        
        # 启动API服务器
        api_process = subprocess.Popen(
            [venv_python, api_script],
            cwd=project_root,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            shell=False
        )
        
        print(f"✅ API服务器进程ID: {api_process.pid}")
        return True
        
    except Exception as e:
        print(f"❌ 启动API服务器失败: {e}")
        return False

def check_api_health():
    """检查API健康状态"""
    try:
        import requests
        response = requests.get("http://localhost:8000/api/health", timeout=5)
        return response.status_code == 200 and response.json().get("status") == "healthy"
    except:
        return False

@app.route('/api/start', methods=['POST'])
def start_api():
    """启动API服务器接口"""
    global api_process
    
    try:
        # 检查API是否已经在运行
        if check_api_health():
            return jsonify({
                "success": True,
                "message": "API服务已经在运行",
                "status": "already_running"
            })
        
        # 启动API服务器
        if start_flask_api():
            # 等待API启动
            for i in range(30):  # 最多等待30秒
                time.sleep(1)
                if check_api_health():
                    return jsonify({
                        "success": True,
                        "message": "API服务启动成功",
                        "status": "started"
                    })
            
            return jsonify({
                "success": False,
                "message": "API服务启动超时",
                "status": "timeout"
            })
        else:
            return jsonify({
                "success": False,
                "message": "API服务启动失败",
                "status": "failed"
            })
            
    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"启动API时发生错误: {str(e)}",
            "status": "error"
        })

@app.route('/api/status', methods=['GET'])
def get_status():
    """获取API状态"""
    global api_process
    
    try:
        if check_api_health():
            return jsonify({
                "success": True,
                "status": "running",
                "message": "API服务正常运行"
            })
        else:
            return jsonify({
                "success": False,
                "status": "stopped",
                "message": "API服务未运行"
            })
    except Exception as e:
        return jsonify({
            "success": False,
            "status": "error",
            "message": f"检查状态时发生错误: {str(e)}"
        })

@app.route('/api/stop', methods=['POST'])
def stop_api():
    """停止API服务器"""
    global api_process
    
    try:
        if api_process and api_process.poll() is None:
            api_process.terminate()
            api_process.wait()
            api_process = None
            return jsonify({
                "success": True,
                "message": "API服务已停止"
            })
        else:
            return jsonify({
                "success": False,
                "message": "API服务未在运行"
            })
    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"停止API时发生错误: {str(e)}"
        })

@app.route('/health', methods=['GET'])
def health():
    """健康检查接口"""
    return jsonify({
        "status": "healthy",
        "message": "API启动服务正常运行"
    })

if __name__ == '__main__':
    print("🚀 API启动服务正在启动...")
    print(f"项目根目录: {project_root}")
    
    # 检查虚拟环境
    venv_path = os.path.join(project_root, 'venv')
    if not os.path.exists(venv_path):
        print("❌ 虚拟环境不存在，请先创建虚拟环境")
        sys.exit(1)
    
    # 检查模型文件
    model_path = os.path.join(project_root, 'outputs', 'orange_classifier.pth')
    if not os.path.exists(model_path):
        print("❌ 模型文件不存在，请先训练模型")
        sys.exit(1)
    
    print("✅ 环境检查通过")
    print("🌐 启动API启动服务...")
    
    # 启动Flask应用
    app.run(host='0.0.0.0', port=8002, debug=False)
