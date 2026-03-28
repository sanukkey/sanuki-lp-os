'use client';

const SCALE = [
  { num: 1,  ja: "喜び・感謝・自由・愛",         en: "Joy / Love / Freedom",      hex: "#FF6B00" },
  { num: 2,  ja: "情熱",                          en: "Passion",                   hex: "#FF8C00" },
  { num: 3,  ja: "熱意・積極性・幸福",            en: "Enthusiasm / Happiness",    hex: "#FFA500" },
  { num: 4,  ja: "ポジティブな期待・確信",        en: "Positive Expectation",      hex: "#FFB700" },
  { num: 5,  ja: "楽観",                          en: "Optimism",                  hex: "#FFC900" },
  { num: 6,  ja: "希望",                          en: "Hopefulness",               hex: "#FFD700" },
  { num: 7,  ja: "満足",                          en: "Contentment",               hex: "#C8E06E" },
  { num: 8,  ja: "退屈",                          en: "Boredom",                   hex: "#96D68A" },
  { num: 9,  ja: "悲観",                          en: "Pessimism",                 hex: "#5EC8A0" },
  { num: 10, ja: "不満・イライラ・焦り",          en: "Frustration / Irritation",  hex: "#3BB8B0" },
  { num: 11, ja: "圧倒感・やる気のなさ",          en: "Overwhelment",              hex: "#2EA8C0" },
  { num: 12, ja: "失望",                          en: "Disappointment",            hex: "#2898C8" },
  { num: 13, ja: "疑い",                          en: "Doubt",                     hex: "#2882CC" },
  { num: 14, ja: "心配",                          en: "Worry",                     hex: "#3070C4" },
  { num: 15, ja: "責め（自分・他人）",            en: "Blame",                     hex: "#4060B8" },
  { num: 16, ja: "落胆",                          en: "Discouragement",            hex: "#5050A8" },
  { num: 17, ja: "怒り",                          en: "Anger",                     hex: "#643090" },
  { num: 18, ja: "復讐心",                        en: "Revenge",                   hex: "#701878" },
  { num: 19, ja: "憎しみ・激怒",                  en: "Hatred / Rage",             hex: "#780860" },
  { num: 20, ja: "嫉妬",                          en: "Jealousy",                  hex: "#7C0848" },
  { num: 21, ja: "不安・罪悪感・無価値感",        en: "Insecurity / Guilt",        hex: "#7A0830" },
  { num: 22, ja: "恐怖・絶望・無力感",            en: "Fear / Despair",            hex: "#6B0818" },
];

export default function ScalePage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">感情の22段階スケール</h1>
        <p className="text-foreground/70 text-base leading-relaxed">
          1が最高波動、22が最低波動。目標は「一段階だけ上へ」。一気に飛ばす必要はありません。
        </p>
      </div>

      <div className="space-y-2">
        {SCALE.map(({ num, ja, en, hex }) => (
          <div
            key={num}
            className="flex items-center gap-3 rounded-2xl px-4 py-3 transition-all hover:scale-[1.02] cursor-default"
            style={{ backgroundColor: `${hex}18`, borderLeft: `4px solid ${hex}` }}
          >
            <span
              className="text-xl font-black w-8 shrink-0 text-right tabular-nums"
              style={{ color: hex }}
            >
              {num}
            </span>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-foreground leading-snug">{ja}</p>
              <p className="text-xs text-foreground/50 mt-0.5">{en}</p>
            </div>
            <div
              className="w-3 h-3 rounded-full shrink-0"
              style={{ backgroundColor: hex }}
            />
          </div>
        ))}
      </div>

      <p className="text-center text-xs text-foreground/40 pb-4">
        Abraham-Hicks の「感情のガイダンスシステム」より
      </p>
    </div>
  );
}
