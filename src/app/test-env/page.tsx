export default function TestEnv() {
  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <h1 className="text-2xl font-bold mb-4">Environment Variables Test</h1>
      
      <div className="space-y-2 font-mono text-sm">
        <div className="p-4 bg-slate-800 rounded">
          <strong>NEXT_PUBLIC_SITE_URL:</strong>
          <br />
          {process.env.NEXT_PUBLIC_SITE_URL || '❌ NOT SET'}
        </div>
        
        <div className="p-4 bg-slate-800 rounded">
          <strong>NEXT_PUBLIC_SUPABASE_URL:</strong>
          <br />
          {process.env.NEXT_PUBLIC_SUPABASE_URL || '❌ NOT SET'}
        </div>
        
        <div className="p-4 bg-slate-800 rounded">
          <strong>NEXT_PUBLIC_SUPABASE_ANON_KEY:</strong>
          <br />
          {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY 
            ? `${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.substring(0, 20)}... (${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.length} chars)`
            : '❌ NOT SET'}
        </div>
        
        <div className="p-4 bg-slate-800 rounded">
          <strong>Expected Redirect URL:</strong>
          <br />
          {process.env.NEXT_PUBLIC_SITE_URL 
            ? `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`
            : '❌ CANNOT CONSTRUCT - SITE_URL NOT SET'}
        </div>
      </div>
      
      <div className="mt-8 p-4 bg-yellow-900/50 rounded border border-yellow-600">
        <h2 className="font-bold mb-2">⚠️ Requirements:</h2>
        <ul className="list-disc list-inside space-y-1">
          <li>NEXT_PUBLIC_SITE_URL must be set to http://localhost:3000</li>
          <li>NEXT_PUBLIC_SUPABASE_ANON_KEY must start with "eyJ"</li>
          <li>All three environment variables must be defined</li>
        </ul>
      </div>
    </div>
  )
}
