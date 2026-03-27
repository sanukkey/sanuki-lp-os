import { login, signup } from './actions'
import { Sparkles } from 'lucide-react'

export default function LoginPage({ searchParams }: { searchParams: { message: string } }) {
  return (
    <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2 min-h-screen mx-auto">
      <div className="flex justify-center mb-8">
        <div className="p-3 bg-white/50 dark:bg-black/20 backdrop-blur-xl rounded-2xl shadow-xl shadow-orange-500/10 border border-orange-100 dark:border-orange-900/30">
          <Sparkles className="w-10 h-10 text-primary-orange" />
        </div>
      </div>

      <form className="animate-in flex-1 flex flex-col w-full justify-center gap-2 text-foreground">
        <h1 className="text-2xl font-semibold text-center mb-6">Connect to The Source</h1>
        
        <label className="text-sm font-medium opacity-80" htmlFor="email">
          Email
        </label>
        <input
          className="rounded-xl px-4 py-3 bg-white dark:bg-[#1c1310] border border-orange-100 dark:border-orange-900/40 mb-4 focus:ring-2 focus:ring-primary-orange focus:outline-none transition-all"
          name="email"
          placeholder="you@example.com"
          required
        />
        
        <label className="text-sm font-medium opacity-80" htmlFor="password">
          Password
        </label>
        <input
          className="rounded-xl px-4 py-3 bg-white dark:bg-[#1c1310] border border-orange-100 dark:border-orange-900/40 mb-6 focus:ring-2 focus:ring-primary-orange focus:outline-none transition-all"
          type="password"
          name="password"
          placeholder="••••••••"
          required
        />
        
        <div className="flex flex-col gap-3">
          <button formAction={login} className="bg-gradient-to-r from-primary-orange to-primary-pink rounded-xl px-4 py-3 text-white font-medium hover:shadow-lg hover:shadow-orange-500/30 transition-all hover:-translate-y-0.5">
            Sign In
          </button>
          <button formAction={signup} className="border border-orange-200 dark:border-orange-800 rounded-xl px-4 py-3 text-foreground mb-4 hover:bg-orange-50 dark:hover:bg-orange-950/30 transition-all">
            Create Account
          </button>
        </div>

        {searchParams?.message && (
          <p className="mt-4 p-4 bg-orange-100/50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 text-center rounded-xl text-sm">
            {searchParams.message}
          </p>
        )}
      </form>
    </div>
  )
}
