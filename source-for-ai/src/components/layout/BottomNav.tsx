'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ListTodo, Radio, Sparkles, Image as ImageIcon, BookHeart } from "lucide-react";

const NAV_ITEMS = [
  { href: "/dashboard", icon: Home, label: "ホーム", color: "text-primary-orange" },
  { href: "/wishes", icon: ListTodo, label: "オーダー", color: "text-primary-yellow" },
  { href: "/oracle", icon: Sparkles, label: "Oracle", color: "text-primary-pink" },
  { href: "/frequencies", icon: Radio, label: "周波数", color: "text-primary-orange" },
  { href: "/journal", icon: BookHeart, label: "日記", color: "text-primary-pink" },
  { href: "/vision", icon: ImageIcon, label: "Vision", color: "text-primary-yellow" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white/90 dark:bg-[#170f0c]/90 backdrop-blur-md border-t border-orange-100 dark:border-orange-950 pb-safe">
      <div className="flex items-center justify-around h-16">
        {NAV_ITEMS.map(({ href, icon: Icon, label, color }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center justify-center gap-0.5 flex-1 h-full transition-all ${
                isActive ? color : "text-foreground/40"
              }`}
            >
              <Icon className={`h-5 w-5 ${isActive ? "scale-110" : ""} transition-transform`} />
              <span className="text-[10px] font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
