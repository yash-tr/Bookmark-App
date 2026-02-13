'use client'

import { createClient } from '@/lib/supabase/client'
import type { Bookmark } from '@/types/bookmark'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { BookmarkCard } from './BookmarkCard'
import { AddBookmarkForm } from './AddBookmarkForm'

interface BookmarkListProps {
  initialBookmarks: Bookmark[]
  userId: string
}

export function BookmarkList({ initialBookmarks, userId }: BookmarkListProps) {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(initialBookmarks)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    // Sync state with props when they change
    setBookmarks(initialBookmarks)
  }, [initialBookmarks])

  useEffect(() => {
    // Set up real-time subscription
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bookmarks',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          // Refresh the entire page data from the server
          router.refresh()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase, userId, router])

  const handleRefresh = () => {
    router.refresh()
  }

  return (
    <div className="space-y-8">
      {/* Add Bookmark Card */}
      <div className="bg-[#1a1b26] border border-white/10 rounded-2xl p-7 shadow-xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-white">Add New Bookmark</h3>
        </div>
        <AddBookmarkForm onAdd={handleRefresh} />
      </div>

      {/* Bookmarks List */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <h3 className="text-2xl font-semibold text-white">Your Bookmarks</h3>
            <span className="px-3 py-1 bg-purple-600/20 text-purple-400 text-sm font-medium rounded-full border border-purple-500/30">
              {bookmarks.length}
            </span>
          </div>
          <div className="flex items-center gap-2 text-base text-gray-400">
            <span className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse" />
            <span className="font-medium">Live</span>
          </div>
        </div>

        {bookmarks.length === 0 ? (
          <div className="text-center py-24 bg-[#1a1b26] border border-white/10 border-dashed rounded-2xl">
            <div className="w-24 h-24 bg-purple-600/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-purple-400" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </div>
            <h4 className="text-xl font-semibold text-white mb-3">No bookmarks yet</h4>
            <p className="text-base text-gray-400">
              Add your first bookmark above to get started
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {bookmarks.map((bookmark) => (
              <BookmarkCard
                key={bookmark.id}
                bookmark={bookmark}
                onDelete={handleRefresh}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
