'use client'

import { signOut } from '@/app/actions/auth'
import { useState } from 'react'

export function SignOutButton() {
  const [isLoading, setIsLoading] = useState(false)

  const handleSignOut = async () => {
    setIsLoading(true)
    try {
      await signOut()
    } catch (error) {
      console.error('Sign out error:', error)
      setIsLoading(false)
    }
  }

  return (
    <button
      onClick={handleSignOut}
      disabled={isLoading}
      className="px-5 py-2 text-base font-medium text-gray-300 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200 disabled:opacity-50 border border-white/10 hover:border-white/20"
    >
      {isLoading ? 'Signing out...' : 'Sign out'}
    </button>
  )
}
