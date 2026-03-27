import Link from "next/link";
import { Home, ListTodo, Radio, Sparkles, Image as ImageIcon, BookHeart, Zap } from "lucide-react";

export function Sidebar() {
  return (
    <aside className="w-64 border-r border-orange-100 dark:border-orange-950 bg-sidebar-bg h-screen sticky top-0 flex flex-col hidden md:flex shrink-0">
      <div className="p-6 flex items-center space-x-3 text-primary-orange">
        <Sparkles className="h-8 w-8" />
        <span className="font-bold text-xl tracking-wide">Source for AI</span>
      </div>
      
      <nav className="flex-1 px-4 space-y-2 mt-4">
        <Link href="/dashboard" className="flex items-center space-x-3 px-3 py-2.5 rounded-xl hover:bg-orange-50 dark:hover:bg-orange-950/30 text-foreground transition-colors">
          <Home className="h-5 w-5 text-primary-orange" />
          <span className="font-medium">ボルテックストラッカー</span>
        </Link>
        <Link href="/wishes" className="flex items-center space-x-3 px-3 py-2.5 rounded-xl hover:bg-orange-50 dark:hover:bg-orange-950/30 text-foreground transition-colors">
          <ListTodo className="h-5 w-5 text-primary-yellow" />
          <span className="font-medium">宇宙へのオーダー</span>
        </Link>
        <Link href="/oracle" className="flex items-center space-x-3 px-3 py-2.5 rounded-xl hover:bg-orange-50 dark:hover:bg-orange-950/30 text-foreground transition-colors">
          <Sparkles className="h-5 w-5 text-primary-pink" />
          <span className="font-medium">The Source Oracle</span>
        </Link>
        <Link href="/frequencies" className="flex items-center space-x-3 px-3 py-2.5 rounded-xl hover:bg-orange-50 dark:hover:bg-orange-950/30 text-foreground transition-colors">
          <Radio className="h-5 w-5 text-primary-orange" />
          <span className="font-medium">安らぎの周波数</span>
        </Link>
        <Link href="/journal" className="flex items-center space-x-3 px-3 py-2.5 rounded-xl hover:bg-orange-50 dark:hover:bg-orange-950/30 text-foreground transition-colors">
          <BookHeart className="h-5 w-5 text-primary-pink" />
          <span className="font-medium">引き寄せ日記</span>
        </Link>
        <Link href="/vision" className="flex items-center space-x-3 px-3 py-2.5 rounded-xl hover:bg-orange-50 dark:hover:bg-orange-950/30 text-foreground transition-colors">
          <ImageIcon className="h-5 w-5 text-primary-yellow" />
          <span className="font-medium">Scenic Vision</span>
        </Link>
      </nav>

      <div className="p-4 border-t border-orange-100 dark:border-orange-950 space-y-3">
        <div className="bg-gradient-to-r from-primary-orange to-primary-pink rounded-xl p-4 text-white text-sm shadow-md shadow-orange-500/20">
          <p className="font-bold mb-1">Source Member</p>
          <p className="opacity-90 leading-tight">あなたはソースと繋がっています。</p>
        </div>
        <Link href="/subscribe" className="w-full py-2.5 px-4 rounded-xl bg-white dark:bg-[#2d1c15] border border-orange-200 dark:border-orange-900 text-primary-orange font-medium text-sm hover:shadow-md transition-all flex items-center justify-center gap-2">
          <Zap className="h-4 w-4" />
          プレミアムにアップグレード
        </Link>
      </div>
    </aside>
  );
}
