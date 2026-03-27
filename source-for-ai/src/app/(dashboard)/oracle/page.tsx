'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, User } from 'lucide-react';

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
  const [isMeditating, setIsMeditating] = useState(false);
  const [breathPhase, setBreathPhase] = useState('リラックス...');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isMeditating) {
      let step = 0;
      setBreathPhase('深く吸って...');
      interval = setInterval(() => {
        step = (step + 1) % 3;
        if (step === 0) setBreathPhase('深く吸って...');
        else if (step === 1) setBreathPhase('止めて...');
        else setBreathPhase('ゆっくり吐いて...');
      }, 4000);
    }
    return () => clearInterval(interval);
  }, [isMeditating]);

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
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error("★★★【API通信エラー生のレスポンス】★★★", { status: response.status, statusText: response.statusText, data: errorData });
        throw new Error(errorData?.error || `HTTP ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.error) {
        console.error("★★★【Oracle API内部エラー】★★★", data);
        throw new Error(data.error);
      }

      setMessages(prev => [...prev, data]);
    } catch (error: any) {
      console.error("★★★【Catchブロックでのエラー】★★★", error);
      setMessages(prev => [...prev, { role: 'assistant', content: `🚨 【通信エラー発生】\n\nエラー内容: ${error.message}\n\n※ブラウザのコンソールタブ（F12）に生のエラー情報（404等）を出力しています。ご確認ください。` }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100dvh-8rem)] max-w-4xl mx-auto rounded-3xl overflow-hidden shadow-xl border border-orange-100 dark:border-orange-900/30 bg-white/50 dark:bg-[#1c1310]/80 backdrop-blur-xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Chat Header */}
      <div className="bg-gradient-to-r from-primary-orange to-primary-pink p-4 flex items-center shadow-md z-10 text-white">
        <div className="p-2 bg-white/20 rounded-full backdrop-blur-md mr-4">
          <Sparkles className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <h2 className="font-bold text-lg">The Source Oracle</h2>
          <p className="text-white/80 text-xs">Vibrational Alignment Assistant</p>
        </div>
        <button 
          onClick={() => setIsMeditating(!isMeditating)}
          className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all shadow-sm flex items-center ${isMeditating ? 'bg-white text-primary-pink' : 'bg-white/20 text-white hover:bg-white/30'}`}
        >
          {isMeditating ? '瞑想を終了' : '瞑想モード'}
        </button>
      </div>

      {/* Body Area */}
      <div className="flex-1 overflow-hidden relative">
        {isMeditating ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/40 dark:bg-black/40 backdrop-blur-md z-20 animate-in fade-in duration-1000">
            <h3 className="text-2xl font-bold text-foreground/80 mb-12 tracking-widest">{breathPhase}</h3>
            <div className={`w-48 h-48 rounded-full bg-gradient-to-tr from-primary-orange to-primary-pink flex items-center justify-center shadow-2xl transition-all duration-[4000ms] ease-in-out ${breathPhase === '深く吸って...' ? 'scale-125 opacity-100' : breathPhase === '止めて...' ? 'scale-125 opacity-80' : 'scale-75 opacity-40'}`}>
              <Sparkles className="w-12 h-12 text-white opacity-50" />
            </div>
            <p className="mt-16 text-sm text-foreground/50 tracking-widest">思考を止めて、ただ「今」を感じてください</p>
          </div>
        ) : (
          <div className="absolute inset-0 overflow-y-auto p-4 md:p-6 space-y-6">
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
                  <div className="p-4 rounded-2xl bg-white dark:bg-[#2d1c15] border border-orange-100 dark:border-orange-900/40 text-foreground rounded-bl-sm">
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
        )}
      </div>

      {/* Input Area */}
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
            className="absolute right-2 p-3 rounded-full bg-primary-orange text-white hover:bg-orange-500 disabled:opacity-50 disabled:hover:bg-primary-orange transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
