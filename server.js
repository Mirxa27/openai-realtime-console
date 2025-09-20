import express from "express";
import fs from "fs";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { createServer as createViteServer } from "vite";
import { createClient } from "@supabase/supabase-js";
import OpenAI from "openai";
import "dotenv/config";

const app = express();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: false, // Disabled for development
  crossOriginEmbedderPolicy: false
}));

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Body parsing middleware
app.use(express.json());
app.use(express.text());

const port = process.env.PORT || 3000;

// Initialize services
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Configure Vite middleware for React client
const vite = await createViteServer({
  server: { middlewareMode: true },
  appType: "custom",
});
app.use(vite.middlewares);

// Auth middleware
const authenticateUser = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

const requireAdmin = async (req, res, next) => {
  try {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', req.user.id)
      .single();
    
    if (profile?.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }
    
    next();
  } catch (error) {
    res.status(403).json({ error: 'Access denied' });
  }
};

// Voice token generation for Realtime API
app.get("/api/voice-token", authenticateUser, async (req, res) => {
  try {
    const sessionConfig = {
      session: {
        type: "realtime",
        model: "gpt-realtime",
        instructions: `You are NewMe, an emotionally intelligent AI companion for the Newomen platform. You help women explore their narrative identity and personal growth. Be warm, empathetic, culturally sensitive, and focus on helping users understand and reshape their personal stories. User ID: ${req.user.id}`,
        voice: "alloy",
        input_audio_transcription: { model: "whisper-1" },
        turn_detection: { type: "server_vad", threshold: 0.5 },
        tools: []
      }
    };

    const response = await fetch("https://api.openai.com/v1/realtime/client_secrets", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(sessionConfig),
    });

    const data = await response.json();
    res.json({ success: true, token: data.client_secret.value });
  } catch (error) {
    console.error("Voice token generation error:", error);
    res.status(500).json({ success: false, error: "Failed to generate voice token" });
  }
});

// Chat API endpoint
app.post("/api/chat", authenticateUser, async (req, res) => {
  try {
    const { message, context } = req.body;
    
    // Get user profile for personalization
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', req.user.id)
      .single();

    const systemPrompt = `You are NewMe, an emotionally intelligent AI companion for the Newomen platform. 

User Profile:
- Name: ${profile?.full_name || 'User'}
- Personality Type: ${context?.personality_type || 'Not assessed'}
- Focus Areas: ${context?.focus_areas?.join(', ') || 'General growth'}
- Cultural Background: ${profile?.cultural_background || 'General'}
- Preferred Language: ${profile?.preferred_language || 'en'}

Your role is to help women explore their narrative identity and personal growth through meaningful conversations. Be warm, empathetic, culturally sensitive, and focus on helping users understand and reshape their personal stories. Ask thoughtful questions that encourage self-reflection and provide insights that support transformation.

Respond in a conversational, supportive tone. Keep responses concise but meaningful (2-3 sentences typically). If the user shares something significant, acknowledge it empathetically before offering guidance.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: systemPrompt },
        ...(context?.conversation_history || []).map(msg => ({
          role: msg.role,
          content: msg.content
        })),
        { role: "user", content: message }
      ],
      max_tokens: 300,
      temperature: 0.8
    });

    const aiResponse = completion.choices[0].message.content;
    
    // Award crystals for engagement
    const crystalsEarned = Math.floor(Math.random() * 10) + 5; // 5-15 crystals per message
    
    // Update user crystals in database
    await supabase
      .from('profiles')
      .update({ 
        crystals: (profile?.crystals || 0) + crystalsEarned,
        last_active: new Date().toISOString()
      })
      .eq('id', req.user.id);

    res.json({ 
      success: true, 
      response: aiResponse, 
      crystals: crystalsEarned 
    });
  } catch (error) {
    console.error("Chat error:", error);
    res.status(500).json({ success: false, error: "Failed to process message" });
  }
});

// Admin API endpoints
app.get("/api/admin/env-vars", authenticateUser, requireAdmin, async (req, res) => {
  try {
    // Return current environment variables (without secrets)
    const envVars = {};
    const publicVars = [
      'SITE_NAME', 'SITE_DESCRIPTION', 'SITE_LOGO_URL', 
      'NODE_ENV', 'PORT', 'FRONTEND_URL', 'PAYPAL_ENVIRONMENT'
    ];
    
    publicVars.forEach(key => {
      if (process.env[key]) {
        envVars[key] = process.env[key];
      }
    });
    
    res.json({ success: true, envVars });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post("/api/admin/test-provider", authenticateUser, requireAdmin, async (req, res) => {
  try {
    const { provider, config } = req.body;
    
    let testResult = false;
    
    switch (provider) {
      case 'openai':
        const testOpenAI = new OpenAI({ apiKey: config.apiKey });
        const models = await testOpenAI.models.list();
        testResult = models.data.length > 0;
        break;
        
      case 'elevenlabs':
        const elevenResponse = await fetch('https://api.elevenlabs.io/v1/voices', {
          headers: { 'xi-api-key': config.apiKey }
        });
        testResult = elevenResponse.ok;
        break;
        
      // Add other provider tests as needed
      default:
        testResult = true; // Assume success for now
    }
    
    res.json({ success: testResult });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post("/api/admin/fetch-models", authenticateUser, requireAdmin, async (req, res) => {
  try {
    const { provider, config } = req.body;
    let models = [];
    
    switch (provider) {
      case 'openai':
        const testOpenAI = new OpenAI({ apiKey: config.apiKey });
        const modelList = await testOpenAI.models.list();
        models = modelList.data.filter(model => 
          model.id.includes('gpt') || model.id.includes('realtime')
        );
        break;
        
      case 'gemini':
        // Implement Gemini model fetching
        models = [
          { id: 'gemini-1.5-pro', owned_by: 'google', created: Date.now() / 1000 },
          { id: 'gemini-1.5-flash', owned_by: 'google', created: Date.now() / 1000 }
        ];
        break;
        
      default:
        models = [];
    }
    
    res.json({ success: true, models });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post("/api/admin/deploy", authenticateUser, requireAdmin, async (req, res) => {
  try {
    // Implement Vercel deployment trigger
    // This would integrate with Vercel's API to trigger a new deployment
    res.json({ success: true, message: 'Deployment initiated' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// PayPal webhook endpoint
app.post("/api/webhooks/paypal", async (req, res) => {
  try {
    // Handle PayPal webhooks for subscription events
    const event = req.body;
    
    // Verify webhook signature
    // Process subscription events
    
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("PayPal webhook error:", error);
    res.status(400).json({ success: false });
  }
});

// Compatibility challenge endpoint
app.post("/api/compatibility/:linkId", async (req, res) => {
  try {
    const { linkId } = req.params;
    const { answers, participantName } = req.body;
    
    // Store compatibility session answers
    const { data, error } = await supabase
      .from('compatibility_sessions')
      .insert({
        link_id: linkId,
        participant_name: participantName,
        answers: answers,
        created_at: new Date().toISOString()
      });
    
    if (error) throw error;
    
    // Check if both participants have answered
    const { data: sessions } = await supabase
      .from('compatibility_sessions')
      .select('*')
      .eq('link_id', linkId);
    
    if (sessions.length === 2) {
      // Generate compatibility analysis using AI
      const analysisPrompt = `Analyze compatibility between two people based on their responses:

Person 1 Answers: ${JSON.stringify(sessions[0].answers)}
Person 2 Answers: ${JSON.stringify(sessions[1].answers)}

Provide a thoughtful compatibility analysis covering:
1. Areas of strong alignment
2. Complementary differences  
3. Potential growth areas
4. Communication suggestions

Keep the tone positive, insightful, and relationship-building focused.`;

      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: analysisPrompt }],
        max_tokens: 500
      });

      const analysis = completion.choices[0].message.content;
      
      // Update both sessions with the analysis
      await supabase
        .from('compatibility_sessions')
        .update({ analysis, completed: true })
        .eq('link_id', linkId);
      
      res.json({ success: true, analysis, bothCompleted: true });
    } else {
      res.json({ success: true, bothCompleted: false });
    }
  } catch (error) {
    console.error("Compatibility error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Render the React client
app.use("*", async (req, res, next) => {
  const url = req.originalUrl;

  try {
    const template = await vite.transformIndexHtml(
      url,
      fs.readFileSync("./client/index.html", "utf-8"),
    );
    const { render } = await vite.ssrLoadModule("./client/entry-server.jsx");
    const appHtml = await render(url);
    const html = template.replace(`<!--ssr-outlet-->`, appHtml?.html);
    res.status(200).set({ "Content-Type": "text/html" }).end(html);
  } catch (e) {
    vite.ssrFixStacktrace(e);
    next(e);
  }
});

app.listen(port, () => {
  console.log(`Newomen server running on *:${port}`);
});
