@echo off
echo 智能防控系统启动脚本
echo ========================

echo 正在检查文件结构...
if not exist "index.html" (
    echo 错误: 找不到 index.html 文件
    pause
    exit /b 1
)

if not exist "css\" (
    echo 错误: 找不到 css 文件夹
    pause
    exit /b 1
)

if not exist "js\" (
    echo 错误: 找不到 js 文件夹
    pause
    exit /b 1
)

echo 文件结构检查完成 ✓

echo.
echo 启动选项:
echo 1. 打开演示页面 (demo.html)
echo 2. 打开主系统 (index.html)
echo 3. 查看文档 (README.md)
echo 4. 退出
echo.

set /p choice=请选择 (1-4): 

if "%choice%"=="1" (
    echo 正在打开演示页面...
    start demo.html
) else if "%choice%"=="2" (
    echo 正在打开主系统...
    start index.html
) else if "%choice%"=="3" (
    echo 正在打开文档...
    start README.md
) else if "%choice%"=="4" (
    echo 再见!
    exit /b 0
) else (
    echo 无效选择，请重新运行脚本
    pause
    exit /b 1
)

echo.
echo 系统已启动，请在浏览器中查看
echo 按任意键退出...
pause >nul







