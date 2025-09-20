# Deployment Guide for Newomen

This guide will walk you through deploying the Newomen platform to production.

## Prerequisites

1. **Accounts Required:**
   - Vercel account
   - Supabase account
   - OpenAI account with API access
   - PayPal developer account
   - Domain name (optional, but recommended)

2. **API Keys Needed:**
   - OpenAI API key
   - Supabase project URL and keys
   - PayPal client ID and secret
   - Additional AI provider keys (optional)

## Step 1: Supabase Setup

1. **Create a new Supabase project:**
   - Go to https://supabase.com
   - Create a new project
   - Save your project URL and API keys

2. **Run database migrations:**
   ```bash
   # Install Supabase CLI
   npm install -g supabase

   # Login to Supabase
   supabase login

   # Link your project
   supabase link --project-ref your-project-ref

   # Push the schema
   supabase db push --file supabase/schema.sql
   ```

3. **Enable Authentication:**
   - Go to Authentication settings in Supabase
   - Enable email authentication
   - Configure email templates (optional)

4. **Set up Row Level Security:**
   - The schema already includes RLS policies
   - Verify they're enabled in the Supabase dashboard

## Step 2: PayPal Setup

1. **Create PayPal App:**
   - Go to https://developer.paypal.com
   - Create a new app for your project
   - Get your Client ID and Secret

2. **Create Subscription Plans:**
   - In PayPal dashboard, create two subscription plans:
     - Growth Plan: $22/month
     - Transformation Plan: $222/month
   - Note the Plan IDs for environment variables

## Step 3: Vercel Deployment

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Deploy to Vercel:**
   ```bash
   # From project root
   vercel

   # Follow the prompts
   # Choose "Next.js" as framework
   # Use default settings
   ```

3. **Configure Environment Variables:**
   
   Go to your Vercel project settings and add these environment variables:

   ```env
   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   SUPABASE_DB_URL=your_database_url
   JWT_SECRET=your_jwt_secret

   # OpenAI
   OPENAI_API_KEY=your_openai_api_key

   # PayPal
   PAYPAL_CLIENT_ID=your_paypal_client_id
   PAYPAL_CLIENT_SECRET=your_paypal_client_secret
   PAYPAL_MODE=sandbox # or "live" for production
   PAYPAL_GROWTH_PLAN_ID=your_growth_plan_id
   PAYPAL_TRANSFORMATION_PLAN_ID=your_transformation_plan_id

   # Site
   NEXT_PUBLIC_SITE_URL=https://your-domain.com
   NEXT_PUBLIC_SITE_NAME=Newomen

   # Optional AI Providers
   ELEVENLABS_API_KEY=your_key
   LIVEKIT_API_KEY=your_key
   LIVEKIT_API_SECRET=your_secret
   LIVEKIT_URL=your_url
   DEEPGRAM_API_KEY=your_key
   HUME_API_KEY=your_key
   GEMINI_API_KEY=your_key

   # Email (if using)
   SMTP_HOST=your_smtp_host
   SMTP_PORT=587
   SMTP_USER=your_email
   SMTP_PASS=your_password
   SMTP_FROM=noreply@your-domain.com
   ```

4. **Configure Domain (optional):**
   - In Vercel project settings, go to Domains
   - Add your custom domain
   - Follow DNS configuration instructions

## Step 4: Post-Deployment Setup

1. **Create Admin User:**
   ```sql
   -- Run this in Supabase SQL editor
   UPDATE public.users 
   SET role = 'admin' 
   WHERE email = 'your-admin@email.com';
   ```

2. **Configure AI Providers:**
   - Log in as admin
   - Go to /admin/ai-config
   - Add your AI providers
   - Configure prompts for each tier

3. **Create Initial Assessments:**
   - Go to /admin/assessments
   - Create at least 5-6 free assessments
   - Create premium assessments for registered users

4. **Test Payment Flow:**
   - Create a test user account
   - Try subscribing to a plan
   - Verify PayPal webhook integration

## Step 5: Mobile App Deployment

### iOS Deployment

1. **Prepare for iOS:**
   ```bash
   npm run build
   npx cap add ios
   npx cap sync ios
   ```

2. **Open in Xcode:**
   ```bash
   npx cap open ios
   ```

3. **Configure in Xcode:**
   - Set bundle identifier
   - Configure signing certificates
   - Add required capabilities
   - Test on device/simulator

4. **Submit to App Store:**
   - Archive the app
   - Upload to App Store Connect
   - Submit for review

### Android Deployment

1. **Prepare for Android:**
   ```bash
   npm run build
   npx cap add android
   npx cap sync android
   ```

2. **Open in Android Studio:**
   ```bash
   npx cap open android
   ```

3. **Configure in Android Studio:**
   - Update package name
   - Configure signing
   - Test on device/emulator

4. **Submit to Play Store:**
   - Generate signed APK/AAB
   - Upload to Play Console
   - Submit for review

## Monitoring & Maintenance

1. **Set up monitoring:**
   - Enable Vercel Analytics
   - Set up error tracking (e.g., Sentry)
   - Monitor Supabase usage

2. **Regular maintenance:**
   - Check PayPal webhooks
   - Monitor AI API usage and costs
   - Review user feedback and analytics
   - Update dependencies regularly

3. **Backup strategy:**
   - Enable Supabase automatic backups
   - Export user data regularly
   - Keep environment variable backups

## Security Checklist

- [ ] All API keys are in environment variables
- [ ] Row Level Security is enabled
- [ ] HTTPS is enforced
- [ ] Rate limiting is configured
- [ ] Input validation is implemented
- [ ] Error messages don't leak sensitive info
- [ ] Admin panel is properly secured
- [ ] Payment webhooks are verified

## Troubleshooting

### Common Issues:

1. **"Module not found" errors:**
   - Clear .next folder and rebuild
   - Verify all dependencies are installed

2. **Supabase connection issues:**
   - Check environment variables
   - Verify RLS policies

3. **Payment failures:**
   - Check PayPal webhook configuration
   - Verify plan IDs are correct

4. **Voice chat not working:**
   - Ensure OpenAI API key has Realtime access
   - Check browser permissions for microphone

For additional support, check the logs in Vercel dashboard or contact support.