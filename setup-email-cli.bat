@echo off
REM Supabase Email Configuration Setup Script (Windows)
REM This script configures email confirmation using Supabase CLI

setlocal enabledelayedexpansion

echo.
echo 🚀 Supabase Email Configuration Setup
echo ======================================
echo.

REM Check if Supabase CLI is installed
where supabase >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Supabase CLI not found. Installing...
    call npm install -g supabase
    if %ERRORLEVEL% NEQ 0 (
        echo ❌ Failed to install Supabase CLI
        exit /b 1
    )
)

echo ✅ Supabase CLI found
echo.

REM Get project reference
echo 📝 Enter your Supabase project reference ID:
echo    (Find it at: https://supabase.com/dashboard ^> Settings ^> General)
set /p PROJECT_REF="Project Reference ID: "

if "!PROJECT_REF!"=="" (
    echo ❌ Project reference ID is required
    exit /b 1
)

echo.
echo 🔗 Linking to Supabase project: !PROJECT_REF!
call supabase link --project-ref !PROJECT_REF!

if %ERRORLEVEL% NEQ 0 (
    echo ❌ Failed to link to project
    exit /b 1
)

echo.
echo ⚙️  Configuring email settings...

REM Configure email confirmation expiry (24 hours)
echo Setting email confirmation expiry to 24 hours...
call supabase auth config set email_confirmation_expiry 86400

REM Configure password reset expiry (1 hour)
echo Setting password reset expiry to 1 hour...
call supabase auth config set password_reset_token_expiry 3600

REM Configure email change expiry (1 hour)
echo Setting email change expiry to 1 hour...
call supabase auth config set email_change_token_expiry 3600

REM Enable email confirmations
echo Enabling email confirmations...
call supabase auth config set enable_email_confirmations true

echo.
echo 📍 Configuring redirect URLs...
echo.
echo Enter your redirect URLs (one per line, empty line to finish):
echo Examples:
echo   http://localhost:3000
echo   http://localhost:3000/auth/reset-password
echo   https://yourdomain.com
echo   https://yourdomain.com/auth/reset-password
echo.

setlocal enabledelayedexpansion
set "URLS="
set "URL_COUNT=0"

:url_loop
set /p URL="Redirect URL (or press Enter to finish): "
if "!URL!"=="" goto url_done

set /a URL_COUNT+=1
if !URL_COUNT! equ 1 (
    set "URLS=!URL!"
) else (
    set "URLS=!URLS! !URL!"
)
goto url_loop

:url_done
if !URL_COUNT! gtr 0 (
    echo.
    echo Setting redirect URLs...
    call supabase auth config set redirect_urls !URLS!
)

echo.
echo 📤 Pushing configuration to Supabase...
call supabase push

if %ERRORLEVEL% NEQ 0 (
    echo ❌ Failed to push configuration
    exit /b 1
)

echo.
echo ✅ Configuration complete!
echo.
echo 📋 Next steps:
echo 1. Configure SMTP in Supabase Dashboard:
echo    - Go to Authentication ^> Providers ^> Email
echo    - Fill in SMTP details (Brevo, Mailgun, SendGrid, etc.)
echo 2. Test email flows:
echo    - Sign up with test email
echo    - Check inbox for confirmation email
echo    - Click confirmation link
echo 3. Verify in Supabase Dashboard:
echo    - Authentication ^> Users
echo    - Check if email is confirmed
echo.
echo 📚 For more details, see: SUPABASE_CLI_EMAIL_SETUP.md
echo.

pause
