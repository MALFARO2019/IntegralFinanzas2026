"use client"

import { Wallet, TrendingUp, Calendar, AlertCircle } from 'lucide-react'
import { SettingsSelector } from '@/components/settings-selector'
import { usePreferences } from '@/lib/preferences-context'

interface DashboardClientProps {
    testUsers: number;
}

export default function DashboardClient({ testUsers }: DashboardClientProps) {
    const { formatMoney } = usePreferences()

    // Datos mock usando formato de la moneda y el locale
    const netWorth = 1500000;
    const mesIngresos = 650000;
    const mesBills = 180000;
    const mesMetas = 70000;
    const libre = mesIngresos - mesBills - mesMetas;

    return (
        <main className="flex min-h-screen flex-col items-center p-4 lg:p-10 relative">

            {/* Botón flotante para Opciones en la esquina */}
            <div className="absolute top-4 right-4">
                <SettingsSelector />
            </div>

            {/* Header Central Minimalista (Bluecoins Style) */}
            <header className="w-full max-w-md pt-8 pb-12 flex flex-col items-center">
                <h2 className="text-muted-foreground text-sm uppercase tracking-widest font-semibold mb-2">Net Worth</h2>
                <h1 className="text-5xl font-extrabold tracking-tighter shadow-sm blur-[0.3px]">{formatMoney(netWorth)}</h1>
                <div className="flex items-center gap-1 mt-3 px-3 py-1 bg-accent/20 text-accent rounded-full text-xs font-semibold">
                    <TrendingUp size={14} /> +2.5% este mes
                </div>
                <div className="mt-2 text-xs text-muted-foreground">
                    Usuarios en BDD Registrados: <span className="text-primary font-bold">{testUsers}</span>
                </div>
            </header>

            <section className="w-full max-w-md space-y-4">

                {/* Card: Spending Plan (Simplifi Style) */}
                <div className="w-full bg-card border border-border/50 rounded-2xl p-5 shadow-lg shadow-black/10 transition hover:shadow-primary/5">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold flex items-center gap-2"><Wallet size={18} className="text-primary" /> Spending Plan</h3>
                    </div>
                    <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Ingresos (Mes)</span>
                            <span>{formatMoney(mesIngresos)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Suscripciones & Bills</span>
                            <span className="text-destructive">-{formatMoney(mesBills)}</span>
                        </div>
                        <div className="flex justify-between text-sm border-b border-border/50 pb-2">
                            <span className="text-muted-foreground">Metas (Targets)</span>
                            <span className="text-destructive">-{formatMoney(mesMetas)}</span>
                        </div>
                        <div className="flex justify-between items-end pt-2">
                            <span className="text-sm font-semibold opacity-90">Libre para Gastar</span>
                            <span className="text-2xl font-black text-accent">{formatMoney(libre)}</span>
                        </div>

                        {/* ProgressBar Visual */}
                        <div className="w-full h-3 bg-secondary rounded-full mt-2 overflow-hidden flex">
                            <div className="h-full bg-primary" style={{ width: '40%' }}></div>
                            <div className="h-full bg-destructive/80" style={{ width: '20%' }}></div>
                        </div>
                    </div>
                </div>

                {/* Card: Próximos Eventos (Monarch Style) */}
                <div className="w-full bg-card border border-border/50 rounded-2xl p-5">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold flex items-center gap-2"><Calendar size={18} className="text-primary" /> Próximos Pagos</h3>
                    </div>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center bg-secondary/30 p-3 rounded-lg">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded bg-background flex items-center justify-center font-bold text-xs">NX</div>
                                <div className="flex flex-col">
                                    <span className="text-sm font-semibold">Netflix</span>
                                    <span className="text-xs text-muted-foreground">Mañana</span>
                                </div>
                            </div>
                            <span className="font-semibold text-sm">{formatMoney(8900)}</span>
                        </div>
                    </div>
                </div>

            </section>

            {/* FAB Botón de Agregar Rápido */}
            <button className="fixed bottom-8 right-8 w-16 h-16 bg-primary text-primary-foreground rounded-full shadow-[0_0_30px_rgba(var(--primary),0.5)] flex items-center justify-center hover:scale-105 active:scale-95 transition-all">
                <span className="text-3xl mb-1">+</span>
            </button>

        </main>
    )
}
