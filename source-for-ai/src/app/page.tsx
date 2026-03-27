import Link from "next/link";
import { Sparkles } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-orange-50 dark:to-orange-950/20 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] md:w-[800px] h-[600px] md:h-[800px] bg-gradient-to-tr from-primary-orange/20 to-primary-pink/20 rounded-full blur-3xl opacity-50 pointer-events-none animate-pulse" style={{ animationDuration: '4s' }} />
      
      <div className="z-10 text-center max-w-2xl mx-auto space-y-8">
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-white/50 dark:bg-black/20 backdrop-blur-xl rounded-2xl shadow-xl shadow-orange-500/10 border border-orange-100 dark:border-orange-900/30">
            <Sparkles className="w-16 h-16 text-primary-orange" />
          </div>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold text-foreground tracking-tight drop-shadow-sm">
          Source for AI
        </h1>
        <p className="text-xl md:text-2xl text-foreground/80 leading-relaxed font-light">
          Cosmic Wisdom. Intelligent Fusion. <br/> Expand your manifesting reality.
        </p>
        
        <div className="pt-8">
          <Link href="/dashboard" className="px-8 py-4 bg-gradient-to-r from-primary-orange to-primary-pink text-white rounded-full font-bold text-lg shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 transition-all hover:-translate-y-1 inline-block">
            Enter The Source
          </Link>
        </div>
      </div>
    </div>
  );
}
