import { Activity, Star, Calendar, ArrowUpRight, TrendingUp } from 'lucide-react';

export default function DashboardPage() {
  const alignData = [
    { day: '月', val: 60 },
    { day: '火', val: 80 },
    { day: '水', val: 50 },
    { day: '木', val: 90 },
    { day: '金', val: 100 },
    { day: '土', val: 85 },
    { day: '日', val: 95 },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-gradient-to-br from-primary-orange to-primary-pink p-8 rounded-[2rem] text-white shadow-xl flex flex-col md:flex-row justify-between items-center gap-6 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="z-10 w-full">
          <h2 className="text-3xl font-bold mb-2 tracking-tight">ボルテックストラッカー</h2>
          <p className="text-white/90 text-lg">あなたの日々の波動と同調の記録です。</p>
        </div>
        <div className="z-10 shrink-0 bg-white/20 backdrop-blur-md rounded-2xl p-4 flex items-center gap-4 w-full md:w-auto">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-primary-orange shadow-sm">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-white/80 text-sm font-medium">今週の波動状態</p>
            <p className="text-2xl font-bold">+15%</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-[#1c1310]/50 border border-orange-100 dark:border-orange-900/30 p-6 rounded-3xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 bg-orange-50 dark:bg-orange-900/10 w-24 h-24 rounded-full group-hover:scale-150 transition-transform duration-500" />
          <h3 className="text-sm font-semibold text-foreground/60 mb-2 flex items-center gap-2">
            <Activity className="w-4 h-4 text-primary-orange" />
            現在の周波数
          </h3>
          <p className="text-5xl font-black text-primary-orange tracking-tighter">528<span className="text-xl text-foreground/40 ml-1 font-medium tracking-normal">Hz</span></p>
        </div>
        
        <div className="bg-white dark:bg-[#1c1310]/50 border border-orange-100 dark:border-orange-900/30 p-6 rounded-3xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 bg-yellow-50 dark:bg-yellow-900/10 w-24 h-24 rounded-full group-hover:scale-150 transition-transform duration-500" />
          <h3 className="text-sm font-semibold text-foreground/60 mb-2 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary-yellow" />
            アライメント日数
          </h3>
          <p className="text-5xl font-black text-primary-yellow tracking-tighter">12<span className="text-xl text-foreground/40 ml-1 font-medium tracking-normal">日</span></p>
        </div>
        
        <div className="bg-white dark:bg-[#1c1310]/50 border border-orange-100 dark:border-orange-900/30 p-6 rounded-3xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 bg-pink-50 dark:bg-pink-900/10 w-24 h-24 rounded-full group-hover:scale-150 transition-transform duration-500" />
          <h3 className="text-sm font-semibold text-foreground/60 mb-2 flex items-center gap-2">
            <Star className="w-4 h-4 text-primary-pink" />
            叶った願望（スター）
          </h3>
          <p className="text-5xl font-black text-primary-pink tracking-tighter">3<span className="text-xl text-foreground/40 ml-1 font-medium tracking-normal">個</span></p>
        </div>
      </div>
      
      <div className="bg-white dark:bg-[#1c1310]/80 backdrop-blur-xl border border-orange-100 dark:border-orange-900/40 p-8 rounded-[2rem] shadow-sm">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h3 className="text-xl font-bold text-foreground mb-1">週間気分の周波数</h3>
            <p className="text-foreground/60 text-sm">過去7日間のあなたの波動の軌跡です。</p>
          </div>
          <button className="text-primary-orange text-sm font-medium hover:underline flex items-center">
            詳細を見る <ArrowUpRight className="w-4 h-4 ml-1" />
          </button>
        </div>
        
        <div className="h-48 flex items-end gap-2 md:gap-4 justify-between pt-4 border-b border-orange-100 dark:border-orange-900/30 pb-2">
          {alignData.map((data) => (
            <div key={data.day} className="flex flex-col items-center flex-1 group">
              <div className="w-full flex justify-center relative h-full items-end pb-2">
                <div 
                  className="w-full max-w-[3rem] bg-gradient-to-t from-orange-100 to-primary-orange dark:from-orange-900/40 dark:to-primary-orange rounded-t-xl transition-all duration-1000 ease-out group-hover:brightness-110"
                  style={{ height: `${data.val}%` }}
                >
                  <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-foreground text-background text-xs py-1 px-2 rounded-lg font-bold transition-opacity whitespace-nowrap">
                    {data.val}%
                  </div>
                </div>
              </div>
              <span className="text-xs font-semibold text-foreground/50 mt-2 tracking-wide">{data.day}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
