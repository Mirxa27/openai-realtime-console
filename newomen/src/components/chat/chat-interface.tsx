'use client'

import { useState, useEffect, useRef } from 'react'
import { Send, Mic, MicOff, Phone, PhoneOff } from 'lucide-react'
import { useRealtime } from '@/contexts/realtime-context'
import { useAuth } from '@/contexts/auth-context'
import { MessageBubble } from './message-bubble'
import { DynamicHeadline } from './dynamic-headline'
import { createClient } from '@/lib/supabase/client'
import type { Message } from '@/types'

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputText, setInputText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [mode, setMode] = useState<'text' | 'voice'>('text')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  
  const { user, profile } = useAuth()
  const {
    isConnected,
    isListening,
    isSpeaking,
    connect,
    disconnect,
    startListening,
    stopListening,
    sendText,
    conversationId,
  } = useRealtime()
  
  const supabase = createClient()

  useEffect(() => {
    if (conversationId) {
      loadMessages()
    }
  }, [conversationId])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const loadMessages = async () => {
    if (!conversationId) return

    const { data } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true })

    if (data) {
      setMessages(data)
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSendMessage = async () => {
    if (!inputText.trim() || !user) return

    const userMessage: Message = {
      id: crypto.randomUUID(),
      conversationId: conversationId || '',
      userId: user.id,
      role: 'user',
      content: inputText,
      createdAt: new Date().toISOString(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputText('')
    setIsTyping(true)

    if (isConnected) {
      sendText(inputText)
    } else {
      // Fallback to regular chat API
      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: inputText }),
        })

        const data = await response.json()
        
        const assistantMessage: Message = {
          id: crypto.randomUUID(),
          conversationId: conversationId || '',
          userId: user.id,
          role: 'assistant',
          content: data.message,
          createdAt: new Date().toISOString(),
        }

        setMessages((prev) => [...prev, assistantMessage])
      } catch (error) {
        console.error('Chat error:', error)
      } finally {
        setIsTyping(false)
      }
    }
  }

  const handleVoiceToggle = async () => {
    if (mode === 'text') {
      setMode('voice')
      if (!isConnected) {
        await connect()
      }
      startListening()
    } else {
      setMode('text')
      stopListening()
      if (isConnected) {
        disconnect()
      }
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Dynamic headline */}
      <DynamicHeadline />

      {/* Voice call button (prominent CTA) */}
      {profile?.minutesRemaining > 0 && (
        <div className="px-4 py-3">
          <button
            onClick={handleVoiceToggle}
            className={`w-full py-4 rounded-full font-medium transition-all flex items-center justify-center gap-3 ${
              mode === 'voice' && isConnected
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : 'bg-gradient-to-r from-primary to-secondary hover:scale-105 text-white'
            }`}
          >
            {mode === 'voice' && isConnected ? (
              <>
                <PhoneOff size={24} />
                End Voice Chat
              </>
            ) : (
              <>
                <Phone size={24} />
                Start Voice Conversation
              </>
            )}
          </button>
        </div>
      )}

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
        
        {isTyping && (
          <div className="flex items-center gap-2 text-white/60">
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
            <span className="text-sm">NewMe is typing...</span>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="border-t border-glass-border p-4">
        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={mode === 'voice' ? 'Voice mode active...' : 'Type your message...'}
            className="flex-1 glass rounded-full px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primary/50"
            disabled={mode === 'voice'}
          />
          
          {mode === 'text' ? (
            <button
              onClick={handleSendMessage}
              disabled={!inputText.trim()}
              className="glass-button p-3 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={20} />
            </button>
          ) : (
            <button
              onClick={() => isListening ? stopListening() : startListening()}
              className={`p-3 rounded-full transition-all ${
                isListening
                  ? 'bg-red-500 hover:bg-red-600'
                  : 'glass-button'
              }`}
            >
              {isListening ? <MicOff size={20} /> : <Mic size={20} />}
            </button>
          )}
        </div>

        {/* Voice status indicators */}
        {mode === 'voice' && isConnected && (
          <div className="flex items-center justify-center gap-4 mt-2 text-sm text-white/60">
            {isListening && <span className="flex items-center gap-1"><Mic size={14} /> Listening...</span>}
            {isSpeaking && <span className="flex items-center gap-1">NewMe is speaking...</span>}
          </div>
        )}
      </div>
    </div>
  )
}