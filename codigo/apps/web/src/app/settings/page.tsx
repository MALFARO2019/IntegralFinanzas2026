"use client"

import { Moon, Sun, Globe, DollarSign, Bell, Shield, ChevronRight, LogOut } from 'lucide-react'
import { useTheme } from 'next-themes'
import { usePreferences } from '@/lib/preferences-context'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

type Currency = 'CRC' | 'USD' | 'EUR'
type Language = 'es-CR' | 'en-US'

const CURRENCIES: { value: Currency; label: string; symbol: string }[] = [
    { value: 'CRC', label: 'Colón CR', symbol: '₡' },
    { value: 'USD', label: 'Dólar US', symbol: '$' },
    { value: 'EUR', label: 'Euro', symbol: '€' },
]

const LANGUAGES: { value: Language; label: string }[] = [
    { value: 'es-CR', label: 'Español (CR)' },
    { value: 'en-US', label: 'English (US)' },
]

export default function SettingsPage() {
    const { theme, setTheme } = useTheme()
    const { currency, setCurrency, language, setLanguage } = usePreferences()
    const router = useRouter()

    const isDark = theme === 'dark'

    const handleLogout = async () => {
        const supabase = createClient()
        await supabase.auth.signOut()
        router.push('/login')
        router.refresh()
    }

    return (
        <div className="flex flex-col min-h-screen pb-24 lg:pb-0">

            <div className="sticky top-0 z-30 bg-background/90 backdrop-blur-lg border-b border-border/50 px-4 pt-4 pb-3">
                <h1 className="text-xl font-extrabold">Ajustes</h1>
                <p className="text-xs text-muted-foreground">Personaliza tu experiencia</p>
            </div>

            <div className="px-4 py-5 space-y-6">

                {/* Apariencia */}
                <section>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider px-1 mb-2">Apariencia</p>
                    <div className="bg-card border border-border/40 rounded-2xl overflow-hidden divide-y divide-border/30">

                        {/* Tema */}
                        <div className="flex items-center justify-between px-4 py-3.5">
                            <div className="flex items-center gap-3">
                                {isDark ? <Moon size={18} className="text-primary" /> : <Sun size={18} className="text-amber-400" />}
                                <div>
                                    <p className="text-sm font-semibold">Tema Visual</p>
                                    <p className="text-xs text-muted-foreground">{isDark ? 'Modo oscuro activo' : 'Modo claro activo'}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setTheme(isDark ? 'light' : 'dark')}
                                className={`relative w-12 h-6 rounded-full transition-all duration-300 ${isDark ? 'bg-primary' : 'bg-secondary'}`}
                            >
                                <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all duration-300 ${isDark ? 'left-6' : 'left-0.5'}`} />
                            </button>
                        </div>

                    </div>
                </section>

                {/* Preferencias */}
                <section>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider px-1 mb-2">Preferencias</p>
                    <div className="bg-card border border-border/40 rounded-2xl overflow-hidden divide-y divide-border/30">

                        {/* Moneda */}
                        <div className="flex items-center justify-between px-4 py-3.5">
                            <div className="flex items-center gap-3">
                                <DollarSign size={18} className="text-accent" />
                                <div>
                                    <p className="text-sm font-semibold">Moneda</p>
                                    <p className="text-xs text-muted-foreground">Para formatear los montos</p>
                                </div>
                            </div>
                            <div className="flex gap-1">
                                {CURRENCIES.map(c => (
                                    <button
                                        key={c.value}
                                        onClick={() => setCurrency(c.value)}
                                        className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all ${currency === c.value
                                                ? 'bg-primary text-primary-foreground'
                                                : 'bg-secondary text-muted-foreground hover:text-foreground'
                                            }`}
                                    >
                                        {c.symbol}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Idioma */}
                        <div className="flex items-center justify-between px-4 py-3.5">
                            <div className="flex items-center gap-3">
                                <Globe size={18} className="text-primary" />
                                <div>
                                    <p className="text-sm font-semibold">Idioma</p>
                                    <p className="text-xs text-muted-foreground">Formato de fechas y números</p>
                                </div>
                            </div>
                            <div className="flex gap-1">
                                {LANGUAGES.map(l => (
                                    <button
                                        key={l.value}
                                        onClick={() => setLanguage(l.value as Language)}
                                        className={`px-2.5 py-1.5 rounded-xl text-[11px] font-bold transition-all ${language === l.value
                                                ? 'bg-primary text-primary-foreground'
                                                : 'bg-secondary text-muted-foreground hover:text-foreground'
                                            }`}
                                    >
                                        {l.value === 'es-CR' ? 'ES' : 'EN'}
                                    </button>
                                ))}
                            </div>
                        </div>

                    </div>
                </section>

                {/* Notificaciones y Seguridad (placeholders) */}
                <section>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider px-1 mb-2">Sistema</p>
                    <div className="bg-card border border-border/40 rounded-2xl overflow-hidden divide-y divide-border/30">
                        {[
                            { icon: Bell, label: 'Notificaciones', desc: 'Alertas de pagos próximos' },
                            { icon: Shield, label: 'Privacidad y Seguridad', desc: 'Gestión de tu cuenta' },
                        ].map(({ icon: Icon, label, desc }) => (
                            <div key={label} className="flex items-center gap-3 px-4 py-3.5 hover:bg-secondary/30 transition-colors cursor-pointer">
                                <Icon size={18} className="text-muted-foreground" />
                                <div className="flex-1">
                                    <p className="text-sm font-semibold">{label}</p>
                                    <p className="text-xs text-muted-foreground">{desc}</p>
                                </div>
                                <ChevronRight size={16} className="text-muted-foreground" />
                            </div>
                        ))}
                    </div>
                </section>

                {/* Info App */}
                <section>
                    <div className="bg-card border border-border/40 rounded-2xl p-4 text-center">
                        <p className="text-lg font-extrabold"><span className="text-primary">Integral</span> Finanzas</p>
                        <p className="text-xs text-muted-foreground mt-0.5">v0.1.0 — MVP 2026</p>
                        <p className="text-[10px] text-muted-foreground mt-2">Proyección y Control Financiero Avanzado</p>
                    </div>
                </section>

                {/* Cerrar Sesión */}
                <section>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 py-3.5 bg-destructive/10 border border-destructive/20 text-destructive rounded-2xl font-semibold text-sm hover:bg-destructive/20 transition-all"
                    >
                        <LogOut size={16} />
                        Cerrar Sesión
                    </button>
                </section>

            </div>
        </div>
    )
}
