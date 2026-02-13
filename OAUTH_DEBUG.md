# OAuth Debugging Checklist

## Current Error
`bad_oauth_callback` - OAuth state parameter missing

This error means Supabase is rejecting the OAuth callback before it even reaches Google.

## Step-by-Step Verification

### 1. Environment Variables (CRITICAL)
Check your `.env.local` file has ALL THREE variables:

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=https://gskoglgvkapnjvoyzpua.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ... (starts with eyJ, NOT sb_)
```

**Action Required:**
- [ ] Verify NEXT_PUBLIC_SITE_URL is set
- [ ] Verify anon key starts with "eyJ"
- [ ] Restart dev server after any changes

### 2. Supabase URL Configuration
Go to: https://app.supabase.com/project/gskoglgvkapnjvoyzpua/auth/url-configuration

**Must have:**
- Site URL: `http://localhost:3000`
- Redirect URLs: `http://localhost:3000/auth/callback` (click "Add URL" if missing)

**Action Required:**
- [ ] Site URL matches exactly
- [ ] Redirect URL is added
- [ ] Click "Save" after changes

### 3. Supabase Google Provider
Go to: https://app.supabase.com/project/gskoglgvkapnjvoyzpua/auth/providers

Find "Google" (not Firebase/Clerk/etc):
- [ ] Enabled (toggle ON)
- [ ] Client ID filled in
- [ ] Client Secret filled in
- [ ] Save changes

### 4. Google Cloud Console - OAuth Client
Go to: https://console.cloud.google.com/apis/credentials

Find your OAuth 2.0 Client ID and click it.

**Authorized JavaScript origins:**
```
http://localhost:3000
```

**Authorized redirect URIs (ONLY THIS ONE):**
```
https://gskoglgvkapnjvoyzpua.supabase.co/auth/v1/callback
```

**Important:** Do NOT add `http://localhost:3000/auth/callback` to Google Console!

**Action Required:**
- [ ] JavaScript origin added
- [ ] Supabase callback URL added (NOT localhost callback)
- [ ] Save changes

### 5. Test OAuth Flow Manually

Open browser console (F12) and run:

```javascript
// Check if environment variables are loaded
console.log('Site URL:', process.env.NEXT_PUBLIC_SITE_URL)
console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
console.log('Anon Key starts with:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 5))
```

Expected output:
- Site URL: http://localhost:3000
- Supabase URL: https://gskoglgvkapnjvoyzpua.supabase.co
- Anon Key starts with: eyJhb

If any are "undefined", your .env.local is not being loaded.

---

## Most Common Causes

1. **NEXT_PUBLIC_SITE_URL not set** - OAuth will fail silently
2. **Redirect URL mismatch** - Supabase settings don't match code
3. **Wrong anon key format** - Using publishable key instead of JWT
4. **.env.local not loaded** - Need to restart dev server

## Quick Test

Run this in your project:

```bash
# Check if env vars are set
npm run dev

# Then open http://localhost:3000
# Open DevTools Console
# Type: window.location.origin
# Should show: http://localhost:3000
```
