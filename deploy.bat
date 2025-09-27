@echo off
REM AI Home Organizer - Vercel Deployment Script for Windows
REM This script automates the deployment process to Vercel

echo 🚀 Starting AI Home Organizer Deployment to Vercel...

REM Check if Vercel CLI is installed
vercel --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Vercel CLI is not installed. Installing now...
    npm install -g vercel
    if %errorlevel% neq 0 (
        echo [ERROR] Failed to install Vercel CLI. Please install manually: npm install -g vercel
        pause
        exit /b 1
    )
)

echo [SUCCESS] Vercel CLI is available

REM Check if user is logged in to Vercel
vercel whoami >nul 2>&1
if %errorlevel% neq 0 (
    echo [WARNING] Not logged in to Vercel. Please log in:
    vercel login
    if %errorlevel% neq 0 (
        echo [ERROR] Failed to login to Vercel. Please try again.
        pause
        exit /b 1
    )
)

echo [SUCCESS] Logged in to Vercel

REM Deploy Backend
echo [INFO] Deploying Backend to Vercel...
cd backend

REM Check if backend has vercel.json
if not exist "vercel.json" (
    echo [ERROR] vercel.json not found in backend directory
    pause
    exit /b 1
)

REM Deploy backend
vercel --prod --yes
if %errorlevel% neq 0 (
    echo [ERROR] Backend deployment failed
    pause
    exit /b 1
)

echo [SUCCESS] Backend deployed successfully

REM Go back to root
cd ..

REM Deploy Frontend
echo [INFO] Deploying Frontend to Vercel...
cd frontend

REM Check if frontend has vercel.json
if not exist "vercel.json" (
    echo [ERROR] vercel.json not found in frontend directory
    pause
    exit /b 1
)

REM Deploy frontend
vercel --prod --yes
if %errorlevel% neq 0 (
    echo [ERROR] Frontend deployment failed
    pause
    exit /b 1
)

echo [SUCCESS] Frontend deployed successfully

REM Go back to root
cd ..

REM Final status
echo [SUCCESS] 🎉 Deployment completed successfully!
echo.
echo 📋 Deployment Summary:
echo   Check your Vercel dashboard for the deployed URLs
echo.
echo 🔧 Next Steps:
echo   1. Update CORS configuration in backend with frontend URL
echo   2. Test the deployed application
echo   3. Set up custom domain (optional)
echo   4. Configure monitoring and analytics
echo.
echo 📚 For more information, see DEPLOYMENT.md

pause
