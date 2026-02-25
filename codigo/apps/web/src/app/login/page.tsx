"use client"

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Lock, Mail, TrendingUp, AlertCircle } from 'lucide-react'

export default function LoginPage() {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPass, setShowPass] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        const supabase = createClient()
        const { error } = await supabase.auth.signInWithPassword({ email, password })

        if (error) {
            setError(error.message === 'Invalid login credentials'
                ? 'Credenciales incorrectas. Verifica tu email y contraseña.'
                : error.message
            )
        } else {
            router.push('/')
            router.refresh()
        }
        setLoading(false)
    }

    const handleGoogleLogin = async () => {
        const supabase = createClient()
        await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: { redirectTo: `${window.location.origin}/auth/callback` },
        })
    }

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="w-full max-w-sm">

                {/* Brand */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/15 mb-4">
                        <TrendingUp size={28} className="text-primary" />
                    </div>
                    <h1 className="text-2xl font-extrabold">
                        <span className="text-primary">Integral</span> Finanzas
                    </h1>
                    <p className="text-muted-foreground text-sm mt-1">Tu control financiero personal</p>
                </div>

                {/* Card form */}
                <div className="bg-card border border-border/50 rounded-3xl p-6 shadow-2xl shadow-black/20">
                    <h2 className="text-lg font-bold mb-5">Iniciar Sesión</h2>

                    <form onSubmit={handleLogin} className="space-y-4">

                        {/* Error */}
                        {error && (
                            <div className="flex items-center gap-2 bg-destructive/10 border border-destructive/30 rounded-xl px-3 py-2.5 text-sm text-destructive">
                                <AlertCircle size={16} className="shrink-0" />
                                <span>{error}</span>
                            </div>
                        )}

                        {/* Email */}
                        <div>
                            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">
                                Email
                            </label>
                            <div className="flex items-center gap-2 bg-secondary/50 rounded-xl px-3 py-3 focus-within:ring-1 focus-within:ring-primary/50 transition-all">
                                <Mail size={16} className="text-muted-foreground shrink-0" />
                                <input
                                    type="email"
                                    placeholder="tu@email.com"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    required
                                    className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground/50"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <div className="flex items-center justify-between mb-1.5">
                                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                    Contraseña
                                </label>
                                <Link href="/register" className="text-xs text-primary hover:underline">
                                    ¿Olvidaste tu contraseña?
                                </Link>
                            </div>
                            <div className="flex items-center gap-2 bg-secondary/50 rounded-xl px-3 py-3 focus-within:ring-1 focus-within:ring-primary/50 transition-all">
                                <Lock size={16} className="text-muted-foreground shrink-0" />
                                <input
                                    type={showPass ? 'text' : 'password'}
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    required
                                    className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground/50"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPass(!showPass)}
                                    className="text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3.5 bg-primary text-primary-foreground rounded-2xl font-bold text-sm hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-primary/20 mt-2"
                        >
                            {loading ? 'Verificando...' : 'Iniciar Sesión'}
                        </button>

                    </form>

                    {/* Divider */}
                    <div className="flex items-center gap-3 my-4">
                        <div className="flex-1 h-px bg-border/50" />
                        <span className="text-xs text-muted-foreground">o continúa con</span>
                        <div className="flex-1 h-px bg-border/50" />
                    </div>

                    {/* Google OAuth */}
                    <button
                        onClick={handleGoogleLogin}
                        className="w-full py-3 flex items-center justify-center gap-2.5 bg-secondary hover:bg-secondary/80 rounded-2xl text-sm font-semibold transition-all border border-border/50"
                    >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                        </svg>
                        Continuar con Google
                    </button>

                </div>

                {/* Link a registro */}
                <p className="text-center text-sm text-muted-foreground mt-5">
                    ¿No tienes cuenta?{' '}
                    <Link href="/register" className="text-primary font-semibold hover:underline">
                        Regístrate gratis
                    </Link>
                </p>

            </div>
        </div>
    )
}
