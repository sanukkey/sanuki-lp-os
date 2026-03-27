'use client';

import { useState, useEffect } from 'react';
import { BookHeart, Plus, Trash2 } from 'lucide-react';

type Entry = {
  id: string;
  date: string;
  content: string;
};

export default function JournalPage() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [input, setInput] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('source_journal_entries');
    if (saved) {
      try {
        setEntries(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse journal entries", e);
      }
    }
    setIsLoaded(true);
  }, []);

  const saveEntries = (newEntries: Entry[]) => {
    setEntries(newEntries);
    localStorage.setItem('source_journal_entries', JSON.stringify(newEntries));
  };

  const addEntry = () => {
    if (!input.trim()) return;
    const newEntry: Entry = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString('ja-JP', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
      content: input.trim()
    };
    saveEntries([newEntry, ...entries]);
    setInput('');
  };

  const deleteEntry = (id: string) => {
    saveEntries(entries.filter(e => e.id !== id));
  };

  if (!isLoaded) return null; // Hydration mismatch prevented by waiting for mount

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2 flex items-center">
          <BookHeart className="w-8 h-8 mr-3 text-primary-pink" />
          引き寄せ日記
        </h1>
        <p className="text-foreground/70 text-lg">今日あった小さなシンクロニシティや良い気分を記録して、波動を高めましょう。</p>
      </div>

      <div className="bg-white dark:bg-[#1c1310]/80 backdrop-blur-xl border border-orange-100 dark:border-orange-900/40 rounded-3xl p-6 shadow-xl shadow-orange-500/5">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="今日はどんな素晴らしいことがありましたか？（例：ゾロ目を見た、欲しかった情報が飛び込んできた）"
          className="w-full h-32 bg-orange-50/50 dark:bg-black/20 border border-orange-100 dark:border-orange-900/50 rounded-2xl p-4 focus:outline-none focus:ring-2 focus:ring-primary-pink/50 resize-none mb-4 transition-all"
        />
        <div className="flex justify-end">
          <button 
            onClick={addEntry}
            disabled={!input.trim()}
            className="flex items-center px-6 py-3 bg-gradient-to-r from-primary-pink to-primary-orange text-white font-bold rounded-xl shadow-md cursor-pointer hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed transition-all"
          >
            <Plus className="w-5 h-5 mr-1" />
            記録する
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {entries.length === 0 ? (
          <div className="text-center py-16 text-foreground/40 bg-white/30 dark:bg-[#1c1310]/30 rounded-3xl border border-dashed border-orange-200 dark:border-orange-900/30">
            <BookHeart className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p>まだ記録がありません。</p>
            <p className="text-sm mt-1">あなたの最初の「良い気分」を書き残してみましょう。</p>
          </div>
        ) : (
          entries.map((entry, index) => (
            <div 
              key={entry.id} 
              className="bg-white dark:bg-[#1c1310]/50 border border-orange-100 dark:border-orange-900/30 rounded-2xl p-6 hover:shadow-md transition-all relative group animate-in fade-in slide-in-from-bottom-2"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex justify-between items-start mb-3">
                <span className="text-xs font-bold text-primary-orange bg-orange-100 dark:bg-orange-900/40 px-3 py-1 rounded-full inline-block">
                  {entry.date}
                </span>
                <button 
                  onClick={() => deleteEntry(entry.id)}
                  className="text-foreground/20 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                  title="削除"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
              <p className="text-foreground/90 whitespace-pre-wrap leading-relaxed text-lg">{entry.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
