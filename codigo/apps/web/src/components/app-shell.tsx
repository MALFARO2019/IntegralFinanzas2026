"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, ArrowLeftRight, CalendarDays, Wallet, Settings } from 'lucide-react'

const navItems = [
    { href: '/', label: 'Inicio', icon: LayoutDashboard },
    { href: '/transactions', label: 'Movimientos', icon: ArrowLeftRight },
    { href: '/calendar', label: 'Calendario', icon: CalendarDays },
    { href: '/accounts', label: 'Cuentas', icon: Wallet },
    { href: '/settings', label: 'Ajustes', icon: Settings },
]

export function AppShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()

    return (
        <div className="flex min-h-screen bg-background">

            {/* ── Sidebar desktop (lg+) ── */}
            <aside className="hidden lg:flex flex-col w-60 border-r border-border/50 bg-card/60 backdrop-blur-lg shrink-0 sticky top-0 h-screen">
                {/* Logo / Brand */}
                <div className="px-6 py-6 border-b border-border/50">
                    <span className="text-lg font-extrabold tracking-tight text-foreground">
                        <span className="text-primary">Integral</span> Finanzas
                    </span>
                    <p className="text-xs text-muted-foreground mt-0.5">2026</p>
                </div>

                {/* Nav Links */}
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
            </aside>

            {/* ── Contenido principal ── */}
            <div className="flex-1 flex flex-col min-w-0">
                <main className="flex-1 pb-24 lg:pb-6">
                    {children}
                </main>
            </div>

            {/* ── Bottom bar mobile (< lg) ── */}
            <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-xl border-t border-border/50 flex items-center justify-around px-2 py-1 safe-area-pb">
                {navItems.map(({ href, label, icon: Icon }) => {
                    const isActive = pathname === href
                    return (
                        <Link
                            key={href}
                            href={href}
                            className={`flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl transition-all min-w-[52px] ${isActive ? 'text-primary' : 'text-muted-foreground'
                                }`}
                        >
                            <Icon size={22} strokeWidth={isActive ? 2.5 : 1.8} />
                            <span className={`text-[10px] font-medium ${isActive ? 'text-primary' : ''}`}>
                                {label}
                            </span>
                        </Link>
                    )
                })}
            </nav>
        </div>
    )
}
