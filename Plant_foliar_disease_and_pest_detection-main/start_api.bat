@echo off
echo 🌱 植物叶片病害与害虫检测系统 - API启动
echo ================================================

cd /d "%~dp0"

echo 📁 当前目录: %CD%

echo 🐍 激活虚拟环境...
call venv\Scripts\activate.bat

echo 🚀 启动Flask API服务器...
start "Flask API" cmd /k "venv\Scripts\python.exe src\datas\app.py"

echo ⏳ 等待API启动...
timeout /t 5 /nobreak >nul

echo 🌐 启动HTTP服务器...
start "HTTP Server" cmd /k "cd src\datas && python -m http.server 8001"

echo ⏳ 等待HTTP服务器启动...
timeout /t 3 /nobreak >nul

echo 🌐 打开浏览器...
start http://localhost:8001/index.html

echo.
echo 🎉 系统启动完成！
echo 📱 访问地址: http://localhost:8001/index.html
echo 🔧 API服务: http://localhost:8000
echo.
echo 按任意键退出...
pause >nul

