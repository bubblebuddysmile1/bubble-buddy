#!/bin/bash

# Email Testing Script for Bubble Buddy
# Use this to test email functionality without Resend

echo "🧪 Bubble Buddy Email Testing Script"
echo "======================================"
echo ""

# Check if running on Windows
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "cygwin" ]]; then
    echo "⚠️ This script is for Unix/Linux. On Windows, use the PowerShell version."
    exit 1
fi

API_BASE_URL="${API_BASE_URL:-http://localhost:3000}"
ADMIN_EMAIL="${ADMIN_EMAIL:-bubblebuddysmile.developer@gmail.com}"

echo "Configuration:"
echo "- API Base URL: $API_BASE_URL"
echo "- Admin Email: $ADMIN_EMAIL"
echo ""

# Test 1: Check if server is running
echo "📡 Test 1: Checking if server is running..."
if ! curl -s -f "$API_BASE_URL/api/test-email" > /dev/null 2>&1; then
    echo "❌ Server is not running at $API_BASE_URL"
    echo "   Start the dev server with: npm run dev"
    exit 1
fi
echo "✅ Server is running"
echo ""

# Test 2: Send test email
echo "📧 Test 2: Sending test email..."
response=$(curl -s "$API_BASE_URL/api/test-email")
echo "Response: $response"
echo ""

# Test 3: Run diagnostics
echo "🔍 Test 3: Running email diagnostics..."
diag_response=$(curl -s "$API_BASE_URL/api/diagnostics/email")
echo "Diagnostics:"
echo "$diag_response" | jq '.' 2>/dev/null || echo "$diag_response"
echo ""

echo "✨ Email testing complete!"
echo ""
echo "📝 Next steps:"
echo "1. Check Resend dashboard (https://dashboard.resend.com/) for email logs"
echo "2. If emails aren't arriving, verify recipients in Resend dashboard"
echo "3. See EMAIL_SETUP_GUIDE.md for detailed setup instructions"
