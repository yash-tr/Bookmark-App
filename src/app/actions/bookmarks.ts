'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { BookmarkInsert } from '@/types/bookmark'

export async function addBookmark(data: BookmarkInsert) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { error: 'Not authenticated' }
  }

  // Validate URL
  try {
    new URL(data.url)
  } catch {
    return { error: 'Invalid URL format' }
  }

  const { error } = await supabase
    .from('bookmarks')
    .insert({
      user_id: user.id,
      title: data.title.trim(),
      url: data.url.trim(),
    })

  if (error) {
    console.error('Insert error:', error)
    return { error: error.message }
  }

  revalidatePath('/dashboard')
  return { success: true }
}

export async function deleteBookmark(id: string) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { error: 'Not authenticated' }
  }

  const { error } = await supabase
    .from('bookmarks')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id) // Ensure user can only delete their own bookmarks

  if (error) {
    console.error('Delete error:', error)
    return { error: error.message }
  }

  revalidatePath('/dashboard')
  return { success: true }
}

export async function getBookmarks() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { error: 'Not authenticated', data: [] }
  }

  const { data, error } = await supabase
    .from('bookmarks')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Fetch error:', error)
    return { error: error.message, data: [] }
  }

  return { data: data || [] }
}
