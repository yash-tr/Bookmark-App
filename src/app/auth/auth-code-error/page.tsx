import Link from 'next/link'

export default function AuthCodeError() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="text-center p-8 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 max-w-md">
        <div className="text-6xl mb-4">😕</div>
        <h1 className="text-2xl font-bold text-white mb-4">
          Authentication Error
        </h1>
        <p className="text-gray-300 mb-6">
          Something went wrong during the sign-in process. Please try again.
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-violet-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-violet-500/25"
        >
          Back to Home
        </Link>
      </div>
    </div>
  )
}
