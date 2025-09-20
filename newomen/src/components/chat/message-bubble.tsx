import { format } from 'date-fns'
import type { Message } from '@/types'

interface MessageBubbleProps {
  message: Message
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user'

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} chat-bubble-enter`}>
      <div
        className={`max-w-[80%] md:max-w-[60%] rounded-2xl px-4 py-3 ${
          isUser
            ? 'bg-gradient-to-r from-primary to-secondary text-white'
            : 'glass text-white'
        }`}
      >
        <p className="whitespace-pre-wrap">{message.content}</p>
        
        {message.emotionData && (
          <div className="mt-2 text-xs opacity-70">
            Emotion: {message.emotionData.primary}
          </div>
        )}
        
        <div className={`text-xs mt-2 ${isUser ? 'text-white/70' : 'text-white/50'}`}>
          {format(new Date(message.createdAt), 'h:mm a')}
        </div>
      </div>
    </div>
  )
}