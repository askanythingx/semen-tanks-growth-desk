'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleLogin() {
    if (!email || !password) return
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError('Incorrect email or password. Please try again.')
      setLoading(false)
    } else {
      router.replace('/')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center px-6 max-w-sm mx-auto">

      {/* Logo */}
      <div className="mb-10 text-center">
        <div className="w-14 h-14 bg-brand-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <span className="text-white font-bold text-xl">G</span>
        </div>
        <h1 className="text-2xl font-semibold text-gray-900">GrowthDesk</h1>
        <p className="text-sm text-gray-400 mt-1">SemenTanks.com — Internal</p>
      </div>

      {/* Form */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <div className="mb-4">
          <label className="text-sm font-medium text-gray-700 block mb-2">Email</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="you@sementanks.com"
            className="w-full text-base border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-brand-700 transition-all"
            autoCapitalize="none"
            autoComplete="email"
          />
        </div>
        <div className="mb-6">
          <label className="text-sm font-medium text-gray-700 block mb-2">Password</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full text-base border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-brand-700 transition-all"
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
          />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 mb-4 text-sm text-red-600">
            {error}
          </div>
        )}

        <button
          onClick={handleLogin}
          disabled={!email || !password || loading}
          className="w-full py-4 rounded-xl text-base font-semibold bg-brand-700 text-white disabled:opacity-30 active:bg-brand-900 transition-all">
          {loading ? 'Signing in...' : 'Sign in'}
        </button>
      </div>

      <p className="text-center text-xs text-gray-400 mt-6">
        Contact Smit to get access
      </p>
    </div>
  )
}
