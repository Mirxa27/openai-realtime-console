# Newomen - AI Companion for Personal Growth

Newomen is a production-ready AI conversational platform designed to support women's personal growth journeys through culturally-sensitive conversations, Narrative Identity Exploration, and transformative guidance.

## Features

### Core Functionality
- **Real-time Voice Conversations**: WebRTC-based speech-to-speech interactions using OpenAI's Realtime API
- **Narrative Identity Exploration**: Guided exploration to help users reshape their personal stories
- **Cultural Sensitivity**: Adapts to user's language and cultural background
- **Gamification System**: Crystals, levels, achievements, and progress tracking
- **Multi-tier Subscriptions**: Discovery (free), Growth ($22), and Transformation ($222) tiers

### Technical Features
- **Glassmorphic UI**: Beautiful, modern design with liquid animations
- **Mobile-First**: Responsive design with mobile app support via Capacitor
- **Admin Panel**: Comprehensive environment configuration and content management
- **AI Provider Management**: Support for multiple AI providers (OpenAI, Gemini, ElevenLabs, etc.)
- **Real-time Updates**: WebSocket-based real-time features
- **Secure Authentication**: Supabase Auth with JWT tokens

## Tech Stack

- **Frontend**: Next.js 14, React 19, TypeScript
- **Styling**: Tailwind CSS with custom glassmorphic design system
- **Database**: Supabase (PostgreSQL)
- **AI**: OpenAI Realtime API, OpenAI Agents SDK
- **Voice**: WebRTC, OpenAI Realtime API
- **Mobile**: Capacitor for iOS/Android
- **Payments**: PayPal SDK
- **Deployment**: Vercel

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account
- OpenAI API key
- PayPal developer account (for payments)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-org/newomen.git
cd newomen
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your credentials:
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# OpenAI
OPENAI_API_KEY=your_openai_api_key

# PayPal
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret

# Add other provider keys as needed
```

4. Run database migrations:
```bash
npx supabase db push
```

5. Start the development server:
```bash
npm run dev
```

Visit `http://localhost:3000` to see the application.

## Project Structure

```
newomen/
├── src/
│   ├── app/              # Next.js app directory
│   │   ├── admin/        # Admin panel pages
│   │   ├── api/          # API routes
│   │   ├── auth/         # Authentication pages
│   │   ├── chat/         # Chat interface
│   │   └── explore/      # Assessment explorer
│   ├── components/       # React components
│   │   ├── admin/        # Admin components
│   │   ├── chat/         # Chat components
│   │   ├── home/         # Homepage components
│   │   └── ui/           # Reusable UI components
│   ├── contexts/         # React contexts
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utility libraries
│   ├── services/         # External service integrations
│   └── types/            # TypeScript type definitions
├── supabase/             # Database schema and migrations
├── capacitor.config.json # Mobile app configuration
└── public/               # Static assets
```

## Mobile App Development

### iOS Setup
```bash
npm run capacitor:add ios
npm run capacitor:sync
npm run capacitor:run:ios
```

### Android Setup
```bash
npm run capacitor:add android
npm run capacitor:sync
npm run capacitor:run:android
```

## Admin Panel

The admin panel is available at `/admin` and requires admin role. Features include:

- **Environment Settings**: Manage environment variables with Vercel integration
- **AI Configuration**: Configure AI providers and dynamic prompts
- **Content Management**: Create assessments, challenges, and explorations
- **User Management**: View and manage users
- **Analytics**: Track usage, revenue, and engagement
- **Site Settings**: Customize branding and content

## Deployment

### Vercel Deployment

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

3. Set environment variables in Vercel dashboard

### Database Setup

Run the schema file in your Supabase project:
```bash
npx supabase db push --file supabase/schema.sql
```

## API Documentation

### Real-time Voice API
```typescript
// Generate ephemeral token
POST /api/realtime/token

// Returns
{
  clientSecret: string
}
```

### Chat API (Fallback)
```typescript
// Send message
POST /api/chat
{
  message: string
}

// Returns
{
  message: string,
  minutesRemaining: number
}
```

### Admin APIs
- `POST /api/admin/ai/fetch-models` - Fetch AI models from providers
- More APIs available for admin functions

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is proprietary software. All rights reserved.

## Support

For support, email support@newomen.com or join our community.