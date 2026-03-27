'use client';

import { useState } from 'react';
import { Play, Square, Activity, Heart, Wind, Coffee } from 'lucide-react';

const EMOTIONS = [
  { label: 'ストレス', icon: Activity, freq: 528, ytId: '1ZYbU82GVz4', desc: '528Hz - 疲労回復と奇跡のヒーリングピアノ' },
  { label: '不安', icon: Wind, freq: 432, ytId: '7A0_S0iIf-A', desc: '432Hz - 宇宙の癒やしと自然の静寂' },
  { label: '悲しみ', icon: Heart, freq: 396, ytId: 'Z8Z5M830mN4', desc: '396Hz - 罪悪感と深い悲しみからの解放' },
  { label: '集中できない', icon: Coffee, freq: 417, ytId: 'lZkEY0KjIfE', desc: '417Hz - マイナスエネルギーの浄化と回復' },
];

export default function FrequencyOracle() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedEmotion, setSelectedEmotion] = useState(EMOTIONS[0]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const handleEmotionSelect = (emotion: typeof EMOTIONS[0]) => {
    setSelectedEmotion(emotion);
    if (!isPlaying) setIsPlaying(true);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">安らぎの周波数</h1>
        <p className="text-foreground/70 text-lg">ソースと周波数を合わせましょう。今の感情に最も適した心地よい音楽（自然音やピアノ）を体験してください。</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="grid grid-cols-2 gap-4">
          {EMOTIONS.map((emotion) => (
            <button
              key={emotion.label}
              onClick={() => handleEmotionSelect(emotion)}
              className={`p-6 rounded-3xl border text-left transition-all duration-300 flex flex-col items-center text-center gap-3 ${
                selectedEmotion.label === emotion.label 
                  ? 'border-primary-orange bg-orange-50 dark:bg-orange-900/20 shadow-md shadow-orange-500/10 scale-105' 
                  : 'border-orange-100 dark:border-orange-900/40 bg-white dark:bg-[#1c1310]/50 hover:bg-orange-50/50 dark:hover:bg-orange-950/30 hover:scale-105'
              }`}
            >
              <div className={`p-4 rounded-full ${selectedEmotion.label === emotion.label ? 'bg-gradient-to-tr from-primary-orange to-primary-pink text-white' : 'bg-orange-100 dark:bg-orange-900/40 text-primary-orange'}`}>
                <emotion.icon className="w-8 h-8" />
              </div>
              <div>
                <h3 className="font-bold text-foreground">{emotion.label}</h3>
                <p className="text-xs text-foreground/60 mt-1">{emotion.freq}Hz</p>
              </div>
            </button>
          ))}
        </div>

        <div className="bg-white dark:bg-[#1c1310]/80 backdrop-blur-xl border border-orange-100 dark:border-orange-900/40 rounded-3xl p-8 shadow-xl shadow-orange-500/5 flex flex-col items-center justify-center relative overflow-hidden">
          <div className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-1000 ${isPlaying ? 'opacity-100' : 'opacity-0'}`}>
            <div className="w-[150%] h-[150%] rounded-full border border-primary-orange/20 animate-ping" style={{ animationDuration: '4s' }} />
            <div className="absolute w-[180%] h-[180%] rounded-full border border-primary-yellow/10 animate-ping" style={{ animationDuration: '6s', animationDelay: '1s' }} />
          </div>

          <div className="z-10 flex flex-col items-center text-center">
            <h2 className="text-6xl font-black bg-clip-text text-transparent bg-gradient-to-br from-primary-orange to-primary-pink tracking-tighter mb-4">
              {selectedEmotion.freq}
              <span className="text-3xl text-foreground/40 ml-1">Hz</span>
            </h2>
            <p className="text-foreground/80 font-medium mb-12 max-w-xs leading-relaxed">
              {selectedEmotion.desc}
            </p>

            <button 
              onClick={togglePlay}
              className={`w-24 h-24 rounded-full flex items-center justify-center transition-all shadow-xl hover:scale-110 ${
                isPlaying 
                  ? 'bg-white dark:bg-[#1c1310] border-2 border-primary-pink text-primary-pink cursor-pointer' 
                  : 'bg-gradient-to-tr from-primary-orange to-primary-pink text-white hover:shadow-orange-500/40'
              }`}
            >
              {isPlaying ? <Square className="w-8 h-8 fill-current" /> : <Play className="w-10 h-10 ml-2 fill-current" />}
            </button>
            <p className="mt-6 text-sm text-foreground/50 font-medium tracking-widest">
              {isPlaying ? '自然との共鳴中...' : '波動を合わせる'}
            </p>
          </div>
        </div>
      </div>
      
      {/* Hidden YouTube audio player triggered by play state */}
      {/* iOS Safari requires allow="autoplay; encrypted-media" for audio autoplay after user gesture */}
      <div className="w-0 h-0 overflow-hidden opacity-0 pointer-events-none absolute">
        {isPlaying && (
          <iframe
            width="1"
            height="1"
            src={`https://www.youtube.com/embed/${selectedEmotion.ytId}?autoplay=1&loop=1&playlist=${selectedEmotion.ytId}&controls=0&mute=0`}
            allow="autoplay; encrypted-media"
            title="Healing Audio"
          />
        )}
      </div>
    </div>
  );
}
