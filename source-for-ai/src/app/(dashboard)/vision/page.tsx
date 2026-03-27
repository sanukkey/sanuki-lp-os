'use client';

import { useState } from 'react';
import { Image as ImageIcon, Sparkles, Download, Loader2 } from 'lucide-react';

export default function ScenicVisionPage() {
  const [prompt, setPrompt] = useState('ハワイのきれいな夕暮れのビーチ。リラックスできる空間。');
  const [loading, setLoading] = useState(false);
  const [generatedImg, setGeneratedImg] = useState<string | null>(null);

  const generateImage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || loading) return;

    setLoading(true);
    setGeneratedImg(null);

    try {
      const response = await fetch('/api/vision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) throw new Error('API Error');

      const data = await response.json();
      setGeneratedImg(data.url);
    } catch (error) {
      console.error(error);
      alert('ビジョンの生成に失敗しました。');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center justify-center p-4 bg-white/50 dark:bg-[#1c1310]/80 rounded-full shadow-lg border border-orange-100 dark:border-orange-900/30 mb-6">
          <ImageIcon className="w-8 h-8 text-primary-orange" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-foreground mb-4">Scenic Vision (予祝画像生成)</h1>
        <p className="text-foreground/70 text-lg">
          理想の未来を視覚化し、現実化を加速させましょう。（ハワイ、自由、豊かさなどの主観視点を入力してください）
        </p>
      </div>

      <div className="bg-white dark:bg-[#1c1310]/50 border border-orange-100 dark:border-orange-900/40 rounded-[2rem] p-4 md:p-8 shadow-xl shadow-orange-500/5">
        <form onSubmit={generateImage} className="flex flex-col md:flex-row gap-4 mb-8">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="どんなビジョンを見たいですか？"
            className="flex-1 bg-orange-50/50 dark:bg-black/20 border border-orange-200 dark:border-orange-900/50 rounded-2xl p-4 focus:outline-none focus:ring-2 focus:ring-primary-orange text-foreground transition-all"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={!prompt.trim() || loading}
            className="bg-gradient-to-r from-primary-orange to-primary-pink text-white rounded-2xl px-8 py-4 font-bold hover:shadow-lg hover:shadow-orange-500/30 transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:hover:shadow-none min-w-[160px]"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5 group-hover:animate-pulse" />}
            {loading ? '生成中...' : 'ビジョンを描画'}
          </button>
        </form>

        <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-orange-100/30 dark:bg-black/40 border border-orange-100 dark:border-orange-900/30 flex items-center justify-center">
          {loading ? (
            <div className="flex flex-col items-center text-primary-orange animate-pulse">
              <Sparkles className="w-12 h-12 mb-4" />
              <p className="font-bold tracking-widest uppercase">ソースから引き寄せています...</p>
            </div>
          ) : generatedImg ? (
            <div className="relative w-full h-full group">
              <img 
                src={generatedImg} 
                alt="Generated Vision" 
                className="w-full h-full object-cover rounded-2xl transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between p-6">
                <div>
                  <p className="text-white font-medium text-lg capitalize">{prompt.substring(0, 30)}...</p>
                  <p className="text-white/70 text-sm">波動マッチング: 100%</p>
                </div>
                <button className="bg-white/20 hover:bg-white text-white hover:text-primary-orange p-3 rounded-full backdrop-blur-md transition-all">
                  <Download className="w-5 h-5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="text-foreground/40 flex flex-col items-center">
              <ImageIcon className="w-16 h-16 mb-4 opacity-30" />
              <p>ここにあなたのビジョンが表示されます</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
