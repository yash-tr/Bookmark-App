# Deploy to Vercel - Complete Guide

## Step 1: Initialize Git Repository

```bash
cd "C:\Users\msi Katana\Desktop\astrabit"
git init
git add .
git commit -m "Initial commit: SmartBookmarks app"
```

## Step 2: Create GitHub Repository

### Option A: Using GitHub CLI
```bash
gh repo create smart-bookmarks --public --source=. --push
```

### Option B: Using GitHub Website
1. Go to https://github.com/new
2. Repository name: `smart-bookmarks`
3. Make it **Public** (required for submission)
4. Do NOT initialize with README (we already have one)
5. Click "Create repository"
6. Run these commands:
```bash
git remote add origin https://github.com/YOUR_USERNAME/smart-bookmarks.git
git branch -M main
git push -u origin main
```

## Step 3: Deploy to Vercel

### Option A: Using Vercel CLI (Recommended)
```bash
npm i -g vercel
vercel login
vercel --prod
```

When prompted:
- Set up and deploy? **Y**
- Which scope? (Select your account)
- Link to existing project? **N**
- Project name? `smart-bookmarks` (or press Enter)
- Directory? `.` (press Enter)
- Override settings? **N**

### Option B: Using Vercel Dashboard
1. Go to https://vercel.com/new
2. Import your GitHub repository
3. Click "Import"
4. Vercel will auto-detect Next.js settings
5. Click "Deploy" (will fail without env vars, but that's OK)

## Step 4: Add Environment Variables in Vercel

Go to: https://vercel.com/YOUR_USERNAME/smart-bookmarks/settings/environment-variables

Add these 3 variables:

| Name | Value |
|------|-------|
| `NEXT_PUBLIC_SITE_URL` | `https://smart-bookmarks.vercel.app` (or your actual Vercel URL) |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://gskoglgvkapnjvoyzpua.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIs...` (your anon key) |

**Important:** Set these for "Production" environment.

Click "Save" after each one.

## Step 5: Redeploy with Environment Variables

After adding env vars:
- Click "Deployments" tab
- Click the three dots (...) on the latest deployment
- Click "Redeploy"
- Check "Use existing Build Cache"
- Click "Redeploy"

## Step 6: Update OAuth Settings

### A. Get Your Vercel URL

After deployment completes, you'll see your live URL:
```
https://smart-bookmarks.vercel.app
```
(or similar - copy the exact URL)

### B. Update Supabase Settings

Go to: https://app.supabase.com/project/gskoglgvkapnjvoyzpua/auth/url-configuration

**Site URL:** Change to your Vercel URL:
```
https://smart-bookmarks.vercel.app
```

**Redirect URLs:** Add your production callback:
```
https://smart-bookmarks.vercel.app/auth/callback
```

Keep the localhost URL for local development:
```
http://localhost:3000/auth/callback
```

Click "Save"

### C. Update Google Cloud Console

Go to: https://console.cloud.google.com/apis/credentials

Click your OAuth 2.0 Client ID and add:

**Authorized JavaScript origins:**
```
https://smart-bookmarks.vercel.app
```

**Authorized redirect URIs:**
Keep the existing Supabase one, it works for both local and production.

Click "Save"

## Step 7: Test Your Deployment

1. Open your Vercel URL: https://smart-bookmarks.vercel.app
2. Click "Continue with Google"
3. Sign in with your Google account
4. Add a bookmark
5. Open in another tab/browser and verify real-time sync works

## Step 8: Get Your Submission URLs

### Live Vercel URL:
```
https://smart-bookmarks.vercel.app
```

### GitHub Repo:
```
https://github.com/YOUR_USERNAME/smart-bookmarks
```

## Troubleshooting

### OAuth fails on Vercel but works locally
- Verify NEXT_PUBLIC_SITE_URL is set to your Vercel URL (not localhost)
- Check Google Console has your Vercel URL in authorized origins
- Check Supabase Site URL is set to your Vercel URL

### Environment variables not loading
- Make sure they're set for "Production" environment
- Redeploy after adding env vars
- Check the deployment logs for errors

### Real-time doesn't work
- Verify Realtime is enabled in Supabase (Database → Replication)
- Check browser console for WebSocket errors
- Supabase free tier has connection limits (should be fine for testing)

## Quick Commands Reference

```bash
# Deploy
vercel --prod

# Check deployment status
vercel ls

# View logs
vercel logs

# Update environment variables (interactive)
vercel env add NEXT_PUBLIC_SITE_URL production
```

## Final Checklist

- [ ] Code pushed to GitHub (public repo)
- [ ] Deployed to Vercel successfully
- [ ] Environment variables set in Vercel
- [ ] Supabase Site URL updated to Vercel URL
- [ ] Supabase Redirect URLs includes Vercel callback
- [ ] Google Console has Vercel URL in authorized origins
- [ ] OAuth sign-in works on production
- [ ] Bookmarks can be added and deleted
- [ ] Real-time sync works across tabs
- [ ] README.md is complete with problems/solutions

## Your Submission

**Live URL:** https://smart-bookmarks.vercel.app  
**GitHub:** https://github.com/YOUR_USERNAME/smart-bookmarks  
**README:** Includes problems encountered and solutions
