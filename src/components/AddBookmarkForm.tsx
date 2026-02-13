'use client'

import { addBookmark } from '@/app/actions/bookmarks'
import { useState } from 'react'

interface AddBookmarkFormProps {
  onAdd?: () => void
}

export function AddBookmarkForm({ onAdd }: AddBookmarkFormProps) {
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const result = await addBookmark({ title, url })
      
      if (result.error) {
        setError(result.error)
      } else {
        setTitle('')
        setUrl('')
        onAdd?.()
      }
    } catch (err) {
      setError('Failed to add bookmark')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter title"
          required
          className="flex-1 px-5 py-4 bg-[#0a0a0f] border border-white/10 rounded-xl text-white text-base placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500/50 transition-all duration-200"
        />
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com"
          required
          className="flex-1 px-5 py-4 bg-[#0a0a0f] border border-white/10 rounded-xl text-white text-base placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500/50 transition-all duration-200"
        />
        <button
          type="submit"
          disabled={isLoading || !title.trim() || !url.trim()}
          className="px-8 py-4 bg-gradient-to-r from-violet-600 to-purple-600 text-white text-base font-semibold rounded-xl hover:from-violet-500 hover:to-purple-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap shadow-lg shadow-purple-500/25"
        >
          {isLoading ? 'Adding...' : 'Add Bookmark'}
        </button>
      </div>
      {error && (
        <p className="text-base text-red-400 bg-red-500/10 px-4 py-3 rounded-xl border border-red-500/20">
          {error}
        </p>
      )}
    </form>
  )
}
