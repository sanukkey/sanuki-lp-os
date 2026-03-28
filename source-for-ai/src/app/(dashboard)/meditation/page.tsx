'use client';

import { useState, useEffect } from 'react';
import { Wind, Sparkles, Play, Square } from 'lucide-react';

type Phase = '深く吸って...' | '止めて...' | 'ゆっくり吐いて...';

const PHASES: Phase[] = ['深く吸って...', '止めて...', 'ゆっくり吐いて...'];
const PHASE_DURATION = 4000; // 4秒ごとに切り替え

export default function MeditationPage() {
  const [isRunning, setIsRunning] = useState(false);
  const [phase, setPhase] = useState<Phase>('深く吸って...');
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [elapsed, setElapsed] = useState(0); // 秒

  // 呼吸フェーズ切り替え
  useEffect(() => {
    if (!isRunning) return;
    const id = setInterval(() => {
      setPhaseIndex(prev => {
        const next = (prev + 1) % 3;
        setPhase(PHASES[next]);
        return next;
      });
    }, PHASE_DURATION);
    return () => clearInterval(id);
  }, [isRunning]);

  // タイマー
  useEffect(() => {
    if (!isRunning) return;
    const id = setInterval(() => setElapsed(s => s + 1), 1000);
    return () => clearInterval(id);
  }, [isRunning]);

  const handleToggle = () => {
    if (isRunning) {
      setIsRunning(false);
    } else {
      setPhaseIndex(0);
      setPhase('深く吸って...');
      setElapsed(0);
      setIsRunning(true);
    }
  };

  const mm = String(Math.floor(elapsed / 60)).padStart(2, '0');
  const ss = String(elapsed % 60).padStart(2, '0');

  const circleScale =
    phase === '深く吸って...' ? 'scale-125' :
    phase === '止めて...'    ? 'scale-125' : 'scale-75';

  const circleOpacity =
    phase === '深く吸って...' ? 'opacity-100' :
    phase === '止めて...'    ? 'opacity-80'  : 'opacity-40';

  return (
    <div className="max-w-lg mx-auto flex flex-col items-center gap-10 pt-4 pb-24 animate-in fade-in slide-in-from-bottom-4 duration-700">

      {/* タイトル */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 text-primary-orange mb-2">
          <Wind className="h-6 w-6" />
          <h1 className="text-3xl font-bold tracking-tight text-foreground">瞑想モード</h1>
        </div>
        <p className="text-foreground/60 text-base">思考を手放し、ただ「今」の呼吸に意識を向けてください。</p>
      </div>

      {/* 呼吸アニメーション */}
      <div className="relative flex items-center justify-center w-72 h-72">
        {/* 外側リング（パルス） */}
        {isRunning && (
          <>
            <div className="absolute w-full h-full rounded-full border border-primary-orange/20 animate-ping"
              style={{ animationDuration: '4s' }} />
            <div className="absolute w-[85%] h-[85%] rounded-full border border-primary-yellow/15 animate-ping"
              style={{ animationDuration: '6s', animationDelay: '1s' }} />
          </>
        )}

        {/* メイン円 */}
        <div className={`w-48 h-48 rounded-full bg-gradient-to-tr from-primary-orange to-primary-pink
          flex items-center justify-center shadow-2xl shadow-orange-500/30
          transition-all duration-[4000ms] ease-in-out ${isRunning ? `${circleScale} ${circleOpacity}` : 'scale-100 opacity-60'}`}>
          <Sparkles className="w-12 h-12 text-white/60" />
        </div>

        {/* 呼吸フェーズテキスト（円の下） */}
        {isRunning && (
          <p className="absolute -bottom-10 text-xl font-semibold text-foreground/70 tracking-widest whitespace-nowrap">
            {phase}
          </p>
        )}
      </div>

      {/* タイマー */}
      <div className="mt-4 text-center">
        <p className="text-5xl font-black tabular-nums tracking-tighter text-foreground/80">
          {mm}:{ss}
        </p>
        <p className="text-sm text-foreground/40 mt-1">経過時間</p>
      </div>

      {/* スタート / ストップボタン */}
      <button
        onClick={handleToggle}
        className={`flex items-center gap-3 px-10 py-4 rounded-full text-lg font-bold shadow-xl transition-all hover:scale-105 active:scale-95 ${
          isRunning
            ? 'bg-white dark:bg-[#1c1310] border-2 border-primary-pink text-primary-pink'
            : 'bg-gradient-to-r from-primary-orange to-primary-pink text-white shadow-orange-500/30'
        }`}
      >
        {isRunning ? (
          <><Square className="w-5 h-5 fill-current" /> 瞑想を終了する</>
        ) : (
          <><Play className="w-5 h-5 fill-current ml-1" /> 瞑想を始める</>
        )}
      </button>

      {/* ガイドテキスト */}
      {!isRunning && (
        <div className="text-center space-y-1 text-foreground/50 text-sm">
          <p>4秒 吸う → 4秒 止める → 4秒 吐く</p>
          <p>この呼吸サイクルを繰り返します。</p>
        </div>
      )}
    </div>
  );
}
