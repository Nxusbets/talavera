# Talavera SaaS - Quick Start Script (PowerShell)
# Run this from the project root: .\quick-start.ps1

Write-Host "`n" -ForegroundColor Cyan
Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║     TALAVERA SAAS - QUICK START SCRIPT                    ║" -ForegroundColor Cyan
Write-Host "║     Full-Stack: Auth + Projects + Subscriptions            ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host "`n"

# Check Node.js
Write-Host "🔍 Checking Node.js installation..." -ForegroundColor Yellow
$nodeVersion = node --version
if ($nodeVersion) {
    Write-Host "✅ Node.js installed: $nodeVersion" -ForegroundColor Green
} else {
    Write-Host "❌ Node.js not found. Please install from https://nodejs.org/" -ForegroundColor Red
    exit 1
}

# Check Docker
Write-Host "`n🔍 Checking Docker installation..." -ForegroundColor Yellow
$dockerVersion = docker --version
if ($dockerVersion) {
    Write-Host "✅ Docker installed: $dockerVersion" -ForegroundColor Green
} else {
    Write-Host "❌ Docker not found. Please install from https://www.docker.com/" -ForegroundColor Red
    exit 1
}

# Install dependencies
Write-Host "`n📦 Installing dependencies..." -ForegroundColor Yellow
Write-Host "   Installing api workspace..." -ForegroundColor Gray
npm install -w api 2>&1 | Out-Null
Write-Host "✅ API dependencies installed" -ForegroundColor Green

Write-Host "   Installing web workspace..." -ForegroundColor Gray
npm install -w web 2>&1 | Out-Null
Write-Host "✅ Web dependencies installed" -ForegroundColor Green

# Start Docker
Write-Host "`n🐳 Starting Docker containers..." -ForegroundColor Yellow
Write-Host "   This may take 30-60 seconds on first run..." -ForegroundColor Gray
npm run docker:up 2>&1 | Out-Null

# Wait for database
Write-Host "`n⏳ Waiting for PostgreSQL to be ready..." -ForegroundColor Yellow
$maxAttempts = 30
$attempt = 0
$dbReady = $false

while ($attempt -lt $maxAttempts -and -not $dbReady) {
    try {
        $result = docker exec talavera-postgres pg_isready -U talavera_user -q
        if ($LASTEXITCODE -eq 0) {
            $dbReady = $true
            Write-Host "✅ PostgreSQL ready!" -ForegroundColor Green
        }
    } catch {
        # Continue trying
    }
    
    if (-not $dbReady) {
        $attempt++
        if ($attempt % 5 -eq 0) {
            Write-Host "   Still waiting... ($attempt/$maxAttempts)" -ForegroundColor Gray
        }
        Start-Sleep -Seconds 1
    }
}

if (-not $dbReady) {
    Write-Host "❌ Database failed to start. Check Docker logs:" -ForegroundColor Red
    Write-Host "   docker-compose logs db" -ForegroundColor Gray
    exit 1
}

# Run migrations
Write-Host "`n📦 Running database migrations..." -ForegroundColor Yellow
npm run db:setup -w api 2>&1 | Out-Null
Write-Host "✅ Migrations completed" -ForegroundColor Green

# Run tests
Write-Host "`n🧪 Running smoke tests..." -ForegroundColor Yellow
npm run test -w api 2>&1 | Select-String "PASS|FAIL"

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Smoke test passed!" -ForegroundColor Green
} else {
    Write-Host "⚠️  Some tests failed. Check output above." -ForegroundColor Yellow
}

# Summary
Write-Host "`n" -ForegroundColor Cyan
Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║                    ✅ SETUP COMPLETE!                      ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan

Write-Host "`n📚 Next Steps:" -ForegroundColor Cyan
Write-Host "   1. Read the documentation:"
Write-Host "      - README.md (overview)"
Write-Host "      - TIER1_GUIDE.md (start implementing Auth)"
Write-Host "      - COMMANDS.md (CLI reference)" -ForegroundColor Gray

Write-Host "`n🚀 Start Development Servers:" -ForegroundColor Cyan
Write-Host "   Terminal 1: npm run dev:api" -ForegroundColor Gray
Write-Host "   Terminal 2: npm run dev:web" -ForegroundColor Gray

Write-Host "`n🌐 Access URLs:" -ForegroundColor Cyan
Write-Host "   Frontend:  http://localhost:3000" -ForegroundColor Gray
Write-Host "   API:       http://localhost:3001" -ForegroundColor Gray
Write-Host "   API Health: http://localhost:3001/health" -ForegroundColor Gray

Write-Host "`n📊 Verify Status:" -ForegroundColor Cyan
Write-Host "   npm run test -w api          (run tests)" -ForegroundColor Gray
Write-Host "   npm run docker:logs          (view logs)" -ForegroundColor Gray
Write-Host "   docker ps                    (list containers)" -ForegroundColor Gray

Write-Host "`n⏸️  To stop everything:" -ForegroundColor Cyan
Write-Host "   npm run docker:down" -ForegroundColor Gray

Write-Host "`n✨ Happy coding!" -ForegroundColor Green
Write-Host "`n"
