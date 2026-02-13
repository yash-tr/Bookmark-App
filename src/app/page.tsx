import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { GoogleSignInButton } from '@/components/GoogleSignInButton'

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen relative">
      <div className="max-w-5xl mx-auto px-6 py-20">
        <div className="flex flex-col items-center justify-center min-h-[80vh]">
          {/* Logo */}
          <div className="mb-10 flex items-center justify-center w-24 h-24 bg-purple-600 rounded-3xl shadow-2xl shadow-purple-500/30">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </div>
          
          {/* Hero Content */}
          <h1 className="text-5xl md:text-6xl font-semibold tracking-tight text-white mb-6 text-center">
            Organize your bookmarks
          </h1>
          
          <p className="text-lg text-gray-400 max-w-xl text-center mb-12">
            A modern bookmark manager with real-time sync. Save, organize, and access your links from anywhere.
          </p>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 w-full max-w-3xl">
            {[
              { title: 'Private & Secure', desc: 'Your bookmarks are yours alone' },
              { title: 'Real-time Sync', desc: 'Updates instantly across devices' },
              { title: 'Simple & Fast', desc: 'No clutter, just your links' },
            ].map((feature, i) => (
              <div
                key={i}
                className="p-5 rounded-xl bg-[#17171F] border border-white/5"
              >
                <h3 className="text-sm font-medium text-white mb-1">{feature.title}</h3>
                <p className="text-xs text-gray-400">{feature.desc}</p>
              </div>
            ))}
          </div>

          {/* Sign In Button */}
          <GoogleSignInButton />

          {/* Footer Note */}
          <p className="mt-6 text-sm text-gray-500">
            Sign in with your Google account to get started
          </p>
        </div>

        {/* Footer */}
        <footer className="text-center text-gray-600 text-xs mt-20">
          Built with Next.js, Supabase & Tailwind CSS
        </footer>
      </div>
    </div>
  )
}
