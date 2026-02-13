import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { SignOutButton } from '@/components/SignOutButton'
import { BookmarkList } from '@/components/BookmarkList'
import type { Bookmark } from '@/types/bookmark'

export default async function Dashboard() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/')
  }

  // Fetch initial bookmarks
  const { data: bookmarks } = await supabase
    .from('bookmarks')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen relative">
      {/* Header */}
      <header className="border-b border-white/10 sticky top-0 backdrop-blur-xl bg-[#0a0a0f]/90 z-50">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight">SmartBookmarks</h1>
          </div>
          
          <div className="flex items-center gap-4">
            {user.user_metadata.avatar_url && (
              <img
                src={user.user_metadata.avatar_url}
                alt={user.user_metadata.full_name || 'User'}
                className="w-8 h-8 rounded-full border-2 border-purple-500/30 ring-2 ring-white/5"
              />
            )}
            <SignOutButton />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-6 py-10">
        {/* Welcome Section */}
        <div className="mb-12">
          <h2 className="text-5xl font-bold tracking-tight text-white mb-4">
            Welcome back, {user.user_metadata.full_name?.split(' ')[0] || 'there'}
          </h2>
          <p className="text-lg text-gray-400">
            Manage your bookmarks with real-time sync
          </p>
        </div>

        <BookmarkList 
          initialBookmarks={(bookmarks as Bookmark[]) || []} 
          userId={user.id} 
        />
      </main>
    </div>
  )
}
