import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  
  // Check if user is authenticated
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { message } = await request.json()

  try {
    // Get user profile for personalization
    const { data: profile } = await supabase
      .from('users')
      .select('*, user_profiles(*)')
      .eq('id', user.id)
      .single()

    // Get the appropriate prompt based on user tier
    const { data: prompt } = await supabase
      .from('ai_prompts')
      .select('*')
      .eq('tier', profile.subscription_tier)
      .eq('category', 'general')
      .eq('is_active', true)
      .single()

    // Create conversation if doesn't exist
    let { data: conversation } = await supabase
      .from('conversations')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .eq('mode', 'text')
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (!conversation) {
      const { data: newConv } = await supabase
        .from('conversations')
        .insert({
          user_id: user.id,
          mode: 'text',
          title: 'Text Chat',
        })
        .select()
        .single()
      
      conversation = newConv
    }

    // Save user message
    await supabase.from('messages').insert({
      conversation_id: conversation.id,
      user_id: user.id,
      role: 'user',
      content: message,
    })

    // Generate AI response
    const systemPrompt = generateSystemPrompt(profile, prompt)
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4-turbo-preview',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message },
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to generate response')
    }

    const data = await response.json()
    const aiResponse = data.choices[0].message.content

    // Save AI response
    await supabase.from('messages').insert({
      conversation_id: conversation.id,
      user_id: user.id,
      role: 'assistant',
      content: aiResponse,
    })

    // Update conversation
    await supabase
      .from('conversations')
      .update({ 
        updated_at: new Date().toISOString(),
        minutes_used: conversation.minutes_used + 1,
      })
      .eq('id', conversation.id)

    // Update user minutes
    await supabase
      .from('users')
      .update({
        minutes_remaining: profile.minutes_remaining - 1,
        total_minutes_used: profile.total_minutes_used + 1,
      })
      .eq('id', user.id)

    return NextResponse.json({ 
      message: aiResponse,
      minutesRemaining: profile.minutes_remaining - 1,
    })
  } catch (error) {
    console.error('Chat error:', error)
    return NextResponse.json(
      { error: 'Failed to generate response' },
      { status: 500 }
    )
  }
}

function generateSystemPrompt(profile: any, promptTemplate: any) {
  const basePrompt = `You are NewMe, an emotionally intelligent AI companion designed to support women's personal growth journeys. You provide culturally-sensitive conversations and transformative guidance through narrative identity exploration.

User Profile:
- Name: ${profile.username || 'Friend'}
- Language: ${profile.language}
- Culture: ${profile.culture}
- Personality Type: ${profile.user_profiles[0]?.personality_type || 'Not assessed'}
- Focus Areas: ${profile.user_profiles[0]?.focus_areas?.join(', ') || 'General growth'}
- Subscription Tier: ${profile.subscription_tier}

Guidelines:
1. Be warm, empathetic, and supportive
2. Use narrative identity exploration techniques
3. Help users rewrite their personal stories
4. Celebrate progress and achievements
5. Adapt your tone to their cultural background`

  if (promptTemplate?.system_prompt) {
    return promptTemplate.system_prompt.replace('{{base_prompt}}', basePrompt)
  }

  return basePrompt
}