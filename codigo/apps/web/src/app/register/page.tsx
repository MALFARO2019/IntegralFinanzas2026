"use client"

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { Eye, EyeOff, Lock, Mail, User, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react'

export default function RegisterPage() {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirm, setConfirm] = useState('')
    const [showPass, setShowPass] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)

        if (password !== confirm) {
            setError('Las contraseñas no coinciden.')
            return
        }
        if (password.length < 8) {
            setError('La contraseña debe tener al menos 8 caracteres.')
            return
        }

        setLoading(true)
        const supabase = createClient()

        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { full_name: name },
                emailRedirectTo: `${window.location.origin}/auth/callback`,
            },
        })

        if (error) {
            setError(error.message)
        } else {
            setSuccess(true)
        }
        setLoading(false)
    }

    if (success) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center p-4">
                <div className="w-full max-w-sm text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent/15 mb-6">
                        <CheckCircle size={32} className="text-accent" />
                    </div>
                    <h2 className="text-xl font-extrabold mb-2">¡Cuenta creada!</h2>
                    <p className="text-muted-foreground text-sm mb-6">
                        Te enviamos un email de confirmación a <strong className="text-foreground">{email}</strong>.<br />
                        Haz clic en el enlace para activar tu cuenta.
                    </p>
                    <Link href="/login" className="inline-flex items-center gap-2 py-3 px-6 bg-primary text-primary-foreground rounded-2xl font-bold text-sm hover:bg-primary/90 transition-all">
                        Ir al Login
                    </Link>
                </div>
            </div>
        )
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
                    <p className="text-muted-foreground text-sm mt-1">Crea tu cuenta gratuita</p>
                </div>

                <div className="bg-card border border-border/50 rounded-3xl p-6 shadow-2xl shadow-black/20">
                    <h2 className="text-lg font-bold mb-5">Crear Cuenta</h2>

                    <form onSubmit={handleRegister} className="space-y-4">

                        {error && (
                            <div className="flex items-center gap-2 bg-destructive/10 border border-destructive/30 rounded-xl px-3 py-2.5 text-sm text-destructive">
                                <AlertCircle size={16} className="shrink-0" />
                                <span>{error}</span>
                            </div>
                        )}

                        {/* Nombre */}
                        <div>
                            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">Nombre</label>
                            <div className="flex items-center gap-2 bg-secondary/50 rounded-xl px-3 py-3 focus-within:ring-1 focus-within:ring-primary/50 transition-all">
                                <User size={16} className="text-muted-foreground shrink-0" />
                                <input
                                    type="text"
                                    placeholder="Tu nombre completo"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    required
                                    className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground/50"
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">Email</label>
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
                            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">Contraseña</label>
                            <div className="flex items-center gap-2 bg-secondary/50 rounded-xl px-3 py-3 focus-within:ring-1 focus-within:ring-primary/50 transition-all">
                                <Lock size={16} className="text-muted-foreground shrink-0" />
                                <input
                                    type={showPass ? 'text' : 'password'}
                                    placeholder="Mínimo 8 caracteres"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    required
                                    className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground/50"
                                />
                                <button type="button" onClick={() => setShowPass(!showPass)} className="text-muted-foreground hover:text-foreground">
                                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">Confirmar Contraseña</label>
                            <div className={`flex items-center gap-2 bg-secondary/50 rounded-xl px-3 py-3 focus-within:ring-1 focus-within:ring-primary/50 transition-all ${confirm && confirm !== password ? 'ring-1 ring-destructive/50' : ''}`}>
                                <Lock size={16} className="text-muted-foreground shrink-0" />
                                <input
                                    type={showPass ? 'text' : 'password'}
                                    placeholder="Repite tu contraseña"
                                    value={confirm}
                                    onChange={e => setConfirm(e.target.value)}
                                    required
                                    className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground/50"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3.5 bg-primary text-primary-foreground rounded-2xl font-bold text-sm hover:bg-primary/90 disabled:opacity-50 transition-all shadow-lg shadow-primary/20 mt-2"
                        >
                            {loading ? 'Creando cuenta...' : '🚀 Crear Cuenta Gratis'}
                        </button>

                    </form>
                </div>

                <p className="text-center text-sm text-muted-foreground mt-5">
                    ¿Ya tienes cuenta?{' '}
                    <Link href="/login" className="text-primary font-semibold hover:underline">
                        Iniciar Sesión
                    </Link>
                </p>

            </div>
        </div>
    )
}
