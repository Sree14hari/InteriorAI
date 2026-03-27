'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useDesignStore } from '@/store/designStore';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { Button } from '@/components/ui/button';
import { Loader2, Sparkles, Wand2, RefreshCw } from 'lucide-react';

const SUGGESTIONS = [
  'Industrial kitchen, dark palette',
  'Bohemian home office with plants',
  'Scandinavian bedroom, airy vibes',
  'Traditional library with warm wood',
  'Minimalist bathroom with stone',
];

export function ChatContainer() {
  const [isLoading, setIsLoading] = useState(false);
  const [readyToGenerate, setReadyToGenerate] = useState(false);
  const { messages, addMessage, clearMessages, updatePreferences } = useDesignStore();
  const router = useRouter();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Extract preferences from the AI's response
  const extractPreferences = (text: string, aiPrefs?: any) => {
    if (aiPrefs && typeof aiPrefs === 'object') {
      updatePreferences(aiPrefs);
      return;
    }

    // Fallback: keyword extraction
    const lower = text.toLowerCase();
    const prefs: Record<string, unknown> = {};

    const roomTypes = ['living room', 'bedroom', 'kitchen', 'bathroom', 'office', 'dining room', 'studio'];
    for (const r of roomTypes) if (lower.includes(r)) { prefs.roomType = r; break; }

    const styleKeywords = ['modern', 'minimalist', 'bohemian', 'industrial', 'scandinavian', 'traditional', 'contemporary', 'rustic', 'eclectic'];
    const foundStyles = styleKeywords.filter((s) => lower.includes(s));
    if (foundStyles.length > 0) prefs.styles = foundStyles;

    if (lower.includes('budget')) prefs.budget = 'budget';
    else if (lower.includes('luxury') || lower.includes('high-end')) prefs.budget = 'luxury';
    else if (lower.includes('mid-range')) prefs.budget = 'mid-range';

    const moods = ['cozy', 'airy', 'warm', 'cool', 'dramatic', 'serene', 'vibrant', 'calm'];
    for (const m of moods) if (lower.includes(m)) { prefs.mood = m; break; }

    if (Object.keys(prefs).length > 0) updatePreferences(prefs as any);
  };

  const sendMessage = async (content: string) => {
    addMessage({ role: 'user', content });
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, { role: 'user', content }],
        }),
      });

      const data = await res.json();
      const reply = data.message ?? 'Sorry, I couldn\'t respond.';

      addMessage({ role: 'assistant', content: reply });

      // Preferences can be extract on every turn now if AI provided them, 
      // but primarily when ready to generate
      if (data.readyToGenerate || data.extractedPrefs) {
        extractPreferences(reply, data.extractedPrefs);
        if (data.readyToGenerate) setReadyToGenerate(true);
      }
    } catch (error) {
      console.error('Chat error:', error);
      addMessage({
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    clearMessages();
    updatePreferences({ roomType: '', styles: [], colors: '', budget: '', mood: '', mustHave: '', avoid: '' });
    setReadyToGenerate(false);
  };

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col bg-slate-900/40 border border-white/8 backdrop-blur-xl rounded-2xl overflow-hidden shadow-2xl shadow-black/40">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/8 bg-gradient-to-r from-purple-900/20 to-pink-900/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-white font-semibold text-sm">Studio AI</p>
            <p className="text-gray-500 text-xs">Your interior design assistant</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-gray-500 text-xs">Online</span>
          {messages.length > 0 && (
            <button
              onClick={handleReset}
              className="ml-2 p-1.5 rounded-lg text-gray-600 hover:text-gray-400 hover:bg-white/5 transition-all"
              title="Start over"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 h-[460px] overflow-y-auto p-5 space-y-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
        <AnimatePresence>
          {messages.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="text-center py-10"
            >
              <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-white/8 flex items-center justify-center">
                <Wand2 className="w-8 h-8 text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Hi! I&apos;m your AI Designer
              </h3>
              <p className="text-gray-500 text-sm max-w-xs mx-auto leading-relaxed">
                Describe your room or pick a suggestion below. I&apos;ll gather your preferences and generate stunning designs.
              </p>
              <div className="flex flex-wrap justify-center gap-2 mt-6">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => sendMessage(s)}
                    className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-gray-400 hover:bg-white/10 hover:text-white hover:border-purple-500/40 transition-all"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {messages.map((message, i) => (
          <ChatMessage key={i} role={message.role} content={message.content} />
        ))}

        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 pl-12"
          >
            <div className="flex gap-1 items-center">
              <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '120ms' }} />
              <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '240ms' }} />
            </div>
            <span className="text-xs text-gray-500">Studio AI is thinking…</span>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="p-4 border-t border-white/8 bg-white/[0.02] space-y-3">
        <ChatInput onSend={sendMessage} isLoading={isLoading} />

        <AnimatePresence>
          {readyToGenerate && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.97 }}
            >
              <Button
                onClick={() => router.push('/design/generate')}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 h-12 text-base rounded-xl shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all"
                size="lg"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Generate My Designs
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
