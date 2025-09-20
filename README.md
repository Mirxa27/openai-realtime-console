# Newomen - AI Conversational Platform for Women's Personal Growth

## Overview

Newomen is an emotionally intelligent AI companion designed to support women's personal growth journeys through culturally-sensitive conversations, Narrative Identity Exploration, and transformative guidance.

## Features

### 🎯 Core Features
- **Speech-to-Speech AI Conversations**: Real-time voice chat using OpenAI Realtime API
- **Narrative Identity Exploration**: Guided self-discovery and story transformation
- **Gamified Growth System**: Crystal rewards, levels, achievements, and progress tracking
- **Cultural Sensitivity**: Support for Arabic and multiple cultural backgrounds
- **Community Features**: Compatibility AI, connections, and group challenges
- **Mobile-First Design**: Responsive glassmorphic UI with floating navigation

### 🏆 Subscription Tiers
- **Discovery**: 10 free minutes for new users
- **Growth**: $22 for 100 minutes
- **Transformation**: $222 for 1000 minutes

### 🛠 Tech Stack
- **Frontend**: React, Vite, Tailwind CSS, Framer Motion
- **Backend**: Node.js, Express, Supabase
- **AI**: OpenAI GPT-4 & Realtime API, ElevenLabs, Deepgram, Hume AI
- **Mobile**: Capacitor for iOS/Android
- **Payments**: PayPal integration
- **Database**: PostgreSQL (Supabase)

## Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account
- OpenAI API key

### Installation

1. **Clone and install dependencies**:
```bash
git clone <repository-url>
cd newomen
npm install
```

2. **Environment Setup**:
```bash
cp .env.example .env
# Edit .env with your API keys and configuration
```

3. **Database Setup**:
```bash
node scripts/setup-database.js
```

4. **Start Development Server**:
```bash
npm run dev
```

5. **Build for Production**:
```bash
npm run build
```

### Mobile App Development

1. **Initialize Capacitor**:
```bash
npx cap add ios
npx cap add android
```

2. **Build and Sync**:
```bash
npm run mobile:build
```

3. **Run on iOS**:
```bash
npm run mobile:run:ios
```

## Environment Variables

### Database Configuration
```env
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
SUPABASE_DB_URL=your_postgres_connection_string
```

### AI Providers
```env
OPENAI_API_KEY=your_openai_key
GEMINI_API_KEY=your_gemini_key
ELEVENLABS_API_KEY=your_elevenlabs_key
DEEPGRAM_API_KEY=your_deepgram_key
HUME_API_KEY=your_hume_key
```

### Payment Configuration
```env
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_secret
PAYPAL_ENVIRONMENT=sandbox
```

## Admin Panel

Access the admin panel at `/admin` with admin credentials:
- **Email**: admin@newomen.com
- **Password**: NewomenAdmin123!

### Admin Features
- **Environment Variables Management**: Secure .env editor with Vercel integration
- **AI Provider Configuration**: Setup and test AI providers, auto-fetch models
- **Content Management**: Manage affirmations, assessments, challenges
- **User Analytics**: Track engagement, usage metrics, and growth
- **Payment Management**: Monitor subscriptions and transactions

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration
- `POST /api/auth/logout` - User logout

### Chat & Voice
- `GET /api/voice-token` - Generate ephemeral token for voice chat
- `POST /api/chat` - Send text message to AI

### User Management
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile
- `PUT /api/user/settings` - Update user settings

### Admin
- `GET /api/admin/env-vars` - Get environment variables
- `POST /api/admin/test-provider` - Test AI provider connection
- `POST /api/admin/fetch-models` - Fetch available models
- `POST /api/admin/deploy` - Trigger Vercel deployment

### Community
- `POST /api/compatibility/:linkId` - Compatibility challenge endpoint

## Database Schema

The platform uses PostgreSQL with the following main tables:
- `profiles` - User profiles and preferences
- `user_progress` - Growth tracking by focus area
- `achievements` - Achievement system
- `assessments` - Tests and questionnaires
- `assessment_results` - User assessment results
- `conversations` - Chat history
- `user_connections` - Community connections
- `group_challenges` - Community challenges
- `compatibility_sessions` - Compatibility AI sessions

## Development Guidelines

### Strict Development Principles
1. **No Mocks or Assumptions** - Build against real services
2. **Full, Complete Development** - Production-ready features only
3. **Zero Bullshitting** - Accurate, verifiable code and documentation
4. **Single-Source Files** - Never create duplicate files
5. **Latest Libraries** - Use latest stable versions
6. **Real-Time Speech** - Leverage WebRTC for low-latency audio
7. **Code Over Comments** - Self-documenting code
8. **Fail Fast, Recover Gracefully** - Proper error handling

### UI/UX Guidelines
- **Glassmorphic Design**: Consistent liquid glass aesthetic
- **Mobile-First**: Responsive design with floating navigation
- **Smooth Animations**: Framer Motion for fluid interactions
- **Cultural Sensitivity**: RTL support and cultural adaptations

## Deployment

### Vercel Deployment
1. Connect your repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy with automatic builds on push

### Environment Variables in Production
Use the admin panel to manage environment variables securely:
1. Navigate to `/admin/environment`
2. Configure all required variables
3. Test connections
4. Deploy to Vercel directly from admin panel

## Security

- JWT-based authentication
- Row Level Security (RLS) on all tables
- Rate limiting on API endpoints
- Encrypted storage of sensitive configurations
- CORS and helmet security headers

## Contributing

1. Fork the repository
2. Create a feature branch
3. Follow the development principles
4. Submit a pull request

## License

Proprietary - Newomen Platform by Katrina Zhuk

## Support

For technical support or questions:
- Email: support@newomen.com
- Documentation: [docs.newomen.com]
- Community: Join our Discord server

---

**Built with ❤️ for women's empowerment and growth**