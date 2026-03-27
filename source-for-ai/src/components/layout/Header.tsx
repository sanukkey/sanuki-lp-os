import { User, Bell, Menu } from "lucide-react";

export function Header() {
  return (
    <header className="h-16 border-b border-orange-100 dark:border-orange-950/40 bg-white/70 dark:bg-black/40 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between px-6">
      <div className="flex items-center text-primary-orange md:hidden">
        <Menu className="h-6 w-6 mr-3" />
        <span className="font-bold tracking-wide">Source</span>
      </div>
      <div className="hidden md:flex flex-1 items-center space-x-2">
        <h1 className="text-xl font-medium tracking-tight text-foreground opacity-90">Embrace the Vortex</h1>
      </div>
      <div className="flex items-center space-x-5">
        <button className="text-orange-300 hover:text-primary-orange transition-colors">
          <Bell className="h-5 w-5" />
        </button>
        <button className="h-8 w-8 rounded-full bg-gradient-to-tr from-primary-orange to-primary-pink flex items-center justify-center text-white shadow-sm ring-2 ring-white dark:ring-black">
          <User className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
}
