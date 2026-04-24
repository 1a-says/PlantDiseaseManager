# 植物叶片病害与害虫检测系统 - API启动脚本
Write-Host "🌱 植物叶片病害与害虫检测系统 - API启动" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Green

# 设置当前目录
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptPath

Write-Host "📁 当前目录: $(Get-Location)" -ForegroundColor Cyan

# 检查虚拟环境
$venvPython = "venv\Scripts\python.exe"
if (-not (Test-Path $venvPython)) {
    Write-Host "❌ 虚拟环境不存在，请先创建虚拟环境" -ForegroundColor Red
    Read-Host "按任意键退出"
    exit 1
}

# 检查模型文件
$modelPath = "outputs\orange_classifier.pth"
if (-not (Test-Path $modelPath)) {
    Write-Host "❌ 模型文件不存在，请先训练模型" -ForegroundColor Red
    Read-Host "按任意键退出"
    exit 1
}

Write-Host "✅ 环境检查通过" -ForegroundColor Green

Write-Host "🚀 启动Flask API服务器..." -ForegroundColor Yellow
Start-Process -FilePath $venvPython -ArgumentList "src\datas\app.py" -WindowStyle Normal

Write-Host "⏳ 等待API启动..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

Write-Host "🌐 启动HTTP服务器..." -ForegroundColor Yellow
Start-Process -FilePath "python" -ArgumentList "-m", "http.server", "8001" -WorkingDirectory "src\datas" -WindowStyle Normal

Write-Host "⏳ 等待HTTP服务器启动..." -ForegroundColor Yellow
Start-Sleep -Seconds 3

Write-Host "🌐 打开浏览器..." -ForegroundColor Yellow
Start-Process "http://localhost:8001/index.html"

Write-Host ""
Write-Host "🎉 系统启动完成！" -ForegroundColor Green
Write-Host "📱 访问地址: http://localhost:8001/index.html" -ForegroundColor Cyan
Write-Host "🔧 API服务: http://localhost:8000" -ForegroundColor Cyan
Write-Host ""
Write-Host "按任意键退出..." -ForegroundColor Yellow
Read-Host