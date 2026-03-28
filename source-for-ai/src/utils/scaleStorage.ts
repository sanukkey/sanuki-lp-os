const STORAGE_KEY = 'sfa_scale_log';

export type ScaleEntry = {
  date: string;  // YYYY-MM-DD
  scale: number; // 1〜22
};

export function saveScaleEntry(scale: number): void {
  if (typeof window === 'undefined') return;
  const today = new Date().toISOString().split('T')[0];
  const entries = getScaleEntries();
  const idx = entries.findIndex(e => e.date === today);
  if (idx >= 0) {
    entries[idx].scale = scale; // 当日は最新で上書き
  } else {
    entries.push({ date: today, scale });
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

export function getScaleEntries(): ScaleEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

export function getLast7DaysData(): { day: string; scale: number | null; date: string }[] {
  const entries = getScaleEntries();
  const DAY_LABELS = ['日', '月', '火', '水', '木', '金', '土'];
  const result = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const entry = entries.find(e => e.date === dateStr);
    result.push({
      day: DAY_LABELS[d.getDay()],
      scale: entry ? entry.scale : null,
      date: dateStr,
    });
  }
  return result;
}
