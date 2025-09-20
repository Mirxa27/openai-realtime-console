# 🚀 Quick Deployment Guide

This guide will help you deploy the Newomen platform to Vercel with full admin CMS capabilities in under 10 minutes.

## 📋 Prerequisites

1. **GitHub account** with repository access
2. **Vercel account** (free tier works)
3. **Supabase account** (free tier works)
4. **OpenAI account** with API access

## ⚡ Quick Setup (5 steps)

### Step 1: Clone and Install
```bash
git clone https://github.com/Mirxa27/openai-realtime-console.git
cd openai-realtime-console
npm install
```

### Step 2: Configure Environment Variables
```bash
cp .env.example .env
# Edit .env with your actual values
```

**Required variables:**
- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` - From Supabase dashboard
- `OPENAI_API_KEY` - Your OpenAI API key
- `JWT_SECRET` - Any random 32+ character string

### Step 3: Setup Database
```bash
npm run setup:db
```

### Step 4: Deploy to Vercel

**Option A: Vercel CLI (Recommended)**
```bash
npm install -g vercel
vercel
# Follow the prompts, select your team/account
# Choose "Next.js" as framework when asked
```

**Option B: GitHub Integration**
1. Connect your GitHub repo to Vercel
2. Auto-deploy will trigger on push to main

### Step 5: Configure Vercel Environment Variables

In your Vercel dashboard, add these environment variables:

```env
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
JWT_SECRET=your_jwt_secret
OPENAI_API_KEY=your_openai_key
```

## 🎨 Admin Panel Setup

1. **Access Admin Panel:**
   - Local: `http://localhost:3000/admin`
   - Production: `https://your-vercel-url.com/admin`

2. **Default Admin Login:**
   - Email: `admin@newomen.com`
   - Password: `NewomenAdmin123!`

3. **Configure Design Settings:**
   - Go to Admin → Design
   - Customize colors, fonts, layout
   - Click "Apply Changes" to deploy

## 🔄 GitHub Actions (Auto-Setup)

Your repository now includes automated workflows:

- **✅ Continuous Integration** - Tests and builds on every push
- **🚀 Auto-Deployment** - Deploys to Vercel when you push to main
- **👀 Preview Deployments** - Creates preview URLs for pull requests

**Required GitHub Secrets:**
```
VERCEL_TOKEN=your_vercel_token
VERCEL_ORG_ID=your_vercel_org_id  
VERCEL_PROJECT_ID=your_vercel_project_id
```

## 🎯 Key Features

### ✨ What's Included

1. **Complete Admin CMS**
   - Environment variable management
   - Design/theme customization
   - AI provider configuration
   - Payment settings
   - User analytics

2. **Design Management System**
   - Live color scheme editor
   - Typography controls
   - Layout customization
   - Branding options
   - Export/import configurations

3. **Automated Deployments**
   - One-click Vercel deployment from admin
   - GitHub Actions CI/CD pipeline
   - Preview deployments for PRs
   - Build status monitoring

4. **Mobile-Ready**
   - Responsive design
   - Capacitor integration for native apps
   - Mobile build workflows

## 🔧 Advanced Configuration

### Custom Domain Setup
1. In Vercel dashboard → Domains
2. Add your custom domain
3. Update DNS records as instructed
4. SSL automatically configured

### Additional AI Providers
Add these optional environment variables:
```env
GEMINI_API_KEY=your_gemini_key
ELEVENLABS_API_KEY=your_elevenlabs_key
DEEPGRAM_API_KEY=your_deepgram_key
HUME_API_KEY=your_hume_key
```

### Payment Integration
```env
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret
PAYPAL_ENVIRONMENT=sandbox  # or "live"
```

## 🚨 Troubleshooting

### Build Fails
- Check all environment variables are set
- Verify Supabase credentials
- Review build logs in Vercel dashboard

### Admin Panel Not Loading
- Ensure JWT_SECRET is set
- Check Supabase connection
- Verify admin user exists (run `npm run setup:db`)

### Design Changes Not Applying
- Check deployment completed successfully
- Clear browser cache
- Verify admin permissions

## 📞 Support

- **Platform Issues:** Check admin dashboard diagnostics
- **Deployment Help:** Review GitHub Actions logs
- **Database Problems:** Check Supabase dashboard logs

## 🎉 Success Checklist

- [ ] Repository cloned and dependencies installed
- [ ] Environment variables configured
- [ ] Database setup completed
- [ ] Deployed to Vercel successfully
- [ ] Admin panel accessible
- [ ] Design settings working
- [ ] GitHub Actions configured
- [ ] SSL certificate active (if using custom domain)

**🚀 You're now ready to customize and manage your AI platform!**

Visit your admin panel and start customizing:
- Update colors and branding
- Configure AI providers
- Set up payment processing
- Monitor user analytics

The platform will automatically deploy your changes when you click "Apply Changes" in the design settings.