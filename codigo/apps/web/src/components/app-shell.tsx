"use client"

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LayoutDashboard, ArrowLeftRight, CalendarDays, Wallet, Settings, LogOut, User } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'

const navItems = [
    { href: '/', label: 'Inicio', icon: LayoutDashboard },
    { href: '/transactions', label: 'Movimientos', icon: ArrowLeftRight },
    { href: '/calendar', label: 'Calendario', icon: CalendarDays },
    { href: '/accounts', label: 'Cuentas', icon: Wallet },
    { href: '/settings', label: 'Ajustes', icon: Settings },
]

export function AppShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const router = useRouter()
    const [userEmail, setUserEmail] = useState<string | null>(null)
    const [userName, setUserName] = useState<string | null>(null)

    useEffect(() => {
        const supabase = createClient()
        supabase.auth.getUser().then(({ data: { user } }) => {
            if (user) {
                setUserEmail(user.email ?? null)
                setUserName(user.user_metadata?.full_name ?? user.email?.split('@')[0] ?? null)
            }
        })
    }, [])

    const handleLogout = async () => {
        const supabase = createClient()
        await supabase.auth.signOut()
        router.push('/login')
        router.refresh()
    }

    // Obtener inicial del avatar
    const initials = userName
        ? userName.split(' ').map((n: string) => n[0]).slice(0, 2).join('').toUpperCase()
        : '?'

    return (
        <div className="flex min-h-screen bg-background">

            {/* ── Sidebar desktop (lg+) ── */}
            <aside className="hidden lg:flex flex-col w-60 border-r border-border/50 bg-card/60 backdrop-blur-lg shrink-0 sticky top-0 h-screen">
                {/* Logo */}
                <div className="px-6 py-6 border-b border-border/50">
                    <span className="text-lg font-extrabold tracking-tight">
                        <span className="text-primary">Integral</span> Finanzas
                    </span>
                    <p className="text-xs text-muted-foreground mt-0.5">2026</p>
                </div>

                {/* Nav */}
                <nav className="flex-1 px-3 py-4 space-y-1">
                    {navItems.map(({ href, label, icon: Icon }) => {
                        const isActive = pathname === href
                        return (
                            <Link
                                key={href}
                                href={href}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${isActive
                                        ? 'bg-primary/15 text-primary'
                                        : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                                    }`}
                            >
                                <Icon size={18} className={isActive ? 'text-primary' : ''} />
                                {label}
                            </Link>
                        )
                    })}
                </nav>

                {/* User info + Logout */}
                {userEmail && (
                    <div className="px-4 py-4 border-t border-border/50">
                        <div className="flex items-center gap-3 mb-3 px-1">
                            <div className="w-8 h-8 rounded-xl bg-primary/20 flex items-center justify-center text-xs font-bold text-primary shrink-0">
                                {initials}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold truncate">{userName}</p>
                                <p className="text-[10px] text-muted-foreground truncate">{userEmail}</p>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all"
                        >
                            <LogOut size={16} />
                            Cerrar Sesión
                        </button>
                    </div>
                )}
            </aside>

            {/* ── Contenido principal ── */}
            <div className="flex-1 flex flex-col min-w-0">
                <main className="flex-1 pb-24 lg:pb-6">
                    {children}
                </main>
            </div>

            {/* ── Bottom bar mobile ── */}
            <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-xl border-t border-border/50 flex items-center justify-around px-1 py-1">
                {navItems.map(({ href, label, icon: Icon }) => {
                    const isActive = pathname === href
                    return (
                        <Link
                            key={href}
                            href={href}
                            className={`flex flex-col items-center gap-0.5 px-2.5 py-2 rounded-xl transition-all min-w-[48px] ${isActive ? 'text-primary' : 'text-muted-foreground'
                                }`}
                        >
                            <Icon size={22} strokeWidth={isActive ? 2.5 : 1.8} />
                            <span className={`text-[10px] font-medium ${isActive ? 'text-primary' : ''}`}>
                                {label}
                            </span>
                        </Link>
                    )
                })}
                {/* Botón de perfil en mobile */}
                <button
                    onClick={handleLogout}
                    className="flex flex-col items-center gap-0.5 px-2.5 py-2 rounded-xl text-muted-foreground min-w-[48px]"
                >
                    <User size={22} strokeWidth={1.8} />
                    <span className="text-[10px] font-medium">Salir</span>
                </button>
            </nav>
        </div>
    )
}
