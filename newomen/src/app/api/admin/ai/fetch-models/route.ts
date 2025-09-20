import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  
  // Check admin auth
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: profile } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
  }

  const { provider } = await request.json()

  try {
    let models = []

    switch (provider.type) {
      case 'openai':
        if (provider.config?.api_key) {
          const response = await fetch('https://api.openai.com/v1/models', {
            headers: {
              'Authorization': `Bearer ${provider.config.api_key}`,
            },
          })
          
          if (response.ok) {
            const data = await response.json()
            models = data.data
              .filter((model: any) => 
                model.id.includes('gpt') || 
                model.id.includes('whisper') || 
                model.id.includes('tts')
              )
              .map((model: any) => ({
                id: model.id,
                name: model.id,
                description: `OpenAI ${model.id}`,
                capabilities: inferCapabilities(model.id),
              }))
          }
        }
        break

      case 'gemini':
        models = [
          {
            id: 'gemini-pro',
            name: 'Gemini Pro',
            description: 'Google\'s most capable model',
            capabilities: ['text', 'vision'],
          },
          {
            id: 'gemini-pro-vision',
            name: 'Gemini Pro Vision',
            description: 'Multimodal model for text and images',
            capabilities: ['text', 'vision'],
          },
        ]
        break

      case 'elevenlabs':
        if (provider.config?.api_key) {
          const response = await fetch('https://api.elevenlabs.io/v1/models', {
            headers: {
              'xi-api-key': provider.config.api_key,
            },
          })
          
          if (response.ok) {
            const data = await response.json()
            models = data.map((model: any) => ({
              id: model.model_id,
              name: model.name,
              description: model.description,
              capabilities: ['voice', 'tts'],
            }))
          }
        }
        break

      case 'deepgram':
        models = [
          {
            id: 'nova-2',
            name: 'Nova 2',
            description: 'Deepgram\'s most accurate model',
            capabilities: ['stt', 'transcription'],
          },
          {
            id: 'nova-2-conversationalai',
            name: 'Nova 2 Conversational AI',
            description: 'Optimized for real-time conversations',
            capabilities: ['stt', 'realtime'],
          },
        ]
        break

      case 'livekit':
        models = [
          {
            id: 'livekit-realtime',
            name: 'LiveKit Realtime',
            description: 'WebRTC-based real-time communication',
            capabilities: ['webrtc', 'realtime', 'voice'],
          },
        ]
        break

      case 'hume':
        models = [
          {
            id: 'prosody',
            name: 'Prosody',
            description: 'Emotion detection from voice',
            capabilities: ['emotion', 'voice-analysis'],
          },
          {
            id: 'facial-expression',
            name: 'Facial Expression',
            description: 'Emotion detection from facial expressions',
            capabilities: ['emotion', 'vision'],
          },
        ]
        break
    }

    return NextResponse.json({ models })
  } catch (error) {
    console.error('Error fetching models:', error)
    return NextResponse.json(
      { error: 'Failed to fetch models' },
      { status: 500 }
    )
  }
}

function inferCapabilities(modelId: string): string[] {
  const capabilities = []
  
  if (modelId.includes('gpt')) {
    capabilities.push('text', 'chat')
    if (modelId.includes('vision')) capabilities.push('vision')
    if (modelId.includes('realtime')) capabilities.push('realtime', 'voice')
  }
  
  if (modelId.includes('whisper')) {
    capabilities.push('stt', 'transcription')
  }
  
  if (modelId.includes('tts')) {
    capabilities.push('tts', 'voice')
  }
  
  return capabilities
}