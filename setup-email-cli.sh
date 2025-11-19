#!/bin/bash

# Supabase Email Configuration Setup Script
# This script configures email confirmation using Supabase CLI

set -e

echo "🚀 Supabase Email Configuration Setup"
echo "======================================"
echo ""

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI not found. Installing..."
    npm install -g supabase
fi

echo "✅ Supabase CLI found"
echo ""

# Get project reference
echo "📝 Enter your Supabase project reference ID:"
echo "   (Find it at: https://supabase.com/dashboard > Settings > General)"
read -p "Project Reference ID: " PROJECT_REF

if [ -z "$PROJECT_REF" ]; then
    echo "❌ Project reference ID is required"
    exit 1
fi

echo ""
echo "🔗 Linking to Supabase project: $PROJECT_REF"
supabase link --project-ref "$PROJECT_REF"

echo ""
echo "⚙️  Configuring email settings..."

# Configure email confirmation expiry (24 hours)
echo "Setting email confirmation expiry to 24 hours..."
supabase auth config set email_confirmation_expiry 86400

# Configure password reset expiry (1 hour)
echo "Setting password reset expiry to 1 hour..."
supabase auth config set password_reset_token_expiry 3600

# Configure email change expiry (1 hour)
echo "Setting email change expiry to 1 hour..."
supabase auth config set email_change_token_expiry 3600

# Enable email confirmations
echo "Enabling email confirmations..."
supabase auth config set enable_email_confirmations true

echo ""
echo "📍 Configuring redirect URLs..."
echo ""
echo "Enter your redirect URLs (one per line, empty line to finish):"
echo "Examples:"
echo "  http://localhost:3000"
echo "  http://localhost:3000/auth/reset-password"
echo "  https://yourdomain.com"
echo "  https://yourdomain.com/auth/reset-password"
echo ""

URLS=()
while true; do
    read -p "Redirect URL (or press Enter to finish): " URL
    if [ -z "$URL" ]; then
        break
    fi
    URLS+=("$URL")
done

if [ ${#URLS[@]} -gt 0 ]; then
    echo ""
    echo "Setting redirect URLs..."
    supabase auth config set redirect_urls "${URLS[@]}"
fi

echo ""
echo "📤 Pushing configuration to Supabase..."
supabase push

echo ""
echo "✅ Configuration complete!"
echo ""
echo "📋 Next steps:"
echo "1. Configure SMTP in Supabase Dashboard:"
echo "   - Go to Authentication > Providers > Email"
echo "   - Fill in SMTP details (Brevo, Mailgun, SendGrid, etc.)"
echo "2. Test email flows:"
echo "   - Sign up with test email"
echo "   - Check inbox for confirmation email"
echo "   - Click confirmation link"
echo "3. Verify in Supabase Dashboard:"
echo "   - Authentication > Users"
echo "   - Check if email is confirmed"
echo ""
echo "📚 For more details, see: SUPABASE_CLI_EMAIL_SETUP.md"
