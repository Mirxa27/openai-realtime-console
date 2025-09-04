import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mic, 
  MicOff, 
  Send, 
  Sparkles, 
  Volume2, 
  VolumeX,
  Phone,
  PhoneOff,
  Gem
} from 'lucide-react';
import { useAuthStore, useAppStore } from '../../lib/store';
import { toast } from 'react-hot-toast';
import GlassCard from '../UI/GlassCard';

export default function ChatPage() {
  const { user, profile } = useAuthStore();
  const { 
    messages, 
    addMessage, 
    isTyping, 
    setTyping, 
    currentHeadline, 
    setCurrentHeadline,
    isVoiceConnected,
    setVoiceConnected
  } = useAppStore();
  
  const [inputText, setInputText] = useState('');
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [dataChannel, setDataChannel] = useState(null);
  
  const messagesEndRef = useRef(null);
  const peerConnection = useRef(null);
  const audioElement = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    // Generate dynamic headline
    generateDynamicHeadline();
  }, []);

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const generateDynamicHeadline = () => {
    const headlines = [
      'What\'s on your heart today?',
      'Ready to explore your inner world?',
      'Let\'s dive deep into your story...',
      'What chapter are you writing today?',
      'Your thoughts matter. Share them here.',
      'What would you like to discover about yourself?',
      'How can we grow together today?',
      'What story wants to be told?'
    ];
    
    const randomHeadline = headlines[Math.floor(Math.random() * headlines.length)];
    setCurrentHeadline(randomHeadline);
  };

  const startVoiceSession = async () => {
    try {
      // Get ephemeral token
      const tokenResponse = await fetch('/api/voice-token');
      const tokenData = await tokenResponse.json();
      
      if (!tokenData.success) {
        throw new Error('Failed to get voice token');
      }

      // Create peer connection
      const pc = new RTCPeerConnection();

      // Set up audio output
      audioElement.current = document.createElement('audio');
      audioElement.current.autoplay = true;
      pc.ontrack = (e) => {
        audioElement.current.srcObject = e.streams[0];
        setIsSpeaking(true);
      };

      // Add microphone input
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      pc.addTrack(stream.getTracks()[0]);

      // Set up data channel
      const dc = pc.createDataChannel('oai-events');
      setDataChannel(dc);

      // Create offer and connect
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      const sdpResponse = await fetch('https://api.openai.com/v1/realtime/calls?model=gpt-realtime', {
        method: 'POST',
        body: offer.sdp,
        headers: {
          'Authorization': `Bearer ${tokenData.token}`,
          'Content-Type': 'application/sdp',
        },
      });

      const sdp = await sdpResponse.text();
      await pc.setRemoteDescription({ type: 'answer', sdp });

      peerConnection.current = pc;
      setVoiceConnected(true);
      setIsVoiceMode(true);

      // Set up data channel listeners
      dc.addEventListener('message', (e) => {
        const event = JSON.parse(e.data);
        handleVoiceEvent(event);
      });

      dc.addEventListener('open', () => {
        // Send initial instructions
        sendVoiceEvent({
          type: 'session.update',
          session: {
            instructions: `You are NewMe, an emotionally intelligent AI companion for the Newomen platform. You help women explore their narrative identity and personal growth. Be warm, empathetic, culturally sensitive, and focus on helping users understand and reshape their personal stories. User profile: ${profile?.personality_type || 'Not assessed'}, Focus areas: ${profile?.focus_areas?.join(', ') || 'General growth'}.`,
            voice: 'alloy',
            input_audio_transcription: { model: 'whisper-1' }
          }
        });
      });

      toast.success('Voice chat connected!');
    } catch (error) {
      console.error('Voice session error:', error);
      toast.error('Failed to connect voice chat');
    }
  };

  const stopVoiceSession = () => {
    if (dataChannel) {
      dataChannel.close();
    }

    if (peerConnection.current) {
      peerConnection.current.getSenders().forEach((sender) => {
        if (sender.track) {
          sender.track.stop();
        }
      });
      peerConnection.current.close();
    }

    setVoiceConnected(false);
    setIsVoiceMode(false);
    setIsListening(false);
    setIsSpeaking(false);
    setDataChannel(null);
    peerConnection.current = null;

    toast.success('Voice chat disconnected');
  };

  const sendVoiceEvent = (event) => {
    if (dataChannel && dataChannel.readyState === 'open') {
      dataChannel.send(JSON.stringify(event));
    }
  };

  const handleVoiceEvent = (event) => {
    switch (event.type) {
      case 'conversation.item.input_audio_transcription.completed':
        if (event.transcript) {
          addMessage({
            role: 'user',
            content: event.transcript,
            type: 'voice'
          });
        }
        break;
        
      case 'response.audio_transcript.delta':
        // Handle real-time transcription
        break;
        
      case 'response.audio_transcript.done':
        if (event.transcript) {
          addMessage({
            role: 'assistant',
            content: event.transcript,
            type: 'voice'
          });
        }
        break;
        
      case 'response.done':
        setIsSpeaking(false);
        break;
    }
  };

  const sendTextMessage = async () => {
    if (!inputText.trim()) return;

    const message = inputText.trim();
    setInputText('');
    
    addMessage({
      role: 'user',
      content: message,
      type: 'text'
    });

    setTyping(true);

    try {
      // Send to AI service
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.access_token}`
        },
        body: JSON.stringify({
          message,
          userId: user.id,
          context: {
            personality_type: profile?.personality_type,
            focus_areas: profile?.focus_areas,
            conversation_history: messages.slice(-10) // Last 10 messages for context
          }
        })
      });

      const data = await response.json();
      
      if (data.success) {
        addMessage({
          role: 'assistant',
          content: data.response,
          type: 'text'
        });
        
        // Update progress/crystals if provided
        if (data.crystals) {
          updateCrystals(data.crystals);
          toast.success(`+${data.crystals} crystals earned!`);
        }
      } else {
        throw new Error(data.error || 'Failed to send message');
      }
    } catch (error) {
      console.error('Chat error:', error);
      toast.error('Failed to send message. Please try again.');
    } finally {
      setTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendTextMessage();
    }
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Chat Header */}
      <div className="p-4 border-b border-white/10">
        <GlassCard className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-display font-bold text-white mb-2">
                Chat with NewMe
              </h1>
              <p className="text-white/80 text-lg">
                {currentHeadline}
              </p>
            </div>
            
            {/* Voice Toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={isVoiceConnected ? stopVoiceSession : startVoiceSession}
              className={`p-4 rounded-full transition-all duration-300 ${
                isVoiceConnected 
                  ? 'bg-red-500 hover:bg-red-600' 
                  : 'bg-gradient-to-r from-newomen-primary to-newomen-secondary hover:from-newomen-secondary hover:to-newomen-primary'
              }`}
            >
              {isVoiceConnected ? (
                <PhoneOff className="w-6 h-6 text-white" />
              ) : (
                <Phone className="w-6 h-6 text-white" />
              )}
            </motion.button>
          </div>
        </GlassCard>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((message, index) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <GlassCard 
                className={`max-w-xs md:max-w-md p-4 ${
                  message.role === 'user'
                    ? 'bg-gradient-to-r from-newomen-primary to-newomen-secondary'
                    : 'bg-white/10'
                }`}
                hover={false}
              >
                <div className="flex items-start space-x-3">
                  {message.role === 'assistant' && (
                    <div className="w-8 h-8 bg-gradient-to-r from-newomen-crystal to-newomen-secondary rounded-full flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="text-white leading-relaxed">
                      {message.content}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-white/60 text-xs">
                        {message.timestamp?.toLocaleTimeString()}
                      </span>
                      {message.type === 'voice' && (
                        <Volume2 className="w-3 h-3 text-white/60" />
                      )}
                    </div>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing Indicator */}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <GlassCard className="p-4 bg-white/10" hover={false}>
              <div className="flex items-center space-x-3">
                                  <div className="w-8 h-8 bg-gradient-to-r from-newomen-crystal to-newomen-secondary rounded-full flex items-center justify-center">
                    <Gem className="w-4 h-4 text-white" />
                </div>
                <div className="flex space-x-1">
                  {[0, 1, 2].map((dot) => (
                    <motion.div
                      key={dot}
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        delay: dot * 0.2
                      }}
                      className="w-2 h-2 bg-white/60 rounded-full"
                    />
                  ))}
                </div>
              </div>
            </GlassCard>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      {!isVoiceMode && (
        <div className="p-4 border-t border-white/10">
          <GlassCard className="p-4">
            <div className="flex items-end space-x-4">
              <div className="flex-1">
                <textarea
                  ref={inputRef}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Share your thoughts, feelings, or questions..."
                  className="w-full bg-transparent text-white placeholder-white/50 resize-none focus:outline-none min-h-[44px] max-h-32"
                  rows={1}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={startVoiceSession}
                  className="p-3 bg-gradient-to-r from-newomen-accent to-newomen-primary rounded-full text-white hover:from-newomen-primary hover:to-newomen-accent transition-all duration-300"
                >
                  <Mic className="w-5 h-5" />
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={sendTextMessage}
                  disabled={!inputText.trim()}
                  className={`p-3 rounded-full transition-all duration-300 ${
                    inputText.trim()
                      ? 'bg-gradient-to-r from-newomen-primary to-newomen-secondary text-white hover:from-newomen-secondary hover:to-newomen-primary'
                      : 'bg-white/10 text-white/50 cursor-not-allowed'
                  }`}
                >
                  <Send className="w-5 h-5" />
                </motion.button>
              </div>
            </div>
          </GlassCard>
        </div>
      )}

      {/* Voice Mode Overlay */}
      <AnimatePresence>
        {isVoiceMode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center"
          >
            <GlassCard className="p-8 text-center max-w-md mx-4">
              <motion.div
                animate={isListening ? { scale: [1, 1.1, 1] } : {}}
                transition={{ duration: 1, repeat: Infinity }}
                className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-newomen-primary to-newomen-secondary rounded-full flex items-center justify-center"
              >
                {isVoiceConnected ? (
                  <Mic className="w-12 h-12 text-white" />
                ) : (
                  <MicOff className="w-12 h-12 text-white/60" />
                )}
              </motion.div>
              
              <h3 className="text-2xl font-bold text-white mb-4">
                Voice Chat Active
              </h3>
              
              <p className="text-white/80 mb-6">
                {isVoiceConnected 
                  ? (isListening ? 'Listening...' : 'Speak naturally with NewMe')
                  : 'Connecting to voice chat...'
                }
              </p>
              
              <div className="flex justify-center space-x-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsListening(!isListening)}
                  disabled={!isVoiceConnected}
                  className={`p-4 rounded-full transition-all duration-300 ${
                    isListening
                      ? 'bg-red-500 hover:bg-red-600'
                      : 'bg-green-500 hover:bg-green-600'
                  }`}
                >
                  {isListening ? (
                    <MicOff className="w-6 h-6 text-white" />
                  ) : (
                    <Mic className="w-6 h-6 text-white" />
                  )}
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsSpeaking(!isSpeaking)}
                  disabled={!isVoiceConnected}
                  className="p-4 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
                >
                  {isSpeaking ? (
                    <VolumeX className="w-6 h-6 text-white" />
                  ) : (
                    <Volume2 className="w-6 h-6 text-white" />
                  )}
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={stopVoiceSession}
                  className="p-4 bg-red-500 hover:bg-red-600 rounded-full transition-colors"
                >
                  <PhoneOff className="w-6 h-6 text-white" />
                </motion.button>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty State */}
      {messages.length === 0 && !isVoiceMode && (
        <div className="flex-1 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-md"
          >
            <GlassCard className="p-8">
              <Sparkles className="w-16 h-16 text-newomen-crystal mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-white mb-4">
                Start Your Conversation
              </h3>
              <p className="text-white/80 mb-6">
                Begin your journey of self-discovery with NewMe. Share what's on your mind or ask for guidance.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={startVoiceSession}
                className="w-full p-4 bg-gradient-to-r from-newomen-primary to-newomen-secondary rounded-xl text-white font-semibold hover:from-newomen-secondary hover:to-newomen-primary transition-all duration-300"
              >
                <div className="flex items-center justify-center space-x-2">
                  <Mic className="w-5 h-5" />
                  <span>Start Voice Conversation</span>
                </div>
              </motion.button>
            </GlassCard>
          </motion.div>
        </div>
      )}
    </div>
  );
}