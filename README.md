# SmartBookmarks 📑

A beautiful, real-time bookmark manager built with Next.js, Supabase, and Tailwind CSS.

![SmartBookmarks](https://img.shields.io/badge/Next.js-15-black?logo=next.js)
![Supabase](https://img.shields.io/badge/Supabase-Auth%20%2B%20Database%20%2B%20Realtime-green?logo=supabase)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4-blue?logo=tailwindcss)

## 🌟 Live Demo

**[Live URL]**: [link](https://bookmark-app-ruby.vercel.app/)

## ✨ Features

- **Google OAuth Authentication** - Secure sign-in with Google (no email/password)
- **Personal Bookmarks** - Each user has their own private collection
- **Real-time Sync** - Changes appear instantly across all open tabs
- **Beautiful UI** - Modern, responsive design with smooth animations
- **Delete Bookmarks** - Remove unwanted bookmarks with one click

## 🛠 Tech Stack

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS 4
- **Backend**: Supabase (Auth, PostgreSQL Database, Realtime)
- **Deployment**: Vercel

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- A Supabase account (free tier works)
- A Google Cloud Console project (for OAuth)

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/smart-bookmarks.git
cd smart-bookmarks
npm install
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the schema from `supabase/schema.sql`:

```sql
-- Create bookmarks table
CREATE TABLE IF NOT EXISTS public.bookmarks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create indexes
CREATE INDEX IF NOT EXISTS bookmarks_user_id_idx ON public.bookmarks(user_id);
CREATE INDEX IF NOT EXISTS bookmarks_created_at_idx ON public.bookmarks(created_at DESC);

-- Enable Row Level Security
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view own bookmarks" ON public.bookmarks
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own bookmarks" ON public.bookmarks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own bookmarks" ON public.bookmarks
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can update own bookmarks" ON public.bookmarks
  FOR UPDATE USING (auth.uid() = user_id);

-- Enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.bookmarks;

-- Grant permissions
GRANT ALL ON public.bookmarks TO authenticated;
GRANT ALL ON public.bookmarks TO service_role;
```

3. Enable **Realtime** for the bookmarks table:
   - Go to **Database** → **Replication**
   - Toggle ON for the `bookmarks` table

### 3. Set Up Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select an existing one
3. Go to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth 2.0 Client IDs**
5. Configure the consent screen:
   - User Type: External
   - Add your app name and email
6. Create OAuth Client:
   - Application type: Web application
   - Authorized JavaScript origins:
     - `http://localhost:3000` (development)
     - `https://your-app.vercel.app` (production)
   - Authorized redirect URIs:
     - `http://localhost:3000/auth/callback` (development)
     - `https://your-project-ref.supabase.co/auth/v1/callback` (Supabase)
     - `https://your-app.vercel.app/auth/callback` (production)

7. In Supabase Dashboard:
   - Go to **Authentication** → **Providers**
   - Enable **Google**
   - Add your Google Client ID and Client Secret

### 4. Configure Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

Get these values from **Supabase Dashboard** → **Settings** → **API**

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📦 Deployment to Vercel

### Option 1: Deploy via Vercel CLI

```bash
npm i -g vercel
vercel login
vercel --prod
```

### Option 2: Deploy via GitHub

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and import your repository
3. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy!

### Post-Deployment

Update your OAuth redirect URIs in both Google Cloud Console and Supabase to include your Vercel URL:
- `https://your-app.vercel.app/auth/callback`

## 🐛 Problems I Ran Into & Solutions

### 1. Real-time Updates Not Working

**Problem**: After adding a bookmark, it wouldn't appear in other tabs automatically.

**Solution**: 
- Enabled Realtime replication for the `bookmarks` table in Supabase Dashboard
- Added the `ALTER PUBLICATION supabase_realtime ADD TABLE public.bookmarks;` SQL command
- Made sure to filter realtime events by `user_id` to respect privacy

### 2. OAuth Redirect Issues in Production

**Problem**: Google OAuth worked locally but failed on Vercel with redirect mismatch errors.

**Solution**:
- Added all possible redirect URIs to Google Cloud Console (localhost, Supabase callback, and Vercel URL)
- Used `x-forwarded-host` header detection in the callback to handle Vercel's proxy
- Made sure the Supabase redirect URL in the auth settings matched exactly

### 3. Row Level Security (RLS) Blocking Inserts

**Problem**: After enabling RLS, users couldn't add bookmarks - got "permission denied" errors.

**Solution**:
- The INSERT policy needed `WITH CHECK` instead of `USING`
- Made sure `auth.uid()` matched the `user_id` being inserted
- Verified the user was properly authenticated before insert operations

### 4. Middleware Session Refresh

**Problem**: Sessions would expire and users would get randomly logged out.

**Solution**:
- Implemented proper middleware to refresh the auth token on every request
- Used `@supabase/ssr` package for proper cookie handling in Next.js App Router
- Made sure all server components used the server client with cookie access

### 5. Duplicate Bookmarks in Real-time Updates

**Problem**: Sometimes the same bookmark would appear twice when adding.

**Solution**:
- Added a check in the realtime handler to prevent duplicates:
  ```typescript
  if (prev.some((b) => b.id === newBookmark.id)) {
    return prev
  }
  ```
- The server action also refreshes the page, so we needed to dedupe

### 6. Environment Variables Not Loading

**Problem**: Supabase client threw "Invalid URL" errors.

**Solution**:
- Environment variables in Next.js must be prefixed with `NEXT_PUBLIC_` to be available in the browser
- Made sure `.env.local` was not committed to git but environment variables were set in Vercel

## 📁 Project Structure

```
smart-bookmarks/
├── src/
│   ├── app/
│   │   ├── actions/          # Server actions
│   │   │   ├── auth.ts       # Sign in/out actions
│   │   │   └── bookmarks.ts  # CRUD operations
│   │   ├── auth/
│   │   │   ├── callback/     # OAuth callback handler
│   │   │   └── auth-code-error/
│   │   ├── dashboard/        # Protected dashboard page
│   │   ├── globals.css       # Global styles
│   │   ├── layout.tsx        # Root layout
│   │   └── page.tsx          # Landing page
│   ├── components/
│   │   ├── AddBookmarkForm.tsx
│   │   ├── BookmarkCard.tsx
│   │   ├── BookmarkList.tsx  # Real-time list
│   │   ├── GoogleSignInButton.tsx
│   │   └── SignOutButton.tsx
│   ├── lib/
│   │   └── supabase/
│   │       ├── client.ts     # Browser client
│   │       ├── middleware.ts # Session refresh
│   │       └── server.ts     # Server client
│   ├── types/
│   │   └── bookmark.ts       # TypeScript types
│   └── middleware.ts         # Route protection
├── supabase/
│   └── schema.sql            # Database schema
├── env.example               # Environment template
└── README.md
```

## 🔒 Security

- **Row Level Security (RLS)**: Each user can only access their own bookmarks
- **OAuth Only**: No password storage - authentication handled by Google
- **Server Actions**: All database operations go through authenticated server actions
- **Input Validation**: URL validation before saving bookmarks

## 📝 License

MIT License - feel free to use this project as a starting point for your own apps!

---

Built with ❤️ using [Next.js](https://nextjs.org), [Supabase](https://supabase.com), and [Tailwind CSS](https://tailwindcss.com)
