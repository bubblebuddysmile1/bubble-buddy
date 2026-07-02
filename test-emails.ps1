# Email Testing Script for Bubble Buddy (PowerShell)
# Use this to test email functionality on Windows

Write-Host "🧪 Bubble Buddy Email Testing Script (PowerShell)" -ForegroundColor Cyan
Write-Host "=================================================" -ForegroundColor Cyan
Write-Host ""

$ApiBaseUrl = $env:API_BASE_URL -or "http://localhost:3000"
$AdminEmail = $env:ADMIN_EMAIL -or "bubblebuddysmile.developer@gmail.com"

Write-Host "Configuration:" -ForegroundColor Yellow
Write-Host "- API Base URL: $ApiBaseUrl"
Write-Host "- Admin Email: $AdminEmail"
Write-Host ""

# Test 1: Check if server is running
Write-Host "📡 Test 1: Checking if server is running..." -ForegroundColor Blue
try {
    $response = Invoke-WebRequest -Uri "$ApiBaseUrl/api/test-email" -Method GET -ErrorAction Stop
    Write-Host "✅ Server is running" -ForegroundColor Green
}
catch {
    Write-Host "❌ Server is not running at $ApiBaseUrl" -ForegroundColor Red
    Write-Host "   Start the dev server with: npm run dev"
    exit 1
}
Write-Host ""

# Test 2: Send test email
Write-Host "📧 Test 2: Sending test email..." -ForegroundColor Blue
try {
    $testResponse = Invoke-WebRequest -Uri "$ApiBaseUrl/api/test-email" -Method GET -ContentType "application/json" -ErrorAction Stop
    $testData = $testResponse.Content | ConvertFrom-Json
    Write-Host "Response:" -ForegroundColor Green
    Write-Host ($testData | ConvertTo-Json -Depth 3)
}
catch {
    Write-Host "❌ Error sending test email:" -ForegroundColor Red
    Write-Host $_.Exception.Message
}
Write-Host ""

# Test 3: Run diagnostics
Write-Host "🔍 Test 3: Running email diagnostics..." -ForegroundColor Blue
try {
    $diagResponse = Invoke-WebRequest -Uri "$ApiBaseUrl/api/diagnostics/email" -Method GET -ContentType "application/json" -ErrorAction Stop
    $diagData = $diagResponse.Content | ConvertFrom-Json
    Write-Host "Diagnostics:" -ForegroundColor Green
    Write-Host ($diagData | ConvertTo-Json -Depth 3)
}
catch {
    Write-Host "❌ Error running diagnostics:" -ForegroundColor Red
    Write-Host $_.Exception.Message
}
Write-Host ""

Write-Host "✨ Email testing complete!" -ForegroundColor Cyan
Write-Host ""
Write-Host "📝 Next steps:" -ForegroundColor Yellow
Write-Host "1. Check Resend dashboard (https://dashboard.resend.com/) for email logs"
Write-Host "2. If emails aren't arriving, verify recipients in Resend dashboard"
Write-Host "3. See EMAIL_SETUP_GUIDE.md for detailed setup instructions"
