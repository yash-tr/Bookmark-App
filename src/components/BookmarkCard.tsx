'use client'

import { deleteBookmark } from '@/app/actions/bookmarks'
import type { Bookmark } from '@/types/bookmark'
import { useState } from 'react'

interface BookmarkCardProps {
  bookmark: Bookmark
  onDelete?: () => void
}

export function BookmarkCard({ bookmark, onDelete }: BookmarkCardProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!confirm('Delete this bookmark?')) return
    
    setIsDeleting(true)
    try {
      const result = await deleteBookmark(bookmark.id)
      if (result.error) {
        console.error(result.error)
      } else {
        onDelete?.()
      }
    } catch (error) {
      console.error('Delete error:', error)
    } finally {
      setIsDeleting(false)
    }
  }

  const getDomain = (url: string) => {
    try {
      return new URL(url).hostname.replace('www.', '')
    } catch {
      return url
    }
  }

  return (
    <div className="group relative p-6 bg-[#1a1b26] border border-white/10 rounded-2xl hover:border-purple-500/50 hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-200">
      <div className="flex items-start justify-between gap-4">
        <a
          href={bookmark.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 min-w-0"
        >
          <h3 className="text-lg font-semibold text-white truncate hover:text-purple-400 transition-colors duration-200 mb-3">
            {bookmark.title}
          </h3>
          <div className="flex items-center gap-3">
            <img
              src={`https://www.google.com/s2/favicons?domain=${getDomain(bookmark.url)}&sz=64`}
              alt=""
              className="w-6 h-6 rounded"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none'
              }}
            />
            <span className="text-base text-gray-400 truncate font-medium">
              {getDomain(bookmark.url)}
            </span>
          </div>
        </a>
        
        <div className="flex items-center gap-3">
          <a
            href={bookmark.url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 text-gray-400 hover:text-purple-400 hover:bg-purple-500/10 rounded-xl transition-all duration-200 border border-transparent hover:border-purple-500/30"
            title="Open link"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="p-3 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all duration-200 disabled:opacity-50 border border-transparent hover:border-red-500/30"
            title="Delete bookmark"
          >
            {isDeleting ? (
              <div className="w-6 h-6 border-2 border-gray-400/30 border-t-gray-400 rounded-full animate-spin" />
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
