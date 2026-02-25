"use client"

import { useState } from 'react'
import { Wallet, TrendingUp, Calendar, CreditCard, PiggyBank, Banknote, Plus, ArrowRight } from 'lucide-react'
import { SettingsSelector } from '@/components/settings-selector'
import { usePreferences } from '@/lib/preferences-context'
import { AddTxnModal } from '@/components/add-txn-modal'
import Link from 'next/link'

interface DashboardClientProps {
    dbUserCount: number
}

export default function DashboardClient({ dbUserCount: _ }: DashboardClientProps) {
    const { formatMoney } = usePreferences()
    const [showModal, setShowModal] = useState(false)

    const netWorth = 1_500_000
    const mesIngresos = 650_000
    const mesBills = 180_000
    const mesMetas = 70_000
    const libre = mesIngresos - mesBills - mesMetas

    const budgetUsedPct = Math.round((mesBills + mesMetas) / mesIngresos * 100)
    const freePct = 100 - budgetUsedPct

    const accounts = [
        { label: 'Efectivo / Corriente', icon: Banknote, amount: 820_000, color: 'text-accent' },
        { label: 'Tarjeta de Crédito', icon: CreditCard, amount: -220_000, color: 'text-destructive' },
        { label: 'Ahorros / Metas', icon: PiggyBank, amount: 900_000, color: 'text-primary' },
    ]

    return (
        <div className="flex flex-col min-h-screen pb-24 lg:pb-0">

            {/* Header */}
            <div className="sticky top-0 z-30 bg-background/90 backdrop-blur-lg border-b border-border/50 px-4 pt-4 pb-3 flex items-center justify-between">
                <div>
                    <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Hola 👋</p>
                    <h1 className="text-lg font-extrabold">Tu Resumen Financiero</h1>
                </div>
                <SettingsSelector />
            </div>

            <div className="px-4 py-4 space-y-4">

                {/* ─── Net Worth Card ─── */}
                <div className="bg-gradient-to-br from-primary/20 via-card to-card border border-primary/20 rounded-2xl p-5 text-center">
                    <p className="text-xs text-muted-foreground font-semibold uppercase tracking-widest mb-1">NET WORTH</p>
                    <h2 className="text-4xl font-black tracking-tight">{formatMoney(netWorth)}</h2>
                    <div className="inline-flex items-center gap-1 mt-2 px-3 py-1 bg-accent/15 text-accent rounded-full text-xs font-semibold">
                        <TrendingUp size={13} /> +2.5% este mes
                    </div>
                </div>

                {/* ─── Spending Plan Card ─── */}
                <div className="bg-card border border-border/40 rounded-2xl p-5">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold flex items-center gap-2">
                            <Wallet size={16} className="text-primary" /> Spending Plan
                        </h3>
                        <Link href="/transactions" className="text-xs text-primary font-semibold flex items-center gap-0.5 hover:underline">
                            Ver todo <ArrowRight size={12} />
                        </Link>
                    </div>

                    <div className="space-y-2.5">
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Ingresos</span>
                            <span className="font-semibold text-accent">+{formatMoney(mesIngresos)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Bills & Suscripciones</span>
                            <span className="text-destructive">-{formatMoney(mesBills)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Metas (Targets)</span>
                            <span className="text-destructive">-{formatMoney(mesMetas)}</span>
                        </div>
                        <div className="flex justify-between items-center pt-2 border-t border-border/40">
                            <span className="text-sm font-semibold">Libre para Gastar</span>
                            <span className="text-xl font-black text-accent">{formatMoney(libre)}</span>
                        </div>
                    </div>

                    {/* Barra de progreso mejorada */}
                    <div className="mt-3 space-y-1">
                        <div className="w-full h-2.5 bg-secondary rounded-full overflow-hidden flex gap-0.5">
                            <div className="h-full bg-destructive/80 rounded-full transition-all" style={{ width: `${Math.round(mesBills / mesIngresos * 100)}%` }} />
                            <div className="h-full bg-destructive/40 rounded-full transition-all" style={{ width: `${Math.round(mesMetas / mesIngresos * 100)}%` }} />
                            <div className="h-full bg-accent/60 rounded-full flex-1 transition-all" />
                        </div>
                        <div className="flex justify-between text-[10px] text-muted-foreground">
                            <span>Comprometido {budgetUsedPct}%</span>
                            <span className="text-accent font-semibold">Libre {freePct}%</span>
                        </div>
                    </div>
                </div>

                {/* ─── Cuentas Card ─── */}
                <div className="bg-card border border-border/40 rounded-2xl p-5">
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="font-bold flex items-center gap-2">
                            <Banknote size={16} className="text-primary" /> Mis Cuentas
                        </h3>
                    </div>
                    <div className="space-y-2">
                        {accounts.map(acc => (
                            <div key={acc.label} className="flex items-center gap-3 py-1.5">
                                <div className="w-8 h-8 rounded-xl bg-secondary/60 flex items-center justify-center shrink-0">
                                    <acc.icon size={16} className={acc.color} />
                                </div>
                                <span className="text-sm text-muted-foreground flex-1">{acc.label}</span>
                                <span className={`text-sm font-bold ${acc.color}`}>{formatMoney(acc.amount)}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ─── Próximos Pagos ─── */}
                <div className="bg-card border border-border/40 rounded-2xl p-5">
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="font-bold flex items-center gap-2">
                            <Calendar size={16} className="text-primary" /> Próximos Pagos
                        </h3>
                        <Link href="/calendar" className="text-xs text-primary font-semibold flex items-center gap-0.5 hover:underline">
                            Ver todo <ArrowRight size={12} />
                        </Link>
                    </div>
                    <div className="space-y-2">
                        {[
                            { name: 'Netflix', days: 1, amount: 8_900 },
                            { name: 'Spotify', days: 1, amount: 4_000 },
                            { name: 'Alquiler', days: 12, amount: 180_000 },
                        ].map(item => (
                            <div key={item.name} className="flex items-center gap-3">
                                <div className={`w-8 text-center shrink-0 rounded-lg py-1 text-xs font-extrabold ${item.days <= 3 ? 'bg-destructive/15 text-destructive' : 'bg-secondary text-muted-foreground'}`}>
                                    {item.days}d
                                </div>
                                <span className="flex-1 text-sm">{item.name}</span>
                                <span className="text-sm font-semibold text-destructive">-{formatMoney(item.amount)}</span>
                            </div>
                        ))}
                    </div>
                </div>

            </div>

            {/* FAB */}
            <button
                onClick={() => setShowModal(true)}
                className="fixed bottom-24 lg:bottom-8 right-6 w-14 h-14 bg-primary text-primary-foreground rounded-2xl shadow-lg shadow-primary/30 flex items-center justify-center hover:scale-105 active:scale-95 transition-all z-40"
            >
                <Plus size={26} />
            </button>

            <AddTxnModal open={showModal} onClose={() => setShowModal(false)} />
        </div>
    )
}
