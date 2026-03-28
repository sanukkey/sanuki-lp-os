'use client';

import { useEffect, useState } from 'react';
import { Activity, Star, Calendar, TrendingUp } from 'lucide-react';
import { getLast7DaysData } from '@/utils/scaleStorage';

type DayData = { day: string; scale: number | null; date: string };

const SCALE_COLORS = [
  '#FF6B00','#FF8C00','#FFA500','#FFB700','#FFC900','#FFD700',
  '#C8E06E','#96D68A','#5EC8A0','#3BB8B0','#2EA8C0','#2898C8',
  '#2882CC','#3070C4','#4060B8','#5050A8','#643090','#701878',
  '#780860','#7C0848','#7A0830','#6B0818',
];

function scaleColor(scale: number) {
  return SCALE_COLORS[Math.min(scale - 1, 21)];
}

function FrequencyChart({ data }: { data: DayData[] }) {
  const W = 700, H = 180, PX = 44, PY = 22;
  const cW = W - 2 * PX, cH = H - 2 * PY - 18; // 18 = bottom label space

  const pts = data.map((d, i) => {
    if (d.scale === null) return null;
    return {
      x: PX + (i / 6) * cW,
      y: PY + ((d.scale - 1) / 21) * cH,
      scale: d.scale,
    };
  });

  // Build SVG path (break on null gaps)
  let pathD = '';
  let inSeg = false;
  pts.forEach(p => {
    if (!p) { inSeg = false; return; }
    pathD += inSeg ? ` L ${p.x.toFixed(1)} ${p.y.toFixed(1)}` : `M ${p.x.toFixed(1)} ${p.y.toFixed(1)}`;
    inSeg = true;
  });

  const validPts = pts.filter(Boolean) as { x: number; y: number; scale: number }[];
  const hasData = validPts.length > 0;

  // Fill polygon (closed under chart bottom)
  let fillD = '';
  if (validPts.length >= 2) {
    const bottom = PY + cH;
    fillD = `${pathD} L ${validPts.at(-1)!.x.toFixed(1)} ${bottom} L ${validPts[0].x.toFixed(1)} ${bottom} Z`;
  }

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="relative pl-8">
      {/* Y-axis labels: 上=1（最高波動）, 下=22（最低）*/}
      <div className="absolute left-0 top-0 flex flex-col justify-between text-[10px] text-foreground/40 font-mono select-none pointer-events-none"
        style={{ height: H - 18, paddingTop: PY, paddingBottom: 0 }}>
        <span>1</span>
        <span>11</span>
        <span>22</span>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 192 }} aria-label="週間感情スケールグラフ">
        <defs>
          <linearGradient id="lgLine" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"   stopColor="#FF6B00" />
            <stop offset="50%"  stopColor="#3BB8B0" />
            <stop offset="100%" stopColor="#643090" />
          </linearGradient>
          <linearGradient id="lgFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#FF6B00" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#FF6B00" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Horizontal guide lines at scale 1 / 11 / 22 */}
        {[1, 11, 22].map(s => {
          const y = PY + ((s - 1) / 21) * cH;
          return <line key={s} x1={PX} y1={y} x2={W - PX} y2={y}
            stroke="currentColor" strokeOpacity="0.07" strokeWidth="1" strokeDasharray="4 4" />;
        })}

        {/* Area fill */}
        {fillD && <path d={fillD} fill="url(#lgFill)" />}

        {/* Line */}
        {pathD && <path d={pathD} fill="none" stroke="url(#lgLine)"
          strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />}

        {/* No-data ghost dots */}
        {!hasData && data.map((_, i) => {
          const x = PX + (i / 6) * cW;
          const y = PY + cH / 2;
          return <circle key={i} cx={x} cy={y} r={5} fill="currentColor" opacity="0.1" />;
        })}

        {/* Data dots + scale labels */}
        {pts.map((p, i) => {
          if (!p) return null;
          const isToday = data[i].date === today;
          return (
            <g key={i}>
              {isToday && (
                <circle cx={p.x} cy={p.y} r={12}
                  fill={scaleColor(p.scale)} opacity="0.15" />
              )}
              <circle cx={p.x} cy={p.y} r={6}
                fill={scaleColor(p.scale)} stroke="white" strokeWidth="2.5" />
              <text x={p.x} y={p.y - 13} textAnchor="middle"
                fontSize="11" fill={scaleColor(p.scale)} fontWeight="700">
                {p.scale}
              </text>
            </g>
          );
        })}

        {/* Day labels */}
        {data.map((d, i) => {
          const x = PX + (i / 6) * cW;
          const isToday = d.date === today;
          return (
            <text key={i} x={x} y={H - 2} textAnchor="middle"
              fontSize="12" fill="currentColor"
              opacity={isToday ? 1 : 0.4} fontWeight={isToday ? '700' : '500'}>
              {d.day}{isToday ? '（今日）' : ''}
            </text>
          );
        })}
      </svg>

      {/* No data message */}
      {!hasData && (
        <p className="absolute inset-0 flex items-center justify-center text-sm text-foreground/40 pointer-events-none pb-6">
          ✨ Oracleに話しかけると、ここに記録が始まります
        </p>
      )}
    </div>
  );
}

export default function DashboardPage() {
  const [chartData, setChartData] = useState<DayData[]>([]);
  const [latestScale, setLatestScale] = useState<number | null>(null);

  useEffect(() => {
    const data = getLast7DaysData();
    setChartData(data);
    const todayEntry = data.find(d => d.scale !== null && d.date === new Date().toISOString().split('T')[0]);
    if (todayEntry) setLatestScale(todayEntry.scale);
  }, []);

  const validScales = chartData.map(d => d.scale).filter((s): s is number => s !== null);
  const avgScale = validScales.length > 0
    ? Math.round(validScales.reduce((a, b) => a + b, 0) / validScales.length)
    : null;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Hero */}
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
            <p className="text-white/80 text-sm font-medium">今週の平均スケール</p>
            <p className="text-2xl font-bold">
              {avgScale ? `Lv.${avgScale}` : '記録なし'}
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-[#1c1310]/50 border border-orange-100 dark:border-orange-900/30 p-6 rounded-3xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 bg-orange-50 dark:bg-orange-900/10 w-24 h-24 rounded-full group-hover:scale-150 transition-transform duration-500" />
          <h3 className="text-sm font-semibold text-foreground/60 mb-2 flex items-center gap-2">
            <Activity className="w-4 h-4 text-primary-orange" />
            今日の感情スケール
          </h3>
          {latestScale ? (
            <p className="text-5xl font-black tracking-tighter" style={{ color: scaleColor(latestScale) }}>
              {latestScale}
              <span className="text-xl text-foreground/40 ml-1 font-medium tracking-normal">/ 22</span>
            </p>
          ) : (
            <p className="text-2xl font-bold text-foreground/30 mt-2">未記録</p>
          )}
        </div>

        <div className="bg-white dark:bg-[#1c1310]/50 border border-orange-100 dark:border-orange-900/30 p-6 rounded-3xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 bg-yellow-50 dark:bg-yellow-900/10 w-24 h-24 rounded-full group-hover:scale-150 transition-transform duration-500" />
          <h3 className="text-sm font-semibold text-foreground/60 mb-2 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary-yellow" />
            記録した日数
          </h3>
          <p className="text-5xl font-black text-primary-yellow tracking-tighter">
            {validScales.length}
            <span className="text-xl text-foreground/40 ml-1 font-medium tracking-normal">日</span>
          </p>
        </div>

        <div className="bg-white dark:bg-[#1c1310]/50 border border-orange-100 dark:border-orange-900/30 p-6 rounded-3xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 bg-pink-50 dark:bg-pink-900/10 w-24 h-24 rounded-full group-hover:scale-150 transition-transform duration-500" />
          <h3 className="text-sm font-semibold text-foreground/60 mb-2 flex items-center gap-2">
            <Star className="w-4 h-4 text-primary-pink" />
            週間最高スケール
          </h3>
          {validScales.length > 0 ? (
            <p className="text-5xl font-black text-primary-pink tracking-tighter">
              {Math.min(...validScales)}
              <span className="text-xl text-foreground/40 ml-1 font-medium tracking-normal">位</span>
            </p>
          ) : (
            <p className="text-2xl font-bold text-foreground/30 mt-2">未記録</p>
          )}
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white dark:bg-[#1c1310]/80 backdrop-blur-xl border border-orange-100 dark:border-orange-900/40 p-6 md:p-8 rounded-[2rem] shadow-sm">
        <div className="flex justify-between items-end mb-6">
          <div>
            <h3 className="text-xl font-bold text-foreground mb-1">週間気分の周波数</h3>
            <p className="text-foreground/60 text-sm">
              上ほど波動が高い（スケール1〜22）。Oracleに話しかけると自動記録されます。
            </p>
          </div>
        </div>
        {chartData.length > 0 && <FrequencyChart data={chartData} />}
      </div>
    </div>
  );
}
