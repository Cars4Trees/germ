#!/bin/bash

# Cars for Trees PWA - Quick Setup Script
# This script helps you get started with the project quickly

set -e

echo "🌱 Cars for Trees PWA - Quick Setup"
echo "=================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ and try again."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node --version | sed 's/v//')
REQUIRED_VERSION="18.0.0"

if ! node -p "require('semver').gte('$NODE_VERSION', '$REQUIRED_VERSION')" 2>/dev/null; then
    echo "❌ Node.js version $NODE_VERSION detected. Please upgrade to version 18+ and try again."
    exit 1
fi

echo "✅ Node.js version $NODE_VERSION detected"

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies. Please check your internet connection and try again."
    exit 1
fi

echo "✅ Dependencies installed successfully"

# Setup environment file
echo ""
echo "🔧 Setting up environment configuration..."

if [ ! -f .env ]; then
    cp .env.example .env
    echo "✅ Created .env file from template"
    echo ""
    echo "⚠️  IMPORTANT: You need to configure your Firebase credentials in the .env file"
    echo "   1. Go to https://console.firebase.google.com/"
    echo "   2. Create a new project or select existing one"
    echo "   3. Enable Firestore Database and Storage"
    echo "   4. Go to Project Settings → General → Your apps"
    echo "   5. Add a web app and copy the configuration"
    echo "   6. Update the .env file with your Firebase config"
    echo ""
else
    echo "✅ .env file already exists"
fi

# Check if Firebase CLI is installed
echo ""
echo "🔥 Checking Firebase CLI..."

if ! command -v firebase &> /dev/null; then
    echo "⚠️  Firebase CLI not found. Installing globally..."
    npm install -g firebase-tools
    echo "✅ Firebase CLI installed"
else
    echo "✅ Firebase CLI is already installed"
fi

# Try to build the project
echo ""
echo "🏗️  Testing build..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful"
else
    echo "❌ Build failed. Please check your configuration and try again."
    exit 1
fi

# Create necessary directories
echo ""
echo "📁 Creating project structure..."
mkdir -p public/icons
mkdir -p src/components
mkdir -p src/services
mkdir -p src/firebase

echo "✅ Project structure created"

echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "Next steps:"
echo "1. Configure your .env file with Firebase credentials"
echo "2. Run 'npm run dev' to start the development server"
echo "3. Open http://localhost:5173 in your browser"
echo "4. Test the app and submit your first car!"
echo ""
echo "For deployment instructions, see DEPLOYMENT.md"
echo "For detailed setup, see README.md"
echo ""
echo "Happy coding! 🚗🌳"