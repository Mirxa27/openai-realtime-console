# Workflows and Deployment Configuration

This document outlines the automated workflows and deployment configuration for the Newomen platform.

## 🚀 GitHub Actions Workflows

### CI/CD Pipeline (`ci.yml`)

**Triggers:**
- Push to `main` or `develop` branches
- Pull requests to `main` branch

**Jobs:**
1. **Test and Lint**
   - Runs platform tests
   - Executes ESLint for code quality
   - Continues on error (non-blocking)

2. **Build Application**
   - Builds production-ready application
   - Uploads build artifacts
   - Only runs after tests complete

3. **Deploy to Vercel**
   - Automatically deploys to production on `main` branch
   - Uses Vercel deployment action
   - Requires Vercel secrets configuration

4. **Mobile App Build**
   - Builds mobile app using Capacitor
   - Uploads mobile build artifacts
   - Only runs on `main` branch

### Preview Deployment (`preview.yml`)

**Triggers:**
- Pull request opened, synchronized, or reopened

**Features:**
- Creates preview deployment on Vercel
- Comments on PR with preview URL
- Updates comment on subsequent commits
- Includes admin panel access link

## 🔧 Required GitHub Secrets

Configure these secrets in your GitHub repository settings:

```
VERCEL_TOKEN=your-vercel-token
VERCEL_ORG_ID=your-vercel-org-id
VERCEL_PROJECT_ID=your-vercel-project-id
```

## 📦 Vercel Configuration

The `vercel.json` file includes:

- **Node.js build configuration**
- **Environment variable mappings**
- **API routing setup**
- **Security headers**
- **CORS configuration**

### Environment Variables in Vercel

Set these in your Vercel project dashboard:

#### Required
- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_ANON_KEY` - Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key
- `JWT_SECRET` - JWT signing secret
- `OPENAI_API_KEY` - OpenAI API key

#### Optional
- `GEMINI_API_KEY` - Google Gemini API key
- `ELEVENLABS_API_KEY` - ElevenLabs API key
- `PAYPAL_CLIENT_ID` - PayPal client ID
- `PAYPAL_CLIENT_SECRET` - PayPal client secret

## 🎨 Admin CMS Design Management

### Design Settings Panel

The admin panel includes a comprehensive design management system:

**Features:**
- **Color Scheme Editor** - Customize primary, secondary, accent colors
- **Typography Settings** - Configure fonts and font sizes
- **Layout Options** - Adjust spacing, borders, glass effects
- **Branding Management** - Update logos, site name, favicon
- **Live Preview** - See changes in real-time
- **Export/Import** - Save and share design configurations

### Design Configuration API

**Endpoints:**
- `GET /api/admin/design-config` - Retrieve current design
- `POST /api/admin/design-config` - Save new design configuration

**Features:**
- Automatic CSS generation from design settings
- Database storage of design configurations
- Version history and rollback capabilities

### CSS Custom Properties

The system uses CSS custom properties for dynamic theming:

```css
:root {
  --color-primary: #8B5CF6;
  --color-secondary: #A855F7;
  --font-heading: 'Inter', sans-serif;
  --borderRadius: 16px;
  /* ... and more */
}
```

## 🚀 Deployment from Admin Panel

### Vercel Integration

The admin panel includes a "Deploy to Vercel" feature:

**Requirements:**
- `VERCEL_TOKEN` environment variable
- `VERCEL_PROJECT_ID` environment variable
- Admin role permissions

**Features:**
- One-click deployment trigger
- Deployment status tracking
- Build logs and error reporting
- Deployment history

### Deployment Process

1. Admin clicks "Deploy to Vercel" button
2. System validates Vercel credentials
3. API call to Vercel deployment endpoint
4. Deployment record stored in database
5. Real-time status updates
6. Success/error notifications

## 📊 Testing and Quality Assurance

### Automated Testing

**Platform Tests (`npm test`):**
- Database connectivity validation
- API endpoint verification
- Component structure checks
- Configuration validation

**Build Process:**
- Client-side bundle creation
- Server-side rendering setup
- Asset optimization
- Bundle size analysis

### Code Quality

**ESLint Configuration:**
- React and JSX support
- Modern JavaScript standards
- Code style enforcement
- Accessibility guidelines

## 🔄 Continuous Integration Flow

```
1. Developer pushes code
   ↓
2. GitHub Actions trigger
   ↓
3. Tests and linting run
   ↓
4. Build process executes
   ↓
5. Deployment to Vercel (if main branch)
   ↓
6. Mobile build preparation
   ↓
7. Notifications and status updates
```

## 🛠 Development Workflow

### Local Development

```bash
npm install          # Install dependencies
npm run dev         # Start development server
npm test            # Run platform tests
npm run lint        # Check code quality
npm run build       # Build for production
```

### Environment Setup

1. Copy `.env.example` to `.env`
2. Fill in required environment variables
3. Run database setup: `npm run setup:db`
4. Start development server: `npm run dev`

### Admin Panel Access

- **Local:** `http://localhost:3000/admin`
- **Production:** `https://your-domain.com/admin`
- **Default Credentials:** admin@newomen.com / NewomenAdmin123!

## 🔐 Security Considerations

### Environment Variables
- All sensitive data stored as Vercel environment variables
- JWT tokens for API authentication
- Role-based access control for admin features

### Deployment Security
- HTTPS enforcement
- CORS configuration
- Security headers implementation
- Rate limiting on API endpoints

## 📈 Monitoring and Analytics

### Deployment Tracking
- Database logging of all deployments
- User attribution for manual deployments
- Build status and error tracking
- Performance metrics collection

### Admin Activity
- Design change history
- Deployment audit trail
- User access logging
- System health monitoring

## 🚨 Troubleshooting

### Common Issues

**Deployment Failures:**
- Check Vercel token validity
- Verify environment variables
- Review build logs in GitHub Actions

**Design Changes Not Applying:**
- Ensure deployment completed successfully
- Check browser cache
- Verify CSS custom properties

**Admin Panel Access:**
- Confirm user has admin role
- Check JWT token validity
- Verify Supabase connection

### Support Resources

- **GitHub Issues:** For bug reports and feature requests
- **Admin Dashboard:** Built-in diagnostics and system status
- **Deployment Logs:** Available in Vercel dashboard
- **Database Logs:** Accessible through Supabase dashboard