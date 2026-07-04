'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createSupabaseBrowserClient } from '@/lib/supabase-browser'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim() || !password) return

    setLoading(true)
    setError('')

    const supabase = createSupabaseBrowserClient()
    const { error: authError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    })

    if (authError) {
      setError('E-mail ou senha incorretos. Verifique e tente novamente.')
      setLoading(false)
      return
    }

    router.push('/')
    router.refresh()
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: '#f5f4f1' }}
    >
      <div className="w-full max-w-sm">

        {/* Logo / cabeçalho */}
        <div className="text-center mb-8">
          <div
            className="inline-flex items-center justify-center w-12 h-12 rounded mb-4"
            style={{ backgroundColor: '#1F2346' }}
          >
            <span className="text-white font-semibold text-lg">P</span>
          </div>
          <div className="text-xs font-medium tracking-widest uppercase text-gray-400 mb-1">
            PIPE OS
          </div>
          <div className="text-[#1F2346] font-semibold text-lg leading-tight">
            Vieira da Silva
            <br />
            <span style={{ color: '#DFA568' }}>Advocacia</span>
          </div>
        </div>

        {/* Card de login */}
        <div className="bg-white border border-gray-200 rounded p-8">
          <h2 className="text-sm font-medium text-[#1F2346] mb-6">
            Acesso ao sistema
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">
                E-mail
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com.br"
                required
                disabled={loading}
                className="w-full border border-gray-200 rounded px-3 py-2.5 text-sm text-gray-700 placeholder-gray-300 focus:outline-none focus:border-[#DFA568] transition-colors disabled:opacity-60"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">
                Senha
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                disabled={loading}
                className="w-full border border-gray-200 rounded px-3 py-2.5 text-sm text-gray-700 placeholder-gray-300 focus:outline-none focus:border-[#DFA568] transition-colors disabled:opacity-60"
              />
            </div>

            {error && (
              <div className="border border-red-200 bg-red-50 rounded px-3 py-2.5 text-xs text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !email.trim() || !password}
              className="w-full py-2.5 rounded text-sm font-medium text-white transition-opacity disabled:opacity-40 disabled:cursor-not-allowed mt-2"
              style={{ backgroundColor: '#DFA568' }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Entrando…
                </span>
              ) : (
                'Entrar'
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-gray-300 mt-6">
          Sistema interno — acesso restrito
        </p>
      </div>
    </div>
  )
}
