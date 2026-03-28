'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, User } from 'lucide-react';
import { saveScaleEntry } from '@/utils/scaleStorage';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

export default function SourceOraclePage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'こんにちは。ソースと繋がっていますね。今日はどんなことを聞いてみたいですか？あなたの心が「ホッとする」お手伝いをします。' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/oracle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error || `HTTP ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      if (data.error) throw new Error(data.error);

      // スケール番号をAIの返答から抽出してLocalStorageに保存
      const match = (data.content as string).match(/スケール(\d{1,2})/);
      if (match) {
        const scale = parseInt(match[1]);
        if (scale >= 1 && scale <= 22) saveScaleEntry(scale);
      }

      setMessages(prev => [...prev, data]);
    } catch (error: any) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `🚨 通信エラーが発生しました。\n\nエラー内容: ${error.message}\n\nしばらくしてから再度お試しください。`
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100dvh-8rem)] max-w-4xl mx-auto rounded-3xl overflow-hidden shadow-xl border border-orange-100 dark:border-orange-900/30 bg-white/50 dark:bg-[#1c1310]/80 backdrop-blur-xl animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* Header */}
      <div className="bg-gradient-to-r from-primary-orange to-primary-pink p-4 flex items-center shadow-md z-10 text-white">
        <div className="p-2 bg-white/20 rounded-full backdrop-blur-md mr-4">
          <Sparkles className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <h2 className="font-bold text-lg">The Source Oracle</h2>
          <p className="text-white/80 text-xs">Vibrational Alignment Assistant</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} items-end gap-3`}>
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center shadow-sm ${
                msg.role === 'user'
                  ? 'bg-orange-100 dark:bg-orange-900 text-primary-orange'
                  : 'bg-gradient-to-tr from-primary-orange to-primary-pink text-white'
              }`}>
                {msg.role === 'user' ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
              </div>
              <div className={`p-4 rounded-2xl text-sm md:text-base leading-relaxed whitespace-pre-wrap shadow-sm ${
                msg.role === 'user'
                  ? 'bg-primary-orange text-white rounded-br-sm'
                  : 'bg-white dark:bg-[#2d1c15] border border-orange-100 dark:border-orange-900/40 text-foreground rounded-bl-sm'
              }`}>
                {msg.content}
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="flex flex-row items-end gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-tr from-primary-orange to-primary-pink text-white flex items-center justify-center shadow-sm">
                <Sparkles className="w-4 h-4 animate-spin" />
              </div>
              <div className="p-4 rounded-2xl bg-white dark:bg-[#2d1c15] border border-orange-100 dark:border-orange-900/40 rounded-bl-sm">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-primary-orange rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-primary-orange rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-primary-orange rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 pb-8 md:pb-4 bg-white dark:bg-[#1c1310] border-t border-orange-100 dark:border-orange-900/30">
        <form onSubmit={sendMessage} className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="ソースに聞いてみる..."
            className="w-full bg-orange-50/50 dark:bg-black/20 border border-orange-100 dark:border-orange-900/50 rounded-full py-4 pl-6 pr-14 focus:outline-none focus:ring-2 focus:ring-primary-orange/50 text-foreground transition-all"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="absolute right-2 p-3 rounded-full bg-primary-orange text-white hover:bg-orange-500 disabled:opacity-50 transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
