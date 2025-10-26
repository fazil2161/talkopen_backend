# Open Talk - Automated Local Setup Script for Windows
# Run this script in PowerShell: .\setup-local.ps1

Write-Host "🚀 Open Talk - Local Setup Script" -ForegroundColor Cyan
Write-Host "==================================`n" -ForegroundColor Cyan

# Check if Node.js is installed
Write-Host "✓ Checking Node.js installation..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "  Node.js version: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "  ❌ Node.js is not installed!" -ForegroundColor Red
    Write-Host "  Please install Node.js from https://nodejs.org" -ForegroundColor Red
    exit 1
}

# Check if MongoDB is running
Write-Host "`n✓ Checking MongoDB..." -ForegroundColor Yellow
$mongoService = Get-Service -Name MongoDB -ErrorAction SilentlyContinue
if ($mongoService) {
    if ($mongoService.Status -eq "Running") {
        Write-Host "  MongoDB service is running" -ForegroundColor Green
    } else {
        Write-Host "  Starting MongoDB service..." -ForegroundColor Yellow
        Start-Service MongoDB
        Write-Host "  MongoDB started" -ForegroundColor Green
    }
} else {
    Write-Host "  ⚠️  MongoDB service not found. You may need to start it manually." -ForegroundColor Yellow
    Write-Host "  Run 'mongod' in a separate terminal or install MongoDB as a service" -ForegroundColor Yellow
}

# Setup Backend
Write-Host "`n✓ Setting up Backend..." -ForegroundColor Yellow
Set-Location backend

# Check if .env exists
if (-not (Test-Path .env)) {
    Write-Host "  Creating .env file from .env.example..." -ForegroundColor Yellow
    Copy-Item .env.example .env
    Write-Host "  .env file created. Update Razorpay keys if needed!" -ForegroundColor Green
} else {
    Write-Host "  .env file already exists" -ForegroundColor Green
}

# Install backend dependencies
Write-Host "  Installing backend dependencies..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -eq 0) {
    Write-Host "  Backend dependencies installed" -ForegroundColor Green
} else {
    Write-Host "  ❌ Backend dependency installation failed!" -ForegroundColor Red
    exit 1
}

Set-Location ..

# Setup Mobile
Write-Host "`n✓ Setting up Mobile App..." -ForegroundColor Yellow
Set-Location mobile

# Install mobile dependencies
Write-Host "  Installing mobile dependencies..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -eq 0) {
    Write-Host "  Mobile dependencies installed" -ForegroundColor Green
} else {
    Write-Host "  ❌ Mobile dependency installation failed!" -ForegroundColor Red
    exit 1
}

Set-Location ..

# Get computer's IP address
Write-Host "`n✓ Network Configuration:" -ForegroundColor Yellow
$ipAddress = (Get-NetIPAddress -AddressFamily IPv4 | Where-Object {$_.IPAddress -like "192.168.*" -or $_.IPAddress -like "10.0.*"} | Select-Object -First 1).IPAddress
if ($ipAddress) {
    Write-Host "  Your computer's IP: $ipAddress" -ForegroundColor Green
    Write-Host "  Update mobile/src/config/config.js with this IP if using physical device" -ForegroundColor Yellow
} else {
    Write-Host "  Could not detect IP address automatically" -ForegroundColor Yellow
    Write-Host "  Run 'ipconfig' to find your IP address" -ForegroundColor Yellow
}

# Final instructions
Write-Host "`n✅ Setup Complete!" -ForegroundColor Green
Write-Host "===================`n" -ForegroundColor Green

Write-Host "📋 Next Steps:" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Start Backend Server:" -ForegroundColor White
Write-Host "   cd backend" -ForegroundColor Gray
Write-Host "   npm run dev" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Update Mobile Config (in a new terminal):" -ForegroundColor White
Write-Host "   Edit mobile/src/config/config.js" -ForegroundColor Gray
Write-Host "   Change SERVER_IP to: $ipAddress (or 10.0.2.2 for emulator)" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Start Mobile App:" -ForegroundColor White
Write-Host "   cd mobile" -ForegroundColor Gray
Write-Host "   npm start" -ForegroundColor Gray
Write-Host ""
Write-Host "4. Run on Android:" -ForegroundColor White
Write-Host "   - For Emulator: npm run android" -ForegroundColor Gray
Write-Host "   - For Device: Scan QR code with Expo Go app" -ForegroundColor Gray
Write-Host ""
Write-Host "📚 For detailed instructions, see QUICK_START.md" -ForegroundColor Cyan
Write-Host ""
Write-Host "🎉 Happy coding!" -ForegroundColor Green



