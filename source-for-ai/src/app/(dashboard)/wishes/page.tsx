'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Star, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type Wish = {
  id: string;
  text: string;
  achieved: boolean;
  user_id?: string;
};

export default function WishesPage() {
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [newWish, setNewWish] = useState('');
  const [loading, setLoading] = useState(true);
  const [showVortex, setShowVortex] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    fetchWishes();
  }, []);

  const fetchWishes = async () => {
    try {
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
        setWishes([
          { id: '1', text: '月収100万円を自動化する', achieved: false },
          { id: '2', text: 'ハワイで1ヶ月暮らす', achieved: true },
        ]);
        setLoading(false);
        return;
      }
      
      const { data, error } = await supabase.from('wishes').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      if (data) setWishes(data);
    } catch (err) {
      console.error(err);
      setWishes([
        { id: '1', text: '月収100万円を自動化する', achieved: false },
        { id: '2', text: '理想のパートナーと出会う', achieved: true },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const addWish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWish.trim()) return;

    const wish: Wish = { id: Date.now().toString(), text: newWish, achieved: false };
    setWishes([wish, ...wishes]); 
    setNewWish('');

    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      const { data: userData } = await supabase.auth.getUser();
      if (userData?.user) {
        const { error } = await supabase.from('wishes').insert([
          { ...wish, user_id: userData.user.id }
        ]);
        if (error) console.error(error);
      }
    }
  };

  const toggleAchieve = async (id: string, currentStatus: boolean) => {
    const updated = !currentStatus;
    setWishes(wishes.map(w => w.id === id ? { ...w, achieved: updated } : w));
    
    if (updated) {
      triggerVortex();
    }

    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      const { error } = await supabase.from('wishes').update({ achieved: updated }).eq('id', id);
      if (error) console.error(error);
    }
  };

  const deleteWish = async (id: string) => {
    setWishes(wishes.filter(w => w.id !== id));
    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      const { error } = await supabase.from('wishes').delete().eq('id', id);
      if (error) console.error(error);
    }
  };

  const triggerVortex = () => {
    setShowVortex(true);
    setTimeout(() => setShowVortex(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 relative">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">宇宙へのオーダー</h1>
        <p className="text-foreground/70 text-lg">あなたの願望のロケットをボルテックスへ打ち上げましょう。現実化したらスターを付けて達成を祝いましょう。</p>
      </div>

      <form onSubmit={addWish} className="flex gap-4">
        <input
          type="text"
          value={newWish}
          onChange={(e) => setNewWish(e.target.value)}
          placeholder="宇宙へ放つ願望を入力..."
          className="flex-1 bg-white dark:bg-[#1c1310] border border-orange-100 dark:border-orange-900/40 rounded-2xl py-4 px-6 focus:outline-none focus:ring-2 focus:ring-primary-orange/50 text-foreground transition-all shadow-sm"
        />
        <button
          type="submit"
          className="bg-gradient-to-r from-primary-orange to-primary-pink text-white rounded-2xl px-6 py-4 font-bold hover:shadow-lg hover:shadow-orange-500/20 transition-all hover:-translate-y-0.5"
        >
          <Plus className="w-6 h-6" />
        </button>
      </form>

      {loading ? (
        <div className="flex justify-center py-12"><div className="w-8 h-8 rounded-full border-4 border-primary-orange border-t-transparent animate-spin" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AnimatePresence>
            {wishes.map((wish) => (
              <motion.div
                key={wish.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`p-6 rounded-3xl border transition-all flex flex-col justify-between min-h-[140px] group ${
                  wish.achieved 
                    ? 'bg-gradient-to-br from-orange-50 to-pink-50 dark:from-orange-950/20 dark:to-pink-950/20 border-orange-200 dark:border-orange-800' 
                    : 'bg-white dark:bg-[#1c1310]/50 border-orange-100 dark:border-orange-900/30'
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <p className={`text-lg font-medium pr-4 ${wish.achieved ? 'text-primary-orange dark:text-orange-400 line-through opacity-80' : 'text-foreground'}`}>
                    {wish.text}
                  </p>
                  <button onClick={() => deleteWish(wish.id)} className="text-foreground/20 hover:text-red-500 transition-colors shrink-0">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="flex justify-end">
                  <button
                    onClick={() => toggleAchieve(wish.id, wish.achieved)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                      wish.achieved 
                        ? 'bg-primary-yellow text-white shadow-md shadow-yellow-500/20' 
                        : 'bg-orange-100 dark:bg-orange-900/40 text-primary-orange hover:bg-orange-200 dark:hover:bg-orange-800/60'
                    }`}
                  >
                    {wish.achieved ? <Star className="w-4 h-4 fill-current" /> : <CheckCircle2 className="w-4 h-4" />}
                    <span className="font-bold text-sm">{wish.achieved ? '達成！' : '叶った！'}</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      <AnimatePresence>
        {showVortex && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none overflow-hidden"
          >
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            
            <motion.div 
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: [0, 1.2, 1], rotate: 180 }}
              transition={{ duration: 1.5, type: 'spring' }}
              className="relative z-10 flex flex-col items-center"
            >
              <div className="w-64 h-64 relative flex items-center justify-center">
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 rounded-full border-[10px] border-t-primary-orange border-r-primary-pink border-b-primary-yellow border-l-transparent opacity-80"
                />
                <motion.div 
                  animate={{ rotate: -360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-4 rounded-full border-[8px] border-t-primary-yellow border-r-transparent border-b-primary-orange border-l-primary-pink opacity-60"
                />
                <Star className="w-24 h-24 text-white fill-primary-yellow drop-shadow-2xl z-20 absolute" />
              </div>
              
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-4xl font-black text-white mt-8 tracking-wider bg-clip-text drop-shadow-lg"
              >
                ボルテックスと一致しました！
              </motion.h2>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
