#!/bin/bash

# Newomen Platform Deployment Script
echo "🚀 Starting Newomen Platform Deployment..."

# Check if required environment variables are set
required_vars=("SUPABASE_URL" "SUPABASE_SERVICE_ROLE_KEY" "OPENAI_API_KEY" "JWT_SECRET")

for var in "${required_vars[@]}"; do
  if [ -z "${!var}" ]; then
    echo "❌ Error: $var is not set"
    exit 1
  fi
done

echo "✅ Environment variables validated"

# Install dependencies
echo "📦 Installing dependencies..."
npm ci

# Build the application
echo "🏗️  Building application..."
npm run build

# Run database migrations if needed
echo "🗄️  Setting up database..."
node scripts/setup-database.js

# Initialize Capacitor for mobile
echo "📱 Setting up mobile app..."
if [ ! -d "ios" ]; then
  npx cap add ios
fi

if [ ! -d "android" ]; then
  npx cap add android
fi

# Sync mobile app
npm run mobile:build

echo "✅ Deployment preparation complete!"
echo ""
echo "🌟 Newomen Platform is ready!"
echo ""
echo "📋 Next Steps:"
echo "1. Configure your environment variables in the admin panel"
echo "2. Set up your AI provider API keys"
echo "3. Configure PayPal payment settings"
echo "4. Test the voice chat functionality"
echo "5. Deploy to Vercel or your preferred platform"
echo ""
echo "🔗 Access Points:"
echo "- Web App: http://localhost:3000"
echo "- Admin Panel: http://localhost:3000/admin"
echo "- Admin Login: admin@newomen.com / NewomenAdmin123!"
echo ""
echo "📱 Mobile Development:"
echo "- iOS: npm run mobile:run:ios"
echo "- Android: npm run mobile:run:android"