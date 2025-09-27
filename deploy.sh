#!/bin/bash

# AI Home Organizer - Vercel Deployment Script
# This script automates the deployment process to Vercel

echo "🚀 Starting AI Home Organizer Deployment to Vercel..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    print_error "Vercel CLI is not installed. Installing now..."
    npm install -g vercel
    if [ $? -ne 0 ]; then
        print_error "Failed to install Vercel CLI. Please install manually: npm install -g vercel"
        exit 1
    fi
fi

print_success "Vercel CLI is available"

# Check if user is logged in to Vercel
if ! vercel whoami &> /dev/null; then
    print_warning "Not logged in to Vercel. Please log in:"
    vercel login
    if [ $? -ne 0 ]; then
        print_error "Failed to login to Vercel. Please try again."
        exit 1
    fi
fi

print_success "Logged in to Vercel"

# Deploy Backend
print_status "Deploying Backend to Vercel..."
cd backend

# Check if backend has vercel.json
if [ ! -f "vercel.json" ]; then
    print_error "vercel.json not found in backend directory"
    exit 1
fi

# Deploy backend
vercel --prod --yes
if [ $? -ne 0 ]; then
    print_error "Backend deployment failed"
    exit 1
fi

print_success "Backend deployed successfully"
BACKEND_URL=$(vercel ls | grep ai-human-organizer-backend | awk '{print $2}' | head -1)
print_status "Backend URL: $BACKEND_URL"

# Go back to root
cd ..

# Deploy Frontend
print_status "Deploying Frontend to Vercel..."
cd frontend

# Check if frontend has vercel.json
if [ ! -f "vercel.json" ]; then
    print_error "vercel.json not found in frontend directory"
    exit 1
fi

# Update environment variables for production
if [ ! -z "$BACKEND_URL" ]; then
    print_status "Setting environment variables..."
    vercel env add VITE_API_URL production <<< "$BACKEND_URL"
    vercel env add VITE_NODE_ENV production <<< "production"
fi

# Deploy frontend
vercel --prod --yes
if [ $? -ne 0 ]; then
    print_error "Frontend deployment failed"
    exit 1
fi

print_success "Frontend deployed successfully"
FRONTEND_URL=$(vercel ls | grep ai-human-organizer-frontend | awk '{print $2}' | head -1)
print_status "Frontend URL: $FRONTEND_URL"

# Go back to root
cd ..

# Update CORS configuration
print_status "Updating CORS configuration..."
if [ ! -z "$FRONTEND_URL" ]; then
    # Update backend CORS with new frontend URL
    print_status "Please update your backend CORS configuration with the new frontend URL: $FRONTEND_URL"
    print_status "You can do this by updating the allowedOrigins array in backend/src/app.js"
fi

# Final status
print_success "🎉 Deployment completed successfully!"
echo ""
echo "📋 Deployment Summary:"
echo "  Backend URL: $BACKEND_URL"
echo "  Frontend URL: $FRONTEND_URL"
echo ""
echo "🔧 Next Steps:"
echo "  1. Update CORS configuration in backend with frontend URL"
echo "  2. Test the deployed application"
echo "  3. Set up custom domain (optional)"
echo "  4. Configure monitoring and analytics"
echo ""
echo "📚 For more information, see DEPLOYMENT.md"

# Open deployed applications
if command -v open &> /dev/null; then
    print_status "Opening deployed applications..."
    if [ ! -z "$FRONTEND_URL" ]; then
        open "https://$FRONTEND_URL"
    fi
elif command -v xdg-open &> /dev/null; then
    print_status "Opening deployed applications..."
    if [ ! -z "$FRONTEND_URL" ]; then
        xdg-open "https://$FRONTEND_URL"
    fi
fi

print_success "Deployment script completed!"
